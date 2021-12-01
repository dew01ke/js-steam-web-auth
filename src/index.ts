import { REFRESH_INTERVAL_TIME } from '@/constants';
import { generateAuthCode } from '@/core';
import { getCurrentCountdown } from '@/utils';
import { SubscribeCallback, Unsubscribe } from '@/interfaces';


let callbacks = new Map();

export function subscribe(identitySecret: string, callback: SubscribeCallback): Unsubscribe {
  callbacks.set(identitySecret, callback);

  callback({
    code: generateAuthCode(identitySecret, 0),
    countdown: getCurrentCountdown(),
  });

  return () => {
    callbacks.delete(identitySecret);
  }
}

function notifyAll() {
  for (const [identitySecret, callback] of callbacks) {
    callback({
      code: generateAuthCode(identitySecret, 0),
      countdown: getCurrentCountdown(),
    });
  }
}

function runNotifications() {
  setTimeout(() => {
    notifyAll();

    setInterval(() => {
      notifyAll();
    }, REFRESH_INTERVAL_TIME * 1000);
  }, getCurrentCountdown() * 1000);
}

runNotifications();
