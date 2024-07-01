export type User = {
  id: string;
  name: string;
  bio: string;
  token: string;
  image: string;
};

const users: User[] = [
  {
    id: "augustine",
    name: "Awuori",
    image:
      "https://yt3.ggpht.com/LtGpoUi8BXlZWKbFKjR6m5wJPgFxjVo1AAPgwRF_HWJYGsC3OMrEm61gHJxqw5bSpGPgKsM0BQ=s88-c-k-c0x00ffffff-no-rj",
    bio: "Just here, doing my thing. Developer advocate at @getstream_io",
    token: "ENTER TOKEN FOR iamdillion",
  },
  {
    id: "getstream_io",
    name: "Stream",
    image: "https://avatars.githubusercontent.com/u/8597527?s=200&v=4",
    bio: "Deploy activity feeds and chat at scale with Stream – an API driven platform powering over a billion end users. Get started at http://getstream.io.",
    token: "ENTER TOKEN FOR getstream_io",
  },
  {
    id: "jake",
    name: "Jake",
    image: "https://picsum.photos/300/300",
    bio: "Just Jake, nothing much",
    token: "ENTER TOKEN FOR jake",
  },
  {
    id: "joe",
    name: "Joe",
    image: "https://picsum.photos/200/200",
    bio: "How are you?",
    token: "ENTER TOKEN FOR joe",
  },
  {
    id: "mike",
    name: "Mike",
    image: "https://picsum.photos/400/400",
    bio: "I am mike here. I do things on #react and #javascript",
    token: "ENTER TOKEN FOR mike",
  },
];

export default users;
