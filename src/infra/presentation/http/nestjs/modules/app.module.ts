import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RepositoryModule } from './repositories/repository.module';
import { AdaptersModule } from './adapters/adapters.module';
import { UseCasesModule } from './use-cases/use-cases.module';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RepositoryModule,
    AdaptersModule,
    UseCasesModule,
    ControllersModule,
  ],
})
export class AppModule {}