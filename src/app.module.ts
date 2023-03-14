import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import WebhookController from './routes/webhook/webhook';
import { GithubSignatureGuard } from './shared/guards/github-signature.guard';
import Service, { ServiceSchema } from './shared/models/service';
import GithubService from './shared/services/github.service';
import RunnerService from './shared/services/runner.service';

@Module({
  providers: [
    GithubService,
    RunnerService,
    GithubSignatureGuard,
  ],
  controllers: [WebhookController],
  imports: [
    MongooseModule.forRoot(config.mongoUrl),
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema, collection: 'service' }
    ])
  ],
})
export class AppModule { }
