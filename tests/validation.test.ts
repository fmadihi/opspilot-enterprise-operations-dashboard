import { describe, expect, it } from 'vitest';
import { validateSchema, validateValues } from '../src/validation';
import type { FormField } from '../src/types';

const schema: FormField[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'hours', label: 'Hours', type: 'number', min: 1, max: 12 },
  { name: 'department', label: 'Department', type: 'select', options: ['Production'] }
];

describe('validateSchema', () => {
  it('accepts a valid schema', () => expect(validateSchema(schema)).toEqual([]));
  it('rejects duplicate field names', () => expect(validateSchema([...schema, schema[0]]).join(' ')).toContain('Duplicate field name'));
  it('requires options for select fields', () => expect(validateSchema([{ name: 'team', label: 'Team', type: 'select' }]).length).toBe(1));
  it('rejects an inverted numeric range', () => expect(validateSchema([{ name: 'count', label: 'Count', type: 'number', min: 10, max: 2 }]).length).toBe(1));
});

describe('validateValues', () => {
  it('reports missing required fields', () => expect(validateValues(schema, {}).title).toBe('Title is required.'));
  it('validates email format', () => expect(validateValues(schema, { title: 'Repair', email: 'not-an-email' }).email).toBe('Enter a valid email address.'));
  it('validates numeric boundaries', () => expect(validateValues(schema, { title: 'Repair', hours: 14 }).hours).toBe('Maximum value is 12.'));
  it('accepts valid values', () => expect(validateValues(schema, { title: 'Repair', email: 'ops@example.com', hours: 4, department: 'Production' })).toEqual({}));
});
