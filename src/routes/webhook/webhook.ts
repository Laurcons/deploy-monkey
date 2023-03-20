import { Body, Controller, Param, Post, Res, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Response } from "express";
import { Model } from "mongoose";
import { GithubSignatureGuard } from "src/shared/guards/github-signature.guard";
import Service from "src/shared/models/service";
import RunnerService from "src/shared/services/runner.service";

@Controller('webhook')
export default class WebhookController {

  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    private runnerService: RunnerService,
  ) { }

  @Post(':service/manual')
  @UseGuards(GithubSignatureGuard)
  public async deploy(@Res({ passthrough: true }) res: Response, @Param('service') serviceName: string, @Body() body: any) {
    const service = await this.serviceModel.findOne({ name: serviceName });
    // service exists, as checked by the signature guard

    // check payload conditions
    for (const { key, value } of service.payloadConditions) {
      if (body[key] !== value) {
        return {
          ran: false,
          reason: 'one payload condition failed',
          data: { key },
        };
      }
    }

    // check env conditions
    try {
      await this.runnerService.runConditions(service.envConditions);
    } catch (err) {
      return {
        ran: false,
        reason: 'one env condition returned nonzero exit code',
        data: err,
      };
    }

    const outs = service.commands ?
      await this.runnerService.runCommands(service.commands) :
      [];

    const ran = outs.every(out => !out.exitCode);
    if (!ran) res.status(503);

    return {
      ran,
      outs
    };
  }
}