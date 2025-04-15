import OpenAI from 'openai';
import fetch from 'node-fetch';

const sdk = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Universal chat interface (OpenAI SDK or hosted URL)
 */
export async function chat({
  model,
  messages,
  response_format = 'json',
  temperature = 0.2
}) {
  const isUrl = model.startsWith('http://') || model.startsWith('https://');
  const payload = { model, messages, temperature, response_format };

  if (isUrl) {
    const res = await fetch(model, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.OPENAI_API_KEY && { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` })
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Hosted API error: ${await res.text()}`);
    return await res.json();
  } else {
    return await sdk.chat.completions.create(payload);
  }
}
