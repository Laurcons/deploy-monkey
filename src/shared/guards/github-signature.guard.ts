import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { isString } from "class-validator";
import { Request } from "express";
import { Observable } from "rxjs";
import GithubService from "../services/github.service";

@Injectable()
export class GithubSignatureGuard implements CanActivate {
  constructor(private githubService: GithubService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const signature = req.headers['X-Hub-Signature-256'];
    if (!isString(signature)) {
      Logger.log("Webhook refused: No valid signature header found");
      return false;
    }

    const { body } = req;
    const secret = 'xx'; // TODO: add mongo integration
    return this.githubService.verifySignature(secret, signature, body);
  }
}