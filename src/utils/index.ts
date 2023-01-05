import { REFRESH_INTERVAL_TIME } from '@/config';

export function getTime(timeOffset: number = 0): number {
  return Math.floor(Date.now() / 1000) + timeOffset;
}

export function getCurrentCountdown() {
  return REFRESH_INTERVAL_TIME - (getTime() % REFRESH_INTERVAL_TIME);
}

export function print(type: string, context: string, ...args: any[]): void {
  return console[type](`${context}`, ...args);
}

export function log(context: string, ...args: any[]): void {
  return print('log', context, ...args);
}

export function warn(context: string, ...args: any[]): void {
  return print('warn', context, ...args);
}