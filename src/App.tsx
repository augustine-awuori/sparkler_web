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
  UsersPage,
} from "./pages";
import {
  ActivityContext,
  FilesContext,
  QuotesContext,
  ShowSparkleModalContext,
  UserContext,
} from "./contexts";
import { AppData, appDataJwt } from "./utils/app";
import { ActivityActor, Quote } from "./utils/types";
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
  const [usersLoading, setUsersLoading] = useState(false);
  const [showSparkleModal, setShowSparkleModal] = useState(false);
  const [appData, setAppData] = useState<AppData>();
  const { googleUser } = useUser();

  useEffect(() => {
    const getUserInfo = async () =>
      user ? await usersService.getUser(user._id) : undefined;

    const deleteAccount = async () => {
      if (!feedClient?.currentUser) return;

      await feedClient.currentUser?.delete();
      await usersService.deleteUserAccont();
    };

    const userInvalid = async (): Promise<boolean> => {
      if (user?.invalid) return true;

      const res = await getUserInfo();
      if (!res || !res?.ok) return false;

      return Boolean((res.data as User).invalid);
    };

    const removeInvalidAccounts = async () => {
      if (await userInvalid()) {
        await deleteAccount();
        auth.logout();
        window.location.reload();
      }
    };

    removeInvalidAccounts();
  }, [feedClient?.currentUser, user]);

  useEffect(() => {
    const updateNeeded = (): boolean => {
      const currentUser = feedClient?.currentUser as ActivityActor | undefined;

      if (!currentUser || !user) return false;

      return Boolean(
        currentUser.data.name === "Unknown" ||
          (!currentUser.data.username && user.username)
      );
    };

    const updateUserDataWhenNeeded = async () => {
      const validState = feedClient && user && user._id === feedClient.userId;

      if (validState && updateNeeded())
        await feedClient.currentUser?.update({ id: user._id, ...user });
    };

    initUser({ googleUser, setUser, user });
    updateUserDataWhenNeeded();
  }, [feedClient, googleUser, user]);

  useEffect(() => {
    setAppData(auth.decode(appDataJwt) as AppData);
  }, []);

  useEffect(() => {
    const initChatClient = async () => {
      try {
        if (!appData || chatClient) return;

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
  }, [appData, chatClient, user]);

  useEffect(() => {
    const initFeedClient = async () => {
      if (!appData || (user && user._id === feedClient?.userId) || feedClient)
        return;

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
        setUsersLoading(true);
        const res = await usersService.getAllUsers();
        setUsersLoading(false);

        if (res.ok) {
          setAllUsers(res.data as User[]);

          let users: Users = {};
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
      <div className="onesignal-customelink-container" />
      <Chat client={chatClient} theme="messaging dark">
        <Box fontFamily="quicksand">
          <UsersContext.Provider
            value={{
              allUsers,
              setUsers,
              users,
              isLoading: usersLoading,
              setLoading: setUsersLoading,
            }}
          >
            <UserContext.Provider value={{ setUser, user }}>
              <ActivityContext.Provider value={{ activity, setActivity }}>
                <QuotesContext.Provider value={{ quotes, setQuotes }}>
                  <FilesContext.Provider value={{ files, setFiles }}>
                    <ProfileContext.Provider
                      value={{ user: profileUser, setUser: setProfileUser }}
                    >
                      <ShowSparkleModalContext.Provider
                        value={{ setShowSparkleModal, showSparkleModal }}
                      >
                        <Layout>
                          <Routes>
                            <Route element={<AuthPages />} path="/auth" />
                            <Route
                              element={<NotificationsPage />}
                              path="/notifications"
                            />
                            <Route
                              element={<MessagesPage />}
                              path="/messages"
                            />
                            <Route
                              element={<UsersPage />}
                              path="/explore/users"
                            />
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
                            <Route
                              element={<ProfilePage />}
                              path="/:username"
                            />
                            <Route element={<HomePage />} path="/" />
                          </Routes>
                        </Layout>
                      </ShowSparkleModalContext.Provider>
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
