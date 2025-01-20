document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.center-swiper', {
    slidesPerView: 'auto', // 슬라이드를 자동 크기로 설정
    centeredSlides: true, // 슬라이드 중앙 정렬
    loop: false, // 루프 비활성화
    navigation: {
      nextEl: '.swiper-button-next', // 다음 버튼 클래스
      prevEl: '.swiper-button-prev', // 이전 버튼 클래스
    },
  });
});
