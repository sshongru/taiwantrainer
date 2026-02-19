import { LitElement, html, css } from 'lit';
import { words, shuffle } from './words.js';
import { buttonStyles } from './shared-styles.js';
import './flashcard.js';
import './quiz.js';
import './progress-bar.js';
import './logo.js';

const STORAGE_KEY = 'taiwan-trainer-progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* localStorage unavailable */ }
}

class TaiwanTrainerApp extends LitElement {
  static properties = {
    screen: { type: String },
    currentIndex: { type: Number },
    score: { type: Number },
    quizWords: { type: Array },
    quizIndex: { type: Number },
    quizResults: { type: Array },
    bestScore: { type: Number },
    wordsReviewed: { type: Number },
  };

  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
        font-family: 'Inter', 'Noto Sans TC', sans-serif;
      }

      .header {
        text-align: center;
        padding: 1.5rem 0 1rem;
      }

      .header trainer-logo {
        margin-bottom: 0.4rem;
      }

      .header h1 {
        font-size: 1.6rem;
        font-weight: 900;
        background: linear-gradient(135deg, #ff6b6b, #ffa502, #ff6348);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
      }

      .header .subtitle {
        font-size: 0.85rem;
        color: #aaa;
        margin-top: 0.25rem;
      }

      .home-screen {
        text-align: center;
        padding: 2rem 1rem;
      }

      .home-screen p {
        color: #ccc;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
      }

      .word-preview {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 2rem;
      }

      .word-chip {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0.75rem 1rem;
        text-align: left;
        cursor: default;
        transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease,
          box-shadow 0.25s ease;
      }

      .word-chip:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 165, 2, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(255, 165, 2, 0.12);
      }

      .word-chip .zh {
        font-size: 1.4rem;
        font-weight: 700;
        font-family: 'Noto Sans TC', sans-serif;
        min-width: 3.5rem;
      }

      .word-chip .meta {
        display: flex;
        flex-direction: column;
      }

      .word-chip .pinyin {
        font-size: 0.8rem;
        color: #ffa502;
      }

      .word-chip .en {
        font-size: 0.85rem;
        color: #ccc;
      }

      .progress-stats {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .stat {
        text-align: center;
      }

      .stat-value {
        font-size: 1.4rem;
        font-weight: 700;
        color: #ffa502;
      }

      .stat-label {
        font-size: 0.7rem;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .results {
        text-align: center;
        padding: 2rem 1rem;
      }

      .results .trophy {
        font-size: 4rem;
        margin-bottom: 0.5rem;
      }

      .results h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .results .score-text {
        font-size: 1.1rem;
        color: #ffa502;
        margin-bottom: 0.5rem;
      }

      .results .msg {
        color: #aaa;
        margin-bottom: 2rem;
        line-height: 1.5;
      }

      .result-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 2rem;
      }

      .result-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        padding: 0.65rem 1rem;
        text-align: left;
      }

      .result-item .icon {
        font-size: 1.3rem;
        flex-shrink: 0;
      }

      .result-item .detail {
        flex: 1;
      }

      .result-item .detail .zh {
        font-family: 'Noto Sans TC', sans-serif;
        font-weight: 600;
      }

      .result-item .detail .en {
        font-size: 0.8rem;
        color: #aaa;
      }

      .btn-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .nav-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        margin-bottom: 0.5rem;
      }

      .nav-back {
        background: none;
        border: none;
        color: #aaa;
        font-size: 0.85rem;
        cursor: pointer;
        padding: 0.4rem 0.6rem;
        border-radius: 8px;
        font-family: inherit;
        transition: color 0.25s ease, background 0.25s ease;
      }

      .nav-back:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      .nav-count {
        font-size: 0.8rem;
        color: #888;
      }
    `,
  ];

  constructor() {
    super();
    this.screen = 'home';
    this.currentIndex = 0;
    this.score = 0;
    this.quizWords = [];
    this.quizIndex = 0;
    this.quizResults = [];
    this._pendingTimeout = null;

    const saved = loadProgress();
    this.bestScore = saved?.bestScore ?? 0;
    this.wordsReviewed = saved?.wordsReviewed ?? 0;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._pendingTimeout) {
      clearTimeout(this._pendingTimeout);
      this._pendingTimeout = null;
    }
  }

  render() {
    return html`
      <div class="header">
        <trainer-logo size="72"></trainer-logo>
        <h1>Taiwan Trainer</h1>
        <div class="subtitle">Learn Mandarin for your trip 🇹🇼</div>
      </div>
      ${this._renderScreen()}
    `;
  }

  _renderScreen() {
    switch (this.screen) {
      case 'home':
        return this._renderHome();
      case 'learn':
        return this._renderLearn();
      case 'quiz':
        return this._renderQuiz();
      case 'results':
        return this._renderResults();
      default:
        return this._renderHome();
    }
  }

  _renderHome() {
    return html`
      <div class="home-screen">
        <p>
          Learn five essential Mandarin words you'll use every day in Taiwan — from greeting locals
          to bargaining at night markets.
        </p>
        ${this.wordsReviewed > 0 || this.bestScore > 0
          ? html`
            <div class="progress-stats">
              <div class="stat">
                <div class="stat-value">${this.wordsReviewed}</div>
                <div class="stat-label">Words Reviewed</div>
              </div>
              <div class="stat">
                <div class="stat-value">${this.bestScore} / ${words.length}</div>
                <div class="stat-label">Best Quiz Score</div>
              </div>
            </div>
          `
          : ''}
        <div class="word-preview">
          ${words.map(
            w => html`
              <div class="word-chip">
                <span class="zh">${w.chinese}</span>
                <span class="meta">
                  <span class="pinyin">${w.pinyin}</span>
                  <span class="en">${w.english}</span>
                </span>
              </div>
            `
          )}
        </div>
        <button class="btn btn-primary btn-full" @click=${this._startLearn}>
          Start Learning
        </button>
      </div>
    `;
  }

  _renderLearn() {
    const word = words[this.currentIndex];
    return html`
      <div class="nav-bar">
        <button class="nav-back" @click=${this._goHome}>← Home</button>
        <span class="nav-count">${this.currentIndex + 1} / ${words.length}</span>
      </div>
      <trainer-progress
        .current=${this.currentIndex}
        .total=${words.length}
      ></trainer-progress>
      <trainer-flashcard
        .word=${word}
        .isLast=${this.currentIndex === words.length - 1}
        @next-word=${this._nextWord}
        @start-quiz=${this._startQuiz}
      ></trainer-flashcard>
    `;
  }

  _renderQuiz() {
    const word = this.quizWords[this.quizIndex];
    return html`
      <div class="nav-bar">
        <button class="nav-back" @click=${this._goHome}>← Home</button>
        <span class="nav-count">Quiz ${this.quizIndex + 1} / ${this.quizWords.length}</span>
      </div>
      <trainer-progress
        .current=${this.quizIndex}
        .total=${this.quizWords.length}
      ></trainer-progress>
      <trainer-quiz
        .word=${word}
        .allWords=${words}
        @quiz-answer=${this._handleQuizAnswer}
      ></trainer-quiz>
    `;
  }

  _renderResults() {
    const total = this.quizResults.length;
    const correct = this.quizResults.filter(r => r.correct).length;
    const perfect = correct === total;
    return html`
      <div class="results">
        <div class="trophy">${perfect ? '🎉' : '💪'}</div>
        <h2>${perfect ? 'Perfect Score!' : 'Great Effort!'}</h2>
        <div class="score-text">${correct} / ${total} correct</div>
        <p class="msg">
          ${perfect
            ? "You've mastered these five essential words. You're ready for Taiwan!"
            : "Keep practicing — you'll have these down in no time!"}
        </p>
        <div class="result-list">
          ${this.quizResults.map(
            r => html`
              <div class="result-item">
                <span class="icon">${r.correct ? '✅' : '❌'}</span>
                <span class="detail">
                  <span class="zh">${r.word.chinese}</span>
                  <span class="en"> — ${r.word.english}</span>
                </span>
              </div>
            `
          )}
        </div>
        <div class="btn-group">
          <button class="btn btn-primary btn-full" @click=${this._startQuiz}>
            Try Quiz Again
          </button>
          <button class="btn btn-secondary btn-full" @click=${this._startLearn}>
            Review Words
          </button>
          <button class="btn btn-secondary btn-full" @click=${this._goHome}>
            Home
          </button>
        </div>
      </div>
    `;
  }

  _goHome() {
    this._clearPendingTimeout();
    this.screen = 'home';
  }

  _startLearn() {
    this._clearPendingTimeout();
    this.currentIndex = 0;
    this.screen = 'learn';
  }

  _nextWord() {
    if (this.currentIndex < words.length - 1) {
      this.currentIndex++;
      this.wordsReviewed++;
      this._saveProgress();
    }
  }

  _startQuiz() {
    this._clearPendingTimeout();
    this.quizWords = shuffle(words);
    this.quizIndex = 0;
    this.quizResults = [];
    this.score = 0;
    this.screen = 'quiz';
  }

  _handleQuizAnswer(e) {
    const { correct, word } = e.detail;
    this.quizResults = [...this.quizResults, { word, correct }];
    if (correct) this.score++;

    if (this.quizIndex < this.quizWords.length - 1) {
      this._pendingTimeout = setTimeout(() => {
        this._pendingTimeout = null;
        this.quizIndex++;
      }, 1200);
    } else {
      this._pendingTimeout = setTimeout(() => {
        this._pendingTimeout = null;
        if (this.score > this.bestScore) {
          this.bestScore = this.score;
        }
        this._saveProgress();
        this.screen = 'results';
      }, 1200);
    }
  }

  _clearPendingTimeout() {
    if (this._pendingTimeout) {
      clearTimeout(this._pendingTimeout);
      this._pendingTimeout = null;
    }
  }

  _saveProgress() {
    saveProgress({
      bestScore: this.bestScore,
      wordsReviewed: this.wordsReviewed,
    });
  }
}

customElements.define('taiwan-trainer-app', TaiwanTrainerApp);
