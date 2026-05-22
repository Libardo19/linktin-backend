-- CreateEnum
CREATE TYPE "EstadoOferta" AS ENUM ('activa', 'cerrada', 'pausada');

-- CreateEnum
CREATE TYPE "EstadoMatch" AS ENUM ('pendiente', 'aceptado', 'rechazado');

-- CreateTable
CREATE TABLE "ofertas" (
    "id_ofertas" SERIAL NOT NULL,
    "id_empresas" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" VARCHAR(150),
    "modalidad" VARCHAR(50) NOT NULL,
    "pago" DECIMAL(10,2),
    "estado" "EstadoOferta" NOT NULL DEFAULT 'activa',
    "fecha_publicacion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" DATE,

    CONSTRAINT "ofertas_pkey" PRIMARY KEY ("id_ofertas")
);

-- CreateTable
CREATE TABLE "habilidades_ofertas" (
    "id_habiOfertas" SERIAL NOT NULL,
    "id_ofertas" INTEGER NOT NULL,
    "id_habilidades" INTEGER NOT NULL,
    "nivelRequerido" VARCHAR(50) NOT NULL,
    "obligatoria" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "habilidades_ofertas_pkey" PRIMARY KEY ("id_habiOfertas")
);

-- CreateTable
CREATE TABLE "matches" (
    "id_match" SERIAL NOT NULL,
    "id_usuarios" VARCHAR(10) NOT NULL,
    "id_ofertas" INTEGER NOT NULL,
    "compatibilidad" DECIMAL(5,2) NOT NULL,
    "estadoUsuario" "EstadoMatch" NOT NULL DEFAULT 'pendiente',
    "estadoEmpresa" "EstadoMatch" NOT NULL DEFAULT 'pendiente',
    "fechaMatch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id_match")
);

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_ofertas_id_ofertas_id_habilidades_key" ON "habilidades_ofertas"("id_ofertas", "id_habilidades");

-- CreateIndex
CREATE UNIQUE INDEX "matches_id_usuarios_id_ofertas_key" ON "matches"("id_usuarios", "id_ofertas");

-- AddForeignKey
ALTER TABLE "ofertas" ADD CONSTRAINT "ofertas_id_empresas_fkey" FOREIGN KEY ("id_empresas") REFERENCES "perfil_empresas"("id_empresas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_ofertas" ADD CONSTRAINT "habilidades_ofertas_id_ofertas_fkey" FOREIGN KEY ("id_ofertas") REFERENCES "ofertas"("id_ofertas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_ofertas" ADD CONSTRAINT "habilidades_ofertas_id_habilidades_fkey" FOREIGN KEY ("id_habilidades") REFERENCES "habilidades"("id_habilidades") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_id_usuarios_fkey" FOREIGN KEY ("id_usuarios") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_id_ofertas_fkey" FOREIGN KEY ("id_ofertas") REFERENCES "ofertas"("id_ofertas") ON DELETE CASCADE ON UPDATE CASCADE;
