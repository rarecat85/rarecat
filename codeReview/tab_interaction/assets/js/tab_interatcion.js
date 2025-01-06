//click animation
const { toArray } = gsap.utils;

const tabList = toArray('.thinQ-tabs-imgbx-fixedimg-tablist li');
const tabBg = toArray('.thinQ-tabs-imgbx-bgwrap picture');
const tabCon = toArray('.thinQ-tabs-conbx-tabcon');

let changeImg = tabBg.find(li => li.classList.contains('active')); // 초기 활성화된 이미지 설정
let currentTimeline = null; // 진행 중인 타임라인 저장

tabList.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (currentTimeline) currentTimeline.progress(1); // 현재 타임라인이 진행 중이라면 강제 완료

    // 현재 활성화된 이미지의 <img> 선택
    const currentImg = changeImg.querySelector('img');

    // 클릭된 탭 활성화 처리
    tabList.forEach(t => {
      t.classList.remove('active')
      t.setAttribute('aria-selected','false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');

    // tabContent 활성화 처리
    tabCon.forEach(con => {
      con.classList.remove('active');
      con.setAttribute('tabindex','-1');
    });
    tabCon[index].classList.add('active');
    tabCon[index].setAttribute('tabindex','0');

    // 새로운 타임라인 생성 및 저장
    currentTimeline = gsap.timeline()
    .to(currentImg, {borderRadius:'100%',scale:0,duration:1})
    .eventCallback('onComplete', () => {
      // 기존 활성화 상태 제거 및 새로운 활성화 상태 추가
      tabBg.forEach(bg => bg.classList.remove('active'));
      tabBg[index].classList.add('active');

      gsap.set(currentImg, {borderRadius:'0%',scale:1}); // 이미지 초기화
      changeImg = tabBg[index]; // 활성 이미지 업데이트

      // 타임라인 완료 후 초기화
      currentTimeline = null;
    })
  })
})