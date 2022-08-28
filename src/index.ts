import { generateAuthCode } from '@/core';
import { getCurrentCountdown } from '@/utils';
import { SubscribeCallback, Unsubscribe } from '@/interfaces';

let authCodeCallbacks = new Map();

export function subscribeToAuthCode(identitySecret: string, callback: SubscribeCallback): Unsubscribe {
  if (!authCodeCallbacks.has(identitySecret)) {
    authCodeCallbacks.set(identitySecret, callback);
  }

  generateAuthCode(identitySecret, 0).then((code) => {
    callback({
      code,
      time: getCurrentCountdown(),
      createdAt: Date.now(),
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
