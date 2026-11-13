import { SamplePreset } from "@/types";

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "scholarship-nsp",
    title: "National Post-Matric Scholarship Scheme 2026-27",
    shortDesc: "Annual scholarship of up to ₹50,000 for SC/ST/OBC college & diploma students with income below ₹2.5 Lakh.",
    category: "scholarship",
    fileName: "NSP_PostMatric_Scholarship_2026_Notice.pdf",
    fileSize: "2.4 MB",
    fileType: "pdf",
    previewBadge: "Govt of India / NSP",
    previewSnippet: "Ministry of Social Justice and Empowerment - Guidelines for Centrally Sponsored Post-Matric Scholarship Scheme for SC/ST/OBC/EBC students enrolled in accredited institutions.",
    analyses: {
      hindi: {
        id: "nsp-hi",
        title: "राष्ट्रीय पोस्ट-मैट्रिक छात्रवृत्ति योजना 2026-27",
        category: "scholarship",
        language: "hindi",
        isDemo: true,
        tagline: "कॉलेज और डिप्लोमा के पात्र छात्रों को प्रति वर्ष ₹50,000 तक की आर्थिक सहायता।",
        officialSource: "सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार",
        portalUrl: "https://scholarships.gov.in",
        keyHighlight: "अंतिम तिथि 15 नवंबर 2026 है। आधार-सीडेड बैंक खाता होना अनिवार्य है!",
        simpleSummary: [
          "यह योजना उन छात्रों के लिए है जो 10वीं पास करने के बाद 11वीं, 12वीं, आईटीआई, पॉलिटेक्निक, ग्रेजुएशन या पोस्ट-ग्रेजुएशन कर रहे हैं।",
          "पारिवारिक वार्षिक आय ₹2,50,000 (ढाई लाख रुपये) से कम होनी चाहिए।",
          "छात्रवृत्ति में कॉलेज ट्यूशन फीस की पूरी प्रतिपूर्ति (Reimbursement) और ₹1,200 प्रतिमाह तक का मेंटेनेंस भत्ता सीधे आपके बैंक खाते में भेजा जाएगा।",
          "आवेदन केवल नेशनल स्कॉलरशिप पोर्टल (NSP) पर ऑनलाइन होगा, कॉलेज में कोई ऑफलाइन फॉर्म जमा नहीं करना है।"
        ],
        importantDates: [
          { title: "ऑनलाइन आवेदन शुरू होने की तिथि", date: "15 अगस्त 2026", status: "active", daysLeft: 45, badge: "शुरू" },
          { title: "छात्रों द्वारा आवेदन की अंतिम तिथि", date: "15 नवंबर 2026", status: "urgent", daysLeft: 18, badge: "महत्वपूर्ण" },
          { title: "संस्थान (कॉलेज) स्तर पर सत्यापन", date: "30 नवंबर 2026", status: "future", daysLeft: 33, badge: "कॉलेज वेरीफिकेशन" },
          { title: "डीएलओ (DLO) जिला स्तरीय अंतिम स्वीकृति", date: "15 दिसंबर 2026", status: "future", daysLeft: 48, badge: "फाइनल अप्रूवल" }
        ],
        eligibility: [
          { field: "शैक्षणिक योग्यता", requirement: "10वीं कक्षा न्यूनतम 50% अंकों के साथ उत्तीर्ण और किसी मान्यता प्राप्त कॉलेज/यूनिवर्सिटी में नियमित छात्र।", highlight: "नियमित छात्र" },
          { field: "वर्ग / श्रेणी", requirement: "अनुसूचित जाति (SC), अनुसूचित जनजाति (ST), अन्य पिछड़ा वर्ग (OBC), और EBC श्रेणी के छात्र।", highlight: "SC / ST / OBC / EBC" },
          { field: "पारिवारिक आय सीमा", requirement: "माता-पिता/अभिभावक की कुल वार्षिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए।", highlight: "अधिकतम ₹2.5 लाख" },
          { field: "बैंक खाता", requirement: "छात्र के नाम पर बैंक खाता होना चाहिए और वह आधार से NPCI मैपर पर लिंक (DBT Enabled) होना अनिवार्य है।", highlight: "Aadhaar Seeding अनिवार्य" }
        ],
        financials: {
          overview: "ट्यूशन फीस + मेंटेनेंस अलाउंस सीधे बैंक खाते में (DBT द्वारा)।",
          items: [
            { category: "डिग्री व प्रोफेशनल कोर्स (B.Tech, MBBS, MBA)", amount: "₹20,000 - ₹50,000 / वर्ष", details: "ट्यूशन फीस पूरी तरह माफ + ₹1,200/माह हॉस्टलर को" },
            { category: "सामान्य स्नातक (BA, B.Sc, B.Com)", amount: "₹12,000 - ₹20,000 / वर्ष", details: "कॉलेज फीस + ₹550/माह डे-स्कॉलर को" },
            { category: "आवेदन शुल्क", amount: "₹0 (बिल्कुल मुफ्त)", details: "सरकारी पोर्टल पर आवेदन का कोई शुल्क नहीं है" }
          ],
          importantNote: "किसी भी साइबर कैफे या दलाल को फॉर्म भरने के नाम पर ₹50-₹100 से ज्यादा न दें। फॉर्म सरकार द्वारा पूरी तरह निःशुल्क है।"
        },
        requiredDocuments: [
          { name: "आधार कार्ड (Aadhaar Card)", mandatory: true, notes: "मोबाइल नंबर लिंक होना चाहिए OTP सत्यापन के लिए" },
          { name: "नवीनतम आय प्रमाण पत्र (Income Certificate)", mandatory: true, notes: "तहसीलदार द्वारा जारी, 6 महीने से पुराना न हो" },
          { name: "जाति प्रमाण पत्र (Caste Certificate)", mandatory: true, notes: "राज्य सरकार के सक्षम अधिकारी द्वारा डिजिटल रूप से हस्ताक्षरित" },
          { name: "पिछली कक्षा की मार्कशीट (10th/12th/Semester)", mandatory: true, notes: "कम से कम 50% प्राप्तांक दर्शाने वाली" },
          { name: "वर्तमान वर्ष की कॉलेज फीस रसीद (Fee Receipt)", mandatory: true, notes: "कॉलेज मुहर एवं हस्ताक्षर सहित" },
          { name: "बोनाफाइड सर्टिफिकेट (Bonafide Certificate)", mandatory: true, notes: "NSP पोर्टल से डाउनलोड कर कॉलेज प्राचार्य से हस्ताक्षर करवाएं" },
          { name: "बैंक पासबुक की प्रति", mandatory: true, notes: "IFSC कोड व खाता संख्या स्पष्ट दिखना चाहिए" }
        ],
        nextSteps: [
          { id: "ns1", step: 1, title: "आधार कार्ड में मोबाइल नंबर और बैंक सीडिंग चेक करें", description: "UIDAI या बैंक जाकर चेक करें कि आपका खाता NPCI DBT इनेबल्ड है या नहीं।" },
          { id: "ns2", step: 2, title: "NSP पोर्टल (scholarships.gov.in) पर OTR (One Time Registration) करें", description: "अपना मोबाइल नंबर और आधार दर्ज करके OTR नंबर जनरेट करें।" },
          { id: "ns3", step: 3, title: "फॉर्म भरें और बोनाफाइड सर्टिफिकेट डाउनलोड करें", description: "सभी शैक्षणिक विवरण भरें और जेनरेटेड बोनाफाइड प्रिंट कर कॉलेज में साइन करवाएं।" },
          { id: "ns4", step: 4, title: "दस्तावेज़ अपलोड करके फाइनल सबमिट करें", description: "15 नवंबर से पहले फाइनल सबमिट करें और रसीद अपने कॉलेज के छात्रवृत्ति सेल में जमा करें।" }
        ],
        audioScript: "नमस्ते! यह नोटिस भारत सरकार की राष्ट्रीय पोस्ट-मैट्रिक छात्रवृत्ति योजना 2026-27 के बारे में है। अगर आप एससी, एसटी या ओबीसी वर्ग के छात्र हैं और आपके परिवार की सालाना कमाई ढाई लाख रुपये से कम है, तो आपको कॉलेज की पढ़ाई के लिए पचास हज़ार रुपये तक की आर्थिक सहायता मिलेगी। ध्यान रखें, आवेदन की अंतिम तारीख 15 नवंबर 2026 है। अपना आधार कार्ड बैंक खाते से ज़रूर लिंक करवा लें, क्योंकि पैसा सीधे बैंक खाते में आएगा। ऑनलाइन आवेदन के लिए scholarships.gov.in पर जाएं।",
        faq: [
          { id: "q1", question: "क्या प्राइवेट कॉलेज के छात्र भी यह छात्रवृत्ति पा सकते हैं?", answer: "हाँ, यदि आपका प्राइवेट कॉलेज UGC, AICTE या राज्य सरकार द्वारा मान्यता प्राप्त है और NSP पोर्टल पर लिस्टेड है, तो आप आवेदन कर सकते हैं।" },
          { id: "q2", question: "अगर पिछले साल स्कॉलरशिप मिली थी तो नया फॉर्म भरना है या रिन्यूअल?", answer: "आपको नया फॉर्म नहीं भरना है, अपने पिछले साल के Application ID से 'Renewal Application' में लॉगिन करके रिन्यू करना होगा।" },
          { id: "q3", question: "आय प्रमाण पत्र किसके नाम पर होना चाहिए?", answer: "आय प्रमाण पत्र हमेशा परिवार के मुखिया (पिता या माता) के नाम पर होना चाहिए, छात्र के स्वयं के नाम पर नहीं।" }
        ],
        warnings: [
          "गलत जानकारी देने पर छात्रवृत्ति निरस्त हो सकती है और कानूनी कार्रवाई की जा सकती है।",
          "एक छात्र एक समय में केवल एक ही सरकारी छात्रवृत्ति ले सकता है।"
        ]
      },
      english: {
        id: "nsp-en",
        title: "National Post-Matric Scholarship Scheme 2026-27",
        category: "scholarship",
        language: "english",
        isDemo: true,
        tagline: "Financial grant of up to ₹50,000/year for eligible SC, ST, and OBC college students.",
        officialSource: "Ministry of Social Justice and Empowerment, Govt. of India",
        portalUrl: "https://scholarships.gov.in",
        keyHighlight: "Deadline is November 15, 2026. Aadhaar-NPCI bank seeding is mandatory!",
        simpleSummary: [
          "Covers post-secondary courses including Class 11-12, ITI, Diploma, Undergraduate (B.Tech, B.Sc, BA, etc.), and Postgraduate degrees.",
          "Family annual income must not exceed ₹2,50,000 (2.5 Lakhs per annum).",
          "Benefits include complete tuition fee reimbursement plus monthly maintenance allowance (up to ₹1,200/month) credited directly via DBT.",
          "Applications are 100% online through the National Scholarship Portal (NSP). No offline paperwork is accepted."
        ],
        importantDates: [
          { title: "Application Portal Opens", date: "August 15, 2026", status: "active", daysLeft: 45, badge: "Open" },
          { title: "Last Date for Student Application", date: "November 15, 2026", status: "urgent", daysLeft: 18, badge: "Deadline" },
          { title: "Institutional Verification Cut-off", date: "November 30, 2026", status: "future", daysLeft: 33, badge: "College Check" },
          { title: "District Level Officer Final Approval", date: "December 15, 2026", status: "future", daysLeft: 48, badge: "Approval" }
        ],
        eligibility: [
          { field: "Education", requirement: "Passed 10th standard with minimum 50% marks and currently enrolled as a full-time regular student.", highlight: "Regular Full-Time" },
          { field: "Category", requirement: "Scheduled Castes (SC), Scheduled Tribes (ST), Other Backward Classes (OBC), and Economically Backward Classes (EBC).", highlight: "SC / ST / OBC / EBC" },
          { field: "Annual Family Income", requirement: "Gross annual income from all sources must be ₹2,50,000 or below.", highlight: "Max ₹2.5 Lakh/yr" },
          { field: "Bank Account", requirement: "Must have an active bank account in the student's name, linked and seeded with Aadhaar on NPCI mapper.", highlight: "Aadhaar DBT Active" }
        ],
        financials: {
          overview: "Tuition waiver + maintenance stipend credited directly to bank account.",
          items: [
            { category: "Professional & Degree Courses", amount: "₹20,000 - ₹50,000 / year", details: "Full tuition reimbursement + ₹1,200/mo hostel allowance" },
            { category: "General Degree (BA, B.Sc, B.Com)", amount: "₹12,000 - ₹20,000 / year", details: "Full tuition reimbursement + ₹550/mo day-scholar stipend" },
            { category: "Application Fee", amount: "₹0 (Free)", details: "Official government portal application is completely free of charge" }
          ],
          importantNote: "Beware of cyber cafes charging high fees; the government application is completely free."
        },
        requiredDocuments: [
          { name: "Aadhaar Card", mandatory: true, notes: "Must be linked with active mobile number for OTP verification" },
          { name: "Income Certificate", mandatory: true, notes: "Issued by Tehsildar or competent revenue authority, not older than 6 months" },
          { name: "Caste Certificate", mandatory: true, notes: "Digitally verified certificate from state government authority" },
          { name: "Previous Academic Marksheets", mandatory: true, notes: "10th, 12th, or recent semester grade sheet" },
          { name: "Current Academic Year College Fee Receipt", mandatory: true, notes: "Stamped and signed by college accounts office" },
          { name: "Bonafide Student Certificate", mandatory: true, notes: "Downloaded from NSP portal and signed by College Principal/Director" },
          { name: "Bank Passbook Copy", mandatory: true, notes: "Clearly showing student name, account number, and IFSC" }
        ],
        nextSteps: [
          { id: "ns1", step: 1, title: "Verify Aadhaar-Bank Seeding Status", description: "Check with your bank or UIDAI portal that your bank account is mapped to NPCI for DBT payments." },
          { id: "ns2", step: 2, title: "Register for OTR (One Time Registration) on NSP", description: "Visit scholarships.gov.in, provide Aadhaar and mobile number to receive your unique OTR." },
          { id: "ns3", step: 3, title: "Fill Course Details & Download Bonafide", description: "Fill academic info, download the auto-generated Bonafide form, and get it signed by your college head." },
          { id: "ns4", step: 4, title: "Upload Scanned Docs & Submit Before Nov 15", description: "Upload PDFs under 200KB, submit the form, and hand over a print copy to your college scholarship desk." }
        ],
        audioScript: "Hello! This notice pertains to the Government of India's National Post-Matric Scholarship Scheme for 2026-27. If you are an SC, ST, or OBC student with a family income below two point five lakh rupees per year, you can receive up to fifty thousand rupees to cover your college tuition and living expenses. The deadline to submit your online application is November 15, 2026. Make sure your Aadhaar card is linked to your bank account for Direct Benefit Transfer. Apply online at scholarships.gov.in.",
        faq: [
          { id: "q1", question: "Can private college students apply for this scholarship?", answer: "Yes, provided your private institution is recognized by UGC/AICTE or State Board and registered on the NSP portal." },
          { id: "q2", question: "I received this scholarship last year. Do I submit a fresh form?", answer: "No, existing awardees must log in with their previous application credentials and choose 'Renewal Application'." },
          { id: "q3", question: "Whose name should be on the Income Certificate?", answer: "The Income Certificate must be in the name of the family head (father or mother), not in the student's name." }
        ],
        warnings: [
          "Submitting fraudulent certificates leads to permanent blacklisting and legal recovery proceedings.",
          "A student can claim only one central or state government scholarship at a time."
        ]
      },
      hinglish: {
        id: "nsp-hn",
        title: "National Post-Matric Scholarship Scheme 2026-27",
        category: "scholarship",
        language: "hinglish",
        isDemo: true,
        tagline: "College aur diploma students ko ₹50,000 tak ki financial help. Simple aur aasaan!",
        officialSource: "Ministry of Social Justice & Empowerment, Govt. of India",
        portalUrl: "https://scholarships.gov.in",
        keyHighlight: "Last date 15 November 2026 hai! Aadhaar bank account se link hona zaroori hai.",
        simpleSummary: [
          "Agar aap 10th pass karke 11th, 12th, ITI, Polytechnic, B.Tech, BA, B.Sc ya koi bhi degree kar rahe ho, toh yeh scholarship aapke liye hai.",
          "Family ki total saalana kamai (annual income) ₹2.5 Lakh se kam honi chahiye.",
          "Poori college tuition fee wapas mil jayegi plus har mahine ₹1,200 tak ka pocket money allowance seedhe aapke account mein aayega.",
          "Form poora online National Scholarship Portal (NSP) par bharna hai, kisi agent ko paise mat do!"
        ],
        importantDates: [
          { title: "Online Application Start", date: "15 August 2026", status: "active", daysLeft: 45, badge: "Started" },
          { title: "Student Form Deadline", date: "15 November 2026", status: "urgent", daysLeft: 18, badge: "Last Date" },
          { title: "College Verification", date: "30 November 2026", status: "future", daysLeft: 33, badge: "College Check" },
          { title: "Final District Approval", date: "15 December 2026", status: "future", daysLeft: 48, badge: "Final Approval" }
        ],
        eligibility: [
          { field: "Education Requirement", requirement: "10th standard minimum 50% marks se pass aur kisi recognized college mein regular admission.", highlight: "Regular Admission" },
          { field: "Category / Caste", requirement: "SC, ST, OBC aur EBC category ke students eligible hain.", highlight: "SC / ST / OBC / EBC" },
          { field: "Family Income", requirement: "Mummy-Papa ki total saalana income ₹2,50,000 se zyada nahi honi chahiye.", highlight: "Max ₹2.5 Lakh" },
          { field: "Bank Account", requirement: "Student ke khud ke naam par bank account ho aur Aadhaar se NPCI DBT enabled hona compulsory hai.", highlight: "Aadhaar NPCI Link" }
        ],
        financials: {
          overview: "College tuition fee 100% refund + monthly stipend seedhe account mein.",
          items: [
            { category: "Professional Degree (B.Tech, Medical, Management)", amount: "₹20,000 - ₹50,000 / year", details: "College fee waiver + ₹1,200/month allowance" },
            { category: "General Degree (BA, B.Com, B.Sc)", amount: "₹12,000 - ₹20,000 / year", details: "College fee + ₹550/month pocket stipend" },
            { category: "Govt Portal Application Fee", amount: "₹0 (Free)", details: "Sarkari portal par form bilkul free hai" }
          ],
          importantNote: "Cyber cafe wale ko sirf ₹50-₹80 scanning aur printing ka do, form fees zero hai."
        },
        requiredDocuments: [
          { name: "Aadhaar Card", mandatory: true, notes: "Phone number linked hona chahiye OTP aane ke liye" },
          { name: "Latest Income Certificate", mandatory: true, notes: "Tehsildar dwara verified, 6 mahine se purana na ho" },
          { name: "Caste Certificate (Jaati Praman Patra)", mandatory: true, notes: "Digital QR code wala state certificate" },
          { name: "Previous Year Marksheet", mandatory: true, notes: "10th/12th ya last semester ki original marksheet scan" },
          { name: "Current College Fee Receipt", mandatory: true, notes: "Fees slip jis par date aur college ki stamp ho" },
          { name: "Bonafide Certificate", mandatory: true, notes: "NSP site se download karke college Principal se sign karwayein" },
          { name: "Bank Passbook Copy", mandatory: true, notes: "Account number aur IFSC code bilkul saaf dikhe" }
        ],
        nextSteps: [
          { id: "ns1", step: 1, title: "Check karein bank account Aadhaar se seeded hai ya nahi", description: "Apne bank branch jaakar confirm karein ki DBT incoming enable hai." },
          { id: "ns2", step: 2, title: "scholarships.gov.in par OTR registration karein", description: "Aadhaar OTP verify karke apna One-Time Registration number prapt karein." },
          { id: "ns3", step: 3, title: "Form fill karein aur Bonafide print nikaalein", description: "Course details bharne ke baad bonafide paper print karke college se sign karwayein." },
          { id: "ns4", step: 4, title: "Documents upload karke Final Submit button dabayein", description: "15 November se pehle submit karein aur acknowledgment slip college office mein dein." }
        ],
        audioScript: "Hello dost! Yeh notification National Post-Matric Scholarship 2026-27 ke baare mein hai. Agar aap SC, ST ya OBC student hain aur family income do lakh pachas hazar se kam hai, toh aapko college fees aur maintenance ke liye pachas hazar tak mil sakte hain. Form bharne ki last date 15 November 2026 hai. Bank account mein Aadhaar link hona zaroori hai. Jaldi se scholarships.gov.in par jakar form fill karein!",
        faq: [
          { id: "q1", question: "Kya Private college ke students ko bhi milegi?", answer: "Haan bilkul! Agar aapka private college UGC ya AICTE approved hai aur NSP portal par registered hai toh milegi." },
          { id: "q2", question: "Pichle saal mili thi, toh kya naya form bharna padega?", answer: "Nahi, fresh form nahi bharna. Purani login details se 'Renewal Application' select karke update karna hai." },
          { id: "q3", question: "Income certificate kiske naam ka hona chahiye?", answer: "Income certificate hamesha Mummy ya Papa ke naam ka hona chahiye, student ke naam ka nahi." }
        ]
      }
    }
  },
  {
    id: "job-ssc",
    title: "SSC CGL 2026 - Combined Graduate Level Exam",
    shortDesc: "Recruitment for 14,800+ Group B & C Central Govt Inspector, Auditor & Assistant Section Officer posts.",
    category: "job",
    fileName: "SSC_CGL_2026_Official_Notification.pdf",
    fileSize: "4.1 MB",
    fileType: "pdf",
    previewBadge: "Staff Selection Commission (SSC)",
    previewSnippet: "Staff Selection Commission Notice: Combined Graduate Level Examination, 2026. Online registration opens for Assistant Section Officer (ASO), Income Tax Inspector, GST Inspector, Central Excise & Auditor positions.",
    analyses: {
      hindi: {
        id: "ssc-hi",
        title: "कर्मचारी चयन आयोग (SSC) - CGL परीक्षा 2026",
        category: "job",
        language: "hindi",
        isDemo: true,
        tagline: "केंद्र सरकार के विभिन्न मंत्रालयों में 14,800+ पदों पर भर्ती। न्यूनतम योग्यता: किसी भी विषय में स्नातक।",
        officialSource: "स्टाफ सिलेक्शन कमीशन (ssc.gov.in)",
        portalUrl: "https://ssc.gov.in",
        keyHighlight: "आवेदन की अंतिम तिथि 24 जुलाई 2026 है। टियर-1 परीक्षा सितंबर-अक्टूबर 2026 में होगी!",
        simpleSummary: [
          "यह केंद्र सरकार के मंत्रालयों (जैसे आयकर विभाग, जीएसटी, सीबीआई, विदेश मंत्रालय) में इंस्पेक्टर, ऑडिटर और सहायक अनुभाग अधिकारी (ASO) के पदों के लिए सबसे बड़ी परीक्षा है।",
          "कुल पदों की अनुमानित संख्या 14,800 से अधिक है।",
          "किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक (Graduation) की डिग्री रखने वाले युवा आवेदन कर सकते हैं।",
          "चयन दो चरणों (टियर-1 कंप्यूटर आधारित परीक्षा और टियर-2 मुख्य परीक्षा) के माध्यम से होगा। कोई इंटरव्यू नहीं होगा।"
        ],
        importantDates: [
          { title: "ऑनलाइन आवेदन शुरू होने की तिथि", date: "24 जून 2026", status: "active", daysLeft: 22, badge: "खुला है" },
          { title: "ऑनलाइन आवेदन की अंतिम तिथि", date: "24 जुलाई 2026 (रात 11:00 बजे)", status: "urgent", daysLeft: 7, badge: "अंतिम तिथि" },
          { title: "ऑनलाइन फीस भुगतान की अंतिम तिथि", date: "25 जुलाई 2026", status: "future", daysLeft: 8, badge: "फीस डेडलाइन" },
          { title: "आवेदन सुधार (Correction Window)", date: "28 - 29 जुलाई 2026", status: "future", daysLeft: 12, badge: "सुधार मौका" },
          { title: "टियर-1 कंप्यूटर आधारित परीक्षा (CBT)", date: "सितंबर - अक्टूबर 2026", status: "future", daysLeft: 70, badge: "परीक्षा तिथि" }
        ],
        eligibility: [
          { field: "शैक्षणिक योग्यता", requirement: "1 अगस्त 2026 तक किसी भी विषय में मान्यता प्राप्त विश्वविद्यालय से स्नातक (Bachelor's Degree) उत्तीर्ण।", highlight: "ग्रेजुएट (Any Stream)" },
          { field: "आयु सीमा", requirement: "अधिकांश पदों के लिए 18 से 30 वर्ष (कुछ विशिष्ट पदों के लिए 18 से 32 वर्ष)। आरक्षित वर्गों को नियमानुसार 3 से 5 वर्ष की छूट।", highlight: "18 से 30 वर्ष" },
          { field: "फाइनल ईयर छात्र", requirement: "जो छात्र फाइनल ईयर में हैं, वे भी आवेदन कर सकते हैं बशर्ते 1 अगस्त 2026 से पहले उनका परिणाम आ चुका हो।", highlight: "अपीयरिंग शर्त के साथ" }
        ],
        financials: {
          overview: "वेतन स्तर लेवल-4 से लेवल-8 (लगभग ₹35,000 से ₹90,000 प्रति माह + भत्ते)।",
          items: [
            { category: "सामान्य/ओबीसी/ईडब्ल्यूएस पुरुष", amount: "₹100 (मात्र एक सौ रुपये)", details: "ऑनलाइन नेट बैंकिंग/यूपीआई/कार्ड द्वारा देय" },
            { category: "महिलाएं, एससी, एसटी, पीडब्ल्यूडी, भूतपूर्व सैनिक", amount: "₹0 (निःशुल्क)", details: "पूरी तरह से परीक्षा शुल्क माफ" },
            { category: "आरंभिक वेतन (Pay Scale)", amount: "₹35,400 - ₹1,42,400", details: "मूल वेतन + डीए, एचआरए और सरकारी लाभ" }
          ],
          importantNote: "Correction window में पहली बार सुधार करने पर ₹200 और दूसरी बार करने पर ₹500 का शुल्क लगेगा, इसलिए पहली बार में ही ध्यान से भरें।"
        },
        requiredDocuments: [
          { name: "लाइव वेबकैम फोटो (Live Photo)", mandatory: true, notes: "SSC की नई वेबसाइट पर लाइव कैमरा से फोटो कैप्चर होगी, सफेद बैकग्राउंड रखें और चश्मा/टोपी न पहनें" },
          { name: "डिजिटल हस्ताक्षर (Signature)", mandatory: true, notes: "10 KB से 20 KB के बीच, स्पष्ट ब्लैक या ब्लू पेन से सादे सफेद कागज पर" },
          { name: "10वीं की मार्कशीट", mandatory: true, notes: "नाम, पिता का नाम और जन्मतिथि मिलान के लिए" },
          { name: "ग्रेजुएशन डिग्री या प्रोविजनल सर्टिफिकेट", mandatory: true, notes: "रोल नंबर और उत्तीर्ण वर्ष दर्ज करने के लिए" },
          { name: "वैध फोटो पहचान पत्र (आधार / पैन / वोटर आईडी)", mandatory: true, notes: "परीक्षा केंद्र पर मूल प्रति साथ ले जानी होगी" }
        ],
        nextSteps: [
          { id: "ssc1", step: 1, title: "SSC के नए पोर्टल (ssc.gov.in) पर One-Time Registration (OTR) करें", description: "अगर आपने पहले OTR नहीं किया है तो आधार और मोबाइल नंबर से नया OTR प्रोफाइल बनाएं।" },
          { id: "ssc2", step: 2, title: "लाइव फोटो कैप्चर के लिए सही रोशनी वाले कमरे में बैठें", description: "कैमरा आँखों के स्तर पर हो, चश्मा और कैप उतारकर लाइव फोटो लें।" },
          { id: "ssc3", step: 3, title: "परीक्षा केंद्र प्राथमिकता (Exam Centers) और पोस्ट प्राथमिकता भरें", description: "अपने गृह राज्य के 3 नजदीकी परीक्षा केंद्र चुनें।" },
          { id: "ssc4", step: 4, title: "₹100 फीस का ऑनलाइन भुगतान करें और पीडीएफ प्रिंट रखें", description: "फॉर्म सबमिट करने के बाद Application Status 'Contents Not Verified' दिखाएगा जो सामान्य है।" }
        ],
        audioScript: "कर्मचारी चयन आयोग यानी SSC ने CGL परीक्षा 2026 की घोषणा कर दी है। इसके तहत केंद्र सरकार के मंत्रालयों में चौदह हज़ार आठ सौ से अधिक पदों पर भर्तियां होंगी। यदि आपने किसी भी विषय में स्नातक यानी ग्रेजुएशन कर ली है और आपकी उम्र अठारह से तीस वर्ष है, तो आप आवेदन कर सकते हैं। आवेदन की अंतिम तिथि चौबीस जुलाई 2026 है। महिलाओं और एससी एसटी अभ्यर्थियों के लिए कोई शुल्क नहीं है। आवेदन करने के लिए ssc.gov.in पर जाएं।",
        faq: [
          { id: "q1", question: "क्या इसमें इंटरव्यू भी होता है?", answer: "नहीं, ग्रुप-B और ग्रुप-C के सभी पदों के लिए इंटरव्यू समाप्त कर दिया गया है। चयन केवल टियर-1 और टियर-2 की लिखित परीक्षा तथा टाइपिंग टेस्ट के आधार पर होगा।" },
          { id: "q2", question: "क्या टाइपिंग टेस्ट अनिवार्य है?", answer: "हाँ, टियर-2 के दौरान सभी पदों के लिए 27 शब्द प्रति मिनट की न्यूनतम टाइपिंग स्पीड की अनिवार्य कंप्यूटर परीक्षा होती है।" },
          { id: "q3", question: "क्या नेगेटिव मार्किंग है?", answer: "हाँ, टियर-1 में प्रत्येक गलत उत्तर के लिए 0.50 अंक और टियर-2 में 1 अंक काटा जाता है।" }
        ]
      },
      english: {
        id: "ssc-en",
        title: "Staff Selection Commission - SSC CGL Exam 2026",
        category: "job",
        language: "english",
        isDemo: true,
        tagline: "Recruitment for 14,800+ Group B & C vacancies in Central Govt Ministries. Eligibility: Any Graduate.",
        officialSource: "Staff Selection Commission (ssc.gov.in)",
        portalUrl: "https://ssc.gov.in",
        keyHighlight: "Last date to apply is July 24, 2026. Tier-1 CBT is scheduled for Sep-Oct 2026!",
        simpleSummary: [
          "Premier national exam for recruitment to Inspector (Income Tax, GST), Assistant Section Officer (ASO in CSS, MEA), Sub-Inspector (CBI), and Auditor positions.",
          "Over 14,800 vacancies across Central Ministries and Departments.",
          "Open to all graduates from recognized universities in any discipline.",
          "Two-tier online examination (Tier 1 qualifying CBT, Tier 2 merit deciding CBT + qualifying Typing test). No viva/interview."
        ],
        importantDates: [
          { title: "Application Window Opens", date: "June 24, 2026", status: "active", daysLeft: 22, badge: "Open" },
          { title: "Application Deadline", date: "July 24, 2026 (23:00 hrs)", status: "urgent", daysLeft: 7, badge: "Urgent" },
          { title: "Fee Payment Deadline", date: "July 25, 2026", status: "future", daysLeft: 8, badge: "Payment" },
          { title: "Application Correction Window", date: "July 28 - 29, 2026", status: "future", daysLeft: 12, badge: "Correction" },
          { title: "Tier-1 Computer Based Exam", date: "September - October 2026", status: "future", daysLeft: 70, badge: "Exam Date" }
        ],
        eligibility: [
          { field: "Educational Qualification", requirement: "Bachelor's Degree in any discipline from a recognized University as of August 1, 2026.", highlight: "Any Graduate" },
          { field: "Age Limit", requirement: "18 to 30 years for most posts (18-32 for Statistical Officer). Age relaxation applicable for reserved categories (SC/ST: 5 yrs, OBC: 3 yrs).", highlight: "18 to 30 Years" },
          { field: "Final Year Students", requirement: "Final year students can apply provided their graduation result is declared on or before August 1, 2026.", highlight: "Cut-off 01/08/2026" }
        ],
        financials: {
          overview: "Pay Level 4 to Level 8 (approx. ₹35,000 to ₹90,000 monthly take-home including DA & HRA).",
          items: [
            { category: "UR / OBC / EWS Male Candidates", amount: "₹100 (One Hundred Only)", details: "Payable via Net Banking, Cards, or UPI" },
            { category: "Women, SC, ST, PwD, Ex-Servicemen", amount: "₹0 (Exempted)", details: "Completely free of application fees" },
            { category: "Salary Range", amount: "Pay Level 4 (₹25,500) to Level 8 (₹1,51,100)", details: "Plus Central Govt dearness and medical perks" }
          ],
          importantNote: "First time correction costs ₹200 and second time costs ₹500, so verify all details carefully during initial submission."
        },
        requiredDocuments: [
          { name: "Live Webcam Photo", mandatory: true, notes: "Captured live via browser/SSC App. Plain white background, no spectacles or headwear" },
          { name: "Scanned Signature", mandatory: true, notes: "Size 10-20 KB, high resolution on white paper with black/blue ink" },
          { name: "10th Class Certificate", mandatory: true, notes: "Required for Date of Birth verification" },
          { name: "Graduation Roll Number & Details", mandatory: true, notes: "To enter passing year, university, and marks" },
          { name: "Photo Identity Proof", mandatory: true, notes: "Aadhaar, Voter ID, Driving License, or Passport" }
        ],
        nextSteps: [
          { id: "ssc1", step: 1, title: "Complete OTR on ssc.gov.in", description: "Set up your verified One-Time Registration with personal and contact details." },
          { id: "ssc2", step: 2, title: "Capture Live Photo Under Good Lighting", description: "Use desktop webcam or mobile browser with clean plain background." },
          { id: "ssc3", step: 3, title: "Select Exam City Choices", description: "Choose 3 examination centers within your preferred state/region." },
          { id: "ssc4", step: 4, title: "Pay ₹100 Fee & Download Final PDF", description: "Ensure payment status reflects 'Success' before July 24." }
        ],
        audioScript: "The Staff Selection Commission has released the official SSC CGL 2026 notification for over fourteen thousand eight hundred vacancies across Central Government Ministries. If you have completed your Bachelor's degree and are between eighteen and thirty years old, you are eligible to apply. The deadline for online submission is July 24, 2026. Application fee is one hundred rupees for general male candidates and completely free for women and reserved categories. Apply online at ssc.gov.in.",
        faq: [
          { id: "q1", question: "Is there any interview for SSC CGL posts?", answer: "No, interviews have been completely abolished for all Group B and C posts. Final selection is based solely on Tier 2 CBT merit." },
          { id: "q2", question: "Is computer typing test compulsory?", answer: "Yes, the Data Entry Speed Test (DEST) of 27 WPM is mandatory for all posts and conducted during Tier 2." },
          { id: "q3", question: "Is there negative marking?", answer: "Yes, Tier 1 has 0.50 negative marking per wrong answer, and Tier 2 has 1 mark deduction per mistake." }
        ]
      },
      hinglish: {
        id: "ssc-hn",
        title: "SSC CGL 2026 - Central Govt Job Notification",
        category: "job",
        language: "hinglish",
        isDemo: true,
        tagline: "Central Government mein 14,800+ Posts! Income Tax, GST, CBI mein Officer banne ka mauka.",
        officialSource: "Staff Selection Commission (ssc.gov.in)",
        portalUrl: "https://ssc.gov.in",
        keyHighlight: "Apply karne ki aakhiri taareekh 24 July 2026 hai! Tier-1 Exam September-October mein hoga.",
        simpleSummary: [
          "Yeh Central Government ki sabse popular vacancy hai jisme Income Tax Inspector, GST Inspector, CSS ASO aur Auditor jaise posts milti hain.",
          "Total 14,800 se zyada vacancies aayi hain.",
          "Kisi bhi subject (BA, B.Sc, B.Com, B.Tech) se Graduate students apply kar sakte hain.",
          "Selection 2 steps mein hoga: Tier-1 aur Tier-2 Computer exam. Koi interview nahi hota!"
        ],
        importantDates: [
          { title: "Form Start Date", date: "24 June 2026", status: "active", daysLeft: 22, badge: "Started" },
          { title: "Form Last Date", date: "24 July 2026 (11 PM)", status: "urgent", daysLeft: 7, badge: "Ending Soon" },
          { title: "Fee Payment Deadline", date: "25 July 2026", status: "future", daysLeft: 8, badge: "Fee Last Date" },
          { title: "Correction Window", date: "28 - 29 July 2026", status: "future", daysLeft: 12, badge: "Correction" },
          { title: "Tier-1 Computer Exam", date: "September - October 2026", status: "future", daysLeft: 70, badge: "Exam Date" }
        ],
        eligibility: [
          { field: "Education", requirement: "1 August 2026 tak kisi bhi recognized college se graduation complete honi chahiye.", highlight: "Any Graduate" },
          { field: "Age Limit", requirement: "18 se 30 saal (kuch posts ke liye 32 saal). SC/ST ko 5 saal aur OBC ko 3 saal ki age relaxation.", highlight: "18 to 30 Years" },
          { field: "Final Year Students", requirement: "Final year wale apply kar sakte hain agar unka result 1 August 2026 se pehle declare ho jaye.", highlight: "Result condition" }
        ],
        financials: {
          overview: "Salary ₹35,000 se ₹90,000 per month (in-hand) + DA, HRA aur medical benefits.",
          items: [
            { category: "General / OBC / EWS Male", amount: "₹100", details: "Online UPI ya card se pay kar sakte hain" },
            { category: "Female, SC, ST, PwD Candidates", amount: "₹0 (Zero Fee)", details: "Poori tarah se form free hai" },
            { category: "Salary Range", amount: "₹35,000 - ₹90,000 / month", details: "Post ke hisab se Level 4 se Level 8 tak" }
          ],
          importantNote: "Form mein galti mat karna, correction karne par pehli baar ₹200 penalty lagegi."
        },
        requiredDocuments: [
          { name: "Live Selfie Photo", mandatory: true, notes: "Webcam se live photo li jayegi, plain background ho aur bina chashme ke" },
          { name: "Signature Image", mandatory: true, notes: "10-20 KB size, plain white paper par blue ya black pen se" },
          { name: "10th Marksheet", mandatory: true, notes: "Date of Birth aur name verify karne ke liye" },
          { name: "Graduation Details", mandatory: true, notes: "Roll number, total marks aur university name" },
          { name: "Original Aadhaar Card", mandatory: true, notes: "Exam hall mein entry ke time le jana hoga" }
        ],
        nextSteps: [
          { id: "ssc1", step: 1, title: "ssc.gov.in par naya OTR registration karein", description: "Purani website ka registration ab nahi chalega, naye portal par OTR banana compulsory hai." },
          { id: "ssc2", step: 2, title: "Proper light mein Live Photo upload karein", description: "Mobile phone ya laptop camera se clear photo capture karein." },
          { id: "ssc3", step: 3, title: "Exam Centers select karein", description: "Apne city ke 3 nearest exam centres choose karein." },
          { id: "ssc4", step: 4, title: "₹100 pay karein aur application form save karein", description: "Payment receipt aur PDF download karke apne phone mein rakh lein." }
        ],
        audioScript: "Hello! Staff Selection Commission ne SSC CGL 2026 ke liye chauda hazar aath sau se zyada vacancies nikaal di hain. Agar aap graduate hain aur aapki age 18 se 30 saal ke beech hai, toh aap Central Government ministries mein officer posts ke liye apply kar sakte hain. Last date 24 July 2026 hai. Females aur SC ST candidates ke liye form free hai. Aaj hi ssc.gov.in par jakar apply karein!",
        faq: [
          { id: "q1", question: "Kya SSC CGL mein interview hota hai?", answer: "Nahi, bilkul nahi! Sabhi posts ke liye interview band ho chuka hai. Sirf Tier 1 aur Tier 2 written test hoga." },
          { id: "q2", question: "Kya typing aana zaroori hai?", answer: "Haan, Tier 2 ke din hi 27 words per minute ki speed se 15 minute ka basic typing test hota hai jo pass karna zaroori hai." },
          { id: "q3", question: "Kya negative marking hai?", answer: "Haan, Tier 1 mein aadhe number (0.50) aur Tier 2 mein ek number ki negative marking hoti hai." }
        ]
      }
    }
  },
  {
    id: "college-exam",
    title: "University Semester Exam & Backlog Fee Circular",
    shortDesc: "Odd Semester Examination forms, backlog paper registration, and mandatory 75% attendance circular.",
    category: "college",
    fileName: "AKTU_Semester_Exam_Backlog_Notice_2026.pdf",
    fileSize: "1.2 MB",
    fileType: "pdf",
    previewBadge: "State Technical University",
    previewSnippet: "Office of the Controller of Examinations - Notification regarding filling of examination form for Regular and Carry Over / Backlog candidates for Odd Semester (Session 2026-27).",
    analyses: {
      hindi: {
        id: "exam-hi",
        title: "विश्वविद्यालय विषम सेमेस्टर परीक्षा एवं बैक-पेपर सूचना 2026",
        category: "college",
        language: "hindi",
        isDemo: true,
        tagline: "बी.टेक, बी.फार्मा, एमसीए, एमबीए नियमित एवं बैक-पेपर छात्रों के लिए परीक्षा फॉर्म और उपस्थिति निर्देश।",
        officialSource: "परीक्षा नियंत्रक कार्यालय, राज्य प्राविधिक विश्वविद्यालय",
        portalUrl: "https://erp.aktu.ac.in",
        keyHighlight: "बिना विलंब शुल्क फॉर्म भरने की अंतिम तिथि 20 अक्टूबर 2026 है। 75% उपस्थिति अनिवार्य!",
        simpleSummary: [
          "सभी 1st, 3rd, 5th और 7th सेमेस्टर के छात्रों को यूनिवर्सिटी ईआरपी (ERP) पोर्टल पर अपना परीक्षा फॉर्म स्वयं भरना होगा।",
          "यदि किसी छात्र का पिछले विषम सेमेस्टर में बैक-पेपर (Carry Over Paper) है, तो इसी फॉर्म के साथ बैक-पेपर चुनकर प्रति विषय ₹1,000 शुल्क जमा करना होगा।",
          "75% से कम उपस्थिति वाले छात्रों का एडमिट कार्ड विश्वविद्यालय द्वारा जारी नहीं किया जाएगा।",
          "फॉर्म सबमिट करने के बाद रसीद अपने कॉलेज के डिपार्टमेंट हेड (HOD) को हस्ताक्षर करवाकर जमा करना अनिवार्य है।"
        ],
        importantDates: [
          { title: "परीक्षा फॉर्म पोर्टल खुला", date: "05 अक्टूबर 2026", status: "active", daysLeft: 12, badge: "शुरू" },
          { title: "सामान्य शुल्क सहित अंतिम तिथि", date: "20 अक्टूबर 2026 (शाम 5 बजे)", status: "urgent", daysLeft: 5, badge: "अंतिम तिथि" },
          { title: "विलंब शुल्क ₹500 के साथ अंतिम अवसर", date: "25 अक्टूबर 2026", status: "future", daysLeft: 10, badge: "लेट फीस के साथ" },
          { title: "एडमिट कार्ड (प्रवेश पत्र) जारी होने की संभावित तिथि", date: "10 नवंबर 2026", status: "future", daysLeft: 26, badge: "एडमिट कार्ड" },
          { title: "विषम सेमेस्टर थ्योरी परीक्षा प्रारंभ", date: "20 नवंबर 2026", status: "future", daysLeft: 36, badge: "परीक्षा शुरुआत" }
        ],
        eligibility: [
          { field: "न्यूनतम उपस्थिति", requirement: "संस्थान में कुल व्याख्यानों की कम से कम 75% अनिवार्य उपस्थिति (मेडिकल आधार पर अधिकतम 10% की छूट मिल सकती है)।", highlight: "75% Attendance" },
          { field: "कॉलेज फीस क्लियरेंस", requirement: "संस्थान की चालू सेमेस्टर ट्यूशन फीस पूरी तरह चुकता होनी चाहिए (No-Dues प्रमाण पत्र)।", highlight: "No Dues Required" },
          { field: "बैक-पेपर पात्रता", requirement: "अधिकतम 5 बैक-पेपर विषयों के लिए एक सेमेस्टर में आवेदन किया जा सकता है।", highlight: "अधिकतम 5 विषय" }
        ],
        financials: {
          overview: "नियमित सेमेस्टर परीक्षा शुल्क कॉलेज फीस में सम्मिलित है; बैक-पेपर का अलग शुल्क देय होगा।",
          items: [
            { category: "नियमित (Regular) छात्र परीक्षा शुल्क", amount: "₹0 (कॉलेज फीस में शामिल)", details: "यदि कॉलेज सेमेस्टर फीस जमा है तो अलग से नहीं देना" },
            { category: "बैक पेपर (Carry Over Fee)", amount: "₹1,000 प्रति विषय", details: "यूनिवर्सिटी पेमेंट गेटवे द्वारा सीधे ऑनलाइन भुगतान" },
            { category: "विलंब शुल्क (Late Fine)", amount: "₹500", details: "20 अक्टूबर के बाद फॉर्म भरने पर देय" }
          ],
          importantNote: "बैक पेपर फीस का भुगतान केवल विश्वविद्यालय के आधिकारिक ERP गेटवे पर ही करें, किसी बाहरी लिंक पर नहीं।"
        },
        requiredDocuments: [
          { name: "ERP लॉगिन क्रेडेंशियल (Roll Number & Password)", mandatory: true, notes: "पासवर्ड भूलने पर कॉलेज नोडल अधिकारी से रीसेट करवाएं" },
          { name: "कॉलेज नो-ड्यूज रसीद (No Dues Receipt)", mandatory: true, notes: "अकाउंट शाखा से प्राप्त मुहरशुदा रसीद" },
          { name: "पिछले सेमेस्टर की इंटरनेट अंकतालिका", mandatory: false, notes: "बैक-पेपर विषय कोड (Subject Code) सही भरने के लिए" }
        ],
        nextSteps: [
          { id: "col1", step: 1, title: "कॉलेज अकाउंट डिपार्टमेंट से No Dues स्लिप प्राप्त करें", description: "सुनिश्चित करें कि लाइब्रेरी और सेमेस्टर फीस क्लियर है।" },
          { id: "col2", step: 2, title: "University ERP पोर्टल पर लॉगिन करें", description: "Exam Form डैशबोर्ड खोलें और अपने रेगुलर एवं बैक-पेपर विषय कोड सावधानी से जांचें।" },
          { id: "col3", step: 3, title: "बैक पेपर फीस (यदि लागू हो) का ऑनलाइन भुगतान करें", description: "प्रति विषय ₹1000 का ऑनलाइन पेमेंट करें और ट्रांजैक्शन रसीद डाउनलोड करें।" },
          { id: "col4", step: 4, title: "फॉर्म का प्रिंटआउट HOD ऑफिस में जमा करें", description: "प्रिंटेड फॉर्म पर अपने हस्ताक्षर करें और 21 अक्टूबर से पहले विभाग में जमा करें।" }
        ],
        audioScript: "विश्वविद्यालय ने विषम सेमेस्टर परीक्षा 2026 का फॉर्म जारी कर दिया है। सभी रेगुलर और बैक-पेपर छात्रों को 20 अक्टूबर 2026 तक यूनिवर्सिटी ईआरपी पोर्टल पर अपना फॉर्म भरना होगा। यदि आपकी किसी विषय में बैक है तो प्रति विषय एक हज़ार रुपये ऑनलाइन फीस देनी होगी। ध्यान रहे, परीक्षा में बैठने के लिए पचहत्तर प्रतिशत उपस्थिति अनिवार्य है। समय रहते अपना फॉर्म भरें और प्रिंट कॉलेज में जमा करें।",
        faq: [
          { id: "q1", question: "अगर मेरी उपस्थिति 70% है तो क्या मैं परीक्षा दे पाऊंगा?", answer: "यदि आपके पास वैध मेडिकल प्रमाण पत्र है तो संस्थान प्रमुख 10% तक की छूट दे सकते हैं, अन्यथा विश्वविद्यालय एडमिट कार्ड रोक सकता है।" },
          { id: "q2", question: "क्या बैक पेपर की कोई परीक्षा अलग से होगी?", answer: "नहीं, विषम सेमेस्टर के बैक-पेपर की परीक्षा नियमित विषम सेमेस्टर की मुख्य परीक्षाओं के साथ ही आयोजित की जाएगी।" },
          { id: "q3", question: "अगर विषय कोड गलत भर गया तो क्या करें?", answer: "फॉर्म फाइनल सबमिट करने से पहले विषय कोड कॉलेज के सिलेबस से मिला लें। सबमिट होने के बाद केवल कॉलेज परीक्षा अधीक्षक ही सुधार का अनुरोध भेज सकते हैं।" }
        ]
      },
      english: {
        id: "exam-en",
        title: "University Odd Semester Exam & Backlog Circular 2026",
        category: "college",
        language: "english",
        isDemo: true,
        tagline: "Examination form submission & backlog subject registration for B.Tech, B.Pharm, MCA & MBA.",
        officialSource: "Office of the Controller of Examinations, State Technical University",
        portalUrl: "https://erp.aktu.ac.in",
        keyHighlight: "Last date without late fee is October 20, 2026. 75% attendance is strictly mandatory!",
        simpleSummary: [
          "Mandatory examination form filling on the University ERP portal for all 1st, 3rd, 5th, and 7th-semester regular students.",
          "Students with carryover/backlog subjects in previous odd semesters must register their back-paper subjects with an online fee of ₹1,000 per paper.",
          "75% minimum classroom attendance is mandatory to become eligible for hall ticket/admit card release.",
          "Hard copy of the submitted form along with the college No-Dues slip must be submitted to the respective department HOD."
        ],
        importantDates: [
          { title: "Exam Form Portal Active", date: "October 05, 2026", status: "active", daysLeft: 12, badge: "Open" },
          { title: "Last Date Without Late Fee", date: "October 20, 2026 (17:00 hrs)", status: "urgent", daysLeft: 5, badge: "Deadline" },
          { title: "Late Fee Window (₹500 penalty)", date: "October 25, 2026", status: "future", daysLeft: 10, badge: "Late Fee" },
          { title: "Admit Card Download Starts", date: "November 10, 2026", status: "future", daysLeft: 26, badge: "Hall Ticket" },
          { title: "Commencement of Theory Exams", date: "November 20, 2026", status: "future", daysLeft: 36, badge: "Exams Start" }
        ],
        eligibility: [
          { field: "Minimum Attendance", requirement: "Minimum 75% physical attendance in lectures and practical sessions (up to 10% waiver on certified medical grounds).", highlight: "75% Attendance" },
          { field: "Institutional Clearance", requirement: "Complete semester fee clearance and clearance from library and labs (No Dues certificate).", highlight: "No Dues Required" },
          { field: "Carry Over Limits", requirement: "Maximum of 5 backlog theory subjects permitted per examination session.", highlight: "Max 5 subjects" }
        ],
        financials: {
          overview: "Regular exam fees included in semester tuition; carry-over papers require online fee payment.",
          items: [
            { category: "Regular Examination Fee", amount: "₹0 (Included in tuition)", details: "No extra fee if college semester dues are cleared" },
            { category: "Carry Over / Backlog Paper Fee", amount: "₹1,000 per subject", details: "Payable directly via University ERP payment gateway" },
            { category: "Late Penalty Fee", amount: "₹500", details: "Applicable if submitted between Oct 21 and Oct 25" }
          ],
          importantNote: "Pay backlog fees only through the official university student portal; avoid fraudulent third-party payment links."
        },
        requiredDocuments: [
          { name: "ERP Login Credentials", mandatory: true, notes: "University roll number and password" },
          { name: "College No-Dues Clearance Receipt", mandatory: true, notes: "Issued by accounts section confirming no outstanding dues" },
          { name: "Previous Semester Web Grade Sheet", mandatory: false, notes: "Useful to cross-verify exact subject codes for backlogs" }
        ],
        nextSteps: [
          { id: "col1", step: 1, title: "Obtain No-Dues Clearance from College Office", description: "Ensure your semester tuition and library books are cleared." },
          { id: "col2", step: 2, title: "Log in to the University ERP Student Portal", description: "Navigate to 'Examination Form 2026' and verify pre-selected regular subjects." },
          { id: "col3", step: 3, title: "Select Backlog Papers & Pay Fee Online", description: "Select odd-semester carry-over papers and pay ₹1,000 per subject via UPI or Debit card." },
          { id: "col4", step: 4, title: "Submit Signed Printout to Department HOD", description: "Sign the confirmation page and submit it to your department coordinator by Oct 21." }
        ],
        audioScript: "Attention students! The State Technical University has activated the examination form portal for Odd Semester 2026 exams. The deadline to fill the form without any late fee is October 20, 2026. If you have backlogs, you must select the subject codes and pay one thousand rupees per paper online. Please note that seventy-five percent attendance is strictly required to get your admit card. Log in to your university ERP portal right away to complete the process.",
        faq: [
          { id: "q1", question: "Can a student with 68% attendance write the semester exams?", answer: "A condonation of up to 10% is permissible only on valid medical grounds approved by the college director, failing which the student is detained." },
          { id: "q2", question: "When will the backlog examinations be held?", answer: "Backlog exams are conducted simultaneously with the regular odd-semester examination timetable." },
          { id: "q3", question: "What if I accidentally selected the wrong elective subject code?", answer: "Elective changes can only be modified through the college examination superintendent before the final lock date of October 20." }
        ]
      },
      hinglish: {
        id: "exam-hn",
        title: "University Semester Exam & Backlog Form 2026",
        category: "college",
        language: "hinglish",
        isDemo: true,
        tagline: "Odd semester regular aur carry-over exam forms active! Last date 20 October 2026.",
        officialSource: "Controller of Examinations, State Technical University",
        portalUrl: "https://erp.aktu.ac.in",
        keyHighlight: "Bina late fee form bharne ki aakhiri taareekh 20 October 2026 hai. 75% attendance zaroori!",
        simpleSummary: [
          "1st, 3rd, 5th aur 7th semester ke sabhi students ko University ERP par exam form bharna mandatory hai.",
          "Agar kisi purane odd semester mein back-paper (carry over) hai, toh per paper ₹1,000 online fee pay karni hogi.",
          "Admit card ke liye 75% attendance compulsory hai, warna college detain kar sakta hai.",
          "Form submit karke print nikaalein aur HOD signature ke sath department mein submit karein."
        ],
        importantDates: [
          { title: "Exam Portal Open", date: "05 October 2026", status: "active", daysLeft: 12, badge: "Active" },
          { title: "Last Date (Without Late Fee)", date: "20 October 2026 (5 PM)", status: "urgent", daysLeft: 5, badge: "Deadline" },
          { title: "Late Fee Window (₹500 Extra)", date: "25 October 2026", status: "future", daysLeft: 10, badge: "Late Fee" },
          { title: "Admit Card Release Date", date: "10 November 2026", status: "future", daysLeft: 26, badge: "Admit Card" },
          { title: "Semester Exams Start", date: "20 November 2026", status: "future", daysLeft: 36, badge: "Exam Date" }
        ],
        eligibility: [
          { field: "Attendance Requirement", requirement: "Class aur lab mein minimum 75% attendance honi chahiye (Medical grounds par 10% tak relief).", highlight: "75% Attendance" },
          { field: "College No-Dues", requirement: "College ki tuition aur library dues clear hone chahiye.", highlight: "No Dues Required" },
          { field: "Carry Over Subjects", requirement: "Ek semester exam mein maximum 5 backlog subjects de sakte hain.", highlight: "Max 5 subjects" }
        ],
        financials: {
          overview: "Regular exam fees college fees mein already included hai; back papers ki extra fees lagegi.",
          items: [
            { category: "Regular Students Exam Fee", amount: "₹0 (College fee mein included)", details: "Alag se koi regular exam fee nahi deni" },
            { category: "Backlog / Carry Over Fee", amount: "₹1,000 per paper", details: "University portal par direct UPI/Card se pay karein" },
            { category: "Late Fine", amount: "₹500", details: "20 October ke baad form bharne par lagega" }
          ],
          importantNote: "Backlog fee kisi third party app par pay na karein, sirf university ERP portal par hi karein."
        },
        requiredDocuments: [
          { name: "University ERP Login ID & Password", mandatory: true, notes: "Roll number aur password" },
          { name: "College Accounts No-Dues Slip", mandatory: true, notes: "College fee cleared receipt" },
          { name: "Previous Marksheet", mandatory: false, notes: "Subject code cross check karne ke liye" }
        ],
        nextSteps: [
          { id: "col1", step: 1, title: "Accounts office se No-Dues receipt lein", description: "Ensure karein ki library aur pending college dues cleared hain." },
          { id: "col2", step: 2, title: "University ERP portal par login karein", description: "Exam Form section mein jakar apne regular subjects check karein." },
          { id: "col3", step: 3, title: "Backlog papers select karein aur ₹1000 per subject pay karein", description: "UPI ya card se secure payment complete karein." },
          { id: "col4", step: 4, title: "Form ka print nikal kar HOD ko submit karein", description: "21 October se pehle branch coordinator ke pass submit karein." }
        ],
        audioScript: "Hello students! University ne odd semester 2026 exam form nikaal diya hai. Bina kisi late fees ke form bharne ki last date 20 October 2026 hai. Agar aapka kisi subject mein backlog hai toh ek hazaar rupaye per subject online pay karna hoga. 75% attendance poori hona compulsory hai warna admit card nahi aayega. Apne ERP portal par jakar aaj hi form lock karein!",
        faq: [
          { id: "q1", question: "Attendance 75% se kam ho toh kya hoga?", answer: "College principal medical grounds par 10% tak excuse kar sakte hain, warna exam se detain kiya ja sakta hai." },
          { id: "q2", question: "Back paper kab honge?", answer: "Regular semester exams ke sath hi back-paper exams conduct honge." }
        ]
      }
    }
  },
  {
    id: "govt-pmkisan",
    title: "PM-Kisan 17th Installment Mandatory e-KYC Circular",
    shortDesc: "Ministry of Agriculture notice regarding mandatory biometric/OTP e-KYC and land seeding for ₹2,000 installment.",
    category: "government",
    fileName: "PM_Kisan_17th_Installment_eKYC_Notice.pdf",
    fileSize: "1.8 MB",
    fileType: "pdf",
    previewBadge: "Ministry of Agriculture & Farmers Welfare",
    previewSnippet: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) Notification: Mandatory guidelines regarding Aadhaar e-KYC, Land Seeding Verification, and Direct Benefit Transfer (DBT) account linking.",
    analyses: {
      hindi: {
        id: "pmk-hi",
        title: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN) - 17वीं किस्त एवं e-KYC निर्देश",
        category: "government",
        language: "hindi",
        isDemo: true,
        tagline: "किसानों के खाते में ₹2,000 की अगली किस्त पाने के लिए e-KYC और भूलेख अंकन (Land Seeding) अनिवार्य।",
        officialSource: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
        portalUrl: "https://pmkisan.gov.in",
        keyHighlight: "31 जुलाई 2026 से पहले e-KYC नहीं कराने पर अगली किस्त रोक दी जाएगी!",
        simpleSummary: [
          "प्रधानमंत्री किसान सम्मान निधि योजना के तहत सभी पंजीकृत किसान परिवारों को सालाना ₹6,000 (तीन समान किस्तों में ₹2,000) दिए जाते हैं।",
          "17वीं किस्त जारी होने से पहले सरकार ने 3 चीजें अनिवार्य कर दी हैं: आधार e-KYC, भूलेख अंकन (Land Seeding) और बैंक खाते का आधार से DBT लिंक होना।",
          "e-KYC आप अपने मोबाइल से OTP द्वारा घर बैठे फ्री में कर सकते हैं या नजदीकी CSC केंद्र पर जाकर फिंगरप्रिंट से करवा सकते हैं।",
          "यदि इनमें से एक भी काम अधूरा रहा, तो किस्त का पैसा खाते में नहीं आएगा।"
        ],
        importantDates: [
          { title: "e-KYC और लैंड सीडिंग की अंतिम तिथि", date: "31 जुलाई 2026", status: "urgent", daysLeft: 14, badge: "अनिवार्य अंतिम तिथि" },
          { title: "गाँव स्तर पर किसान समाधान शिविर", date: "15 जुलाई - 25 जुलाई 2026", status: "active", daysLeft: 8, badge: "कैंप खुला है" },
          { title: "17वीं किस्त बैंक खातों में भेजने की संभावित तिथि", date: "15 अगस्त 2026", status: "future", daysLeft: 29, badge: "पैसा आने की तिथि" }
        ],
        eligibility: [
          { field: "पात्र किसान", requirement: "ऐसे किसान परिवार जिनके पास अपने नाम पर खेती योग्य भूमि का कानूनी मालिकाना हक है।", highlight: "भू-स्वामी किसान" },
          { field: "अपात्र श्रेणियां (कौन पात्र नहीं हैं)", requirement: "संवैधानिक पदधारक, सेवारत या सेवानिवृत्त सरकारी कर्मचारी, ₹10,000 से अधिक मासिक पेंशनभोगी, और आयकर (Income Tax) भरने वाले व्यक्ति।", highlight: "सरकारी व टैक्सपेयर अपात्र" },
          { field: "आवश्यक सत्यापन", requirement: "राजस्व रिकॉर्ड में किसान की खतौनी/जमीन का रिकॉर्ड पीएम किसान पोर्टल से मैप होना चाहिए।", highlight: "Land Seeding Yes" }
        ],
        financials: {
          overview: "प्रत्येक 4 माह में ₹2,000 की वित्तीय सहायता (सालाना ₹6,000) सीधे खाते में।",
          items: [
            { category: "17वीं किस्त राशि", amount: "₹2,000 प्रति पात्र किसान", details: "आधार से जुड़े बैंक खाते में सीधा DBT ट्रांसफर" },
            { category: "OTP e-KYC शुल्क (मोबाइल द्वारा)", amount: "₹0 (निःशुल्क)", details: "pmkisan.gov.in पोर्टल या PM-Kisan ऐप पर बिल्कुल फ्री" },
            { category: "CSC सेंटर बायोमेट्रिक शुल्क", amount: "₹15 (सरकारी निर्धारित)", details: "बायोमेट्रिक फिंगरप्रिंट प्रमाणीकरण का न्यूनतम शुल्क" }
          ],
          importantNote: "कोई भी व्यक्ति या जनसेवा केंद्र e-KYC के लिए ₹15 से अधिक नहीं ले सकता।"
        },
        requiredDocuments: [
          { name: "आधार कार्ड (Aadhaar Card)", mandatory: true, notes: "e-KYC OTP के लिए मोबाइल से लिंक होना चाहिए" },
          { name: "जमीन की खतौनी / भू-अभिलेख (Land Record)", mandatory: true, notes: "पटवारी या लेखपाल से प्रमाणित खतौनी नकल" },
          { name: "बैंक खाता पासबुक", mandatory: true, notes: "बैंक में NPCI मैपर पर आधार लिंक होना अनिवार्य है" }
        ],
        nextSteps: [
          { id: "pm1", step: 1, title: "pmkisan.gov.in पर जाकर 'Know Your Status' चेक करें", description: "जांचें कि e-KYC: Yes, Land Seeding: Yes, और Aadhaar Bank Account Seeding: Yes लिखा आ रहा है या नहीं।" },
          { id: "pm2", step: 2, title: "यदि e-KYC No है तो OTP या फिंगरप्रिंट से तुरंत पूर्ण करें", description: "पोर्टल पर 'e-KYC' विकल्प चुनें और आधार नंबर डालकर ओटीपी दर्ज करें।" },
          { id: "pm3", step: 3, title: "यदि Land Seeding No है तो हल्का लेखपाल/पटवारी से संपर्क करें", description: "अपनी जमीन की खतौनी और आधार कार्ड की प्रति लेखपाल को देकर सत्यापन कराएं।" },
          { id: "pm4", step: 4, title: "बैंक जाकर DBT (NPCI) मैपिंग करवाएं", description: "यदि बैंक स्टेटस No है तो अपने बैंक में जाकर आधार सीडिंग फॉर्म भरें।" }
        ],
        audioScript: "किसान भाइयों और बहनों, नमस्कार! प्रधानमंत्री किसान सम्मान निधि योजना की 17वीं किस्त पाने के लिए भारत सरकार ने e-KYC और जमीन का सत्यापन यानी लैंड सीडिंग अनिवार्य कर दिया है। यदि आपने अभी तक e-KYC नहीं कराया है तो 31 जुलाई 2026 से पहले pmkisan.gov.in पोर्टल पर जाकर या नजदीकी जनसेवा केंद्र पर जाकर करवा लें। इसके बिना आपके खाते में दो हज़ार रुपये की किस्त नहीं आएगी। अपना आधार बैंक से ज़रूर लिंक रखें।",
        faq: [
          { id: "q1", question: "क्या पति और पत्नी दोनों को पीएम किसान का लाभ मिल सकता है?", answer: "नहीं, योजना के नियमों के अनुसार एक किसान परिवार (पति, पत्नी और नाबालिग बच्चे) में से केवल एक ही व्यक्ति को ₹6,000 का लाभ मिल सकता है।" },
          { id: "q2", question: "अगर मोबाइल नंबर आधार से लिंक नहीं है तो e-KYC कैसे करें?", answer: "आप किसी भी नजदीकी CSC (कॉमन सर्विस सेंटर) या डाकघर में जाकर बायोमेट्रिक फिंगरप्रिंट या आइरिस स्कैन द्वारा e-KYC करवा सकते हैं।" },
          { id: "q3", question: "लैंड सीडिंग 'No' आ रहा है तो क्या करें?", answer: "अपने क्षेत्र के लेखपाल (पटवारी) या कृषि उप-निदेशक कार्यालय में जाकर अपनी जमीन की खतौनी, आधार कार्ड और बैंक पासबुक जमा करें।" }
        ]
      },
      english: {
        id: "pmk-en",
        title: "PM-KISAN 17th Installment & Mandatory e-KYC Notice",
        category: "government",
        language: "english",
        isDemo: true,
        tagline: "Mandatory e-KYC and Land Seeding verification for the release of the upcoming ₹2,000 benefit.",
        officialSource: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
        portalUrl: "https://pmkisan.gov.in",
        keyHighlight: "Deadline to complete e-KYC is July 31, 2026. Without this, installment will be withheld!",
        simpleSummary: [
          "Under the PM-KISAN scheme, eligible farmer families receive ₹6,000 per year in three installments of ₹2,000 each.",
          "For the upcoming 17th installment, three mandatory verifications are enforced: Aadhaar e-KYC, Land Seeding, and Aadhaar-DBT linked bank account.",
          "OTP-based e-KYC can be completed for free via the official website or mobile app, while biometric e-KYC is available at CSC centers.",
          "Failure to verify before July 31 will lead to withholding of beneficiary payments."
        ],
        importantDates: [
          { title: "Mandatory e-KYC Deadline", date: "July 31, 2026", status: "urgent", daysLeft: 14, badge: "Strict Deadline" },
          { title: "Village Level Farmer Resolution Camps", date: "July 15 - 25, 2026", status: "active", daysLeft: 8, badge: "Active Camps" },
          { title: "Expected 17th Installment DBT Credit", date: "August 15, 2026", status: "future", daysLeft: 29, badge: "Disbursement" }
        ],
        eligibility: [
          { field: "Eligible Farmers", requirement: "Small and marginal landholder farmer families with cultivable landholding in their name.", highlight: "Landholding Farmers" },
          { field: "Exclusion Criteria", requirement: "Institutional landholders, constitutional post holders, serving/retired govt employees, income tax payees, and pensioners earning >₹10,000/month.", highlight: "Tax Payers Ineligible" },
          { field: "Required Portal Status", requirement: "e-KYC status must show 'Yes', Land Seeding must show 'Yes', and Bank Aadhaar Status must show 'Active'.", highlight: "All 3 Clearances" }
        ],
        financials: {
          overview: "Direct Benefit Transfer (DBT) of ₹2,000 credited every 4 months (₹6,000 annually).",
          items: [
            { category: "17th Installment Amount", amount: "₹2,000 per eligible farmer", details: "Transferred directly to Aadhaar-seeded bank account" },
            { category: "OTP e-KYC via pmkisan.gov.in", amount: "₹0 (Free of cost)", details: "Do it directly using Aadhaar linked mobile number" },
            { category: "Biometric e-KYC at CSC Center", amount: "₹15 (Govt fixed charge)", details: "Authorized fee for fingerprint biometric verification" }
          ],
          importantNote: "Do not pay more than ₹15 at CSCs; online OTP verification is 100% free."
        },
        requiredDocuments: [
          { name: "Aadhaar Card", mandatory: true, notes: "Must be mobile-linked for OTP or carried to CSC for biometric" },
          { name: "Land Record Document (Khatauni / Jamabandi)", mandatory: true, notes: "Certified revenue copy proving land ownership" },
          { name: "Bank Passbook Copy", mandatory: true, notes: "Account must be seeded with NPCI mapper" }
        ],
        nextSteps: [
          { id: "pm1", step: 1, title: "Check status on pmkisan.gov.in", description: "Click 'Know Your Status' and input your registration number." },
          { id: "pm2", step: 2, title: "Complete e-KYC if status shows 'No'", description: "Enter your Aadhaar number and OTP to complete instant e-KYC." },
          { id: "pm3", step: 3, title: "Visit local Lekhpal / Patwari for Land Seeding", description: "Submit your land records (Khatauni) for online database mapping." },
          { id: "pm4", step: 4, title: "Enable NPCI DBT in your bank branch", description: "Submit the Aadhaar seeding consent form to ensure smooth subsidy transfer." }
        ],
        audioScript: "Important announcement for all registered farmers! To receive the upcoming seventeenth installment of two thousand rupees under PM-KISAN, the Government of India has made Aadhaar e-KYC and land seeding verification compulsory. Please complete your e-KYC before July 31, 2026 on the pmkisan.gov.in portal or at your nearest CSC center. Ensure your bank account is linked with Aadhaar so that the amount is credited on time.",
        faq: [
          { id: "q1", question: "Can both husband and wife receive PM-KISAN installments?", answer: "No, under scheme guidelines, only one beneficiary per farming family (husband, wife, and minor children) is eligible." },
          { id: "q2", question: "What to do if my mobile number is not linked to Aadhaar?", answer: "You can visit any authorized Common Service Center (CSC) or Post Office and complete e-KYC via fingerprint biometric scan." }
        ]
      },
      hinglish: {
        id: "pmk-hn",
        title: "PM-Kisan 17th Installment & e-KYC Guidelines",
        category: "government",
        language: "hinglish",
        isDemo: true,
        tagline: "Agli ₹2,000 ki installment lene ke liye e-KYC aur Land Seeding mandatory hai!",
        officialSource: "Ministry of Agriculture & Farmers Welfare",
        portalUrl: "https://pmkisan.gov.in",
        keyHighlight: "31 July 2026 se pehle e-KYC complete karein warna ₹2,000 ki kist ruk jayegi!",
        simpleSummary: [
          "PM Kisan scheme mein sabhi kisan bhaiyo ko saalana ₹6,000 (3 installments of ₹2,000) milte hain.",
          "17th installment ke liye 3 cheezein zaroori hain: Aadhaar e-KYC, Land Seeding (zameen ka verification), aur Bank Account DBT link.",
          "Aap pmkisan.gov.in par jakar free mein mobile OTP se e-KYC kar sakte ho ya CSC center ja sakte ho.",
          "Agar yeh teeno step complete nahi huye toh agla paisa bank account mein nahi aayega."
        ],
        importantDates: [
          { title: "e-KYC Last Date", date: "31 July 2026", status: "urgent", daysLeft: 14, badge: "Deadline" },
          { title: "Kisan Samadhan Camps in Villages", date: "15 - 25 July 2026", status: "active", daysLeft: 8, badge: "Camps Open" },
          { title: "17th Installment Expected Date", date: "15 August 2026", status: "future", daysLeft: 29, badge: "Payment Date" }
        ],
        eligibility: [
          { field: "Eligible Farmers", requirement: "Woh kisan jinke khud ke naam par agricultural land registered hai.", highlight: "Land Owners" },
          { field: "Kaun Eligible Nahi Hain", requirement: "Sarkari naukri wale, Income tax bharne wale, aur ₹10,000 se zyada pension lene wale.", highlight: "Tax Payers Out" },
          { field: "Portal Status", requirement: "Portal par e-KYC, Land Seeding aur Bank DBT teeno 'YES' hona chahiye.", highlight: "Teeno Yes" }
        ],
        financials: {
          overview: "Direct ₹2,000 har 4 mahine mein bank account mein direct credit.",
          items: [
            { category: "17th Installment Amount", amount: "₹2,000", details: "Aadhaar linked bank account mein aayega" },
            { category: "OTP e-KYC via Mobile", amount: "₹0 (Free)", details: "Website par khud se karein bina kisi kharche ke" },
            { category: "CSC Center Biometric Fee", amount: "₹15", details: "CSC par fingerprint se karne ka sarkari charge" }
          ],
          importantNote: "CSC par ₹15 se zyada kisi ko na dein, online OTP verification 100% free hai."
        },
        requiredDocuments: [
          { name: "Aadhaar Card", mandatory: true, notes: "Mobile number link ho OTP ke liye ya fingerprint se CSC par" },
          { name: "Khatauni (Zameen ki Nakal)", mandatory: true, notes: "Lekhpal verification ke liye zaroori" },
          { name: "Bank Passbook", mandatory: true, notes: "NPCI DBT active hona zaroori" }
        ],
        nextSteps: [
          { id: "pm1", step: 1, title: "pmkisan.gov.in par 'Know Your Status' check karein", description: "Registration number daalkar dekhein teeno parameter YES hain ya nahi." },
          { id: "pm2", step: 2, title: "Agar e-KYC NO hai toh turant OTP se karein", description: "Aadhaar number enter karein aur mobile par aaya OTP dalein." },
          { id: "pm3", step: 3, title: "Land Seeding NO ho toh Lekhpal ko Khatauni dein", description: "Apne gaon ke Patwari ya Lekhpal se contact karein." },
          { id: "pm4", step: 4, title: "Bank jakar DBT form bharein", description: "Bank branch jakar Aadhaar NPCI seeding confirm karein." }
        ],
        audioScript: "Kisan bhaiyo aur behno! PM Kisan Samman Nidhi ki satrahvi kist pane ke liye government ne e-KYC aur zameen ka record check karwana compulsory kar diya hai. Agar aapne abhi tak e-KYC nahi karaya hai toh ikattis July 2026 se pehle pmkisan.gov.in portal par jakar ya CSC center par jakar zaroor karwa lein. Warna aapke account mein do hazar rupaye ki agli kist ruk jayegi.",
        faq: [
          { id: "q1", question: "Kya pati aur patni dono ko paisa mil sakta hai?", answer: "Nahi, ek family (pati, patni aur minor bacche) mein sirf ek hi person ko PM Kisan ka labh milta hai." },
          { id: "q2", question: "Aadhaar mein phone number link na ho toh kya karein?", answer: "Aap kisi bhi CSC center par jakar finger laga kar biometric e-KYC karwa sakte hain." }
        ]
      }
    }
  }
];
