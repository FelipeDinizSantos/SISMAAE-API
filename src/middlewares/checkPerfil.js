const checkPerfil = (perfisPermitidos) => {
  return (req, res, next) => {
    const { perfilId } = req.usuario;

    if (!perfisPermitidos.includes(perfilId)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil' });
    }

    next();
  };
};

module.exports = checkPerfil;