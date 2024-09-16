import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Activity, DefaultGenerics, StreamClient } from "getstream";
import { StreamApp } from "react-activity-feed";
import { Box } from "@chakra-ui/react";
import { Chat } from "stream-chat-react";
import { toast } from "react-toastify";
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
import {
  ActivityContext,
  FilesContext,
  QuotesContext,
  UserContext,
} from "./contexts";
import { AppData } from "./utils/app";
import { Quote } from "./utils/types";
import { User } from "./users";

import appService from "./services/appData";
import auth from "./services/auth";
import chatTokenService from "./services/chatToken";
import Layout from "./components/Layout";
import LoadingPage from "./pages/LoadingPage";
import UsersContext, { Users } from "./contexts/UsersContext";
import usersService from "./services/users";

function App() {
  const [feedClient, setFeedClient] = useState<StreamClient<DefaultGenerics>>();
  const [chatClient, setChatClient] =
    useState<StreamChat<ChatDefaultGenerics>>();
  const [user, setUser] = useState<User>();
  const [activity, setActivity] = useState<Activity<DefaultGenerics>>();
  const [users, setUsers] = useState<Users>({});
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const res = await appService.getAppData();
        if (res.ok) {
          const data = res.data as { token: string };
          const decoded = auth.decode(data.token) as AppData;
          setAppData(decoded);
        }
      } catch (error) {
        console.error("Error fetching app data:", error);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    const initChatClient = async () => {
      if (!appData) return;
      try {
        const client = StreamChat.getInstance(appData.key);

        if (!user) {
          await client.connectUser(
            { id: appData.userId, name: "Anonymous" },
            appData.userToken
          );
          setChatClient(client);
          return;
        }

        if (!user?.chatToken) {
          const res = await chatTokenService.getChatToken();
          if (res.ok) {
            setUser({ ...user, chatToken: res.data as string });
          } else {
            toast.error("Failed to fetch your chat token");
          }
        }

        await client.connectUser(
          { id: user._id, name: user.name, image: user.avatar },
          user.chatToken
        );
        setChatClient(client);
      } catch (error) {
        console.error("Error initializing chat client:", error);
      }
    };
    if (appData) {
      initChatClient();
    }
  }, [appData, user]);

  useEffect(() => {
    const initFeedClient = async () => {
      if (feedClient || !appData) return;
      try {
        const client = new StreamClient(
          appData.key,
          user?.feedToken || appData.userToken,
          appData.id
        );
        setFeedClient(client);
      } catch (error) {
        console.error("Error initializing feed client:", error);
      }
    };
    if (appData) {
      initFeedClient();
    }
  }, [appData, user, feedClient]);

  useEffect(() => {
    const retrieveAllUsersInfo = async () => {
      let users: Users = {};
      try {
        const res = await usersService.getAllUsers();
        if (res.ok) {
          (res.data as User[]).forEach(({ _id, username }) => {
            if (!users[username]) users[username] = _id;
          });
          setUsers(users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    retrieveAllUsersInfo();
  }, []);

  useEffect(() => {
    if (
      feedClient &&
      user &&
      feedClient?.currentUser?.data?.name === "Unknown"
    ) {
      feedClient.currentUser.update({
        id: feedClient.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        profileImage: user.avatar,
      });
    }
  }, [feedClient, user]);

  if (loading || !feedClient || !chatClient || !appData) return <LoadingPage />;

  return (
    <StreamApp
      token={user?.feedToken || appData.userToken}
      appId={appData.id}
      apiKey={appData.key}
    >
      <Chat client={chatClient} theme="messaging dark">
        <Box fontFamily="quicksand">
          <UsersContext.Provider value={{ setUsers, users }}>
            <UserContext.Provider value={{ setUser, user }}>
              <ActivityContext.Provider value={{ activity, setActivity }}>
                <QuotesContext.Provider value={{ quotes, setQuotes }}>
                  <FilesContext.Provider value={{ files, setFiles }}>
                    <Layout>
                      <Routes>
                        <Route element={<AuthPages />} path="/auth" />
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
                  </FilesContext.Provider>
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
