const { Buffer } = require('buffer/');
import { REFRESH_INTERVAL_TIME } from '@/constants';


export function getTime(timeOffset?: number): number {
  return Math.floor(Date.now() / 1000) + (timeOffset || 0);
}

export function convertToBuffer(text: string): Buffer {
  return Buffer.from(text, 'base64');
}

export function getCurrentCountdown() {
  return REFRESH_INTERVAL_TIME - (getTime() % REFRESH_INTERVAL_TIME);
}
