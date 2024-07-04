export const randomImageUrl = "https://picsum.photos/500/200";

type Common = {
  created_at: string;
  id: string;
  updated_at: string;
};

export interface ActivityActor extends Common {
  data: {
    id: string;
    email: string;
    name: string;
    profileImage?: string;
  };
}

export interface ActivityObject extends Common {
  collection: string;
  data: { text: string };
  foreign_id: string;
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

export type Activity = {
  id: string;
  actor: ActivityActor;
  object: ActivityObject;
  time: string;
  latest_reactions: {
    like?: Like[];
    comment?: Comment[];
  };
  own_reactions: {
    comment?: Comment[];
    like?: Like[];
  };
  reaction_counts: { comment?: number; like?: number };
  target: string;
  verb: string;
};
