import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

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
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { id, ...updateData } = data;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'ID do usuário é obrigatório.' }) };
    }

    const userRef = doc(db, "users", id);

    // Atualiza o documento
    await updateDoc(userRef, updateData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Usuário atualizado com sucesso.' }),
    };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
