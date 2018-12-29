import {Gen} from "../../../helpers/gen";

export const validate_filters = values => {

    const errors = {};

    const requiredFields = [
    ];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });

    if(values['fromTime']){
        let value = values['fromTime'];
        if(!Gen.isValidTimeZoneString(value)) {
            errors.fromTime = "from time should be in format +hh:mm/-hh:mm";
        }
    }

    if(values['toTime']){
        let value = values['toTime'];
        if(!Gen.isValidTimeZoneString(value)) {
            errors.toTime = "to time should be in format +hh:mm/-hh:mm";
        }
    }
    return errors;
};


export const validate_timezone = values => {

    const errors = {};

    const requiredFields = [
        'name',
        'city',
        'GMTDifference'
    ];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });
    if(values.name && (values.name.length < 3 || values.name.length > 50))
        errors.name = "name must be between 3 and 50 length";

    if(values.city && (values.city.length < 3 || values.city.length > 50))
        errors.city = "city must be between 3 and 50 length";

    if(values['GMTDifference']){
        let value = values['GMTDifference'];
        if(!Gen.isValidTimeZoneString(value)) {
            errors.GMTDifference = "timezone should be in format +hh:mm/-hh:mm";
        }
    }
    return errors;
};

export const validate_registerForm = values => {

    const errors = {}

    const requiredFields = [
        'name',
        'email',
        'password',
        'sex',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });

    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }

    if (
        values.email && values.email.length < 6
    ) {
        errors.password = 'Invalid password'
    }

    return errors;
}

export const validate_loginForm = values => {

    const errors = {}

    const requiredFields = [
        'email'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }
    return errors;
}

export const validate_resetForm = values => {

    const errors = {}

    const requiredFields = [
        'token',
        'password',
        'confirmPassword'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.password !== values.confirmPassword
    ) {
        errors.confirmPassword = 'Passwords do not match'
    }
    return errors;
}
