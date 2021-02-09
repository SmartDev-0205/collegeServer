const Validator=require('validator');
const isEmpty=require('is-empty');

module.exports = function validateCollegeInput(data) {

    let errors = {};
    data.country = !isEmpty(data.country) ? data.country : '';
    data.state = !isEmpty(data.state) ? data.state : '';
    data.GRE = !isEmpty(data.GRE) ? data.GRE : 0;
    data.Toefl = !isEmpty(data.Toefl) ? data.Toefl : 0;

    if (Validator.isEmpty(data.country)) {
        errors.country = "country field is required";
    }
    if (Validator.isEmpty(data.state)) {
        errors.state = "state field is required";
    }

    if (data.GRE === 0) {
        errors.GRE = "GRE number value is required";
    } else if (!Validator.isInt(data.GRE.toString(), {min: 260, max: 340})) {
        errors.GRE = "GRE has number 260~340";

    }
    if (data.Toefl > 10) {
        if (!Validator.isInt(data.Toefl.toString(), {min: 40, max: 120})) {
            errors.toefl = "Toefl has number 40~120";
        }
    } else if(data.Toefl>0) {

        if (!Validator.isFloat(data.Toefl.toString(), {min: 5.0, max: 9.0})) {
            errors.toefl = "IELTS has number 5.0~9.0";
        }
    }


    return {
        errors,
        isValid: isEmpty(errors)
    };
};