import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Activity, DefaultGenerics, StreamClient } from "getstream";
import { StreamApp } from "react-activity-feed";
import { Box } from "@chakra-ui/react";

import {
  AuthPages,
  EditProfilePage,
  HomePage,
  NotificationsPage,
  ProfilePage,
  QuoteSparklePage,
  ThreadPage,
} from "./pages";
import { ActivityContext, UserContext } from "./contexts";
import { User } from "./users";
import auth from "./services/auth";
import ScrollToTop from "./components/ScrollToTop";
import LoadingPage from "./pages/LoadingPage";

const id = "1322281";
const key = "8hn252eegqq9";

function App() {
  const [client, setClient] = useState<StreamClient<DefaultGenerics>>();
  const [user, setUser] = useState<User>();
  const [activity, setActivity] = useState<Activity<DefaultGenerics>>();

  useEffect(() => {
    initUser();
    initClient();
    updateUserDetailsWhenNecessary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const updateUserDetailsWhenNecessary = () => {
    if (client?.currentUser?.data?.name === "Unknown" && user) {
      client.currentUser.update({
        id: client.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        profileImage: user.avatar,
      });
    }
  };

  const initUser = () => {
    if (!auth.getJwt()) {
      auth.loginWithJwt(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjgzYmNkODRhMGJhZmNkOThiNDhkNzAiLCJlbWFpbCI6ImNvZGV3aXRoYXVndXN0aW5lQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYXVndXN0aW5lIiwiZmVlZFRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5WDJsa0lqb2lOalk0TTJKalpEZzBZVEJpWVdaalpEazRZalE0WkRjd0luMC54NElVVnFSSllRa3NfeENGalVGTXNpTldobVkyREdXU0Nsbndod2NCUjBnIiwibmFtZSI6IkF1Z3VzdGluZSIsImlhdCI6MTcyMjM2OTczNH0.iXnryoCuFGJYiYipPkja0_F6sbJtgYVm5C6I3qLzc6M"
      );
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href;
    }

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

  if (!client) return <LoadingPage />;

  return (
    <StreamApp token={user.feedToken} appId={id} apiKey={key}>
      <ScrollToTop />
      <Box fontFamily="quicksand">
        <UserContext.Provider value={{ setUser, user }}>
          <ActivityContext.Provider value={{ activity, setActivity }}>
            <Routes>
              <Route element={<NotificationsPage />} path="/notifications" />
              <Route
                element={<QuoteSparklePage />}
                path="/:user_id/status/:id/quote"
              />
              <Route element={<ThreadPage />} path="/:user_id/status/:id" />
              <Route element={<EditProfilePage />} path="/:user_id/edit" />
              <Route element={<ProfilePage />} path="/:user_id" />
              <Route element={<HomePage />} path="/" />
            </Routes>
          </ActivityContext.Provider>
        </UserContext.Provider>
      </Box>
    </StreamApp>
  );
}

export default App;
