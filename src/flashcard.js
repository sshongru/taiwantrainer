import { LitElement, html, css } from 'lit';
import { speak } from './speech.js';
import { buttonStyles, speakButtonStyles } from './shared-styles.js';

class TrainerFlashcard extends LitElement {
  static properties = {
    word: { type: Object },
    isLast: { type: Boolean },
    flipped: { type: Boolean },
  };

  static styles = [
    buttonStyles,
    speakButtonStyles,
    css`
      :host {
        display: block;
      }

      .card-container {
        perspective: 800px;
        margin: 1rem 0;
      }

      .card {
        position: relative;
        width: 100%;
        border-radius: 20px;
        transition: transform 0.5s ease;
        transform-style: preserve-3d;
        cursor: pointer;
      }

      .card.flipped {
        transform: rotateY(180deg);
      }

      .card-face {
        backface-visibility: hidden;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem 1.5rem;
      }

      .front {
        position: relative;
        background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03));
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        min-height: 320px;
      }

      .back {
        position: absolute;
        inset: 0;
        background: linear-gradient(145deg, rgba(255,165,2,0.15), rgba(255,99,72,0.1));
        border: 1px solid rgba(255, 165, 2, 0.25);
        transform: rotateY(180deg);
      }

      .chinese {
        font-family: 'Noto Sans TC', sans-serif;
        font-size: 4rem;
        font-weight: 900;
        margin-bottom: 0.5rem;
        line-height: 1.2;
      }

      .pinyin {
        font-size: 1.3rem;
        color: #ffa502;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .english {
        font-size: 1.1rem;
        color: #ccc;
        margin-bottom: 1rem;
      }

      .tap-hint {
        font-size: 0.75rem;
        color: #666;
        margin-top: 1rem;
      }

      .speak-btn {
        margin-bottom: 0.75rem;
      }

      .back .chinese {
        font-size: 2.5rem;
      }

      .back .pinyin {
        font-size: 1rem;
      }

      .usage {
        font-size: 0.85rem;
        color: #ccc;
        text-align: center;
        line-height: 1.5;
        margin-bottom: 1rem;
      }

      .example-block {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        text-align: center;
        width: 100%;
      }

      .example-zh {
        font-family: 'Noto Sans TC', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.2rem;
      }

      .example-pinyin {
        font-size: 0.8rem;
        color: #ffa502;
      }

      .example-en {
        font-size: 0.8rem;
        color: #999;
      }

      .actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
        width: 100%;
      }

      .btn {
        flex: 1;
        padding: 0.85rem 1rem;
        font-size: 0.95rem;
      }

      .btn-next {
        background: linear-gradient(135deg, #ff6348, #ff7979);
        color: white;
        box-shadow: 0 4px 16px rgba(255, 99, 72, 0.35);
      }

      .btn-next:hover {
        box-shadow: 0 6px 24px rgba(255, 99, 72, 0.55);
        filter: brightness(1.15);
        transform: translateY(-2px);
      }

      .btn-quiz {
        background: linear-gradient(135deg, #2ed573, #7bed9f);
        color: #1a1a2e;
        box-shadow: 0 4px 16px rgba(46, 213, 115, 0.35);
      }

      .btn-quiz:hover {
        box-shadow: 0 6px 24px rgba(46, 213, 115, 0.55);
        filter: brightness(1.12);
        transform: translateY(-2px);
      }

      .btn-flip {
        background: rgba(255, 255, 255, 0.1);
        color: #f0f0f0;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }

      .btn-flip:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
    `,
  ];

  constructor() {
    super();
    this.flipped = false;
  }

  updated(changed) {
    if (changed.has('word')) {
      this.flipped = false;
    }
  }

  render() {
    const w = this.word;
    if (!w) return html``;

    return html`
      <div class="card-container">
        <div
          class="card ${this.flipped ? 'flipped' : ''}"
          tabindex="0"
          role="button"
          aria-label="${this.flipped ? 'Flip card back to front' : `Flip card to see details for ${w.english}`}"
          @click=${this._flip}
          @keydown=${this._onCardKeydown}
        >
          <div class="card-face front">
            <button
              class="speak-btn"
              @click=${this._speak}
              aria-label="Listen to pronunciation of ${w.chinese}"
            >🔊</button>
            <div class="chinese">${w.chinese}</div>
            <div class="pinyin">${w.pinyin}</div>
            <div class="english">${w.english}</div>
            <div class="tap-hint">Tap card to see more</div>
          </div>
          <div class="card-face back">
            <div class="chinese">${w.chinese}</div>
            <div class="pinyin">${w.pinyin} — ${w.english}</div>
            <div class="usage">${w.usage}</div>
            <div class="example-block">
              <div class="example-zh">${w.example}</div>
              <div class="example-pinyin">${w.examplePinyin}</div>
              <div class="example-en">${w.exampleEnglish}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        ${this.flipped
          ? html`<button class="btn btn-flip" @click=${this._flip}>Flip Back</button>`
          : html``}
        ${this.isLast
          ? html`<button class="btn btn-quiz" @click=${this._startQuiz}>Start Quiz →</button>`
          : html`<button class="btn btn-next" @click=${this._next}>Next Word →</button>`}
      </div>
    `;
  }

  _onCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._flip(e);
    }
  }

  _flip(e) {
    e.stopPropagation();
    this.flipped = !this.flipped;
  }

  _speak(e) {
    e.stopPropagation();
    speak(this.word.chinese);
  }

  _next() {
    this.dispatchEvent(new CustomEvent('next-word'));
  }

  _startQuiz() {
    this.dispatchEvent(new CustomEvent('start-quiz'));
  }
}

customElements.define('trainer-flashcard', TrainerFlashcard);
