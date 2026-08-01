// ==========================================
// VARIAVEIS GLOBAIS DOS GRÁFICOS (Chart.js)
// ==========================================
let chartTiposInstancia = null;
let chartEstadosInstancia = null;

// Cópia local dos dados vindos do Firestore em tempo real (pesquisa/filtros/gráficos/PDF usam isto)
let cachedMessages = [];
let unsubscribeListener = null;

// ==========================================
// 1. DICIONÁRIO INTERNACIONAL TRILINGUE
// ==========================================
const i18n = {
    pt: {
        title: "Livro de Manifestações Digital",
        subtitle: "A sua opinião é totalmente anónima",
        typeLabel: "Tipo de Manifestação",
        rec: "Reclamação", sug: "Sugestão", elo: "Elogio",
        msgLabel: "A sua Mensagem",
        placeholder: "Por favor, descreva detalhadamente a sua experiência...",
        btnSend: "Enviar Manifestação",
        successTitle: "Enviado com sucesso!",
        successSub: "Agradecemos a sua partilha. Nenhuns dados pessoais ou digitais foram guardados.",
        adminLink: "Área Administrativa",
        restrito: "Acesso Restrito", adminTitle: "Direção Brisa Tropical",
        adminSub: "Introduza as suas credenciais para aceder ao painel estratégico.",
        emailLabel: "Email de Diretor",
        passLabel: "Palavra-passe de Diretor", loginBtn: "Entrar com Segurança",
        loginErr: "Credenciais incorretas ou sem privilégios.",
        navTitle: "Painel Executivo", logout: "Terminar Sessão",
        cardNew: "Novas Mensagens", cardRec: "Reclamações", cardSug: "Sugestões", cardElo: "Elogios",
        searchPlh: "Pesquisar conteúdo...", optAllTypes: "Todos os Tipos", optAllStatus: "Todos os Estados",
        btnPdf: "Exportar Relatório PDF", thType: "Tipo", thMsg: "Mensagem / Evidência", thDate: "Data / Hora",
        thStatus: "Estado", thActions: "Ações", empty: "Nenhuma mensagem encontrada.",
        btnDel: "Eliminar", confirmDel: "Tem a certeza que deseja eliminar permanentemente este registo?",
        btnRetranslate: "Traduzir", translating: "A traduzir...",
        pdfHeader: "HOTEL BRISA TROPICAL - RELATÓRIO EXECUTIVO DE MANIFESTAÇÕES",
        chartTitleType: "Distribuição por Tipo", chartTitleStatus: "Volume por Estado",
        fileLabel: "Anexar Evidência Visual (Opcional)",
        selectBtn: "Escolher Ficheiro...",
        fileNone: "Não foi escolhido nenhum ficheiro",
        connErr: "Erro de ligação à base de dados.", uploadErr: "Não foi possível enviar a foto, mas a mensagem foi enviada."
    },
    en: {
        title: "Digital Feedback Book",
        subtitle: "Your opinion is completely anonymous",
        typeLabel: "Feedback Type",
        rec: "Complaint", sug: "Suggestion", elo: "Compliment",
        msgLabel: "Your Message",
        placeholder: "Please describe your experience in detail...",
        btnSend: "Submit Feedback",
        successTitle: "Submitted successfully!",
        successSub: "Thank you for sharing. No personal data was stored.",
        adminLink: "Administrative Area",
        restrito: "Restricted Access", adminTitle: "Brisa Tropical Management",
        adminSub: "Enter your credentials to access the strategic dashboard.",
        emailLabel: "Director Email",
        passLabel: "Director Password", loginBtn: "Secure Login",
        loginErr: "Incorrect credentials or insufficient privileges.",
        navTitle: "Executive Dashboard", logout: "Logout",
        cardNew: "New Messages", cardRec: "Complaints", cardSug: "Suggestions", cardElo: "Compliments",
        searchPlh: "Search content...", optAllTypes: "All Types", optAllStatus: "All Statuses",
        btnPdf: "Export PDF Report", thType: "Type", thMsg: "Message / Evidence", thDate: "Date / Time",
        thStatus: "Status", thActions: "Actions", empty: "No messages found.",
        btnDel: "Delete", confirmDel: "Are you sure you want to permanently delete this record?",
        btnRetranslate: "Translate", translating: "Translating...",
        pdfHeader: "HOTEL BRISA TROPICAL - EXECUTIVE MANIFESTATION REPORT",
        chartTitleType: "Distribution by Type", chartTitleStatus: "Volume by Status",
        fileLabel: "Attach Visual Evidence (Optional)",
        selectBtn: "Select File...",
        fileNone: "No file chosen",
        connErr: "Database connection error.", uploadErr: "Could not upload the photo, but your message was sent."
    },
    zh: {
        title: "数字化意见簿",
        subtitle: "您的意见完全匿名",
        typeLabel: "反馈类型",
        rec: "投诉", sug: "建议", elo: "表扬",
        msgLabel: "您的留言",
        placeholder: "请详细描述您的体验...",
        btnSend: "提交反馈",
        successTitle: "提交成功！",
        successSub: "感谢您的分享。系统未保留任何个人或数字数据。",
        adminLink: "管理区域",
        restrito: "受限访问区域", adminTitle: "Brisa Tropical 管理层",
        adminSub: "请输入您的凭据以访问战略控制面板。",
        emailLabel: "主管邮箱",
        passLabel: "主管密码", loginBtn: "安全登录",
        loginErr: "凭据错误或权限不足。",
        navTitle: "行政控制台", logout: "退出登录",
        cardNew: "新消息", cardRec: "投诉总数", cardSug: "建议总数", cardElo: "表扬总数",
        searchPlh: "搜索内容...", optAllTypes: "所有类型", optAllStatus: "所有状态",
        btnPdf: "导出 PDF 报告", thType: "类型", thMsg: "消息内容 / 证据", thDate: "日期 / 时间",
        thStatus: "状态", thActions: "操作", empty: "未找到符合筛选条件的消息。",
        btnDel: "删除", confirmDel: "您确定要永久删除此记录吗？",
        btnRetranslate: "翻译", translating: "翻译中...",
        pdfHeader: "BRISA TROPICAL 酒店 - 数字化意见簿高管报告",
        chartTitleType: "按类型分布", chartTitleStatus: "按状态统计",
        fileLabel: "添加图片证据 (可选)",
        selectBtn: "选择文件...",
        fileNone: "未选择任何文件",
        connErr: "数据库连接错误。", uploadErr: "照片上传失败，但您的留言已成功提交。"
    }
};

