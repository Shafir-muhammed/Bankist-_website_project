"use strict";

///////////////////////////////////////
// elements

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const tabButtons = document.querySelectorAll(".operations__tab");

const tabContainer = document.querySelector(".operations__tab-container");

const tabContent = document.querySelectorAll(".operations__content");

const nav = document.querySelector(".nav");

const allSections = document.querySelectorAll(".section");

const lazyImages = document.querySelectorAll("img[data-src]");

//////////////////////////
//////////////////////////

// Modal window

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((current) => {
  current.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// scrolling effect

btnScrollTo.addEventListener("click", (e) => {
  const s1Cords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: "smooth" });
});

// adding scroll effect to all sections from nav links

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching Strategy

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: "smooth" });
  }
});

// tabbed component

// const tabButtons = document.querySelectorAll(".operations__tab");

// const tabContainer = document.querySelector(".operations__tab-container");

// const tabContent = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", function (e) {
  const tab = e.target.closest(".operations__tab");

  if (!tab) return;

  tabButtons.forEach((bt) => {
    bt.classList.remove("operations__tab--active");
  });
  tab.classList.add("operations__tab--active");

  tabContent.forEach((el) =>
    el.classList.remove("operations__content--active")
  );

  document
    .querySelector(`.operations__content--${tab.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Hover effect on nav links

// const nav = document.querySelector(".nav");

const hoverEffect = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", hoverEffect.bind(0.3));

nav.addEventListener("mouseout", hoverEffect.bind(1));

// STICKY NAVIGATION USING INTERSECTION-OBSERVER API

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
const header = document.querySelector(".header");

const navHeight = nav.getBoundingClientRect();

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight.height}px`
});

headerObserver.observe(header);

// section revealing loading effect

const revealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");

    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15 // we need to visible the section when intersect at 15%
});

allSections.forEach((sec) => {
  sectionObserver.observe(sec);
  sec.classList.add("section--hidden");
});

/////////////////////////////////// lAZY lOADING

// const lazyImages = document.querySelectorAll("img[data-src]");

const lazyLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    this.classList.remove("lazy-img");
  });
  observer.unobserve(this);
};

const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  treshold: 0,
  rootMargin: "200px"
});

lazyImages.forEach((item) => {
  imgObserver.observe(item);
});

/////////////////////////////////        slider      /////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();
