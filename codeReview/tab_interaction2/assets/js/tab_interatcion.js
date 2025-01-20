const { toArray } = gsap.utils;

function tabAnimation() {
  const tabList = toArray('.thinQ-tabs-imgbx-fixedimg-tablist li');
  const tabBg = toArray('.thinQ-tabs-imgbx-bgwrap-bgimg');
  const tabCon = toArray('.thinQ-tabs-conbx-tabcon');
  const titleElement = document.querySelector('.thinQ-tabs-imgbx-fixedimg-title');
  const tabicons = toArray('.thinQ-tabs-imgbx-fixedimg-tab-icon');

  const tabTitles = [
    '"Hey, LG"',
    '"Welcome back"' 
  ];

  let changeImg = tabBg.find(li => li.classList.contains('active'));
  let currentTimeline = null;

  function animateTitle(text) {
    const splitText = text.split('');
    titleElement.textContent = '';

    splitText.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.transform = 'translateY(10px)';
      titleElement.appendChild(span);

      gsap.to(span, {opacity: 1, y: 0, delay: index * 0.05, duration: 0.2});
    });
  }

  tabList.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (currentTimeline) currentTimeline.progress(1);
  
      const currentImg = changeImg.querySelector('img');
  
      tabList.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
  
      tabCon.forEach(con => {
        con.classList.remove('active');
        con.setAttribute('tabindex', '-1');
      });
      tabCon[index].classList.add('active');
      tabCon[index].setAttribute('tabindex', '0');
  
      tabicons.forEach(icon => {
        icon.classList.remove('active');
      });
      tabicons[index].classList.add('active');
  
      animateTitle(tabTitles[index]);
  
      currentTimeline = gsap.timeline()
        .set(currentImg, { opacity:0 })
        .to(changeImg, { borderRadius: '100%', scale: 0, duration: 1 })
        .eventCallback('onComplete', () => {
          tabBg.forEach(bg => bg.classList.remove('active'));
          tabBg[index].classList.add('active');
  
          gsap.set(currentImg, { opacity:1 });
          gsap.set(changeImg, { borderRadius: '0%', scale: 1 });
          changeImg = tabBg[index];
  
          currentTimeline = null;
        });
    });
  });

}

function canvasAnimation() {
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;

  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);

  const frameCount = 38;

  const currentFrame = (index) => {
    return `./assets/frames/lifes-good-campaign-2025-live-human-lgcom-ai-home-frame-thinq-${index.toString().padStart(3, '0')}.png`;
  };

  const videoSection = { frame: 0 };

  const images = Array(frameCount + 1)
    .fill(null)
    .map((_, i) => {
      const img = new Image();
      img.src = currentFrame(i);
      return img;
    });

  const tl = gsap.to(videoSection, {
    frame: frameCount,
    snap: 'frame',
    ease: 'none',
    duration: 3,
    repeat: -1,
    yoyo: true,
    onUpdate: render,
  });

  images[0].onload = render;

  function render() {
    const currentImage = images[Math.round(videoSection.frame)];
    if (currentImage.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(currentImage, 0, 0, canvas.width / dpr, canvas.height / dpr);
    }
  }
}

function init() {
  const sections = Array.from(toArray('section'), section => section.className);

  if (sections.includes('thinQ-tabs')) {
    tabAnimation();
    canvasAnimation();
  }

}

init();
