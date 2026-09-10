import { formatCurrencyAmount } from './formatCurrencyAmount';

describe('formatCurrencyAmount', () => {
  it('formatea cero con dos decimales y coma como separador', () => {
    expect(formatCurrencyAmount(0)).toBe('$0,00');
  });

  it('formatea montos con decimales', () => {
    expect(formatCurrencyAmount(1502.5)).toBe('$1.502,50');
  });

  it('agrega separador de miles', () => {
    expect(formatCurrencyAmount(13502.59)).toBe('$13.502,59');
    expect(formatCurrencyAmount(56079980.42)).toBe('$56.079.980,42');
  });
});
