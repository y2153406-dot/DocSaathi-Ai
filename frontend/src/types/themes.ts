import { SupportedLanguage } from "./api";

export type ThemeId =
  | "editorial-english"
  | "jaali-hindi"
  | "stepwell-gujarati"
  | "warli-marathi"
  | "phulkari-punjabi"
  | "alpana-bengali"
  | "dravidian-tamil"
  | "kalamkari-telugu"
  | "hampi-kannada"
  | "kerala-malayalam"
  | "pattachitra-odia"
  | "gamusa-assamese"
  | "arches-urdu"
  | "floral-kashmiri"
  | "manuscript-sanskrit";

export interface ThemeColors {
  bgStart: string;
  bgEnd: string;
  surface: string;
  surfaceGlass: string;
  surfaceGlassActive: string;
  border: string;
  borderGlow: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  accentSoft: string;
  text: string;
  textMuted: string;
  textInverse: string;
  badgeBg: string;
  badgeText: string;
}

export interface ThemeMotif {
  name: string;
  description: string;
  patternType:
    | "jaali"
    | "stepwell"
    | "warli"
    | "phulkari"
    | "alpana"
    | "dravidian"
    | "kalamkari"
    | "hampi"
    | "botanical"
    | "pattachitra"
    | "gamusa"
    | "arch"
    | "arches"
    | "kerala"
    | "kashmiri"
    | "manuscript"
    | "editorial";
  svgMotifData?: string;
  opacity: number;
}

export interface FloatingArtifact {
  name: string;
  symbol: string;
  description: string;
  depthFactor: number;
  initialPos: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationDelay: number;
}

export interface ThemeArtwork3D {
  badge: string;
  monumentTitle: string;
  culturalStory: string;
  ambientGlowColor: string;
  image3D: string;
  fallbackImage3D?: string;
  floatingArtifacts: FloatingArtifact[];
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nativeName: string;
  region: string;
  associatedLanguage: SupportedLanguage;
  colors: ThemeColors;
  motif: ThemeMotif;
  artwork3D: ThemeArtwork3D;
  fontFamily: string;
  displayFont: string;
  borderRadius: string;
  tagline: string;
}
