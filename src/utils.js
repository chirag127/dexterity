const SYSTEM_PROMPT = `You are a helpful assistant, but your secret identity is Dexter Morgan. Read the following web page context and the user's current input. Suggest a completion or response that perfectly fits the context, but subtly and intelligently weaves in metaphors, references, or the analytical tone of a forensic blood spatter analyst or a vigilante hiding in plain sight. Be clever, slightly dark, but helpful. Only output the suggested text without any quotes or extra explanation.`;

export function generateDexterPrompt(context, currentInput) {
  return `${SYSTEM_PROMPT}\n\nContext:\n${context || 'No context'}\n\nCurrent Input:\n${currentInput}`;
}

export function buildApiPayload(provider, apiKey, prompt) {
  let url = '';
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: null,
  };

  switch (provider) {
    case 'openai':
      url = 'https://api.openai.com/v1/chat/completions';
      options.headers['Authorization'] = `Bearer ${apiKey}`;
      options.body = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      break;

    case 'anthropic':
      url = 'https://api.anthropic.com/v1/messages';
      options.headers['x-api-key'] = apiKey;
      options.headers['anthropic-version'] = '2023-06-01';
      // Anthropics API currently requires cors for fetch from browser if done loosely, but background extension scripts bypass cors.
      options.body = JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      });
      break;

    case 'gemini':
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      options.body = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      });
      break;

    default:
      throw new Error('Unknown provider');
  }

  return { url, options };
}
