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
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const updatedData = JSON.parse(event.body);
    const { id } = updatedData;

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'ID do usuário é obrigatório.' }) };
    }

    let users = readDatabase();
    
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return { statusCode: 404, body: JSON.stringify({ message: 'Usuário não encontrado.' }) };
    }

    // Atualiza apenas os campos fornecidos
    users[userIndex] = { ...users[userIndex], ...updatedData };

    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

    return {
        statusCode: 200,
        body: JSON.stringify(users[userIndex]),
    };

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
