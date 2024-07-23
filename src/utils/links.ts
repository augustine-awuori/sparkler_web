export function generateSparkleLink(
  actorId: string,
  sparkleActivityId: string
) {
  return `/${actorId}/status/${sparkleActivityId}`;
}
