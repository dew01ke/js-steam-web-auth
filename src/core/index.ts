const createHmac = require('create-hmac');
const { Buffer } = require('buffer/');
import { getTime, convertToBuffer } from '@/utils';


export function generateAuthCode(secret: string, timeOffset: number = 0): string {
  const currentTime = getTime(timeOffset);

  let buffer = Buffer.allocUnsafe(8);
  buffer.writeUInt32BE(0, 0);
  buffer.writeUInt32BE(Math.floor(currentTime / 30), 4);

  let hmac = createHmac('sha1', convertToBuffer(secret));
  hmac = hmac.update(buffer).digest();

  let start = hmac[19] & 0x0F;
  hmac = hmac.slice(start, start + 4);

  let fullCode = hmac.readUInt32BE(0) & 0x7FFFFFFF;
  const chars = '23456789BCDFGHJKMNPQRTVWXY';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(fullCode % chars.length);
    fullCode /= chars.length;
  }

  return code;
}
