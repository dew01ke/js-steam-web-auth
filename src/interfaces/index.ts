export type SubscribePayload = { code: string; time: number; createdAt: number; };

export type SubscribeCallback = (payload: SubscribePayload) => void;

export type Unsubscribe = () => void;
