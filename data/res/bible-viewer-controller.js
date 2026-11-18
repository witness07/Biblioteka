/**
 * bible.html 전용 성경 뷰어 컨트롤러 (경로: data/res/bible-viewer-controller.js)
 * structured_bible_2.json 로드, 반응형 역본 대조(NLT/WEB) 및 검색 지원
 */
(function () {
    let bibleData = null;
    let currentBookName = "";
    let currentChapter = "1";
    let fontSize = 18;

    let showNlt = false;
    const nltCache = {};

    // 표준 66권 영문 약어 배열 (창세기 0번 인덱스 ~ 요한계시록 65번 인덱스)
    const STANDARD_BOOK_CODES = [
        "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT", "1SA", "2SA",
        "1KI", "2KI", "1CH", "2CH", "EZR", "NEH", "EST", "JOB", "PSA", "PRO",
        "ECC", "SNG", "ISA", "JER", "LAM", "EZK", "DAN", "HOS", "JOL", "AMO",
        "OBA", "JON", "MIC", "NAM", "HAB", "ZEP", "HAG", "ZEC", "MAL",
        "MAT", "MRK", "LUK", "JHN", "ACT", "ROM", "1CO", "2CO", "GAL", "EPH",
        "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAS",
        "1PE", "2PE", "1JN", "2JN", "3JN", "JUD", "REV"
    ];

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
        toggleNltBtn: document.getElementById('toggleNltBtn'),
        parallelHeader: document.getElementById('parallelHeader'),
        engHeaderLabel: document.getElementById('engHeaderLabel'),
        headerInner: document.getElementById('headerInner'),
        fontUp: document.getElementById('fontUp'),
        fontDown: document.getElementById('fontDown'),
        mainContainer: document.getElementById('mainContainer')
    };

    function getTestament(bookName) {
        return OLD_TESTAMENT.includes(bookName) ? 'OT' : 'NT';
    }

    // 영문 성경 로드 (1순위: Bolls.life NLT / 2순위 폴백: bible-api.com WEB)
    async function fetchEnglishChapter(bookName, chap) {
        const cacheKey = `${bookName}_${chap}`;
        if (nltCache[cacheKey]) return nltCache[cacheKey];

        const bookNames = Object.keys(bibleData);
        const bookIdx = bookNames.indexOf(bookName);
        if (bookIdx < 0) return { version: 'NLT', verses: {} };

        const bookNumber = bookIdx + 1;
        const bookCode = STANDARD_BOOK_CODES[bookIdx] || "GEN";

        // 1순위: Bolls.life API (NLT)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(`https://bolls.life/get-text/NLT/${bookNumber}/${chap}/`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    const verseMap = {};
                    data.forEach(item => {
                        verseMap[String(item.verse)] = String(item.text || '').replace(/<[^>]*>/g, '').trim();
                    });
                    const result = { version: 'NLT', verses: verseMap };
                    nltCache[cacheKey] = result;
                    return result;
                }
            }
        } catch (err) {
            console.warn('Bolls.life NLT 호출 실패, 예비 API 시도:', err);
        }

        // 2순위: 예비 API (bible-api.com - 공백 인코딩 및 타임아웃 적용)
        try {
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
            const res2 = await fetch(`https://bible-api.com/${encodeURIComponent(bookCode + ' ' + chap)}?translation=web`, { signal: controller2.signal });
            clearTimeout(timeoutId2);

            if (res2.ok) {
                const data2 = await res2.json();
                if (data2 && Array.isArray(data2.verses)) {
                    const verseMap = {};
                    data2.verses.forEach(item => {
                        verseMap[String(item.verse)] = String(item.text || '').replace(/\n/g, ' ').trim();
                    });
                    const result = { version: 'WEB', verses: verseMap };
                    nltCache[cacheKey] = result;
                    return result;
                }
            }
        } catch (err2) {
            console.error('영문 성경 API 모두 실패:', err2);
        }

        return { version: 'NLT', verses: null };
    }

    async function initBible() {
        const jsonPaths = [
            'data/res/structured_bible_2.json',
            'data/res/structured_bible.json'
        ];

        for (const path of jsonPaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    bibleData = await res.json();
                    break;
                }
            } catch (e) {
                console.warn(`${path} 로드 실패:`, e.message);
            }
        }

        if (!bibleData) {
            // 미리보기(Preview) 등 로컬 JSON 접근이 불가한 환경일 경우 테스트용 창세기 1장 샘플 로드
            console.warn('로컬 JSON 파일을 모두 찾을 수 없어 테스트 샘플 데이터를 사용합니다.');
            bibleData = {
                "Jénesis": {
                    "1": {
                        "title": "Maromak Kria Buat Hotu",
                        "verses": {
                            "1": "Hahuu fo-foun, Maromak kria lalehan no rai.",
                            "2": "Rai nee seidauk iha forma no mamuk. Nakukun taka hela fatin klean nia leten. No Maromak nia Espíritu book aan ba-mai iha bee nia leten.",
                            "3": "Maromak dehan, “Naroman mosu ba.” Depois, naroman iha."
                        }
                    }
                }
            };
        }

        els.loadingState.classList.add('hidden');
        els.readerView.classList.remove('hidden');

        populateBookDropdown();
        handleUrlReference();
    }

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

    function updateLayoutMode() {
        if (showNlt) {
            els.mainContainer.classList.remove('max-w-4xl');
            els.mainContainer.classList.add('max-w-6xl');
            if (els.headerInner) {
                els.headerInner.classList.remove('max-w-4xl');
                els.headerInner.classList.add('max-w-6xl');
            }
            if (els.parallelHeader) {
                els.parallelHeader.classList.remove('hidden');
                els.parallelHeader.classList.add('hidden', 'md:grid');
            }
        } else {
            els.mainContainer.classList.remove('max-w-6xl');
            els.mainContainer.classList.add('max-w-4xl');
            if (els.headerInner) {
                els.headerInner.classList.remove('max-w-6xl');
                els.headerInner.classList.add('max-w-4xl');
            }
            if (els.parallelHeader) {
                els.parallelHeader.classList.add('hidden');
                els.parallelHeader.classList.remove('md:grid');
            }
        }
    }

    window.renderChapter = async function (bookName, chap, highlightVerses = []) {
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

        updateLayoutMode();

        const chapterData = bibleData[currentBookName][currentChapter];
        const verses = chapterData.verses || {};
        const verseNums = Object.keys(verses).sort((a, b) => Number(a) - Number(b));

        // 1) 먼저 테툼어 본문(및 NLT 로딩 표시)을 즉시 화면에 출력해 반응성 확보
        let html = '';
        if (chapterData.title) {
            html += `<h4 class="font-bold text-amber-700 text-lg mb-3 mt-2 border-b pb-1">${chapterData.title}</h4>`;
        }

        html += verseNums.map(vNum => {
            const isHighlighted = highlightVerses.includes(Number(vNum));
            const highlightClass = isHighlighted ? 'verse-highlight bg-amber-50 p-2 rounded' : '';
            // 특수 깨짐 기호() 자동 제거 및 빈 본문 안내 처리
            const rawVerse = (verses[vNum] || '').replace(/\uFFFD/g, '').trim();
            const verseText = rawVerse || '<span class="text-slate-400 italic text-sm">(Tekstu la iha)</span>';

            if (showNlt) {
                return `
                    <div id="v-${vNum}" class="parallel-verse-row ${highlightClass}">
                        <p class="leading-relaxed text-slate-800 m-0">
                            <sup class="font-sans font-bold text-amber-600 mr-1.5 select-none">${vNum}</sup>${verseText}
                        </p>
                        <p id="nlt-v-${vNum}" class="parallel-eng leading-relaxed m-0 text-slate-400 italic text-sm">
                            Loading NLT...
                        </p>
                    </div>
                `;
            }

            return `
                <p id="v-${vNum}" class="leading-relaxed mb-2 ${highlightClass}">
                    <sup class="font-sans font-bold text-amber-600 mr-1.5 select-none">${vNum}</sup>${verseText}
                </p>
            `;
        }).join('');

        els.versesContainer.innerHTML = html;
        els.searchView.classList.add('hidden');
        els.readerView.classList.remove('hidden');

        // 2) NLT가 켜져 있으면 비동기로 영문 데이터를 받아 각 절의 오른쪽/아래칸에 채워 넣기
        if (showNlt) {
            const engData = await fetchEnglishChapter(currentBookName, currentChapter);
            if (els.engHeaderLabel) {
                els.engHeaderLabel.textContent = `English (${engData.version})`;
            }

            verseNums.forEach(vNum => {
                const engEl = document.getElementById(`nlt-v-${vNum}`);
                if (!engEl) return;

                if (engData.verses && engData.verses[vNum]) {
                    engEl.classList.remove('text-slate-400', 'italic', 'text-sm');
                    engEl.innerHTML = `<sup class="font-sans font-semibold text-slate-400 mr-1.5 select-none md:hidden">${vNum}</sup>${engData.verses[vNum]}`;
                } else if (engData.verses === null) {
                    engEl.textContent = '(English text unavailable offline)';
                } else {
                    engEl.textContent = '';
                }
            });
        }

        if (highlightVerses.length > 0) {
            const targetEl = document.getElementById(`v-${highlightVerses[0]}`);
            if (targetEl) {
                setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }
        } else {
            els.mainContainer.scrollTop = 0;
        }
    };

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

    function normalizeText(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function buildAccentInsensitiveRegex(query) {
        const accentMap = {
            'a': '[aáàãâä]', 'e': '[eéèêë]', 'i': '[iíìîï]',
            'o': '[oóòõôö]', 'u': '[uúùûü]', 'c': '[cç]', 'n': '[nñ]'
        };
        const normalizedQuery = normalizeText(query);
        const pattern = normalizedQuery.split('').map(char => {
            if (accentMap[char]) return accentMap[char];
            return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }).join('');
        return new RegExp(`(${pattern})`, 'gi');
    }

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

    function bindEvents() {
        if (els.toggleNltBtn) {
            els.toggleNltBtn.addEventListener('click', () => {
                showNlt = !showNlt;
                if (showNlt) {
                    els.toggleNltBtn.classList.remove('border-slate-300', 'text-slate-600');
                    els.toggleNltBtn.classList.add('border-amber-500', 'bg-amber-100', 'text-amber-900');
                    els.toggleNltBtn.textContent = '✓ NLT';
                } else {
                    els.toggleNltBtn.classList.add('border-slate-300', 'text-slate-600');
                    els.toggleNltBtn.classList.remove('border-amber-500', 'bg-amber-100', 'text-amber-900');
                    els.toggleNltBtn.textContent = '+ NLT';
                }
                window.renderChapter(currentBookName, currentChapter);
            });
        }

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