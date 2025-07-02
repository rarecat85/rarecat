// 전역 변수
let htmlEditor, cssEditor;
let currentTheme = 'default';
let isFullscreen = false;
let isMondrianFullscreen = false;

// 몬드리안 색상 팔레트
const mondrianColors = [
    'mondrian-red',
    'mondrian-blue', 
    'mondrian-yellow',
    'mondrian-white',
    'mondrian-black'
];

// 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
    initializeEditors();
    setupEventListeners();
    generateMondrianArtwork(); // 몬드리안 예제만 생성
    loadDefaultCode(); // 기본 환영 메시지 로드
    updatePreview();
});

// 에디터 초기화
function initializeEditors() {
    // HTML 에디터
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-code'), {
        mode: 'htmlmixed',
        theme: currentTheme,
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys: {
            'Ctrl-Space': 'autocomplete'
        }
    });

    // CSS 에디터
    cssEditor = CodeMirror.fromTextArea(document.getElementById('css-code'), {
        mode: 'css',
        theme: currentTheme,
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    });

    // 에디터 크기 조정
    setTimeout(() => {
        htmlEditor.refresh();
        cssEditor.refresh();
    }, 100);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 탭 버튼 이벤트
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    // 테마 선택 이벤트
    document.getElementById('theme-selector').addEventListener('change', function() {
        currentTheme = this.value;
        updateTheme();
    });

    // 실행 버튼 이벤트
    document.getElementById('run-btn').addEventListener('click', function() {
        updatePreview();
    });

    // 초기화 버튼 이벤트
    document.getElementById('clear-btn').addEventListener('click', function() {
        if (confirm('모든 코드를 초기화하시겠습니까?')) {
            clearAllCode();
        }
    });

    // 몬드리안 생성 버튼 이벤트
    document.getElementById('generate-mondrian-btn').addEventListener('click', function() {
        generateMondrianArtwork();
    });

    // 전체화면 버튼 이벤트들
    document.getElementById('fullscreen-preview-btn').addEventListener('click', function() {
        toggleFullscreen('preview');
    });

    document.getElementById('fullscreen-mondrian-btn').addEventListener('click', function() {
        toggleFullscreen('mondrian');
    });

    // 에디터 변경 이벤트 (실시간 미리보기)
    htmlEditor.on('change', debounce(updatePreview, 500));
    cssEditor.on('change', debounce(updatePreview, 500));

    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl + Enter: 실행
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            updatePreview();
        }
        
        // Ctrl + S: 저장 (로컬 스토리지)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveToLocalStorage();
            showNotification('코드가 저장되었습니다!');
        }
        
        // Ctrl + L: 로드 (로컬 스토리지)
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            loadFromLocalStorage();
            showNotification('저장된 코드를 불러왔습니다!');
        }

        // Ctrl + M: 새로운 몬드리안 생성
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            generateMondrianArtwork();
            showNotification('새로운 몬드리안이 생성되었습니다!');
        }
    });

    // ESC 키로 전체화면 해제
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isFullscreen) {
                toggleFullscreen('preview');
            }
            if (isMondrianFullscreen) {
                toggleFullscreen('mondrian');
            }
        }
    });
}

// 몬드리안 아트워크 생성 (빈틈없이 예쁘게)
function generateMondrianArtwork() {
    const gridSize = 4;
    const artwork = document.getElementById('mondrian-artwork');
    artwork.innerHTML = '';

    // 4x4 그리드의 각 셀 사용 여부
    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    // 블록 정보 저장
    const blocks = [];

    // 가능한 블록 크기 (가로, 세로)
    const blockTypes = [
        [2, 2], [2, 1], [1, 2], [1, 1]
    ];

    function canPlace(x, y, w, h) {
        if (x + w > gridSize || y + h > gridSize) return false;
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                if (visited[y + dy][x + dx]) return false;
            }
        }
        return true;
    }

    function markVisited(x, y, w, h) {
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                visited[y + dy][x + dx] = true;
            }
        }
    }

    // 왼쪽 위부터 순회하며 블록 배치
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (visited[y][x]) continue;
            // 가능한 블록 크기 중 랜덤하게 시도
            let shuffled = blockTypes.slice().sort(() => Math.random() - 0.5);
            let placed = false;
            for (let [w, h] of shuffled) {
                if (canPlace(x, y, w, h)) {
                    blocks.push({ x, y, w, h });
                    markVisited(x, y, w, h);
                    placed = true;
                    break;
                }
            }
            // 만약 어떤 블록도 못 놓으면 1x1로 채움
            if (!placed) {
                blocks.push({ x, y, w: 1, h: 1 });
                markVisited(x, y, 1, 1);
            }
        }
    }

    // 색상 랜덤 배정
    const colorList = [
        'mondrian-red', 'mondrian-blue', 'mondrian-yellow', 'mondrian-white', 'mondrian-black'
    ];

    blocks.forEach(block => {
        const div = document.createElement('div');
        div.className = 'mondrian-block ' + colorList[Math.floor(Math.random() * colorList.length)];
        div.style.gridColumn = `${block.x + 1} / span ${block.w}`;
        div.style.gridRow = `${block.y + 1} / span ${block.h}`;
        div.setAttribute('data-color', div.className.split(' ')[1]);
        // 클릭 시 색상 변경
        div.addEventListener('click', function() {
            const currentColor = this.getAttribute('data-color');
            const idx = colorList.indexOf(currentColor);
            const nextColor = colorList[(idx + 1) % colorList.length];
            this.className = 'mondrian-block ' + nextColor;
            this.setAttribute('data-color', nextColor);
        });
        artwork.appendChild(div);
    });
}

