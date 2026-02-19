export const words = [
  {
    id: 1,
    chinese: '你好',
    pinyin: 'Nǐ hǎo',
    english: 'Hello',
    usage: 'Greet anyone you meet — shopkeepers, hotel staff, locals.',
    example: '你好！請問⋯',
    examplePinyin: 'Nǐ hǎo! Qǐng wèn…',
    exampleEnglish: 'Hello! May I ask…',
  },
  {
    id: 2,
    chinese: '謝謝',
    pinyin: 'Xiè xiè',
    english: 'Thank you',
    usage: 'Show gratitude anywhere — restaurants, taxis, night markets.',
    example: '謝謝你的幫忙！',
    examplePinyin: 'Xiè xiè nǐ de bāng máng!',
    exampleEnglish: 'Thank you for your help!',
  },
  {
    id: 3,
    chinese: '對不起',
    pinyin: 'Duì bù qǐ',
    english: 'Sorry / Excuse me',
    usage: 'Apologize or get someone\'s attention politely.',
    example: '對不起，請問洗手間在哪裡？',
    examplePinyin: 'Duì bù qǐ, qǐng wèn xǐ shǒu jiān zài nǎ lǐ?',
    exampleEnglish: 'Excuse me, where is the restroom?',
  },
  {
    id: 4,
    chinese: '多少錢',
    pinyin: 'Duō shǎo qián',
    english: 'How much?',
    usage: 'Essential for shopping at markets, stores, and street vendors.',
    example: '這個多少錢？',
    examplePinyin: 'Zhè ge duō shǎo qián?',
    exampleEnglish: 'How much is this?',
  },
  {
    id: 5,
    chinese: '好的',
    pinyin: 'Hǎo de',
    english: 'OK / Alright',
    usage: 'Agree, confirm, or acknowledge — works in almost any situation.',
    example: '好的，沒問題！',
    examplePinyin: 'Hǎo de, méi wèn tí!',
    exampleEnglish: 'OK, no problem!',
  },
];

export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuizOptions(correctWord, allWords) {
  const others = shuffle(allWords.filter(w => w.id !== correctWord.id));
  const options = [correctWord, ...others.slice(0, 3)];
  return shuffle(options);
}
