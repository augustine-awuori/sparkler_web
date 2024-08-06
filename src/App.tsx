import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Activity, DefaultGenerics, StreamClient } from "getstream";
import { StreamApp } from "react-activity-feed";
import { Box } from "@chakra-ui/react";

import {
  AuthPages,
  EditProfilePage,
  FollowersPage,
  HomePage,
  NotificationsPage,
  ProfilePage,
  QuoteSparklePage,
  ThreadPage,
} from "./pages";
import { ActivityContext, UserContext } from "./contexts";
import { User } from "./users";
import UsersContext, { Users } from "./contexts/UsersContext";
import auth from "./services/auth";
import LoadingPage from "./pages/LoadingPage";
import ScrollToTop from "./components/ScrollToTop";
import usersService from "./services/users";

const id = "1322281";
const key = "8hn252eegqq9";

function App() {
  const [client, setClient] = useState<StreamClient<DefaultGenerics>>();
  const [user, setUser] = useState<User>();
  const [activity, setActivity] = useState<Activity<DefaultGenerics>>();
  const [users, setUsers] = useState<Users>({});

  useEffect(() => {
    const retrieveAllUsersInfo = async () => {
      let users: Users = {};

      const res = await usersService.getAllUsers();
      if (res.ok) {
        (res.data as User[]).forEach(({ _id, username }) => {
          if (!users[username]) users[username] = _id;
        });
      }

      setUsers(users);
    };

    retrieveAllUsersInfo();
  }, []);

  useEffect(() => {
    const initUser = () => {
      if (!user) {
        const currentUser = auth.getCurrentUser();
        if (currentUser) setUser(currentUser);
      }
    };

    const initClient = async () => {
      try {
        if (user) setClient(new StreamClient(key, user.feedToken, id));
      } catch (error) {
        console.error(error);
      }
    };

    initUser();
    initClient();
  }, [user]);

  useEffect(() => {
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

    if (client && user) {
      updateUserDetailsWhenNecessary();
    }
  }, [client, user]);

  if (!user) return <AuthPages />;

  if (!client) return <LoadingPage />;

  return (
    <StreamApp token={user.feedToken} appId={id} apiKey={key}>
      <ScrollToTop />
      <Box fontFamily="quicksand">
        <UsersContext.Provider value={{ setUsers, users }}>
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
                <Route element={<FollowersPage />} path="/:user_id/followers" />
                <Route element={<ProfilePage />} path="/:user_id" />
                <Route element={<HomePage />} path="/" />
              </Routes>
            </ActivityContext.Provider>
          </UserContext.Provider>
        </UsersContext.Provider>
      </Box>
    </StreamApp>
  );
}

export default App;
