export type DocumentCategory = 
  | 'college' 
  | 'scholarship' 
  | 'government' 
  | 'job' 
  | 'other';

export type ExplanationLanguage = 'hindi' | 'english' | 'hinglish';

export type UILanguage = 'en' | 'hi';

export interface ImportantDate {
  title: string;
  date: string;
  badge?: string;
  status: 'urgent' | 'active' | 'future';
  daysLeft?: number;
}

export interface EligibilityCriterion {
  field: string;
  requirement: string;
  highlight?: string;
}

export interface FinancialDetail {
  category: string;
  amount: string;
  details?: string;
}

export interface RequiredDocument {
  name: string;
  mandatory: boolean;
  notes?: string;
}

export interface NextStepAction {
  id: string;
  step: number;
  title: string;
  description: string;
  actionUrl?: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
}

export interface DocumentAnalysis {
  id: string;
  title: string;
  category: DocumentCategory;
  language: ExplanationLanguage;
  isDemo: boolean;
  tagline: string;
  officialSource?: string;
  portalUrl?: string;
  simpleSummary: string[];
  keyHighlight: string;
  importantDates: ImportantDate[];
  eligibility: EligibilityCriterion[];
  financials: {
    overview: string;
    items: FinancialDetail[];
    importantNote?: string;
  };
  requiredDocuments: RequiredDocument[];
  nextSteps: NextStepAction[];
  audioScript: string;
  faq: QAItem[];
  unclearOrMissingInfo?: string[];
  warnings?: string[];
}

export interface SamplePreset {
  id: string;
  title: string;
  shortDesc: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'image';
  previewBadge: string;
  previewSnippet: string;
  analyses: Record<ExplanationLanguage, DocumentAnalysis>;
}
