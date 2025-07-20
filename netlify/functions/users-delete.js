const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'users-db.json');

const readDatabase = () => {
  try {
    if (!fs.existsSync(dbPath)) return [];
    const dbRaw = fs.readFileSync(dbPath, 'utf-8');
    return dbRaw.trim() === '' ? [] : JSON.parse(dbRaw);
  } catch (error) {
    return [];
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id } = JSON.parse(event.body);

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'ID do usuário é obrigatório.' }) };
    }

    let users = readDatabase();
    
    const initialLength = users.length;
    users = users.filter(u => u.id !== id);

    if (users.length === initialLength) {
        return { statusCode: 404, body: JSON.stringify({ message: 'Usuário não encontrado para deletar.' }) };
    }

    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Usuário deletado com sucesso.' }),
    };

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
