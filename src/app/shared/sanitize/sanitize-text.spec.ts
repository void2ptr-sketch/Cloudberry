import { sanitizeCloudConnectionInput } from '../../core/sanitize';
import {
  containsUnsafeMarkup,
  sanitizeEmail,
  sanitizeExternalAccountId,
  sanitizeText,
} from './sanitize-text';

describe('sanitizeText', () => {
  it('strips HTML tags and control characters', () => {
    expect(sanitizeText('  <b>AWS</b> Prod  ', { maxLength: 80 })).toBe('AWS Prod');
  });

  it('detects unsafe markup', () => {
    expect(containsUnsafeMarkup('<script>alert(1)</script>')).toBeTrue();
    expect(containsUnsafeMarkup('AWS Production')).toBeFalse();
  });

  it('sanitizes email', () => {
    expect(sanitizeEmail('  Alex@Example.COM  ')).toBe('alex@example.com');
  });

  it('sanitizes external account id', () => {
    expect(sanitizeExternalAccountId(' 123-abc<script> ')).toBe('123-abc');
  });
});

describe('sanitizeCloudConnectionInput', () => {
  it('normalizes connection fields', () => {
    expect(
      sanitizeCloudConnectionInput({
        name: '  <i>GCP</i> Dev ',
        provider: 'gcp',
        externalAccountId: 'project-123',
      }),
    ).toEqual({
      name: 'GCP Dev',
      provider: 'gcp',
      externalAccountId: 'project-123',
    });
  });
});
