// Convert cents to euro func
export function centsToEuros(cents: number): number {
  const euros = cents / 100;
  return parseFloat(euros.toFixed(2));
}
