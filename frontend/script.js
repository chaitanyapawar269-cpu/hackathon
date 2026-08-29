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

//validate (apply for verification) form ..

let applicationForm = document.querySelector("#application-form");

if (applicationForm) {

    applicationForm.addEventListener("submit", function (evt) {

        evt.preventDefault();


        // Get inputs
        let instrumentType = document.querySelector("#instrument-type");
        let instrumentId = document.querySelector("#instrument-id");
        let manufacturer = document.querySelector("#manufacturer");
        let modelNumber = document.querySelector("#model-number");
        let serialNumber = document.querySelector("#serial-number");
        let capacity = document.querySelector("#capacity");

        let ownerName = document.querySelector("#owner-name");
        let phone = document.querySelector("#phone");
        let email = document.querySelector("#email");
        let location = document.querySelector("#location");
        let address = document.querySelector("#address");

        let documents = document.querySelector("#documents");


        // Regex
        const fullNameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)+$/;

        const phoneRegex = /^[6-9]\d{9}$/;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        // Remove previous errors
        document.querySelectorAll(".error-message")
            .forEach(function (error) {
                error.classList.remove("isVisible");
                error.textContent = "";
            });


        let isValid = true;


        // Instrument type
        if (instrumentType.value === "") {

            showError(
                "instrument-type-error",
                "Please select an instrument type."
            );

            isValid = false;
        }


        // Instrument ID
        if (instrumentId.value.trim() === "") {

            showError(
                "instrument-id-error",
                "Please enter the instrument ID."
            );

            isValid = false;
        }


        // Manufacturer
        if (manufacturer.value.trim() === "") {

            showError(
                "manufacturer-error",
                "Please enter the manufacturer name."
            );

            isValid = false;
        }


        // Model number
        if (modelNumber.value.trim() === "") {

            showError(
                "model-number-error",
                "Please enter the model number."
            );

            isValid = false;
        }


        // Serial number
        if (serialNumber.value.trim() === "") {

            showError(
                "serial-number-error",
                "Please enter the serial number."
            );

            isValid = false;
        }


        // Capacity
        if (capacity.value.trim() === "") {

            showError(
                "capacity-error",
                "Please enter the capacity or range."
            );

            isValid = false;
        }


        // Owner name
        if (!fullNameRegex.test(ownerName.value.trim())) {

            showError(
                "owner-name-error",
                "Please enter the full owner or organization name."
            );

            isValid = false;
        }


        // Phone
        if (!phoneRegex.test(phone.value.trim())) {

            showError(
                "phone-error",
                "Please enter a valid 10-digit phone number."
            );

            isValid = false;
        }


        // Email
        if (!emailRegex.test(email.value.trim())) {

            showError(
                "email-error",
                "Please enter a valid email address."
            );

            isValid = false;
        }


        // Location
        if (location.value.trim() === "") {

            showError(
                "location-error",
                "Please enter the location."
            );

            isValid = false;
        }


        // Address
        if (address.value.trim() === "") {

            showError(
                "address-error",
                "Please enter the complete address."
            );

            isValid = false;
        }


        // Documents
        if (documents.files.length === 0) {

            showError(
                "documents-error",
                "Please upload a supporting document."
            );

            isValid = false;
        }


        // Final result
        if (isValid) {

            console.log("Form is valid!");
            applicationForm.reset();

            // Later you can submit the form / store data / redirect
            // applicationForm.submit();

        }

    });


    // Function to show error
    function showError(errorId, message) {

        let error = document.querySelector("#" + errorId);

        error.textContent = message;

        error.classList.add("isVisible");
    }

}


//Verify instrument JS.....

let verifyBtn = document.querySelector("#verify-btn");

if (verifyBtn) {

    verifyBtn.addEventListener("click", function () {

        let instrumentId =
            document.querySelector("#instrument-id").value.trim();

        let error =
            document.querySelector("#instrument-id-error");

        let result =
            document.querySelector("#verification-result");


        error.textContent = "";
        error.classList.remove("isVisible");

        result.classList.add("result-hidden");


        if (instrumentId === "") {

            error.textContent =
                "Please enter an instrument ID.";

            error.classList.add("isVisible");

            return;
        }


        // Demo ID
        if (instrumentId === "VW-2026-001234") {

            result.classList.remove("result-hidden");

            document.querySelector("#result-id").textContent =
                instrumentId;

        }

        else {

            error.textContent =
                "Instrument not found or not verified.";

            error.classList.add("isVisible");

        }

    });

}