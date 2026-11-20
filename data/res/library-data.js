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
        id: 1009,
        publisherId: "pub-2",
        isNew: true,
        title: "Kurríkulu Eskola Domingu — Vol. 1 (Semana 1–12)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Disípulu • Vol. 1",
        description: "Lisaun semana 1 to'o 12 ba labarik sira iha lian Tetun, kompletu ho istória moris, pergunta, misaun prátika no imajem.",
        coverImage: "images/sundaySchool/vol-1.jpeg",
        heyzineUrl: "https://heyzine.com/flip-book/e842712a7f.html"
    },
    {
        id: 1010,
        publisherId: "pub-2",
        isNew: true,
        title: "Kurríkulu Eskola Domingu — Vol. 2 (Semana 13–24)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Disípulu • Vol. 2",
        description: "Lisaun semana 12 to'o 24 ba labarik sira iha lian Tetun, kompletu ho istória moris, pergunta, misaun prátika no imajem.",
        coverImage: "images/sundaySchool/vol-2.jpeg",
        heyzineUrl: "https://heyzine.com/flip-book/05d5095fd4.html"
    },
    {
        id: 1011,
        publisherId: "pub-2",
        isNew: true,
        title: "Kurríkulu Eskola Domingu — Vol. 3 (Semana 25–36)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Disípulu • Vol. 3",
        description: "Lisaun semana 25 to'o 36 ba labarik sira iha lian Tetun, kompletu ho istória moris, pergunta, misaun prátika no imajem.",
        coverImage: "images/sundaySchool/vol-3.jpeg",
        heyzineUrl: "https://heyzine.com/flip-book/c563f9df83.html"
    },
     {
        id: 1012,
        publisherId: "pub-2",
        isNew: true,
        title: "Kurríkulu Eskola Domingu — Vol. 4 (Semana 37–52)",
        author: "Eskola Domingu Timor-Leste",
        issueLabel: "Disípulu • Vol. 3",
        description: "Lisaun semana 37 to'o 52 ba labarik sira iha lian Tetun, kompletu ho istória moris, pergunta, misaun prátika no imajem.",
        coverImage: "images/sundaySchool/vol-4.jpeg",
        heyzineUrl: "https://heyzine.com/flip-book/48cd4f78e4.html"
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
   3. 공통 헬퍼 함수 (출판사 조회, 도서 카드 HTML 생성, 모달 제어)
   ========================================================================== */

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

    if (book.customUrl) {
        window.location.href = book.customUrl;
        return;
    }

    document.getElementById("modalBookTitle").innerText = `${book.title} (${book.author})`;
    document.getElementById("heyzineExternalLink").href = book.heyzineUrl;
    document.getElementById("heyzineIframe").src = book.heyzineUrl;

    document.getElementById("bookModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

// 모달 닫기
function closeBookModal() {
    const modal = document.getElementById("bookModal");
    if (!modal) return;
    modal.classList.remove("active");
    document.getElementById("heyzineIframe").src = "";
    document.body.style.overflow = "";
}

// ESC 키로 모달 닫기
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBookModal();
});