import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
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

  @Post(':service/deploy')
  @UseGuards(GithubSignatureGuard)
  public async deploy(@Param('service') serviceName: string) {
    const service = await this.serviceModel.findOne({ name: serviceName });
    // service exists, as checked by the signature guard

    // check conditions
    try {
      await this.runnerService.runConditions(service.conditions);
    } catch (err) {
      return {
        ran: false,
        reason: 'one run condition returned nonzero exit code',
        data: err,
      };
    }

    const outs = service.commands ?
      await this.runnerService.runCommands(service.commands) :
      [];

    return {
      ran: true,
      outs
    };
  }
}