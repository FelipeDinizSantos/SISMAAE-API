// Utilitário responsável por criar o arquivo caso não exista e incrimentar os dados ao arquivo caso este já exista.

const fs = require("fs/promises");
const path = require("path");

const filePath = path.resolve('data/disponibilidade_periodica_radares[mock].json');

async function ensureFileExists() {
  try {
    await fs.access(filePath);
  } catch (erro) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ historico: [] }, null, 2));
  }
  return filePath;
}

async function appendHistorico (entry) {
  const file = await ensureFileExists();

  const data = JSON.parse(await fs.readFile(file, 'utf-8'));
  data.historico.push(entry);

  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

module.exports=appendHistorico;