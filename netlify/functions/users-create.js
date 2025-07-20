const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.resolve(__dirname, 'users-db.json');

// Função para ler o banco de dados de forma segura
const readDatabase = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      return []; // Retorna array vazio se o ficheiro não existir
    }
    const dbRaw = fs.readFileSync(dbPath, 'utf-8');
    // Retorna array vazio se o ficheiro estiver vazio, caso contrário, faz o parse
    return dbRaw.trim() === '' ? [] : JSON.parse(dbRaw);
  } catch (error) {
    console.error("Erro ao ler o banco de dados, a começar com um array vazio.", error);
    return [];
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const newUser = JSON.parse(event.body);

    if (!newUser.name || !newUser.email || !newUser.password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Nome, email e senha são obrigatórios.' }),
      };
    }

    const users = readDatabase();

    const userToSave = {
      id: crypto.randomUUID(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      avatar: newUser.avatar || null,
    };

    users.push(userToSave);

    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

    return {
      statusCode: 201, // Created
      body: JSON.stringify(userToSave),
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
