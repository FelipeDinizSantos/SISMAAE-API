// Relação dos perfis de acesso com seus respectivo ID's no banco de dados. 
const PERFIS = {
    ADMIN: 1,
    COMANDO: 2,
    COL: 3,
    S4: 4,
    MECANICO: 5,
}

// Nomes dos campos editaveis devem espelhar os do banco.
const CAMPOS_EDITAVEIS_MATERIAIS = {
    [PERFIS.S4]: ["obs"],       
    [PERFIS.COL]: ["status", "loc_id", "obs"],     
    [PERFIS.MECANICO]: ["status", "obs"],         
    [PERFIS.COMANDO]: [],             
    [PERFIS.ADMIN]: [],    
};

const CAMPOS_EDITAVEIS_MODULOS = {
    [PERFIS.S4]: ["status", "obs", "cabideSN"],       
    [PERFIS.COL]: ["status", "loc_id", "obs"],     
    [PERFIS.MECANICO]: ["status", "obs"],         
    [PERFIS.COMANDO]: [],             
    [PERFIS.ADMIN]: [],    
};

module.exports = { PERFIS, CAMPOS_EDITAVEIS_MATERIAIS, CAMPOS_EDITAVEIS_MODULOS };