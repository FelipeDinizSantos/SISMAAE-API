// Utilitário responsável por criar o arquivo caso não exista; 
// e incrimentar os dados ao arquivo caso este já exista.

const fs = require("fs/promises");
const path = require("path");

async function ensureFileExists(tipoMaterial) {
  let filePath;

  if (tipoMaterial == "radar") filePath = path.resolve('src/data/disponibilidade_periodica_radares[mock].json');
  else if (tipoMaterial == "rbs70") filePath = path.resolve('src/data/disponibilidade_periodica_rbs70[mock].json');
  else throw new Error("Valor fornecido para tipo de material inválido. Tipos válidos: [radar; rbs70]");

  try {
    await fs.access(filePath);
  } catch (erro) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ historico: [] }, null, 2));
  }
  return filePath;
}

async function appendHistorico(entry, tipoMaterial) {
  const file = await ensureFileExists(tipoMaterial);

  const data = JSON.parse(await fs.readFile(file, 'utf-8'));
  data.historico.push(entry);

  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

module.exports = appendHistorico;