/* ------------------------------------------------------------------ *
 *  Two-language support for the skill guides (English / हिंदी).        *
 *                                                                      *
 *  Only the *prose* is translated. Commands, config file contents and  *
 *  file paths deliberately stay in English — they are code, and a      *
 *  translated command would simply not run.                            *
 * ------------------------------------------------------------------ */

const STORAGE_KEY = 'guide-lang'

export const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिंदी', short: 'हिं' },
]

/** ?lang=hi wins (shareable links), then the last choice, then English. */
export function getInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const param = new URLSearchParams(window.location.search).get('lang')
  if (param === 'hi' || param === 'en') return param
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'hi' || saved === 'en') return saved
  } catch {
    /* private mode / storage blocked */
  }
  return 'en'
}

export function storeLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* ignore */
  }
}

/* Interface strings. Data-driven text lives with the guides themselves. */
const strings = {
  en: {
    back: 'Back to portfolio',
    referenceBadge: 'Technical Reference',
    pageTitle: 'Command & Skills Guide',
    pageIntro:
      'Plain-English guides to the infrastructure I work with — what each tool is, why it exists, and a step-by-step walkthrough with every command and config file written out in full.',
    skills: 'Skills',
    switchTo: 'हिंदी में पढ़ें',
    readingIn: 'Reading in English',

    /* section names, also used by the jump nav */
    navStart: 'Start here',
    navWords: 'Key words',
    navSteps: 'Step by step',
    navFixes: 'When it breaks',
    navReference: 'Reference',

    startTitle: 'Start here — what this actually is',
    inOneLine: 'In one line',
    whyUsed: 'Why it is used',
    before: 'Before you begin, you need',
    useCases: 'Where it is used',

    wordsTitle: 'Key words you will keep seeing',
    wordsBlurb:
      'Every term below appears in the steps that follow. Skim it once and the rest reads much easier.',

    fixesTitle: 'When it breaks',
    fixesBlurb: 'The errors you are most likely to hit, and the fix for each.',
    cause: 'Cause:',
    fix: 'Fix:',

    referenceTitle: 'Reference',
    referenceBlurb:
      'Lookup material — open a section when you need it. The guide above is the part to read.',
    commandsTitle: 'All commands, by job',
    scenariosTitle: 'Quick checklists',
    practicesTitle: 'Best practices',

    /* step labels */
    step: 'Step',
    why: 'Why:',
    inDashboard: 'Do this in the dashboard',
    inTerminal: 'Run this in the terminal',
    createFile: 'create this file',
    howToSave: 'How to save:',
    lineByLine: 'What each line means',
    worksWhen: 'It worked if:',
    watchOut: 'Watch out:',

    /* command card labels */
    purpose: 'Purpose:',
    example: 'Example:',
    result: 'Result:',
    referenceNote:
      'This lookup section is only available in English — the commands themselves are English anyway.',
  },

  hi: {
    back: 'पोर्टफोलियो पर वापस',
    referenceBadge: 'तकनीकी गाइड',
    pageTitle: 'कमांड और स्किल्स गाइड',
    pageIntro:
      'जिन टूल्स पर मैं काम करता हूँ, उनकी आसान भाषा में गाइड — हर टूल क्या है, क्यों इस्तेमाल होता है, और शुरू से आख़िर तक हर कमांड और कॉन्फ़िग फ़ाइल के साथ पूरा तरीका।',
    skills: 'स्किल्स',
    switchTo: 'Read in English',
    readingIn: 'हिंदी में पढ़ रहे हैं',

    navStart: 'शुरुआत यहाँ से',
    navWords: 'ज़रूरी शब्द',
    navSteps: 'स्टेप बाय स्टेप',
    navFixes: 'दिक्कत आने पर',
    navReference: 'रेफ़रेंस',

    startTitle: 'शुरुआत यहाँ से — यह असल में है क्या',
    inOneLine: 'एक लाइन में',
    whyUsed: 'इस्तेमाल क्यों होता है',
    before: 'शुरू करने से पहले आपके पास होना चाहिए',
    useCases: 'कहाँ इस्तेमाल होता है',

    wordsTitle: 'ये शब्द बार-बार मिलेंगे',
    wordsBlurb:
      'नीचे दिए गए सारे शब्द आगे के स्टेप्स में आएँगे। एक बार पढ़ लीजिए, फिर बाकी सब आसान लगेगा।',

    fixesTitle: 'दिक्कत आने पर',
    fixesBlurb: 'सबसे आम एरर, उनकी वजह, और हर एक का हल।',
    cause: 'वजह:',
    fix: 'हल:',

    referenceTitle: 'रेफ़रेंस',
    referenceBlurb:
      'ज़रूरत पड़ने पर खोलिए — पढ़ने वाला हिस्सा ऊपर की गाइड है, यह सिर्फ़ देखने के लिए है।',
    commandsTitle: 'काम के हिसाब से सारे कमांड',
    scenariosTitle: 'छोटी चेकलिस्ट',
    practicesTitle: 'अच्छी आदतें',

    step: 'स्टेप',
    why: 'क्यों:',
    inDashboard: 'यह डैशबोर्ड में करना है',
    inTerminal: 'यह टर्मिनल में चलाइए',
    createFile: 'यह फ़ाइल बनाइए',
    howToSave: 'सेव कैसे करें:',
    lineByLine: 'हर लाइन का मतलब',
    worksWhen: 'सही हुआ, अगर:',
    watchOut: 'ध्यान दें:',

    purpose: 'काम:',
    example: 'उदाहरण:',
    result: 'नतीजा:',
    referenceNote:
      'यह लुकअप हिस्सा फ़िलहाल सिर्फ़ अंग्रेज़ी में है — कमांड वैसे भी अंग्रेज़ी में ही चलते हैं।',
  },
}

export const t = (lang) => strings[lang] || strings.en
