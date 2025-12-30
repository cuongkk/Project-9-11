// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");

if (buttonMenuMobile) {
  menu = document.querySelector(" .header .inner-menu");
  overlay = document.querySelector(".header .inner-overlay");

  buttonMenuMobile.addEventListener("click", function () {
    menu.classList.add("active");
  });

  overlay.addEventListener("click", function () {
    menu.classList.remove("active");
  });

  const listButtonMenu = menu.querySelectorAll("ul > li > i");

  listButtonMenu.forEach((button) => {
    button.addEventListener("click", function () {
      button.closest("li").classList.toggle("active");
    });
  });
}

//End Menu Mobile

// Box Section-1

// Location Box
const BoxLocationSection1 = document.querySelector(".section-1 .inner-form .inner-location");

if (BoxLocationSection1) {
  const input = BoxLocationSection1.querySelector(".inner-input-group .inner-input");

  input.addEventListener("focus", function () {
    BoxLocationSection1.classList.add("active");
  });

  input.addEventListener("blur", function () {
    BoxLocationSection1.classList.remove("active");
  });

  // Bắt sự kiện cho từng item

  const listItem = BoxLocationSection1.querySelectorAll(".inner-suggest .inner-suggest-list .inner-item");

  listItem.forEach((item) => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-item-content .inner-item-title").innerText;
      input.value = title;
    });
  });
}
// End Location Box

// Quantity Box
const BoxQuantitySection1 = document.querySelector(".section-1 .inner-form .inner-quantity");

