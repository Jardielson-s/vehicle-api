import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contexts } from './modules/contexts.module';
import { InfraModule } from './infra/infra.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/vehicles-database',
    ),
    InfraModule,
    Contexts,
  ],
})
export class AppModule {}
