export interface ActivityActor {
  created_at: string;
  data: { profileImage: string; name: string; id: string; email: string };
  id: string;
  updated_at: string;
}

export interface ActivityObject {
  collection: string;
  created_at: string;
  data: { text: string };
  foreign_id: string;
  id: string;
  updated_at: string;
}

export type Activity = {
  id: string;
  actor: ActivityActor;
  object: ActivityObject;
  time: string;
  own_reactions: {
    like: {
      activity_id: string;
      children_counts: object;
      created_at: string;
      data: object;
      id: string;
      kind: "like";
      latest_children: object;
      parent: string;
      updated_at: string;
      user: {
        created_at: string;
        updated_at: string;
        id: string;
        data: { email: string; name: string; profileImage?: string };
      };
      user_id: string;
    }[];
  };
  reaction_counts: { comment?: number; like?: number };
  target: string;
  verb: string;
};
