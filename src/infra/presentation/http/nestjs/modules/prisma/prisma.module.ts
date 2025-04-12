import { PrismaService } from '@/infra/persistence/database/prisma/connection';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}