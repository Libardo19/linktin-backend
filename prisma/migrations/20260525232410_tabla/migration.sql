-- CreateEnum
CREATE TYPE "TipoEntidadReporte" AS ENUM ('usuario', 'oferta', 'resena');

-- CreateEnum
CREATE TYPE "MotivoReporte" AS ENUM ('abuso', 'acoso', 'spam', 'contenido_inapropiado', 'lenguaje_ofensivo', 'oferta_falsa', 'informacion_incorrecta', 'suplantacion', 'otro');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('pendiente', 'en_revision', 'resuelto', 'descartado');

-- CreateTable
CREATE TABLE "reportes" (
    "id_reporte" SERIAL NOT NULL,
    "id_reportante" VARCHAR(10) NOT NULL,
    "tipo_entidad" "TipoEntidadReporte" NOT NULL,
    "motivo" "MotivoReporte" NOT NULL,
    "comentario" TEXT,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'pendiente',
    "nota_admin" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario_reportado" VARCHAR(10),
    "id_oferta_reportada" INTEGER,
    "id_resena_reportada" INTEGER,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id_reporte")
);

-- CreateIndex
CREATE INDEX "reportes_estado_fecha_creacion_idx" ON "reportes"("estado", "fecha_creacion");

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_id_reportante_fkey" FOREIGN KEY ("id_reportante") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_id_usuario_reportado_fkey" FOREIGN KEY ("id_usuario_reportado") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_id_oferta_reportada_fkey" FOREIGN KEY ("id_oferta_reportada") REFERENCES "ofertas"("id_ofertas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_id_resena_reportada_fkey" FOREIGN KEY ("id_resena_reportada") REFERENCES "resenas"("id_resena") ON DELETE CASCADE ON UPDATE CASCADE;
