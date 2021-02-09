const Validator=require('validator');
const isEmpty=require('is-empty');

module.exports = function validatePasswordInput(data) {

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.password = !isEmpty(data.password) ? data.password : "";
    data.passconfirm = !isEmpty(data.passconfirm) ? data.passconfirm : "";

    //Name checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "password field is required";
    }

    //Email checks
    if (Validator.isEmpty(data.passconfirm)) {
        errors.passconfirm = "passconfirm field is required";

    }

    if (data.password != data.passconfirm) {
        errors.passconfirm = "please check confirm password";
    }


    // if(!Validator.equals(data.password,data.password2)){
    //     errors.password2 = "Passwords must match";
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};