/**
 * bible.html 전용 성경 뷰어 컨트롤러 (경로: data/res/bible-viewer-controller.js)
 * structured_bible.json 파일을 불러와 구약/신약 필터링, 장/절 렌더링, 검색, 딥링크(?ref=)를 처리합니다.
 */
(function () {
    let bibleData = null;
    let currentBookName = "";
    let currentChapter = "1";
    let fontSize = 18;

    // 책 이름 및 약어 매핑 테이블 (외부 링크 및 검색 호환)
    const BOOK_ALIASES = {
        "gen": "Jénesis", "jénesis": "Jénesis", "genesis": "Jénesis", "창": "Jénesis", "창세기": "Jénesis",
        "exo": "Exodu", "exodu": "Exodu", "éxodo": "Exodu", "출": "Exodu", "출애굽기": "Exodu",
        "lev": "Levítiku", "levítiku": "Levítiku", "levitiku": "Levítiku", "레": "Levítiku",
        "num": "Númeru", "númeru": "Númeru", "numeru": "Númeru", "민": "Númeru",
        "deu": "Deuteronómiu", "deuteronómiu": "Deuteronómiu", "deuteronomiu": "Deuteronómiu", "신": "Deuteronómiu",
        "psa": "Salmu", "salmu": "Salmu", "sal": "Salmu", "시": "Salmu", "시편": "Salmu",
        "pro": "Provérbiu", "provérbiu": "Provérbiu", "proverbiu": "Provérbiu", "잠": "Provérbiu",
        "isa": "Isaias", "isaias": "Isaias", "사": "Isaias", "이사야": "Isaias",
        "mat": "Mateus", "mateus": "Mateus", "mt": "Mateus", "마": "Mateus", "마태복음": "Mateus",
        "mrk": "Marcos", "marcos": "Marcos", "mc": "Marcos", "막": "Marcos",
        "luk": "Lucas", "lucas": "Lucas", "lc": "Lucas", "눅": "Lucas",
        "jhn": "João", "joão": "João", "joao": "João", "jo": "João", "요": "João", "요한복음": "João",
        "act": "Apostolu", "apostolu": "Apostolu", "행": "Apostolu", "사도행전": "Apostolu",
        "rom": "Roma", "roma": "Roma", "rm": "Roma", "롬": "Roma", "로마서": "Roma",
        "1co": "1 Korinto", "1 korinto": "1 Korinto", "1korinto": "1 Korinto", "고전": "1 Korinto",
        "2co": "2 Korinto", "2 korinto": "2 Korinto", "2korinto": "2 Korinto", "고후": "2 Korinto",
        "gal": "Galásia", "galásia": "Galásia", "galasia": "Galásia", "갈": "Galásia",
        "eph": "Éfezu", "éfezu": "Éfezu", "efezu": "Éfezu", "엡": "Éfezu",
        "php": "Filipe", "filipe": "Filipe", "빌": "Filipe",
        "col": "Kolose", "kolose": "Kolose", "골": "Kolose",
        "heb": "Ebreu", "ebreu": "Ebreu", "히": "Ebreu",
        "jas": "Tiago", "tiago": "Tiago", "약": "Tiago",
        "rev": "Apokalipse", "apokalipse": "Apokalipse", "계": "Apokalipse"
    };

    // 구약(OT)과 신약(NT) 분류 리스트
    const OLD_TESTAMENT = [
        "Jénesis", "Exodu", "Levítiku", "Númeru", "Deuteronómiu", "Josué", "Juis", "Rute",
        "1 Samuel", "2 Samuel", "1 Liurai", "2 Liurai", "1 Krónikas", "2 Krónikas",
        "Esdras", "Neemias", "Ester", "Job", "Salmu", "Provérbiu", "Ekleziastes",
        "Kanta", "Isaias", "Jeremias", "Lamentasaun", "Ezekiel", "Daniel", "Ozeias",
        "Joel", "Amós", "Obadias", "Jonas", "Miqueias", "Naum", "Habakuk", "Sofonias",
        "Ageu", "Zacarias", "Malaquias"
    ];

    const els = {
        testamentSelect: document.getElementById('testamentSelect'),
        bookSelect: document.getElementById('bookSelect'),
        chapterSelect: document.getElementById('chapterSelect'),
        loadingState: document.getElementById('loadingState'),
        readerView: document.getElementById('readerView'),
        searchView: document.getElementById('searchView'),
        testamentBadge: document.getElementById('testamentBadge'),
        chapterTitle: document.getElementById('chapterTitle'),
        versesContainer: document.getElementById('versesContainer'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        searchResultsList: document.getElementById('searchResultsList'),
        closeSearchBtn: document.getElementById('closeSearchBtn'),
        prevChapBtn: document.getElementById('prevChapBtn'),
        nextChapBtn: document.getElementById('nextChapBtn'),
        fontUp: document.getElementById('fontUp'),
        fontDown: document.getElementById('fontDown'),
        mainContainer: document.getElementById('mainContainer')
    };

    // 성경 책이 구약인지 판별하는 함수
    function getTestament(bookName) {
        return OLD_TESTAMENT.includes(bookName) ? 'OT' : 'NT';
    }

    // JSON 데이터 로드 및 초기화
    async function initBible() {
        try {
            const res = await fetch('data/res/structured_bible.json');
            if (!res.ok) throw new Error('structured_bible.json 파일을 찾을 수 없습니다.');
            bibleData = await res.json();

            els.loadingState.classList.add('hidden');
            els.readerView.classList.remove('hidden');

            populateBookDropdown();
            handleUrlReference();
        } catch (err) {
            els.loadingState.innerHTML = `
                <p class="text-red-600 font-semibold">Erro: ${err.message}</p>
                <p class="text-sm mt-2"><b>structured_bible.json</b> 파일 경로가 올바른지 확인해 주세요.</p>
            `;
        }
    }
    
    // 책 드롭다운 목록 채우기 (구약/신약 필터 반영)
    function populateBookDropdown() {
        const filter = els.testamentSelect.value;
        els.bookSelect.innerHTML = '';

        const bookNames = Object.keys(bibleData);
        bookNames.forEach(bookName => {
            const testament = getTestament(bookName);
            if (filter === 'ALL' || testament === filter) {
                const opt = document.createElement('option');
                opt.value = bookName;
                opt.textContent = bookName;
                els.bookSelect.appendChild(opt);
            }
        });
    }

    // 장 드롭다운 목록 채우기
    function populateChapterDropdown(bookName) {
        els.chapterSelect.innerHTML = '';
        const chaptersObj = bibleData[bookName];
        if (!chaptersObj) return;

        const chapters = Object.keys(chaptersObj).sort((a, b) => Number(a) - Number(b));
        chapters.forEach(chap => {
            const opt = document.createElement('option');
            opt.value = chap;
            opt.textContent = `Kapítulu ${chap}`;
            els.chapterSelect.appendChild(opt);
        });
    }

    // 성경 본문 렌더링 (특정 절 하이라이트 및 소제목 지원)
    window.renderChapter = function (bookName, chap, highlightVerses = []) {
        if (!bibleData[bookName] || !bibleData[bookName][chap]) return;

        currentBookName = bookName;
        currentChapter = String(chap);

        const testament = getTestament(bookName);
        if (els.testamentSelect.value !== 'ALL' && els.testamentSelect.value !== testament) {
            els.testamentSelect.value = 'ALL';
            populateBookDropdown();
        }

        els.bookSelect.value = currentBookName;
        populateChapterDropdown(currentBookName);
        els.chapterSelect.value = currentChapter;

        els.testamentBadge.textContent = testament === 'OT' ? 'Testamentu Tuan' : 'Testamentu Foun';
        els.chapterTitle.textContent = `${currentBookName} ${currentChapter}`;

        const chapterData = bibleData[currentBookName][currentChapter];
        const verses = chapterData.verses || {};
        const verseNums = Object.keys(verses).sort((a, b) => Number(a) - Number(b));

        let html = '';
        if (chapterData.title) {
            html += `<h4 class="font-bold text-amber-700 text-lg mb-3 mt-2 border-b pb-1">${chapterData.title}</h4>`;
        }

        html += verseNums.map(vNum => {
            const isHighlighted = highlightVerses.includes(Number(vNum));
            return `
                <p id="v-${vNum}" class="leading-relaxed mb-2 ${isHighlighted ? 'verse-highlight bg-amber-50 p-1 rounded' : ''}">
                    <sup class="font-sans font-bold text-amber-600 mr-1.5 select-none">${vNum}</sup>${verses[vNum]}
                </p>
            `;
        }).join('');

        els.versesContainer.innerHTML = html;
        els.searchView.classList.add('hidden');
        els.readerView.classList.remove('hidden');

        if (highlightVerses.length > 0) {
            const targetEl = document.getElementById(`v-${highlightVerses[0]}`);
            if (targetEl) {
                setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }
        } else {
            els.mainContainer.scrollTop = 0;
        }
    };

    // URL 파라미터(?ref=Jénesis.1.1-3 또는 #Jénesis 1:1) 파싱
    function handleUrlReference() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref') || decodeURIComponent(window.location.hash.replace('#', ''));

        const bookNames = Object.keys(bibleData);
        if (!ref) {
            window.renderChapter(bookNames[0], "1");
            return;
        }

        const match = ref.trim().match(/^([1-3]?\s*[a-zA-ZÀ-ÿ]+)[.\s]+(\d+)(?:[:.](\d+)(?:-(\d+))?)?/i);
        if (match) {
            const rawBook = match[1].trim().toLowerCase();
            const chap = match[2];
            const startV = match[3] ? Number(match[3]) : null;
            const endV = match[4] ? Number(match[4]) : startV;

            const resolvedBook = BOOK_ALIASES[rawBook] || bookNames.find(b => b.toLowerCase() === rawBook);

            if (resolvedBook && bibleData[resolvedBook]) {
                const highlights = [];
                if (startV) {
                    for (let v = startV; v <= endV; v++) highlights.push(v);
                }
                window.renderChapter(resolvedBook, chap, highlights);
                return;
            }
        }
        window.renderChapter(bookNames[0], "1");
    }

    // 테툼어/포르투갈어 악센트 기호 제거 및 소문자 정규화 함수 (예: "Jénesis" -> "jenesis", "á, ã" -> "a")
    function normalizeText(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    // 악센트 무관 하이라이트를 위한 유연한 정규식 생성 함수
    function buildAccentInsensitiveRegex(query) {
        const accentMap = {
            'a': '[aáàãâä]',
            'e': '[eéèêë]',
            'i': '[iíìîï]',
            'o': '[oóòõôö]',
            'u': '[uúùûü]',
            'c': '[cç]',
            'n': '[nñ]'
        };
        const normalizedQuery = normalizeText(query);
        const pattern = normalizedQuery.split('').map(char => {
            if (accentMap[char]) return accentMap[char];
            return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }).join('');
        return new RegExp(`(${pattern})`, 'gi');
    }

    // 전체 성경 단어 검색 기능 (악센트 양방향 호환)
    function performSearch() {
        const rawQuery = els.searchInput.value.trim();
        const normalizedQuery = normalizeText(rawQuery);
        if (normalizedQuery.length < 2) return;

        const results = [];
        const bookNames = Object.keys(bibleData);

        for (const bookName of bookNames) {
            const chapters = bibleData[bookName];
            for (const [chap, chapData] of Object.entries(chapters)) {
                if (chapData.verses) {
                    for (const [vNum, text] of Object.entries(chapData.verses)) {
                        if (normalizeText(text).includes(normalizedQuery)) {
                            results.push({ bookName, chap, vNum, text });
                            if (results.length >= 100) break;
                        }
                    }
                }
                if (results.length >= 100) break;
            }
            if (results.length >= 100) break;
        }

        const highlightRegex = buildAccentInsensitiveRegex(rawQuery);

        els.searchResultsList.innerHTML = results.length === 0
            ? `<p class="text-slate-500">La hetan rezultadu ba "<b>${rawQuery}</b>".</p>`
            : results.map(r => {
                const highlightedText = r.text.replace(highlightRegex, '<mark class="bg-amber-200 px-0.5 rounded">$1</mark>');
                return `
                    <div class="p-4 rounded-lg border border-slate-200 hover:border-amber-400 cursor-pointer transition bg-slate-50 mb-3"
                         onclick="renderChapter('${r.bookName}', '${r.chap}', [${r.vNum}])">
                        <div class="font-bold text-amber-700 text-sm mb-1">${r.bookName} ${r.chap}:${r.vNum}</div>
                        <p class="bible-text text-sm text-slate-700">${highlightedText}</p>
                    </div>
                `;
            }).join('');

        els.readerView.classList.add('hidden');
        els.searchView.classList.remove('hidden');
    }

    // 이벤트 리스너 바인딩
    function bindEvents() {
        els.testamentSelect.addEventListener('change', () => {
            populateBookDropdown();
            const firstOpt = els.bookSelect.options[0];
            if (firstOpt) {
                window.renderChapter(firstOpt.value, "1");
            }
        });

        els.bookSelect.addEventListener('change', (e) => window.renderChapter(e.target.value, "1"));
        els.chapterSelect.addEventListener('change', (e) => window.renderChapter(currentBookName, e.target.value));

        els.prevChapBtn.addEventListener('click', () => {
            const prev = Number(currentChapter) - 1;
            const bookNames = Object.keys(bibleData);
            if (prev >= 1) {
                window.renderChapter(currentBookName, prev);
            } else {
                const bIdx = bookNames.indexOf(currentBookName);
                if (bIdx > 0) {
                    const prevBook = bookNames[bIdx - 1];
                    const lastChap = Math.max(...Object.keys(bibleData[prevBook]).map(Number));
                    window.renderChapter(prevBook, lastChap);
                }
            }
        });

        els.nextChapBtn.addEventListener('click', () => {
            const next = Number(currentChapter) + 1;
            const bookNames = Object.keys(bibleData);
            if (bibleData[currentBookName][String(next)]) {
                window.renderChapter(currentBookName, next);
            } else {
                const bIdx = bookNames.indexOf(currentBookName);
                if (bIdx < bookNames.length - 1) {
                    window.renderChapter(bookNames[bIdx + 1], "1");
                }
            }
        });

        els.searchBtn.addEventListener('click', performSearch);
        els.searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
        els.closeSearchBtn.addEventListener('click', () => {
            els.searchView.classList.add('hidden');
            els.readerView.classList.remove('hidden');
        });

        els.fontUp.addEventListener('click', () => {
            fontSize = Math.min(28, fontSize + 2);
            els.versesContainer.style.fontSize = `${fontSize}px`;
        });
        els.fontDown.addEventListener('click', () => {
            fontSize = Math.max(14, fontSize - 2);
            els.versesContainer.style.fontSize = `${fontSize}px`;
        });

        window.addEventListener('hashchange', handleUrlReference);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initBible().then(() => {
            bindEvents();
        });
    });
})();