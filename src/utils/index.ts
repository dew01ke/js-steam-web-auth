import { REFRESH_INTERVAL_TIME } from '@/config';

export function getTime(timeOffset?: number): number {
  return Math.floor(Date.now() / 1000) + (timeOffset || 0);
}

export function getCurrentCountdown() {
  return REFRESH_INTERVAL_TIME - (getTime() % REFRESH_INTERVAL_TIME);
}
