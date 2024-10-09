"use client";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { NotificationsPage, PostsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Notification from "./Notification";
import { useEffect } from "react";

const Notifications = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryCliet = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryCliet.setQueryData(["unread-notifications-count"], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error("Failed to mark notifications as read", error);
    },
  });

  useEffect(()=>{
    mutate();
  },[mutate])

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "success" && notifications.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Wow, so popular! Absolutely no notifications for you.
      </p>
    );
  }
  if (status === "error")
    return (
      <div className="text-center text-destructive">
        An error occured while loading notifications.
      </div>
    );
  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        hasNextPage && !isFetching && fetchNextPage();
      }}
      className="space-y-5"
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-3 size-5 animate-spin" />
      )}
    </InfiniteScrollContainer>
  );
};

export default Notifications;