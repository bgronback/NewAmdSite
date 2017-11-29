export default function validateEstimate(values) {
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
    }

    return errors;
}
