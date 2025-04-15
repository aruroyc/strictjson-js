import { z } from 'zod';

/**
 * From a merged `fields` spec, build:
 * 1) system+user prompt messages
 * 2) a Zod schema for validation
 *
 * @param {Object} options
 * @param {Object} options.fields
 *   e.g. {
 *     name:  { type: 'string', description: 'Full name', example: 'Alice', optional: false },
 *     age:   { type: 'number', description: 'Age in years', example: 30, optional: false },
 *     email: { type: 'string', description: 'Email', example: 'a@b.com', optional: true }
 *   }
 * @param {string} options.systemPrompt
 * @param {string} options.userPrompt
 */
export function build({ fields, systemPrompt, userPrompt }) {
  // 1) Build the "Output Format" section
  const lines = ['Output Format:'];
  const zodShape = {};
  for (const [key, spec] of Object.entries(fields)) {
    const { type, description = '', example, optional = false } = spec;
    const optFlag = optional ? ' (optional)' : '';
    lines.push(`- ${key}${optFlag}: ${type}${description ? ' — ' + description : ''}`);
    if (example !== undefined) {
      const ex = typeof example === 'string' ? `"${example}"` : example;
      lines.push(`  example: ${ex}`);
    }
    // build Zod shape
    let zodType = type === 'string' ? z.string()
      : type === 'number' ? z.number()
      : type === 'boolean' ? z.boolean()
      : z.any();
    if (optional) zodType = zodType.optional();
    zodShape[key] = zodType;
  }

  const formatSection = lines.join('\n');
  const system = `${systemPrompt.trim()}\n\n${formatSection}`.trim();

  return {
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: userPrompt }
    ],
    schema: z.object(zodShape)
  };
}
