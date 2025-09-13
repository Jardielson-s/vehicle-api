import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contexts } from './modules/contexts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/vehicles-database',
    ),
    Contexts,
  ],
})
export class AppModule {}
