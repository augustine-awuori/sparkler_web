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
  HashtagPage,
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
import { AppData, appDataJwt } from "./utils/app";
import { Quote } from "./utils/types";
import { User } from "./users";
import auth from "./services/auth";
import Layout from "./components/Layout";
import LoadingPage from "./pages/LoadingPage";
import ProfileContext, { FeedUser } from "./contexts/ProfileContext";
import UsersContext, { Users } from "./contexts/UsersContext";
import usersService from "./services/users";
import useUser, { initUser } from "./hooks/useUser";

function App() {
  const [feedClient, setFeedClient] = useState<StreamClient<DefaultGenerics>>();
  const [chatClient, setChatClient] =
    useState<StreamChat<ChatDefaultGenerics>>();
  const [user, setUser] = useState<User>();
  const [profileUser, setProfileUser] = useState<FeedUser>();
  const [activity, setActivity] = useState<Activity<DefaultGenerics>>();
  const [users, setUsers] = useState<Users>({});
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [appData, setAppData] = useState<AppData>();
  const { googleUser } = useUser();

  useEffect(() => {
    initUser({ googleUser, setUser, user });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleUser, user]);

  useEffect(() => {
    setAppData(auth.decode(appDataJwt) as AppData);
  }, []);

  useEffect(() => {
    const initChatClient = async () => {
      try {
        if (!appData) return;

        const client = StreamChat.getInstance(appData.key);

        user
          ? await client.connectUser(
              { id: user._id, name: user.name, image: user.profileImage },
              user.chatToken
            )
          : await client.connectUser(
              { id: appData.userId, name: "Anonymous" },
              appData.userToken
            );

        setChatClient(client);
      } catch (error) {
        console.error("Error initializing chat client:", error);
      }
    };

    initChatClient();
  }, [appData, user]);

  useEffect(() => {
    const initFeedClient = async () => {
      if (!appData || (user && user._id === feedClient?.userId)) return;

      try {
        setFeedClient(
          new StreamClient(
            appData.key,
            user?.feedToken || appData.userToken,
            appData.id
          )
        );
      } catch (error) {
        console.error("Error initializing feed client:", error);
      }
    };

    initFeedClient();
  }, [appData, user, feedClient]);

  useEffect(() => {
    const retrieveAllUsersInfo = async () => {
      try {
        let users: Users = {};

        const res = await usersService.getAllUsers();

        if (res.ok) {
          setAllUsers(res.data as User[]);

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

  if (!feedClient || !chatClient || !appData) return <LoadingPage />;

  return (
    <StreamApp
      token={user?.feedToken || appData.userToken}
      appId={appData.id}
      apiKey={appData.key}
    >
      <Chat client={chatClient} theme="messaging dark">
        <Box fontFamily="quicksand">
          <UsersContext.Provider value={{ allUsers, setUsers, users }}>
            <UserContext.Provider value={{ setUser, user }}>
              <ActivityContext.Provider value={{ activity, setActivity }}>
                <QuotesContext.Provider value={{ quotes, setQuotes }}>
                  <FilesContext.Provider value={{ files, setFiles }}>
                    <ProfileContext.Provider
                      value={{ user: profileUser, setUser: setProfileUser }}
                    >
                      <Layout>
                        <Routes>
                          <Route element={<AuthPages />} path="/auth" />
                          <Route
                            element={<NotificationsPage />}
                            path="/notifications"
                          />
                          <Route element={<MessagesPage />} path="/messages" />
                          <Route
                            element={<HashtagPage />}
                            path="/explore/:hashtag"
                          />
                          <Route element={<ExplorePage />} path="/explore" />
                          <Route
                            element={<QuoteSparklePage />}
                            path="/:username/status/:id/quote"
                          />
                          <Route
                            element={<ThreadPage />}
                            path="/:username/status/:id"
                          />
                          <Route
                            element={<QuotesPage />}
                            path="/:username/status/:id/quotes"
                          />
                          <Route
                            element={<EditProfilePage />}
                            path="/:username/edit"
                          />
                          <Route
                            element={<FollowingsPage />}
                            path="/:username/followings"
                          />
                          <Route
                            element={<FollowersPage />}
                            path="/:username/followers"
                          />
                          <Route element={<ProfilePage />} path="/:username" />
                          <Route element={<HomePage />} path="/" />
                        </Routes>
                      </Layout>
                    </ProfileContext.Provider>
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
