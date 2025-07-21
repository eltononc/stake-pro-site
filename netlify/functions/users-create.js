const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.resolve(__dirname, 'users-db.json');

// Função segura para ler o banco de dados
const readDatabase = () => {
  try {
    // Se o ficheiro não existir, retorna uma lista vazia
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const dbRaw = fs.readFileSync(dbPath, 'utf-8');
    // Se o ficheiro estiver vazio, retorna uma lista vazia, caso contrário, faz o parse
    return dbRaw.trim() === '' ? [] : JSON.parse(dbRaw);
  } catch (error) {
    // Se houver um erro de parsing, não quebra a aplicação
    console.error("Erro ao ler o banco de dados, a começar com um array vazio.", error);
    return [];
  }
};

exports.handler = async (event, context) => {
  // Permite apenas requisições do tipo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: 'Apenas o método POST é permitido' }),
    };
  }

  try {
    const newUser = JSON.parse(event.body);

    // Validação dos dados recebidos
    if (!newUser.name || !newUser.email || !newUser.password) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ message: 'Nome, email e senha são obrigatórios.' }),
      };
    }

    const users = readDatabase();

    // Cria o novo objeto de usuário para garantir a estrutura correta
    const userToSave = {
      id: crypto.randomUUID(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password, // Nota: Em uma aplicação real, a senha deve ser criptografada aqui.
      avatar: newUser.avatar || null,
    };

    users.push(userToSave);

    // Escreve a lista atualizada de volta no ficheiro
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

    // Retorna sucesso com o usuário criado
    return {
      statusCode: 201, // Created
      body: JSON.stringify(userToSave),
    };

  } catch (error) {
    // Captura qualquer erro inesperado durante o processo
    console.error('Erro ao criar usuário:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor ao criar o usuário.' }),
    };
  }
};
