import { Error } from "mongoose";

/**
 * Converts a Mongoose ValidationError into a simple key-value object.
 * Each key is the field name and value is the corresponding error message.
 * 
 * @param error Mongoose ValidationError
 * @returns Object with field-specific error messages
 */
export const formatValidationError = (error: Error.ValidationError): Record<string, string> => {
    const errors: Record<string, string> = {};
    for (const key in error.errors) {
        errors[key] = error.errors[key]!.message;
    }
    return errors;
};
