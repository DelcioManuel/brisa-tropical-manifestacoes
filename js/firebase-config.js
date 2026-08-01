// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================
// Substitui os valores abaixo pelos dados do TEU projeto Firebase.
// Encontras estes valores em: Firebase Console > Definições do Projeto > As tuas apps > SDK setup
//
// Estas chaves são seguras para colocar no código público do site (não são secretas) —
// a segurança real dos dados é feita através das "Security Rules" do Firestore e do Storage
// (ver firestore.rules, storage.rules e o guia DEPLOY.md).

const firebaseConfig = {
    apiKey: "SUBSTITUIR_AQUI",
    authDomain: "SUBSTITUIR_AQUI.firebaseapp.com",
    projectId: "SUBSTITUIR_AQUI",
    storageBucket: "SUBSTITUIR_AQUI.appspot.com",
    messagingSenderId: "SUBSTITUIR_AQUI",
    appId: "SUBSTITUIR_AQUI"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
// 'auth' só existe realmente na página admin (SDK de Auth só lá está carregado),
// mas declaramos aqui para não rebentar o index.html.
const auth = (typeof firebase.auth === 'function') ? firebase.auth() : null;
