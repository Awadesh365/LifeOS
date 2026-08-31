// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { sanitizeMarkdown } from './ArticleReader';

describe('article markdown sanitization', () => {
  it('removes executable markup and unsafe link protocols', () => {
    const result = sanitizeMarkdown('<img src=x onerror="alert(1)"> [bad](javascript:alert(1)) <script>alert(1)</script>');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('<script');
  });
});
