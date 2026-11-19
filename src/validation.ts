import type { FormField } from './types';

export type FormValues = Record<string, string | number | boolean>;
export type ValidationErrors = Record<string, string>;

export function validateSchema(schema: FormField[]): string[] {
  const errors: string[] = [];
  const names = new Set<string>();
  for (const field of schema) {
    if (!field.name.trim()) errors.push('Every field needs a name.');
    if (names.has(field.name)) errors.push(`Duplicate field name: ${field.name}`);
    names.add(field.name);
    if (field.type === 'select' && (!field.options || field.options.length === 0)) errors.push(`${field.label} needs at least one option.`);
    if (field.min !== undefined && field.max !== undefined && field.min > field.max) errors.push(`${field.label} has an invalid range.`);
  }
  return errors;
}

export function validateValues(schema: FormField[], values: FormValues): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const field of schema) {
    const value = values[field.name];
    const empty = value === undefined || value === '' || value === false;
    if (field.required && empty) { errors[field.name] = `${field.label} is required.`; continue; }
    if (empty) continue;
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) errors[field.name] = 'Enter a valid email address.';
    if (field.type === 'number') {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) errors[field.name] = 'Enter a valid number.';
      else if (field.min !== undefined && numericValue < field.min) errors[field.name] = `Minimum value is ${field.min}.`;
      else if (field.max !== undefined && numericValue > field.max) errors[field.name] = `Maximum value is ${field.max}.`;
    }
    if (field.pattern && !new RegExp(field.pattern).test(String(value))) errors[field.name] = field.patternMessage || 'Value format is invalid.';
  }
  return errors;
}
