const Validator=require('validator');
const isEmpty=require('is-empty');

module.exports = function validateAdminEditInput(data){

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.nextname = !isEmpty(data.nextname) ? data.nextname : "";
    data.nextemail = !isEmpty(data.nextemail) ? data.nextemail : "";
    data.nextusername = !isEmpty(data.nextusername) ? data.nextusername : "";
    data.nextrole = !isEmpty(data.nextrole) ? data.nextrole : "";



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

    if(Validator.isEmpty(data.nextusername.toString())){
        errors.username = "username field is required";
    }
    if(Validator.isEmpty(data.nextrole.toString())){
        errors.role = "role field is required";
    }



    // if(!Validator.equals(data.password,data.password2)){
    //     errors.password2 = "Passwords must match";
    // }

    return{
        errors,
        isValid:isEmpty(errors)
    };

};