type Common = {
  created_at: string;
  id: string;
  updated_at: string;
};

export interface QuoteActivity extends Activity {
  quoted_activity: Activity;
}

export interface ActivityActor extends Common {
  data: {
    id: string;
    bio?: string;
    email: string;
    name: string;
    username: string;
    profileImage?: string;
    coverImage?: string;
    verified?: boolean;
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    customLink?: string;
  };
}

export interface ActivityObject extends Common {
  collection: string;
  data: { text: string };
  foreign_id: string;
}

export interface Quote extends Common {
  activity_id: string;
  children_counts: object;
  data: { text: string };
  kind: "quote";
  latest_children: object;
  parent: string;
  user: ActivityActor;
  user_id: string;
}

export interface Comment extends Common {
  activity_id: string;
  children_counts: object;
  data: { text: string };
  kind: "comment";
  latest_children: object;
  parent: string;
  user: ActivityActor;
  user_id: string;
}

interface Like extends Common {
  activity_id: string;
  children_counts: object;
  data: object;
  kind: "like";
  latest_children: object;
  parent: string;
  user: ActivityActor;
  user_id: string;
}

interface Resparkle extends Common {
  activity_id: string;
  children_counts: object;
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
  latest_reactions: {
    like?: Like[];
    comment?: Comment[];
    resparkle?: Resparkle[];
    quote?: Quote[];
  };
  own_reactions: {
    comment?: Comment[];
    like?: Like[];
    resparkle?: Resparkle[];
    quote?: Quote[];
  };
  reaction_counts: {
    comment?: number;
    like?: number;
    resparkle?: number;
    quote?: number;
  };
  target: string;
  verb: string;
};
