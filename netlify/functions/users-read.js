const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'users-db.json');

exports.handler = async (event, context) => {
  try {
    // Verifica se o ficheiro de banco de dados existe
    if (!fs.existsSync(dbPath)) {   
      // Se não existir, retorna uma lista vazia
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    const dbRaw = fs.readFileSync(dbPath, 'utf-8');

    // Se o ficheiro estiver vazio, retorna uma lista vazia
    if (dbRaw.trim() === '') {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    const users = JSON.parse(dbRaw);
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno ao ler o banco de dados.' }),
    };
  }
};
