export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 250
) {
  let t: number | undefined;
  return (...args: A): void => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
}
