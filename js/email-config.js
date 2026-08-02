// ==========================================
// CONFIGURAÇÃO DO EMAILJS (Notificações por Email)
// ==========================================
// Serve para o Diretor receber um email sempre que um hóspede envia uma nova manifestação.
// Cria uma conta grátis em https://www.emailjs.com e segue os passos no DEPLOY.md
// para obteres estes 4 valores.

const EMAILJS_PUBLIC_KEY = "h3HQAKLTDeJpGKpko";
const EMAILJS_SERVICE_ID = "service_lyj2kl5";
const EMAILJS_TEMPLATE_ID = "template_1cn47ci";
const DIRECTOR_EMAIL = "delciomanuelsilva12@gmail.com"; // email que vai receber as notificações

const NOTIFICACOES_ATIVAS = EMAILJS_PUBLIC_KEY !== "SUBSTITUIR_AQUI";

if (typeof emailjs !== 'undefined' && NOTIFICACOES_ATIVAS) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}