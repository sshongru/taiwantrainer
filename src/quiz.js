import { LitElement, html, css } from 'lit';
import { speak } from './speech.js';
import { getQuizOptions } from './words.js';
import { speakButtonStyles } from './shared-styles.js';

class TrainerQuiz extends LitElement {
  static properties = {
    word: { type: Object },
    allWords: { type: Array },
    options: { type: Array },
    selected: { type: Number },
    answered: { type: Boolean },
  };

  static styles = [
    speakButtonStyles,
    css`
      :host {
        display: block;
      }

      .quiz-card {
        background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem 1.5rem;
        text-align: center;
        margin: 1rem 0;
      }

      .prompt {
        font-size: 0.9rem;
        color: #aaa;
        margin-bottom: 0.5rem;
      }

      .chinese {
        font-family: 'Noto Sans TC', sans-serif;
        font-size: 3.5rem;
        font-weight: 900;
        margin-bottom: 0.3rem;
      }

      .pinyin {
        font-size: 1.1rem;
        color: #ffa502;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }

      .speak-btn {
        margin-bottom: 1.5rem;
      }

      .options {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .option-btn {
        width: 100%;
        padding: 1rem;
        border-radius: 14px;
        border: 2px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.05);
        color: #f0f0f0;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease,
          transform 0.25s ease, box-shadow 0.25s ease;
        font-family: inherit;
      }

      .option-btn:hover:not([aria-disabled="true"]) {
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 165, 2, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 14px rgba(255, 165, 2, 0.15);
      }

      .option-btn.correct {
        background: rgba(46, 213, 115, 0.2);
        border-color: #2ed573;
        color: #2ed573;
      }

      .option-btn.incorrect {
        background: rgba(255, 71, 87, 0.2);
        border-color: #ff4757;
        color: #ff4757;
      }

      .option-btn[aria-disabled="true"] {
        cursor: default;
      }

      .option-btn.reveal {
        border-color: rgba(46, 213, 115, 0.5);
      }

      .feedback {
        margin-top: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        min-height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .feedback.correct {
        color: #2ed573;
      }

      .feedback.incorrect {
        color: #ff4757;
      }
    `,
  ];

  constructor() {
    super();
    this.options = [];
    this.selected = -1;
    this.answered = false;
  }

  willUpdate(changed) {
    if (changed.has('word') && this.word && this.allWords) {
      this.options = getQuizOptions(this.word, this.allWords);
      this.selected = -1;
      this.answered = false;
    }
  }

  render() {
    const w = this.word;
    if (!w) return html``;

    const isCorrect = this.answered && this.selected === w.id;

    return html`
      <div class="quiz-card">
        <div class="prompt">What does this mean?</div>
        <div class="chinese">${w.chinese}</div>
        <div class="pinyin">${w.pinyin}</div>
        <button
          class="speak-btn"
          @click=${this._speak}
          aria-label="Listen to pronunciation of ${w.chinese}"
        >🔊</button>
        <div class="options" role="group" aria-label="Answer choices">
          ${this.options.map(
            opt => html`
              <button
                class="option-btn
                  ${this.answered && opt.id === w.id ? 'correct' : ''}
                  ${this.answered && opt.id === this.selected && opt.id !== w.id ? 'incorrect' : ''}
                  ${this.answered && opt.id === w.id && this.selected !== w.id ? 'reveal' : ''}
                "
                @click=${() => this._answer(opt)}
                aria-disabled="${this.answered}"
              >
                ${opt.english}
              </button>
            `
          )}
        </div>
        <div
          class="feedback ${this.answered ? (isCorrect ? 'correct' : 'incorrect') : ''}"
          aria-live="polite"
          role="status"
        >
          ${this.answered
            ? isCorrect
              ? html`✓ Correct!`
              : html`✗ It means "${w.english}"`
            : ''}
        </div>
      </div>
    `;
  }

  _speak() {
    speak(this.word.chinese);
  }

  _answer(opt) {
    if (this.answered) return;
    this.selected = opt.id;
    this.answered = true;

    this.dispatchEvent(
      new CustomEvent('quiz-answer', {
        detail: {
          word: this.word,
          correct: opt.id === this.word.id,
          selected: opt,
        },
      })
    );
  }
}

customElements.define('trainer-quiz', TrainerQuiz);
