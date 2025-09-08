import type { CommentType } from "../../../services/commentService";

type BaseType = {
    channel: string;
    type: "anime_episode_comment";
}

type TypingMessage = {
    action: "typing";
    payload: { isTyping: boolean };
} & BaseType;
  
type PostCommentMessage = {
    action: "post_comment" | "post_reply";
    payload: CommentType;
} & BaseType;

export type EpisodeCommentMessageType = TypingMessage | PostCommentMessage;