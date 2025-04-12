/*
  Warnings:

  - You are about to alter the column `valor` on the `boletos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "boletos" ALTER COLUMN "valor" SET DATA TYPE DOUBLE PRECISION;
