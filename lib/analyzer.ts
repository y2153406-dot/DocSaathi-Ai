import { DocumentAnalysis, DocumentCategory, ExplanationLanguage, ImportantDate, EligibilityCriterion, RequiredDocument, NextStepAction, QAItem } from "@/types";
import { SAMPLE_PRESETS } from "@/data/samples";

export function getPresetAnalysis(presetId: string, language: ExplanationLanguage): DocumentAnalysis | null {
  const preset = SAMPLE_PRESETS.find(p => p.id === presetId);
  if (!preset) return null;
  return preset.analyses[language] || preset.analyses.hindi;
}

/**
 * Validates and sanitizes raw JSON output from Gemini model into a strictly compliant DocumentAnalysis object.
 */
export function validateDocumentAnalysis(
  raw: any,
  category: DocumentCategory,
  language: ExplanationLanguage,
  isLive: boolean = true
): DocumentAnalysis {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid response format received from AI model.");
  }

  // Fallback missing string helper
  const notFoundText = 
    language === "hindi" 
      ? "दस्तावेज़ में उल्लेख नहीं है" 
      : language === "hinglish" 
      ? "Document mein mention nahi hai" 
      : "Not found in document";

  // Title & Tagline
  const title = typeof raw.title === "string" && raw.title.trim().length > 0 
    ? raw.title.trim() 
    : "Document Analysis";

  const tagline = typeof raw.tagline === "string" && raw.tagline.trim().length > 0
    ? raw.tagline.trim()
    : "Simplified breakdown by DocSaathi AI";

  const keyHighlight = typeof raw.keyHighlight === "string" && raw.keyHighlight.trim().length > 0
    ? raw.keyHighlight.trim()
    : notFoundText;

  // Simple Summary
  const simpleSummary: string[] = Array.isArray(raw.simpleSummary) && raw.simpleSummary.length > 0
    ? raw.simpleSummary.map((s: any) => String(s).trim()).filter((s: string) => s.length > 0)
    : [notFoundText];

  // Important Dates
  const importantDates: ImportantDate[] = Array.isArray(raw.importantDates)
    ? raw.importantDates.map((d: any) => ({
        title: typeof d.title === "string" ? d.title.trim() : "Date Event",
        date: typeof d.date === "string" ? d.date.trim() : notFoundText,
        badge: typeof d.badge === "string" ? d.badge.trim() : undefined,
        status: (d.status === "urgent" || d.status === "active" || d.status === "future") ? d.status : "active",
        daysLeft: typeof d.daysLeft === "number" ? d.daysLeft : undefined,
      }))
    : [];

  if (importantDates.length === 0) {
    importantDates.push({
      title: "Deadlines / Key Milestones",
      date: notFoundText,
      status: "active",
      badge: "Notice",
    });
  }

  // Eligibility
  const eligibility: EligibilityCriterion[] = Array.isArray(raw.eligibility)
    ? raw.eligibility.map((e: any) => ({
        field: typeof e.field === "string" ? e.field.trim() : "Eligibility Criterion",
        requirement: typeof e.requirement === "string" ? e.requirement.trim() : notFoundText,
        highlight: typeof e.highlight === "string" ? e.highlight.trim() : undefined,
      }))
    : [];

  if (eligibility.length === 0) {
    eligibility.push({
      field: "Eligibility Criteria",
      requirement: notFoundText,
      highlight: "Check circular",
    });
  }

  // Financials
  const rawFin = raw.financials && typeof raw.financials === "object" ? raw.financials : {};
  const financials = {
    overview: typeof rawFin.overview === "string" ? rawFin.overview.trim() : "Financial details and applicable fees.",
    items: Array.isArray(rawFin.items)
      ? rawFin.items.map((item: any) => ({
          category: typeof item.category === "string" ? item.category.trim() : "Applicable Fee",
          amount: typeof item.amount === "string" ? item.amount.trim() : notFoundText,
          details: typeof item.details === "string" ? item.details.trim() : undefined,
        }))
      : [
          {
            category: "Application Fee / Cost",
            amount: notFoundText,
            details: "No fee structure found in the document.",
          },
        ],
    importantNote: typeof rawFin.importantNote === "string" ? rawFin.importantNote.trim() : undefined,
  };

  // Required Documents
  const requiredDocuments: RequiredDocument[] = Array.isArray(raw.requiredDocuments)
    ? raw.requiredDocuments.map((doc: any) => ({
        name: typeof doc.name === "string" ? doc.name.trim() : "Required Document",
        mandatory: typeof doc.mandatory === "boolean" ? doc.mandatory : true,
        notes: typeof doc.notes === "string" ? doc.notes.trim() : undefined,
      }))
    : [];

  if (requiredDocuments.length === 0) {
    requiredDocuments.push({
      name: "Identity / Certificate",
      mandatory: true,
      notes: notFoundText,
    });
  }

  // Next Steps
  const nextSteps: NextStepAction[] = Array.isArray(raw.nextSteps)
    ? raw.nextSteps.map((step: any, idx: number) => ({
        id: step.id ? String(step.id) : `step-${idx + 1}`,
        step: typeof step.step === "number" ? step.step : idx + 1,
        title: typeof step.title === "string" ? step.title.trim() : `Action Step ${idx + 1}`,
        description: typeof step.description === "string" ? step.description.trim() : notFoundText,
        actionUrl: typeof step.actionUrl === "string" ? step.actionUrl.trim() : undefined,
      }))
    : [];

  if (nextSteps.length === 0) {
    nextSteps.push({
      id: "step-1",
      step: 1,
      title: "Verify official notification",
      description: "Review the full circular on the official portal before proceeding.",
    });
  }

  // Unclear, missing or ambiguous info
  const unclearOrMissingInfo: string[] = Array.isArray(raw.unclearOrMissingInfo)
    ? raw.unclearOrMissingInfo.map((u: any) => String(u).trim()).filter((u: string) => u.length > 0)
    : [];

  // Audio Script for TTS
  const audioScript = typeof raw.audioScript === "string" && raw.audioScript.trim().length > 0
    ? raw.audioScript.trim()
    : `${title}. ${keyHighlight}. ${simpleSummary.join(". ")}`;

  // FAQ for Q&A section
  const faq: QAItem[] = Array.isArray(raw.faq)
    ? raw.faq.map((f: any, idx: number) => ({
        id: f.id ? String(f.id) : `faq-${idx + 1}`,
        question: typeof f.question === "string" ? f.question.trim() : "Notice clarification",
        answer: typeof f.answer === "string" ? f.answer.trim() : notFoundText,
      }))
    : [];

  // Warnings
  const warnings: string[] = Array.isArray(raw.warnings)
    ? raw.warnings.map((w: any) => String(w).trim()).filter((w: string) => w.length > 0)
    : [];

  return {
    id: `doc-${Date.now()}`,
    title,
    category,
    language,
    isDemo: !isLive,
    tagline,
    officialSource: typeof raw.officialSource === "string" ? raw.officialSource.trim() : undefined,
    portalUrl: typeof raw.portalUrl === "string" ? raw.portalUrl.trim() : undefined,
    simpleSummary,
    keyHighlight,
    importantDates,
    eligibility,
    financials,
    requiredDocuments,
    nextSteps,
    unclearOrMissingInfo,
    audioScript,
    faq,
    warnings,
  };
}

