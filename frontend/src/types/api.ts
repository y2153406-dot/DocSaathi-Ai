export type SupportedLanguage =
  | "hi"
  | "bn"
  | "te"
  | "mr"
  | "ta"
  | "ur"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "or"
  | "as"
  | "ks"
  | "sa"
  | "en";

export type RegionThemeId =
  | "all-india"
  | "punjab"
  | "bengal"
  | "tamil-nadu"
  | "kerala"
  | "kashmir"
  | "rajasthan"
  | "gujarat"
  | "maharashtra"
  | "assam";

export type PriorityLevel = "high" | "medium" | "low";

export type DocumentCategory =
  | "scholarship"
  | "exam_notice"
  | "admission"
  | "hostel"
  | "fee_circular"
  | "legal"
  | "other"
  | string;

export interface ImportantDateItem {
  id?: string;
  event?: string;
  title?: string;
  date: string;
  isStrictDeadline?: boolean;
  daysLeft?: number;
  urgency?: "urgent" | "warning" | "normal" | string;
  note?: string;
}

export interface FeeOrAmountItem {
  id?: string;
  label?: string;
  category?: string;
  amount: string;
  details?: string;
}

export interface EligibilityItem {
  id?: string;
  criterion?: string;
  criteria?: string;
  requirement?: string;
  status?: "eligible" | "ineligible" | "attention_needed" | "unknown" | string;
  detail?: string;
}

export interface RequiredDocumentItem {
  id?: string;
  name: string;
  isMandatory?: boolean;
  mandatory?: boolean;
  notes?: string;
  details?: string;
}

export interface ActionChecklistItem {
  id: string;
  dbId?: string;
  task: string;
  taskEnglish?: string;
  description: string;
  descriptionEnglish?: string;
  deadline?: string | null;
  priority: PriorityLevel;
  category: string;
  sourceText?: string;
  completed?: boolean;
  isCompleted?: boolean;
  isPersonal?: boolean;
}

export interface AnalysisResponse {
  success: boolean;
  documentId: string;
  originalFilename?: string;
  fileHash?: string;
  fileSize?: number;
  modelUsed?: string;
  language: SupportedLanguage;
  region?: string;
  category?: string;
  status?: string;
  documentType: string;
  title?: string;
  titleEnglish?: string;
  simpleSummary: string;
  simpleSummaryEnglish?: string;
  keyPoints: string[];
  keyPointsEnglish?: string[];
  importantDates: ImportantDateItem[];
  feesAndAmounts: FeeOrAmountItem[];
  eligibility: EligibilityItem[];
  requiredDocuments: RequiredDocumentItem[];
  actionChecklist: ActionChecklistItem[];
  missingInformation: string[];
  cautionNotes: string[];
  audioScript?: string;
  chatHistory?: ChatMessage[];
  confidenceScore?: number;
  isMockDemo?: boolean;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string | null;
  };
}

export interface AskQuestionRequest {
  documentId: string;
  question: string;
  language: SupportedLanguage;
}

export interface AskQuestionResponse {
  success: boolean;
  id?: string;
  documentId: string;
  question: string;
  answer: string;
  answerEnglish?: string;
  sourceSnippet?: string;
  confidence?: "high" | "medium" | "low";
  isGrounded?: boolean;
  timestamp?: string;
  isMockDemo?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  question?: string;
  answer?: string;
  answerEnglish?: string;
  sourceSnippet?: string;
  confidence?: string;
  isGrounded?: boolean;
  timestamp: string;
}
