// Toggle Password Visibility
document.querySelectorAll('[toggle-password]').forEach(button => {
  button.addEventListener('click', () => {
    const input = button.previousElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
});
// End Toggle Password Visibility

// Login Form
const loginForm = document.querySelector("#login-form");
if(loginForm) {
  const validator = new JustValidate('#login-form');

  validator
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: "Please enter email!"
      },
      {
        rule: 'email',
        errorMessage: "Email is not valid!"
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: "Please enter password!"
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      const password = event.target.password.value;
      const rememberPassword = event.target.rememberPassword.checked;
      
      const dataFinal = {
        email: email,
        password: password,
        rememberPassword: rememberPassword
      };

      fetch(`/${pathAdmin}/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/dashboard`;
          }
        })
    })
}
// End Login Form

// Register Form
const registerForm = document.querySelector("#register-form");
if(registerForm) {
  const validator = new JustValidate('#register-form');

  validator
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: "Please enter full name!"
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: "Full name must be at least 5 characters!"
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: "Full name must not exceed 50 characters!"
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: "Please enter email!"
      },
      {
        rule: 'email',
        errorMessage: "Email is not valid!"
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: "Please enter password!"
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: "Password must be at least 8 characters!"
      },
      {
        rule: 'customRegexp',
        value: /[A-Z]/,
        errorMessage: "Password must contain at least one uppercase letter!"
      },
      {
        rule: 'customRegexp',
        value: /[a-z]/,
        errorMessage: "Password must contain at least one lowercase letter!"
      },
      {
        rule: 'customRegexp',
        value: /\d/,
        errorMessage: "Password must contain at least one number!"
      },
      {
        rule: 'customRegexp',
        value: /[~!@#$%^&*]/,
        errorMessage: "Password must contain at least one special character! (~!@#$%^&*)"
      },
    ])
    .addField('#agree', [
      {
        rule: 'required',
        errorMessage: "You must agree to the terms and conditions!"
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const password = event.target.password.value;

      const dataFinal = {
        fullName: fullName,
        email: email,
        password: password,
      };

      fetch(`/${pathAdmin}/account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/account/register-initial`;
          }
        })
    })
}
// End Register Form

// Forgot Password Form
const forgotPasswordForm = document.querySelector("#forgot-password-form");
if(forgotPasswordForm) {
  const validator = new JustValidate('#forgot-password-form');

  validator
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: "Please enter email!"
      },
      {
        rule: 'email',
        errorMessage: "Email is not valid!"
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      
      const dataFinal = {
        email: email
      };

      fetch(`/${pathAdmin}/account/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/account/otp-password?email=${email}`;
          }
        })
    })
}
// End Forgot Password Form

// OTP Password Form
const otpPasswordForm = document.querySelector("#otp-password-form");
if(otpPasswordForm) {
  const validator = new JustValidate('#otp-password-form');

  validator
    .addField('#otp', [
      {
        rule: 'required',
        errorMessage: "Please enter OTP!"
      },
    ])
    .onSuccess((event) => {
      const otp = event.target.otp.value;

      const urlParams = new URLSearchParams(location.search);
      const email = urlParams.get("email");

      const dataFinal = {
        email: email,
        otp: otp,
      };

      fetch(`/${pathAdmin}/account/otp-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/account/reset-password`;
          }
        })
    })
}
// End OTP Password Form

// Reset Password Form
const resetPasswordForm = document.querySelector("#reset-password-form");
if(resetPasswordForm) {
  const validator = new JustValidate('#reset-password-form');

  validator
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: "Please enter new password!"
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: "Password must be at least 8 characters!"
      },
      {
        rule: 'customRegexp',
        value: /[A-Z]/,
        errorMessage: "Password must contain at least one uppercase letter!"
      },
      {
        rule: 'customRegexp',
        value: /[a-z]/,
        errorMessage: "Password must contain at least one lowercase letter!"
      },
      {
        rule: 'customRegexp',
        value: /\d/,
        errorMessage: "Password must contain at least one number!"
      },
      {
        rule: 'customRegexp',
        value: /[~!@#$%^&*]/,
        errorMessage: "Password must contain at least one special character! (~!@#$%^&*)"
      },
    ])
    .addField('#confirm-password', [
      {
        validator: (value, fields) => {
          const password = fields["#password"].elem.value;
          return password == value;
        },
        errorMessage: "Password confirmation does not match!"
      }
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
      
      const dataFinal = {
        password: password,
      };

      fetch(`/${pathAdmin}/account/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataFinal)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notify.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/dashboard`;
          }
        })
    })
}
// End Reset Password Form