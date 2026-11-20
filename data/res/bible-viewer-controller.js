/**
 * bible-viewer-controller.js
 * Bíblia Tetun & English (NLT) Parallel Bible Viewer Controller
 *
 * 주요 개선 사항:
 * 1. tetun_bible.json의 3자리 코드("GEN"~"REV")와 테툼어/영문 책 이름을 모두 안전하게 매핑
 * 2. 구약/신약 판별(getTestament) 시 코드와 책 이름 모두 지원
 * 3. NLT 외부 API 호출(bolls.life -> bible-api.com WEB 폴백) 및 로컬 JSON(data/res/nlt_bible.json) 우선 지원
 * 4. 비동기 장 전환 시 레이스 컨디션(이전 장 데이터가 늦게 도착해 덮어쓰는 현상) 방지
 * 5. #parallelHeader 및 .parallel-verse-row의 좌(Tetun)/우(NLT) 2열 그리드 및 경계선 정렬 통일
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. 성경 메타데이터 및 매핑 테이블 (66권 전체)
    // =========================================================================
    const BIBLE_BOOKS_META = [
        // 구약 (Old Testament: 1 ~ 39)
        { num: 1,  code: 'GEN', tetun: 'Jénesis',        en: 'Genesis',         testament: 'OT', aliases: ['Genesis', 'Jenesis', 'Jénesis'] },
        { num: 2,  code: 'EXO', tetun: 'Ézodu',          en: 'Exodus',          testament: 'OT', aliases: ['Exodus', 'Exodu', 'Ézodu', 'Ezodu'] },
        { num: 3,  code: 'LEV', tetun: 'Levítiku',       en: 'Leviticus',       testament: 'OT', aliases: ['Leviticus', 'Levitiku', 'Levítiku'] },
        { num: 4,  code: 'NUM', tetun: 'Númeru',         en: 'Numbers',         testament: 'OT', aliases: ['Numbers', 'Numeru', 'Númeru'] },
        { num: 5,  code: 'DEU', tetun: 'Deuteronómiu',   en: 'Deuteronomy',     testament: 'OT', aliases: ['Deuteronomy', 'Deuteronomiu', 'Deuteronómiu'] },
        { num: 6,  code: 'JOS', tetun: 'Josué',          en: 'Joshua',          testament: 'OT', aliases: ['Joshua', 'Josue', 'Josué'] },
        { num: 7,  code: 'JDG', tetun: 'Juís sira',      en: 'Judges',          testament: 'OT', aliases: ['Judges', 'Juis', 'Juís', 'Juís sira'] },
        { num: 8,  code: 'RUT', tetun: 'Rute',           en: 'Ruth',            testament: 'OT', aliases: ['Ruth', 'Rute'] },
        { num: 9,  code: '1SA', tetun: '1 Samuél',       en: '1 Samuel',        testament: 'OT', aliases: ['1 Samuel', '1Samuel', '1 Samuel', '1 Samuél', '1Samuél'] },
        { num: 10, code: '2SA', tetun: '2 Samuél',       en: '2 Samuel',        testament: 'OT', aliases: ['2 Samuel', '2Samuel', '2 Samuél', '2Samuél'] },
        { num: 11, code: '1KI', tetun: '1 Liurai sira',  en: '1 Kings',         testament: 'OT', aliases: ['1 Kings', '1Kings', '1 Liurai', '1 Liurai sira', '1 Reis'] },
        { num: 12, code: '2KI', tetun: '2 Liurai sira',  en: '2 Kings',         testament: 'OT', aliases: ['2 Kings', '2Kings', '2 Liurai', '2 Liurai sira', '2 Reis'] },
        { num: 13, code: '1CH', tetun: '1 Krónika',      en: '1 Chronicles',    testament: 'OT', aliases: ['1 Chronicles', '1Chronicles', '1 Kronika', '1 Krónika'] },
        { num: 14, code: '2CH', tetun: '2 Krónika',      en: '2 Chronicles',    testament: 'OT', aliases: ['2 Chronicles', '2Chronicles', '2 Kronika', '2 Krónika'] },
        { num: 15, code: 'EZR', tetun: 'Esdras',         en: 'Ezra',            testament: 'OT', aliases: ['Ezra', 'Esdras'] },
        { num: 16, code: 'NEH', tetun: 'Neemias',        en: 'Nehemiah',        testament: 'OT', aliases: ['Nehemiah', 'Neemias'] },
        { num: 17, code: 'EST', tetun: 'Ester',          en: 'Esther',          testament: 'OT', aliases: ['Esther', 'Ester'] },
        { num: 18, code: 'JOB', tetun: 'Job',            en: 'Job',             testament: 'OT', aliases: ['Job'] },
        { num: 19, code: 'PSA', tetun: 'Salmu',          en: 'Psalms',          testament: 'OT', aliases: ['Psalms', 'Psalm', 'Salmu', 'Salmus'] },
        { num: 20, code: 'PRO', tetun: 'Provérbiu',      en: 'Proverbs',        testament: 'OT', aliases: ['Proverbs', 'Proverbiu', 'Provérbiu'] },
        { num: 21, code: 'ECC', tetun: 'Ekleziastes',    en: 'Ecclesiastes',    testament: 'OT', aliases: ['Ecclesiastes', 'Ekleziastes'] },
        { num: 22, code: 'SNG', tetun: 'Kántiku',        en: 'Song of Solomon', testament: 'OT', aliases: ['Song of Solomon', 'Song of Songs', 'Kantiku', 'Kántiku', 'Canticles'] },
        { num: 23, code: 'ISA', tetun: 'Isaías',         en: 'Isaiah',          testament: 'OT', aliases: ['Isaiah', 'Isaias', 'Isaías'] },
        { num: 24, code: 'JER', tetun: 'Jeremias',       en: 'Jeremiah',        testament: 'OT', aliases: ['Jeremiah', 'Jeremias'] },
        { num: 25, code: 'LAM', tetun: 'Lamentasaun',    en: 'Lamentations',    testament: 'OT', aliases: ['Lamentations', 'Lamentasaun'] },
        { num: 26, code: 'EZK', tetun: 'Ezekiel',        en: 'Ezekiel',         testament: 'OT', aliases: ['Ezekiel', 'Ezequiel'] },
        { num: 27, code: 'DAN', tetun: 'Daniél',         en: 'Daniel',          testament: 'OT', aliases: ['Daniel', 'Daniél'] },
        { num: 28, code: 'HOS', tetun: 'Ozeias',         en: 'Hosea',           testament: 'OT', aliases: ['Hosea', 'Ozeias', 'Oseias'] },
        { num: 29, code: 'JOL', tetun: 'Joél',           en: 'Joel',            testament: 'OT', aliases: ['Joel', 'Joél'] },
        { num: 30, code: 'AMO', tetun: 'Amós',           en: 'Amos',            testament: 'OT', aliases: ['Amos', 'Amós'] },
        { num: 31, code: 'OBA', tetun: 'Abdias',         en: 'Obadiah',         testament: 'OT', aliases: ['Obadiah', 'Abdias'] },
        { num: 32, code: 'JON', tetun: 'Jonas',          en: 'Jonah',           testament: 'OT', aliases: ['Jonah', 'Jonas'] },
        { num: 33, code: 'MIC', tetun: 'Miqueias',       en: 'Micah',           testament: 'OT', aliases: ['Micah', 'Miqueias', 'Mikeias'] },
        { num: 34, code: 'NAM', tetun: 'Naum',           en: 'Nahum',           testament: 'OT', aliases: ['Nahum', 'Naum'] },
        { num: 35, code: 'HAB', tetun: 'Habakuk',        en: 'Habakkuk',        testament: 'OT', aliases: ['Habakkuk', 'Habakuk'] },
        { num: 36, code: 'ZEP', tetun: 'Sofonias',       en: 'Zephaniah',       testament: 'OT', aliases: ['Zephaniah', 'Sofonias'] },
        { num: 37, code: 'HAG', tetun: 'Ageu',           en: 'Haggai',          testament: 'OT', aliases: ['Haggai', 'Ageu'] },
        { num: 38, code: 'ZEC', tetun: 'Zacarias',       en: 'Zechariah',       testament: 'OT', aliases: ['Zechariah', 'Zacarias', 'Zakarias'] },
        { num: 39, code: 'MAL', tetun: 'Malaquias',      en: 'Malachi',         testament: 'OT', aliases: ['Malachi', 'Malaquias', 'Malakias'] },

        // 신약 (New Testament: 40 ~ 66)
        { num: 40, code: 'MAT', tetun: 'Mateus',         en: 'Matthew',         testament: 'NT', aliases: ['Matthew', 'Mateus'] },
        { num: 41, code: 'MRK', tetun: 'Marcos',         en: 'Mark',            testament: 'NT', aliases: ['Mark', 'Marcos', 'Markus'] },
        { num: 42, code: 'LUK', tetun: 'Lucas',          en: 'Luke',            testament: 'NT', aliases: ['Luke', 'Lucas', 'Lukas'] },
        { num: 43, code: 'JHN', tetun: 'João',           en: 'John',            testament: 'NT', aliases: ['John', 'Joao', 'João'] },
        { num: 44, code: 'ACT', tetun: 'Apóstolu sira',  en: 'Acts',            testament: 'NT', aliases: ['Acts', 'Apostolu', 'Apóstolu', 'Apóstolu sira'] },
        { num: 45, code: 'ROM', tetun: 'Roma',           en: 'Romans',          testament: 'NT', aliases: ['Romans', 'Roma'] },
        { num: 46, code: '1CO', tetun: '1 Korintu',      en: '1 Corinthians',   testament: 'NT', aliases: ['1 Corinthians', '1Corinthians', '1 Korintu', '1 Corintios'] },
        { num: 47, code: '2CO', tetun: '2 Korintu',      en: '2 Corinthians',   testament: 'NT', aliases: ['2 Corinthians', '2Corinthians', '2 Korintu', '2 Corintios'] },
        { num: 48, code: 'GAL', tetun: 'Galásia',        en: 'Galatians',       testament: 'NT', aliases: ['Galatians', 'Galasia', 'Galásia'] },
        { num: 49, code: 'EPH', tetun: 'Éfezu',          en: 'Ephesians',       testament: 'NT', aliases: ['Ephesians', 'Efezu', 'Éfezu'] },
        { num: 50, code: 'PHP', tetun: 'Filipi',         en: 'Philippians',     testament: 'NT', aliases: ['Philippians', 'Filipi'] },
        { num: 51, code: 'COL', tetun: 'Kolose',         en: 'Colossians',      testament: 'NT', aliases: ['Colossians', 'Kolose'] },
        { num: 52, code: '1TH', tetun: '1 Tesalónika',   en: '1 Thessalonians', testament: 'NT', aliases: ['1 Thessalonians', '1Thessalonians', '1 Tesalonika', '1 Tesalónika'] },
        { num: 53, code: '2TH', tetun: '2 Tesalónika',   en: '2 Thessalonians', testament: 'NT', aliases: ['2 Thessalonians', '2Thessalonians', '2 Tesalonika', '2 Tesalónika'] },
        { num: 54, code: '1TI', tetun: '1 Timóteo',      en: '1 Timothy',       testament: 'NT', aliases: ['1 Timothy', '1Timothy', '1 Timoteo', '1 Timóteo'] },
        { num: 55, code: '2TI', tetun: '2 Timóteo',      en: '2 Timothy',       testament: 'NT', aliases: ['2 Timothy', '2Timothy', '2 Timoteo', '2 Timóteo'] },
        { num: 56, code: 'TIT', tetun: 'Tito',           en: 'Titus',           testament: 'NT', aliases: ['Titus', 'Tito', 'Titu'] },
        { num: 57, code: 'PHM', tetun: 'Filemon',        en: 'Philemon',        testament: 'NT', aliases: ['Philemon', 'Filemon'] },
        { num: 58, code: 'HEB', tetun: 'Ebreu',          en: 'Hebrews',         testament: 'NT', aliases: ['Hebrews', 'Ebreu'] },
        { num: 59, code: 'JAS', tetun: 'Tiago',          en: 'James',           testament: 'NT', aliases: ['James', 'Tiago'] },
        { num: 60, code: '1PE', tetun: '1 Pedro',        en: '1 Peter',         testament: 'NT', aliases: ['1 Peter', '1Peter', '1 Pedro'] },
        { num: 61, code: '2PE', tetun: '2 Pedro',        en: '2 Peter',         testament: 'NT', aliases: ['2 Peter', '2Peter', '2 Pedro'] },
        { num: 62, code: '1JN', tetun: '1 João',         en: '1 John',          testament: 'NT', aliases: ['1 John', '1John', '1 Joao', '1 João'] },
        { num: 63, code: '2JN', tetun: '2 João',         en: '2 John',          testament: 'NT', aliases: ['2 John', '2John', '2 Joao', '2 João'] },
        { num: 64, code: '3JN', tetun: '3 João',         en: '3 John',          testament: 'NT', aliases: ['3 John', '3John', '3 Joao', '3 João'] },
        { num: 65, code: 'JUD', tetun: 'Judas',          en: 'Jude',            testament: 'NT', aliases: ['Jude', 'Judas'] },
        { num: 66, code: 'REV', tetun: 'Apokalipse',     en: 'Revelation',      testament: 'NT', aliases: ['Revelation', 'Apokalipse', 'Apocalipse'] }
    ];

    // =========================================================================
    // 2. 전역 상태 및 캐시
    // =========================================================================
    let bibleData = {};             // 테툼어 성경 JSON 데이터
    const englishChapterCache = {}; // 메모리 캐시: { "GEN_1": { version: "NLT", verses: { "1": "..." } } }

    let currentBookName = 'GEN';
    let currentChapter = '1';
    let showNlt = false;
    let fontSize = 18;
    let renderRequestId = 0;        // 비동기 렌더링 경합 방지용 시퀀스 ID

    // DOM 참조 캐시
    let els = {};

    // =========================================================================
    // 3. 유틸리티 및 책 정보 해석 함수
    // =========================================================================

    /**
     * 로컬 NLT JSON 확인 (404 콘솔 오류 방지를 위해 window.NLT_BIBLE_DATA 전역 변수만 확인)
     */
    async function loadLocalNltIfAvailable() {
        if (window.NLT_BIBLE_DATA && typeof window.NLT_BIBLE_DATA === 'object') {
            return window.NLT_BIBLE_DATA;
        }
        return null;
    }

    /**
     * 타임아웃 지원 fetch 헬퍼
     */
    async function fetchWithTimeout(url, timeoutMs = 8000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            return await fetch(url, { signal: controller.signal });
        } finally {
            clearTimeout(timer);
        }
    }

    /**
     * 영어 성경(NLT 우선, 실패 시 WEB 폴백) 장 단위 조회
     */
    async function fetchEnglishChapter(bookKey, chapterNum) {
        const info = resolveEnglishBookInfo(bookKey);
        const cacheKey = `${info ? info.code : bookKey}_${chapterNum}`;

        if (englishChapterCache[cacheKey]) {
            return englishChapterCache[cacheKey];
        }

        console.info(`[BibleViewer] Fetching English chapter for ${cacheKey}...`, info);

        // 0순위: 전역 주입된 로컬 NLT 데이터 확인
        const localData = await loadLocalNltIfAvailable();
        if (localData && info) {
            const bookObj = localData[info.code] || localData[info.en] || localData[bookKey];
            if (bookObj && bookObj[String(chapterNum)]) {
                const result = {
                    version: 'NLT',
                    verses: bookObj[String(chapterNum)]
                };
                englishChapterCache[cacheKey] = result;
                return result;
            }
        }

        // 1순위: Bolls.life API (NLT)
        if (info && info.num) {
            try {
                const nltUrl = `https://bolls.life/get-text/NLT/${info.num}/${chapterNum}/`;
                const res = await fetchWithTimeout(nltUrl, 8000);
                if (res.ok) {
                    const list = await res.json();
                    if (Array.isArray(list) && list.length > 0) {
                        const versesMap = {};
                        list.forEach(item => {
                            if (item && item.verse != null && item.text != null) {
                                const cleanText = String(item.text)
                                    .replace(/<br\s*\/?>/gi, ' ')
                                    .replace(/<\/?[^>]+(>|$)/g, '')
                                    .replace(/\s+/g, ' ')
                                    .trim();
                                versesMap[String(item.verse)] = cleanText;
                            }
                        });
                        if (Object.keys(versesMap).length > 0) {
                            console.info(`[BibleViewer] Bolls NLT loaded (${Object.keys(versesMap).length} verses)`);
                            const result = { version: 'NLT', verses: versesMap };
                            englishChapterCache[cacheKey] = result;
                            return result;
                        }
                    }
                } else {
                    console.warn(`[BibleViewer] Bolls NLT HTTP ${res.status}`);
                }
            } catch (err) {
                console.warn(`[BibleViewer] Bolls NLT fetch failed for ${cacheKey}, trying fallback:`, err);
            }
        }

        // 2순위: bible-api.com (WEB - World English Bible 폴백)
        if (info && info.en) {
            try {
                const query = encodeURIComponent(`${info.en} ${chapterNum}`);
                const fallbackUrl = `https://bible-api.com/${query}?translation=web`;
                const res = await fetchWithTimeout(fallbackUrl, 8000);
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.verses) && data.verses.length > 0) {
                        const versesMap = {};
                        data.verses.forEach(v => {
                            if (v && v.verse != null && v.text != null) {
                                versesMap[String(v.verse)] = String(v.text).replace(/\s+/g, ' ').trim();
                            }
                        });
                        if (Object.keys(versesMap).length > 0) {
                            console.info(`[BibleViewer] Fallback WEB loaded (${Object.keys(versesMap).length} verses)`);
                            const result = { version: 'WEB', verses: versesMap };
                            englishChapterCache[cacheKey] = result;
                            return result;
                        }
                    }
                } else {
                    console.warn(`[BibleViewer] Fallback bible-api HTTP ${res.status}`);
                }
            } catch (err) {
                console.error(`[BibleViewer] Fallback bible-api fetch failed for ${cacheKey}:`, err);
            }
        }

        console.error(`[BibleViewer] All English sources failed for ${cacheKey}`);
        return { version: 'NLT', verses: null };
    }

    // =========================================================================
    // 5. UI 레이아웃 및 스타일 동기화
    // =========================================================================

    /**
     * 동적 대조 모드 스타일 주입 (bible.html의 Tailwind 클래스와 완벽 호환)
     */
    function ensureParallelStyles() {
        if (document.getElementById('bible-parallel-dynamic-styles')) return;

        const style = document.createElement('style');
        style.id = 'bible-parallel-dynamic-styles';
        style.textContent = `
            .parallel-verse-row {
                display: grid;
                grid-template-columns: 1fr;
                gap: 0.75rem;
                padding: 0.875rem 0;
                border-bottom: 1px solid #f1f5f9;
            }
            @media (min-width: 768px) {
                .parallel-verse-row {
                    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    gap: 1.5rem; /* md:gap-6 (24px) 일치 */
                }
                .parallel-eng-col {
                    padding-left: 1.5rem; /* pl-6 (24px) 일치 */
                    border-left: 1px solid #e2e8f0; /* border-l border-slate-200 일치 */
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 대조 모드 헤더 및 버튼 활성 상태 업데이트
     */
    function updateLayoutMode() {
        // 1) 상단 대조 헤더 표시/숨김 제어
        if (els.parallelHeader) {
            if (showNlt) {
                els.parallelHeader.classList.remove('hidden');
                els.parallelHeader.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-2', 'md:gap-6');
            } else {
                els.parallelHeader.classList.add('hidden');
                els.parallelHeader.classList.remove('grid');
            }
        }

        // 2) 본문 컨테이너 너비 확장 (대조 모드일 때 넓게 표시)
        if (els.readerContainer) {
            if (showNlt) {
                els.readerContainer.classList.remove('max-w-3xl');
                els.readerContainer.classList.add('max-w-6xl');
            } else {
                els.readerContainer.classList.remove('max-w-6xl');
                els.readerContainer.classList.add('max-w-3xl');
            }
        }

        // 3) + NLT 토글 버튼 스타일 업데이트
        if (els.toggleNltBtn) {
            els.toggleNltBtn.setAttribute('aria-pressed', String(showNlt));
            if (showNlt) {
                els.toggleNltBtn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
                els.toggleNltBtn.classList.remove('text-slate-600', 'border-slate-300', 'hover:bg-slate-100');
                els.toggleNltBtn.textContent = '✓ NLT';
            } else {
                els.toggleNltBtn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                els.toggleNltBtn.classList.add('text-slate-600', 'border-slate-300', 'hover:bg-slate-100');
                els.toggleNltBtn.textContent = '+ NLT';
            }
        }
    }

    // =========================================================================
    // 6. 책 목록 / 장 목록 / 본문 렌더링
    // =========================================================================

    /**
     * 책 선택 드롭다운(또는 사이드바) 초기화
     */
    function populateBookSelectors() {
        const availableKeys = Object.keys(bibleData);
        if (availableKeys.length === 0) return;

        // 성경 66권 표준 순서대로 정렬
        const sortedKeys = [...availableKeys].sort((a, b) => {
            const infoA = resolveEnglishBookInfo(a);
            const infoB = resolveEnglishBookInfo(b);
            const numA = infoA ? infoA.num : 999;
            const numB = infoB ? infoB.num : 999;
            return numA - numB;
        });

        if (els.bookSelect) {
            els.bookSelect.innerHTML = '';
            const otGroup = document.createElement('optgroup');
            otGroup.label = 'Testamentu Tuan (Old Testament)';
            const ntGroup = document.createElement('optgroup');
            ntGroup.label = 'Testamentu Foun (New Testament)';

            sortedKeys.forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                const info = resolveEnglishBookInfo(key);
                opt.textContent = info ? `${info.tetun} (${info.en})` : key;

                if (getTestament(key) === 'OT') {
                    otGroup.appendChild(opt);
                } else {
                    ntGroup.appendChild(opt);
                }
            });

            if (otGroup.children.length > 0) els.bookSelect.appendChild(otGroup);
            if (ntGroup.children.length > 0) els.bookSelect.appendChild(ntGroup);
            els.bookSelect.value = currentBookName;
        }
    }

    /**
     * 현재 책의 장(Chapter) 드롭다운 갱신
     */
    function populateChapterSelector(bookKey) {
        const chaptersObj = bibleData[bookKey];
        if (!chaptersObj || !els.chapterSelect) return;

        const chapterNums = Object.keys(chaptersObj).sort((a, b) => Number(a) - Number(b));
        els.chapterSelect.innerHTML = '';

        chapterNums.forEach(chap => {
            const opt = document.createElement('option');
            opt.value = chap;
            opt.textContent = `Kapítulu ${chap}`;
            els.chapterSelect.appendChild(opt);
        });

        if (!chapterNums.includes(String(currentChapter))) {
            currentChapter = chapterNums[0] || '1';
        }
        els.chapterSelect.value = String(currentChapter);
    }

    /**
     * 장 본문 렌더링 (Tetun 단독 또는 Tetun + NLT 병렬)
     */
    async function renderChapter(bookIdentifier, chapNum) {
        const resolvedKey = resolveActualDataKey(bookIdentifier);
        if (!bibleData[resolvedKey]) {
            console.error('[BibleViewer] Book not found in bibleData:', bookIdentifier);
            return;
        }

        const chaptersObj = bibleData[resolvedKey];
        const availableChaps = Object.keys(chaptersObj).sort((a, b) => Number(a) - Number(b));
        const targetChap = chaptersObj[String(chapNum)] ? String(chapNum) : (availableChaps[0] || '1');

        currentBookName = resolvedKey;
        currentChapter = targetChap;

        // 현재 렌더링 요청 고유 번호 증가 (비동기 race condition 방지)
        const thisRequestId = ++renderRequestId;

        // UI 컨트롤 동기화
        if (els.bookSelect && els.bookSelect.value !== currentBookName) {
            els.bookSelect.value = currentBookName;
        }
        populateChapterSelector(currentBookName);
        if (els.chapterSelect) {
            els.chapterSelect.value = currentChapter;
        }

        const info = resolveEnglishBookInfo(currentBookName);
        if (els.chapterTitle) {
            const tetunTitle = info ? info.tetun : currentBookName;
            const enSubtitle = (showNlt && info) ? ` / ${info.en}` : '';
            els.chapterTitle.textContent = `${tetunTitle}${enSubtitle} ${currentChapter}`;
        }

        updateLayoutMode();
        saveViewerState();

        const versesObj = chaptersObj[currentChapter] || {};
        const verseNums = Object.keys(versesObj).sort((a, b) => Number(a) - Number(b));

        if (!els.bibleContent) {
            console.error('[BibleViewer] Target content container (#bibleContent) not found in DOM!');
            return;
        }

        // 1단계: 테툼어 본문 즉시 렌더링 (대조 모드일 경우 우측 NLT 플레이스홀더 함께 배치)
        const fragment = document.createDocumentFragment();

        verseNums.forEach(vNum => {
            const tetunText = versesObj[vNum];

            if (showNlt) {
                const row = document.createElement('div');
                row.className = 'parallel-verse-row group transition-colors hover:bg-slate-50/70 rounded px-2';

                // 좌측: 테툼어 성경
                const tetunP = document.createElement('p');
                tetunP.className = 'text-slate-800 leading-relaxed';
                tetunP.style.fontSize = `${fontSize}px`;
                tetunP.innerHTML = `<sup class="font-sans font-bold text-blue-600 mr-1.5 select-none">${vNum}</sup>${tetunText}`;

                // 우측: NLT 영어 성경 (로딩 상태 초기화)
                const engP = document.createElement('p');
                engP.id = `nlt-v-${vNum}`;
                engP.className = 'parallel-eng-col text-slate-400 italic text-sm leading-relaxed';
                engP.style.fontSize = `${fontSize}px`;
                engP.innerHTML = `<sup class="font-sans font-semibold text-slate-400 mr-1.5 select-none md:hidden">${vNum}</sup>Loading NLT...`;

                row.appendChild(tetunP);
                row.appendChild(engP);
                fragment.appendChild(row);
            } else {
                const p = document.createElement('p');
                p.className = 'mb-3 text-slate-800 leading-relaxed';
                p.style.fontSize = `${fontSize}px`;
                p.innerHTML = `<sup class="font-sans font-bold text-blue-600 mr-1.5 select-none">${vNum}</sup>${tetunText}`;
                fragment.appendChild(p);
            }
        });

        els.bibleContent.innerHTML = '';
        els.bibleContent.appendChild(fragment);

        // 이전/다음 장 버튼 상태 업데이트
        updateNavigationButtons();

        // 2단계: NLT 대조 모드가 켜져 있으면 비동기로 영어 본문을 가져와 우측 열 채우기
        if (showNlt) {
            if (els.engHeaderLabel) {
                els.engHeaderLabel.textContent = 'English (Loading NLT...)';
            }

            const engData = await fetchEnglishChapter(currentBookName, currentChapter);

            // 비동기 대기 중 사용자가 다른 장으로 이동했거나 NLT를 껐다면 중단
            if (thisRequestId !== renderRequestId || !showNlt) return;

            if (els.engHeaderLabel) {
                els.engHeaderLabel.textContent = `English (${engData.version})`;
            }

            verseNums.forEach(vNum => {
                const engEl = document.getElementById(`nlt-v-${vNum}`);
                if (!engEl) return;

                if (engData.verses && engData.verses[vNum]) {
                    engEl.classList.remove('text-slate-400', 'italic', 'text-sm');
                    engEl.classList.add('text-slate-700');
                    engEl.innerHTML = `<sup class="font-sans font-semibold text-slate-400 mr-1.5 select-none md:hidden">${vNum}</sup>${engData.verses[vNum]}`;
                } else if (engData.verses === null) {
                    engEl.classList.add('text-slate-400', 'italic', 'text-sm');
                    engEl.textContent = '(English NLT/WEB service unavailable - check network)';
                } else {
                    // 특정 절 번호가 NLT에 병합/생략된 경우 빈 칸 처리
                    engEl.classList.add('text-slate-300', 'italic', 'text-xs');
                    engEl.textContent = '—';
                }
            });
        }
    }

    // =========================================================================
    // 7. 내비게이션(이전/다음 장) 및 상태 저장
    // =========================================================================

    function getOrderedBookKeys() {
        return Object.keys(bibleData).sort((a, b) => {
            const infoA = resolveEnglishBookInfo(a);
            const infoB = resolveEnglishBookInfo(b);
            return (infoA ? infoA.num : 999) - (infoB ? infoB.num : 999);
        });
    }

    function navigateChapter(delta) {
        const books = getOrderedBookKeys();
        const currentBookIdx = books.indexOf(currentBookName);
        if (currentBookIdx === -1) return;

        const chaps = Object.keys(bibleData[currentBookName]).sort((a, b) => Number(a) - Number(b));
        const currentChapIdx = chaps.indexOf(String(currentChapter));

        if (delta > 0) {
            if (currentChapIdx < chaps.length - 1) {
                renderChapter(currentBookName, chaps[currentChapIdx + 1]);
            } else if (currentBookIdx < books.length - 1) {
                const nextBook = books[currentBookIdx + 1];
                const nextChaps = Object.keys(bibleData[nextBook]).sort((a, b) => Number(a) - Number(b));
                renderChapter(nextBook, nextChaps[0] || '1');
            }
        } else if (delta < 0) {
            if (currentChapIdx > 0) {
                renderChapter(currentBookName, chaps[currentChapIdx - 1]);
            } else if (currentBookIdx > 0) {
                const prevBook = books[currentBookIdx - 1];
                const prevChaps = Object.keys(bibleData[prevBook]).sort((a, b) => Number(a) - Number(b));
                renderChapter(prevBook, prevChaps[prevChaps.length - 1] || '1');
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateNavigationButtons() {
        const books = getOrderedBookKeys();
        const bookIdx = books.indexOf(currentBookName);
        const chaps = bibleData[currentBookName]
            ? Object.keys(bibleData[currentBookName]).sort((a, b) => Number(a) - Number(b))
            : [];
        const chapIdx = chaps.indexOf(String(currentChapter));

        const isFirst = bookIdx <= 0 && chapIdx <= 0;
        const isLast = bookIdx >= books.length - 1 && chapIdx >= chaps.length - 1;

        if (els.prevChapterBtn) els.prevChapterBtn.disabled = isFirst;
        if (els.nextChapterBtn) els.nextChapterBtn.disabled = isLast;
    }

    function saveViewerState() {
        try {
            localStorage.setItem('tetun_bible_viewer_state', JSON.stringify({
                book: currentBookName,
                chapter: currentChapter,
                showNlt: showNlt,
                fontSize: fontSize
            }));
        } catch (_) {
            // 프라이빗 모드 등에서 localStorage 접근 차단 시 무시
        }
    }

    function restoreViewerState() {
        try {
            const raw = localStorage.getItem('tetun_bible_viewer_state');
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (saved.book) currentBookName = saved.book;
            if (saved.chapter) currentChapter = String(saved.chapter);
            if (typeof saved.showNlt === 'boolean') showNlt = saved.showNlt;
            if (typeof saved.fontSize === 'number') fontSize = saved.fontSize;
        } catch (_) {
            // 파싱 오류 시 기본값 유지
        }
    }

    // =========================================================================
    // 8. 초기화 및 이벤트 바인딩
    // =========================================================================

    function bindDomElements() {
        els = {
            bookSelect: document.getElementById('bookSelect'),
            chapterSelect: document.getElementById('chapterSelect'),
            chapterTitle: document.getElementById('chapterTitle'),
            bibleContent: document.getElementById('bibleContent')
                || document.getElementById('versesContainer')
                || document.getElementById('chapterContent')
                || document.querySelector('main'),
            parallelHeader: document.getElementById('parallelHeader'),
            engHeaderLabel: document.getElementById('engHeaderLabel'),
            toggleNltBtn: document.getElementById('toggleNltBtn') || document.querySelector('[data-action="toggle-nlt"]'),
            prevChapterBtn: document.getElementById('prevChapterBtn'),
            nextChapterBtn: document.getElementById('nextChapterBtn'),
            fontIncreaseBtn: document.getElementById('fontIncreaseBtn'),
            fontDecreaseBtn: document.getElementById('fontDecreaseBtn'),
            readerContainer: document.getElementById('readerContainer')
        };

        console.info('[BibleViewer] Bound DOM elements:', {
            hasBibleContent: Boolean(els.bibleContent),
            bibleContentId: els.bibleContent ? els.bibleContent.id : null,
            hasParallelHeader: Boolean(els.parallelHeader),
            hasToggleNltBtn: Boolean(els.toggleNltBtn)
        });
    }

    function bindEvents() {
        if (els.bookSelect) {
            els.bookSelect.addEventListener('change', (e) => {
                const selectedBook = e.target.value;
                const chaps = Object.keys(bibleData[selectedBook] || {}).sort((a, b) => Number(a) - Number(b));
                renderChapter(selectedBook, chaps[0] || '1');
            });
        }

        if (els.chapterSelect) {
            els.chapterSelect.addEventListener('change', (e) => {
                renderChapter(currentBookName, e.target.value);
            });
        }

        if (els.toggleNltBtn) {
            els.toggleNltBtn.addEventListener('click', () => {
                showNlt = !showNlt;
                renderChapter(currentBookName, currentChapter);
            });
        }

        if (els.prevChapterBtn) {
            els.prevChapterBtn.addEventListener('click', () => navigateChapter(-1));
        }

        if (els.nextChapterBtn) {
            els.nextChapterBtn.addEventListener('click', () => navigateChapter(1));
        }

        if (els.fontIncreaseBtn) {
            els.fontIncreaseBtn.addEventListener('click', () => {
                fontSize = Math.min(28, fontSize + 2);
                renderChapter(currentBookName, currentChapter);
            });
        }

        if (els.fontDecreaseBtn) {
            els.fontDecreaseBtn.addEventListener('click', () => {
                fontSize = Math.max(14, fontSize - 2);
                renderChapter(currentBookName, currentChapter);
            });
        }
    }

    async function initBibleViewer() {
        ensureParallelStyles();
        bindDomElements();
        restoreViewerState();

        // URL 쿼리 파라미터 지원 (?book=GEN&chapter=1&nlt=1)
        const params = new URLSearchParams(window.location.search);
        if (params.get('book')) currentBookName = params.get('book');
        if (params.get('chapter')) currentChapter = params.get('chapter');
        if (params.get('nlt') === '1' || params.get('nlt') === 'true') showNlt = true;

        try {
            await loadTetunBible();
            currentBookName = resolveActualDataKey(currentBookName);
            populateBookSelectors();
            bindEvents();
            await renderChapter(currentBookName, currentChapter);
        } catch (err) {
            console.error('[BibleViewer] Initialization error:', err);
            if (els.bibleContent) {
                els.bibleContent.innerHTML = `
                    <div class="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <p class="font-bold mb-1">La konsege loke dadus Bíblia nian (Failed to load Bible data).</p>
                        <p class="text-xs text-red-600">${err.message}</p>
                    </div>
                `;
            }
        }
    }

    // 전역 디버깅 및 외부 제어용 노출
    window.BibleViewer = {
        renderChapter,
        toggleNlt: () => {
            showNlt = !showNlt;
            renderChapter(currentBookName, currentChapter);
        },
        setNlt: (enabled) => {
            showNlt = Boolean(enabled);
            renderChapter(currentBookName, currentChapter);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBibleViewer);
    } else {
        initBibleViewer();
    }
})();