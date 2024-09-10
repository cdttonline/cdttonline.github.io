const ValidateFn = {};

const validateTestUserResults = (answer) => {
    console.log("The answers to be validated are", answer);
    let res = [];
    let items = [];
    for (let key in answer) {
        if (key == "age") {
            validateAge(answer[key], res);
        } else if (key == "termsChecked") {
            validateCheck(answer[key], res);
        } else if (key == "comment") {
            validateComments(answer[key], res);
        } 
    }
    return res;
}

const validateAddingUser = (answer) => {
    console.log("The answers to be validated are", answer);
    let res = [];
    for (let key in answer) {
        if (key == "firstName") {
            validateFirstName(answer[key], res);
        } else if (key == "lastName") {
            validateLastName(answer[key], res);
        } else if (key == "email") {
            validateEmail(answer[key], res);
        } 
        // else if (key == "password") {
        //     validatePassword(answer[key], res);
        // }
    }
    return res;
}

const validatePassword = (password, res) => {
    let feedback = "";
    // let regexp = /^[A-Za-z0-9]+$/;
    const regexp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/;
    if ((password.length < 6) && regexp.test(password) == false) {
        feedback = "Your password must contain more than 6 characters and have at least 1 digit, 1 lowercase letter and one special character !@#$%^&*"
    } else if (password.length < 6) {
        feedback = "Your password must contain more than 6 characters."
    } else if (regexp.test(password) == false) {
        feedback = "Your password must contain at least 1 digit, at least 1 lowercase letter and at least one special character !@#$%^&*"    
    }
    res.push(feedback);
    return res;
}

const validateFirstName = (name, res) => {
    let feedback = "";
    let regexp = /^(\s*)$/;
    if (name.length == 0 || regexp.test(name) == true) {
        feedback = "Please enter a valid first name."
    }
    res.push(feedback);
    return res;
}

const validateEmail = (email, res) => {
    let feedback = "";
    let regexp = /^[A-Za-z0-9]+(\.)?[A-Za-z0-9]*@[A-Za-z0-9]+(\.)[A-Za-z]+$/;
    if (regexp.test(email) == false) {
        feedback = "Please enter a valid email address.";
    }    
    res.push(feedback);
    return res;
}
const validateLastName = (name, res) => {
    let feedback = "";
    let regexp = /^(\s*)$/;
    if (name.length == 0 || regexp.test(name) == true) {
        feedback = "Please enter a valid last name."
    }
    res.push(feedback);
    return res;
}


const validateComments = (comment, res) => {
    let feedback = "";
    let limit = 350;
    if (comment.length > limit) {
      feedback = "Invalid comment. It needs to be 350 characters or less. ";
    }
    res.push(feedback);
    return res;
}

const validateAge = (age, res) => {
    let feedback = "";
    let regexp = /^(\s*|[0-9]+)$/;
    if (regexp.test(age) == false) {
      feedback = "Please enter a valid age";
    }
    res.push(feedback);
    return res;
};

const validateCheck = (check, res) => {
    let feedback = "";
    if (!check) {
      feedback = "** Need to agree to the Terms and Conditions to submit results.";
    }
    res.push(feedback);
    return res;
};



ValidateFn.validateTestUserResults = (answer) => {
    return validateTestUserResults(answer);
};

ValidateFn.validateAddingUser = (answer) => {
    return validateAddingUser(answer);
}

export default ValidateFn;