let timer; // ✅ 전역 타이머 변수 (debounce 함수 내부에서 선언하지 않음)

function debounce(func, delay) {
    return function (...args) {
        if (timer) clearTimeout(timer);  // 기존 타이머 제거
        timer = setTimeout(() => func.apply(this, args), delay); // 새 타이머 설정
    };
}

const button = document.querySelector("button");

function clickHandler() {
    console.log("클릭 이벤트 실행!");
}

const debouncedClickHandler = debounce(clickHandler, 2000);

button.addEventListener("click", debouncedClickHandler);

// 3초 후, 이벤트 리스너 제거 + 예약된 `setTimeout`도 취소
setTimeout(() => {
    console.log("이벤트 리스너 제거 및 예약된 setTimeout 취소");
    clearTimeout(timer);  // ✅ 이제 debounce 내부에서 설정된 timer와 동일함
    button.removeEventListener("click", debouncedClickHandler);
}, 3000);
