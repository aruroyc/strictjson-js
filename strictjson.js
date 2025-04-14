import { callOpenAI } from './openaiClient.js';

/**
 * Universal chat interface (OpenAI or OpenAI-compatible endpoint)
 */
export async function chat({
  model,
  messages,
  functions,
  function_call,
  response_format = 'json',
  temperature = 0.2
}) {
  const isHostedURL = model.startsWith('http://') || model.startsWith('https://');

  const response = await callOpenAI({
    model,
    messages,
    functions,
    function_call,
    response_format,
    temperature,
    hostedUrl: isHostedURL ? model : null,
  });

  const message = response.choices[0].message;
  return {
    content: message.content,
    function_call: message.function_call,
    message,
  };
}

export async function strictJson({
  schema,
  userPrompt,
  model = 'gpt-4-1106-preview',
  retries = 3,
  useFunctionCall = false,
  temperature = 0.2
}) {
  const messages = [
    { role: 'system', content: 'Respond ONLY with valid JSON matching the schema.' },
    { role: 'user', content: userPrompt }
  ];

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await chat({
        model,
        messages,
        response_format: 'json',
        temperature
      });

      const content = response.content;
      const parsed = JSON.parse(content);
      const validated = schema.parse(parsed);
      return validated;

    } catch (err) {
      if (attempt === retries) {
        throw new Error(`All attempts failed. Last error: ${err.message}`);
      }
      messages.push({
        role: 'assistant',
        content: `Invalid JSON or schema mismatch: ${err.message}. Please correct.`
      });
    }
  }
}