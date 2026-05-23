const AuthService = require("../services/auth.service");

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/register
 * Body: { email, password, tipo, ...profileData }
 */
const register = async (req, res, next) => {
  try {
    const { email, password, tipo, ...profileData } = req.body;
    const result = await AuthService.register({ email, password, tipo, profileData });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Requiere JWT válido — devuelve el usuario actual
 */
const me = async (req, res) => {
  res.status(200).json({ success: true, data: req.usuario });
};

module.exports = { login, register, me };