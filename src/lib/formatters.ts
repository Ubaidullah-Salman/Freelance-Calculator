/** Shared number and currency formatting utilities. */

/** Formats a number as USD currency. e.g. 1234.5 → "$1,234.50" */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Formats a number as PKR. e.g. 150000 → "PKR 150,000" */
export function formatPKR(value: number): string {
  return (
    "PKR " +
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value))
  );
}

/** Formats an amount with the corresponding symbol or currency code. */
export function formatTargetCurrency(value: number, currencyCode: string = "PKR"): string {
  const rounded = Math.round(value);
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);

  switch (currencyCode) {
    case "PKR":
      return `PKR ${formattedNumber}`;
    case "INR":
      return `₹${formattedNumber}`;
    case "PHP":
      return `₱${formattedNumber}`;
    case "EUR":
      return `€${formattedNumber}`;
    case "GBP":
      return `£${formattedNumber}`;
    case "CAD":
      return `CA$ ${formattedNumber}`;
    case "AUD":
      return `A$ ${formattedNumber}`;
    case "BDT":
      return `৳${formattedNumber}`;
    case "NGN":
      return `₦${formattedNumber}`;
    default:
      return `${currencyCode} ${formattedNumber}`;
  }
}

/** Formats a decimal fraction as percentage. e.g. 0.2 → "20.0%" */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Formats a plain number with thousand separators. */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
