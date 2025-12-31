// Login Form
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  const validation = new JustValidate("#login-form");
  validation
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
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      const password = event.target.password.value;
      const rememberPassword = event.target.remember.checked;

      const dataFinal = {
        email: email,
        password: password,
        rememberPassword: rememberPassword,
      };

      fetch(`/${pathAdmin}/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result == "error") {
            console.log(data.message);
            notyf.error(data.message);
          }

          if (data.result == "success") {
            // notyf.success(data.message);
            Notify(data.result, data.message);
            window.location.href = `/${pathAdmin}/dashboard`;
          }
        });
    });
}

// End Login Form

// Register Form
const registerForm = document.querySelector("#register-form");
if (registerForm) {
  const validation = new JustValidate("#register-form");
  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự",
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
    .addField("#agree", [
      {
        rule: "required",
        errorMessage: "Chấp nhận các điều khoản và điều kiện",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const email = event.target.email.value;
      const password = event.target.password.value;

      const dataFinal = {
        name: name,
        email: email,
        password: password,
      };

      fetch(`/${pathAdmin}/account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result == "error") {
            notyf.error(data.message);
          }

          if (data.result == "success") {
            // notyf.success(data.message);
            Notify(data.result, data.message);
            window.location.href = `/${pathAdmin}/account/register-initial`;
          }
        });
    });
}

// End Register Form

// Forgot Password Form
const forgotPasswordForm = document.querySelector("#forgot-password-form");
if (forgotPasswordForm) {
  const validation = new JustValidate("#forgot-password-form");
  validation
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
    .onSuccess((event) => {
      const email = event.target.email.value;
    });
}
// End Forgot Password Form

// OTP Password Form
const otpPasswordForm = document.querySelector("#otp-password-form");
if (otpPasswordForm) {
  const validation = new JustValidate("#otp-password-form");
  validation
    .addField("#otp", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã OTP",
      },
      {
        rule: "customRegexp",
        value: /^\d{6}$/,
        errorMessage: "Mã OTP phải gồm 6 chữ số",
      },
    ])
    .onSuccess((event) => {
      const otp = event.target.otp.value;
    });
}
// End OTP Password Form

// Reset Password Form
const resetPasswordForm = document.querySelector("#reset-password-form");
if (resetPasswordForm) {
  const validation = new JustValidate("#reset-password-form");
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
