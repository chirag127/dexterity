import { generateDexterPrompt, buildApiPayload } from './src/utils.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_SUGGESTION') {
    handleSuggestionRequest(request.context, request.inputValue)
      .then((suggestion) => sendResponse({ suggestion }))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Keep message channel open for async response
  }
});

async function handleSuggestionRequest(context, inputValue) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['provider', 'apiKey'], async (settings) => {
      if (!settings.provider || !settings.apiKey) {
        return reject(new Error('Provider or API Key not set. Please configure Dexter Extension.'));
      }

      try {
        const prompt = generateDexterPrompt(context, inputValue);
        const { url, options } = buildApiPayload(settings.provider, settings.apiKey, prompt);

        const response = await fetch(url, options);
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        let suggestion = '';

        if (settings.provider === 'openai') {
          suggestion = data.choices[0].message.content;
        } else if (settings.provider === 'anthropic') {
          suggestion = data.content[0].text;
        } else if (settings.provider === 'gemini') {
          suggestion = data.candidates[0].content.parts[0].text;
        }

        resolve(suggestion);
      } catch (err) {
        reject(err);
      }
    });
  });
}
