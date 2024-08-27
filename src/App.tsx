import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Activity, DefaultGenerics, StreamClient } from "getstream";
import { StreamApp } from "react-activity-feed";
import { Box } from "@chakra-ui/react";
import { Chat } from "stream-chat-react";
import {
  DefaultGenerics as ChatDefaultGenerics,
  StreamChat,
} from "stream-chat";

import {
  AuthPages,
  EditProfilePage,
  ExplorePage,
  FollowersPage,
  FollowingsPage,
  HomePage,
  MessagesPage,
  NotificationsPage,
  ProfilePage,
  QuotesPage,
  QuoteSparklePage,
  ThreadPage,
} from "./pages";
import { ActivityContext, QuotesContext, UserContext } from "./contexts";
import { Quote } from "./utils/types";
import { User } from "./users";
import auth from "./services/auth";
import Layout from "./components/Layout";
import LoadingPage from "./pages/LoadingPage";
import UsersContext, { Users } from "./contexts/UsersContext";
import usersService from "./services/users";
import chatTokenService from "./services/chatToken";
import { toast } from "react-toastify";

const id = "1322281";
const key = "8hn252eegqq9";

function App() {
  const [client, setClient] = useState<StreamClient<DefaultGenerics>>();
  const [chatClient, setChatClient] =
    useState<StreamChat<ChatDefaultGenerics>>();
  const [user, setUser] = useState<User>();
  const [activity, setActivity] = useState<Activity<DefaultGenerics>>();
  const [users, setUsers] = useState<Users>({});
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const initChatClient = async () => {
      if (!user) return;

      if (!user?.chatToken) {
        const res = await chatTokenService.getChatToken();

        if (res.ok) {
          initUser();

          return setUser({ ...user, chatToken: res.data as string });
        } else return toast.error("Failed to fetch your chat token");
      }

      const client = StreamChat.getInstance(key);

      await client.connectUser(
        { id: user._id, name: user.name, image: user.avatar, },
        user.chatToken
      );

      setChatClient(client);
    };

    initChatClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, chatClient]);

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
    const initClient = async () => {
      try {
        if (user) setClient(new StreamClient(key, user.feedToken, id));
      } catch (error) {
        console.error(error);
      }
    };

    initUser();
    initClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initUser]);

  function initUser() {
    if (!user) {
      const currentUser = auth.getCurrentUser();
      if (currentUser) setUser(currentUser);
    }
  }

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

  if (!user && !auth.getJwt()) return <AuthPages />;

  if (!client || !chatClient) return <LoadingPage />;

  return (
    <StreamApp token={user?.feedToken || ""} appId={id} apiKey={key}>
      <Chat client={chatClient} theme="messaging dark">
        <Box fontFamily="quicksand">
          <UsersContext.Provider value={{ setUsers, users }}>
            <UserContext.Provider value={{ setUser, user }}>
              <ActivityContext.Provider value={{ activity, setActivity }}>
                <QuotesContext.Provider value={{ quotes, setQuotes }}>
                  <Layout>
                    <Routes>
                      <Route
                        element={<NotificationsPage />}
                        path="/notifications"
                      />
                      <Route element={<MessagesPage />} path="/messages" />
                      <Route element={<ExplorePage />} path="/explore" />
                      <Route
                        element={<QuoteSparklePage />}
                        path="/:user_id/status/:id/quote"
                      />
                      <Route
                        element={<ThreadPage />}
                        path="/:user_id/status/:id"
                      />
                      <Route
                        element={<QuotesPage />}
                        path="/:user_id/status/:id/quotes"
                      />
                      <Route
                        element={<EditProfilePage />}
                        path="/:user_id/edit"
                      />
                      <Route
                        element={<FollowingsPage />}
                        path="/:user_id/followings"
                      />
                      <Route
                        element={<FollowersPage />}
                        path="/:user_id/followers"
                      />
                      <Route element={<ProfilePage />} path="/:user_id" />
                      <Route element={<HomePage />} path="/" />
                    </Routes>
                  </Layout>
                </QuotesContext.Provider>
              </ActivityContext.Provider>
            </UserContext.Provider>
          </UsersContext.Provider>
        </Box>
      </Chat>
    </StreamApp>
  );
}

export default App;
