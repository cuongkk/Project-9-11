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
let filepond = {};
if (listFilepondImage.length > 0) {
  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.registerPlugin(FilePondPluginFileValidateType);

  listFilepondImage.forEach((inputElement) => {
    filepond[inputElement.name] = FilePond.create(inputElement, {
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

// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if (categoryCreateForm) {
  const validation = new JustValidate("#category-create-form");
  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatar = filepond.avatar.getFile()?.file;
      const description = tinymce.get("description").getContent();
    });
}

// End Category Create Form

//Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if (tourCreateForm) {
  const validation = new JustValidate("#tour-create-form");
  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên tour",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatar = filepond.avatar.getFile()?.file;
      const oldPriceAdult = event.target.oldPriceAdult.value;
      const oldPriceChild = event.target.oldPriceChild.value;
      const oldPriceBaby = event.target.oldPriceBaby.value;
      const newPriceAdult = event.target.newPriceAdult.value;
      const newPriceChild = event.target.newPriceChild.value;
      const newPriceBaby = event.target.newPriceBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChild = event.target.stockChild.value;
      const stockBaby = event.target.stockBaby.value;
      const location = [];
      const duration = event.target.duration.value;
      const transportation = event.target.transportation.value;
      const departureDate = event.target.departureDate.value;
      const description = event.target.description.value;
      const schedule = [];

      const listLocation = document.querySelectorAll('[name="location"]:checked');
      listLocation.forEach((item) => {
        location.push(item.value);
      });

      const listScheduleItem = document.querySelectorAll(".inner-schedule .inner-schedule-item");
      listScheduleItem.forEach((item) => {
        const inputTitle = item.querySelector(".inner-input");
        const title = inputTitle.value;
        const textareaDescription = item.querySelector("textarea");
        const id = textareaDescription.id;
        const description = tinymce.get(id).getContent();

        schedule.push({
          title,
          description,
        });
      });
    });
}

// Order Edit Form

const orderEditForm = document.querySelector("#order-edit-form");
if (orderEditForm) {
  const validator = new JustValidate("#order-edit-form");
  validator
    .addField("#fullName", [
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
    .addField("#phone", [
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
      const fullname = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.paymentMethod.value;
      const paymentStatus = event.target.paymentStatus.value;
      const status = event.target.status.value;
    });
}
//End Order Edit Form

// Info Web Form
const infoWebForm = document.querySelector("#info-web-form");
if (infoWebForm) {
  const validation = new JustValidate("#info-web-form");
  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên website",
      },
    ])
    .addField("#email", [
      {
        rule: "email",
        errorMessage: "Vui lòng nhập đúng định dạng email",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const phone = event.target.phone.value;
      const email = event.target.email.value;
      const address = event.target.address.value;
      const logo = filepond.logo.getFile()?.file;
      const favicon = filepond.favicon.getFile()?.file;
    });
}
// End Info Web Form

// Account Admin Create Form
const accountAdminCreateForm = document.querySelector("#account-admin-create-form");
if (accountAdminCreateForm) {
  const validation = new JustValidate("#account-admin-create-form");
  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email",
      },
      {
        rule: "email",
        errorMessage: "Vui lòng nhập đúng định dạng email",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại",
      },
    ])
    .addField("#position", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập chức vụ",
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatar = filepond.avatar.getFile()?.file;
    });
}
// End Account Admin Create Form

// Role Create Form
const roleCreateForm = document.querySelector("#role-create-form");
if (roleCreateForm) {
  const validation = new JustValidate("#role-create-form");
  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên nhóm quyền",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      const listPermissions = document.querySelectorAll('[name="permissions"]:checked');
      listPermissions.forEach((item) => {
        permissions.push(item.value);
      });
      console.log(permissions);
    });
}
// End Role Create Form

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
  const validation = new JustValidate("#profile-edit-form");
  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên",
      },
      {
        rule: "minLength",
        value: 3,
        errorMessage: "Họ tên phải có ít nhất 3 ký tự",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email",
      },
      {
        rule: "email",
        errorMessage: "Vui lòng nhập đúng định dạng email",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const avatar = filepond.avatar.getFile()?.file;
    });
}

// End Profile Edit Form

// Change Password Form
const changePasswordForm = document.querySelector("#change-password-form");
if (changePasswordForm) {
  const validation = new JustValidate("#change-password-form");
  validation
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu",
      },
      {
        rule: "minLength",
        value: 6,
        errorMessage: "Mật khẩu phải có ít nhất 6 ký tự",
      },
      {
        rule: "maxLength",
        value: 30,
        errorMessage: "Mật khẩu không được vượt quá 30 ký tự",
      },
      {
        rule: "customRegexp",
        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái và một số",
      },
    ])
    .addField("#confirmPassword", [
      {
        rule: "required",
        errorMessage: "Vui lòng xác nhận mật khẩu",
      },
      {
        validator: (value, fields) => {
          return value === fields["#password"].elem.value;
        },
        errorMessage: "Mật khẩu xác nhận không khớp",
      },
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
    });
}

// Sider
const sider = document.querySelector(".sider");
if (sider) {
  const pathNameCurrent = window.location.pathname;
  const pathNameCurrentSplit = pathNameCurrent.split("/");
  const menuList = sider.querySelectorAll("ul.inner-menu li a");
  menuList.forEach((item) => {
    const pathName = item.getAttribute("href");
    const pathNameSplit = pathName.split("/");
    if (pathNameCurrentSplit[1] == pathNameSplit[1] && pathNameCurrentSplit[2] === pathNameSplit[2]) {
      item.classList.add("active");
    }
  });
}
//End sider
