// 전역 변수
let htmlEditor, cssEditor, jsEditor;
let currentTheme = 'default';
let isFullscreen = false;

// 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
    initializeEditors();
    setupEventListeners();
    loadDefaultCode();
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

    // JavaScript 에디터
    jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
        mode: 'javascript',
        theme: currentTheme,
        lineNumbers: true,
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

    // 에디터 크기 조정
    setTimeout(() => {
        htmlEditor.refresh();
        cssEditor.refresh();
        jsEditor.refresh();
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

    // 전체화면 버튼 이벤트
    document.getElementById('fullscreen-btn').addEventListener('click', function() {
        toggleFullscreen();
    });

    // 에디터 변경 이벤트 (실시간 미리보기)
    htmlEditor.on('change', debounce(updatePreview, 500));
    cssEditor.on('change', debounce(updatePreview, 500));
    jsEditor.on('change', debounce(updatePreview, 500));

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
    });

    // ESC 키로 전체화면 해제
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isFullscreen) {
            toggleFullscreen();
        }
    });
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
        if (tabName === 'js') jsEditor.refresh();
    }, 100);
}

// 테마 업데이트
function updateTheme() {
    htmlEditor.setOption('theme', currentTheme);
    cssEditor.setOption('theme', currentTheme);
    jsEditor.setOption('theme', currentTheme);
}

// 미리보기 업데이트
function updatePreview() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();
    
    const previewFrame = document.getElementById('preview-frame');
    const fullHTML = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>미리보기</title>
            <style>
                ${cssCode}
            </style>
        </head>
        <body>
            ${htmlCode}
            <script>
                try {
                    ${jsCode}
                } catch (error) {
                    console.error('JavaScript 오류:', error);
                }
            </script>
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
function toggleFullscreen() {
    const previewSection = document.querySelector('.preview-section');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (!isFullscreen) {
        previewSection.classList.add('fullscreen');
        fullscreenBtn.textContent = '전체화면 해제';
        isFullscreen = true;
    } else {
        previewSection.classList.remove('fullscreen');
        fullscreenBtn.textContent = '전체화면';
        isFullscreen = false;
    }
}

// 모든 코드 초기화
function clearAllCode() {
    htmlEditor.setValue('');
    cssEditor.setValue('');
    jsEditor.setValue('');
    updatePreview();
}

// 기본 코드 로드
function loadDefaultCode() {
    const defaultHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>안녕하세요!</title>
</head>
<body>
    <div class="container">
        <h1>코드 에디터에 오신 것을 환영합니다!</h1>
        <p>HTML, CSS, JavaScript 코드를 입력하고 실시간으로 결과를 확인해보세요.</p>
        <button id="demo-btn">클릭해보세요</button>
    </div>
</body>
</html>`;

    const defaultCSS = `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
}

.container {
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
    margin-bottom: 2rem;
    opacity: 0.9;
}

#demo-btn {
    padding: 12px 24px;
    font-size: 1.1rem;
    background: rgba(255,255,255,0.2);
    border: 2px solid white;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

#demo-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}`;

    const defaultJS = `// 버튼 클릭 이벤트
document.getElementById('demo-btn').addEventListener('click', function() {
    this.textContent = '클릭됨!';
    this.style.background = 'rgba(255,255,255,0.4)';
    
    // 1초 후 원래대로 복원
    setTimeout(() => {
        this.textContent = '클릭해보세요';
        this.style.background = 'rgba(255,255,255,0.2)';
    }, 1000);
});

// 페이지 로드 시 애니메이션
window.addEventListener('load', function() {
    const elements = document.querySelectorAll('h1, p, #demo-btn');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});`;

    htmlEditor.setValue(defaultHTML);
    cssEditor.setValue(defaultCSS);
    jsEditor.setValue(defaultJS);
}

// 로컬 스토리지에 저장
function saveToLocalStorage() {
    const codeData = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('codeEditorData', JSON.stringify(codeData));
}

// 로컬 스토리지에서 로드
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('codeEditorData');
    if (savedData) {
        const codeData = JSON.parse(savedData);
        htmlEditor.setValue(codeData.html || '');
        cssEditor.setValue(codeData.css || '');
        jsEditor.setValue(codeData.js || '');
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
    const savedData = localStorage.getItem('codeEditorData');
    if (savedData) {
        const codeData = JSON.parse(savedData);
        if (codeData.html || codeData.css || codeData.js) {
            if (confirm('저장된 코드가 있습니다. 불러오시겠습니까?')) {
                loadFromLocalStorage();
            }
        }
    }
});
