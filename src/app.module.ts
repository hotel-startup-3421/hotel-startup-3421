import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import databaseConfig from "./config/database.config";
import jwtConfig from "./config/jwt.config";
import appConfig from "./config/app.config";
import storageConfig from "./config/storage.config";
import { MailModule } from "./modules/mail/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, storageConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow<TypeOrmModuleOptions>("database"),
    }),
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}