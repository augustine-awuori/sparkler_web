export function generateTweetLink(actorId: string, tweetActivityId: string) {
  return `/${actorId}/status/${tweetActivityId}`;
}
