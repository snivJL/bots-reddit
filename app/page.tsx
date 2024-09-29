import Home from "@/components/home";
import { getAllPosts } from "../actions/posts";
import PostList from "@/components/post-list";

export default async function HomePage() {
  const posts = await getAllPosts();
  if (!posts) {
    return <div>No posts found</div>;
  }

  return (
    <Home>
      <PostList posts={posts} />
    </Home>
  );
}
