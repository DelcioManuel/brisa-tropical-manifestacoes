// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAx8i1gPWkxyZbcU_jbipWk8KdpVpylVBo",
    authDomain: "brisa-tropical.firebaseapp.com",
    projectId: "brisa-tropical",
    storageBucket: "brisa-tropical.firebasestorage.app",
    messagingSenderId: "171242626413",
    appId: "1:171242626413:web:9dfd7e4d296009819d8e64"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// 'auth' só existe realmente na página admin (SDK de Auth só lá está carregado),
// mas declaramos aqui para não rebentar o index.html.
const auth =
    (typeof firebase.auth === "function")
        ? firebase.auth()
        : null;

// Persistência de sessão do tipo "SESSION": o Diretor fica com sessão aberta enquanto
// o navegador estiver aberto, mas ao fechá-lo tem de voltar a fazer login.
if (auth) {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch((err) => {
        console.warn('Não foi possível definir a persistência de sessão:', err);
    });
}