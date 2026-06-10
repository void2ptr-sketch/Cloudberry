import { formatIsoDate, parseIsoDate } from './iso-date';

describe('iso-date', () => {
  it('parses and formats ISO dates in local calendar', () => {
    const date = parseIsoDate('2026-06-15');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(15);
    expect(formatIsoDate(date)).toBe('2026-06-15');
  });
});
