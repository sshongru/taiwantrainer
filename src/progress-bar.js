import { LitElement, html, css } from 'lit';

class TrainerProgress extends LitElement {
  static properties = {
    current: { type: Number },
    total: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      margin-bottom: 0.75rem;
    }

    .track {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      overflow: hidden;
    }

    .fill {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, #ff6348, #ffa502);
      transition: width 0.4s ease;
    }
  `;

  render() {
    const pct = this.total > 0 ? ((this.current) / this.total) * 100 : 0;
    return html`
      <div class="track">
        <div class="fill" style="width: ${pct}%"></div>
      </div>
    `;
  }
}

customElements.define('trainer-progress', TrainerProgress);
