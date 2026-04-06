    const EmpresaModel = require("../models/empresa.model");

    const verificarPropietario = (empresa, usuarioToken) => {
    const esAdmin     = usuarioToken.tipo === "admin";
    const esPropietario = empresa.id_usuarios === usuarioToken.id;
        if (!esAdmin && !esPropietario) {
            throw { status: 403, message: "No tienes permiso para realizar esta acción" };
        }
    };

    const getAll = async () => {
        return EmpresaModel.findAll();
    };

    const getById = async (id_empresas) => {
    const empresa = await EmpresaModel.findById(id_empresas);
        if (!empresa) throw { status: 404, message: "Empresa no encontrada" };
            return empresa;
    };

    const getMiPerfil = async (id_usuarios) => {
    const empresa = await EmpresaModel.findByUsuario(id_usuarios);
        if (!empresa) throw { status: 404, message: "Aún no tienes un perfil de empresa" };
        return empresa;
    };

    const create = async (data, usuarioToken) => {
        if (usuarioToken.tipo !== "empresa") {
            throw { status: 403, message: "Solo las empresas pueden crear un perfil de empresa" };
    }
    const existe = await EmpresaModel.findByUsuario(usuarioToken.id);
        if (existe) throw { status: 409, message: "Ya tienes un perfil de empresa registrado" };

    return EmpresaModel.createEmpresa({
        id_usuarios: usuarioToken.id,
        ...data,
    });
    };

    const update = async (id_empresas, data, usuarioToken) => {
    const empresa = await EmpresaModel.findById(id_empresas);
        if (!empresa) throw { status: 404, message: "Empresa no encontrada" };
        verificarPropietario(empresa, usuarioToken);
        return EmpresaModel.updateEmpresa(id_empresas, data);
    };

    const remove = async (id_empresas, usuarioToken) => {
    const empresa = await EmpresaModel.findById(id_empresas);
        if (!empresa) throw { status: 404, message: "Empresa no encontrada" };
        verificarPropietario(empresa, usuarioToken);
        await EmpresaModel.deleteEmpresa(id_empresas);
    };

    module.exports = { getAll, getById, getMiPerfil, create, update, remove };