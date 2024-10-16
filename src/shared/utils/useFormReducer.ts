import { useReducer } from 'react';

// Type Definitions for TypeScript
export type InputObjectType = {
  id: string;
  content: string | boolean | number;
  validity: boolean;
};

export type State = {
  inputs: { [id: string]: InputObjectType };
  masterValidity: boolean;
};

export type Action = {
  type: 'UPDATE' | 'ADD_INPUT' | 'REMOVE_INPUT';
  payload: {
    id: string;
    content?: string | boolean | number;
    validity?: boolean;
  };
};

// Default initial state
export const defaultInitialState: State = {
  inputs: {},
  masterValidity: false,
};

// Helper function to calculate master validity
const calculateMasterValidity = (inputs: {
  [id: string]: InputObjectType;
}): boolean => {
  return Object.values(inputs).every(input => input.validity);
};

// Reducer function to handle state updates
export const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE':
      const updatedInputs = {
        ...state.inputs, /// copy rest of inputs
        [action.payload.id]: {
          ...state.inputs[action.payload.id], // copy original input
          ...action.payload,
        },
      };
      return {
        ...state,
        inputs: updatedInputs,
        masterValidity: calculateMasterValidity(updatedInputs),
      };

    case 'ADD_INPUT':
      if (state.inputs.hasOwnProperty(action.payload.id)) {
        // in case of duplication
        return state;
      }
      const addedInputs = {
        ...state.inputs,
        [action.payload.id]: {
          id: action.payload.id,
          content: action.payload.content || '',
          validity: action.payload.validity || true, // Default true if no validity provided
        },
      };
      return {
        ...state,
        inputs: addedInputs,
        masterValidity: calculateMasterValidity(addedInputs),
      };
    case 'REMOVE_INPUT':
      const { [action.payload.id]: removed, ...reservedInputs } = state.inputs;
      return {
        ...state,
        inputs: reservedInputs,
        masterValidity: calculateMasterValidity(reservedInputs),
      };
    default:
      return state;
  }
};

// Custom hook to encapsulate the use of the form reducer
export const useFormReducer = (initialState = defaultInitialState) => {
  const [formState, formDispatch] = useReducer(formReducer, initialState);

  return { formState, formDispatch };
};
