-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('nuevo_match', 'match_aceptado', 'match_rechazado', 'match_retirado', 'oferta_cerrada', 'resena_recibida', 'mensaje_recibido');

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "cv_url" VARCHAR(255);

-- CreateTable
CREATE TABLE "mensajes" (
    "id_mensajes" SERIAL NOT NULL,
    "id_match" INTEGER NOT NULL,
    "id_usuario" VARCHAR(10) NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id_mensajes")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notificaciones" SERIAL NOT NULL,
    "id_usuario" VARCHAR(10) NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "payload" JSONB NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notificaciones")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id_resena" SERIAL NOT NULL,
    "id_enviado" VARCHAR(10) NOT NULL,
    "id_recibido" VARCHAR(10) NOT NULL,
    "id_match" INTEGER NOT NULL,
    "raiting" DECIMAL(2,1) NOT NULL,
    "comentario" TEXT,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id_resena")
);

-- CreateIndex
CREATE INDEX "mensajes_id_match_fecha_envio_idx" ON "mensajes"("id_match", "fecha_envio");

-- CreateIndex
CREATE INDEX "notificaciones_id_usuario_leido_idx" ON "notificaciones"("id_usuario", "leido");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_id_enviado_id_match_key" ON "resenas"("id_enviado", "id_match");

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_id_match_fkey" FOREIGN KEY ("id_match") REFERENCES "matches"("id_match") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_id_enviado_fkey" FOREIGN KEY ("id_enviado") REFERENCES "usuarios"("id_usuarios") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_id_recibido_fkey" FOREIGN KEY ("id_recibido") REFERENCES "usuarios"("id_usuarios") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_id_match_fkey" FOREIGN KEY ("id_match") REFERENCES "matches"("id_match") ON DELETE RESTRICT ON UPDATE CASCADE;
