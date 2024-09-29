import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

type Props = {
  upvotes: number;
  userVote?: number;
  onUpvote: () => void;
  onDownvote: () => void;
};

const Upvotes = ({ upvotes, userVote, onUpvote, onDownvote }: Props) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Button variant="ghost" size="icon" onClick={onUpvote}>
        <ArrowBigUp
          className={cn("h-6 w-6 ", { "text-reddit": userVote === 1 })}
          fill={userVote === 1 ? "#D93900" : "currentColor"}
        />
      </Button>
      <span className="font-bold">{upvotes}</span>
      <Button variant="ghost" size="icon" onClick={onDownvote}>
        <ArrowBigDown
          className={cn("h-6 w-6", { "text-reddit": userVote === -1 })}
          fill={userVote === -1 ? "#D93900" : "currentColor"}
        />
      </Button>
    </div>
  );
};

export default Upvotes;
