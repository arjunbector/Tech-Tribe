"use client";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
interface UserPostsFeedProps {
  userId: string;
}
const UserPostsFeed = ({userId}:UserPostsFeedProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const posts = data?.pages.flatMap((page) => page.posts) || [];
  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        User has not posted anything yet.
      </p>
    );
  }
  if (status === "error")
    return (
      <div className="text-center text-destructive">
        An error occured while getting the posts
      </div>
    );
  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        hasNextPage && !isFetching && fetchNextPage();
      }}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-3 size-5 animate-spin" />
      )}
    </InfiniteScrollContainer>
  );
};

export default UserPostsFeed;