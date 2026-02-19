let zhVoice = null;

function findChineseVoice() {
  const voices = speechSynthesis.getVoices();
  zhVoice =
    voices.find(v => v.lang === 'zh-TW') ||
    voices.find(v => v.lang.startsWith('zh')) ||
    null;
  return zhVoice;
}

if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => findChineseVoice();
  findChineseVoice();
}

export function speak(text) {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 0.8;
  const voice = findChineseVoice();
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
