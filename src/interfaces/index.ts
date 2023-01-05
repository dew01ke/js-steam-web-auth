export interface AuthCode {
  identitySecret: string;
  code: string;
  time: number;
}

export type Subscriber = (authCode: AuthCode) => void;

export type Unsubscribe = () => void;
