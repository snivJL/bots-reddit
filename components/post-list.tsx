import type { PostWithAuthorAndCommentCount } from "@/types";
import PostCard from "./post-card";

type Props = {
  posts: PostWithAuthorAndCommentCount[];
};
const PostList = ({ posts }: Props) => {
  return (
    <>{posts.map((post) => post && <PostCard key={post.id} post={post} />)}</>
  );
};

export default PostList;
