import { AnalysisResponse, AskQuestionResponse, SupportedLanguage } from "@/types/api";

export interface MockNoticePreset {
  id: string;
  title: string;
  category: "scholarship" | "job" | "college" | "government" | "other";
  documentType: string;
  fileName: string;
  fileSize: string;
  fileType: "pdf" | "jpg" | "png";
  sampleQuestion: string;
  data: Record<"en" | "hi", AnalysisResponse>;
  qnaPairs: Array<{ question: string; answer: string; snippet: string }>;
}

export const MOCK_NOTICES: MockNoticePreset[] = [
  {
    id: "nsp-scholarship-2026",
    title: "National Post-Matric Scholarship Scheme 2026-27",
    category: "scholarship",
    documentType: "Scholarship Notice & Guidelines",
    fileName: "NSP_PostMatric_Scholarship_2026.pdf",
    fileSize: "2.4 MB",
    fileType: "pdf",
    sampleQuestion: "What is the annual family income limit?",
    data: {
      en: {
        success: true,
        documentId: "mock-nsp-2026",
        language: "en",
        documentType: "Scholarship Scheme Notification",
        title: "National Post-Matric Scholarship Scheme 2026-27",
        simpleSummary:
          "This official notice announces financial scholarship assistance for higher secondary (Class 11 & 12), ITI, diploma, undergraduate, and postgraduate students. It covers maintenance allowances and full tuition fees up to ₹50,000 annually. Funds will be directly credited through Aadhaar-seeded bank accounts (DBT).",
        keyPoints: [
          "Covers tuition fees, study tours, and monthly maintenance allowance.",
          "Application is completely free on the National Scholarship Portal (scholarships.gov.in).",
          "Aadhaar-based biometric e-KYC and NPCI bank seeding are strictly mandatory.",
          "Annual family income from all sources must not exceed ₹2,50,000.",
        ],
        importantDates: [
          {
            id: "d1",
            title: "Online Application Portal Closes",
            date: "30 Nov 2026",
            daysLeft: 18,
            urgency: "urgent",
            note: "No extension will be granted beyond 11:59 PM.",
          },
          {
            id: "d2",
            title: "Institute Level Defective Verification Last Date",
            date: "15 Dec 2026",
            daysLeft: 33,
            urgency: "active",
            note: "Your college nodal officer must verify before this date.",
          },
          {
            id: "d3",
            title: "State Nodal Officer Approval",
            date: "10 Jan 2027",
            daysLeft: 59,
            urgency: "future",
            note: "Final merit list generation date.",
          },
        ],
        feesAndAmounts: [
          {
            category: "Portal Application Fee",
            amount: "₹0 (100% Free)",
            details: "No government fee. Do not pay any agent or cyber cafe extra charges.",
          },
          {
            category: "Day Scholar Maintenance Allowance",
            amount: "₹5,500 – ₹7,000 / year",
            details: "Depending on course level (Group 1 to Group 4).",
          },
          {
            category: "Hosteller Maintenance Allowance",
            amount: "₹12,000 – ₹13,500 / year",
            details: "Paid directly to verified hostel boarders.",
          },
          {
            category: "Non-refundable Compulsory Tuition Fees",
            amount: "Reimbursed up to ₹50,000",
            details: "As approved by State Fee Regulatory Committee.",
          },
        ],
        eligibility: [
          {
            criteria: "Academic Qualification",
            requirement: "Must have passed previous qualifying examination with minimum 50% marks.",
            status: "mandatory",
          },
          {
            criteria: "Family Income Cap",
            requirement: "Annual gross family income must be under ₹2,50,000 from all sources.",
            status: "mandatory",
          },
          {
            criteria: "Enrollment Status",
            requirement: "Must be enrolled in a recognised school, college, polytechnic, or university.",
            status: "mandatory",
          },
          {
            criteria: "Other Scholarships",
            requirement: "Candidate cannot hold any other concurrent Central/State scholarship.",
            status: "mandatory",
          },
        ],
        requiredDocuments: [
          {
            id: "rd1",
            name: "Aadhaar Card with linked Mobile Number",
            mandatory: true,
            details: "Required for OTP verification and biometric authentication.",
          },
          {
            id: "rd2",
            name: "Income Certificate issued on/after 1st April 2026",
            mandatory: true,
            details: "Must be issued by Tehsildar or Sub-Divisional Magistrate (SDM).",
          },
          {
            id: "rd3",
            name: "Caste / Category Certificate",
            mandatory: true,
            details: "Digital digitally signed certificate from competent state authority.",
          },
          {
            id: "rd4",
            name: "Active Bank Account Passbook (NPCI Mapped)",
            mandatory: true,
            details: "Account must not be a minor account or dormant.",
          },
          {
            id: "rd5",
            name: "Previous Year Marksheet & Fee Receipt",
            mandatory: true,
            details: "Original scanned copy bearing college stamp.",
          },
        ],
        actionChecklist: [
          {
            id: "act-1",
            task: "Verify Aadhaar-NPCI Bank Seeding Status",
            description: "Check on the NPCI portal or visit your bank branch to ensure Direct Benefit Transfer (DBT) is enabled.",
            deadline: "20 Nov 2026",
            priority: "high",
            category: "Prerequisite",
            sourceText: "Clause 3.2: Scholarship will strictly fail if bank account is not Aadhaar seeded.",
            completed: false,
          },
          {
            id: "act-2",
            task: "Obtain Fresh Income Certificate for FY 2026-27",
            description: "Apply at the local CSC center or Revenue Tehsil for current year income certification.",
            deadline: "25 Nov 2026",
            priority: "high",
            category: "Documentation",
            sourceText: "Clause 5(b): Certificates issued prior to 01-04-2026 will lead to immediate rejection.",
            completed: false,
          },
          {
            id: "act-3",
            task: "Submit OTR (One-Time Registration) on NSP Portal",
            description: "Complete facial authentication using the NSP Aadhaar FaceRD app on Android.",
            deadline: "28 Nov 2026",
            priority: "high",
            category: "Online Application",
            sourceText: "Clause 1.4: OTR reference number is compulsory before filling final scheme form.",
            completed: false,
          },
          {
            id: "act-4",
            task: "Submit Physical Application Printout to College Office",
            description: "Hand over the signed declaration and document copies to your College Nodal Officer.",
            deadline: "05 Dec 2026",
            priority: "medium",
            category: "Verification",
            sourceText: "Clause 7.1: College verification cannot proceed without physical scrutiny.",
            completed: false,
          },
        ],
        missingInformation: [
          "The exact disbursal month is not committed in this notification.",
          "Specific fee ceiling list for private un-aided medical colleges is attached in Annexure B (not enclosed).",
        ],
        cautionNotes: [
          "Anti-Fraud Alert: National Scholarship Portal does not ask for your ATM PIN, OTP, or CVV. Never share banking credentials.",
          "Double Claim Warning: Applying for both State and Central schemes will result in blacklisting from future awards.",
        ],
        audioScript:
          "Welcome to the audio briefing for National Post-Matric Scholarship 2026. This scheme provides up to ₹50,000 for tuition and maintenance. The final application deadline is 30th November 2026. Ensure your bank account is linked to Aadhaar through NPCI, and apply free on scholarships.gov.in.",
        isMockDemo: true,
      },
      hi: {
        success: true,
        documentId: "mock-nsp-2026",
        language: "hi",
        documentType: "छात्रवृत्ति योजना अधिसूचना",
        title: "राष्ट्रीय पोस्ट-मैट्रिक छात्रवृत्ति योजना 2026-27",
        simpleSummary:
          "यह आधिकारिक सूचना कक्षा 11वीं, 12वीं, आईटीआई, डिप्लोमा, स्नातक एवं स्नातकोत्तर के विद्यार्थियों के लिए आर्थिक छात्रवृत्ति सहायता की घोषणा करती है। इसमें शिक्षण शुल्क एवं मासिक भत्ते के रूप में अधिकतम ₹50,000 तक की सहायता सीधे आधार से जुड़े बैंक खाते (DBT) में दी जाएगी।",
        keyPoints: [
          "शिक्षण शुल्क और मासिक रख-रखाव भत्ते की पूरी प्रतिपूर्ति।",
          "नेशनल स्कॉलरशिप पोर्टल (scholarships.gov.in) पर आवेदन 100% निःशुल्क है।",
          "बैंक खाते में आधार लिंकिंग (NPCI Seeding) और बायोमेट्रिक ई-केवाईसी अनिवार्य है।",
          "परिवार की सभी स्रोतों से वार्षिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए।",
        ],
        importantDates: [
          {
            id: "d1",
            title: "ऑनलाइन आवेदन की अंतिम तिथि",
            date: "30 नवंबर 2026",
            daysLeft: 18,
            urgency: "urgent",
            note: "रात 11:59 बजे के बाद पोर्टल स्वतः बंद हो जाएगा।",
          },
          {
            id: "d2",
            title: "महाविद्यालय सत्यापन की अंतिम तिथि",
            date: "15 दिसंबर 2026",
            daysLeft: 33,
            urgency: "active",
            note: "कॉलेज नोडल अधिकारी द्वारा फॉर्म का सत्यापन अनिवार्य है।",
          },
          {
            id: "d3",
            title: "राज्य स्तरीय अंतिम मेरिट सूची",
            date: "10 जनवरी 2027",
            daysLeft: 59,
            urgency: "future",
            note: "अंतिम चयनित छात्रों के बैंक खाते में राशि हस्तांतरण की प्रक्रिया शुरू होगी।",
          },
        ],
        feesAndAmounts: [
          {
            category: "पोर्टल आवेदन शुल्क",
            amount: "₹0 (पूर्णतः निःशुल्क)",
            details: "सरकारी कोई शुल्क नहीं है। साइबर कैफे को केवल प्रिंटिंग चार्ज दें।",
          },
          {
            category: "डे-स्कॉलर भत्ता",
            amount: "₹5,500 – ₹7,000 / वर्ष",
            details: "पाठ्यक्रम श्रेणी के अनुसार मासिक किस्त।",
          },
          {
            category: "छात्रावास भत्ता (Hosteller)",
            amount: "₹12,000 – ₹13,500 / वर्ष",
            details: "सत्यापित हॉस्टल में रहने वाले छात्रों के लिए।",
          },
          {
            category: "गैर-वापसी योग्य शिक्षण शुल्क प्रतिपूर्ति",
            amount: "₹50,000 तक",
            details: "कॉलेज की वास्तविक रसीद के आधार पर।",
          },
        ],
        eligibility: [
          {
            criteria: "शैक्षणिक योग्यता",
            requirement: "पिछली कक्षा में न्यूनतम 50% अंक अनिवार्य।",
            status: "mandatory",
          },
          {
            criteria: "वार्षिक पारिवारिक आय",
            requirement: "समस्त स्रोतों से कुल आय ₹2,50,000 प्रति वर्ष से अधिक न हो।",
            status: "mandatory",
          },
          {
            criteria: "संस्थान की मान्यता",
            requirement: "मान्यता प्राप्त कॉलेज, विश्वविद्यालय या तकनीकी संस्थान में नियमित प्रवेश।",
            status: "mandatory",
          },
        ],
        requiredDocuments: [
          {
            id: "rd1",
            name: "आधार कार्ड (सक्रिय मोबाइल नंबर से जुड़ा हुआ)",
            mandatory: true,
            details: "ओटीपी और बायोमेट्रिक ई-केवाईसी के लिए।",
          },
          {
            id: "rd2",
            name: "नवीनतम आय प्रमाण पत्र (1 अप्रैल 2026 के बाद का)",
            mandatory: true,
            details: "तहसीलदार या सक्षम राजस्व अधिकारी द्वारा निर्गत।",
          },
          {
            id: "rd3",
            name: "जाति प्रमाण पत्र",
            mandatory: true,
            details: "डिजिटल रूप से हस्ताक्षरित प्रमाण पत्र।",
          },
          {
            id: "rd4",
            name: "बैंक पासबुक (NPCI आधार सीडेड खाता)",
            mandatory: true,
            details: "खाता सक्रिय होना चाहिए, नाबालिग खाता नहीं चलेगा।",
          },
          {
            id: "rd5",
            name: "गत वर्ष की अंकतालिका एवं शुल्क रसीद",
            mandatory: true,
            details: "कॉलेज की मुहर लगी मूल प्रति की स्कैन कॉपी।",
          },
        ],
        actionChecklist: [
          {
            id: "act-1",
            task: "बैंक खाते की NPCI आधार सीडिंग जांचें",
            description: "अपनी बैंक शाखा जाएं या NPCI पोर्टल पर चेक करें कि खाते में DBT सक्षम है या नहीं।",
            deadline: "20 नवंबर 2026",
            priority: "high",
            category: "प्रारंभिक शर्त",
            sourceText: "नियम 3.2: यदि खाता आधार से मैप नहीं होगा तो राशि जमा नहीं होगी।",
            completed: false,
          },
          {
            id: "act-2",
            task: "नया आय प्रमाण पत्र तैयार करवाएं",
            description: "तहसील या सीएससी केंद्र से चालू वित्तीय वर्ष का आय प्रमाण पत्र प्राप्त करें।",
            deadline: "25 नवंबर 2026",
            priority: "high",
            category: "दस्तावेज़",
            sourceText: "नियम 5(b): पुराने आय प्रमाण पत्र मान्य नहीं होंगे।",
            completed: false,
          },
          {
            id: "act-3",
            task: "NSP पोर्टल पर OTR (One-Time Registration) पूरा करें",
            description: "फेस ऑथेंटिकेशन ऐप के जरिए ई-केवाईसी प्रक्रिया पूर्ण करें।",
            deadline: "28 नवंबर 2026",
            priority: "high",
            category: "ऑनलाइन आवेदन",
            sourceText: "नियम 1.4: बिना OTR संख्या के फॉर्म जमा नहीं हो सकेगा।",
            completed: false,
          },
          {
            id: "act-4",
            task: "आवेदन की हार्ड कॉपी कॉलेज में जमा करें",
            description: "भरे हुए फॉर्म का प्रिंटआउट कॉलेज नोडल अधिकारी को सत्यापन हेतु दें।",
            deadline: "05 दिसंबर 2026",
            priority: "medium",
            category: "कॉलेज सत्यापन",
            sourceText: "नियम 7.1: भौतिक प्रति के सत्यापन के बिना आगे अग्रसारित नहीं किया जाएगा।",
            completed: false,
          },
        ],
        missingInformation: [
          "परिपत्र में राशि वितरण का सटीक महीना उल्लिखित नहीं है।",
          "प्राइवेट मेडिकल कॉलेजों के लिए अधिकतम शुल्क सीमा की परिशिष्ट सूची संलग्न नहीं है।",
        ],
        cautionNotes: [
          "धोखाधड़ी से सावधान: राष्ट्रीय छात्रवृत्ति पोर्टल कभी भी आपके बैंक का पिन या ओटीपी नहीं मांगता।",
          "दोहरा आवेदन प्रतिबंध: राज्य और केंद्र की दोहरी छात्रवृत्ति लेने पर विधिक कार्रवाई हो सकती है।",
        ],
        audioScript:
          "राष्ट्रीय पोस्ट-मैट्रिक छात्रवृत्ति 2026 के ऑडियो सारांश में आपका स्वागत है। इस योजना के अंतर्गत ₹50,000 तक की शुल्क प्रतिपूर्ति और मासिक भत्ता दिया जा रहा है। आवेदन की अंतिम तिथि 30 नवंबर 2026 है। अपना बैंक खाता आधार से लिंक करवाएं और नेशनल स्कॉलरशिप पोर्टल पर निःशुल्क आवेदन करें।",
        isMockDemo: true,
      },
    },
    qnaPairs: [
      {
        question: "What is the annual family income limit?",
        answer: "The annual gross family income must be under ₹2,50,000 from all sources, verified by an Income Certificate issued on or after 1st April 2026.",
        snippet: "Clause 5(b): Gross parental income from all sources must not exceed INR 2,50,000 per annum.",
      },
      {
        question: "What is the last date to apply?",
        answer: "The online application portal strictly closes at 11:59 PM on 30 November 2026.",
        snippet: "Clause 8.1: National Scholarship Portal closes for candidate registration on 30.11.2026.",
      },
      {
        question: "Is there any application fee?",
        answer: "No, application on the National Scholarship Portal (NSP) is 100% free of cost. No official fee is charged.",
        snippet: "Clause 2: No registration or processing fee is chargeable for government scholarship applications.",
      },
    ],
  },
  {
    id: "ssc-cgl-2026",
    title: "Staff Selection Commission (SSC CGL) 2026 Notification",
    category: "job",
    documentType: "Central Government Recruitment Notice",
    fileName: "SSC_CGL_Exam_2026_Notice.pdf",
    fileSize: "3.1 MB",
    fileType: "pdf",
    sampleQuestion: "What is the age limit and exam date?",
    data: {
      en: {
        success: true,
        documentId: "mock-ssc-2026",
        language: "en",
        documentType: "Central Government Recruitment Notice",
        title: "Staff Selection Commission Combined Graduate Level (CGL) 2026",
        simpleSummary:
          "The Staff Selection Commission invites online applications for filling approximately 14,500 Group 'B' and Group 'C' vacancies across ministries, departments, and constitutional bodies of the Government of India. Selection consists of a two-tier Computer Based Examination.",
        keyPoints: [
          "Total Vacancies: ~14,500 posts (Assistant Section Officer, Inspector of Income Tax, Sub-Inspector, Auditor).",
          "Eligibility: Bachelor's Degree in any discipline from a recognised university.",
          "Application Fee: ₹100 (Exempt for Women, SC, ST, PwBD, and Ex-Servicemen).",
          "Tier-I Computer Based Examination is scheduled tentatively for September/October 2026.",
        ],
        importantDates: [
          {
            id: "d1",
            title: "Online Application Closing Date",
            date: "24 Dec 2026",
            daysLeft: 42,
            urgency: "active",
            note: "Fee payment window closes 25 Dec 2026 (11:00 PM).",
          },
          {
            id: "d2",
            title: "Application Form Correction Window",
            date: "28 – 30 Dec 2026",
            daysLeft: 46,
            urgency: "future",
            note: "Correction fee applies for modifications.",
          },
          {
            id: "d3",
            title: "Tier-I Exam (Computer Based)",
            date: "Tentative Sep-Oct 2026",
            urgency: "future",
            note: "Admit cards issued 7 days prior to exam.",
          },
        ],
        feesAndAmounts: [
          {
            category: "General / OBC / EWS Male Candidates",
            amount: "₹100",
            details: "Payable via Net Banking, UPI, or Credit/Debit Card.",
          },
          {
            category: "Women & Reserved Categories (SC/ST/PwBD)",
            amount: "₹0 (Exempt)",
            details: "Full statutory fee waiver applies.",
          },
          {
            category: "Pay Scale (Group B Posts)",
            amount: "Pay Level-7 (₹44,900 to ₹1,42,400)",
            details: "Plus DA, HRA, and Transport Allowances.",
          },
        ],
        eligibility: [
          {
            criteria: "Educational Qualification",
            requirement: "Must possess Bachelor's degree or equivalent on or before the crucial cutoff date.",
            status: "mandatory",
          },
          {
            criteria: "Age Limit",
            requirement: "18 to 30 years (with up to 5 years relaxation for SC/ST, 3 years for OBC).",
            status: "mandatory",
          },
        ],
        requiredDocuments: [
          {
            id: "rd1",
            name: "Recent Live Webcam Photograph",
            mandatory: true,
            details: "Captured live on ssc.gov.in with plain white background and no spectacles.",
          },
          {
            id: "rd2",
            name: "Scanned Signature (10 to 20 KB)",
            mandatory: true,
            details: "Clear signature on white paper in black ink.",
          },
          {
            id: "rd3",
            name: "Graduation Degree / Final Provisional Certificate",
            mandatory: true,
            details: "Needed for document verification stage.",
          },
        ],
        actionChecklist: [
          {
            id: "act-1",
            task: "Complete One-Time Registration (OTR) on ssc.gov.in",
            description: "Verify Aadhaar and educational board details on the new Commission website.",
            deadline: "15 Dec 2026",
            priority: "high",
            category: "Registration",
            sourceText: "Para 10.1: Old SSC credentials will not work on the new portal.",
            completed: false,
          },
          {
            id: "act-2",
            task: "Capture Live Photo under Adequate Ambient Light",
            description: "Avoid caps, spectacles, or shadowy backgrounds to prevent auto-rejection.",
            deadline: "20 Dec 2026",
            priority: "high",
            category: "Photo Requirement",
            sourceText: "Para 9.3: Applications with distorted photos will be rejected without notice.",
            completed: false,
          },
          {
            id: "act-3",
            task: "Submit Post Preference and Online Fee",
            description: "Complete final review of examination center preferences and pay ₹100 fee.",
            deadline: "24 Dec 2026",
            priority: "high",
            category: "Submission",
            sourceText: "Para 11: Unpaid applications will be deemed incomplete.",
            completed: false,
          },
        ],
        missingInformation: [
          "Exact day-wise Tier-I exam timetable will be notified separately on the regional SSC portals.",
        ],
        cautionNotes: [
          "Crucial Date Rule: Category and EWS certificates must be dated within the crucial financial year.",
          "Multiple Application Alert: Submitting multiple forms will result in cancellation of all candidatures.",
        ],
        audioScript:
          "This is the summary of SSC Combined Graduate Level Examination 2026. Approximately 14,500 government vacancies are open for graduates. Application closes on 24th December 2026. Application fee is ₹100, and free for women and reserved categories. Register early on ssc.gov.in.",
        isMockDemo: true,
      },
      hi: {
        success: true,
        documentId: "mock-ssc-2026",
        language: "hi",
        documentType: "केंद्र सरकार भर्ती अधिसूचना",
        title: "कर्मचारी चयन आयोग (SSC CGL) 2026 परीक्षा अधिसूचना",
        simpleSummary:
          "कर्मचारी चयन आयोग द्वारा भारत सरकार के विभिन्न मंत्रालयों एवं विभागों में लगभग 14,500 ग्रुप 'बी' और 'सी' पदों (जैसे आयकर निरीक्षक, सहायक अनुभाग अधिकारी, ऑडिटर) पर भर्ती के लिए आवेदन आमंत्रित किए गए हैं।",
        keyPoints: [
          "कुल रिक्तियां: लगभग 14,500 पद।",
          "योग्यता: किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक (Graduation) डिग्री।",
          "आवेदन शुल्क: ₹100 (महिला, अनुसूचित जाति/जनजाति और दिव्यांग अभ्यर्थियों के लिए निःशुल्क)।",
          "टियर-1 कंप्यूटर आधारित परीक्षा सितंबर/अक्टूबर में संभावित है।",
        ],
        importantDates: [
          {
            id: "d1",
            title: "आवेदन की अंतिम तिथि",
            date: "24 दिसंबर 2026",
            daysLeft: 42,
            urgency: "active",
            note: "शुल्क भुगतान 25 दिसंबर रात 11:00 बजे तक।",
          },
          {
            id: "d2",
            title: "फॉर्म सुधार (Correction Window)",
            date: "28 – 30 दिसंबर 2026",
            daysLeft: 46,
            urgency: "future",
            note: "सुधार के लिए अतिरिक्त शुल्क लागू होगा।",
          },
        ],
        feesAndAmounts: [
          {
            category: "सामान्य / ओबीसी / ईडब्ल्यूएस पुरुष अभ्यर्थी",
            amount: "₹100",
            details: "यूपीआई, नेट बैंकिंग या डेबिट कार्ड से देय।",
          },
          {
            category: "महिला एवं आरक्षित वर्ग",
            amount: "₹0 (निःशुल्क)",
            details: "पूर्ण शुल्क छूट लागू।",
          },
        ],
        eligibility: [
          {
            criteria: "शैक्षणिक योग्यता",
            requirement: "कटऑफ तिथि तक स्नातक की उपाधि अनिवार्य।",
            status: "mandatory",
          },
          {
            criteria: "आयु सीमा",
            requirement: "18 से 30 वर्ष (आरक्षित वर्गों को सरकारी नियमानुसार छूट)।",
            status: "mandatory",
          },
        ],
        requiredDocuments: [
          {
            id: "rd1",
            name: "लाइव वेबकैम फोटो",
            mandatory: true,
            details: "सफेद पृष्ठभूमि, बिना चश्मे और टोपी के पोर्टल पर लाइव ली गई फोटो।",
          },
          {
            id: "rd2",
            name: "स्कैन किए गए हस्ताक्षर (10 से 20 KB)",
            mandatory: true,
            details: "काली स्याही से सफेद कागज पर स्पष्ट हस्ताक्षर।",
          },
        ],
        actionChecklist: [
          {
            id: "act-1",
            task: "ssc.gov.in पर नया OTR पूरा करें",
            description: "आयोग की नई वेबसाइट पर अपना विवरण पंजीकृत करें।",
            deadline: "15 दिसंबर 2026",
            priority: "high",
            category: "पंजीकरण",
            sourceText: "पैरा 10: पुराना OTR इस भर्ती में मान्य नहीं होगा।",
            completed: false,
          },
          {
            id: "act-2",
            task: "लाइव फोटो कैप्चर करें",
            description: "स्पष्ट रोशनी में बिना चश्मे के फोटो अपलोड करें।",
            deadline: "20 दिसंबर 2026",
            priority: "high",
            category: "दस्तावेज़",
            sourceText: "पैरा 9.3: अस्पष्ट फोटो वाले फॉर्म निरस्त कर दिए जाएंगे।",
            completed: false,
          },
        ],
        missingInformation: [
          "टियर-1 परीक्षा की सटीक तारीखों की घोषणा बाद में क्षेत्रीय वेबसाइटों पर की जाएगी।",
        ],
        cautionNotes: [
          "एक से अधिक आवेदन जमा करने पर सभी फॉर्म स्वतः रद्द हो जाएंगे।",
        ],
        audioScript:
          "कर्मचारी चयन आयोग CGL 2026 भर्ती के अंतर्गत 14,500 पदों पर भर्तियां निकली हैं। आवेदन की अंतिम तिथि 24 दिसंबर 2026 है। स्नातक उत्तीर्ण अभ्यर्थी ssc.gov.in पर समय रहते आवेदन करें।",
        isMockDemo: true,
      },
    },
    qnaPairs: [
      {
        question: "What is the age limit and exam date?",
        answer: "The age limit is 18 to 30 years for most posts (with standard age relaxation for reserved categories). Tier-I exam is tentatively scheduled for September/October 2026.",
        snippet: "Para 5.1: Age reckoning cutoff is fixed as 01.08.2026. Tier-I CBT will be notified in autumn.",
      },
      {
        question: "Can final year college students apply?",
        answer: "Yes, provided the final graduation result is declared on or before the crucial cutoff date specified in the notice.",
        snippet: "Para 8.2: Candidates appearing in final exam may apply subject to acquiring qualification prior to the cutoff date.",
      },
    ],
  },
];

