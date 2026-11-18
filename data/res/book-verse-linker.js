/**
 * 기독교 서적 HTML 문서 하단에 <script src="data/res/book-verse-linker.js"></script> 를 추가하면
 * 본문 속 테툼어 성경 구절(예: Jénesis 1:1-3)을 자동으로 링크로 변환하고,
 * 클릭 시 data/res/tetun_bible.json에서 해당 구절을 읽어와 플로팅 팝업으로 보여줍니다.
 */
(function () {
    let cachedBible = null;

    // 66권 테툼어 성경 책 이름(단수/복수 및 철자 변형 포함) -> 표준 3자리 ID 매핑
    const BOOK_MAP = {
        "1 Tesalónika": "1TH", "2 Tesalónika": "2TH",
        "1 Krónikas": "1CH", "2 Krónikas": "2CH", "1 Krónika": "1CH", "2 Krónika": "2CH",
        "Deuteronómiu": "DEU", "Lamentasaun": "LAM", "Ekleziastes": "ECC", "Apokalipse": "REV",
        "1 Korinto": "1CO", "2 Korinto": "2CO", "1 Timóteo": "1TI", "2 Timóteo": "2TI",
        "1 Samuel": "1SA", "2 Samuel": "2SA",
        "1 Liurai sira": "1KI", "2 Liurai sira": "2KI", "1 Liurai": "1KI", "2 Liurai": "2KI",
        "Provérbiu": "PRO", "Malaquias": "MAL", "Malakias": "MAL",
        "Miqueias": "MIC", "Mika": "MIC", "Sofonias": "ZEP",
        "Zacarias": "ZEC", "Zakarias": "ZEC",
        "Apóstolu sira": "ACT", "Apostolu sira": "ACT", "Apostolu": "ACT",
        "Levítiku": "LEV", "Jeremias": "JER", "Ezekiel": "EZK",
        "Obadias": "OBA", "Habakuk": "HAB", "Neemias": "NEH",
        "Jénesis": "GEN", "Númeru": "NUM", "Números": "NUM",
        "Galásia": "GAL", "Filemon": "PHM",
        "1 Pedro": "1PE", "2 Pedro": "2PE",
        "1 João": "1JN", "2 João": "2JN", "3 João": "3JN",
        "Marcos": "MRK", "Markus": "MRK", "Mateus": "MAT",
        "Isaías": "ISA", "Isaias": "ISA", "Daniel": "DAN",
        "Ozeias": "HOS", "Esdras": "EZR", "Ezra": "EZR",
        "Filipe": "PHP", "Filipi": "PHP", "Kolose": "COL",
        "Exodu": "EXO", "Ézodu": "EXO", "Josué": "JOS", "Jozué": "JOS",
        "Salmu sira": "PSA", "Salmu": "PSA",
        "Kántiku": "SNG", "Kanta": "SNG",
        "Ester": "EST", "Lucas": "LUK", "Éfezu": "EPH", "Ebreu": "HEB",
        "Tiago": "JAS", "Judas": "JUD", "Jonas": "JON",
        "Juís sira": "JDG", "Juis": "JDG",
        "Rute": "RUT", "Amós": "AMO", "Naum": "NAM", "Ageu": "HAG",
        "Joel": "JOL", "João": "JHN", "Roma": "ROM", "Titu": "TIT",
        "Job": "JOB", "Jó": "JOB"
    };

    const bookNamesPattern = Object.keys(BOOK_MAP)
        .sort((a, b) => b.length - a.length)
        .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');

    const REF_REGEX = new RegExp(`\\b(${bookNamesPattern})\\s+(\\d+):(\\d+)(?:-(\\d+))?`, 'g');

    // 플로팅 팝업 카드 UI 생성
    function createPopupModal() {
        if (document.getElementById('tetun-bible-popup')) return;
        const modal = document.createElement('div');
        modal.id = 'tetun-bible-popup';
        modal.style.cssText = `
            display: none; position: fixed; bottom: 20px; right: 20px; left: 20px;
            max-width: 480px; margin: 0 auto; background: #ffffff; color: #1e293b;
            border: 1px solid #cbd5e1; border-top: 4px solid #f59e0b;
            border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);
            padding: 18px 20px; z-index: 9999; font-family: sans-serif;
        `;
        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
                <strong id="tbp-title" style="font-size:16px; color:#b45309;"></strong>
                <button id="tbp-close" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748b;">&times;</button>
            </div>
            <div id="tbp-body" style="font-size:15px; line-height:1.65; max-height:240px; overflow-y:auto; margin-bottom:12px;"></div>
            <div style="text-align:right;">
                <a id="tbp-full-link" href="#" target="_blank" style="font-size:13px; color:#d97706; font-weight:600; text-decoration:none;">
                    Lee kapítulu tomak iha Bíblia →
                </a>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('tbp-close').onclick = () => modal.style.display = 'none';
    }

    // 본문 텍스트를 탐색하여 성경 구절에 자동 링크 삽입
    function autoLinkVerses(rootElement) {
        const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) {
            if (node.parentElement && !['SCRIPT', 'STYLE', 'A', 'TEXTAREA', 'INPUT'].includes(node.parentElement.tagName)) {
                if (REF_REGEX.test(node.nodeValue)) {
                    textNodes.push(node);
                }
                REF_REGEX.lastIndex = 0;
            }
        }

        textNodes.forEach(textNode => {
            const spanWrapper = document.createElement('span');
            spanWrapper.innerHTML = textNode.nodeValue.replace(REF_REGEX, (match, book, chap, vStart, vEnd) => {
                const bookId = BOOK_MAP[book];
                const refCode = vEnd ? `${bookId}.${chap}.${vStart}-${vEnd}` : `${bookId}.${chap}.${vStart}`;
                return `<a href="bible.html?ref=${refCode}" data-bible-ref="${refCode}" data-bible-label="${match}" 
                           class="tetun-verse-link" style="color:#b45309; text-decoration:underline; text-decoration-style:dotted; font-weight:600; cursor:pointer;">${match}</a>`;
            });
            textNode.parentNode.replaceChild(spanWrapper, textNode);
        });
    }

    // 여러 상대 경로 후보에서 data/res/tetun_bible.json 안전 로드
    async function loadTetunBibleJson() {
        const paths = [
            'data/res/tetun_bible.json',
            './data/res/tetun_bible.json',
            '../data/res/tetun_bible.json',
            'data/tetun_bible.json'
        ];
        for (const path of paths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    return await res.json();
                }
            } catch (e) {
                // 다음 경로 시도
            }
        }
        throw new Error('tetun_bible.json 파일을 찾을 수 없습니다.');
    }

    // data/res/tetun_bible.json에서 구절 데이터를 가져와 팝업에 표시
    async function showVersePopup(refCode, label) {
        createPopupModal();
        const modal = document.getElementById('tetun-bible-popup');
        const titleEl = document.getElementById('tbp-title');
        const bodyEl = document.getElementById('tbp-body');
        const fullLinkEl = document.getElementById('tbp-full-link');

        titleEl.textContent = label;
        bodyEl.innerHTML = '<span style="color:#64748b;">Karrega hela...</span>';
        fullLinkEl.href = `bible.html?ref=${encodeURIComponent(refCode)}`;
        modal.style.display = 'block';

        if (!cachedBible) {
            try {
                cachedBible = await loadTetunBibleJson();
            } catch (e) {
                bodyEl.textContent = "Erro karrega data/res/tetun_bible.json.";
                return;
            }
        }

        const [bookId, chap, verseRange] = refCode.split('.');
        const [startV, endV] = verseRange.split('-').map(Number);
        const lastV = endV || startV;

        // 새 스키마 대응: cachedBible[bookId][chap][verseNum]
        const bookObj = cachedBible[bookId];
        if (!bookObj || !bookObj[chap]) {
            bodyEl.textContent = "La hetan testu ba versíkulu nee.";
            return;
        }

        // 신형(직접 절 번호 키) 및 구형(verses 서브객체) 모두 호환
        const chapterData = bookObj[chap];
        const versesObj = chapterData.verses ? chapterData.verses : chapterData;

        let html = '';
        for (let v = startV; v <= lastV; v++) {
            const text = versesObj[String(v)];
            if (text) {
                html += `<p style="margin:0 0 6px 0;"><sup style="color:#d97706; font-weight:bold; margin-right:4px;">${v}</sup>${text}</p>`;
            }
        }
        bodyEl.innerHTML = html || "Versíkulu la eziste.";
    }

    document.addEventListener('DOMContentLoaded', () => {
        autoLinkVerses(document.body);

        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('.tetun-verse-link');
            if (link) {
                e.preventDefault();
                showVersePopup(link.dataset.bibleRef, link.dataset.bibleLabel);
            }
        });
    });
})();