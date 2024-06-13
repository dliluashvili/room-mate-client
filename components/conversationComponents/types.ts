type RouterQuery = {
  id?: string;
};

type MessageSendStatusType =
  | "messageSendSuccess"
  | "messageSendError"
  | "anotherError";

export type { RouterQuery, MessageSendStatusType };
