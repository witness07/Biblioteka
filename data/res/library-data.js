/* ==========================================================================
   [공통 데이터 및 유틸리티] - index.html & detail.html 통합 관리
   ★ 신규 도서 추가/수정 시 아래 BOOKS_DATABASE 배열만 수정하세요! ★
   ========================================================================== */

const DEFAULT_COVER_IMAGE = "images/edited-image.jpg";

// 1. 출판사 통합 데이터 (메인 슬라이더 + 상세 페이지 헤더/배너 공용)
const PUBLISHERS_DATA = [
    {
        id: "pub-2",
        logoImg: "images/logo-lafaek.png", // 필요시 기독교 연합 로고 파일명으로 변경하세요
        headerTopSub: "LITERATURA SARANI",
        headerTitle: "Biblioteka ba Kristaun",
        headerBottomSub: "Haklaken Na'i nia Domin no Lia-Loos liuhosi Livru",
        badge: "Editora Sarani Sira",
        name: "Biblioteka ba Kristaun",
        description: "Kolesaun livru espirituál, estudu Bíblia, no leitura ba kreximentu fiar nian iha moris loron-loron.",
        icon: "fa-cross",
        themeClass: "pub-2"
    },
    {
        id: "pub-3",
        logoImg: "images/logo-siensia.png", // 필요시 어린이 도서관 로고 파일명으로 변경하세요
        headerTopSub: "LEITURA BA LABARIK",
        headerTitle: "Biblioteka ba Labarik",
        headerBottomSub: "Ai-knanoik, Matenek no Ksolok ba Futuru",
        badge: "Espasu Labarik Nian",
        name: "Biblioteka ba Labarik",
        description: "Istória furak, ai-knanoik edukativu, no livru dezeñu atu haburas labarik sira-nia imajinasaun no matenek.",
        icon: "fa-child-reaching",
        themeClass: "pub-3"
    },
    {
        id: "pub-1",
        logoImg: "images/logo-s-j.png",
        headerTopSub: "SALAUN FORMASAUN",
        headerTitle: "SUE AND JUN Press",
        headerBottomSub: "Abilidade Prátika ba Futuru",
        badge: "Editora S&J Center",
        name: "SUE AND JUN Press",
        description: "Manuál formasaun profisionál, teknolojia informátika, no abilidade prátika ba futuru.",
        icon: "fa-laptop-code",
        themeClass: "pub-1"
    },
    {
        id: "pub-0",
        logoImg: "images/logo-Tiranu.jpeg",
        headerTopSub: "SALAUN",
        headerTitle: "Tiranu",
        headerBottomSub: "Liga mundu liuhosi Livru sira",
        badge: "Editor Hera",
        name: "LIGA MUNDU LIUHOSI LIVRU SIRA!",
        description: "Fahe Liafuan liuhosi livru ida no hair ema ida nia fira no moris",
        icon: "fa-book-bible",
        themeClass: "pub-0"
    }
];