// 몬드리안 코드 생성
function generateMondrianCode() {
    const artwork = document.getElementById('mondrian-artwork');
    const blocks = artwork.querySelectorAll('.mondrian-block');
    
    let htmlCode = '<div class="mondrian-container">\n';
    let cssCode = '.mondrian-container {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(4, 1fr);\n  gap: 3px;\n  width: 400px;\n  height: 400px;\n  background: white;\n  border: 3px solid #000;\n  padding: 3px;\n}\n\n.mondrian-block {\n  border: 2px solid #000;\n  transition: all 0.3s ease;\n  cursor: pointer;\n}\n\n.mondrian-block:hover {\n  transform: scale(1.05);\n  box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n}\n\n';
    
    // 색상 클래스들
    cssCode += '.mondrian-red { background: #e74c3c; }\n';
    cssCode += '.mondrian-blue { background: #3498db; }\n';
    cssCode += '.mondrian-yellow { background: #f1c40f; }\n';
    cssCode += '.mondrian-white { background: white; }\n';
    cssCode += '.mondrian-black { background: #2c3e50; }\n\n';
    
    blocks.forEach((block, index) => {
        const color = block.getAttribute('data-color');
        const gridColumn = block.style.gridColumn;
        const gridRow = block.style.gridRow;
        
        htmlCode += `  <div class="mondrian-block ${color}"`;
        if (gridColumn || gridRow) {
            htmlCode += ' style="';
            if (gridColumn) htmlCode += `grid-column: ${gridColumn}; `;
            if (gridRow) htmlCode += `grid-row: ${gridRow}; `;
            htmlCode += '"';
        }
        htmlCode += `></div>\n`;
    });
    
    htmlCode += '</div>';
    
    // 에디터에 코드 설정
    htmlEditor.setValue(htmlCode);
    cssEditor.setValue(cssCode);
    
    // 미리보기 업데이트
    updatePreview();
}

// 탭 전환 함수
function switchTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 에디터 패널 숨기기
    document.querySelectorAll('.editor-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-editor`).classList.add('active');
    
    // 에디터 새로고침
    setTimeout(() => {
        if (tabName === 'html') htmlEditor.refresh();
        if (tabName === 'css') cssEditor.refresh();
    }, 100);
}

// 테마 업데이트
function updateTheme() {
    htmlEditor.setOption('theme', currentTheme);
    cssEditor.setOption('theme', currentTheme);
}

// 미리보기 업데이트
function updatePreview() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    
    const previewFrame = document.getElementById('preview-frame');
    const fullHTML = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>미리보기</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f8f9fa;
                }
                ${cssCode}
            </style>
        </head>
        <body>
            ${htmlCode}
        </body>
        </html>
    `;
    
    // iframe에 HTML 내용 설정
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(fullHTML);
    doc.close();
}

// 전체화면 토글
function toggleFullscreen(type) {
    if (type === 'preview') {
        const previewSection = document.querySelector('.preview-section');
        const fullscreenBtn = document.getElementById('fullscreen-preview-btn');
        
        if (!isFullscreen) {
            previewSection.classList.add('fullscreen');
            fullscreenBtn.textContent = '전체화면 해제';
            isFullscreen = true;
        } else {
            previewSection.classList.remove('fullscreen');
            fullscreenBtn.textContent = '전체화면';
            isFullscreen = false;
        }
    } else if (type === 'mondrian') {
        const mondrianSection = document.querySelector('.mondrian-section');
        const fullscreenBtn = document.getElementById('fullscreen-mondrian-btn');
        
        if (!isMondrianFullscreen) {
            mondrianSection.classList.add('fullscreen');
            fullscreenBtn.textContent = '전체화면 해제';
            isMondrianFullscreen = true;
        } else {
            mondrianSection.classList.remove('fullscreen');
            fullscreenBtn.textContent = '전체화면';
            isMondrianFullscreen = false;
        }
    }
}

// 모든 코드 초기화
function clearAllCode() {
    htmlEditor.setValue('');
    cssEditor.setValue('');
    updatePreview();
}

// 기본 코드 로드
function loadDefaultCode() {
    const defaultHTML = `<div class="welcome-container">
    <h1>레이아웃 연습장에 오신 것을 환영합니다!</h1>
    <p>왼쪽의 몬드리안 디자인을 참고하여 CSS Grid와 Flexbox를 연습해보세요.</p>
    <p>HTML과 CSS 코드를 작성하면 오른쪽에서 실시간으로 결과를 확인할 수 있습니다.</p>
    <button id="start-btn">연습 시작하기</button>
</div>`;

    const defaultCSS = `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
}

.welcome-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
    line-height: 1.6;
}

#start-btn {
    padding: 15px 30px;
    font-size: 1.2rem;
    background: rgba(255,255,255,0.2);
    border: 2px solid white;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 2rem;
}

#start-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}`;

    htmlEditor.setValue(defaultHTML);
    cssEditor.setValue(defaultCSS);
}

// 로컬 스토리지에 저장
function saveToLocalStorage() {
    const codeData = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('layoutEditorData', JSON.stringify(codeData));
}

// 로컬 스토리지에서 로드
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('layoutEditorData');
    if (savedData) {
        const codeData = JSON.parse(savedData);
        htmlEditor.setValue(codeData.html || '');
        cssEditor.setValue(codeData.css || '');
        updatePreview();
    }
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 알림 표시
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-size: 14px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 자동 저장 (5초마다)
setInterval(saveToLocalStorage, 5000);

// 페이지 로드 시 저장된 코드 복원
window.addEventListener('load', function() {
    const savedData = localStorage.getItem('layoutEditorData');
    if (savedData) {
        const codeData = JSON.parse(savedData);
        if (codeData.html || codeData.css) {
            if (confirm('저장된 코드가 있습니다. 불러오시겠습니까?')) {
                loadFromLocalStorage();
            }
        }
    }
});
