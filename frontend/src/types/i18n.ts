import { SupportedLanguage } from "./api";
import { ThemeId } from "./themes";

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
  direction: "ltr" | "rtl";
  defaultTheme: ThemeId;
  description: string;
  region: string;
}

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    subtagline: string;
  };
  nav: {
    home: string;
    upload: string;
    dashboard: string;
    features: string;
    settings: string;
    selectLanguage: string;
    selectTheme: string;
    demoMode: string;
    mockBadge: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    featureBullet1: string;
    featureBullet2: string;
    featureBullet3: string;
    featureBullet4: string;
  };
  upload: {
    heading: string;
    subheading: string;
    dropzoneTitle: string;
    dropzoneSubtitle: string;
    cameraButton: string;
    selectedFile: string;
    change: string;
    remove: string;
    categoryLabel: string;
    languageLabel: string;
    analyzeButton: string;
    analyzing: string;
    analyzingStep1: string;
    analyzingStep2: string;
    analyzingStep3: string;
    analyzingStep4: string;
    errorTooLarge: string;
    errorInvalidType: string;
    quickDemoNotice: string;
  };
  results: {
    title: string;
    subtitle: string;
    mockDemoAlert: string;
    docType: string;
    simpleSummary: string;
    keyPoints: string;
    importantDates: string;
    feesAndAmounts: string;
    eligibility: string;
    requiredDocs: string;
    missingInfo: string;
    cautionNotes: string;
    actionChecklist: string;
    daysLeft: string;
    urgentBadge: string;
    mandatory: string;
    optional: string;
    downloadMarkdown: string;
    shareWhatsApp: string;
  };
  checklist: {
    heading: string;
    subheading: string;
    completed: string;
    pending: string;
    progress: string;
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
    sourceText: string;
    deadline: string;
    noDeadline: string;
    reset: string;
    copy: string;
    copiedSuccess: string;
    allTasksCompleted: string;
    emptyTasks: string;
  };
  audio: {
    heading: string;
    play: string;
    pause: string;
    resume: string;
    stop: string;
    speed: string;
    statusPlaying: string;
    statusPaused: string;
    statusStopped: string;
    voiceUnsupported: string;
  };
  chat: {
    heading: string;
    subheading: string;
    placeholder: string;
    send: string;
    asking: string;
    suggestedQuestions: string;
    groundedNotice: string;
    emptyChat: string;
    sourceReference: string;
    confidence: string;
  };
  dashboard: {
    welcome: string;
    greeting: string;
    uploadNew: string;
    recentDocs: string;
    emptyRecentTitle: string;
    emptyRecentDesc: string;
    viewSample: string;
    totalProcessed: string;
    tasksPending: string;
  };
  settings: {
    title: string;
    languageHeading: string;
    themeHeading: string;
    motionHeading: string;
    motionReduced: string;
    motionStandard: string;
    themePreview: string;
    applyTheme: string;
    appInfo: string;
    version: string;
    teamTitle: string;
    yashRole: string;
    sheetalRole: string;
    surbhiRole: string;
  };
  common: {
    close: string;
    cancel: string;
    confirm: string;
    back: string;
    retry: string;
    loading: string;
    success: string;
    error: string;
  };
}
