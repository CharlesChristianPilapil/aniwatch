import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

type SetFormErrorsProps<T extends FieldValues> = {
    setError: UseFormSetError<T>;
    errors: Partial<Record<keyof T, string>>;
}

export const setFormErrors = <T extends FieldValues>({
    setError,
    errors
}: SetFormErrorsProps<T>) => {
    Object.entries(errors).forEach(([field, message]) => {
        if (message) setError(field as Path<T>, { type: "manual", message })
    });
};