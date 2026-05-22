/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tipo` on the `usuarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('candidato', 'empresa', 'admin');

-- CreateEnum
CREATE TYPE "NivelCandidato" AS ENUM ('basico', 'intermedio', 'avanzado');

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoUsuario" NOT NULL;

-- CreateTable
CREATE TABLE "perfil_candidatos" (
    "id_candidato" VARCHAR(10) NOT NULL,
    "id_usuarios" VARCHAR(10) NOT NULL,
    "nombres" VARCHAR(20) NOT NULL,
    "apellidos" VARCHAR(20) NOT NULL,
    "fecha_nacimiento" DATE,
    "genero" VARCHAR(15),
    "biografia" TEXT,
    "foto_url" VARCHAR(255),
    "ubicacion" VARCHAR(100),
    "reputacion" DECIMAL(3,2),
    "portafolio_url" VARCHAR(255),
    "github_url" VARCHAR(255),
    "hoja_vida" VARCHAR(255),

    CONSTRAINT "perfil_candidatos_pkey" PRIMARY KEY ("id_candidato")
);

-- CreateTable
CREATE TABLE "experiencia_candidatos" (
    "id_experiencia" SERIAL NOT NULL,
    "id_candidato" VARCHAR(10) NOT NULL,
    "empresa" VARCHAR(100) NOT NULL,
    "cargo" VARCHAR(100) NOT NULL,
    "anio_inicio" INTEGER NOT NULL,
    "anio_fin" INTEGER,

    CONSTRAINT "experiencia_candidatos_pkey" PRIMARY KEY ("id_experiencia")
);

-- CreateTable
CREATE TABLE "educacion_candidatos" (
    "id_educacion" SERIAL NOT NULL,
    "id_candidato" VARCHAR(10) NOT NULL,
    "institucion" VARCHAR(150) NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "anio_inicio" INTEGER NOT NULL,
    "anio_fin" INTEGER,

    CONSTRAINT "educacion_candidatos_pkey" PRIMARY KEY ("id_educacion")
);

-- CreateTable
CREATE TABLE "habilidades" (
    "id_habilidades" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "categoria" VARCHAR(100),

    CONSTRAINT "habilidades_pkey" PRIMARY KEY ("id_habilidades")
);

-- CreateTable
CREATE TABLE "habilidades_empleado" (
    "id_habiEmpleados" SERIAL NOT NULL,
    "id_candidato" VARCHAR(10) NOT NULL,
    "id_habilidades" INTEGER NOT NULL,
    "nivel" "NivelCandidato" NOT NULL,

    CONSTRAINT "habilidades_empleado_pkey" PRIMARY KEY ("id_habiEmpleados")
);

-- CreateTable
CREATE TABLE "perfil_empresas" (
    "id_empresas" SERIAL NOT NULL,
    "id_usuarios" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "logo_url" VARCHAR(255),
    "sector" VARCHAR(100),
    "ubicacion" VARCHAR(100),
    "website" VARCHAR(255),

    CONSTRAINT "perfil_empresas_pkey" PRIMARY KEY ("id_empresas")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfil_candidatos_id_usuarios_key" ON "perfil_candidatos"("id_usuarios");

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_nombre_key" ON "habilidades"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_empleado_id_candidato_id_habilidades_key" ON "habilidades_empleado"("id_candidato", "id_habilidades");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_empresas_id_usuarios_key" ON "perfil_empresas"("id_usuarios");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "perfil_candidatos" ADD CONSTRAINT "perfil_candidatos_id_usuarios_fkey" FOREIGN KEY ("id_usuarios") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencia_candidatos" ADD CONSTRAINT "experiencia_candidatos_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "perfil_candidatos"("id_candidato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educacion_candidatos" ADD CONSTRAINT "educacion_candidatos_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "perfil_candidatos"("id_candidato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_empleado" ADD CONSTRAINT "habilidades_empleado_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "perfil_candidatos"("id_candidato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_empleado" ADD CONSTRAINT "habilidades_empleado_id_habilidades_fkey" FOREIGN KEY ("id_habilidades") REFERENCES "habilidades"("id_habilidades") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_empresas" ADD CONSTRAINT "perfil_empresas_id_usuarios_fkey" FOREIGN KEY ("id_usuarios") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;
