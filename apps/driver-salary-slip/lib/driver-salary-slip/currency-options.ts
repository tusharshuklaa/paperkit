import sourceCurrencies from './currencies.json';

export const currencyOptions = sourceCurrencies.map(({ text, value }, index) => ({
  id: `currency-${index}`,
  label: text,
  symbol: value,
}));

type CurrencyOption = (typeof currencyOptions)[number];
