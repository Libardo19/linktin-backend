const supabase = require("../config/supabase.config");
const crypto = require("crypto");

const BUCKETS = {
  FOTO: "fotos-perfil",
  LOGO: "logos-empresas",
  CV: "hojas-vida",
};

const PUBLIC_BUCKETS = ["fotos-perfil", "logos-empresas"];

const MIME_TYPES = {
  foto: ["image/jpeg", "image/png", "image/webp"],
  logo: ["image/jpeg", "image/png", "image/webp"],
  cv: ["application/pdf"],
};

const MAX_SIZES = {
  foto: 2 * 1024 * 1024,
  logo: 2 * 1024 * 1024,
  cv: 5 * 1024 * 1024,
};

const validateFile = (tipo, mimetype, size) => {
  if (!MIME_TYPES[tipo])
    throw { status: 400, message: `Tipo de archivo no válido: ${tipo}` };
  if (!MIME_TYPES[tipo].includes(mimetype))
    throw { status: 400, message: `Formato no permitido para ${tipo}. Permitidos: ${MIME_TYPES[tipo].join(", ")}` };
  if (size > MAX_SIZES[tipo])
    throw { status: 400, message: `El archivo excede el tamaño máximo de ${MAX_SIZES[tipo] / 1024 / 1024}MB` };
};

const uploadFile = async (tipo, file, userId) => {
  validateFile(tipo, file.mimetype, file.size);

  const bucket = BUCKETS[tipo];
  const ext = file.originalname.split(".").pop();
  const uniqueName = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(uniqueName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw { status: 500, message: `Error al subir archivo: ${error.message}` };

  if (PUBLIC_BUCKETS.includes(bucket)) {
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    return { path: data.path, url: urlData.publicUrl };
  }

  return { path: data.path, url: null };
};

const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw { status: 500, message: `Error al eliminar archivo: ${error.message}` };
};

const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw { status: 500, message: `Error al generar URL firmada: ${error.message}` };

  return data.signedUrl;
};

module.exports = { uploadFile, deleteFile, getSignedUrl, BUCKETS };
