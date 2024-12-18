"use client";
import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LegacyRef, useEffect, useRef, useState } from "react";
import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";

interface PostProps {
  post: PostData;
}
const Post = ({ post }: PostProps) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              suppressHydrationWarning
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.userId === user?.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: !!post.likes.some(
                (like) => like.userId === user?.id,
              ),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => {
              setShowComments(!showComments);
            }}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: !!post.bookmarks.some(
              (bookmark) => bookmark.userId === user?.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
};

export default Post;

interface MediaPreiveiwsProps {
  attachments: Media[];
}
const MediaPreviews = ({ attachments }: MediaPreiveiwsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "grid-cols-2 sm:grid",
      )}
    >
      {attachments.map((attachment) => (
        <MediaPreview key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
};

interface MediaPreviewProps {
  attachment: Media;
}
const MediaPreview = ({ attachment }: MediaPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }, // Adjust the threshold as needed
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);
  if (attachment.mediaType === "IMAGE") {
    return (
      <Image
        src={attachment.url}
        alt="attachment"
        height={500}
        width={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }
  if (attachment.mediaType === "VIDEO") {
    return (
      <div>
        <video
          ref={videoRef}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
          src={attachment.url}
          loop
        />
      </div>
    );
  }
  return <p className="text-destructive">Unsupported media type</p>;
};

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}
function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquareIcon className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
