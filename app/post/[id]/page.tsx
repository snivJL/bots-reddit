import { getCommentsWithReplies } from "@/actions/comments";
import { getPostById } from "../../../actions/posts";
import PostDetail from "@/components/post-detail";
import CommentList from "@/components/comments/comment-list";

export default async function PostCard({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);
  const [post, commentsWithReplies] = await Promise.all([
    getPostById(postId),
    getCommentsWithReplies(postId),
  ]);

  if (!post) {
    return;
  }

  return (
    <>
      <PostDetail post={post}>
        <CommentList comments={commentsWithReplies} />
      </PostDetail>
    </>
  );
}
