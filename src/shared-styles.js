import { css } from 'lit';

export const buttonStyles = css`
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.9rem 2rem;
    border: none;
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease,
      border-color 0.25s ease, filter 0.25s ease;
    font-family: inherit;
  }

  .btn:active {
    transform: scale(0.97);
  }

  .btn-primary {
    background: linear-gradient(135deg, #ff6348, #ff7979);
    color: white;
    box-shadow: 0 4px 20px rgba(255, 99, 72, 0.4);
  }

  .btn-primary:hover {
    box-shadow: 0 6px 28px rgba(255, 99, 72, 0.55);
    filter: brightness(1.15);
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #f0f0f0;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .btn-full {
    width: 100%;
  }
`;

export const speakButtonStyles = css`
  .speak-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    font-size: 1.4rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease,
      box-shadow 0.25s ease;
  }

  .speak-btn:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.08);
    box-shadow: 0 0 16px rgba(255, 165, 2, 0.3);
  }

  .speak-btn:active {
    transform: scale(0.92);
  }
`;
