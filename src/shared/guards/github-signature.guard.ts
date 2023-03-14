import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isString } from "class-validator";
import { Request } from "express";
import { Model } from "mongoose";
import { Observable } from "rxjs";
import Service, { ServiceModel } from "../models/service";
import GithubService from "../services/github.service";

@Injectable()
export class GithubSignatureGuard implements CanActivate {
  constructor(
    private githubService: GithubService,
    @InjectModel(Service.name) private serviceModel: Model<Service>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const signature = req.headers['x-hub-signature-256'];
    if (!isString(signature)) {
      Logger.error("Webhook refused: No valid signature header found");
      return false;
    }

    if (!isString(req.params.service)) {
      Logger.error("Webhook refused: 'service' param not found in request URL");
      return false;
    }
    const service = await this.serviceModel.findOne({
      name: req.params.service,
    });
    if (!service) {
      Logger.error("Webhook refused: Service '" + req.params.service + "' not found");
      return false;
    }
    const { githubSecret } = service;

    const { rawBody } = req as any;
    const body = (rawBody as Buffer).toString('ascii');

    const sigValid = this.githubService.verifySignature(githubSecret, signature, body);
    if (!sigValid) {
      Logger.error("Webhook refused: Incorrect signature");
    }
    return sigValid;
  }
}