-- AlterEnum
ALTER TYPE "TipoNotificacion" ADD VALUE 'nueva_oferta';

-- AlterTable
ALTER TABLE "mensajes" ADD COLUMN     "conversacionId" TEXT,
ALTER COLUMN "id_match" DROP NOT NULL;

-- CreateTable
CREATE TABLE "conversaciones" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConversacionToUsuario" (
    "A" TEXT NOT NULL,
    "B" VARCHAR(10) NOT NULL,

    CONSTRAINT "_ConversacionToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConversacionToUsuario_B_index" ON "_ConversacionToUsuario"("B");

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversacionToUsuario" ADD CONSTRAINT "_ConversacionToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversacionToUsuario" ADD CONSTRAINT "_ConversacionToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id_usuarios") ON DELETE CASCADE ON UPDATE CASCADE;
