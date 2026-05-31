const StorageService = require("../services/storage.service");
const CandidatoModel = require("../models/candidato.model");
const EmpresaModel = require("../models/empresa.model");
const prisma = require("../config/db.config");

const uploadFile = async (req, res, next) => {
  try {
    const { tipo } = req.params;
    const tiposValidos = ["foto", "logo", "cv"];
    if (!tiposValidos.includes(tipo))
      return res.status(400).json({ success: false, message: `Tipo no válido: ${tipo}` });

    if (!req.file)
      return res.status(400).json({ success: false, message: "No se envió ningún archivo" });

    const { path, url } = await StorageService.uploadFile(tipo, req.file, req.usuario.id);

    if (tipo === "foto") {
      const perfil = await CandidatoModel.findByUsuarioId(req.usuario.id);
      if (perfil?.foto_url) {
        await StorageService.deleteFile("fotos-perfil", perfil.foto_url.replace(`${process.env.SUPABASE_URL}/storage/v1/object/public/fotos-perfil/`, ""));
      }
      await CandidatoModel.update(req.usuario.id, { foto_url: url });
    }

    if (tipo === "logo") {
      const perfil = await EmpresaModel.findByUsuarioId(req.usuario.id);
      if (perfil?.logo_url) {
        await StorageService.deleteFile("logos-empresas", perfil.logo_url.replace(`${process.env.SUPABASE_URL}/storage/v1/object/public/logos-empresas/`, ""));
      }
      await EmpresaModel.updateEmpresa(perfil.id_empresas, { logo_url: url });
    }

    if (tipo === "cv") {
      const perfil = await CandidatoModel.findByUsuarioId(req.usuario.id);
      if (perfil?.hoja_vida) {
        await StorageService.deleteFile("hojas-vida", perfil.hoja_vida);
      }
      await CandidatoModel.update(req.usuario.id, { hoja_vida: path });
    }

    res.status(200).json({ success: true, data: { path, url } });
  } catch (err) { next(err); }
};

const deleteFile = async (req, res, next) => {
  try {
    const { tipo } = req.params;
    const tiposValidos = ["foto", "logo", "cv"];
    if (!tiposValidos.includes(tipo))
      return res.status(400).json({ success: false, message: `Tipo no válido: ${tipo}` });

    if (tipo === "foto") {
      const perfil = await CandidatoModel.findByUsuarioId(req.usuario.id);
      if (perfil?.foto_url) {
        const path = perfil.foto_url.replace(`${process.env.SUPABASE_URL}/storage/v1/object/public/fotos-perfil/`, "");
        await StorageService.deleteFile("fotos-perfil", path);
      }
      await CandidatoModel.update(req.usuario.id, { foto_url: null });
    }

    if (tipo === "logo") {
      const perfil = await EmpresaModel.findByUsuarioId(req.usuario.id);
      if (perfil?.logo_url) {
        const path = perfil.logo_url.replace(`${process.env.SUPABASE_URL}/storage/v1/object/public/logos-empresas/`, "");
        await StorageService.deleteFile("logos-empresas", path);
      }
      await EmpresaModel.updateEmpresa(perfil.id_empresas, { logo_url: null });
    }

    if (tipo === "cv") {
      const perfil = await CandidatoModel.findByUsuarioId(req.usuario.id);
      if (perfil?.hoja_vida) {
        await StorageService.deleteFile("hojas-vida", perfil.hoja_vida);
      }
      await CandidatoModel.update(req.usuario.id, { hoja_vida: null });
    }

    res.status(200).json({ success: true, message: "Archivo eliminado correctamente" });
  } catch (err) { next(err); }
};

const downloadCv = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const solicitante = req.usuario;

    const perfil = await CandidatoModel.findByUsuarioId(userId);
    if (!perfil || !perfil.hoja_vida)
      return res.status(404).json({ success: false, message: "CV no encontrado" });

    if (solicitante.id !== userId && solicitante.tipo !== "admin") {
      const empresa = await EmpresaModel.findByUsuarioId(solicitante.id);
      if (!empresa)
        return res.status(403).json({ success: false, message: "No tienes permiso para ver este CV" });

      const match = await prisma.matches.findFirst({
        where: {
          id_usuarios: userId,
          id_ofertas: {
            in: (
              await prisma.ofertas.findMany({
                where: { id_empresas: empresa.id_empresas },
                select: { id_ofertas: true },
              })
            ).map(o => o.id_ofertas),
          },
          estadoEmpresa: { in: ["aceptado", "pendiente"] },
        },
      });

      if (!match)
        return res.status(403).json({ success: false, message: "No tienes permiso para ver este CV" });
    }

    const signedUrl = await StorageService.getSignedUrl("hojas-vida", perfil.hoja_vida, 3600);

    res.status(200).json({ success: true, data: { url: signedUrl } });
  } catch (err) { next(err); }
};

module.exports = { uploadFile, deleteFile, downloadCv };
