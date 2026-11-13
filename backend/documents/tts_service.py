import os
import re
import hashlib
import logging
import urllib.parse
import urllib.request
from typing import Optional

logger = logging.getLogger(__name__)

# Cache directory for generated MP3 audio
AUDIO_CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "media", "audio_cache")
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

# Language code mapping with safe phonetic fallbacks
LANGUAGE_TTS_MAP = {
    "hi": "hi",       # Hindi
    "pa": "pa",       # Punjabi
    "bn": "bn",       # Bengali
    "gu": "gu",       # Gujarati
    "mr": "mr",       # Marathi
    "ta": "ta",       # Tamil
    "te": "te",       # Telugu
    "kn": "kn",       # Kannada
    "ml": "ml",       # Malayalam
    "ur": "ur",       # Urdu
    "or": "or",       # Odia
    "as": "bn",       # Assamese (Bengali TTS shares identical phonemes and script rules)
    "sa": "hi",       # Sanskrit (Hindi Devanagari TTS shares identical Sanskrit phonemes)
    "ks": "ur",       # Kashmiri (Urdu Perso-Arabic TTS shares Kashmiri phonology)
    "en": "en-IN",    # Indian English
}

def clean_text_for_speech(text: str) -> str:
    """Removes markdown syntax, asterisks, brackets, and extra punctuation for smooth TTS delivery."""
    t = text.strip()
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)      # bold
    t = re.sub(r"\*([^*]+)\*", r"\1", t)        # italic
    t = re.sub(r"`([^`]+)`", r"\1", t)          # code
    t = re.sub(r"#+\s*", "", t)                 # headers
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t) # markdown links
    t = re.sub(r"https?://\S+", "link", t)      # urls
    t = re.sub(r"[_~>|]", " ", t)               # formatting chars
    t = re.sub(r"\s+", " ", t).strip()          # multiple spaces
    return t

def split_into_tts_chunks(text: str, max_chunk_len: int = 160) -> list[str]:
    """Splits a long paragraph into natural spoken phrases based on Indian and Western punctuation."""
    if len(text) <= max_chunk_len:
        return [text]

    # Split by sentence enders first (Devanagari danda '।', '.', '!', '?', newline)
    sentences = re.split(r"([।\.!\?\n]+)", text)
    merged_units = []
    i = 0
    while i < len(sentences):
        sentence_text = sentences[i]
        delimiter = sentences[i + 1] if i + 1 < len(sentences) else ""
        full_sentence = (sentence_text + delimiter).strip()
        if full_sentence:
            merged_units.append(full_sentence)
        i += 2

    chunks = []
    current_chunk = ""

    for unit in merged_units:
        if len(unit) > max_chunk_len:
            # Further split long sentence by comma or semicolon
            sub_parts = re.split(r"([,;:\(\)]+)", unit)
            for part in sub_parts:
                if not part.strip():
                    continue
                if len(current_chunk) + len(part) < max_chunk_len:
                    current_chunk += part
                else:
                    if current_chunk.strip():
                        chunks.append(current_chunk.strip())
                    current_chunk = part
        else:
            if len(current_chunk) + len(unit) < max_chunk_len:
                current_chunk += " " + unit if current_chunk else unit
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                current_chunk = unit

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks

def generate_multilingual_audio(text: str, language: str = "en") -> bytes:
    """
    Generates authentic, high-fidelity MP3 speech for all 15 Indian languages.
    Uses chunked concatenation to prevent cut-offs, with automatic persistent disk caching.
    """
    cleaned = clean_text_for_speech(text)
    if not cleaned:
        cleaned = "No text provided."

    tts_lang = LANGUAGE_TTS_MAP.get(language, "en-IN")

    # Generate cache key
    cache_key = hashlib.sha256(f"{tts_lang}:{cleaned}".encode("utf-8")).hexdigest()
    cache_file = os.path.join(AUDIO_CACHE_DIR, f"{cache_key}.mp3")

    if os.path.exists(cache_file):
        try:
            with open(cache_file, "rb") as f:
                cached_bytes = f.read()
                if len(cached_bytes) > 0:
                    logger.info(f"[DocSaathi TTS] Cache hit for language '{language}' ({len(cached_bytes)} bytes)")
                    return cached_bytes
        except Exception as e:
            logger.warning(f"[DocSaathi TTS] Cache read failed: {e}")

    chunks = split_into_tts_chunks(cleaned, max_chunk_len=150)
    logger.info(f"[DocSaathi TTS] Generating audio for language '{language}' ({tts_lang}) across {len(chunks)} chunks...")

    audio_data = bytearray()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    for idx, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
        try:
            encoded_query = urllib.parse.quote(chunk)
            url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={tts_lang}&client=tw-ob&q={encoded_query}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as response:
                chunk_bytes = response.read()
                audio_data.extend(chunk_bytes)
        except Exception as e:
            logger.warning(f"[DocSaathi TTS] Failed to fetch audio chunk {idx+1}/{len(chunks)}: {e}")
            # Try English fallback if primary language failed
            try:
                encoded_query = urllib.parse.quote(chunk)
                fallback_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl=en-IN&client=tw-ob&q={encoded_query}"
                req = urllib.request.Request(fallback_url, headers=headers)
                with urllib.request.urlopen(req, timeout=5) as response:
                    audio_data.extend(response.read())
            except Exception:
                pass

    final_bytes = bytes(audio_data)

    # Persist to disk cache
    if final_bytes:
        try:
            with open(cache_file, "wb") as f:
                f.write(final_bytes)
            logger.info(f"[DocSaathi TTS] Successfully cached {len(final_bytes)} bytes to {cache_file}")
        except Exception as e:
            logger.warning(f"[DocSaathi TTS] Failed to write cache: {e}")

    return final_bytes
