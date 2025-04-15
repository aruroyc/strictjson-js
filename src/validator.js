import { z } from 'zod';

/**
 * Parse JSON and validate with provided Zod schema
 */
export function validateJson(jsonStr, schema) {
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
  try {
    return schema.parse(parsed);
  } catch (e) {
    const msg = e.errors?.[0]?.message || e.message;
    throw new Error(`Schema validation failed: ${msg}`);
  }
}
