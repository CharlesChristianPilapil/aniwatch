export type SocketListenerType<T> = {
    type: "join";
    action: string
    channel: string;
    payload: T;
};