// 2. 전체 도서 통합 데이터베이스
// ※ isNew: true -> 상단 신간 섹션 노출 / isNew: false -> 하단 아카이브 섹션 노출
const BOOKS_DATABASE = [
    // ======================================================================
    // [신간 도서 (isNew: true)]
    // ======================================================================
   
    {
        id: 1012,
        publisherId: "pub-2",
        isNew: true,
        title: "Devosaun Diáriu Dezembru — Evangellu João (Q.T. TL)",
        author: "QuietTime Timor-Leste",
        issueLabel: "Foun • Q.T. Dezembru",
        description: "Meditasaun loron-loron husi loron 1 to'o 31 fulan-Dezembru (Evangellu João) iha lian Tetun no Inglés, kompletu ho insight teolójiku, pergunta reflesaun no orasaun.",
        coverImage: "images/q-book-cover.jpeg",
        customUrl: "q-time.html"
    },
    {
        id: 1013,
        publisherId: "pub-2",
        isNew: true,
        title: "Atributu sira Maromak nian (The Attributes of God)",
        author: "Arthur W. Pink",
        issueLabel: "Livru Kiik • #01",
        description: "Estudu teolójiku kona-ba Maromak nia karakter no perfeisaun sira (soberania, santidade, domin, grasa no fidelidade) iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_01.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_01.json"
    },
    {
    id: 1023,
    publisherId: "pub-2",
    isNew: true,
    title: "Estudu Bíblia — Livru Kiik 10 (Chapel Library)",
    author: "Chapel Library",
    issueLabel: "Estudu • Livru 1–10",
    description: "Matadalan estudu Bíblia husi livru kiik 10 (Page 1 Rezumu & Page 2 Pergunta ho Versíkulu) iha lian Tetun no Inglés.",
    coverImage: "images/bookLet/booklet_WB_01.jpg",
    customUrl: "study-guide.html"
    },
    {
        id: 1009,
        publisherId: "pub-2",
        isNew: true,
        title: "Kurríkulu Eskola Domingu — Vol. 1 (Semana 1–16)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Disípulu • Vol. 1",
        description: "Lisaun semana 1 to'o 16 ba labarik sira iha lian Tetun, kompletu ho istória moris, pergunta, misaun prátika no imajem.",
        coverImage: "images/sundaySchool/vol-1.jpeg",
        customUrl: "data/books/kurikulum_q1.html"
    },
    

    // ======================================================================
    // [지난 출판물 (isNew: false)]
    // ======================================================================
    {
        id: 1008,
        publisherId: "pub-2",
        isNew: false,
        title: "Istória Ema Sira iha Bíblia (30 Ema)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Moris • Bíblia 30",
        description: "Istória Bíblia 30 ba labarik sira iha lian Tetun no Inglés, kompletu ho dezeñu no atividade.",
        coverImage: "images/bible/01_abraham/1.jpeg",
        customUrl: "story.html?bible=01_abraham&pub=pub-2"
    },
    {
        id: 1007,
        publisherId: "pub-1",
        isNew: false,
        title: "Liafuan Sira ba Lian Korea",
        author: "SUE&JUN PRESS",
        issueLabel: "Voca • Korean",
        description: "Hodi Estuda Lian Korea ho Liafuan sira.",
        coverImage: "images/kor-tetun.jpeg",
        customUrl: "eps_topik.html"
    },
    {
        id: 1006,
        publisherId: "pub-2",
        isNew: false,
        title: "KATESISMU BADAK Westminster",
        author: "Westminster Assembly",
        issueLabel: "Moris • Liafuan",
        description: "Pergunta sira no Resposta sira kona ba Fiar.",
        coverImage: "images/wes_cate.jpg",
        customUrl: "catechism.html?doc=wes"
    },
    {
        id: 1005,
        publisherId: "pub-2",
        isNew: false,
        title: "KATESISMU BADAK Heidelberg",
        author: "Zacharias Ursinus",
        issueLabel: "Moris • Liafuan",
        description: "Pergunta sira no Resposta sira kona ba Fiar.",
        coverImage: "images/hei_cate.jpg",
        customUrl: "catechism.html?doc=hei"
    },
    {
        id: 1010,
        publisherId: "pub-2",
        isNew: false,
        title: "Kurríkulu Eskola Domingu — Vol. 2 (Semana 17–32)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Disípulu • Vol. 2",
        description: "Lisaun semana 17 to'o 32 ba labarik sira iha lian Tetun, kompletu ho istória moris, pergunta, misaun prátika no imajem.",
        coverImage: "images/sundaySchool/vol-2.jpeg",
        customUrl: "data/books/kurikulum_q2.html"
    },
    {
        id: 1011,
        publisherId: "pub-2",
        isNew: false,
        title: "Kurríkulu Eskola Domingu — Vol. 3 (Semana 33–52)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Disípulu • Vol. 3",
        description: "Lisaun semana 33 to'o 52 ba labarik sira iha lian Tetun, kompletu ho istória moris, pergunta, misaun prátika no imajem.",
        coverImage: "images/sundaySchool/vol-3.jpeg",
        customUrl: "data/books/kurikulum_q3.html"
    },
    {
        id: 1014,
        publisherId: "pub-2",
        isNew: false,
        title: "Fiar: Saida Mak Nia Essénsia no Nia Rezultadu sira (Faith: What It Is and What It Leads To)",
        author: "Charles H. Spurgeon",
        issueLabel: "Livru Kiik • #02",
        description: "Estudu kona-ba objetu, kauza, fundasaun, garantia no rezultadu husi fiar salvasaun nian iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_02.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_02.json"
    },
    {
        id: 1004,
        publisherId: "pub-3",
        isNew: false,
        title: "Manduku Sira ne'ebé Husu Liurai Ida (The Frogs Who Wished for a King.)",
        author: "Esopu (Aesop's Fables)",
        issueLabel: "Foun • Istória",
        description: "Antes atu troka, hanoin lai di'ak ka aat.",
        coverImage: "images/frogKing/1.jpeg",
        customUrl: "story.html?book=frogKing"
    },
    {
        id: 1003,
        publisherId: "pub-3",
        isNew: false,
        title: "Lioun ho Ratu (The Lion & the Mouse)",
        author: "Esopu (Aesop's Fables)",
        issueLabel: "Foun • Istória",
        description: "Laran-di'ak husi belun ki'ik nunka lakon.",
        coverImage: "images/lion/1.jpeg",
        customUrl: "story.html?book=lion"
    },
    {
        id: 1002,
        publisherId: "pub-3",
        isNew: false,
        title: "Bibi-atan Ki'ik ho Lobu (The Shepherd Boy & the Wolf)",
        author: "Esopu (Aesop's Fables)",
        issueLabel: "Foun • Istória",
        description: "Istória edukativa kona-ba bibi-atan ki'ik ne'ebé gosta bosok ema knua nian.",
        coverImage: "images/sheperd/6.jpeg",
        customUrl: "story.html?book=sheperd"
    },
    {
        id: 1001,
        publisherId: "pub-0",
        isNew: false,
        title: "Testamentu Foun (Tetun-Dili) - IBTTL",
        author: "Institutu Bíblia Tetun Timor-Leste (IBTTL)",
        issueLabel: "Bíblia • Kompletu",
        description: "Testamentu Foun kompletu iha lian Tetun-Dili (Mateus to'o Apokalipse).",
        coverImage: "images/bible-foun.jpeg",
        heyzineUrl: "https://heyzine.com/flip-book/342dbb34cb.html"
    },
    {
        id: 1,
        publisherId: "pub-0",
        isNew: false,
        title: "BibleTime - Testamentu Foun (Volum 11)",
        author: "BibleTime Timor-Leste",
        issueLabel: "Vol. 11",
        description: "Tito 3 - 2 Pedro 3. Estudu Bíblia diáriu no istória ba família tomak.",
        coverImage: "images/bibleTime-vol11.png",
        heyzineUrl: "https://heyzine.com/flip-book/fc63f38965.html"
    },
    {
        id: 2,
        publisherId: "pub-0",
        isNew: false,
        title: "Dromos vol 15",
        author: "Tiranu Hera",
        issueLabel: "Vol. 15",
        description: "Revista fulan-fulan!",
        coverImage: "images/dromos_vol15.png",
        heyzineUrl: "https://heyzine.com/flip-book/a0a7cbd37f.html"
    },
    {
        id: 3,
        publisherId: "pub-0",
        isNew: false,
        title: "Dromos vol 14",
        author: "Tiranu Hera",
        issueLabel: "Vol. 14",
        description: "Revista fulan-fulan!",
        coverImage: "images/dromos_vol14.png",
        heyzineUrl: "https://heyzine.com/flip-book/8078848189.html"
    },
    {
        id: 1015,
        publisherId: "pub-2",
        isNew: false,
        title: "Ó Moris Foun Ona Ka Lae? (Are You Born Again?)",
        author: "J. C. Ryle",
        issueLabel: "Livru Kiik • #03",
        description: "Ezame kona-ba sinál bíbliku neen husi rejenerasaun ka moris foun iha Kristu iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_03.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_03.json"
    },
    {
        id: 1016,
        publisherId: "pub-2",
        isNew: false,
        title: "Ó Bá Iha Enkontru Orasaun Ka Lae? (Do You Go to the Prayer Meeting?)",
        author: "Horatius Bonar",
        issueLabel: "Livru Kiik • #04",
        description: "Bolun séria kona-ba importánsia enkontru orasaun, eternidade no apelu atu vijila no harohan iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_04.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_04.json"
    },
    {
        id: 1017,
        publisherId: "pub-2",
        isNew: false,
        title: "Dalan Tama Ba Eskritura Sagrada (Pathway into the Scriptures)",
        author: "William Tyndale",
        issueLabel: "Livru Kiik • #05",
        description: "Matadalan atu komprende Testamentu Tuan no Foun, Lei no Evanjellu, Grasa no Fiar iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_05.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_05.json"
    },
    {
        id: 1018,
        publisherId: "pub-2",
        isNew: false,
        title: "Oho Sala (Mortification of Sin)",
        author: "John Owen",
        issueLabel: "Livru Kiik • #06",
        description: "Hanorin kona-ba oho sala liuhosi Espíritu Santu no fiar ba Kristu ne'ebé kruzifika iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_06.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_06.json"
    },
    {
        id: 1019,
        publisherId: "pub-2",
        isNew: false,
        title: "Sakrifísiu Ne'ebé Simu (The Acceptable Sacrifice)",
        author: "John Bunyan",
        issueLabel: "Livru Kiik • #07",
        description: "Hanorin kona-ba enselénsia no kmaan husi fuan ne'ebé rahun no kontritu iha Kristu iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_07.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_07.json"
    },
    {
        id: 1020,
        publisherId: "pub-2",
        isNew: false,
        title: "Orasaun Família Nian La Bele Neglijénsia (Family Prayer Not to Be Neglected)",
        author: "Isaac Backus",
        issueLabel: "Livru Kiik • #08",
        description: "Apelu atu hamoris fali adorasaun no orasaun família nian loron-loron hodi buka Na'i hamutuk iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_08.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_08.json"
    },
    {
        id: 1021,
        publisherId: "pub-2",
        isNew: false,
        title: "Karidade Sarani Nian (Christian Charity)",
        author: "Jonathan Edwards",
        issueLabel: "Livru Kiik • #09",
        description: "Hanorin kona-ba devér fó ba ema kiak, mordomia fiél no rekompensa eternidade nian iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_09.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_09.json"
    },
    {
        id: 1022,
        publisherId: "pub-2",
        isNew: false,
        title: "Hanoin Sira Ba Joven Mane Sira (Thoughts for Young Men)",
        author: "J. C. Ryle",
        issueLabel: "Livru Kiik • #10",
        description: "Konsellu pastorál kona-ba kuidadu juventude, kontra tentasaun no serbí Maromak ohin iha lian Tetun no Inglés.",
        coverImage: "images/bookLet/booklet_10.jpg",
        customUrl: "booklet-viewer.html?file=data/res/bookLetJs/booklet_10.json"
    },

    {
        id: 4,
        publisherId: "pub-0",
        isNew: false,
        title: "Dromos vol 13",
        author: "Tiranu Hera",
        issueLabel: "Vol. 13",
        description: "Revista fulan-fulan!",
        coverImage: "images/dromos_vol13.png",
        heyzineUrl: "https://heyzine.com/flip-book/31bfebef41.html"
    },
    {
        id: 101,
        publisherId: "pub-0",
        isNew: false,
        title: "Dromos VOL.12",
        author: "Tiranu Hera",
        issueLabel: "Volum 12",
        description: "Revista fulan-fulan!",
        coverImage: "images/dromos-vol12.png",
        heyzineUrl: "https://heyzine.com/flip-book/9afc3291c8.html"
    }
];

