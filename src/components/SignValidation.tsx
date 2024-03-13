import React from "react";

interface Values {
    name: string;
    email: string;
    password: string;
  }

function Validation(values: Values) {
    let errors: { [key: string]: string } = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    
    if(values.name ==="") {
        errors.name = "Name should not be empty"
    }
    else {
        errors.name = ""
    }

    if(values.email ==="") {
        errors.email = "Email should not be empty"
    }
    else if(!email_pattern.test(values.email)){
        errors.email = "Email didn't match"
    }else {
        errors.email = ""
    }


    if(values.password ==="") {
        errors.password = "Password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        errors.password = "Password didn't match"
    }else {
        errors.password = ""
    }

    return errors;
}

export default Validation;