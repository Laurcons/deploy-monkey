import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GithubSignatureGuard } from "src/shared/guards/github-signature.guard";
import Service from "src/shared/models/service";

@Controller('webhook')
export default class WebhookController {

  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>
  ) { }

  @Post(':service/deploy')
  @UseGuards(GithubSignatureGuard)
  public deploy(@Param('service') serviceName: string) {
    const service = this.serviceModel.findOne({ name: serviceName });
    // service exists, as checked by the signature guard


  }
}