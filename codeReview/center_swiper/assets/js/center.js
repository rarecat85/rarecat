document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.center-swiper', {
    slidesPerView: 'auto', 
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev', 
    },
    on:{
      click(s) {
        const slides = s.slides;
        const activeSlide = slides.find(slide => slide.classList.contains('swiper-slide-active'))
        const newActiveSlide = s.clickedSlide;
        if(activeSlide == newActiveSlide) {
          activeSlide.classList.remove('swiper-slide-active')
          newActiveSlide.classList.add('swiper-slide-active');
        }
        console.log(s.clickedSlide)
      }
    }
  });
});
