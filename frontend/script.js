// Login page JS
let login_form = document.querySelector("#login-form");
let email = document.querySelector("#email");
let passwurd = document.querySelector("#password");

if (login_form) {

    login_form.addEventListener("submit", function (evt) {

        evt.preventDefault();

        document.querySelector("#password-help").textContent = "";
        document.querySelector("#email-error").textContent = "";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        let emailAns = email.value;
        let passwurdAns = passwurd.value;
        let isValid = true;

        if (!emailRegex.test(emailAns)) {
            document.querySelector(".error-message").classList.add("isVisible");
            document.querySelector("#email-error").textContent = "Please enter a valid email address.";
            isValid = false;
        }

        if (!passwordRegex.test(passwurdAns)) {
            document.querySelector(".help-message").classList.add("isVisible");
            document.querySelector("#password-help").textContent = "Use 8 or more characters with a mix of letters, numbers, and symbols.";
            isValid = false;
        }

        if (!isValid) {
            return;
        }
        login_form.reset();
    });
}

// signup page JS
let signup_form = document.querySelector("#signup-form");
if (signup_form) {
    signup_form.addEventListener("submit", function (evt) {
        evt.preventDefault();

        document.querySelector("#name-msg").textContent = "";
        document.querySelector("#email-error").textContent = "";
        document.querySelector("#phone-no").textContent = "";
        document.querySelector("#pass-msg").textContent = "";
        document.querySelector("#confirm-pass").textContent = "";



        const fullNameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        let nameAns = document.querySelector("#fullname").value;
        let phoneAns = document.querySelector("#phone").value;
        let emailAns = document.querySelector("#email").value;
        let passwurdAns = document.querySelector("#password").value;
        let confirmPass = document.querySelector("#confirm-password").value;

        let isValid = true;
        if (!fullNameRegex.test(nameAns)) {
            document.querySelector("#name-msg").classList.add("isVisible");
            document.querySelector("#name-msg").textContent = "Please enter full name.";
            isValid = false;
        } if (!emailRegex.test(emailAns)) {
            document.querySelector("#email-error").classList.add("isVisible");
            document.querySelector("#email-error").textContent = "Please enter a valid email address.";
            isValid = false;
        } if (!phoneRegex.test(phoneAns)) {
            document.querySelector("#phone-no").classList.add("isVisible");
            document.querySelector("#phone-no").textContent = "Please enter a valid phone number.";
            isValid = false;
        } if (!passwordRegex.test(passwurdAns)) {
            document.querySelector("#pass-msg").classList.add("isVisible");
            document.querySelector("#pass-msg").textContent = "Use 8 or more characters with a mix of letters, numbers, and symbols.";
            isValid = false;
        } if (passwurdAns !== confirmPass) {
            document.querySelector("#confirm-pass").classList.add("isVisible");
            document.querySelector("#confirm-pass").textContent = "The password doesn't match the above password you provided";
            isValid = false;
        }

        if(!isValid){
            return;
        }
        signup_form.reset();

    })
}