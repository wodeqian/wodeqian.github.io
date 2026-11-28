// 页面滚动淡入动画
document.addEventListener("DOMContentLoaded", function () {
  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // 卡片入场动画
  const cards = document.querySelectorAll(".article-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  });

  cards.forEach((card) => {
    observer.observe(card);
  });
});
