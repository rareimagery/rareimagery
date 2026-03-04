interface PriceDisplayProps {
  number: string;
  currencyCode: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
  CAD: 'CA$',
  AUD: 'A$',
};

export function PriceDisplay({ number, currencyCode }: PriceDisplayProps) {
  const symbol = CURRENCY_SYMBOLS[currencyCode] ?? currencyCode + ' ';
  const formatted = parseFloat(number).toFixed(2);

  return (
    <span className="price-display">
      {symbol}
      {formatted}
    </span>
  );
}
