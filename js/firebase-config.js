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
const storage = firebase.storage();

const auth =
    (typeof firebase.auth === "function")
        ? firebase.auth()
        : null;