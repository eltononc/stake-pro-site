import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

    // Adiciona um novo documento com um ID gerado automaticamente
    const docRef = await addDoc(collection(db, "users"), {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password, // Nota: Em uma aplicação real, a senha deve ser criptografada.
      avatar: newUser.avatar || null,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ id: docRef.id, ...newUser }),
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
