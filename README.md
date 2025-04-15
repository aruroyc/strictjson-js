# strictjson-js

Generate structured, schema-validated JSON from LLMs like OpenAI or hosted OpenAI-compatible endpoints.

This JavaScript library is inspired by the Python [`strictjson`](https://github.com/tanchongmin/strictjson) library, and provides:
- ✅ JSON output enforcement  
- ✅ Schema validation using `zod`  
- ✅ Retry mechanism with schema feedback  
- ✅ Works with OpenAI models or custom API endpoints  

---

## 📦 Installation

```bash
npm install strictjson-js
```

---

## 🧠 Usage Example

```js
import { strictJson } from 'strictjson-js';

const result = await strictJson({
  fields: {
    name: { type: 'string', description: 'Full name', example: 'Alice' },
    age: { type: 'number', description: 'Age in years', example: 30 },
    email: { type: 'string', description: 'Email address', example: 'alice@example.com', optional: true }
  },
  systemPrompt: "You are a helpful assistant that provides information in JSON format.",
  userPrompt: "Give me details of a fictional person.",
  model: "gpt-4-1106-preview",  // or a hosted OpenAI-compatible URL
  temperature: 0.2
});

console.log("LLM output as structured JSON:", result);
```

---

## 🌐 Environment Variables

If you're using OpenAI's hosted models, set your API key:

```bash
export OPENAI_API_KEY="sk-..."
```

This is optional if you're using a hosted OpenAI-compatible API with a public or embedded key.

---

## 📁 Parameters

| Name           | Type    | Description                                                |
|----------------|---------|------------------------------------------------------------|
| `fields`       | object  | Combined output schema and format definition              |
| `systemPrompt` | string  | System message to prime the LLM                           |
| `userPrompt`   | string  | The user query/message                                    |
| `model`        | string  | OpenAI model name or URL endpoint                         |
| `temperature`  | number  | Sampling temperature (e.g., 0.2)                          |
| `retries`      | number  | Number of retries on malformed JSON (default: `3`)        |

---

## 📜 License

MIT Licensed.
