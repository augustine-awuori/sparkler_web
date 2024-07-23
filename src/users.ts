export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  feedToken: string;
  avatar: string;
};

const users: User[] = [
  {
    _id: "6683b34a54616765ff4f8832",
    name: "Awuori",
    username: "awuori",
    avatar:
      "https://yt3.ggpht.com/LtGpoUi8BXlZWKbFKjR6m5wJPgFxjVo1AAPgwRF_HWJYGsC3OMrEm61gHJxqw5bSpGPgKsM0BQ=s88-c-k-c0x00ffffff-no-rj",
    email: "Just here, doing my thing. Developer advocate at @getstream_io",
    feedToken: "ENTER TOKEN FOR iamdillion",
  },
  {
    _id: "getstream_io",
    name: "Stream",
    username: "stream",
    avatar: "https://avatars.githubusercontent.com/u/8597527?s=200&v=4",
    email:
      "Deploy activity feeds and chat at scale with Stream – an API driven platform powering over a billion end users. Get started at http://getstream.io.",
    feedToken: "ENTER TOKEN FOR getstream_io",
  },
  {
    _id: "augustine",
    name: "August",
    username: "august",
    avatar: "https://picsum.photos/300/300",
    email: "Just Jake, nothing much",
    feedToken: "ENTER TOKEN FOR jake",
  },
  {
    _id: "joe",
    name: "Joe",
    username: "joe",
    avatar: "https://picsum.photos/200/200",
    email: "How are you?",
    feedToken: "ENTER TOKEN FOR joe",
  },
  {
    _id: "mike",
    name: "Mike",
    username: "Mike",
    avatar: "https://picsum.photos/400/400",
    email: "I am mike here. I do things on #react and #javascript",
    feedToken: "ENTER TOKEN FOR mike",
  },
];

export default users;
