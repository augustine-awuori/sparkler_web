type Common = {
  created_at: string;
  id: string;
  updated_at: string;
};

export interface QuoteActivity extends Activity {
  quoted_activity: Activity;
}

export type ActivityActorData = {
  id: string;
  bio?: string;
  email: string;
  name: string;
  username: string;
  profileImage?: string;
  coverImage?: string;
  verified?: boolean;
  isAdmin?: boolean;
  youtube?: string;
  linkedIn?: string;
  instagram?: string;
  customLink?: string;
};

export interface ActivityActor extends Common {
  data: ActivityActorData;
}

export interface ActivityObject extends Common {
  collection: string;
  data: { text: string };
  foreign_id: string;
}

export interface Quote extends Common {
  activity_id: string;
  children_counts: ChildrenCounts;
  data: { text: string };
  kind: "quote";
  latest_children: object;
  parent: string;
  user: ActivityActor;
  user_id: string;
}

type ChildrenCounts = {
  like?: number;
  resparkle?: number;
  comment?: number;
};

interface Reaction extends Common {
  activity_id: string;
  children_counts: ChildrenCounts;
  data: object;
  kind: string;
  latest_children: object;
  parent: string;
  user: ActivityActor;
  user_id: string;
}

export interface Comment extends Reaction {
  data: { text: string };
  kind: "comment";
}

interface Like extends Reaction {
  kind: "like";
}

interface Bookmark extends Reaction {
  kind: "bookmark";
}

interface Resparkle extends Common {
  activity_id: string;
  children_counts: ChildrenCounts;
  data: object;
  kind: "resparkle";
  latest_children: object;
  parent: string;
  user: ActivityActor;
  user_id: string;
}

export type Video = { mimeType: "video/mp4"; name: string; url: string };

export type Activity = {
  id: string;
  actor: ActivityActor;
  object: ActivityObject;
  attachments?: {
    files?: Video[];
    images?: string[];
  };
  time: string;
  latest_reactions?: {
    bookmark?: Bookmark[];
    comment?: Comment[];
    like?: Like[];
    quote?: Quote[];
    resparkle?: Resparkle[];
  };
  own_reactions: {
    bookmark?: Bookmark[];
    comment?: Comment[];
    like?: Like[];
    quote?: Quote[];
    resparkle?: Resparkle[];
  };
  quoted_activity?: Activity;
  reaction_counts: {
    comment?: number;
    like?: number;
    resparkle?: number;
    quote?: number;
  };
  target: string;
  parent: string;
  verb: string;
};

export type FollowersResult = {
  created_at: string;
  updated_at: string;
  feed_id: "timeline:";
  target_id: "user:";
}[];

export type FollowingResult = {
  created_at: string;
  updated_at: string;
  feed_id: "timeline:";
  target_id: "user:";
}[];
