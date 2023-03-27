import {Post} from "../types/post"
export default function convertTeam18PostToOurPost(obj: any): Post {
  const post: Post = {
    id: obj.id,
    url: obj.url,
    type: obj.type,
    title: obj.title,
    source: obj.source,
    origin: obj.origin,
    description: obj.description,
    contentType: obj.content_type,
    author: {
      type: obj.author.type,
      id: obj.author.id,
      url: obj.author.url,
      host: obj.author.host,
      displayName: obj.author.displayName,
      github: obj.author.github,
      profileImage: obj.author.profile_image,
    },
    categories: {},
    count: obj.count,
    numLikes: obj.likes.length,
    content: obj.content,
    comments: obj.comments,
    published: obj.published,
    visibility: obj.visibility,
    unlisted: obj.unlisted,
  };
  return post;
}