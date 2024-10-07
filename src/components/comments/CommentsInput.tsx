"use  client";
import { PostData } from "@/lib/types";
import React, { useState } from "react";
import { useSubmitCommentMutation } from "./mutation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

interface CommentsInputProps {
  post: PostData;
}
const CommentsInput = ({ post }: CommentsInputProps) => {
  const [input, setInput] = useState("");
  const mutation = useSubmitCommentMutation(post.id);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    mutation.mutate(
      { post, content: input },
      { onSuccess: () => setInput("") },
    );
  };
  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Whatcha thinking? Spill it!"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        disabled={mutation.isPending}
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
};

export default CommentsInput;
