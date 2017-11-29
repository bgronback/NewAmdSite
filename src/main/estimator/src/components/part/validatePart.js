export default function validateComponent(values) {
    const errors = {};
    if (!values.partNumber) {
        errors.partNumber = 'Part number is required';
    }

    return errors;
}
