const Validator=require('validator');
const isEmpty=require('is-empty');

module.exports = function validateCollegeInput(data){

    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.description = !isEmpty(data.description) ? data.description : '';
    data.streetNo = !isEmpty(data.streetNo) ? data.streetNo : '';
    data.city = !isEmpty(data.city) ? data.city : '';
    data.country = !isEmpty(data.country) ? data.country : '';
    data.zipcode = !isEmpty(data.zipcode) ? data.zipcode : '';
    data.state = !isEmpty(data.state) ? data.state : '';
    data.tuitionFee = !isEmpty(data.tuitionFee) ? data.tuitionFee : 0;
    data.accomodationFee = !isEmpty(data.accomodationFee) ? data.accomodationFee : 0;
    data.applicationFee = !isEmpty(data.applicationFee) ? data.applicationFee : 0;
    data.springDeadline = !isEmpty(data.springDeadline) ? data.springDeadline : '';
    data.summerDeadline = !isEmpty(data.summerDeadline) ? data.summerDeadline : '';
    data.fallDeadline = !isEmpty(data.fallDeadline) ? data.fallDeadline : '';
    data.establishmentType=!isEmpty(data.establishmentType) ? data.establishmentType : 0;
    data.overallRating = !isEmpty(data.overallRating) ? data.overallRating : 0;
    data.livingCostRating = !isEmpty(data.livingCostRating) ? data.livingCostRating : 0;
    data.jobsRating = !isEmpty(data.jobsRating) ? data.jobsRating : 0;
    data.universityType = !isEmpty(data.universityType) ? data.universityType : '';
    data.webSite = !isEmpty(data.webSite) ? data.webSite : '';
    data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : 0;
    data.email = !isEmpty(data.email) ? data.email : '';
    data.acceptanceRate = !isEmpty(data.acceptanceRate) ? data.acceptanceRate : 0;
    data.graduationRate = !isEmpty(data.graduationRate) ? data.graduationRate : 0;
    data.GRE = !isEmpty(data.GRE) ? data.GRE : 0;
    data.IELTS = !isEmpty(data.IELTS) ? data.IELTS : 0;
    data.Toefl = !isEmpty(data.Toefl) ? data.Toefl : 0;
    //Email checks
    if(Validator.isEmpty(data.name)){
        errors.name = "name field is required";
    }
    if(Validator.isEmpty(data.description)){
        errors.description = "description field is required";
    }
    if(Validator.isEmpty(data.streetNo)){
        errors.streetNo = "streetNo field is required";
    }
    if(Validator.isEmpty(data.city)){
        errors.city = "city field is required";
    }
    if(Validator.isEmpty(data.country)){
        errors.country = "country field is required";
    }
    if(Validator.isEmpty(data.state)){
        errors.state = "state field is required";
    }
    if(Validator.isEmpty(data.zipcode)){
        errors.zipcode = "zipcode field is required";
    }else if(!Validator.isInt(data.zipcode)){
        errors.zipcode = "zipcode must be  numbers";
    }
    if(data.tuitionFee===0){

        errors.tuitionFee = "tuitionFee number value is required";
    }
     if(data.accomodationFee===0){
        console.log("acts")
        errors.accomodationFee="accomodationFee number value is required";

    }
    if(data.applicationFee===0){
        errors.applicationFee = "applicationFee number value is required";
    }


    if(Validator.isEmpty(data.springDeadline)){
        errors.springDeadline = "springDeadline field is required";
    }

    if(Validator.isEmpty(data.summerDeadline)){
        errors.summerDeadline = "summerDeadline field is required";
    }
    if(Validator.isEmpty(data.fallDeadline)){
        errors.fallDeadline = "fallDeadline field is required";
    }

    if(data.overallRating===0){
        errors.overallRating = "overallRating number value is required";
    }
    if(data.livingCostRating===0){
        errors.livingCostRating = "livingCostRating number value is required";
    }
    if(data.jobsRating===0){
        errors.jobsRating = "jobsRating number value is required";
    }
    if(data.universityType===''){
        errors.universityType = "universityType  value is required";
    }
    if(Validator.isEmpty(data.webSite)){
        errors.webSite = "webSite field is required";
    }else if(!Validator.isURL(data.webSite)){
        errors.webSite="webSite has URL string";

    }
    if(data.establishmentType===0){
        errors.establishmentType = "establishmentType field is required";
    }
    if (data.phoneNumber===0){
        errors.phoneNumber="phoneNumber is required";
    }
    else if(!Validator.isMobilePhone(data.phoneNumber.toString())){
        errors.phoneNumber="phoneNumber has phone number values";

    }
    if(Validator.isEmpty(data.email)){
        errors.email = "email field is required";
    }else if(!Validator.isEmail(data.email)){
        errors.email="email has email values";

    }
    if(data.acceptanceRate===0){
        errors.acceptanceRate = "acceptanceRate number value is required";
    }
    if(data.graduationRate===0){
        errors.graduationRate = "graduationRate number value is required";
    }
    if(data.GRE===0){
        errors.GRE = "GRE number value is required";
    }else if(!Validator.isInt(data.GRE.toString(),{ min: 260, max: 340 })){
        errors.GRE="GRE has number 260~340";

    }
    //Password checks
    if(data.IELTS===0){
        errors.IELTS = "IELTS number value is required";
    }else if(!Validator.isFloat(data.IELTS.toString(),{ min: 5.0, max: 9.0 })){
        errors.IELTS="IELTS has number 5.0~9.0";

    }
    if(data.Toefl===0){
        errors.Toefl = "Toefl number value is required";
    }else if(!Validator.isInt(data.Toefl.toString(),{ min: 40, max: 120 })){
        errors.Toefl="Toefl has number 40~120";

    }

    return{
        errors,
        isValid: isEmpty(errors)
    };
};