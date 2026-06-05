const supabase = require("./supabase.config");

const BUCKETS = [
  {
    name: "fotos-perfil",
    options: { public: true, fileSizeLimit: 2 * 1024 * 1024, allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] },
  },
  {
    name: "logos-empresas",
    options: { public: true, fileSizeLimit: 2 * 1024 * 1024, allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] },
  },
  {
    name: "hojas-vida",
    options: { public: false, fileSizeLimit: 5 * 1024 * 1024, allowedMimeTypes: ["application/pdf"] },
  },
];

const initBuckets = async () => {
  for (const { name, options } of BUCKETS) {
    const { data: existing, error: listError } = await supabase.storage.getBucket(name);
    if (listError) {
      const { error } = await supabase.storage.createBucket(name, options);
      if (error) {
        console.error(`[Storage] Error al crear bucket "${name}":`, error.message);
      } else {
        console.log(`[Storage] Bucket "${name}" creado correctamente`);
      }
    } else {
      console.log(`[Storage] Bucket "${name}" ya existe`);
    }
  }
};

module.exports = initBuckets;
