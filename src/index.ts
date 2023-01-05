import { generateAuthCode } from '@/core';
import { getCurrentCountdown } from '@/utils';
import { Subscriber, Unsubscribe} from '@/interfaces';

let authCodeCallbacks = new Map<string, Subscriber>();

export function subscribeToAuthCode(identitySecret: string, subscriber: Subscriber): Unsubscribe {
  if (!authCodeCallbacks.has(identitySecret)) {
    authCodeCallbacks.set(identitySecret, subscriber);
  }

  generateAuthCode(identitySecret, 0).then((code) => {
    subscriber({
      identitySecret,
      code,
      time: getCurrentCountdown()
    });
  });

  return () => {
    authCodeCallbacks.delete(identitySecret);
  }
}

function notifyAll() {
  authCodeCallbacks.forEach((callback, identitySecret) => {
    generateAuthCode(identitySecret, 0).then((code) => {
      callback({
        identitySecret,
        code,
        time: getCurrentCountdown(),
      });
    });
  });
}

function runNotifications() {
  setTimeout(() => {
    notifyAll();
    runNotifications();
  }, 1000);
}

runNotifications();
