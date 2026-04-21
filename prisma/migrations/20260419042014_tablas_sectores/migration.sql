/*
  Warnings:

  - You are about to drop the column `sector` on the `perfil_empresas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_sector]` on the table `perfil_empresas` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "perfil_empresas" DROP COLUMN "sector",
ADD COLUMN     "id_sector" INTEGER;

-- CreateTable
CREATE TABLE "sectores" (
    "id_sector" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "sectores_pkey" PRIMARY KEY ("id_sector")
);

-- CreateIndex
CREATE UNIQUE INDEX "sectores_nombre_key" ON "sectores"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_empresas_id_sector_key" ON "perfil_empresas"("id_sector");

-- AddForeignKey
ALTER TABLE "perfil_empresas" ADD CONSTRAINT "perfil_empresas_id_sector_fkey" FOREIGN KEY ("id_sector") REFERENCES "sectores"("id_sector") ON DELETE SET NULL ON UPDATE CASCADE;