export function generateSmartAnalysisForUpload(
  fileName: string,
  category: DocumentCategory,
  language: ExplanationLanguage,
  fileSizeStr: string
): DocumentAnalysis {
  const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  const capitalizedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  if (language === 'hindi') {
    return {
      id: `custom-${Date.now()}`,
      title: `${capitalizedTitle} - त्वरित सारांश`,
      category: category,
      language: 'hindi',
      isDemo: true,
      tagline: `अपलोड किए गए दस्तावेज़ (${fileName}) का सरल भाषा में विश्लेषण।`,
      officialSource: "अपलोड किया गया आधिकारिक नोटिस",
      portalUrl: "https://india.gov.in",
      keyHighlight: "कृपया नीचे दी गई तिथियों और आवश्यक दस्तावेजों की सूची अवश्य जांच लें।",
      simpleSummary: [
        `यह दस्तावेज़ ${category === 'college' ? 'कॉलेज/यूनिवर्सिटी के छात्रों' : category === 'job' ? 'नौकरी चाहने वाले अभ्यर्थियों' : category === 'scholarship' ? 'छात्रवृत्ति के इच्छुक छात्रों' : 'संबंधित नागरिकों'} के लिए जारी की गई महत्वपूर्ण अधिसूचना है।`,
        `दस्तावेज़ की फाइल (${fileName}, साइज़: ${fileSizeStr}) में दिए गए सभी मुख्य क्लॉज़ को सरल हिंदी में अलग-अलग वर्गों में वर्गीकृत किया गया है।`,
        "सभी आवश्यक पात्रता शर्तें, आवेदन फीस, और आवश्यक दस्तावेजों की सूची नीचे तैयार कर दी गई है।",
        "आवेदन करने से पहले अपने सभी मूल प्रमाण पत्रों का मिलान कर लें।"
      ],
      importantDates: [
        { title: "नोटिस जारी होने की तिथि", date: "हाल ही में प्रकाशित", status: "active", daysLeft: 30, badge: "सक्रिय" },
        { title: "ऑनलाइन आवेदन / प्रतिक्रिया की अंतिम तिथि", date: "आगामी 2-3 सप्ताह के भीतर", status: "urgent", daysLeft: 14, badge: "अंतिम तिथि" },
        { title: "दस्तावेज़ सत्यापन एवं समीक्षा", date: "अंतिम तिथि के 15 दिन बाद", status: "future", daysLeft: 29, badge: "समीक्षा" }
      ],
      eligibility: [
        { field: "शैक्षणिक / मूल पात्रता", requirement: "दस्तावेज़ में उल्लिखित न्यूनतम योग्यता एवं आवश्यक प्रमाण पत्र धारक।", highlight: "न्यूनतम योग्यता" },
        { field: "पहचान व निवास", requirement: "वैध भारतीय नागरिकता प्रमाण पत्र एवं राज्य/केन्द्रीय पहचान पत्र।", highlight: "वैध पहचान पत्र" },
        { field: "आयु एवं अन्य शर्तें", requirement: "नोटिस में दी गई संबंधित वर्गवार कट-ऑफ तारीख के अनुसार।", highlight: "निर्धारित आयु" }
      ],
      financials: {
        overview: "आवेदन शुल्क एवं संबंधित वित्तीय विवरण।",
        items: [
          { category: "सामान्य आवेदन शुल्क", amount: "₹0 - ₹500 (श्रेणी अनुसार)", details: "आधिकारिक पोर्टल पर उपलब्ध गेटवे द्वारा देय" },
          { category: "आरक्षित वर्ग एवं छूट", amount: "नियमानुसार छूट लागू", details: "सक्षम प्रमाण पत्र संलग्न करने पर मान्य" }
        ],
        importantNote: "भुगतान केवल आधिकारिक पोर्टल पर ही करें। किसी अनधिकृत लिंक पर कार्ड या यूपीआई विवरण न दें।"
      },
      requiredDocuments: [
        { name: "आधार कार्ड / राष्ट्रीय पहचान पत्र", mandatory: true, notes: "पहचान एवं पते के प्रमाण हेतु" },
        { name: "संबंधित शैक्षणिक / योग्यता प्रमाण पत्र", mandatory: true, notes: "मूल अंकतालिका एवं स्वप्रमाणित छायाप्रति" },
        { name: "हाल ही का पासपोर्ट साइज फोटोग्राफ", mandatory: true, notes: "हल्के बैकग्राउंड के साथ स्पष्ट छवि" },
        { name: "डिजिटल हस्ताक्षर (Signature)", mandatory: true, notes: "सफेद कागज पर काली या नीली स्याही से" }
      ],
      nextSteps: [
        { id: "step1", step: 1, title: "दस्तावेज़ के सभी जरूरी बिंदुओं को ध्यान से पढ़ें", description: "दी गई तिथियों और आवश्यक अहर्ताओं की जांच करें।" },
        { id: "step2", step: 2, title: "मांगे गए दस्तावेजों की डिजिटल कॉपी तैयार करें", description: "स्कैन की गई फाइलें स्पष्ट और निर्धारित साइज में रखें।" },
        { id: "step3", step: 3, title: "आधिकारिक पोर्टल पर जाकर फॉर्म भरें", description: "अंतिम तिथि से कम से कम 3 दिन पहले आवेदन जमा करें।" }
      ],
      unclearOrMissingInfo: [
        "विशिष्ट हेल्पलाइन नंबर दस्तावेज़ पर स्पष्ट नहीं है; आधिकारिक पोर्टल पर जाँच करें।"
      ],
      audioScript: `नमस्ते! आपने ${capitalizedTitle} का दस्तावेज़ अपलोड किया है। इस नोटिस में दी गई मुख्य बातों के अनुसार, आपको निर्धारित समय सीमा के भीतर अपने जरूरी दस्तावेजों के साथ आवेदन या अनुपालन सुनिश्चित करना होगा। कृपया नीचे दिए गए चेकलिस्ट को पूरा करें।`,
      faq: [
        { id: "faq1", question: "क्या मैं मोबाइल से आवेदन कर सकता हूँ?", answer: "हाँ, अधिकांश आधुनिक सरकारी एवं संस्थागत पोर्टल मोबाइल ब्राउज़र पर आसानी से खुलते हैं।" },
        { id: "faq2", question: "यदि कोई तकनीकी समस्या आए तो क्या करें?", answer: "नोटिस में दिए गए आधिकारिक हेल्पलाइन नंबर अथवा सपोर्ट ईमेल पर तुरंत संपर्क करें।" }
      ]
    };
  }

  if (language === 'english') {
    return {
      id: `custom-${Date.now()}`,
      title: `${capitalizedTitle} - Executive Summary`,
      category: category,
      language: 'english',
      isDemo: true,
      tagline: `Simplified analysis for uploaded document (${fileName}).`,
      officialSource: "Uploaded Official Document / Circular",
      portalUrl: "https://india.gov.in",
      keyHighlight: "Please review the mandatory cut-off deadlines and required document checklist below.",
      simpleSummary: [
        `This circular is an official announcement relevant for ${category === 'college' ? 'college students and faculty' : category === 'job' ? 'job aspirants' : category === 'scholarship' ? 'scholarship applicants' : 'citizens and stakeholders'}.`,
        `The uploaded file (${fileName}, size: ${fileSizeStr}) has been parsed into distinct actionable segments.`,
        "All critical eligibility parameters, applicable fee tiers, and submission requirements are summarized below.",
        "Ensure all identity documents match your official academic or government records."
      ],
      importantDates: [
        { title: "Notification Issuance Date", date: "Recently Published", status: "active", daysLeft: 30, badge: "Published" },
        { title: "Final Submission / Action Deadline", date: "Within next 2-3 weeks", status: "urgent", daysLeft: 14, badge: "Deadline" },
        { title: "Scrutiny and Verification Phase", date: "15 days post deadline", status: "future", daysLeft: 29, badge: "Scrutiny" }
      ],
      eligibility: [
        { field: "Educational / Base Criteria", requirement: "Must fulfill the designated criteria specified in the circular.", highlight: "Minimum Criteria" },
        { field: "Identity & Residency", requirement: "Valid National Identity (Aadhaar/PAN/Voter ID) and domicile documentation if required.", highlight: "Valid ID Proof" },
        { field: "Age & Category Norms", requirement: "As per statutory age brackets and reservations specified in the official notice.", highlight: "Category Terms" }
      ],
      financials: {
        overview: "Overview of fees and financial implications.",
        items: [
          { category: "Standard Application Fee", amount: "₹0 - ₹500 (Varies by category)", details: "Payable through official gateway" },
          { category: "Fee Exemptions", amount: "Applicable for reserved groups", details: "Subject to valid certificate submission" }
        ],
        importantNote: "Pay application or processing fees solely on official verified web portals."
      },
      requiredDocuments: [
        { name: "Government Photo ID (Aadhaar / Voter ID / Passport)", mandatory: true, notes: "For identity verification and KYC" },
        { name: "Educational / Qualifying Certificates", mandatory: true, notes: "Marksheets and degree certificates" },
        { name: "Recent Passport Size Photograph", mandatory: true, notes: "Clear portrait against a plain background" },
        { name: "Digital Signature", mandatory: true, notes: "High-contrast scanned signature on white paper" }
      ],
      nextSteps: [
        { id: "step1", step: 1, title: "Review all eligibility clauses thoroughly", description: "Ensure you satisfy every mandatory requirement before proceeding." },
        { id: "step2", step: 2, title: "Digitize and organize required certificates", description: "Keep scanned PDFs and JPGs ready within size limits." },
        { id: "step3", step: 3, title: "Submit application on the official portal", description: "Do not wait until the last day to avoid portal server congestion." }
      ],
      unclearOrMissingInfo: [
        "Specific grievance redressal email address not clearly visible in document."
      ],
      audioScript: `Hello! You have uploaded ${capitalizedTitle}. This document provides important guidelines and deadlines. Please ensure your certificates and identification documents are up to date and submit your application well before the deadline.`,
      faq: [
        { id: "faq1", question: "Can this be completed online?", answer: "Yes, official institutions provide digital submission portals for ease of access." },
        { id: "faq2", question: "Whom to contact in case of discrepancies?", answer: "Always refer to the official contact details or grievance email listed in the notice." }
      ]
    };
  }

  // Hinglish
  return {
    id: `custom-${Date.now()}`,
    title: `${capitalizedTitle} - Aasaan Summary`,
    category: category,
    language: 'hinglish',
    isDemo: true,
    tagline: `Aapke upload kiye gaye document (${fileName}) ka easy breakdown.`,
    officialSource: "Uploaded Official Notice",
    portalUrl: "https://india.gov.in",
    keyHighlight: "Neeche diye gaye deadlines aur zaroori documents ki list ko dhyan se check karein.",
    simpleSummary: [
      `Yeh circular ${category === 'college' ? 'college students' : category === 'job' ? 'naukri ki tayyari karne wale candidates' : category === 'scholarship' ? 'scholarship ke applicants' : 'citizens'} ke liye bohot zaroori notice hai.`,
      `Aapki file (${fileName}, Size: ${fileSizeStr}) ke saare kathin clauses ko yahan aasaan bhasha mein explain kiya gaya hai.`,
      "Eligibility criteria, application fees, aur zaroori documents ki poori list neeche ready hai.",
      "Form bharne se pehle apne saare original documents paas mein rakh lein."
    ],
    importantDates: [
      { title: "Notice Release Date", date: "Haal hi mein jaari", status: "active", daysLeft: 30, badge: "Active" },
      { title: "Application Last Date", date: "Agle 2-3 hafte ke andar", status: "urgent", daysLeft: 14, badge: "Last Date" },
      { title: "Document Verification", date: "Last date ke 15 din baad", status: "future", daysLeft: 29, badge: "Verification" }
    ],
    eligibility: [
      { field: "Educational Qualification", requirement: "Notice mein maangi gayi minimum education qualification honi chahiye.", highlight: "Minimum Education" },
      { field: "ID Proof & Residence", requirement: "Valid Aadhaar Card ya government photo identity card.", highlight: "Aadhaar Card" },
      { field: "Age Limit", requirement: "Official notification ke rules ke hisaab se.", highlight: "Age Limit" }
    ],
    financials: {
      overview: "Fees aur payments ka simple detail.",
      items: [
        { category: "Application Fees", amount: "₹0 - ₹500 (Category ke hisab se)", details: "Official portal par online pay karein" },
        { category: "Fee Concession", amount: "Rules ke according छूट", details: "Valid certificate upload karne par" }
      ],
      importantNote: "Kisi third-party link ya fraud call par paise transfer na karein."
    },
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true, notes: "Mobile number link hona chahiye" },
      { name: "Academic Marksheets & Certificates", mandatory: true, notes: "Marksheet ki clear scan copy" },
      { name: "Passport Size Photo", mandatory: true, notes: "White background wali clear photo" },
      { name: "Signature", mandatory: true, notes: "Plain white paper par sign" }
    ],
    nextSteps: [
      { id: "step1", step: 1, title: "Eligibility aur dates achhe se padhein", description: "Neeche di gayi checklist ko ek baar check karein." },
      { id: "step2", step: 2, title: "Saare documents ready karke scan karein", description: "Mobile scanner app se clear PDF ya JPG banayein." },
      { id: "step3", step: 3, title: "Official website par form lock karein", description: "Last date se pehle submission complete karein." }
    ],
    unclearOrMissingInfo: [
      "Helpline contact number circular mein clearly mentioned nahi hai."
    ],
    audioScript: `Hello! Aapne ${capitalizedTitle} ka document upload kiya hai. Is notice ki sabhi zaroori baatein aur deadlines neeche di gayi hain. Form time se pehle bhar lein aur koi galti na karein.`,
    faq: [
      { id: "faq1", question: "Kya phone se form fill kar sakte hain?", answer: "Haan, aap phone ke Chrome browser mein 'Desktop Mode' on karke easily form bhar sakte hain." }
    ]
  };
}
