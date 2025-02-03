const button = document.querySelector("button");

function clickHandler() {
    console.log("클릭 이벤트 실행!");
}

const debouncedClickHandler = debounce(clickHandler, 2000);

button.addEventListener("click", debouncedClickHandler);

// 1초 후, 이벤트 리스너를 제거
setTimeout(() => {
    console.log("이벤트 리스너 제거");
    button.removeEventListener("click", debouncedClickHandler);
}, 3000);

function debounce(func, delay) {
  let timer;
  return function (...args) {
      if (timer) clearTimeout(timer);  // 기존 타이머 제거
      timer = setTimeout(() => func.apply(this, args), delay); // 새 타이머 설정
  };
}