export function getMockAnalysis(presetId: string, lang: SupportedLanguage): AnalysisResponse {
  const preset = MOCK_NOTICES.find((p) => p.id === presetId) || MOCK_NOTICES[0];
  const langKey = lang === "hi" ? "hi" : "en";
  const base = preset.data[langKey] || preset.data.en;
  const enData = preset.data.en;

  const bilingualChecklist = base.actionChecklist.map((item, idx) => ({
    ...item,
    taskEnglish: enData.actionChecklist[idx]?.task || item.task,
    descriptionEnglish: enData.actionChecklist[idx]?.description || item.description,
  }));

  return {
    ...base,
    simpleSummaryEnglish: enData.simpleSummary,
    keyPointsEnglish: enData.keyPoints,
    actionChecklist: bilingualChecklist,
    language: lang,
    isMockDemo: true,
  };
}

export function getMockAnswer(presetId: string, question: string, lang: SupportedLanguage): AskQuestionResponse {
  const preset = MOCK_NOTICES.find((p) => p.id === presetId) || MOCK_NOTICES[0];
  const match = preset.qnaPairs.find((q) =>
    question.toLowerCase().includes(q.question.toLowerCase().split(" ")[0])
  ) || preset.qnaPairs[0];

  const hindiAnswerMap: Record<string, string> = {
    "What is the annual family income limit?": "वार्षिक पारिवारिक आय सीमा सभी स्रोतों से अधिकतम ₹2,50,000 प्रति वर्ष होनी चाहिए।",
    "What is the age limit and exam date?": "आयु सीमा 18 से 30 वर्ष है (आरक्षित वर्ग को नियमानुसार छूट)। परीक्षा सितंबर/अक्टूबर 2026 में होगी।",
  };

  const nativeAnswer = lang === "hi" && hindiAnswerMap[match.question]
    ? hindiAnswerMap[match.question]
    : match.answer;

  return {
    success: true,
    documentId: preset.id,
    question,
    answer: nativeAnswer,
    answerEnglish: match.answer,
    sourceSnippet: match.snippet,
    confidence: "high",
    isMockDemo: true,
  };
}
