export function getEATZone() {
  const time = new Date();

  return new Date(time.getTime() + 3 * 60 * 60 * 1000).toISOString();
}
