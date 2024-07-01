import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DefaultGenerics, StreamClient } from "getstream";
import { StreamApp } from "react-activity-feed";

import { getFromStorage } from "./utils/storage";
import ScrollToTop from "./components/ScrollToTop";
import StartPage from "./views/StartPage";
import users from "./users";

const APP_KEY = process.env.REACT_APP_KEY;
const APP_ID = process.env.REACT_APP_ID;

function App() {
  const [client, setClient] = useState<StreamClient<DefaultGenerics>>();
  const userId = getFromStorage("user");
  const user = users.find((u) => u.id === userId) || users[0];

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, APP_KEY]);

  async function init() {
    if (!APP_KEY) return;
    const client = new StreamClient(APP_KEY, user.token, APP_ID);

    await client.user(user.id).getOrCreate({ ...user, token: "" });

    setClient(client);
  }

  if (!client || !APP_ID || !APP_KEY) return <></>;

  return (
    <StreamApp token={user.token} appId={APP_ID} apiKey={APP_KEY}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<StartPage />} />
      </Routes>
    </StreamApp>
  );
}

export default App;
