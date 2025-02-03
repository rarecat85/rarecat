const button = document.querySelector("button");

function clickHandler() {
    console.log("클릭 이벤트 실행!");
}

const debouncedClickHandler = debounce(clickHandler, 2000);

button.addEventListener("click", debouncedClickHandler);

// 사용자가 버튼을 빠르게 여러 번 클릭한다고 가정
// 1초 후 (delay보다 짧음) → 다시 클릭 발생 → 기존 타이머 제거 & 새 타이머 설정
// 2초 동안 추가 클릭이 없다면 "클릭 이벤트 실행!"이 로그됨.

function debounce(func, delay) {
  let timer;
  return function (...args) {
      if (timer) clearTimeout(timer);  // 기존 타이머 제거
      timer = setTimeout(() => func.apply(this, args), delay); // 새 타이머 설정
  };
}