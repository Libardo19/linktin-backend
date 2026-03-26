-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuarios" VARCHAR(10) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(15) NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "fecha_creacion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuarios")
);