if (BoxQuantitySection1) {
  const input = BoxQuantitySection1.querySelector(".inner-input-group .inner-input");
  input.addEventListener("focus", () => {
    BoxQuantitySection1.classList.add("active");
  });

  // Ẩn box
  document.addEventListener("click", (event) => {
    if (!BoxQuantitySection1.contains(event.target)) {
      BoxQuantitySection1.classList.remove("active");
    }
  });

  // Thay đổi ô input
  const UpdateInputQuantity = () => {
    const listBoxNumber = BoxQuantitySection1.querySelectorAll(".inner-quantity .inner-item .inner-count .inner-number");
    const listNumber = [];
    listBoxNumber.forEach((item) => {
      listNumber.push(parseInt(item.innerHTML));
    });

    const valueInput = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]}`;
    input.value = valueInput;
  };

  // Nút up
  const listButtonUp = BoxQuantitySection1.querySelectorAll(".inner-quantity .inner-item .inner-count .inner-up");

  listButtonUp.forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".inner-count");
      const number = parent.querySelector(".inner-number");
      number.innerHTML = parseInt(number.innerHTML) + 1;
      UpdateInputQuantity();
    });
  });

  // Nút down
  const listButtonDown = BoxQuantitySection1.querySelectorAll(".inner-quantity .inner-item .inner-count .inner-down");

  listButtonDown.forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".inner-count");
      const number = parent.querySelector(".inner-number");
      if (parseInt(number.innerHTML) > 0) {
        number.innerHTML = parseInt(number.innerHTML) - 1;
        UpdateInputQuantity();
      }
    });
  });
}
// End Box Section-1

//Clock Expire

const clockExpire = document.querySelector("[clock-Expire]");

if (clockExpire) {
  const expireDateTimeString = clockExpire.getAttribute("clock-Expire");
  const expireDateTime = new Date(expireDateTimeString);

  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now;

    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);

      const listBoxNumber = clockExpire.querySelectorAll(".inner-time .inner-item .inner-number");
      listBoxNumber[0].innerHTML = days < 10 ? `0${days}` : days;
      listBoxNumber[1].innerHTML = hours < 10 ? `0${hours}` : hours;
      listBoxNumber[2].innerHTML = minutes < 10 ? `0${minutes}` : minutes;
      listBoxNumber[3].innerHTML = seconds < 10 ? `0${seconds}` : seconds;
    } else {
      clearInterval(intervalClock);
    }
  };

  const intervalClock = setInterval(updateClock, 1000);
}
//End Clock Expire

//Box Filter
const boxFilterMobile = document.querySelector(".section-9 .inner-list-filter");

if (boxFilterMobile) {
  const boxLeft = document.querySelector(".section-9 .inner-left");

  boxFilterMobile.addEventListener("click", function () {
    boxLeft.classList.add("active");
  });

  boxFilterMobile.addEventListener("blur", function () {
    boxLeft.classList.remove("active");
  });
}
//End Box Filter

// Show More Info Tour

const boxInfoTour = document.querySelector(".section-10 .inner-left .inner-info-tour");

if (boxInfoTour) {
  const moreButton = boxInfoTour.querySelector(".section-10 .inner-left .inner-info-tour .inner-button");
  moreButton.addEventListener("click", function () {
    if (boxInfoTour.classList.contains("active")) {
      boxInfoTour.classList.remove("active");
      moreButton.innerHTML = "Xem tất cả";
    } else {
      boxInfoTour.classList.add("active");
      moreButton.innerHTML = "Thu gọn";
    }
  });

  new Viewer(boxInfoTour);
}

// End Show More Info Tour

// Swiper Section 2

const swiperSection2 = document.querySelector(".section-2 .swiperSection2");

if (swiperSection2) {
  new Swiper(".swiperSection2", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  });
}

// End Swiper Section 2

// Swiper Section 3

const swiperSection3 = document.querySelector(".section-3 .swiperSection3");

if (swiperSection3) {
  new Swiper(".swiperSection3", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  });
}

//Box Image

const boxImageSection10 = document.querySelector(".section-10 .box-image");

if (boxImageSection10) {
  const swiperImageThumbs = new Swiper(".swiperImageThumbs", {
    loop: true,
    spaceBetween: 5,
    slidesPerView: 4,
    freeMode: true,
    breakpoints: {
      576: {
        spaceBetween: 10,
      },
    },
  });
  const swiperImageList = new Swiper(".swiperImageList", {
    loop: true,
    spaceBetween: 10,
    thumbs: {
      swiper: swiperImageThumbs,
    },
  });

  // Khởi tạo zoom ảnh
  const innerImageMain = boxImageSection10.querySelector(".inner-image-main");
  new Viewer(innerImageMain);
}

//Box Tour Schedule

const boxTourSchedule = document.querySelector(".section-10 .inner-left .inner-tour-schedule");
if (boxTourSchedule) {
  new Viewer(boxTourSchedule);
}

// End Box Tour Schedule

// Email Form

const emailForm = document.querySelector("#email-form");
if (emailForm) {
  const validator = new JustValidate("#email-form");
  validator
    .addField("#email-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn",
      },
      {
        rule: "email",
        errorMessage: "Vui lòng nhập đúng định dạng email",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
    });
}
// End Email Form

// Code Form

const codeForm = document.querySelector("#code-form");
if (codeForm) {
  const validator = new JustValidate("#code-form");
  validator
    .addField("#code-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã giảm giá của bạn",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.code.value;
    });
}

// End Code Form

// Payment Form

const paymentForm = document.querySelector("#payment-form");
if (paymentForm) {
  const validator = new JustValidate("#payment-form");
  validator
    .addField("#fullname-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ và tên",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ và tên phải có ít nhất 5 ký tự",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ và tên không được vượt quá 50 ký tự",
      },
    ])
    .addField("#phone-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại",
      },
      {
        rule: "customRegexp",
        value: /^(?:\+?84|0)(?:\s|-)?[1-9]\d{8}$/,
        errorMessage: "Vui lòng nhập đúng định dạng số điện thoại",
      },
    ])
    .onSuccess((event) => {
      const fullname = event.target.fullname.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.method.value;
    });

  listInputMethod = paymentForm.querySelectorAll("input[name='method']");
  const bankInfo = paymentForm.querySelector(".inner-bank");

  listInputMethod.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value === "bank") {
        bankInfo.classList.add("active");
      } else {
        bankInfo.classList.remove("active");
      }
    });
  });
}
