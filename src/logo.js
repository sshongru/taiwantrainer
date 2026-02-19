import { LitElement, html, css } from 'lit';

let logoInstanceCount = 0;

class TrainerLogo extends LitElement {
  static properties = {
    size: { type: Number },
  };

  static styles = css`
    :host {
      display: inline-block;
      line-height: 0;
    }

    svg {
      filter: drop-shadow(0 4px 12px rgba(255, 99, 72, 0.35));
    }
  `;

  constructor() {
    super();
    this.size = 72;
    this._uid = `logo-${logoInstanceCount++}`;
  }

  render() {
    const s = this.size;
    const u = this._uid;
    return html`
      <svg
        width="${s}"
        height="${s}"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Taiwan Trainer logo"
      >
        <defs>
          <linearGradient id="${u}-bubble" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ff6348" />
            <stop offset="100%" stop-color="#ffa502" />
          </linearGradient>
          <linearGradient id="${u}-tower" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#ffe0cc" />
          </linearGradient>
          <linearGradient id="${u}-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#ffd4b8" stop-opacity="0.85" />
          </linearGradient>
          <radialGradient id="${u}-glow" cx="0.4" cy="0.35" r="0.6">
            <stop offset="0%" stop-color="#ffb347" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#ff6348" stop-opacity="0" />
          </radialGradient>
        </defs>

        <rect x="8" y="8" width="104" height="84" rx="22" fill="url(#${u}-bubble)" />
        <rect x="8" y="8" width="104" height="84" rx="22" fill="url(#${u}-glow)" />
        <path d="M30 88 L42 108 L56 88" fill="url(#${u}-bubble)" />

        <g transform="translate(60, 50)">
          <rect x="-1" y="-35" width="2" height="12" rx="1" fill="url(#${u}-tower)" opacity="0.9" />
          <circle cx="0" cy="-36" r="2" fill="#ffffff" opacity="0.9" />
          <path d="M -5,-23 L 5,-23 L 4,-20 L -4,-20 Z" fill="url(#${u}-shade)" />
          <path d="M -5,-20 L 5,-20 L 7,-16 L -7,-16 Z" fill="url(#${u}-shade)" />
          <path d="M -7,-15 L 7,-15 L 9,-11 L -9,-11 Z" fill="url(#${u}-tower)" />
          <path d="M -9,-10 L 9,-10 L 11,-6 L -11,-6 Z" fill="url(#${u}-shade)" />
          <path d="M -11,-5 L 11,-5 L 13,-1 L -13,-1 Z" fill="url(#${u}-tower)" />
          <path d="M -13,0 L 13,0 L 15,4 L -15,4 Z" fill="url(#${u}-shade)" />
          <path d="M -15,5 L 15,5 L 17,9 L -17,9 Z" fill="url(#${u}-tower)" />
          <path d="M -17,10 L 17,10 L 19,14 L -19,14 Z" fill="url(#${u}-shade)" />
          <path d="M -19,15 L 19,15 L 21,19 L -21,19 Z" fill="url(#${u}-tower)" />
          <rect x="-16" y="20" width="32" height="6" rx="1.5" fill="url(#${u}-shade)" opacity="0.8" />
          <rect x="-12" y="26" width="24" height="4" rx="1" fill="url(#${u}-tower)" opacity="0.6" />
          <line x1="-20" y1="-16" x2="20" y2="-16" stroke="#ff6348" stroke-width="0.4" opacity="0.3" />
          <line x1="-20" y1="-11" x2="20" y2="-11" stroke="#ff6348" stroke-width="0.4" opacity="0.3" />
          <line x1="-20" y1="-6" x2="20" y2="-6" stroke="#ff6348" stroke-width="0.4" opacity="0.3" />
          <line x1="-20" y1="-1" x2="20" y2="-1" stroke="#ff6348" stroke-width="0.4" opacity="0.3" />
          <line x1="-20" y1="4" x2="20" y2="4" stroke="#ff6348" stroke-width="0.4" opacity="0.3" />
          <line x1="-20" y1="9" x2="20" y2="9" stroke="#ff6348" stroke-width="0.4" opacity="0.3" />
          <line x1="-20" y1="14" x2="20" y2="14" stroke="#ff6348" stroke-width="0.4" opacity="0.3" />
        </g>
      </svg>
    `;
  }
}

customElements.define('trainer-logo', TrainerLogo);
