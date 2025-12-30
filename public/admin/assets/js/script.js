const initTinyMCE = (selector) => {
  tinymce.init({
    selector: selector,
    plugins: ["anchor", "link"],
    toolbar: "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent link anchor",
  });
};

initTinyMCE("[textarea-mce]");
// Menu Mobile

const buttonMenuMobile = document.querySelector(".header .inner-menu");

if (buttonMenuMobile) {
  const sider = document.querySelector(".sider");
  const overlay = document.querySelector(".inner-overlay");

  buttonMenuMobile.addEventListener("click", function () {
    sider.classList.add("active");
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", function () {
    sider.classList.remove("active");
    overlay.classList.remove("active");
  });
}
// End Menu Mobile

// Schedule Section-8

const scheduleSection8 = document.querySelector(".section-8 .inner-schedule");

if (scheduleSection8) {
  const buttonCreate = scheduleSection8.querySelector(".inner-schedule-create");
  const elementList = scheduleSection8.querySelector(".inner-schedule-list");

  // Thêm Item
  buttonCreate.addEventListener("click", () => {
    const firstItem = elementList.querySelector(".inner-schedule-item");
    const newItem = firstItem.cloneNode(true);
    newItem.querySelector(".inner-input").value = "";
    const id = `mce_${Date.now()}`;
    newItem.querySelector(".inner-schedule-body").innerHTML = `<textarea id="${id}"></textarea>`;
    elementList.appendChild(newItem);
    initTinyMCE(`#${id}`);
  });

  // Đóng mở
  elementList.addEventListener("click", (event) => {
    if (event.target.closest(".inner-more")) {
      const scheduleItem = event.target.closest(".inner-schedule-item");
      const scheduleBody = scheduleItem.querySelector(".inner-schedule-body");
      scheduleBody.classList.toggle("hidden");
    }
  });

  // Xóa Item
  elementList.addEventListener("click", (event) => {
    if (event.target.closest(".inner-remove")) {
      const scheduleItem = event.target.closest(".inner-schedule-item");
      if (elementList.children.length > 1) {
        elementList.removeChild(scheduleItem);
      }
    }
  });
  //Sắp xếp Item
  new Sortable(elementList, {
    handle: ".inner-move",
    animation: 150,
    onStart: (event) => {
      const textareaa = event.item.querySelector("textarea");
      const id = textareaa.id;
      tinymce.get(id).remove();
    },
    onEnd: (event) => {
      const textareaa = event.item.querySelector("textarea");
      const id = textareaa.id;
      initTinyMCE(`#${id}`);
    },
  });
}
//End Schedule Section-8

//Filepond Image

const listFilepondImage = document.querySelectorAll("[filepond-image]");
if (listFilepondImage.length > 0) {
  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.registerPlugin(FilePondPluginFileValidateType);

  listFilepondImage.forEach((inputElement) => {
    FilePond.create(inputElement, {
      labelIdle: "+",
      acceptedFileTypes: ["image/*"],
    });
  });
}
//End Filepond Image

// Chart
const revenueChartElement = document.querySelector("#revenue-chart");
if (revenueChartElement) {
  new Chart(revenueChartElement, {
    type: "line",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
          borderColor: "#4e73df",
        },
        {
          label: "# of Votes",
          data: [13, 15, 2, 8, 1, 2],
          borderWidth: 1,
          borderColor: "#1cc88a",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      maintainAspectRatio: false,
    },
  });
}
// End Chart

// Sider
const sider = document.querySelector(".sider");
if (sider) {
  const pathNameCurrent = window.location.pathname;
  const menuList = sider.querySelectorAll("ul.inner-menu li a");
  menuList.forEach((item) => {
    const pathName = item.getAttribute("href");
    if (pathNameCurrent.includes(pathName)) {
      item.classList.add("active");
    }
  });
}
//End sider
