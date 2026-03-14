import { Module, Global } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { MailService } from "./mail.service";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>("MAIL_HOST"),
          port: config.get<number>("MAIL_PORT"),
          secure: config.get<boolean>("MAIL_SECURE"),
          auth: {
            user: config.get<string>("MAIL_USER"),
            pass: config.get<string>("MAIL_PASSWORD"),
          },
        },
        defaults: {
          from: config.get<string>("MAIL_FROM"),
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}