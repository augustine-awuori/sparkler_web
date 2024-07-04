import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DefaultGenerics, StreamClient } from "getstream";
import { StreamApp } from "react-activity-feed";
import { Heading } from "@chakra-ui/react";

import { AuthPages, HomePage, ProfilePage, ThreadPage } from "./pages";
import { User } from "./users";
import { UserContext } from "./components/contexts";
import auth from "./services/auth";
import ScrollToTop from "./components/ScrollToTop";

const id = "1322281";
const key = "8hn252eegqq9";

function App() {
  const [client, setClient] = useState<StreamClient<DefaultGenerics>>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    initUser();
    initClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const initUser = () => {
    if (!user) {
      const currentUser = auth.getCurrentUser();
      if (currentUser) setUser(currentUser);
    }
  };

  async function initClient() {
    try {
      if (!user) return;
      const client = new StreamClient(key, user.feedToken, id);
      setClient(client);
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return <AuthPages />;

  if (!client) return <Heading>Client Error</Heading>;

  return (
    <StreamApp token={user.feedToken} appId={id} apiKey={key}>
      <ScrollToTop />
      <UserContext.Provider value={{ setUser, user }}>
        <Routes>
          <Route element={<ThreadPage />} path="/:user_id/status/:id" />
          <Route element={<ProfilePage />} path="/:user_id" />
          <Route element={<HomePage />} path="/" />
        </Routes>
      </UserContext.Provider>
    </StreamApp>
  );
}

export default App;
