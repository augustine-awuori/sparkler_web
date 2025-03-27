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
  AboutPage,
  AuthCodeLoginPage,
  AuthCodePages,
  AuthCodeRegisterPage,
  AuthPages,
  BookmarksPage,
  CommunitiesPage,
  CommunityPage,
  CSAEPolicyPage,
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
  ReportPage,
  ReportsPage,
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
import { ActivityActor, FollowersResult, Quote } from "./utils/types";
import { User } from "./users";
import auth from "./services/auth";
import Layout from "./components/Layout";
import LoadingPage from "./pages/LoadingPage";
import ProfileContext, { FeedUser } from "./contexts/ProfileUserContext";
import UsersContext, {
  IdUserMap,
  UsernameIdMap,
  Users,
} from "./contexts/UsersContext";
import CommunitiesContext, { Community } from "./contexts/CommunitiesContext";
import communitiesService from "./services/communities";
import usersService from "./services/users";
import useUser, { initUser } from "./hooks/useUser";

function App() {
  const [feedClient, setFeedClient] = useState<StreamClient<DefaultGenerics>>();
  const [chatClient, setChatClient] =
    useState<StreamChat<ChatDefaultGenerics>>();
  const [activity, setActivity] = useState<Activity<DefaultGenerics>>();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [appData, setAppData] = useState<AppData>();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [idUserMap, setIdUserMap] = useState<IdUserMap>({});
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [profileUser, setProfileUser] = useState<FeedUser>();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showSparkleModal, setShowSparkleModal] = useState(false);
  const [user, setUser] = useState<User>();
  const [usernameIdMap, setUsernameIdMap] = useState<UsernameIdMap>({});
  const [users, setUsers] = useState<Users>({});
  const [usersLoading, setUsersLoading] = useState(false);
  const { googleUser } = useUser();

  useEffect(() => {
    const fetchUserFollowing = async () => {
      try {
        if (!user || user?.followersId) return;

        const followersRes = await usersService.getUserFollowers(user._id);
        const followingRes = await usersService.getUserFollowing(user._id);
        if (!followersRes.ok || !followingRes.ok) return;

        const followingId = new Set<string>();
        (followingRes.data as FollowersResult).forEach(({ target_id }) => {
          followingId.add(target_id.replace("user:", ""));
        });

        const followersId = new Set<string>();
        (followersRes.data as FollowersResult).forEach(({ feed_id }) => {
          followersId.add(feed_id.replace("timeline:", ""));
        });
        setUser({ ...user, followersId, followingId });
      } catch (error) {
        console.log(`Error fetching user's following: ${error}`);
      }
    };

    fetchUserFollowing();
  }, [user]);

  useEffect(() => {
    const updateNeeded = (): boolean => {
      const currentUser = feedClient?.currentUser as ActivityActor | undefined;

      if (!currentUser || !user) return false;

      return Boolean(
        currentUser?.data?.name === "Unknown" ||
          (!currentUser?.data?.username && user.username)
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
    const initCommunities = async () => {
      if (communities.length) return;

      setLoadingCommunities(true);
      const res = await communitiesService.getCommunities();
      setLoadingCommunities(false);

      if (res.ok) setCommunities(res.data as Community[]);
    };

    if (!appData) setAppData(auth.decode(appDataJwt) as AppData);
    initCommunities();
  }, [appData, communities.length]);

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
          let idUserMap: IdUserMap = {};
          let usernameIdMap: UsernameIdMap = {};
          (res.data as User[]).forEach((user) => {
            const { _id, username } = user;

            if (!users[username]) users[username] = _id;
            idUserMap[_id] = user;
            usernameIdMap[username] = _id;
          });
          setUsers(users);
          setIdUserMap(idUserMap);
          setUsernameIdMap(usernameIdMap);
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
              idUserMap,
              setIdUserMap,
              setUsernameIdMap,
              usernameIdMap,
            }}
          >
            <UserContext.Provider value={{ setUser, user }}>
              <ActivityContext.Provider value={{ activity, setActivity }}>
                <QuotesContext.Provider value={{ quotes, setQuotes }}>
                  <FilesContext.Provider value={{ files, setFiles }}>
                    <ProfileContext.Provider
                      value={{
                        profileUser: profileUser,
                        setProfileUser: setProfileUser,
                      }}
                    >
                      <ShowSparkleModalContext.Provider
                        value={{ setShowSparkleModal, showSparkleModal }}
                      >
                        <CommunitiesContext.Provider
                          value={{
                            communities,
                            setCommunities,
                            loading: loadingCommunities,
                            onLoad: setLoadingCommunities,
                          }}
                        >
                          <Layout>
                            <Routes>
                              <Route
                                element={<CSAEPolicyPage />}
                                path="/docs/policy"
                              />
                              <Route
                                element={<AuthCodePages />}
                                path="/auth/code"
                              />
                              <Route
                                element={<AuthCodeLoginPage />}
                                path="/auth/code/login"
                              />
                              <Route
                                element={<AuthCodeRegisterPage />}
                                path="/auth/code/register"
                              />
                              <Route element={<AuthPages />} path="/auth" />
                              <Route
                                element={<NotificationsPage />}
                                path="/notifications"
                              />
                              <Route
                                element={<ReportPage />}
                                path="/reports/:reportId"
                              />
                              <Route
                                element={<ReportsPage />}
                                path="/reports"
                              />
                              <Route
                                element={<BookmarksPage />}
                                path="/:username/bookmarks"
                              />
                              <Route
                                element={<AboutPage />}
                                path="/sparkler/about"
                              />
                              <Route
                                element={<CommunityPage />}
                                path="/communities/:communityId"
                              />
                              <Route
                                element={<CommunitiesPage />}
                                path="/communities"
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
                              <Route
                                element={<ExplorePage />}
                                path="/explore"
                              />
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
                        </CommunitiesContext.Provider>
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
