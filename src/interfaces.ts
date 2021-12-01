export type SubscribePayload = { code: string; countdown: number; };

export type SubscribeCallback = (payload: SubscribePayload) => void;

export type Unsubscribe = () => void;