/* ==========================================================================
   3. 공통 헬퍼 함수 (출판사 조회, 검색 정규화, 도서 카드 HTML 생성, 모달 제어)
   ========================================================================== */

/**
 * 검색용 문자열 정규화 함수
 * - 소문자 변환, 앞뒤 공백 제거
 * - 테툼어/포르투갈어 강세 부호(Diacritics) 제거 (예: "Bíblia" -> "biblia", "Kurríkulu" -> "kurrikulu")
 */
function normalizeSearchText(text) {
    if (!text) return "";
    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

/**
 * 통합 도서 검색 함수 (index.html, detail.html 공용)
 * - 제목, 저자, 설명, 출판사명, 호수 라벨을 모두 포함하여 다중 키워드(공백 구분) 검색 지원
 * @param {string} keyword - 사용자 입력 검색어
 * @param {string|null} publisherId - 특정 출판사로 제한할 경우 출판사 ID (선택사항)
 * @returns {Array} 필터링된 도서 객체 배열
 */
function searchLibraryBooks(keyword = "", publisherId = null) {
    const normalizedQuery = normalizeSearchText(keyword);
    const searchTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return BOOKS_DATABASE.filter(book => {
        // 특정 출판사 필터가 지정된 경우 먼저 확인
        if (publisherId && book.publisherId !== publisherId) {
            return false;
        }

        // 검색어가 없으면 전체 반환
        if (searchTokens.length === 0) {
            return true;
        }

        const pubName = getPublisherName(book.publisherId);
        const searchableTarget = normalizeSearchText(
            `${book.title} ${book.author} ${book.description} ${pubName} ${book.issueLabel}`
        );

        // 공백으로 구분된 모든 검색 키워드가 포함되는지 확인 (AND 조건)
        return searchTokens.every(token => searchableTarget.includes(token));
    });
}

// ID로 출판사 객체 조회
function getPublisherById(pubId) {
    return PUBLISHERS_DATA.find(p => p.id === pubId) || PUBLISHERS_DATA.find(p => p.id === "pub-0");
}

// ID로 출판사 이름 조회
function getPublisherName(pubId) {
    const pub = getPublisherById(pubId);
    return pub ? pub.name : "Editora";
}

// 도서 카드 HTML 생성 (index.html, detail.html 공용)
function createBookCardHTML(book, isArchive) {
    const pubName = getPublisherName(book.publisherId);
    const coverSrc = book.coverImage || DEFAULT_COVER_IMAGE;
    const btnLabel = isArchive ? "Haree Arkivu" : "Lee Livru";
    const badgeClass = isArchive ? "book-badge archive-badge" : "book-badge";

    return `
        <article class="book-card ${isArchive ? 'archive-card' : ''}" onclick="openBookModal(${book.id})">
            <div class="book-cover-wrapper">
                <span class="${badgeClass}">${book.issueLabel}</span>
                <img class="book-cover-img" 
                     src="${coverSrc}" 
                     alt="${book.title}"
                     onerror="this.onerror=null; this.src='https://placehold.co/300x400/1e3a8a/ffffff?text=Cover';">
            </div>
            <div class="book-info">
                <span class="book-publisher-tag">${pubName}</span>
                <h4 class="book-title">${book.title}</h4>
                <p class="book-author">${book.author}</p>
                <p class="book-desc">${book.description}</p>
                <button class="read-btn" type="button">
                    <i class="fa-solid fa-book-open"></i> ${btnLabel}
                </button>
            </div>
        </article>
    `;
}

// 책 열기 (customUrl 우선 이동, 없으면 Heyzine 모달 실행)
function openBookModal(bookId) {
    const book = BOOKS_DATABASE.find(b => b.id === bookId);
    if (!book) return;

    // 1. customUrl이 설정된 로컬 HTML 책인 경우 새 탭에서 열기
    if (book.customUrl) {
        window.open(book.customUrl, '_blank', 'noopener,noreferrer');
        return;
    }

    // 2. 기존 Heyzine 플립북 모달 실행
    const modal = document.getElementById("bookModal");
    if (!modal) return;

    document.getElementById("modalBookTitle").innerText = `${book.title} (${book.author})`;
    document.getElementById("heyzineExternalLink").href = book.heyzineUrl;
    document.getElementById("heyzineIframe").src = book.heyzineUrl;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

// 모달 닫기
function closeBookModal() {
    const modal = document.getElementById("bookModal");
    if (!modal) return;
    modal.classList.remove("active");
    const iframe = document.getElementById("heyzineIframe");
    if (iframe) iframe.src = "";
    document.body.style.overflow = "";
}

/**
 * 검색 초기화 및 홈(전체 목록) 복귀 함수
 * - 검색창 입력값을 비우고, 페이지 내 handleSearch()를 호출하여 초기 화면으로 복구
 */
function clearSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.value = "";

    // 각 페이지(index.html, detail.html)에 정의된 검색 핸들러 실행
    if (typeof handleSearch === "function") {
        handleSearch();
    } else if (typeof renderBooks === "function") {
        renderBooks("");
    }

    // 화면 최상단으로 부드럽게 스크롤 이동
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ESC 키 처리: 모달이 열려있으면 모달을 닫고, 검색 중이면 검색 초기화(홈 복귀)
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const modal = document.getElementById("bookModal");
        if (modal && modal.classList.contains("active")) {
            closeBookModal();
            return;
        }

        const searchInput = document.getElementById("searchInput");
        if (searchInput && searchInput.value.trim().length > 0) {
            clearSearch();
        }
    }
});