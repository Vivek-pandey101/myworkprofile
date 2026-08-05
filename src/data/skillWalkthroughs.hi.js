/* ------------------------------------------------------------------ *
 *  हिंदी अनुवाद परत — Hindi translation layer                          *
 *                                                                      *
 *  Same shape as skillWalkthroughs.js, but only the prose. Arrays line  *
 *  up by position with the English ones, and lib/overlay.js merges them *
 *  key by key — anything missing here falls back to English.            *
 *                                                                      *
 *  Deliberately NOT translated: commands, file contents, file paths and *
 *  literal error messages. Those are code — a translated command would  *
 *  not run, and a translated error message cannot be searched for.      *
 *                                                                      *
 *  Technical nouns (instance, branch, reverse proxy) stay in English    *
 *  because that is what they are called in every real job and doc.      *
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  AWS EC2                                                            */
/* ------------------------------------------------------------------ */
const awsEc2 = {
  tagline: 'Elastic Compute Cloud — क्लाउड में किराए पर मिलने वाला सर्वर',
  overview: {
    what: 'Amazon EC2 आपको AWS के डेटा सेंटर में चल रही वर्चुअल मशीन (instance) देता है। OS, CPU/RAM, स्टोरेज और नेटवर्किंग आप चुनते हैं, और जितना इस्तेमाल किया उतना ही पैसा लगता है।',
    why: 'अपना हार्डवेयर ख़रीदने की ज़रूरत ख़त्म हो जाती है, कुछ मिनटों में मशीन छोटी-बड़ी की जा सकती है, और पूरे सर्वर पर root/SSH कंट्रोल मिलता है — Node.js API, डेटाबेस और फ़ुल स्टैक ऐप होस्ट करने के लिए यही सबसे आम तरीका है।',
    useCases: [
      'Nginx के पीछे Node.js/Express बैकएंड और React फ़्रंटएंड होस्ट करना',
      'बैकग्राउंड जॉब, cron टास्क और worker प्रोसेस चलाना',
      'अपना MongoDB या cache सर्वर ख़ुद मैनेज करना',
      'एक जैसे कॉन्फ़िग वाले staging और production एनवायरनमेंट',
    ],
  },
  beginner: {
    simple:
      'EC2 मतलब Amazon से किराए पर लिया हुआ कंप्यूटर। यह असली Linux मशीन है जो किसी डेटा सेंटर में रखी है, बस आप उसे हार्डवेयर ख़रीदकर नहीं, एक बटन दबाकर बनाते हैं। आपको एक username, एक key फ़ाइल और एक IP address मिलता है — उसके बाद यह बिल्कुल आपके लैपटॉप जैसी है, जिसे आप एक काली टर्मिनल स्क्रीन से चलाते हैं।',
    analogy:
      'इसे घर बनाने की जगह फ़्लैट किराए पर लेना समझिए: बिल्डिंग, बिजली और चौकीदार Amazon के हैं; चाबी आपकी है, अंदर कौन-सा सामान (सॉफ़्टवेयर) रखना है वह आप तय करते हैं, और जब तक रखते हैं तब तक किराया देते हैं।',
    before: [
      'एक AWS अकाउंट (free tier के लिए भी कार्ड लगाना ज़रूरी है)।',
      'एक टर्मिनल: macOS/Linux पर Terminal, Windows पर Git Bash या Windows Terminal।',
      'आपका प्रोजेक्ट GitHub पर पुश किया हुआ, ताकि सर्वर उसे डाउनलोड कर सके।',
    ],
  },
  glossary: [
    { meaning: 'एक किराए की वर्चुअल मशीन। "instance launch करना" मतलब सर्वर बनाना।' },
    { meaning: 'Amazon Machine Image — वह OS टेम्पलेट जिससे सर्वर बूट होता है, जैसे Ubuntu 22.04।' },
    { meaning: 'मशीन का साइज़: t3.micro = 2 vCPU / 1 GB RAM। जितना बड़ा टाइप, उतनी ताक़त और उतना ख़र्च।' },
    { meaning: 'पासवर्ड की जगह इस्तेमाल होने वाली चाबी। आधा हिस्सा Amazon रखता है, आधा आप — और वह सिर्फ़ एक बार डाउनलोड होता है। खो गया तो SSH access भी गया।' },
    { meaning: 'फ़ायरवॉल। यह तय करता है कि बाहर की दुनिया कौन-से port तक पहुँच सकती है (22 = SSH, 80 = HTTP, 443 = HTTPS)।' },
    { meaning: 'हमेशा एक ही रहने वाला public IP। इसके बिना, हर बार सर्वर stop/start करने पर IP बदल जाता है।' },
    { meaning: 'instance से जुड़ी वर्चुअल हार्ड डिस्क। reboot में बची रहती है, पर instance डिलीट करने पर आम तौर पर साथ ही चली जाती है।' },
    { meaning: 'डेटा सेंटर की जगह, जैसे ap-south-1 = मुंबई। वही चुनिए जो आपके यूज़र्स के सबसे पास हो।' },
  ],
  walkthrough: {
    title: 'ख़ाली AWS अकाउंट से लेकर लाइव Node.js API तक',
    intro:
      'स्टेप्स को इसी क्रम में कीजिए। स्टेप 4 के बाद सब कुछ सर्वर के अंदर होता है, इसलिए वही कमांड Windows, macOS और Linux — तीनों पर चलेंगे।',
    steps: [
      {
        title: 'सर्वर बनाइए (instance launch कीजिए)',
        why: 'यह अकेला हिस्सा है जो टाइप करके नहीं, क्लिक करके होता है। यहाँ आप तय करते हैं कि कौन-सा OS चलेगा, मशीन कितनी बड़ी होगी, और कौन-सी चाबी उसे खोलेगी।',
        ui: [
          'AWS Console में लॉगिन कीजिए और ऊपर सर्च बार में "EC2" खोजिए।',
          'ऊपर दाईं तरफ़ region देखिए (जैसे Asia Pacific (Mumbai) ap-south-1) — आप जो कुछ बनाएँगे वह सिर्फ़ उसी region में रहेगा।',
          'Launch instance पर क्लिक कीजिए और नाम दीजिए, जैसे my-api-prod।',
          'Application and OS Images → Ubuntu Server 22.04 LTS चुनिए (free tier में आता है)।',
          'Instance type → छोटे ऐप के लिए t3.micro (या t2.micro)।',
          'Key pair → Create new key pair → नाम my-api-key, टाइप RSA, फ़ॉर्मैट .pem → Create। फ़ाइल सिर्फ़ एक ही बार डाउनलोड होगी।',
          'Network settings → Edit → SSH (port 22) को My IP से allow कीजिए, और Allow HTTP तथा Allow HTTPS पर टिक लगाइए।',
          'Launch instance दबाइए, फिर साइडबार में Instances खोलकर state के "Running" होने का इंतज़ार कीजिए।',
        ],
        check:
          'instance की लाइन में Public IPv4 address दिखने लगेगा, जैसे 13.235.10.20 — अब यही आपका सर्वर पता है।',
        note:
          'SSH हमेशा "My IP" पर रखिए, "Anywhere (0.0.0.0/0)" पर कभी नहीं। पूरे इंटरनेट के लिए port 22 खोलने पर कुछ ही मिनटों में बॉट पासवर्ड ट्राई करना शुरू कर देते हैं।',
      },
      {
        title: 'key फ़ाइल को सही जगह रखिए और उसकी permission कस दीजिए',
        why: 'अगर key फ़ाइल को आपके कंप्यूटर का कोई और यूज़र भी पढ़ सकता है तो SSH उसे इस्तेमाल करने से मना कर देता है। पहली बार में सबसे ज़्यादा यही गलती होती है।',
        explain: [
          { meaning: 'अगर ~/.ssh फ़ोल्डर नहीं है तो बना दीजिए (यह छिपा हुआ फ़ोल्डर है)।' },
          { meaning: 'डाउनलोड की गई key को Downloads से हटाकर उसी फ़ोल्डर में रख दीजिए।' },
          { meaning: 'permission: सिर्फ़ आप पढ़ सकें, बाकी कोई नहीं।' },
        ],
        check: 'ls -l ~/.ssh/my-api-key.pem का जवाब -r-------- से शुरू होना चाहिए।',
        note:
          'Windows PowerShell में chmod नहीं होता। या तो Git Bash इस्तेमाल कीजिए (यही आसान है), या यह चलाइए: icacls "C:\\Users\\You\\.ssh\\my-api-key.pem" /inheritance:r /grant:r "%USERNAME%:R"',
      },
      {
        title: 'SSH से सर्वर में लॉगिन कीजिए',
        why: 'SSH आपको दूर रखी मशीन का टर्मिनल देता है। इसके बाद आप जो भी कमांड टाइप करेंगे वह आपके लैपटॉप पर नहीं, सर्वर पर चलेगा।',
        explain: [
          { meaning: 'identity file — वही private key जो बताती है कि आप ही हैं।' },
          { meaning: 'Ubuntu इमेज का डिफ़ॉल्ट यूज़रनेम। Amazon Linux में ec2-user, Debian में admin होता है।' },
          { meaning: 'यहाँ अपना Public IPv4 address लिखिए, जो कंसोल में दिख रहा है।' },
        ],
        check:
          'प्रॉम्प्ट बदलकर ubuntu@ip-172-31-8-4:~$ जैसा हो जाएगा — मतलब अब आप सर्वर के अंदर हैं। वापस आने के लिए exit टाइप कीजिए।',
        note:
          'पहली बार "Are you sure you want to continue connecting?" पूछेगा — yes लिखिए। उसके बाद यह चुपचाप कनेक्ट होता रहेगा।',
      },
      {
        title: 'मशीन को अपडेट कीजिए और ज़रूरी टूल डालिए',
        why: 'नए सर्वर पर पैकेज लिस्ट पुरानी होती है और कोई बिल्ड टूल नहीं होता। यह स्टेप सब कुछ अप-टू-डेट करता है और git इंस्टॉल करता है ताकि कोड लाया जा सके।',
        explain: [
          { meaning: 'एडमिन (root) के तौर पर चलाइए। सिस्टम में कुछ भी बदलने के लिए ज़रूरी है।' },
          { meaning: 'उपलब्ध पैकेजों की लिस्ट ताज़ा करता है।' },
          { meaning: 'नए वर्ज़न इंस्टॉल करता है; -y हर सवाल का जवाब अपने आप "हाँ" कर देता है।' },
          { meaning: 'कुछ npm पैकेजों को native कोड कंपाइल करने के लिए इनकी ज़रूरत पड़ती है।' },
        ],
        check: 'git --version कोई वर्ज़न नंबर दिखाए।',
      },
      {
        title: 'nvm से Node.js इंस्टॉल कीजिए',
        why: 'Ubuntu के अपने repository में Node अक्सर सालों पुराना होता है। nvm से कोई भी वर्ज़न इंस्टॉल कर सकते हैं और बाद में बिना कुछ तोड़े बदल भी सकते हैं।',
        explain: [
          { meaning: 'इंस्टॉलर स्क्रिप्ट डाउनलोड करके तुरंत चला देता है।' },
          { meaning: 'शेल कॉन्फ़िग दोबारा लोड करता है ताकि लॉगआउट किए बिना nvm कमांड चलने लगे।' },
          { meaning: 'Node.js 20 (LTS वर्ज़न) इंस्टॉल करके डिफ़ॉल्ट बना देता है।' },
        ],
        check: 'node -v लिखने पर v20.x.x दिखे।',
      },
      {
        title: 'अपना कोड सर्वर पर लाइए',
        why: 'सर्वर के पास प्रोजेक्ट की कॉपी होनी चाहिए। GitHub से clone करना सबसे साफ़ तरीका है — आगे से हर डिप्लॉय बस एक git pull रह जाता है।',
        explain: [
          { meaning: 'सारे डिप्लॉय किए प्रोजेक्ट एक ही तय फ़ोल्डर में रखिए।' },
          { meaning: 'रिपॉज़िटरी डाउनलोड करता है। private repo है तो credentials माँगेगा — deploy key या personal access token इस्तेमाल कीजिए।' },
          { meaning: 'package-lock.json में लिखे बिल्कुल वही वर्ज़न इंस्टॉल करता है, development वाले पैकेज छोड़कर।' },
        ],
        note:
          'npm ci पूरा node_modules हटाकर lock फ़ाइल से दोबारा इंस्टॉल करता है, इसलिए सर्वर पर वही वर्ज़न आते हैं जो आपके लैपटॉप पर थे। npm install चुपचाप अलग वर्ज़न ला सकता है।',
      },
      {
        title: '.env फ़ाइल बनाइए (और सही तरीक़े से सेव कीजिए)',
        why: 'ऐप को कुछ गुप्त चीज़ें चाहिए — डेटाबेस URL, JWT secret, API keys। ये कभी git में नहीं जानी चाहिए, इसलिए इन्हें सर्वर पर एक बार हाथ से बनाया जाता है। dotenv जैसी लाइब्रेरी ऐप शुरू होते ही इसे पढ़ लेती है।',
        file: {
          save: 'Ctrl + O दबाइए (write out) → नाम कन्फ़र्म करने के लिए Enter → nano से निकलने के लिए Ctrl + X। फ़ाइल अब ~/apps/my-api/.env पर सेव हो गई है।',
          lines: [
            { meaning: 'Express और कई लाइब्रेरी को बताता है कि debug आउटपुट बंद करके caching चालू कर दें।' },
            { meaning: 'वह port जिस पर आपका Node ऐप अंदर ही अंदर सुनता है। Nginx बाहर की ट्रैफ़िक इसी पर भेजेगा।' },
            { meaning: 'डेटाबेस का पूरा connection string, यूज़रनेम और पासवर्ड समेत।' },
            { meaning: 'लॉगिन टोकन साइन करने वाला रैंडम स्ट्रिंग। बनाने के लिए: openssl rand -hex 32' },
            { meaning: '# से शुरू होने वाली लाइनें नज़रअंदाज़ हो जाती हैं — सेटिंग्स को ग्रुप करने के काम आती हैं।' },
          ],
        },
        check:
          'cat .env करने पर फ़ाइल वापस दिखेगी। = के आसपास स्पेस नहीं होना चाहिए, और जब तक वैल्यू में स्पेस न हो, quotes भी नहीं।',
        note:
          'तुरंत दो काम कीजिए: chmod 600 .env से सिर्फ़ अपने यूज़र तक सीमित कीजिए, और .gitignore में .env लिखिए ताकि यह कभी GitHub तक न पहुँचे।',
      },
      {
        title: 'कुछ भी ऑटोमैटिक करने से पहले ऐप को हाथ से चलाकर देखिए',
        why: 'अगर ऐप सामने (foreground) में ही नहीं चल रहा, तो कोई process manager उसे ठीक नहीं करेगा। छूटे हुए env वेरिएबल और डेटाबेस एरर यहीं पकड़ में आते हैं, जहाँ सब स्क्रीन पर दिखता है।',
        explain: [
          { meaning: 'ऐप को सीधे चलाता है। कोई एरर होगा तो स्क्रीन पर ही दिखेगा।' },
          { meaning: 'सर्वर के अंदर से ही ऐप से जवाब माँगता है — इससे पता चलता है कि ऐप ठीक है, इससे पहले कि फ़ायरवॉल और proxy बीच में आएँ।' },
        ],
        check: 'curl "Connection refused" की जगह आपका JSON जवाब लौटाए।',
        note:
          'रोकने के लिए Ctrl + C। SSH बंद करते ही foreground ऐप मर जाता है — PM2 इसी समस्या को हल करता है।',
      },
      {
        title: 'PM2 से ऐप को हमेशा चलता रखिए',
        why: 'ऐप क्रैश हो तो PM2 उसे दोबारा चालू करता है, सर्वर reboot हो तो फिर से शुरू करता है, और सारे logs एक जगह रखता है। इसके बिना एक एरर आपका API तब तक बंद रखता है जब तक आपको ख़ुद पता न चले।',
        check: 'pm2 list में my-api का status online दिखे।',
        note: 'पूरी जानकारी, ecosystem.config.cjs फ़ाइल समेत, PM2 गाइड में है।',
      },
      {
        title: 'Nginx को आगे लगाइए ताकि दुनिया पहुँच सके',
        why: 'आपका ऐप port 5000 पर सुनता है, पर ब्राउज़र port 80/443 माँगते हैं। Nginx बाहर की ट्रैफ़िक लेता है, ऐप तक पहुँचाता है, और आगे चलकर HTTPS भी संभालता है।',
        check:
          'कॉन्फ़िग लिखने के बाद (पूरी फ़ाइल Nginx गाइड में है) sudo nginx -t "syntax is ok" कहे और http://your-ip पर आपका API खुले।',
      },
      {
        title: 'पक्का पता और HTTPS दीजिए',
        why: 'एक बार stop/start करते ही public IP बदल जाता है और उस पर टिके सारे DNS रिकॉर्ड टूट जाते हैं। Elastic IP इसे पक्का कर देता है। उसके बाद Certbot मुफ़्त सर्टिफ़िकेट देकर साइट को https पर ले आता है।',
        ui: [
          'EC2 Console → Elastic IPs → Allocate Elastic IP address → उसे अपने instance से Associate कीजिए।',
          'अपने domain रजिस्ट्रार में api.myapp.com का A record उसी Elastic IP पर लगाइए।',
        ],
        check:
          'https://api.myapp.com ताले (padlock) के साथ खुले। Certbot एक timer भी लगा देता है जो सर्टिफ़िकेट अपने आप रिन्यू करता रहेगा।',
        note:
          'DNS बदलाव में कुछ मिनट लग सकते हैं। अगर domain अभी इस सर्वर पर नहीं पहुँच रहा तो Certbot फ़ेल होगा — थोड़ा रुककर दोबारा चलाइए।',
      },
    ],
  },
  troubleshooting: [
    {
      cause: 'ग़लत यूज़रनेम, ग़लत key, या key की permission बहुत खुली हुई है।',
      fix: 'Ubuntu इमेज पर ubuntu@ इस्तेमाल कीजिए (Amazon Linux पर ec2-user@), -i सही .pem पर लगा है यह देखिए, और उस पर chmod 400 चलाइए।',
    },
    {
      cause: 'security group आपके मौजूदा IP को allow नहीं कर रहा, या आपने नेटवर्क बदल लिया है।',
      fix: 'EC2 → Security Groups → Inbound rules → SSH वाला rule एडिट करके दोबारा "My IP" चुनिए। घर/ऑफ़िस का IP अक्सर बदलता रहता है।',
    },
    {
      cause: 'security group में port 80/443 बंद है, या Nginx ऐप तक proxy नहीं कर रहा।',
      fix: 'HTTP (80) और HTTPS (443) के inbound rules 0.0.0.0/0 के लिए जोड़िए, फिर sudo tail -f /var/log/nginx/error.log देखिए।',
    },
    {
      cause: 'मेमोरी ख़त्म — 1 GB RAM कुछ पैकेज बिल्ड करने के लिए कम पड़ती है।',
      fix: 'swap जोड़िए: sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile',
    },
    {
      cause: 'बिना जुड़े Elastic IP का भी पैसा लगता है, और बंद instance की डिस्क का किराया चलता रहता है।',
      fix: 'बेकार Elastic IP रिलीज़ कीजिए, बिना जुड़े EBS volume और पुराने snapshot डिलीट कीजिए, और AWS Budgets में billing alarm लगाइए।',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Nginx                                                              */
/* ------------------------------------------------------------------ */
const nginx = {
  tagline: 'तेज़ वेब सर्वर, reverse proxy और load balancer',
  overview: {
    what: 'Nginx एक तेज़ वेब सर्वर है जो reverse proxy, load balancer और static फ़ाइल सर्वर का काम भी करता है।',
    why: 'यह Node.js जैसे ऐप सर्वरों के आगे बैठकर TLS संभालता है, static फ़ाइलें देता है, जवाब compress करता है और ट्रैफ़िक बाँटता है — वह भी बहुत कम मेमोरी में।',
    useCases: [
      'port 3000 पर चल रहे Node.js ऐप को 80/443 पर reverse-proxy करना',
      'बनी हुई React/Vite SPA सर्व करना, client-side routing के साथ',
      'Let’s Encrypt सर्टिफ़िकेट से HTTPS चालू करना',
      'कई ऐप instances के बीच load balancing',
    ],
  },
  beginner: {
    simple:
      'Nginx आपके सर्वर का रिसेप्शनिस्ट है। हर विज़िटर सबसे पहले उसी के पास आता है, port 80 (http) या 443 (https) पर। फिर Nginx तय करता है कि क्या करना है: या तो index.html जैसी static फ़ाइल ख़ुद लौटा दे, या चुपचाप वह request अंदर चल रहे Node ऐप को भेजकर उसका जवाब वापस कर दे।',
    analogy:
      'आपका Node ऐप पीछे के कमरे में बैठा वह एक्सपर्ट है जिसका नंबर किसी को नहीं पता। Nginx सामने का रिसेप्शन है जिसका पता सार्वजनिक है: वह सबका स्वागत करता है, ID चेक करता है (TLS), और request को सही कमरे तक पहुँचाता है।',
    before: [
      'एक Linux सर्वर जिसमें आप SSH कर सकें (देखिए AWS EC2 गाइड)।',
      'आपका ऐप किसी local port पर पहले से चल रहा हो, जैसे http://localhost:5000।',
      'वैकल्पिक: सर्वर के IP पर लगा हुआ domain — HTTPS के लिए यह ज़रूरी है।',
    ],
  },
  glossary: [
    { meaning: 'वह सर्वर जो किसी दूसरे सर्वर की तरफ़ से request लेता है। Node के आगे Nginx इसका सबसे आम उदाहरण है।' },
    { meaning: 'एक वेबसाइट का कॉन्फ़िग — उसका domain, उसकी फ़ाइलें, उसके नियम। Apache में इसी को virtual host कहते हैं।' },
    { meaning: 'वह फ़ोल्डर जिसमें आपके लिखे सारे site कॉन्फ़िग रहते हैं, चालू हों या नहीं।' },
    { meaning: 'सिर्फ़ चालू साइटों के symlink वाला फ़ोल्डर। Nginx असल में यही पढ़ता है।' },
    { meaning: 'वह चीज़ जिसे Nginx आगे request भेजता है — यानी आपका Node ऐप। "502 Bad Gateway" का मतलब है upstream ने जवाब नहीं दिया।' },
    { meaning: 'वह directive जो कहता है "यह request उधर भेज दो"।' },
    { meaning: 'static फ़ाइलें कहाँ रखी हैं, और फ़ाइल न मिलने पर किस क्रम में fallback करना है — SPA routing की असली चाबी यही है।' },
    { meaning: 'reload नया कॉन्फ़िग बिना किसी चालू कनेक्शन को तोड़े लागू करता है। restart सब बंद करके नए सिरे से शुरू करता है, जिसमें कुछ पल ट्रैफ़िक रुकती है।' },
  ],
  walkthrough: {
    title: 'Node ऐप के आगे Nginx लगाइए, फिर HTTPS जोड़िए',
    intro:
      'स्टेप 3 की कॉन्फ़िग फ़ाइल इस गाइड का दिल है — उसकी हर लाइन समझाई गई है। स्टेप 6 और 7 दो सबसे आम ज़रूरतें हैं: React बिल्ड सर्व करना और असली सर्टिफ़िकेट लगाना।',
    steps: [
      {
        title: 'Nginx इंस्टॉल कीजिए और देखिए कि चल रहा है',
        why: 'Ubuntu पर इंस्टॉल होते ही Nginx अपने आप चालू होकर एक डिफ़ॉल्ट पेज दिखाने लगता है — यह जाँचने का आसान तरीक़ा है कि port और फ़ायरवॉल ठीक हैं, वह भी अपना कॉन्फ़िग लिखने से पहले।',
        check:
          'status में हरे रंग में active (running) दिखे, और ब्राउज़र में http://your-server-ip खोलने पर "Welcome to nginx!" पेज आए।',
        note:
          'पेज नहीं खुला? मतलब port ऊपर कहीं बंद है — EC2 पर security group में HTTP (80) का inbound rule जोड़िए।',
      },
      {
        title: 'वे चार रास्ते जो असल में काम आते हैं',
        why: 'Nginx में फ़ाइलें बहुत हैं, पर रोज़ के काम में आप इन्हीं को छूते हैं। कौन-सी फ़ाइल किस काम की है, यह पता होने से एक घंटा ग़लत फ़ाइल एडिट करने में नहीं जाता।',
        explain: [
          { meaning: 'worker की संख्या, gzip की डिफ़ॉल्ट सेटिंग, और वह include लाइन जो sites-enabled/* को खींचती है।' },
          { meaning: 'आपके कॉन्फ़िग की लाइब्रेरी। यहाँ रखी फ़ाइल तब तक कुछ नहीं करती जब तक उसे link न किया जाए।' },
          { meaning: 'चालू साइटों का सेट। symlink हटाने से साइट बंद हो जाती है, कॉन्फ़िग डिलीट किए बिना।' },
        ],
        note:
          'Amazon Linux / RHEL पर ये फ़ोल्डर नहीं होते — वहाँ कॉन्फ़िग /etc/nginx/conf.d/myapp.conf में रखिए।',
      },
      {
        title: 'server block फ़ाइल बनाइए',
        why: 'यही एक फ़ाइल Nginx को बताती है कि किस domain का जवाब देना है और request कहाँ भेजनी है। ज़्यादातर ट्यूटोरियल मान लेते हैं कि आपको यह फ़ाइल लिखनी आती है — यहाँ पूरी दी गई है।',
        file: {
          save: 'सेव करने और बाहर निकलने के लिए Ctrl + O → Enter → Ctrl + X। फ़ाइल /etc में है, इसलिए nano को sudo के साथ खोलना ज़रूरी है, वरना सेव करते समय "Permission denied" आएगा।',
          lines: [
            { meaning: 'सादे HTTP का जवाब दीजिए। [::]:80 वाली लाइन यही काम IPv6 के लिए करती है।' },
            { meaning: 'यह block किस domain को संभालेगा। domain न होने पर _ लिखकर सब कुछ मैच करा सकते हैं।' },
            { meaning: 'अपलोड की सीमा बढ़ाता है। डिफ़ॉल्ट 1 MB की वजह से अचानक "413 Request Entity Too Large" आता है।' },
            { meaning: 'हर path के लिए नियम। और block भी जोड़ सकते हैं, जैसे दूसरी service के लिए location /api/।' },
            { meaning: 'आपके Node ऐप को भेजिए। 127.0.0.1 रखने से ऐप सीधे इंटरनेट से नहीं पहुँचा जा सकता।' },
            { meaning: 'इनके बिना आपके ऐप को हर request सर्वर की अपनी और http लगती है — जिससे rate limit, logs और secure cookies तीनों बिगड़ते हैं।' },
            { meaning: 'WebSocket कनेक्शन को proxy के पार ज़िंदा रखते हैं। अभी socket इस्तेमाल न करते हों तब भी रहने दीजिए।' },
          ],
        },
        note:
          'कॉन्फ़िग सीधे sites-enabled में मत लिखिए — असली फ़ाइल sites-available में रखिए और link कीजिए, ताकि साइट बंद करना एक कमांड का काम रहे।',
      },
      {
        title: 'साइट चालू कीजिए और syntax जाँचिए',
        why: 'कॉन्फ़िग में एक टाइपो reload करते ही पूरा वेब सर्वर गिरा देता है — उन साइटों समेत जो ठीक चल रही थीं। nginx -t यह गलती तब पकड़ता है जब सब कुछ अभी चालू है।',
        explain: [
          { meaning: 'symbolic link बनाता है — यानी एक पॉइंटर, ताकि आप असली फ़ाइल ही एडिट करते रहें।' },
          { meaning: 'welcome-page वाली साइट हटाता है, वरना वह उन request का जवाब देती रह सकती है जिनका कोई server_name मैच नहीं करता।' },
          { meaning: 'हर कॉन्फ़िग पढ़कर एरर को फ़ाइल और लाइन नंबर समेत बताता है।' },
        ],
        check: 'nginx: configuration file /etc/nginx/nginx.conf test is successful',
        note:
          'टेस्ट फ़ेल हो तो reload करने से पहले फ़ाइल ठीक कीजिए। जब तक आप reload नहीं करते, चल रहा Nginx पुराना कॉन्फ़िग ही इस्तेमाल करता रहता है।',
      },
      {
        title: 'reload कीजिए और पूरा रास्ता जाँचिए',
        why: 'reload नया कॉन्फ़िग सलीके से लागू करता है — चल रही request पुराने worker पर पूरी होती हैं, नई request नए नियमों से। किसी विज़िटर को एरर नहीं दिखता।',
        check: 'curl 502 की जगह HTTP/1.1 200 OK (या आपके ऐप का status) लौटाए।',
        note:
          '502 Bad Gateway का मतलब है Nginx ठीक है पर आपका ऐप port 5000 पर जवाब नहीं दे रहा — pm2 list और sudo tail -f /var/log/nginx/my-api.error.log देखिए।',
      },
      {
        title: 'उसी सर्वर से React / Vite बिल्ड सर्व कीजिए',
        why: 'SPA सिर्फ़ static फ़ाइलें हैं, पर /dashboard पर refresh करने पर सर्वर से ऐसी फ़ाइल माँगी जाती है जो होती ही नहीं। try_files इसी को हल करता है — वह index.html लौटा देता है और आगे का काम आपका router संभाल लेता है।',
        file: {
          save: 'nano में Ctrl + O → Enter → Ctrl + X, फिर link करके reload कीजिए: sudo ln -s /etc/nginx/sites-available/my-frontend /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx',
          lines: [
            { meaning: 'npm run build से बना फ़ोल्डर। उसे rsync या किसी deploy स्क्रिप्ट से वहाँ कॉपी कीजिए।' },
            { meaning: 'पहले असली फ़ाइल ढूँढो, फिर फ़ोल्डर, फिर SPA का entry point दे दो। "refresh पर 404" का यही इलाज है।' },
            { meaning: 'Vite फ़ाइल नाम में hash जोड़ता है, इसलिए पुरानी फ़ाइलें हमेशा के लिए cache हो सकती हैं और नया बिल्ड अपने आप cache तोड़ देता है।' },
            { meaning: 'फ़्रंटएंड और बैकएंड एक ही domain पर आ जाते हैं, यानी CORS की कोई सेटिंग ही नहीं चाहिए।' },
            { meaning: 'text जवाबों को compress करता है, जिससे JS/CSS का ट्रांसफ़र साइज़ आम तौर पर ~70% घट जाता है।' },
          ],
        },
        note:
          'Nginx को बिल्ड फ़ोल्डर पढ़ने की permission चाहिए: sudo chown -R www-data:www-data /var/www/myapp। यहाँ "403 Forbidden" लगभग हमेशा permission की वजह से आता है।',
      },
      {
        title: 'Certbot से मुफ़्त HTTPS लगाइए',
        why: 'ब्राउज़र सादे http को "Not secure" दिखाते हैं, और clipboard access या service worker जैसी सुविधाएँ TLS के बिना चलती ही नहीं। Certbot Let’s Encrypt से सर्टिफ़िकेट लेकर आपका कॉन्फ़िग ख़ुद अपडेट कर देता है।',
        explain: [
          { meaning: 'Nginx plugin इस्तेमाल कीजिए: यह domain का मालिकाना साबित करता है, सर्टिफ़िकेट लगाता है और server block ख़ुद एडिट कर देता है।' },
          { meaning: 'हर domain के लिए एक flag। लिखा हुआ हर domain पहले से इसी सर्वर पर पॉइंट होना चाहिए।' },
          { meaning: 'ऑटो-रिन्यूअल की रिहर्सल करता है, ताकि दिक्कत अभी पता चले, 90 दिन बाद नहीं।' },
        ],
        check:
          'साइट https पर ताले के साथ खुले, और कॉन्फ़िग में अब listen 443 ssl के साथ port 80 से redirect वाला block भी दिखे।',
        note:
          'सर्टिफ़िकेट 90 दिन चलते हैं। साथ में लगा systemd timer उन्हें अपने आप रिन्यू करता है — उसे कभी बंद मत कीजिए।',
      },
      {
        title: 'डिफ़ॉल्ट सेटिंग्स को सुरक्षित बनाइए',
        why: 'डिब्बे से निकलते ही Nginx अपना पूरा वर्ज़न बताता है और कोई security header नहीं भेजता। दो मिनट का यह काम कई आसान हमलों को ख़त्म कर देता है।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X, फिर sudo nginx -t && sudo systemctl reload nginx',
          lines: [
            { meaning: 'एरर पेज और header में Nginx का वर्ज़न दिखना बंद कर देता है।' },
            { meaning: 'ब्राउज़र को किसी फ़ाइल का टाइप ख़ुद अंदाज़ा लगाने से रोकता है।' },
            { meaning: 'दूसरी साइटों को आपकी साइट iframe में दिखाने से रोकता है (clickjacking)।' },
            { meaning: 'ब्राउज़र से कहता है कि साल भर सिर्फ़ https इस्तेमाल करे। यह HTTPS चालू होने के बाद ही जोड़िए।' },
            { meaning: 'यह सिर्फ़ बकेट बनाता है; चालू करने के लिए किसी location में लिखिए: limit_req zone=api_limit burst=20 nodelay;' },
          ],
        },
      },
    ],
  },
  troubleshooting: [
    {
      cause: 'Nginx ने request आगे भेजी, पर upstream port पर किसी ने जवाब नहीं दिया।',
      fix: 'देखिए कि ऐप चल रहा है (pm2 list, curl http://localhost:5000) और proxy_pass उसी port पर है जिस पर ऐप सुन रहा है।',
    },
    {
      cause: 'www-data यूज़र फ़ाइलें पढ़ नहीं सकता, या root ग़लत फ़ोल्डर पर लगा है।',
      fix: 'sudo chown -R www-data:www-data /var/www/myapp चलाइए और देखिए कि हर ऊपरी फ़ोल्डर पर execute (x) permission है।',
    },
    {
      cause: 'फ़ाइल को sites-enabled में symlink ही नहीं किया गया, या Nginx reload नहीं हुआ।',
      fix: 'ls -l /etc/nginx/sites-enabled/ से link जाँचिए, फिर sudo nginx -t && sudo systemctl reload nginx।',
    },
    {
      cause: 'SPA fallback नहीं है — सर्वर उस path पर असली फ़ाइल ढूँढ रहा है।',
      fix: 'location / के अंदर try_files $uri $uri/ /index.html; जोड़िए।',
    },
    {
      cause: 'client_max_body_size की डिफ़ॉल्ट सीमा 1 MB है।',
      fix: 'server block में बढ़ाइए, जैसे client_max_body_size 25M; और फिर reload कीजिए।',
    },
    {
      cause: 'port 80 पर पहले से Apache या कोई पुराना Nginx प्रोसेस बैठा है।',
      fix: 'sudo ss -tulpn | grep :80 से पता कीजिए, फिर उसे बंद कीजिए (जैसे sudo systemctl stop apache2)।',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  PM2                                                                */
/* ------------------------------------------------------------------ */
const pm2 = {
  tagline: 'Node.js ऐप्स के लिए production process manager',
  overview: {
    what: 'PM2 एक process manager है जो Node.js ऐप्स को बैकग्राउंड में चलाता है, क्रैश होने पर दोबारा शुरू करता है, logs रखता है और cluster मोड में सारे CPU कोर इस्तेमाल करता है।',
    why: 'बिना इसके, ऐप एक भी unhandled error पर बंद हो जाता है और reboot के बाद अपने आप चालू नहीं होता — यानी हर बार किसी को SSH करना पड़ता है।',
    useCases: [
      'production में Node/Express API को चौबीसों घंटे चलाना',
      'cluster मोड से सारे CPU कोर पर लोड बाँटना',
      'zero-downtime डिप्लॉय (pm2 reload)',
      'सारे ऐप्स के logs और मेमोरी एक जगह से देखना',
    ],
  },
  beginner: {
    simple:
      'जब आप node server.js चलाकर टर्मिनल बंद कर देते हैं, ऐप मर जाता है। कोई unhandled error आ जाए, तब भी मर जाता है। सर्वर reboot हो जाए, तो मरा ही रहता है। PM2 एक छोटा प्रोग्राम है जो आपके ऐप की देखभाल करता है: उसे बैकग्राउंड में चलाता है, क्रैश होते ही दोबारा शुरू करता है, reboot के बाद फिर से खड़ा करता है, और सारे logs एक जगह रखता है।',
    analogy:
      'node server.js मतलब मशाल को हाथ में पकड़े रहना — हाथ छोड़ा और रोशनी गई। PM2 उसी मशाल को दीवार पर बैटरी बैकअप के साथ लगा देना है।',
    before: [
      'सर्वर पर Node.js और npm इंस्टॉल हों।',
      'आपका ऐप node server.js से सामने (foreground) में सही चल रहा हो।',
      'अगर ऐप को secrets चाहिए तो .env फ़ाइल तैयार हो।',
    ],
  },
  glossary: [
    { meaning: 'आपके ऐप की एक चालू कॉपी। PM2 हर एक को एक id और नाम देता है।' },
    { meaning: 'PM2 ऐप की कई कॉपियाँ चलाकर उनके बीच लोड बाँटता है, यानी एक कोर की जगह सारे CPU कोर इस्तेमाल होते हैं।' },
    { meaning: 'ecosystem.config.cjs — आपकी PM2 सेटिंग्स लिखी हुई फ़ाइल, ताकि डिप्लॉय याद रखे हुए flags की जगह एक कमांड बन जाए।' },
    { meaning: 'मौजूदा process लिस्ट को डिस्क पर लिख देता है, ताकि बाद में उसे वापस खड़ा किया जा सके।' },
    { meaning: 'वह सिस्टम service बनाता है जो boot पर "pm2 resurrect" चलाती है।' },
    { meaning: 'reload cluster के worker एक-एक करके बदलता है (zero downtime)। restart सब बंद करके फिर चालू करता है।' },
    { meaning: 'सुरक्षा जाल: अगर ऐप मेमोरी लीक करके तय सीमा पार कर जाए, तो PM2 उसे restart कर देता है, सर्वर की RAM ख़त्म होने से पहले।' },
  ],
  walkthrough: {
    title: 'Node ऐप को production में चलाइए और चलता रखिए',
    intro:
      'स्टेप 1–3 में एक मिनट के अंदर ऐप चलने लगेगा। स्टेप 4–6 वह हिस्सा है जो एक डेमो और रात 3 बजे के reboot में भी टिके रहने वाले सेटअप के बीच फ़र्क़ बनाता है।',
    steps: [
      {
        title: 'PM2 को globally इंस्टॉल कीजिए',
        why: 'PM2 एक command-line टूल है, प्रोजेक्ट की dependency नहीं — यह पूरी मशीन पर उपलब्ध होना चाहिए, boot service के लिए भी।',
        check: 'कोई वर्ज़न नंबर दिखे, जैसे 5.4.2।',
        note:
          'nvm से इंस्टॉल किया है? तब PM2 उसी Node वर्ज़न के अंदर रहता है। बाद में nvm से वर्ज़न बदलें तो PM2 दोबारा इंस्टॉल करके pm2 startup फिर चलाइए।',
      },
      {
        title: 'ऐप शुरू कीजिए',
        why: 'इससे process PM2 के हवाले हो जाता है और आपके टर्मिनल से अलग हो जाता है। अब आप SSH बंद कर दें, ऐप चलता रहेगा।',
        explain: [
          { meaning: 'पढ़ा जा सकने वाला नाम। इसके बिना नाम "server" पड़ जाता है और हर ऐप एक जैसा दिखता है।' },
          { meaning: 'डैशबोर्ड: हर process का status, restart, CPU, मेमोरी और uptime।' },
        ],
        check: 'my-api की लाइन में status online और restart count 0 दिखे।',
        note:
          'status "errored" और restart बढ़ते जा रहे हैं मतलब ऐप बार-बार क्रैश हो रहा है। कुछ और बदलने से पहले pm2 logs my-api --lines 100 पढ़िए।',
      },
      {
        title: 'logs पढ़िए',
        why: 'ऐप अलग हो चुका है, इसलिए उसका आउटपुट अब आपके टर्मिनल में नहीं दिखता। PM2 उसे संभालकर रखता है, और production की हर गुत्थी यहीं सुलझती है।',
        explain: [
          { meaning: 'follow करने से पहले आख़िरी 200 लाइनें दिखाता है — क्रैश का संदर्भ समझने के लिए काफ़ी।' },
          { meaning: 'जब सामान्य logs में शोर ज़्यादा हो तो सिर्फ़ error आउटपुट दिखाता है।' },
          { meaning: 'log फ़ाइलें ख़ाली कर देता है। crash loop से डिस्क भर जाने पर काम आता है।' },
        ],
        note:
          'log फ़ाइलें ~/.pm2/logs/ में रहती हैं। स्टेप 6 में rotation न लगाएँ तो ये हमेशा बढ़ती रहेंगी।',
      },
      {
        title: 'ecosystem फ़ाइल लिखिए',
        why: 'हाथ से टाइप किए flags भूल जाते हैं। यह फ़ाइल ऐप का नाम, cluster साइज़, मेमोरी सीमा, environment और log पथ — सब लिख देती है, ताकि कोई भी टीममेट बिल्कुल वैसा ही डिप्लॉय कर सके।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X। फिर इसी से चलाइए: pm2 delete my-api && pm2 start ecosystem.config.cjs',
          lines: [
            { meaning: 'जब package.json में "type": "module" हो तो यही extension चाहिए — PM2 कॉन्फ़िग CommonJS में पढ़ता है।' },
            { meaning: 'हर CPU कोर पर एक worker, साथ में बिल्ट-इन load balancing। यह तभी सुरक्षित है जब ऐप stateless हो (मेमोरी में session न रखे)।' },
            { meaning: 'लीक होने पर पूरा सर्वर जाम होने के बजाय एक worker restart हो जाता है।' },
            { meaning: 'टूटे ऐप को मिनट में हज़ार बार चलाने की जगह रुक-रुककर कोशिश करता है।' },
            { meaning: 'शुरू होते समय दिए जाने वाले वेरिएबल। असली secrets .env में ही रखिए — इस committed फ़ाइल में नहीं।' },
            { meaning: 'हर log लाइन के आगे समय लगाता है। यह आपको चाहिए ही चाहिए।' },
          ],
        },
        note:
          '.env लोड करने के दो तरीक़े: server.js की सबसे ऊपर import "dotenv/config" लिखिए, या Node को --env-file=.env के साथ चलाइए। PM2 ख़ुद .env नहीं पढ़ता।',
      },
      {
        title: 'reboot के बाद भी चलता रहे',
        why: 'यही वह स्टेप है जो लोग छोड़ देते हैं। इसके बिना, किसी भी वक़्त सर्वर restart होने पर साइट तब तक बंद रहती है जब तक कोई ख़ुद SSH करके चालू न करे।',
        explain: [
          { meaning: 'मौजूदा process लिस्ट को ~/.pm2/dump.pm2 में सहेज देता है।' },
          { meaning: 'वह systemd कमांड छापता है जो PM2 को boot service बना देती है। वह कमांड आपको ख़ुद चलानी होती है।' },
        ],
        check:
          'sudo reboot कीजिए, एक मिनट रुककर दोबारा SSH कीजिए और pm2 list चलाइए — ऐप पहले से online मिलना चाहिए।',
        note:
          'जब भी process लिस्ट पक्के तौर पर बदलें, pm2 save दोबारा चलाइए, वरना reboot पुरानी लिस्ट वापस ले आएगा।',
      },
      {
        title: 'log rotation लगाइए',
        why: 'बिना rotate हुए PM2 logs "सर्वर अचानक बंद हो गया" की जानी-मानी वजह हैं — डिस्क साल भर के console आउटपुट से भर जाती है।',
        explain: [
          { meaning: 'मौजूदा फ़ाइल 10 MB होते ही नई फ़ाइल शुरू कर दीजिए।' },
          { meaning: '14 पुरानी फ़ाइलें रखिए, बाकी हटा दीजिए।' },
          { meaning: 'rotate हुई फ़ाइलों को gzip करके जगह बचाइए।' },
        ],
        check: 'df -h में काफ़ी जगह ख़ाली दिखे, और ~/.pm2/logs/ में .gz फ़ाइलें मिलें।',
      },
      {
        title: 'zero downtime के साथ अपडेट डिप्लॉय कीजिए',
        why: 'cluster मोड में PM2 worker एक-एक करके बदल सकता है, इसलिए बीच में भी request का जवाब मिलता रहता है। आगे से यही आपका आम डिप्लॉय तरीक़ा है।',
        explain: [
          { meaning: 'rolling restart — नया worker तैयार होने तक पुराना request संभालता रहता है।' },
          { meaning: 'environment वेरिएबल दोबारा पढ़ता है। इसके बिना .env के बदलाव नज़रअंदाज़ हो जाते हैं।' },
          { meaning: 'डिप्लॉय के तुरंत बाद के पल देखिए, ताकि ख़राब रिलीज़ फ़ौरन पकड़ में आए।' },
        ],
        note:
          'fork मोड (एक ही instance) में reload लगभग restart जैसा ही है — थोड़ा gap आता है। असली seamless डिप्लॉय cluster मोड में ही मिलता है।',
      },
      {
        title: 'नज़र बनाए रखिए',
        why: 'यह छोटी-सी आदत मेमोरी लीक और restart loop को यूज़र्स की शिकायत आने से बहुत पहले पकड़ लेती है।',
        check: 'restart count कई दिनों तक स्थिर रहे और मेमोरी लगातार ऊपर न चढ़ती रहे।',
        note:
          'restart count अपने आप बढ़ रहा है, तो इसका मतलब हमेशा unhandled crash होता है — वजह error log में मिलेगी।',
      },
    ],
  },
  troubleshooting: [
    {
      cause: 'ऐप शुरू होते ही क्रैश हो रहा है — आम तौर पर कोई env वेरिएबल छूट गया है, port पहले से भरा है, या डेटाबेस नहीं मिल रहा।',
      fix: 'pm2 logs my-api --err --lines 100 पढ़िए। वजह ठीक करके pm2 restart my-api चलाइए।',
    },
    {
      cause: 'pm2 startup कभी चलाया ही नहीं, या आख़िरी बदलाव के बाद pm2 save नहीं किया।',
      fix: 'pm2 startup चलाइए, उसकी छापी हुई sudo कमांड चलाइए, फिर pm2 save।',
    },
    {
      cause: 'PM2 वही environment दोबारा इस्तेमाल कर रहा है जो process पहली बार शुरू होते समय मिला था।',
      fix: 'pm2 restart my-api --update-env, या pm2 delete my-api && pm2 start ecosystem.config.cjs।',
    },
    {
      cause: 'पुराना instance अब भी चल रहा है, या cluster मोड में सब एक ही hard-coded port के लिए लड़ रहे हैं।',
      fix: 'pm2 delete all चलाइए, sudo ss -tulpn | grep 5000 से पुष्टि कीजिए, फिर दोबारा शुरू कीजिए।',
    },
    {
      cause: 'PM2 के logs बिना सीमा के बढ़ते रहे।',
      fix: 'अभी pm2 flush चलाइए, फिर pm2-logrotate इंस्टॉल कीजिए ताकि यह दोबारा न हो।',
    },
    {
      cause: 'PM2 उस nvm Node वर्ज़न में इंस्टॉल हुआ है जो root को नहीं दिखता।',
      fix: 'pm2 startup ने जो पूरा path छापा था वही इस्तेमाल कीजिए, या service यूज़र के लिए Node सिस्टम-वाइड इंस्टॉल कीजिए।',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  AWS SES                                                            */
/* ------------------------------------------------------------------ */
const awsSes = {
  tagline: 'Simple Email Service — बड़े पैमाने पर ईमेल भेजने की सेवा',
  overview: {
    what: 'Amazon SES एक क्लाउड ईमेल सेवा है, जिससे AWS CLI, SDK या SMTP के ज़रिए transactional और marketing ईमेल बड़े पैमाने पर भेजे जाते हैं।',
    why: 'अपना mail सर्वर चलाए बिना, सस्ते में और भरोसे के साथ ईमेल पहुँचते हैं — साथ में DKIM और bounce/complaint संभालने के टूल पहले से मिलते हैं।',
    useCases: [
      'अकाउंट वेरिफ़िकेशन, पासवर्ड रीसेट और OTP ईमेल',
      'CRM या EdTech प्लेटफ़ॉर्म से ऑर्डर/एनरोलमेंट कन्फ़र्मेशन',
      'बल्क नोटिफ़िकेशन और न्यूज़लेटर',
    ],
  },
  beginner: {
    simple:
      'SES Amazon का डाकख़ाना है। आपका सर्वर ख़ुद ईमेल पहुँचाने की कोशिश करे तो वह लगभग हमेशा spam में गिरती है। इसकी जगह आप मैसेज SES को दे देते हैं और वह Amazon की साख के साथ उसे पहुँचाता है। यह उन ईमेल के लिए है जो ऐप अपने आप भेजता है: OTP, पासवर्ड रीसेट, बिल, वेलकम मेल।',
    analogy:
      'अपने सर्वर से मेल भेजना ऐसा है जैसे हाथ से लिखा लिफ़ाफ़ा किसी डिब्बे में डालकर उम्मीद करना। SES एक कूरियर है — ट्रैकिंग नंबर के साथ, अच्छी साख के साथ, और एक रिपोर्ट के साथ जो बताती है कि कौन-सी मेल पहुँची, खुली या लौट आई।',
    before: [
      'एक AWS अकाउंट, और जिस domain से भेजना है उसकी DNS सेटिंग्स तक पहुँच।',
      'एक Node.js ऐप जहाँ से मेल भेजनी है (यहाँ Nodemailer इस्तेमाल हुआ है)।',
      'production access की मंज़ूरी के लिए लगभग 24 घंटे का सब्र।',
    ],
  },
  glossary: [
    { meaning: 'वह ईमेल पता या domain जिसका मालिकाना आपने साबित कर दिया है। SES सिर्फ़ verified identity से ही भेजता है।' },
    { meaning: 'हर नया अकाउंट यहीं से शुरू होता है: सिर्फ़ उन्हीं पतों पर मेल जाएगी जिन्हें आपने verify किया हो, और रोज़ अधिकतम 200। production access दोनों सीमाएँ हटा देता है।' },
    { meaning: 'मेल भेजने के लिए बना ख़ास username/password। ये आपकी AWS access keys नहीं हैं, भले ही SES इन्हें IAM से बनाता हो।' },
    { meaning: 'हर मेल पर लगा डिजिटल दस्तख़त, जो साबित करता है कि मेल सच में आपके domain से आई है। तीन CNAME रिकॉर्ड से सेट होता है।' },
    { meaning: 'एक DNS TXT रिकॉर्ड जो बताता है कि आपके domain के लिए कौन मेल भेज सकता है।' },
    { meaning: 'मेल पहुँच नहीं पाई (पता ही नहीं है)। bounce ज़्यादा हुए तो AWS आपका अकाउंट रोक देता है।' },
    { meaning: 'किसी ने "mark as spam" दबा दिया। इसे 0.1% से नीचे रखिए।' },
  ],
  walkthrough: {
    title: 'Node.js ऐप से पहली production ईमेल भेजिए',
    intro:
      'स्टेप 1–4 AWS में एक बार का सेटअप हैं। स्टेप 5–7 कोड हैं। स्टेप 8 वही है जिसे लोग तब तक भूले रहते हैं जब तक मेल चुपचाप बंद न हो जाए।',
    steps: [
      {
        title: 'region चुनिए और sandbox को समझिए',
        why: 'SES की सेटिंग्स हर region के लिए अलग होती हैं — मुंबई में बनी credentials वर्जीनिया में नहीं चलेंगी। और sandbox से बाहर आने तक आप सिर्फ़ उन्हीं पतों पर मेल भेज सकते हैं जिन्हें आपने ख़ुद verify किया हो, जो पहली बार सबको उलझाता है।',
        ui: [
          'AWS Console → "SES" खोजिए → Amazon Simple Email Service।',
          'ऊपर दाईं तरफ़ region वही चुनिए जो आपके यूज़र्स के पास हो, जैसे ap-south-1 (मुंबई)। इसे याद रखिए — आगे SMTP endpoint में यही काम आएगा।',
          'Account dashboard देखिए: वहाँ लिखा होगा "Your account is in the sandbox"।',
        ],
        note:
          'नीचे का सब कुछ sandbox में भी टेस्ट के लिए चलता है। जब तक एक असली टेस्ट मेल न पहुँच जाए, production access मत माँगिए।',
      },
      {
        title: 'जिस domain से भेजना है उसे verify कीजिए',
        why: 'From में कोई भी पता लिखा जा सकता है; इसलिए SES आपसे domain का मालिकाना साबित करवाता है। पूरा domain verify करने पर आप उस domain के किसी भी पते से भेज सकते हैं (no-reply@, support@, billing@)।',
        ui: [
          'SES → Identities → Create identity → Domain।',
          'myapp.com लिखिए, "Easy DKIM" RSA_2048 के साथ चालू रहने दीजिए।',
          'SES तीन CNAME रिकॉर्ड दिखाएगा। हर Name/Value जोड़ी अपने DNS प्रोवाइडर (GoDaddy, Cloudflare, Route 53) में डालिए।',
          'इंतज़ार कीजिए — status "Pending" से "Verified" हो जाएगा, आम तौर पर एक घंटे के भीतर।',
        ],
        check: 'identity Verified दिखे, और DKIM status Successful हो।',
        note:
          'sandbox में रहते हुए वह पता भी verify कीजिए जिस पर भेजना है (Create identity → Email address), वरना हर बार "Email address is not verified" एरर आएगा।',
      },
      {
        title: 'SPF और DMARC रिकॉर्ड जोड़िए',
        why: 'DKIM साबित करता है कि मेल से छेड़छाड़ नहीं हुई; SPF बताता है कौन-से सर्वर आपके लिए भेज सकते हैं; DMARC बताता है कि इनमें से कोई जाँच फ़ेल हो तो क्या करना है। तीनों के बिना Gmail और Outlook आपको चुपचाप spam में डाल देते हैं।',
        file: {
          save: 'ये आपके DNS प्रोवाइडर के डैशबोर्ड में जोड़े जाते हैं (Add record → type TXT), सर्वर की किसी फ़ाइल में नहीं। असर दिखने में 5 मिनट से कुछ घंटे लग सकते हैं।',
          lines: [
            { meaning: 'बताता है कि यह TXT रिकॉर्ड एक SPF नीति है।' },
            { meaning: 'Amazon SES के सर्वरों को आपके domain के लिए मेल भेजने की इजाज़त देता है।' },
            { meaning: 'बाकी सबको soft-fail — शक़ के दायरे में, पर सीधे रिजेक्ट नहीं।' },
            { meaning: 'DMARC सिर्फ़ निगरानी मोड में। रिपोर्ट साफ़ दिखने लगे तो p=quarantine कर दीजिए।' },
          ],
        },
        check:
          'किसी Gmail पते पर टेस्ट भेजिए, मेल खोलकर तीन बिंदु → Show original देखिए। SPF, DKIM और DMARC तीनों PASS दिखने चाहिए।',
        note:
          'एक domain पर SPF रिकॉर्ड सिर्फ़ एक ही हो सकता है। पहले से है तो उसी में include:amazonses.com जोड़िए, दूसरा रिकॉर्ड मत बनाइए।',
      },
      {
        title: 'SMTP credentials बनाइए',
        why: 'यही वह username और password है जिससे आपका ऐप लॉगिन करेगा। ये देखने में AWS keys जैसी लगती हैं, पर बनती ख़ास SMTP के लिए हैं — आपकी सामान्य access key यहाँ नहीं चलेगी।',
        ui: [
          'SES → SMTP settings। वहाँ दिख रहा SMTP endpoint नोट कीजिए, जैसे email-smtp.ap-south-1.amazonaws.com।',
          'Create SMTP credentials दबाइए → IAM खुलेगा → यूज़र का नाम दीजिए जैसे ses-smtp-my-api → Create।',
          'CSV डाउनलोड कीजिए या SMTP username और password अभी कॉपी कर लीजिए — password सिर्फ़ एक बार दिखता है।',
        ],
        check: 'आपके पास AKIA… जैसा username और एक लंबा password होना चाहिए।',
        note:
          'password खो गया तो वापस नहीं मिलेगा; उस IAM यूज़र को डिलीट करके नई credentials बनानी पड़ेंगी।',
      },
      {
        title: 'credentials को .env फ़ाइल में डालिए',
        why: 'कोड में लिखी credentials GitHub तक पहुँच जाती हैं, और बॉट सार्वजनिक repo में यही ढूँढते रहते हैं। environment वेरिएबल उन्हें कोड से बाहर रखते हैं।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X। फिर chmod 600 .env चलाइए ताकि सिर्फ़ आपका यूज़र पढ़ सके, और ऐप restart कीजिए: pm2 restart my-api --update-env',
          lines: [
            { meaning: 'उसी region का होना चाहिए जिसमें आपने domain verify किया है।' },
            { meaning: 'STARTTLS वाला port। implicit TLS के लिए 465 इस्तेमाल कीजिए। 25 कभी नहीं — क्लाउड प्रोवाइडर उसे ब्लॉक करते हैं।' },
            { meaning: 'पिछले स्टेप में बनी SMTP credentials।' },
            { meaning: 'दिखने वाला नाम और एक verified पता। स्पेस होने की वजह से इसे quotes में रखिए।' },
          ],
        },
        note:
          'सिर्फ़ pm2 restart पुराना environment ही दोबारा इस्तेमाल करता है — नए वेरिएबल पढ़ने के लिए --update-env लगाना ज़रूरी है।',
      },
      {
        title: 'mailer मॉड्यूल लिखिए',
        why: 'एक छोटी फ़ाइल जिसे बाक़ी सारा ऐप import करता है, ताकि credentials और transport सेटिंग्स सिर्फ़ एक ही जगह रहें।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X।',
          lines: [
            { meaning: 'कनेक्शन सेटिंग्स हर मेल पर नहीं, सिर्फ़ एक बार शुरुआत में बनाता है।' },
            { meaning: 'port 587 पर कनेक्शन सादा शुरू होकर STARTTLS से TLS में बदल जाता है — यह सही है और encrypted ही रहता है।' },
            { meaning: 'दोनों रूप भेजना deliverability सुधारने का सबसे आसान तरीक़ा है।' },
          ],
        },
      },
      {
        title: 'एक असली टेस्ट मेल भेजिए',
        why: 'signup जैसे असली flow में लगाने से पहले यह साबित हो जाता है कि credentials, DNS और कोड — तीनों सही बैठे हैं।',
        check:
          'मेल पहुँच जाए (spam भी देखिए) और console में @email.amazonses.com पर ख़त्म होने वाला messageId छपे।',
        note:
          'sandbox में पाने वाला पता भी verified identity होना चाहिए। एरर 554 "Message rejected: Email address is not verified" का यही मतलब है।',
      },
      {
        title: 'production access माँगिए',
        why: 'तब तक आप रोज़ सिर्फ़ 200 मेल और सिर्फ़ verified पतों पर भेज सकते हैं — असली यूज़र्स के लिए यह बेकार है।',
        ui: [
          'SES → Account dashboard → Request production access।',
          'Mail type: Transactional। Website URL: आपका ऐप।',
          'आसान शब्दों में लिखिए कि आप क्या भेजते हैं (OTP, पासवर्ड रीसेट, ऑर्डर रसीद) और यूज़र कैसे opt in तथा unsubscribe करते हैं।',
          'सबमिट कीजिए और इंतज़ार कीजिए — आम तौर पर 24 घंटे से कम।',
        ],
        note:
          'गोल-मोल जवाब रिजेक्ट हो जाते हैं। लिखिए कि आप bounce और complaint संभालते हैं, और मेल सिर्फ़ यूज़र की किसी क्रिया के जवाब में जाती है।',
      },
      {
        title: 'bounce और complaint पर नज़र रखिए',
        why: 'जिन अकाउंट का bounce rate ~5% से ऊपर जाता है, AWS उन्हें रोक देता है। समय रहते पता चल जाए तो लिस्ट पहले ही साफ़ की जा सकती है।',
        check: 'SES → Reputation metrics में Bounce rate और Complaint rate ख़तरे की लकीर से काफ़ी नीचे दिखें।',
        note:
          'configuration set पर SNS topic लगाइए ताकि bounce सीधे किसी webhook पर आएँ और वे पते आपके डेटाबेस से अपने आप हट जाएँ।',
      },
    ],
  },
  troubleshooting: [
    {
      cause: 'अब भी sandbox में हैं, या ऐसे domain के पते से भेज रहे हैं जो verify नहीं हुआ।',
      fix: 'भेजने वाला और पाने वाला दोनों identity verify कीजिए, और देखिए कि हर जगह region एक ही है।',
    },
    {
      cause: 'SES SMTP credentials की जगह AWS access keys इस्तेमाल हो रही हैं, या credentials किसी दूसरे region की हैं।',
      fix: 'SES → SMTP settings → Create SMTP credentials से नई बनाइए, और host उसी region का रखिए।',
    },
    {
      cause: 'spam रोकने के लिए EC2 और ज़्यादातर क्लाउड बाहर जाने वाला port 25 ब्लॉक कर देते हैं।',
      fix: 'port 587 (STARTTLS) या 465 (TLS) इस्तेमाल कीजिए।',
    },
    {
      cause: 'DKIM/SPF/DMARC नहीं लगे हैं, plain-text हिस्सा नहीं है, या subject spam जैसा है।',
      fix: 'Gmail के "Show original" में तीनों जाँच PASS दिखनी चाहिए, हमेशा text fallback भेजिए, और मेल की संख्या धीरे-धीरे बढ़ाइए।',
    },
    {
      cause: 'आपके अकाउंट की प्रति-सेकंड सीमा से तेज़ भेजा जा रहा है।',
      fix: 'लिस्ट पर loop चलाने की जगह ईमेल queue (BullMQ, SQS) में डालिए और एक स्थिर रफ़्तार से भेजिए।',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Linux                                                              */
/* ------------------------------------------------------------------ */
const linux = {
  tagline: 'वह ऑपरेटिंग सिस्टम जिस पर ज़्यादातर सर्वर और क्लाउड चलते हैं',
  overview: {
    what: 'Linux एक ओपन-सोर्स, Unix जैसा ऑपरेटिंग सिस्टम है। सर्वर पर आप इससे shell (bash) और कमांड-लाइन टूल्स के ज़रिए बात करते हैं।',
    why: 'लगभग सारे production सर्वर, container और क्लाउड instance Linux पर चलते हैं, इसलिए ऐप डिप्लॉय करने, देखने और दिक्कत सुलझाने के लिए डेवलपर को shell आनी चाहिए।',
    useCases: [
      'SSH से EC2 सर्वर संभालना',
      'फ़ाइलें, permissions, यूज़र और services मैनेज करना',
      'process, port, डिस्क और मेमोरी जाँचना',
      'logs देखना और production की दिक्कतें पकड़ना',
    ],
  },
  beginner: {
    simple:
      'Linux वही ऑपरेटिंग सिस्टम है जिस पर लगभग हर सर्वर चलता है। यहाँ कोई डेस्कटॉप नहीं होता — आप कमांड टाइप करते हैं और Enter दबाते हैं। हर कमांड एक छोटा टूल है जो एक ही काम करता है: फ़ाइलें दिखाना, कुछ कॉपी करना, कोई प्रोग्राम इंस्टॉल करना, या यह बताना कि क्या-क्या चल रहा है। लगभग पंद्रह कमांड सीख लेने पर सर्वर का ज़्यादातर काम हो जाता है।',
    analogy:
      'Windows Explorer में फ़ोल्डर दिखते हैं और आप क्लिक करते हैं। Linux एक प्रॉम्प्ट दिखाता है और आप शब्दों में बताते हैं कि क्या चाहिए। अलमारी वही है, बस दराज़ खोलने का तरीक़ा अलग है।',
    before: [
      'अभ्यास के लिए कोई सर्वर — EC2 instance, कोई VPS, या Windows पर WSL।',
      'और कुछ नहीं। नीचे का सब कुछ आम Ubuntu मशीन पर चलता है।',
    ],
  },
  glossary: [
    { meaning: 'वह प्रोग्राम जो आपकी कमांड पढ़ता है। लाइन की शुरुआत में दिखने वाला $ (या #) उसी का प्रॉम्प्ट है।' },
    { meaning: 'आपके home फ़ोल्डर का छोटा नाम, जैसे /home/ubuntu।' },
    { meaning: 'सबसे ताक़तवर एडमिन अकाउंट। sudo किसी एक कमांड को root बनकर चलाता है।' },
    { meaning: 'absolute path / से शुरू होता है (डिस्क की जड़ से); relative path वहीं से शुरू होता है जहाँ आप अभी हैं।' },
    { meaning: 'read, write, execute — मालिक, group और बाक़ी सबके लिए अलग-अलग तय होते हैं।' },
    { meaning: 'चल रहा प्रोग्राम, जिसकी पहचान एक PID नंबर से होती है।' },
    { meaning: 'वह मैनेजर जो boot पर प्रोग्राम शुरू करता है और बंद होने पर दोबारा चालू करता है।' },
    { meaning: 'एक कमांड का आउटपुट अगली कमांड में भेजता है, जैसे ps aux | grep node।' },
  ],
  walkthrough: {
    title: 'सर्वर पर काम चलाने लायक़ Linux',
    intro:
      'किसी टेस्ट मशीन पर इन्हें क्रम से कीजिए। आख़िर तक आप घूम-फिर सकेंगे, फ़ाइलें एडिट कर सकेंगे, services चला सकेंगे, यूज़र संभाल सकेंगे और बिगड़े सर्वर की जाँच कर सकेंगे।',
    steps: [
      {
        title: 'रास्ता पहचानिए',
        why: 'शुरुआत में होने वाली लगभग हर गलती इसी वजह से होती है कि कमांड ग़लत फ़ोल्डर में चल गई। ये चार बताती हैं कि आप कहाँ हैं और वहाँ क्या है।',
        explain: [
          { meaning: 'लंबा फ़ॉर्मैट: permission, मालिक, साइज़ और बदलने की तारीख़।' },
          { meaning: 'छिपी हुई फ़ाइलें भी दिखाइए — डॉट से शुरू होने वाली सब, जैसे .env या .gitignore।' },
          { meaning: 'साइज़ पढ़ने लायक़ (4.0K, 12M), कच्चे बाइट्स में नहीं।' },
        ],
        note:
          'फ़ाइल का नाम अपने आप पूरा करने के लिए Tab दबाइए, और पिछली कमांड वापस लाने के लिए ↑ तीर। ये दो चीज़ें बाक़ी सबसे ज़्यादा समय बचाती हैं।',
      },
      {
        title: 'फ़ाइलें बनाइए, देखिए और एडिट कीजिए',
        why: 'सर्वर का ज़्यादातर काम कॉन्फ़िग फ़ाइलें एडिट करना ही है। nano सबसे आसान एडिटर है — उसके शॉर्टकट स्क्रीन के नीचे ही लिखे रहते हैं।',
        explain: [
          { meaning: 'सामान्य तरीक़े से टाइप कीजिए। Ctrl + O फ़ाइल लिखता है, Enter नाम कन्फ़र्म करता है, Ctrl + X बाहर निकालता है। Ctrl + W से खोज होती है।' },
          { meaning: 'नई लाइनें आते ही छापता रहता है — बग दोहराते हुए log देखने का यही तरीक़ा है।' },
          { meaning: 'यह तुरंत और हमेशा के लिए मिटा देता है। जिस path को दो बार जाँचा न हो, उस पर rm -rf कभी मत चलाइए।' },
        ],
        note:
          '/etc के अंदर फ़ाइल एडिट कर रहे हैं? उसे sudo nano से खोलिए, वरना पूरा कॉन्फ़िग टाइप करने के बाद सेव करते समय पता चलेगा कि फ़ाइल read-only है।',
      },
      {
        title: 'बिना एडिटर के कॉन्फ़िग फ़ाइल बनाइए',
        why: 'deploy स्क्रिप्ट में nano खोलकर बैठा नहीं जा सकता। heredoc एक ही कमांड में कई लाइनों वाली फ़ाइल लिख देता है — ऑटोमैटिक सेटअप इसी तरह .env बनाते हैं।',
        explain: [
          { meaning: 'EOF लाइन आने तक का सब कुछ फ़ाइल में चला जाता है। quotes लगाने से shell अंदर के $variable नहीं बदलता।' },
          { meaning: 'फ़ाइल को दोबारा लिख देता है। आगे जोड़ना हो तो >> इस्तेमाल कीजिए।' },
          { meaning: 'मालिक पढ़-लिख सकता है, बाक़ी कोई पढ़ भी नहीं सकता। secrets वाली हर फ़ाइल के लिए यही सही है।' },
        ],
        check: 'cat वही दिखाए जो आपने टाइप किया था, बिना किसी shell बदलाव के।',
      },
      {
        title: 'permission और ownership समझिए',
        why: '"Permission denied" और "403 Forbidden" असल में एक ही समस्या के दो चेहरे हैं। rwx वाला हिस्सा पढ़ना आ जाए तो तुरंत पता चल जाता है कि कौन क्या कर सकता है।',
        explain: [
          { meaning: 'पहला अक्षर: - मतलब फ़ाइल, d मतलब डायरेक्टरी, l मतलब symlink।' },
          { meaning: 'अगले तीन (rwx): मालिक क्या कर सकता है।' },
          { meaning: 'बीच के तीन (r-x): group के सदस्य क्या कर सकते हैं।' },
          { meaning: 'आख़िरी तीन (r--): बाक़ी सब क्या कर सकते हैं।' },
          { meaning: 'नंबर: r=4, w=2, x=1 जोड़कर बनते हैं। 600 = rw-------, 644 = rw-r--r--, 755 = rwxr-xr-x।' },
        ],
        note:
          'chmod 777 फ़ाइल को मशीन के हर यूज़र के लिए लिखने योग्य बना देता है। यह समस्या "हल" नहीं करता, सारी सुरक्षा हटा देता है — असली मालिक ढूँढिए।',
      },
      {
        title: 'सॉफ़्टवेयर इंस्टॉल और मैनेज कीजिए',
        why: 'package manager डाउनलोड, dependency और अपडेट — तीनों संभालता है। सोर्स से कंपाइल करना आख़िरी विकल्प होना चाहिए।',
        explain: [
          { meaning: 'update सिर्फ़ यह लिस्ट ताज़ा करता है कि क्या-क्या उपलब्ध है; असल इंस्टॉल upgrade करता है। बिना update किए upgrade चलाने पर पुराने वर्ज़न ही लगते हैं।' },
          { meaning: 'सवालों का जवाब अपने आप हाँ — स्क्रिप्ट में ज़रूरी है।' },
        ],
        note:
          'Amazon Linux, RHEL या Fedora पर इसकी जगह sudo dnf install होता है (पुराने सिस्टम पर yum)।',
      },
      {
        title: 'देखिए क्या चल रहा है, और उसे रोकिए',
        why: 'साइट धीमी हो या कोई port भरा हो, तो पहले यह पहचानना पड़ता है कि कौन-सा process ज़िम्मेदार है।',
        explain: [
          { meaning: 'हर process की एक झलक — PID, CPU और मेमोरी समेत।' },
          { meaning: 'उस लिस्ट में से सिर्फ़ "node" वाली लाइनें छाँटता है।' },
          { meaning: 'सुन रहे TCP+UDP socket और उनका प्रोग्राम दिखाता है — "port already in use" सुलझाने का सबसे तेज़ तरीक़ा।' },
          { meaning: 'इसे process नज़रअंदाज़ नहीं कर सकता, पर उसे डेटा सहेजने का मौक़ा भी नहीं मिलता। पहले सादा kill आज़माइए।' },
        ],
      },
      {
        title: 'अपना प्रोग्राम service की तरह चलाइए',
        why: 'reboot के बाद चीज़ें systemd ही चलाता है। Node के लिए PM2 इस्तेमाल करें तब भी, बाक़ी हर daemon के लिए यही फ़ाइल फ़ॉर्मैट मिलेगा।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X, फिर इसे चालू कीजिए:\nsudo systemctl daemon-reload\nsudo systemctl enable --now myworker\nsudo systemctl status myworker',
          lines: [
            { meaning: 'नेटवर्किंग चालू होने से पहले शुरू मत कीजिए।' },
            { meaning: 'root के बजाय सामान्य यूज़र के तौर पर चलाइए। service को उतनी ही ताक़त मिलनी चाहिए जितनी ज़रूरी हो।' },
            { meaning: 'आपकी .env से KEY=value लाइनें पढ़ता है। ध्यान रहे: systemd bash की तरह quotes नहीं समझता।' },
            { meaning: 'पूरा path देना ज़रूरी है — systemd के पास आपके shell जैसा PATH नहीं होता। अपना path ऐसे ढूँढिए: which node' },
            { meaning: 'जब भी बंद हो, 5 सेकंड रुककर दोबारा चालू कर दीजिए।' },
            { meaning: 'यही वह लाइन है जिससे "enable" करने पर service boot पर चलती है।' },
          ],
        },
        check:
          'sudo systemctl status myworker में active (running) दिखे; sudo journalctl -u myworker -f उसके logs लाइव दिखाता है।',
        note:
          'फ़ाइल एडिट की है? restart करने से पहले sudo systemctl daemon-reload चलाना ज़रूरी है, वरना systemd पुरानी फ़ाइल ही इस्तेमाल करता रहेगा।',
      },
      {
        title: 'डिस्क, मेमोरी देखिए और swap जोड़िए',
        why: 'छोटे सर्वरों की RAM npm install के दौरान ख़त्म हो जाती है और डिस्क logs से भर जाती है। ये कमांड दोनों पकड़ती हैं, और swap पहली समस्या को रोक देता है।',
        explain: [
          { meaning: 'अगर / वाली लाइन 100% दिखा रही है, तो अकेली यही बात "सब कुछ ख़राब है" वाले ज़्यादातर लक्षण समझा देती है।' },
          { meaning: 'हर चीज़ का कुल साइज़ — डिस्क खाने वाला फ़ोल्डर ऐसे ही मिलता है।' },
          { meaning: 'लाइन को root बनकर जोड़ता है, ताकि हर reboot के बाद swap दोबारा लग जाए।' },
        ],
        check: 'free -h में अब Swap की लाइन में 2.0Gi कुल दिखे।',
      },
      {
        title: 'दरवाज़े बंद कीजिए: फ़ायरवॉल की बुनियाद',
        why: 'हर खुला port एक दरवाज़ा है। ufw Linux फ़ायरवॉल का आसान चेहरा है, और इसे ठीक से लगाने में लगभग तीस सेकंड लगते हैं।',
        explain: [
          { meaning: 'पहले सब बंद, फिर जो चाहिए वही खोलिए — सही क्रम यही है।' },
          { meaning: 'यह enable से पहले कीजिए, वरना आप अपने ही सर्वर से बाहर हो जाएँगे।' },
          { meaning: 'एक नामी प्रोफ़ाइल जो port 80 और 443 दोनों संभालती है।' },
        ],
        note:
          'क्लाउड पर अब आपके पास दो फ़ायरवॉल हैं (ufw और security group)। ट्रैफ़िक को दोनों से इजाज़त मिलनी चाहिए।',
      },
      {
        title: 'cron से काम शेड्यूल कीजिए',
        why: 'बैकअप, सफ़ाई और रिपोर्ट मेल याद आने पर नहीं, समय पर चलनी चाहिए। cron इसी के लिए बना बिल्ट-इन शेड्यूलर है।',
        file: {
          save: 'nano में Ctrl + O → Enter → Ctrl + X से सेव कीजिए। cron नया शेड्यूल तुरंत लगा देता है और "crontab: installing new crontab" छापता है।',
          lines: [
            { meaning: 'पाँच खाने: मिनट, घंटा, महीने का दिन, महीना, हफ़्ते का दिन। तारा (*) मतलब "हर"।' },
            { meaning: 'रोज़ रात 02:00 बजे।' },
            { meaning: 'हर पाँच मिनट में।' },
            { meaning: 'सामान्य आउटपुट और एरर दोनों log में जोड़ता है — इसके बिना फ़ेल होना दिखता ही नहीं।' },
            { meaning: 'cron बहुत छोटे PATH के साथ चलता है, इसलिए curl नहीं, हमेशा /usr/bin/curl लिखिए।' },
          ],
        },
        check: 'crontab -l आपके जॉब दिखाए; grep CRON /var/log/syslog उन्हें चलते हुए दिखाता है।',
      },
      {
        title: 'बिगड़े सर्वर की जाँच कीजिए',
        why: 'जाँच का एक तय क्रम घबराहट को दो मिनट की आदत में बदल देता है।',
        explain: [
          { meaning: 'तीन नंबर = 1, 5 और 15 मिनट के औसत। लगातार आपके CPU की गिनती से ज़्यादा मतलब मशीन पूरी भरी हुई है।' },
          { meaning: 'पूरे सिस्टम की जगह सिर्फ़ एक systemd service के logs।' },
          { meaning: 'बताता है कि कहीं kernel ने ज़्यादा मेमोरी लेने पर आपका process तो नहीं मार दिया ("Out of memory: Killed process")।' },
        ],
      },
    ],
  },
  troubleshooting: [
    {
      cause: 'फ़ाइल root की है और आपने एडिटर सामान्य यूज़र के तौर पर खोला।',
      fix: 'sudo nano <file> से दोबारा खोलिए। vim में बिना दोबारा खोले सेव करने के लिए :w !sudo tee % भी चलता है।',
    },
    {
      cause: 'वह ऐसे फ़ोल्डर में इंस्टॉल हुआ जो PATH में नहीं है, या shell ने पुरानी जगह याद रखी है।',
      fix: 'hash -r चलाइए, या which/whereis से ढूँढकर पूरे path से चलाइए।',
    },
    {
      cause: 'logs, पुराने kernel या Docker इमेज ने डिस्क भर दी है।',
      fix: 'df -h से पुष्टि कीजिए, sudo du -sh /var/* से जगह ढूँढिए, फिर logs साफ़ कीजिए (sudo journalctl --vacuum-time=7d) और sudo apt autoremove।',
    },
    {
      cause: 'kernel के out-of-memory killer ने सबसे बड़े process को चुन लिया।',
      fix: 'dmesg -T | grep -i oom से पुष्टि कीजिए, फिर swap जोड़िए या बड़ा instance लीजिए।',
    },
    {
      cause: 'SSH allow करने से पहले ufw enable चला दिया।',
      fix: 'क्लाउड प्रोवाइडर के serial / EC2 Instance Connect कंसोल से अंदर जाइए और sudo ufw allow OpenSSH चलाइए। SSH हमेशा पहले allow कीजिए।',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Git                                                                */
/* ------------------------------------------------------------------ */
const git = {
  tagline: 'कोड के बदलावों का हिसाब रखने वाला version control',
  overview: {
    what: 'Git एक distributed version-control सिस्टम है जो आपके प्रोजेक्ट के snapshot रखता है, ताकि आप सुरक्षित तरीक़े से branch, merge और मिलकर काम कर सकें।',
    why: 'इससे टीमें साथ-साथ काम कर पाती हैं, पुराना इतिहास देख पाती हैं, गलतियाँ वापस ले पाती हैं और रिलीज़ संभाल पाती हैं — आज के सॉफ़्टवेयर सहयोग की बुनियाद यही है।',
    useCases: [
      'पूरे कोडबेस के बदलाव ट्रैक करना और रिव्यू करना',
      'टीम में feature branching और merging',
      'ख़राब बदलाव वापस लेना या production में hotfix करना',
      'GitHub/GitLab पर push करना और pull request खोलना',
    ],
  },
  beginner: {
    simple:
      'Git आपके प्रोजेक्ट का इतिहास रखता है। जब भी कोई काम पूरा होता है, आप एक छोटे मैसेज के साथ उसका snapshot (commit) ले लेते हैं। बाद में किसी भी snapshot को देखा जा सकता है, दो की तुलना की जा सकती है, कोई एक वापस लिया जा सकता है, या चालू वर्ज़न को छुए बिना अलग कॉपी (branch) में प्रयोग किया जा सकता है।',
    analogy:
      'यह याददाश्त वाला "Save As" है। report-final.doc, report-final-2.doc, report-FINAL-real.doc की जगह एक ही फ़ाइल रहती है, साथ में हर वर्ज़न की नामवाली टाइमलाइन — और दो लोगों के बदलाव जोड़ने की सुविधा भी।',
    before: [
      'Git इंस्टॉल हो: git --version। न हो तो sudo apt install git (Linux) या git-scm.com से डाउनलोड (Windows/macOS)।',
      'कोई भी प्रोजेक्ट फ़ोल्डर — अभ्यास के लिए एक फ़ाइल भी काफ़ी है।',
    ],
  },
  glossary: [
    { meaning: 'वह प्रोजेक्ट फ़ोल्डर जिसमें छिपा हुआ .git फ़ोल्डर है, जहाँ पूरा इतिहास रहता है।' },
    { meaning: 'एक सहेजा हुआ snapshot, साथ में यह बताने वाला मैसेज कि बदलाव क्यों हुआ।' },
    { meaning: 'प्रतीक्षा कक्ष। git add बदलाव यहाँ रखता है; git commit जो कुछ यहाँ है उसी को सहेजता है — इसी से कुछ फ़ाइलें commit और कुछ बाहर रखी जा सकती हैं।' },
    { meaning: 'commits की एक लाइन पर लगा खिसकने वाला लेबल। main आधिकारिक है; feature branch अधूरे काम को अलग रखती हैं।' },
    { meaning: 'repo की कहीं और रखी कॉपी, आम तौर पर GitHub पर। origin उसका डिफ़ॉल्ट उपनाम है।' },
    { meaning: 'merge दो branch को एक merge commit के साथ जोड़ता है। rebase आपके commits को ताज़ा main के ऊपर दोबारा रखता है, जिससे इतिहास सीधी लाइन में रहता है।' },
    { meaning: 'यह बताता है कि आप अभी कहाँ हैं — आम तौर पर चालू branch के सबसे नए commit पर।' },
    { meaning: 'दो लोगों ने एक ही लाइनें बदल दीं। Git रुककर आपसे चुनने को कहता है; कुछ भी खोता नहीं।' },
  ],
  walkthrough: {
    title: 'बिना ट्रैक हुए फ़ोल्डर से साफ़-सुथरे टीम वर्कफ़्लो तक',
    intro:
      'स्टेप 1–5 वही चक्र है जो आप रोज़ दोहराएँगे। स्टेप 6–8 में branching और वे undo कमांड हैं जिनकी ज़रूरत किसी दिन जल्दी में पड़ेगी।',
    steps: [
      {
        title: 'Git को बताइए कि आप कौन हैं',
        why: 'हर commit पर नाम और ईमेल की मुहर लगती है। इन्हें एक बार globally सेट कर दीजिए, वरना आपका इतिहास "unknown" के नाम से दर्ज होगा।',
        explain: [
          { meaning: 'इस मशीन के हर repo पर लागू। किसी एक प्रोजेक्ट के लिए बदलना हो तो repo के अंदर बिना --global चलाइए।' },
          { meaning: 'नए repo master की जगह main से शुरू होते हैं, जैसा GitHub पर होता है।' },
          { meaning: 'हर pull पर merge commit बनाने की जगह आपके commits ऊपर रख देता है, जिससे इतिहास सीधा रहता है।' },
        ],
        check: 'git config --list में आपका नाम और ईमेल दिखे। ये सेटिंग्स ~/.gitconfig में रहती हैं।',
      },
      {
        title: 'repository बनाइए',
        why: 'git init वह छिपा हुआ .git फ़ोल्डर बनाता है जो एक साधारण डायरेक्टरी को ट्रैक होने वाला प्रोजेक्ट बना देता है।',
        check: 'git status "On branch main" दिखाए और आपकी फ़ाइलें Untracked में गिनाए।',
        note:
          'पहले से मौजूद प्रोजेक्ट ला रहे हैं? git clone <url> एक ही स्टेप में init, डाउनलोड और remote सेटअप कर देता है।',
      },
      {
        title: 'पहले commit से पहले .gitignore लिखिए',
        why: 'यही वह स्टेप है जो बड़ी दुर्घटनाएँ रोकता है। secrets या node_modules एक बार commit हो गए तो इतिहास से हटाना मुश्किल है — और लीक हुई key लीक ही रहती है।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X। यह फ़ाइल repository की जड़ में होनी चाहिए, और ख़ुद भी commit होती है — पूरी टीम इसे साझा करती है।',
          lines: [
            { meaning: 'package.json से दोबारा इंस्टॉल हो सकता है। इसे commit करने से repo सैकड़ों MB भारी हो जाता है।' },
            { meaning: 'असली secrets। साथ में .env.example रखिए जिसमें नक़ली वैल्यू हों, ताकि टीम को पता रहे कौन-सी key चाहिए।' },
            { meaning: '! उस फ़ाइल को दोबारा शामिल कर लेता है जिसे ऊपर के किसी pattern ने बाहर कर दिया था।' },
            { meaning: 'SSH और TLS की private keys। पब्लिक GitHub पर push होते ही बॉट मिनटों में इन्हें ढूँढ लेते हैं।' },
            { meaning: 'आख़िर में / लगाना बताता है कि यह डायरेक्टरी है। इसके बिना उसी नाम की फ़ाइलें भी मैच होती हैं।' },
          ],
        },
        check: 'git status में अब node_modules या .env नहीं दिखने चाहिए।',
        note:
          'कोई secret पहले ही commit हो चुका है? .gitignore उसे नहीं हटाएगा। git rm --cached .env चलाइए, commit कीजिए, और फिर उस credential को बदल दीजिए — मान लीजिए कि वह लीक हो चुका है।',
      },
      {
        title: 'रोज़ का चक्र: status → add → commit',
        why: 'Git का 80% काम इन्हीं तीन कमांड से होता है। पहले stage करने की वजह से बिखरे हुए काम को साफ़, रिव्यू करने लायक़ commits में बाँटा जा सकता है।',
        explain: [
          { meaning: 'बिना stage किए बदलाव। जो commit होने वाला है उसे देखने के लिए git diff --staged इस्तेमाल कीजिए।' },
          { meaning: 'मौजूदा फ़ोल्डर का हर बदलाव stage कर देता है — तेज़ है, पर पहले git status ज़रूर देख लीजिए ताकि कुछ अनचाहा न चला जाए।' },
          { meaning: 'मैसेज। "क्या" नहीं, "क्यों" लिखिए: "Fix timezone bug in invoices" > "update file"।' },
        ],
        note:
          'जल्दी commit कर दिया? git commit --amend नए बदलाव पिछले commit में मिला देता है — पर सिर्फ़ तब तक, जब तक आपने उसे push न किया हो।',
      },
      {
        title: 'GitHub से जोड़िए और push कीजिए',
        why: 'local repo एक ही डिस्क पर रहता है। push करने से बैकअप, सहयोग और डिप्लॉय का स्रोत — तीनों मिल जाते हैं।',
        explain: [
          { meaning: 'एक आधुनिक key जोड़ी बनाता है। डिफ़ॉल्ट मानने के लिए तीन बार Enter दबाइए (passphrase वैकल्पिक है, पर समझदारी है)।' },
          { meaning: 'GitHub का URL origin नाम से सहेज देता है।' },
          { meaning: 'आपकी local main को remote वाली से जोड़ देता है, ताकि आगे सिर्फ़ git push लिखना काफ़ी हो।' },
        ],
        check:
          'ssh -T git@github.com जवाब दे "Hi username! You have successfully authenticated", और आपका कोड github.com पर दिखने लगे।',
      },
      {
        title: 'branch पर काम कीजिए, फिर merge कीजिए',
        why: 'branch से आप चालू वर्ज़न को ख़तरे में डाले बिना नया feature बना सकते हैं। हर टीम वर्कफ़्लो — और हर pull request — इसी पर टिका है।',
        explain: [
          { meaning: 'git checkout -b का नया रूप — काम वही, नाम ज़्यादा साफ़।' },
          { meaning: 'पुरानी main में merge करना वही बग वापस ले आता है जिसे कोई पहले ही ठीक कर चुका है।' },
          { meaning: 'merge हो चुकी branch ही डिलीट करता है। -D बिना merge हुई branch भी हटा देता है — संभलकर।' },
        ],
        note:
          'branch का नाम मक़सद से रखिए: feature/…, fix/…, chore/…। आगे चलकर branch लिस्ट ख़ुद एक changelog जैसी पढ़ी जाएगी।',
      },
      {
        title: 'merge conflict सुलझाइए',
        why: 'पहली बार conflict डरावना लगता है। असल में Git सिर्फ़ कह रहा है कि "इन लाइनों के दो रूप हैं, एक चुनिए" — न कुछ खोया है, न टूटा है।',
        explain: [
          { meaning: 'इस निशान के नीचे वाला हिस्सा वह है जो पहले से आपकी branch पर है।' },
          { meaning: 'दोनों रूपों के बीच की विभाजक लाइन।' },
          { meaning: 'आने वाले रूप का अंत। हाथ से कोड मिलाने के बाद तीनों निशान हटा दीजिए।' },
        ],
        check: 'git status में कोई unmerged path न बचे, और फ़ाइल में <<<<<<< जैसे निशान न रह जाएँ।',
      },
      {
        title: 'सुरक्षित तरीक़े से चीज़ें वापस लीजिए',
        why: 'ज़रूरत पड़ने से पहले ये चार जान लेना डरावने पल को दस सेकंड के काम में बदल देता है।',
        explain: [
          { meaning: 'revert एक नया commit बनाकर पुराने को उलट देता है — push के बाद भी सुरक्षित। reset इतिहास बदल देता है — सिर्फ़ उन commits के लिए जो किसी और के पास नहीं हैं।' },
          { meaning: 'branch को एक commit पीछे ले जाता है पर आपकी फ़ाइलें जस की तस रहती हैं। ख़राब commit मैसेज सुधारने या commit को बाँटने के लिए बढ़िया।' },
          { meaning: '"खोए हुए" commits भी यहाँ लगभग 90 दिन रहते हैं। git reset --hard <hash> से उन्हें वापस लाया जा सकता है।' },
        ],
        note:
          'git reset --hard बिना commit किया काम हमेशा के लिए मिटा देता है। शक़ हो तो पहले git stash कर लीजिए।',
      },
      {
        title: 'अधूरा काम stash में रखिए',
        why: 'production का बग हमेशा feature के बीच में ही आता है। stash आपके आधे काम को बिना कचरा commit किए किनारे रख देता है।',
        explain: [
          { meaning: 'ट्रैक हो रहे बदलावों को एक लेबल के साथ सहेजकर फ़ोल्डर साफ़ कर देता है।' },
          { meaning: 'सबसे नया stash वापस लगाकर उसे लिस्ट से हटा देता है। सारी लिस्ट देखने के लिए git stash list।' },
        ],
        note:
          'stash डिफ़ॉल्ट रूप से untracked फ़ाइलें छोड़ देता है — नई फ़ाइलें भी साथ ले जानी हों तो -u लगाइए।',
      },
    ],
  },
  troubleshooting: [
    {
      cause: 'आपके काम करते समय किसी और ने push कर दिया।',
      fix: 'git pull --rebase चलाइए, फिर दोबारा push कीजिए। साझा branch पर इसे --force से कभी "ठीक" मत कीजिए।',
    },
    {
      cause: '.gitignore बनने से पहले .env या कोई key add हो गई थी।',
      fix: 'पहले उस credential को बदलिए — सफ़ाई से ज़्यादा ज़रूरी यही है। फिर git rm --cached से हटाइए, commit कीजिए, और repo पब्लिक हो तो git filter-repo से इतिहास साफ़ कीजिए।',
    },
    {
      cause: 'ignore करने से पहले ही वह commit हो चुका था; .gitignore पहले से ट्रैक फ़ाइलों पर लागू नहीं होता।',
      fix: 'git rm -r --cached node_modules && git commit -m "Stop tracking node_modules"।',
    },
    {
      cause: 'आपने branch की जगह किसी commit hash या tag को checkout कर लिया।',
      fix: 'कुछ नहीं बिगड़ा। वापस आने के लिए git switch main; वहाँ किया काम रखना हो तो git switch -c newbranch।',
    },
    {
      cause: 'user.email कभी सेट ही नहीं हुआ, या ऑफ़िस/निजी अकाउंट आपस में मिल गए।',
      fix: 'उसे सेट कीजिए, फिर पिछले commit के लिए: git commit --amend --reset-author।',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  GitHub                                                             */
/* ------------------------------------------------------------------ */
const github = {
  tagline: 'क्लाउड पर Git होस्टिंग और सहयोग, gh CLI से चलने वाला',
  overview: {
    what: 'GitHub क्लाउड पर Git repositories होस्ट करता है और उनके साथ pull request, issues, Actions (CI/CD) और releases जोड़ता है। आधिकारिक GitHub CLI (gh) यह सब टर्मिनल से करा देता है।',
    why: 'यह सहयोग को एक जगह ले आता है — कोड रिव्यू, ऑटोमेशन और प्रोजेक्ट मैनेजमेंट — और gh की मदद से repo/PR/issue का काम shell छोड़े बिना होता है।',
    useCases: [
      'repo होस्ट करना और pull request रिव्यू करना',
      'GitHub Actions से बिल्ड और डिप्लॉय ऑटोमैटिक करना',
      'issue दर्ज करना और उन्हें छाँटना',
      'वर्ज़न वाली releases प्रकाशित करना',
    ],
  },
  beginner: {
    simple:
      'Git आपके कंप्यूटर पर रहता है; GitHub वह जगह है जहाँ वही इतिहास ऑनलाइन रखा जाता है। इसके ऊपर सहयोग की परत जुड़ जाती है: हर प्रोजेक्ट का एक पेज, pull request जहाँ बदलाव merge होने से पहले जाँचे जाते हैं, काम ट्रैक करने के लिए issues, और Actions — यानी वे सर्वर जो हर push पर आपका कोड ख़ुद टेस्ट और डिप्लॉय करते हैं।',
    analogy:
      'Git किसी दस्तावेज़ का track-changes है। GitHub साझा ड्राइव है, साथ में रिव्यू मीटिंग, टू-डू लिस्ट, और वह सहायक जो आख़िरी कॉपी ख़ुद प्रकाशित कर देता है।',
    before: [
      'एक GitHub अकाउंट और local Git कॉन्फ़िगर किया हुआ (देखिए Git गाइड)।',
      'अपने अकाउंट में जुड़ी SSH key, ताकि push हर बार पासवर्ड न माँगे।',
      'वैकल्पिक पर सुझाया हुआ: gh CLI — इससे ज़्यादातर काम एक लाइन में हो जाता है।',
    ],
  },
  glossary: [
    { meaning: 'GitHub पर एक प्रोजेक्ट: कोड, इतिहास, issues और सेटिंग्स।' },
    { meaning: 'किसी और के repo की आपकी अपनी कॉपी, उन प्रोजेक्ट में योगदान देने के लिए जहाँ आप सीधे push नहीं कर सकते।' },
    { meaning: 'एक branch को दूसरी में merge करने का प्रस्ताव, जिसके साथ diff, चर्चा और जाँचें जुड़ी होती हैं।' },
    { meaning: 'किसी साथी का PR पढ़कर उसे approve करना या बदलाव माँगना।' },
    { meaning: '.github/workflows/ में YAML फ़ाइलों से तय ऑटोमेशन, जिसे GitHub अपनी मशीनों पर चलाता है।' },
    { meaning: 'वह वर्चुअल मशीन जिस पर workflow का job चलता है, जैसे ubuntu-latest।' },
    { meaning: 'repo सेटिंग्स में सहेजी गई encrypted वैल्यू (SSH key, token) जो workflow में डाली जाती है — कोड में कभी नहीं लिखी जाती।' },
    { meaning: 'वह नियम जो main पर सीधे push रोकता है और पहले PR तथा पास होती जाँचें माँगता है।' },
  ],
  walkthrough: {
    title: 'प्रोजेक्ट प्रकाशित कीजिए, बदलाव ढंग से रिव्यू कीजिए, और अपने आप डिप्लॉय कीजिए',
    intro:
      'स्टेप 1–3 में कोड ऑनलाइन आ जाता है। स्टेप 4–5 वह तरीक़ा है जिससे टीमें असल में काम करती हैं। स्टेप 6–8 वह पाइपलाइन बनाते हैं जो main पर हर merge के बाद आपके EC2 सर्वर पर डिप्लॉय कर देती है।',
    steps: [
      {
        title: 'एक बार authentication कर लीजिए',
        why: 'GitHub ने Git कामों के लिए अकाउंट पासवर्ड लेना बंद कर दिया है। SSH keys (या gh CLI) उनकी जगह लेती हैं और डिप्लॉय के बीच में कभी ख़त्म नहीं होतीं।',
        check:
          'ssh -T छापे "Hi <username>! You have successfully authenticated"; gh auth status में लॉगिन किया अकाउंट दिखे।',
        note:
          'सर्वर पर अपनी निजी key की जगह repository की deploy key (read-only) रखिए — सर्वर हैक होने पर नुक़सान सीमित रहता है।',
      },
      {
        title: 'repository बनाइए और push कीजिए',
        why: 'इससे आपका local इतिहास ऑनलाइन आ जाता है। यह .gitignore बनने के बाद कीजिए, ताकि secrets कभी साथ न जाएँ।',
        explain: [
          { meaning: 'private से शुरू कीजिए। बाद में public किया जा सकता है; पर जो सर्च इंजन ने पकड़ लिया उसे वापस नहीं लिया जा सकता।' },
          { meaning: 'मौजूदा फ़ोल्डर को ही repository की सामग्री बनाता है।' },
          { meaning: 'पहले से बने commits तुरंत अपलोड कर देता है।' },
        ],
        check: 'repo पेज पर आपकी फ़ाइलें और commit इतिहास दिखने लगे।',
      },
      {
        title: 'ऐसा README लिखिए जो ख़ुद सब समझा दे',
        why: 'यही सबसे पहले दिखता है — किसी recruiter को, किसी साथी को, या छह महीने बाद ख़ुद आपको। जिस repo में सेटअप के निर्देश नहीं, उसे कोई चला नहीं सकता।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X, फिर: git add README.md && git commit -m "Add README" && git push',
          lines: [
            { meaning: 'कमांड को तीन backtick में लपेटिए ताकि वे कॉपी बटन वाले code block की तरह दिखें।' },
            { meaning: '.env.example की हर key का ब्यौरा देता है, बिना एक भी असली वैल्यू बताए।' },
            { meaning: 'अगर कोई चार कमांड में clone से चलने तक नहीं पहुँच सकता, तो README अधूरा है।' },
          ],
        },
      },
      {
        title: 'main branch को सुरक्षित कीजिए',
        why: 'इसके बिना कोई भी (आधी रात को आप ख़ुद भी) टूटा कोड सीधे production में डाल सकता है। protection हर बदलाव को PR और पास होती जाँचों से गुज़ारता है।',
        ui: [
          'Repo → Settings → Branches → Add branch protection rule।',
          'Branch name pattern: main।',
          '"Require a pull request before merging" पर टिक (टीम के लिए 1 approval)।',
          '"Require status checks to pass" पर टिक करके अपना CI workflow चुनिए (एक बार चल जाने के बाद वह दिखने लगेगा)।',
          '"Require conversation resolution before merging" पर टिक कीजिए।',
        ],
        check:
          'अब सीधा git push origin main "protected branch hook declined" कहकर रुक जाएगा।',
      },
      {
        title: 'pull request वाला तरीक़ा',
        why: 'PR वह जगह है जहाँ diff, चर्चा, ऑटोमैटिक टेस्ट और approval — सब एक साथ रहते हैं। हर टीम में काम की इकाई यही है।',
        explain: [
          { meaning: 'issue नंबर जोड़ने पर PR merge होते ही वह issue अपने आप बंद हो जाता है।' },
          { meaning: 'PR से जुड़े हर workflow का status टर्मिनल में ही दिखा देता है।' },
          { meaning: 'PR के सारे commits को main पर एक साफ़ commit में समेट देता है।' },
          { meaning: 'branch को remote और local दोनों जगह से हटा देता है, जिससे लिस्ट छोटी रहती है।' },
        ],
        note:
          'PR छोटे रखिए। 200 लाइन के PR का असली रिव्यू होता है; 2000 लाइन के PR पर सिर्फ़ "LGTM" आता है।',
      },
      {
        title: 'CI जोड़िए: हर push अपने आप टेस्ट हो',
        why: 'टूटा कोड main तक पहुँचने से रोकने का सबसे सस्ता तरीक़ा। GitHub इसे अपनी मशीनों पर चलाता है — पब्लिक repo पर मुफ़्त, और private पर भी अच्छा-ख़ासा free tier मिलता है।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X, फिर commit करके push कीजिए। रन तुरंत Actions टैब में दिखने लगेगा।',
          lines: [
            { meaning: 'कब चलेगा: main पर push होने पर, और हर PR पर।' },
            { meaning: 'एक साफ़ वर्चुअल मशीन, जो हर रन के लिए नई बनती है और बाद में मिटा दी जाती है।' },
            { meaning: 'आपका repository runner पर डाउनलोड करता है। लगभग हर workflow इसी से शुरू होता है।' },
            { meaning: 'npm का डाउनलोड फ़ोल्डर रनों के बीच cache करता है, जिससे इंस्टॉल का समय आम तौर पर आधा रह जाता है।' },
            { meaning: 'बिल्कुल वही इंस्टॉल करता है जो lock फ़ाइल कहती है — npm install के उलट, हर बार एक जैसा।' },
            { meaning: 'दो स्पेस, tab कभी नहीं। workflow के न चलने की सबसे आम वजह एक tab ही होती है।' },
          ],
        },
        check: 'Actions टैब में आपके commit के आगे हरा टिक दिखे।',
      },
      {
        title: 'डिप्लॉय के secrets सहेजिए',
        why: 'डिप्लॉय workflow को आपके सर्वर की SSH key चाहिए। secrets encrypted रहते हैं, logs में छिपा दिए जाते हैं, और कोडबेस में कभी नहीं आते।',
        ui: [
          'Repo → Settings → Secrets and variables → Actions → New repository secret।',
          'EC2_HOST जोड़िए — आपके सर्वर का IP या domain।',
          'EC2_USER जोड़िए — आम तौर पर ubuntu।',
          'EC2_SSH_KEY जोड़िए — पूरी private key चिपकाइए, BEGIN और END लाइनों समेत।',
        ],
        note:
          'निजी key नहीं, अलग deploy key इस्तेमाल कीजिए। कभी लीक हो जाए तो सिर्फ़ एक key बदलनी पड़ेगी, आपकी बाक़ी सारी चीज़ें नहीं।',
      },
      {
        title: 'merge होते ही सर्वर पर अपने आप डिप्लॉय कीजिए',
        why: 'इससे चक्र पूरा हो जाता है: PR merge कीजिए, और एक मिनट बाद बदलाव लाइव — न SSH, न कोई भूला हुआ स्टेप, न "मेरी मशीन पर तो चल रहा था"।',
        file: {
          save: 'Ctrl + O → Enter → Ctrl + X, फिर commit करके main पर push कीजिए। Actions टैब में इसे लाइव चलते देखिए।',
          lines: [
            { meaning: 'सिर्फ़ merge हुआ कोड डिप्लॉय होता है — feature branch पर सिर्फ़ CI चलती है।' },
            { meaning: 'डिप्लॉय को क़तार में लगाता है, ताकि दो एक साथ चलकर बीच में फ़ोल्डर ख़राब न कर दें।' },
            { meaning: 'चलते समय encrypted secret पढ़ता है। GitHub इन वैल्यू को logs में छिपा देता है।' },
            { meaning: 'पहली फ़ेल होती कमांड पर ही रुक जाइए, ताकि अधूरा install कभी pm2 reload तक न पहुँचे।' },
            { meaning: 'zero-downtime restart, जो environment के बदलाव भी उठा लेता है।' },
          ],
        },
        check:
          'main पर push कीजिए, job हरा होते देखिए, फिर सर्वर पर pm2 list से पुष्टि कीजिए — uptime फिर से शून्य से शुरू मिलेगा।',
        note:
          'हर डिप्लॉय पर किसी इंसान की मंज़ूरी चाहिए तो job में "environment: production" जोड़कर required reviewers चालू कीजिए।',
      },
    ],
  },
  troubleshooting: [
    {
      cause: 'HTTPS पर अकाउंट पासवर्ड से push किया जा रहा है।',
      fix: 'remote को SSH पर ले जाइए (git remote set-url origin git@github.com:user/repo.git) या personal access token इस्तेमाल कीजिए।',
    },
    {
      cause: 'SSH key लोड नहीं है या आपके GitHub अकाउंट में जुड़ी नहीं है।',
      fix: 'ssh-add ~/.ssh/id_ed25519 चलाइए, ssh -T git@github.com से जाँचिए, और Settings → SSH keys में public key की मौजूदगी देखिए।',
    },
    {
      cause: 'ग़लत path या ख़राब YAML — फ़ाइल डिफ़ॉल्ट branch पर .github/workflows/*.yml होनी चाहिए।',
      fix: 'नाम और indentation जाँचिए (सिर्फ़ स्पेस)। फ़ाइल मिल गई पर ग़लत है, तो Actions टैब parse एरर दिखाता है।',
    },
    {
      cause: 'runner ने आपका सर्वर पहले कभी नहीं देखा।',
      fix: 'ज़्यादातर SSH actions यह ख़ुद संभालते हैं; न हो तो एक स्टेप जोड़िए: ssh-keyscan -H $HOST >> ~/.ssh/known_hosts।',
    },
    {
      cause: 'fork से आए pull request वाले workflow को secrets नहीं मिलते।',
      fix: 'डिप्लॉय सिर्फ़ main पर push होने पर कीजिए, और fork के PR को बिल्ड/टेस्ट तक सीमित रखिए।',
    },
    {
      cause: 'branch protection बिल्कुल वही कर रहा है जिसके लिए बना है।',
      fix: 'एक branch बनाइए, PR खोलिए, जाँचें हरी कीजिए और वहीं से merge कीजिए।',
    },
  ],
}

export const walkthroughsHi = {
  'AWS EC2': awsEc2,
  'AWS SES': awsSes,
  Nginx: nginx,
  PM2: pm2,
  Linux: linux,
  Git: git,
  GitHub: github,
}

export default walkthroughsHi
