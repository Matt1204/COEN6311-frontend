import { useState } from 'react';
import { z, ZodTypeAny, ZodRawShape } from 'zod';

type InputContent = string | number | string[] | number[];

// Define a type for input fields
type Input = {
  // content: string | number | string[] | number[];
  content: InputContent;
  errorMessage: string;
  isFocused: boolean;
};

// Form state type based on the schema keys
type FormState<S extends ZodRawShape> = {
  [K in keyof S]?: Input;
};

// Hook definition
export function useFormState<S extends ZodRawShape>(formSchema: z.ZodObject<S>) {
  // State to store form data
  const [formState, setFormState] = useState<FormState<S>>({});

  // Function to handle input changes
  const handleFormChange = (field: keyof S, value: InputContent) => {
    let validity = formSchema.shape[field]?.safeParse(value);
    const errorMessage = validity.success ? '' : validity.error.errors[0].message;
    setFormState(prevState => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        content: value,
        errorMessage: errorMessage,
        // isFocused: prevState[field]?.isFocused || false,
      },
    }));
  };

  // Function to handle input focus
  const handleFormFocus = (field: keyof S) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: { ...prevState[field], isFocused: true },
    }));
  };

  // Function to handle input blur
  const handleFormBlur = (field: keyof S) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: { ...prevState[field], isFocused: false },
    }));
  };

  // Function to add inputs to the form
  //   const addInputs = (dataList: { field: keyof S; value: string | number }[]) => {
  const addInputs = (dataList: { field: keyof S; value: InputContent }[]) => {
    const newState: FormState<S> = {};
    dataList.forEach(({ field, value }) => {
      const validity = formSchema.shape[field]?.safeParse(value);
      const errorMessage = validity.success ? '' : validity.error.errors[0].message;
      newState[field] = { content: value, errorMessage, isFocused: true };
    });
    setFormState(prevState => ({
      ...prevState,
      ...newState,
    }));
  };

  // Function to remove inputs from the form
  const removeInputs = (keysToRemove: (keyof S)[]) => {
    setFormState(prevState => {
      const newState = { ...prevState };
      keysToRemove.forEach(field => delete newState[field]);
      return newState;
    });
  };

  // Check the overall form validity
  const formIsValid = Object.values(formState).every(input => input && input.errorMessage === '');

  return {
    formState,
    handleFormChange,
    handleFormFocus,
    handleFormBlur,
    addInputs,
    removeInputs,
    formIsValid,
  };
}
