import { createHMAC, createSHA1 } from 'hash-wasm';
import { getTime } from '@/utils';
import { REFRESH_INTERVAL_TIME } from '@/config';

function stringToBytes(text): Uint8Array {
  const length = text.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = text.charCodeAt(i);
  }

  return bytes;
}

function numberToBytes(number: number): ArrayBuffer {
  const bytes = new ArrayBuffer(4);
  const view = new DataView(bytes);
  view.setUint32(0, number, false);

  return bytes;
}

function bytesToNumber(bytes: Uint8Array): number {
  const view = new DataView(bytes.buffer);

  return view.getInt32(0);
}

function extractCode(bytes): string {
  const start = bytes[19] & 0x0F;
  const slicedBytes = bytes.slice(start, start + 4);

  const chars = '23456789BCDFGHJKMNPQRTVWXY';
  let fullCode = bytesToNumber(slicedBytes) & 0x7FFFFFFF;
  let code = '';

  for (let i = 0; i < 5; i++) {
    code += chars.charAt(fullCode % chars.length);
    fullCode /= chars.length;
  }

  return code;
}

export async function generateAuthCode(secret: string, timeOffset: number = 0): Promise<string> {
  const currentTime = getTime(timeOffset);
  const hmac = await createHMAC(createSHA1(), stringToBytes(atob(secret)));
  const payload = Math.floor(currentTime / REFRESH_INTERVAL_TIME);

  const bytes = new Uint8Array(8);
  bytes.set(new Uint8Array(numberToBytes(payload)), 4);

  hmac.init();
  hmac.update(bytes);

  return extractCode(hmac.digest('binary'));
}
