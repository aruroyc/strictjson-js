import { chat } from './chat.js';
import { build } from './promptBuilder.js';
import { validateJson } from './validator.js';

/**
 * strictJson: core function
 *
 * @param {Object} options
 *  - fields: merged format+schema spec (see promptBuilder)
 *  - systemPrompt: initial system instructions
 *  - userPrompt: user’s question
 *  - model: model name or URL
 *  - retries: number of retries on error
 *  - temperature: sampling temperature
 */
export async function strictJson({
  fields,
  systemPrompt = '',
  userPrompt,
  model = 'gpt-4-1106-preview',
  retries = 3,
  temperature = 0.2
}) {
  // Build prompts + Zod schema
  const { messages: baseMessages, schema } = build({ fields, systemPrompt, userPrompt });

  const messages = [...baseMessages];
  let lastError = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await chat({
        model,
        messages,
        response_format: 'json',
        temperature
      });
      const content = res.choices?.[0]?.message?.content ?? res.choices?.[0]?.message;
      return validateJson(content, schema);

    } catch (err) {
      lastError = err.message;
      if (i === retries) break;
      messages.push({
        role: 'assistant',
        content: `Error: ${lastError}. Please correct your output to match the format.`
      });
    }
  }

  throw new Error(`strictJson failed after ${retries + 1} attempts: ${lastError}`);
}
