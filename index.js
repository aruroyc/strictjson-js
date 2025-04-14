import { z } from 'zod';
import { strictJson } from './strictjson.js';
import 'dotenv/config';

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email()
});

(async () => {
  const result = await strictJson({
    schema: userSchema,
    userPrompt: 'Generate a fake user profile with name, age, and email.'
  });

  console.log(result);
})();