let currentLang = localStorage.getItem('hotel_lang') || 'pt';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('hotel_lang', lang);
    applyTranslations();
    if (document.getElementById('adminDashboard') && !document.getElementById('adminDashboard').classList.contains('hidden')) {
        renderDashboard();
    }
}

function applyTranslations() {
    const t = i18n[currentLang];
    const elements = [
        {id: 'txt-title', prop: 'innerText', key: 'title'},
        {id: 'txt-subtitle', prop: 'innerText', key: 'subtitle'},
        {id: 'txt-typeLabel', prop: 'innerText', key: 'typeLabel'},
        {id: 'txt-rec', prop: 'innerText', key: 'rec'},
        {id: 'txt-sug', prop: 'innerText', key: 'sug'},
        {id: 'txt-elo', prop: 'innerText', key: 'elo'},
        {id: 'txt-msgLabel', prop: 'innerText', key: 'msgLabel'},
        {id: 'message', prop: 'placeholder', key: 'placeholder'},
        {id: 'txt-btnSend', prop: 'innerText', key: 'btnSend'},
        {id: 'txt-successTitle', prop: 'innerText', key: 'successTitle'},
        {id: 'txt-successSub', prop: 'innerText', key: 'successSub'},
        {id: 'txt-adminLink', prop: 'innerText', key: 'adminLink'},
        {id: 'txt-restrito', prop: 'innerText', key: 'restrito'},
        {id: 'txt-adminTitle', prop: 'innerText', key: 'adminTitle'},
        {id: 'txt-adminSub', prop: 'innerText', key: 'adminSub'},
        {id: 'txt-emailLabel', prop: 'innerText', key: 'emailLabel'},
        {id: 'txt-passLabel', prop: 'innerText', key: 'passLabel'},
        {id: 'txt-loginBtn', prop: 'innerText', key: 'loginBtn'},
        {id: 'txt-loginError', prop: 'innerText', key: 'loginErr'},
        {id: 'txt-navTitle', prop: 'innerText', key: 'navTitle'},
        {id: 'txt-logout', prop: 'innerText', key: 'logout'},
        {id: 'txt-cardNew', prop: 'innerText', key: 'cardNew'},
        {id: 'txt-cardRec', prop: 'innerText', key: 'cardRec'},
        {id: 'txt-cardSug', prop: 'innerText', key: 'cardSug'},
        {id: 'txt-cardElo', prop: 'innerText', key: 'cardElo'},
        {id: 'txt-btnPdf', prop: 'innerText', key: 'btnPdf'},
        {id: 'txt-thType', prop: 'innerText', key: 'thType'},
        {id: 'txt-thMsg', prop: 'innerText', key: 'thMsg'},
        {id: 'txt-thDate', prop: 'innerText', key: 'thDate'},
        {id: 'txt-thStatus', prop: 'innerText', key: 'thStatus'},
        {id: 'txt-thActions', prop: 'innerText', key: 'thActions'},
        {id: 'emptyState', prop: 'innerText', key: 'empty'},
        {id: 'txt-fileLabel', prop: 'innerText', key: 'fileLabel'},
        {id: 'txt-selectBtn', prop: 'innerText', key: 'selectBtn'},
        {id: 'txt-fileStatus', prop: 'innerText', key: 'fileNone'}
    ];

    elements.forEach(el => {
        const target = document.getElementById(el.id);
        if (target && t[el.key]) target[el.prop] = t[el.key];
    });

    if (document.getElementById('searchBar')) document.getElementById('searchBar').placeholder = t.searchPlh;
}

