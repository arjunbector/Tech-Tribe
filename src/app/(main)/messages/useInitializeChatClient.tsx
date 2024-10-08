import { useEffect, useState } from "react";
import { useSession } from "../SessionProvider";
import { StreamChat } from "stream-chat";
import kyInstance from "@/lib/ky";

const useInitializeChatClient = () => {
  const { user } = useSession();
  const [chatCLient, setChatClient] = useState<StreamChat | null>(null);
  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);
    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      .catch((err) => {
        console.error("Failed to connect user", err);
      })
      .then(() => {
        setChatClient(client);
      });
    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          console.log("Disconnected");
        });
    };
  }, [user.id, user.username, user.displayName, user.avatarUrl]);
  return chatCLient;
};

export default useInitializeChatClient;
