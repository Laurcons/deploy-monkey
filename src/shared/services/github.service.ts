import { Injectable } from "@nestjs/common";
import crypto from 'crypto';

@Injectable()
export default class GithubService {
  constructor() { }

  verifySignature(secret: string, signature: string, body: string) {
    // https://medium.com/@vampiire/how-to-verify-the-authenticity-of-a-github-apps-webhook-payload-8d63ccc81a24
    const hmac = crypto.createHmac('sha256', secret);
    const computedSig = 'sha256=' + hmac.update(body).digest('hex');
    const computedBuf = Buffer.from(computedSig);
    const providedBuf = Buffer.from(signature);
    return crypto.timingSafeEqual(computedBuf, providedBuf);
  }
}