import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { GithubSignatureGuard } from "src/shared/guards/github-signature.guard";

@Controller()
export default class WebhookController {

  @Post(':service/deploy')
  @UseGuards(GithubSignatureGuard)
  public deploy(@Param('service') service: string) {

  }
}