// ==========================================
// 2. TRADUTOR MULTI-IDIOMA (Mandarim e Inglês)
// ==========================================
// Endpoint público não-oficial da Google — gratuito mas sem garantia de disponibilidade.
// Por isso existe o botão "Traduzir" no painel para tentar de novo manualmente se falhar.
async function API_Traduzir(texto, idiomaDestino) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${idiomaDestino}&dt=t&q=${encodeURIComponent(texto)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data[0]) {
            return data[0].map(x => x[0]).join('');
        }
        return null;
    } catch (e) {
        console.log(`Erro ao traduzir para ${idiomaDestino}.`);
        return null;
    }
}

// ==========================================
// 3. COMPRESSÃO DE IMAGEM (antes de subir ao Storage)
// ==========================================
// Reduz fotos grandes (tiradas por telemóvel) para no máx. ~1280px de largura,
// poupando dados móveis do hóspede e espaço no Firebase Storage.
function comprimirImagem(file, maxWidth = 1280, qualidade = 0.75) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxWidth) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Falha ao comprimir imagem')), 'image/jpeg', qualidade);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ==========================================
// 4. FORMULÁRIO DO CLIENTE (Firestore + Storage)
// ==========================================
const MANIFESTATIONS_COLLECTION = 'manifestations';

const clientForm = document.getElementById('manifestationForm');
if (clientForm) {
    clientForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const checkedRadio = document.querySelector('input[name="type"]:checked');
        if (!checkedRadio) return;
        const selectedType = checkedRadio.value;
        const messageText = document.getElementById('message').value;
        const fileInput = document.getElementById('fileInput');
        const t = i18n[currentLang];

        const btn = document.getElementById('txt-btnSend');
        const original = btn ? btn.innerText : "...";
        if (btn) { btn.innerText = "..."; btn.disabled = true; }

        // Traduz a mensagem para EN e ZH de imediato (se falhar, fica null e pode ser tentado depois no painel)
        const [traducaoZh, traducaoEn] = await Promise.all([
            API_Traduzir(messageText, 'zh'),
            API_Traduzir(messageText, 'en')
        ]);

        // Se houver foto, comprime e sobe para o Firebase Storage
        let photoURL = null;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            try {
                const blobComprimido = await comprimirImagem(fileInput.files[0]);
                const caminho = `evidencias/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
                const ref = storage.ref().child(caminho);
                await ref.put(blobComprimido, { contentType: 'image/jpeg' });
                photoURL = await ref.getDownloadURL();
            } catch (err) {
                console.error("Erro ao subir a foto:", err);
                alert(t.uploadErr);
            }
        }

        try {
            await db.collection(MANIFESTATIONS_COLLECTION).add({
                type: selectedType,
                message: messageText,
                message_zh: traducaoZh || null,
                message_en: traducaoEn || null,
                photoURL: photoURL,
                status: "Novo",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            clientForm.reset();
            if (typeof removerFotoPreview === "function") removerFotoPreview();
            if (typeof fn_styleRadios === "function") fn_styleRadios();

            const toast = document.getElementById('successToast');
            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 5000);
            }
        } catch (err) {
            console.error("Erro ao guardar manifestação:", err);
            alert(t.connErr);
        } finally {
            if (btn) { btn.innerText = original; btn.disabled = false; }
        }
    });
}

// ==========================================
// 5. LOGIN & SESSÃO (Firebase Authentication)
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('txt-loginBtn');
        const original = loginBtn.innerText;
        loginBtn.innerText = "...";
        const errorDiv = document.getElementById('loginError');

        auth.signInWithEmailAndPassword(email, password)
            .then(() => { if (errorDiv) errorDiv.classList.add('hidden'); })
            .catch((error) => {
                console.log(error.code);
                if (errorDiv) errorDiv.classList.remove('hidden');
            })
            .finally(() => { loginBtn.innerText = original; });
    });
}

if (auth) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            showDashboard();
        } else if (document.getElementById('adminDashboard')) {
            document.getElementById('loginSection').classList.remove('hidden');
            document.getElementById('adminDashboard').classList.add('hidden');
            if (unsubscribeListener) { unsubscribeListener(); unsubscribeListener = null; }
        }
    });
}

function showDashboard() {
    if (document.getElementById('loginSection')) document.getElementById('loginSection').classList.add('hidden');
    if (document.getElementById('adminDashboard')) document.getElementById('adminDashboard').classList.remove('hidden');
    listenToMessages();
}

function logout() {
    auth.signOut();
}

// ==========================================
// 6. LEITURA EM TEMPO REAL (qualquer dispositivo vê tudo)
// ==========================================
function listenToMessages() {
    if (unsubscribeListener) unsubscribeListener();
    unsubscribeListener = db.collection(MANIFESTATIONS_COLLECTION)
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            cachedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderDashboard();
        }, (error) => {
            console.error("Erro ao ler mensagens:", error);
            alert(i18n[currentLang].connErr);
        });
}

function formatTimestamp(ts) {
    if (!ts || !ts.toDate) return '—';
    const d = ts.toDate();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ==========================================
// 7. MOTOR DE RENDERIZAÇÃO DO PAINEL
// ==========================================
function renderDashboard() {
    const tbody = document.getElementById('messagesTableBody');
    if (!tbody) return;

    const t = i18n[currentLang];
    const searchQuery = document.getElementById('searchBar') ? document.getElementById('searchBar').value.toLowerCase() : "";
    const filterType = document.getElementById('filterType') ? document.getElementById('filterType').value : "Todos";
    const filterStatus = document.getElementById('filterStatus') ? document.getElementById('filterStatus').value : "Todos";

    document.getElementById('countNew').innerText = cachedMessages.filter(m => m.status === 'Novo').length;
    document.getElementById('countReclamacoes').innerText = cachedMessages.filter(m => m.type === 'Reclamação').length;
    document.getElementById('countSugestoes').innerText = cachedMessages.filter(m => m.type === 'Sugestão').length;
    document.getElementById('countElogios').innerText = cachedMessages.filter(m => m.type === 'Elogio').length;

    renderCharts(cachedMessages);

    tbody.innerHTML = '';

    const filteredData = cachedMessages.filter(item => {
        const msgMatch = (item.message || '').toLowerCase().includes(searchQuery) ||
                         (item.message_zh && item.message_zh.toLowerCase().includes(searchQuery)) ||
                         (item.message_en && item.message_en.toLowerCase().includes(searchQuery));
        return msgMatch &&
               (filterType === 'Todos' || item.type === filterType) &&
               (filterStatus === 'Todos' || item.status === filterStatus);
    });

    const emptyState = document.getElementById('emptyState');
    if (filteredData.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    } else {
        if (emptyState) emptyState.classList.add('hidden');
    }

    filteredData.forEach(item => {
        let typeBadge = '';
        let localLabel = item.type === 'Reclamação' ? t.rec : (item.type === 'Sugestão' ? t.sug : t.elo);

        let mensagemExibida = item.message;
        let precisaTraducao = false;
        if (currentLang === 'zh') {
            if (item.message_zh) mensagemExibida = item.message_zh; else precisaTraducao = true;
        } else if (currentLang === 'en') {
            if (item.message_en) mensagemExibida = item.message_en; else precisaTraducao = true;
        }

        if (item.type === 'Reclamação') {
            typeBadge = `<span class="inline-flex items-center bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium border border-red-100">${localLabel}</span>`;
        } else if (item.type === 'Sugestão') {
            typeBadge = `<span class="inline-flex items-center bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-100">${localLabel}</span>`;
        } else {
            typeBadge = `<span class="inline-flex items-center bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-100">${localLabel}</span>`;
        }

        const retranslateBtn = precisaTraducao
            ? `<button onclick="retranslateMessage('${item.id}', this)" class="text-xs text-hotelGreen hover:underline font-semibold ml-2">${t.btnRetranslate}</button>`
            : '';

        const evidenciaThumb = item.photoURL
            ? `<div class="mt-2">
                 <img src="${item.photoURL}" onclick="abrirModalImagem('${item.photoURL}')" class="h-14 w-14 object-cover rounded-lg border border-stone-200 cursor-pointer hover:opacity-80 transition"/>
               </div>`
            : '';

        const tr = document.createElement('tr');
        tr.className = "hover:bg-stone-50 transition border-b border-stone-100";
        tr.innerHTML = `
            <td class="p-4 whitespace-nowrap align-top">${typeBadge}</td>
            <td class="p-4 text-xs md:text-sm text-stone-600 max-w-md break-words font-medium align-top">${mensagemExibida}${retranslateBtn}${evidenciaThumb}</td>
            <td class="p-4 text-xs font-mono text-stone-400 whitespace-nowrap align-top">${formatTimestamp(item.createdAt)}</td>
            <td class="p-4 whitespace-nowrap align-top">
                <select onchange="updateStatus('${item.id}', this.value)" class="text-xs bg-stone-50 border border-stone-200 rounded-lg p-1.5 outline-none font-medium text-stone-700">
                    <option value="Novo" ${item.status === 'Novo' ? 'selected' : ''}>• Novo</option>
                    <option value="Lido" ${item.status === 'Lido' ? 'selected' : ''}>• Lido</option>
                    <option value="Resolvido" ${item.status === 'Resolvido' ? 'selected' : ''}>• Resolvido</option>
                </select>
            </td>
            <td class="p-4 text-center whitespace-nowrap align-top">
                <button onclick="deleteMessage('${item.id}')" class="text-xs text-red-400 hover:text-red-600 font-semibold">${t.btnDel}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Tenta traduzir manualmente uma mensagem que falhou na tradução automática inicial
async function retranslateMessage(id, btnEl) {
    const t = i18n[currentLang];
    const item = cachedMessages.find(m => m.id === id);
    if (!item) return;

    if (btnEl) { btnEl.innerText = t.translating; btnEl.disabled = true; }

    const destino = currentLang === 'zh' ? 'zh' : 'en';
    const campo = currentLang === 'zh' ? 'message_zh' : 'message_en';
    const traducao = await API_Traduzir(item.message, destino);

    if (traducao) {
        try {
            await db.collection(MANIFESTATIONS_COLLECTION).doc(id).update({ [campo]: traducao });
            // onSnapshot atualiza cachedMessages e volta a desenhar a tabela automaticamente
        } catch (err) {
            console.error("Erro ao guardar tradução:", err);
            alert(t.connErr);
        }
    } else {
        alert(t.connErr);
        if (btnEl) { btnEl.innerText = t.btnRetranslate; btnEl.disabled = false; }
    }
}

async function updateStatus(id, newStatus) {
    try {
        await db.collection(MANIFESTATIONS_COLLECTION).doc(id).update({ status: newStatus });
    } catch (err) {
        console.error("Erro ao atualizar estado:", err);
        alert(i18n[currentLang].connErr);
    }
}

async function deleteMessage(id) {
    if (!confirm(i18n[currentLang].confirmDel)) return;
    try {
        const item = cachedMessages.find(m => m.id === id);
        await db.collection(MANIFESTATIONS_COLLECTION).doc(id).delete();
        // Também apaga a foto do Storage, se existir, para não acumular lixo
        if (item && item.photoURL) {
            try { await storage.refFromURL(item.photoURL).delete(); } catch (e) { /* não crítico */ }
        }
    } catch (err) {
        console.error("Erro ao eliminar:", err);
        alert(i18n[currentLang].connErr);
    }
}

// ==========================================
// 8. GRÁFICOS (Chart.js)
// ==========================================
function renderCharts(data) {
    const t = i18n[currentLang];
    const ctxTipos = document.getElementById('chartTipos');
    const ctxEstados = document.getElementById('chartEstados');

    if (!ctxTipos || !ctxEstados) return;

    const recCount = data.filter(m => String(m.type).trim().toLowerCase() === 'reclamação').length;
    const sugCount = data.filter(m => String(m.type).trim().toLowerCase() === 'sugestão').length;
    const eloCount = data.filter(m => String(m.type).trim().toLowerCase() === 'elogio').length;

    const novoCount = data.filter(m => String(m.status).trim().toLowerCase() === 'novo').length;
    const lidoCount = data.filter(m => String(m.status).trim().toLowerCase() === 'lido').length;
    const resCount = data.filter(m => String(m.status).trim().toLowerCase() === 'resolvido').length;

    if (chartTiposInstancia) chartTiposInstancia.destroy();
    if (chartEstadosInstancia) chartEstadosInstancia.destroy();

    chartTiposInstancia = new Chart(ctxTipos, {
        type: 'doughnut',
        data: {
            labels: [t.rec, t.sug, t.elo],
            datasets: [{
                data: [recCount, sugCount, eloCount],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: t.chartTitleType, font: { size: 13, weight: 'bold', family: 'system-ui' } }
            }
        }
    });

    const labelNovo = currentLang === 'zh' ? "新消息" : currentLang === 'en' ? "New" : "Novo";
    const labelLido = currentLang === 'zh' ? "已读" : currentLang === 'en' ? "Read" : "Lido";
    const labelResolvido = currentLang === 'zh' ? "已解决" : currentLang === 'en' ? "Resolved" : "Resolvido";

    chartEstadosInstancia = new Chart(ctxEstados, {
        type: 'bar',
        data: {
            labels: [labelNovo, labelLido, labelResolvido],
            datasets: [{
                data: [novoCount, lidoCount, resCount],
                backgroundColor: ['#3b82f6', '#6b7280', '#064e3b'],
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: t.chartTitleStatus, font: { size: 13, weight: 'bold', family: 'system-ui' } }
            },
            scales: { x: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } } }
        }
    });
}

