# Dexter AI Chrome Extension

A lightweight, purely client-side Chrome Extension that imbues your text inputs with the calculated, forensic persona of Dexter Morgan. Suggests context-aware completions while leaving no server-side footprint.

## Architecture & Features

- **100% Client-Side**: No backend server. Pure HTML, CSS, and Vanilla JavaScript.
- **Bring Your Own Key (BYOK)**: Connect your own Gemini, OpenAI, or Anthropic API keys.
- **Secure Storage**: Credentials are saved securely via `chrome.storage.local`.
- **Dexter Persona**: Suggests clever, slightly dark, and helpful completions based on web page context and current input.

## How to Install (Developer Mode)

1. Clone or download this repository.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Toggle **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the directory containing this repository.
5. Setup your API Key in the extension's options page.

## Development

This project uses **TDD (Test-Driven Development)** with Jest environment and Vanilla JavaScript.

```bash
# Install Dev Dependencies
npm install

# Run Tests
npm run test

# Run Format and Lint
npm run format
npm run lint --fix
```

Enjoy the meticulous precision.
