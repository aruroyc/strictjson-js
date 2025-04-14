import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Handles OpenAI or compatible hosted API
 */
export async function callOpenAI({
  model,
  messages,
  functions,
  function_call,
  response_format,
  temperature,
  hostedUrl = null
}) {
  const payload = {
    model,
    messages,
    temperature,
    ...(functions && { functions }),
    ...(function_call && { function_call }),
    ...(response_format && { response_format })
  };

  if (hostedUrl) {
    const res = await fetch(hostedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.OPENAI_API_KEY && {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        }),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Hosted API error: ${await res.text()}`);
    }

    return await res.json();
  } else {
    return await openai.chat.completions.create(payload);
  }
}