// ==========================================
// 9. EXPORTAÇÃO PDF (relatório de 3 páginas)
// ==========================================
function carregarLogo() {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "assets/Logotipo_b.png";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            } else {
                reject(new Error("Falha ao carregar o contexto de renderização."));
            }
        };
        img.onerror = () => reject(new Error("Logótipo não encontrado"));
    });
}

async function exportToPDF() {
    const manifestacoes = cachedMessages;
    const t = i18n[currentLang];

    let logoSrc = "";
    try { logoSrc = await carregarLogo(); } catch (e) { console.log("Sem logótipo customizado."); }

    let imgGraficoTipos = chartTiposInstancia ? chartTiposInstancia.toBase64Image() : "";
    let imgGraficoEstados = chartEstadosInstancia ? chartEstadosInstancia.toBase64Image() : "";

    const reclamacoes = manifestacoes.filter(m => String(m.type).trim().toLowerCase() === "reclamação").length;
    const sugestoes = manifestacoes.filter(m => String(m.type).trim().toLowerCase() === "sugestão").length;
    const elogios = manifestacoes.filter(m => String(m.type).trim().toLowerCase() === "elogio").length;
    const resolvidas = manifestacoes.filter(m => String(m.status).trim().toLowerCase() === "resolvido").length;
    const lidas = manifestacoes.filter(m => String(m.status).trim().toLowerCase() === "lido").length;
    const pendentes = manifestacoes.filter(m => String(m.status).trim().toLowerCase() === "novo").length;
    const hoje = new Date().toLocaleString(currentLang === 'pt' ? 'pt-PT' : currentLang === 'zh' ? 'zh-CN' : 'en-US');

    const termos = {
        resumo: currentLang === 'zh' ? "执行摘要" : currentLang === 'en' ? "Executive Summary" : "Resumo Executivo",
        indicators: currentLang === 'zh' ? "关键指标" : currentLang === 'en' ? "Performance Indicators" : "Indicadores de Desempenho",
        dataEmissao: currentLang === 'zh' ? "发布日期:" : currentLang === 'en' ? "Issue date:" : "Data de emissão:",
        total: currentLang === 'zh' ? "反馈总数:" : currentLang === 'en' ? "Total feedback:" : "Total de manifestações:",
        lista: currentLang === 'zh' ? "完整反馈列表" : currentLang === 'en' ? "Complete Feedback List" : "Lista Completa das Manifestações",
        confidencial: currentLang === 'zh' ? "Brisa Tropical 酒店 - 机密文件" : currentLang === 'en' ? "Hotel Brisa Tropical - Confidential Document" : "Hotel Brisa Tropical - Documento Confidencial",
        analiseGrafica: currentLang === 'zh' ? "图表数据分析" : currentLang === 'en' ? "Graphical Data Analysis" : "Análise Estatística Gráfica"
    };

    const stNovo = currentLang === 'zh' ? "新消息" : currentLang === 'en' ? "New" : "Novo";
    const stLido = currentLang === 'zh' ? "已读" : currentLang === 'en' ? "Read" : "Lido";
    const stResolvido = currentLang === 'zh' ? "已解决" : currentLang === 'en' ? "Resolved" : "Resolvido";

    const element = document.createElement('div');
    element.style.padding = '0px';
    element.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif';
    element.style.color = '#333';

    let tableRows = '';
    manifestacoes.forEach(item => {
        let tipoTraduzido = item.type === 'Reclamação' ? t.rec : (item.type === 'Sugestão' ? t.sug : t.elo);
        let estadoTraduzido = item.status === 'Novo' ? stNovo : (item.status === 'Lido' ? stLido : stResolvido);

        let mensagemFinal = item.message;
        if (currentLang === 'zh' && item.message_zh) mensagemFinal = item.message_zh;
        else if (currentLang === 'en' && item.message_en) mensagemFinal = item.message_en;

        tableRows += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; font-size: 12px;">${tipoTraduzido}</td>
                <td style="padding: 10px; font-size: 12px;">${estadoTraduzido}</td>
                <td style="padding: 10px; font-size: 12px; font-family: monospace; color: #666;">${formatTimestamp(item.createdAt)}</td>
                <td style="padding: 10px; font-size: 12px; max-width: 320px; word-break: break-all;">${mensagemFinal}</td>
            </tr>
        `;
    });

    element.innerHTML = `
        <div style="padding: 20px; min-height: 1060px; position: relative; box-sizing: border-box;">
            <div style="background-color: #064e3b; display: flex; align-items: center; justify-content: center; padding: 25px; border-radius: 4px; position: relative; color: white; text-align: center;">
                ${logoSrc ? `<img src="${logoSrc}" style="position: absolute; left: 25px; top: 18px; width: 50px; height: 50px;" />` : ''}
                <div>
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">HOTEL BRISA TROPICAL</h1>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">${t.title}</div>
                    <div style="font-size: 11px; opacity: 0.7; margin-top: 2px;">${t.navTitle}</div>
                </div>
            </div>

            <h2 style="text-align: center; margin-top: 50px; font-size: 22px; color: #111;">${termos.resumo}</h2>

            <div style="margin-top: 40px; font-size: 14px; line-height: 2.2;">
                <p><strong>${termos.dataEmissao}</strong> ${hoje}</p>
                <p><strong>${termos.total}</strong> ${manifestacoes.length}</p>
            </div>

            <div style="margin-top: 50px; background-color: #f9f9f9; border: 1px solid #064e3b; border-radius: 6px; padding: 25px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #064e3b; border-bottom: 2px solid #064e3b; padding-bottom: 8px;">${termos.indicators}</h3>
                <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px; line-height: 1.8;">
                    <div>
                        <p>• ${t.cardRec}: <strong>${reclamacoes}</strong></p>
                        <p>• ${t.cardSug}: <strong>${sugestoes}</strong></p>
                        <p>• ${t.cardElo}: <strong>${elogios}</strong></p>
                    </div>
                    <div>
                        <p>• ${stResolvido}: <strong>${resolvidas}</strong></p>
                        <p>• ${stLido}: <strong>${lidas}</strong></p>
                        <p>• ${stNovo}: <strong>${pendentes}</strong></p>
                    </div>
                </div>
            </div>

            <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
                <span>${termos.confidencial}</span>
                <span>Page 1</span>
            </div>
        </div>

        <div class="html2pdf__page-break"></div>

        <div style="padding: 20px; min-height: 1060px; position: relative; box-sizing: border-box;">
            <h2 style="font-size: 20px; margin-bottom: 35px; color: #111; border-bottom: 1px solid #eee; padding-bottom: 10px;">${termos.analiseGrafica}</h2>

            <div style="display: flex; flex-direction: column; gap: 40px; align-items: center; margin-top: 20px;">
                ${imgGraficoTipos ? `
                <div style="width: 85%; text-align: center; background: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <img src="${imgGraficoTipos}" style="width: 100%; max-height: 350px; object-fit: contain;" />
                </div>` : ''}

                ${imgGraficoEstados ? `
                <div style="width: 85%; text-align: center; background: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <img src="${imgGraficoEstados}" style="width: 100%; max-height: 300px; object-fit: contain;" />
                </div>` : ''}
            </div>

            <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
                <span>${termos.confidencial}</span>
                <span>Page 2</span>
            </div>
        </div>

        <div class="html2pdf__page-break"></div>

        <div style="padding: 20px; min-height: 1060px; position: relative; box-sizing: border-box;">
            <h2 style="font-size: 20px; margin-bottom: 25px; color: #111;">${termos.lista}</h2>

            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="background-color: #064e3b; color: white;">
                        <th style="padding: 12px; font-size: 13px;">${t.thType}</th>
                        <th style="padding: 12px; font-size: 13px;">${t.thStatus}</th>
                        <th style="padding: 12px; font-size: 13px;">${t.thDate}</th>
                        <th style="padding: 12px; font-size: 13px;">${t.thMsg}</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>

            <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
                <span>${termos.confidencial}</span>
                <span>Page 3</span>
            </div>
        </div>
    `;

    const opt = {
        margin: 0,
        filename: `Relatorio_Brisa_Tropical_${currentLang.toUpperCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save();
    } else {
        console.error("Biblioteca html2pdf não encontrada.");
    }
}

// Inicializa traduções ao carregar qualquer página
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});
