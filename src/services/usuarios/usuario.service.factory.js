const { PERFIS } = require("../../constants");

const colService = require("./col.service");
const mecanicoService = require("./mecanico.service");
const s4Service = require("./s4.service");
const adminService = require("./admin.service");
const comandoService = require("./comando.service");

module.exports = function usuarioServiceFactory(perfilId) {
    switch (perfilId) {
        case PERFIS.S4: return s4Service;
        case PERFIS.COL: return colService;
        case PERFIS.MECANICO: return mecanicoService;
        case PERFIS.ADMIN: return adminService;
        case PERFIS.COMANDO: return comandoService;
        default: throw new Error("Perfil não encontrado!");
    }
}