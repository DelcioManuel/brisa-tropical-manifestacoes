# Guia de Configuração — Brisa Tropical Digital

## 1. Criar o projeto Firebase (2 min)
1. Vai a https://console.firebase.google.com
2. **Adicionar projeto** → dá um nome, ex. `brisa-tropical` → podes desativar o Google Analytics (não é necessário) → **Criar projeto**.

## 2. Ativar a base de dados — Firestore (2 min)
1. Menu esquerdo: **Compilação → Firestore Database → Criar base de dados**
2. Escolhe **modo produção**
3. Escolhe a região mais próxima (ex. `eur3` se estiveres na Europa/África)
4. Depois de criada, vai ao separador **Regras** → apaga o conteúdo → cola o conteúdo do ficheiro `firestore.rules` (incluído neste pacote) → **Publicar**

## 3. Ativar o armazenamento de fotos — Storage (2 min)
1. Menu esquerdo: **Compilação → Storage → Começar**
2. Aceita o modo produção → escolhe a mesma região do passo anterior
3. Separador **Regras** → apaga o conteúdo → cola o conteúdo do ficheiro `storage.rules` (incluído) → **Publicar**

> Nota: o Storage do Firebase tem um plano gratuito (Spark) com limite de armazenamento e transferência. Para um hotel com volume normal de manifestações isto costuma ser suficiente; se um dia precisares de mais, o plano Blaze é "paga o que usares" (bastante barato para este uso).

## 4. Ativar o login do Diretor — Authentication (3 min)
1. Menu esquerdo: **Compilação → Authentication → Começar**
2. Aba **Sign-in method** → ativa **Email/Password**
3. Aba **Users** → **Adicionar utilizador** → introduz o email e a password que o Diretor vai usar para entrar no `admin.html`
   - Podes repetir este passo para adicionar mais administradores (ex. gerente adjunto) mais tarde

## 5. Ligar o site ao teu projeto Firebase (2 min)
1. No canto superior esquerdo, clica no ícone de engrenagem → **Definições do projeto**
2. Em baixo, na secção **As tuas apps**, clica no ícone `</>`  (Web)
3. Dá um nome à app (ex. "Site Brisa Tropical") → **Registar app**
4. Vais ver um bloco `firebaseConfig` com vários valores (`apiKey`, `authDomain`, etc.) — copia-os
5. Abre o ficheiro `js/firebase-config.js` deste pacote e substitui os valores `SUBSTITUIR_AQUI` pelos valores que copiaste
6. Guarda o ficheiro

## 6. Colocar online — Netlify (2 min)
1. https://app.netlify.com → **Add new site → Deploy manually**
2. Arrasta a pasta inteira do projeto (com `index.html`, `admin.html`, `js/`, `assets/`) para a zona de upload
3. Pronto — recebes um link tipo `https://brisa-tropical.netlify.app`
4. (Opcional) Em **Site settings → Domain management** podes associar o teu próprio domínio

## 7. Testar tudo
- Abre o link público → envia uma manifestação de teste com uma foto anexada
- Abre `/admin.html` → entra com o email/password do Diretor (passo 4)
- A mensagem deve aparecer no painel em tempo real, já traduzida, com a miniatura da foto — clica na foto para a ver ampliada
- Os gráficos e o botão **Exportar Relatório PDF** devem refletir os dados reais
- Se a tradução automática falhar nalguma mensagem, aparece o botão **"Traduzir"** ao lado dela para tentar de novo

## Notas importantes
- As chaves em `firebase-config.js` não são secretas — a proteção real vem das regras do Firestore e do Storage (passos 2 e 3)
- Os logótipos já estão na pasta `assets/` com os nomes corretos — não precisas de mexer neles
- Se um dia quiseres trocar a password do Diretor, faz isso em **Authentication → Users** no Firebase Console (não precisas de tocar no código)
