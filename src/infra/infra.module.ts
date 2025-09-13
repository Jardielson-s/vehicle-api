import { Module } from '@nestjs/common';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [AwsModule],
  exports: [AwsModule],
})
export class InfraModule {}
