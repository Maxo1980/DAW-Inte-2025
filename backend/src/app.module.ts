import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import { EncuestasModule } from './modules/encuestas/ecuestas.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    EncuestasModule,
    ConfigModule.forRoot({
      load:[configuration],
      isGlobal:true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:(configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        synchronize:false,
        autoLoadEntities: true,
        logging: configService.get('database.logging'),
        logger: configService.get('database.logger'),

      }),
      
    }),  

  ],
})
export class AppModule {}
