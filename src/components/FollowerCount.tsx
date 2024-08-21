"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  intialState: FollowerInfo;
}
const FollowerCount = ({ intialState, userId }: FollowerCountProps) => {
    const {data} = useFollowerInfo(userId, intialState);

  return <span>
    Followers:{" "}<span className="font-semibold">{formatNumber(data.followers)}</span>
  </span>;

};

export default FollowerCount;
