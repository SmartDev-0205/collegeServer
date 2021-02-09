const Validator=require('validator');
const isEmpty=require('is-empty');

module.exports = function validateUserEditInput(data){

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.nextname = !isEmpty(data.nextname) ? data.nextname : "";
    data.nextemail = !isEmpty(data.nextemail) ? data.nextemail : "";
    data.nextphonenumber = !isEmpty(data.nextphonenumber) ? data.nextphonenumber : "";

    //Name checks
    if(Validator.isEmpty(data.nextname)) {
        errors.name = "Name field is required";
    }

    //Email checks
    if(Validator.isEmpty(data.nextemail)){
        errors.email = "Email field is required";
    }else if(!Validator.isEmail(data.nextemail)){
        errors.email = "Email is invalid";
    }

    if(Validator.isEmpty(data.nextphonenumber.toString())){
        errors.phonenumber = "phonenumber field is required";
    }else if(!Validator.isMobilePhone(data.nextphonenumber.toString())){
        errors.phonenumber="Invalid phonenumber"
    }



    // if(!Validator.equals(data.password,data.password2)){
    //     errors.password2 = "Passwords must match";
    // }

    return{
        errors,
        isValid:isEmpty(errors)
    };

};