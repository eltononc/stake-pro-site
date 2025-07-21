import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

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
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id } = JSON.parse(event.body);

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'ID do usuário é obrigatório.' }) };
    }

    await deleteDoc(doc(db, "users", id));

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
