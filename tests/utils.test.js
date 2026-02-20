import { generateDexterPrompt, buildApiPayload } from '../src/utils.js';

describe('Dexter Prompt Generator', () => {
  it('should generate a prompt containing Dexter persona instructions', () => {
    const context = 'This is a paragraph about forensic science.';
    const currentInput = 'I think';
    const prompt = generateDexterPrompt(context, currentInput);

    expect(prompt).toContain('secret identity is Dexter Morgan');
    expect(prompt).toContain(context);
    expect(prompt).toContain(currentInput);
  });
});

describe('API Payload Builder', () => {
  it('should build a payload for OpenAI', () => {
    const payload = buildApiPayload('openai', 'test-key', 'Hello');
    expect(payload.url).toBe('https://api.openai.com/v1/chat/completions');
    expect(payload.options.headers['Authorization']).toBe('Bearer test-key');
    const body = JSON.parse(payload.options.body);
    expect(body.model).toBe('gpt-4o-mini');
    expect(body.messages[0].content).toBe('Hello');
  });

  it('should build a payload for Anthropic', () => {
    const payload = buildApiPayload('anthropic', 'test-key', 'Hello');
    expect(payload.url).toBe('https://api.anthropic.com/v1/messages');
    expect(payload.options.headers['x-api-key']).toBe('test-key');
    const body = JSON.parse(payload.options.body);
    expect(body.model).toBe('claude-3-haiku-20240307');
    expect(body.messages[0].content).toBe('Hello');
  });

  it('should build a payload for Gemini', () => {
    const payload = buildApiPayload('gemini', 'test-key', 'Hello');
    expect(payload.url).toContain(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=test-key',
    );
    expect(payload.options.headers['Content-Type']).toBe('application/json');
    const body = JSON.parse(payload.options.body);
    expect(body.contents[0].parts[0].text).toBe('Hello');
  });
});
