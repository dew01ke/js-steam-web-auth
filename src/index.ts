import { generateAuthCode } from '@/core';
import { getCurrentCountdown } from '@/utils';
import { SubscribeCallback, Unsubscribe } from '@/interfaces';

let authCodeCallbacks = new Map();

export function subscribeToAuthCode(identitySecret: string, callback: SubscribeCallback): Unsubscribe {
  if (!authCodeCallbacks.has(identitySecret)) {
    authCodeCallbacks.set(identitySecret, callback);
  }

  callback({
    code: generateAuthCode(identitySecret, 0),
    countdown: getCurrentCountdown(),
    createdAt: Date.now(),
  });

  return () => {
    authCodeCallbacks.delete(identitySecret);
  }
}

function notifyAll() {
  authCodeCallbacks.forEach((callback, identitySecret) => {
    callback({
      code: generateAuthCode(identitySecret, 0),
      countdown: getCurrentCountdown(),
    });
  });
}

function runNotifications() {
  setTimeout(() => {
    notifyAll();
  }, 1000);
}

runNotifications();
