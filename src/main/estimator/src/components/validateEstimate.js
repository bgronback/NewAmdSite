export default function validateEstimate(values) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const errors = {};

    if (!values.make) {
        errors.make = 'Make is required';
    }
    if (!values.model) {
        errors.model = 'Model is required';
    }
    if (!values.year) {
        errors.year = 'Year is required';
    }
    if (!values.name) {
        errors.name = 'Name is required';
    }
    if (!values.email) {
        errors.email = 'Email is required';
    } else {
        if (!re.test(values.email)) {
            errors.email = 'Email is not valid';
        }
    }
    if (!values.phone) {
        errors.phone = 'Phone is required';
    }

    return errors;
}
