const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env.config");
const AuthModel = require("../models/auth.model");

// ─── Helpers ──────────────────────────────────────────
const generateToken = (payload) =>
  jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

const buildPayload = (usuario) => ({
  id:    usuario.id_usuarios,
  email: usuario.email,
  tipo:  usuario.tipo,
});

// ─── Login ────────────────────────────────────────────

const login = async ({ email, password }) => {

  // 1. Verificar que el usuario exista
  const usuario = await AuthModel.findByEmail(email);
  if (!usuario) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  // 2. Verificar que la cuenta esté activa
  if (!usuario.activo) {
    throw { status: 403, message: "Cuenta suspendida" };
  }

  // 3. Comparar password con el hash almacenado
  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  // 4. Generar JWT
  const token = generateToken(buildPayload(usuario));

  return {
    token,
    usuario: {
      id:    usuario.id_usuarios,
      email: usuario.email,
      tipo:  usuario.tipo,
    },
  };
};

// ─── Register ─────────────────────────────────────────

const register = async ({ id_usuarios, email, password, tipo }) => {

  // 1. Verificar que el email no esté en uso
  const existe = await AuthModel.findByEmail(email);
  if (existe) {
    throw { status: 409, message: "El email ya está registrado" };
  }

  // 2. Hashear la password
  const hash = await bcrypt.hash(password, 10);

  // 3. Crear el usuario
  const usuario = await AuthModel.createUsuario({
    id_usuarios,
    email,
    password: hash,
    tipo,
  });

  // 4. Generar JWT inmediatamente (login automático tras registro)
  const token = generateToken(buildPayload(usuario));

  return { token, usuario };
};

module.exports = { login, register };