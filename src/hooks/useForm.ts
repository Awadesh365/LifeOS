import { useState, useCallback } from "react";

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, touched = true) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));
  }, []);

  const handleChange = useCallback(
    (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setFieldValue(field, value as T[keyof T]);
    },
    [setFieldValue]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setFieldTouched(field, true);
      if (validate) {
        const errors = validate(state.values);
        setState((prev) => ({ ...prev, errors }));
      }
    },
    [setFieldTouched, validate, state.values]
  );

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();

      // Touch all fields
      const touched = Object.keys(state.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );

      // Validate
      const errors = validate ? validate(state.values) : {};
      setState((prev) => ({ ...prev, touched, errors }));

      // If no errors, submit
      if (Object.keys(errors).length === 0) {
        setIsSubmitting(true);
        try {
          await onSubmit(state.values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [state.values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
    });
  }, [initialValues]);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: state.values[field],
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: !!state.touched[field] && !!state.errors[field],
      helperText: state.touched[field] && state.errors[field],
    }),
    [state.values, state.touched, state.errors, handleChange, handleBlur]
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
  };
}
