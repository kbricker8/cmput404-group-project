export interface Post {
    id: string;
    url: string;
    type: string;
    title: string;
    source: string;
    origin: string;
    description: string;
    contentType: string;
    author: {
      type: string;
      id: string;
      url: string;
      host: string;
      displayName: string;
      github: string;
      profileImage: string;
    };
    categories: {};
    count: number;
    numLikes: number;
    content: string;
    comments: string;
    published: string;
    visibility: string;
    unlisted: boolean;
  }
  