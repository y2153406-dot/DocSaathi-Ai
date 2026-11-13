import { z } from "zod";

export const ImportantDateItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  daysLeft: z.number().optional(),
  urgency: z.enum(["urgent", "active", "future"]).optional(),
  note: z.string().optional(),
});

export const FeeOrAmountItemSchema = z.object({
  category: z.string(),
  amount: z.string(),
  details: z.string().optional(),
});

export const EligibilityItemSchema = z.object({
  criteria: z.string(),
  requirement: z.string(),
  status: z.enum(["mandatory", "preferred", "exempt"]).optional(),
});

export const RequiredDocumentItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  mandatory: z.boolean(),
  details: z.string().optional(),
});

export const ActionChecklistItemSchema = z.object({
  id: z.string(),
  task: z.string(),
  taskEnglish: z.string().optional(),
  description: z.string(),
  descriptionEnglish: z.string().optional(),
  deadline: z.string().nullable().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  category: z.string().default("General"),
  sourceText: z.string().optional(),
  completed: z.boolean().default(false),
});

export const AnalysisResponseSchema = z.object({
  success: z.boolean(),
  documentId: z.string(),
  originalFilename: z.string().optional(),
  fileHash: z.string().optional(),
  fileSize: z.number().optional(),
  modelUsed: z.string().optional(),
  language: z.string(),
  documentType: z.string(),
  title: z.string().optional(),
  simpleSummary: z.string(),
  simpleSummaryEnglish: z.string().optional(),
  keyPoints: z.array(z.string()).default([]),
  keyPointsEnglish: z.array(z.string()).default([]),
  importantDates: z.array(ImportantDateItemSchema).default([]),
  feesAndAmounts: z.array(FeeOrAmountItemSchema).default([]),
  eligibility: z.array(EligibilityItemSchema).default([]),
  requiredDocuments: z.array(RequiredDocumentItemSchema).default([]),
  actionChecklist: z.array(ActionChecklistItemSchema).default([]),
  missingInformation: z.array(z.string()).default([]),
  cautionNotes: z.array(z.string()).default([]),
  audioScript: z.string().optional(),
  isMockDemo: z.boolean().optional(),
});

export const AskQuestionResponseSchema = z.object({
  success: z.boolean(),
  documentId: z.string(),
  question: z.string(),
  answer: z.string(),
  answerEnglish: z.string().optional(),
  sourceSnippet: z.string().optional(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
  isMockDemo: z.boolean().optional(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.string().nullable().optional(),
  }),
});

export function validateAnalysisResponse(data: unknown) {
  return AnalysisResponseSchema.safeParse(data);
}

export function validateAskQuestionResponse(data: unknown) {
  return AskQuestionResponseSchema.safeParse(data);
}
