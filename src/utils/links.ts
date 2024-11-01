export function generateSparkleLink(
  actorUsername: string,
  sparkleActivityId: string
) {
  return `/${actorUsername}/status/${sparkleActivityId}`;
}
