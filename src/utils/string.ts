export function formatStringWithLink(
  text: string,
  linkClass?: string,
  noLink = false
) {
  // regex to match links, hashtags and mentions
  const regex = /((https?:\/\/\S*)|(#\S*))|(@\S*)/gi;

  const modifiedText = text.replace(regex, (match) => {
    let url, label;

    if (match.startsWith("#")) {
      // it is a hashtag
      url = `/explore/${match.replace("#", "")}`;
      label = match;
    } else if (match.startsWith("@")) {
      // it is a mention
      url = `/${match.replace("@", "")}`;
      label = match;
    } else {
      // it is a link
      url = match;
      label = url.replace("https://", "");
    }

    const tag = noLink ? "span" : "a";

    return `<${tag} class="${
      noLink ? "" : linkClass
    }" href="${url}">${label}</${tag}>`;
  });

  return modifiedText;
}

export function parseHashtags(text: string) {
  const hashtagPattern = /#(\w+)/g;
  let match;
  const hashtags = [];

  while ((match = hashtagPattern.exec(text)) !== null) {
    hashtags.push(match[1]);
  }

  return hashtags;
}
