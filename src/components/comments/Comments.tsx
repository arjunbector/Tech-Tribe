import { CommentsPage, PostData } from "@/lib/types";
import CommentsInput from "./CommentsInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import Comment from "./Comment";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

interface CommentsProps {
  post: PostData;
}
const Comments = ({ post }: CommentsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });
  const comments = data?.pages.flatMap((page) => page.comments) || [];
  return (
    <div className="space-y-3">
      <CommentsInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => {
            fetchNextPage();
          }}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2Icon className="mx-auto animate-spin" />}
      {status === "success" && comments.length === 0 && (
        <p className="text-center text-muted-foreground">
          Shhh... it&apos;s too quiet here. Say something!
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          Yikes, the comments broke the internet! 🌐 Try again later.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;