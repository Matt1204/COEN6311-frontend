import { useReducer, useState, useEffect } from 'react';
import { ValidatorObjType, validate } from '../../../shared/utils/validators';

type CustomInputType = {
  element: 'input' | 'textarea';
  id: string;
  type?: string; // This was already optional, no change needed here
  label?: string;
  placeholder?: string;
  errorText?: string;
  defaultContent?: string; // Now optional, with a default provided in the component
  defaultValidity?: boolean; // Now optional, with a default provided in the component
  autoComplete?: string; // Now optional, with a default provided in the component
  row?: number;
  validators?: ValidatorObjType[];
  onUpdate: (id: string, content: string, validity: boolean) => void;
};

type StateType = {
  content: string;
  validity: boolean;
  isTouched: boolean;
};

type ActionType = {
  type: 'CHANGE' | 'TOUCH';
  payload?: string;
};

export default function CustomInput({
  element,
  id,
  type = 'text',
  label = '',
  placeholder = '',
  errorText = '',
  defaultContent = '',
  defaultValidity = true,
  autoComplete = 'off',
  row = 3,
  validators = [],
  onUpdate,
}: CustomInputType) {
  const initialState: StateType = {
    content: defaultContent,
    validity: defaultValidity,
    isTouched: false,
  };

  function reducer(state: StateType, action: ActionType): StateType {
    const { type, payload } = action;
    switch (type) {
      case 'CHANGE':
        return {
          ...state,
          content: payload || '',
          validity: validate(payload || '', validators),
        };
      case 'TOUCH':
        return { ...state, isTouched: true };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log(`${id} state.content: ${state.content}`);
    console.log(`${id} state.validity: ${state.validity}`);
    onUpdate(id, state.content, state.validity);
  }, [state.content]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({ type: 'CHANGE', payload: event.target.value });
  };

  function handleTouch(
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    dispatch({ type: 'TOUCH' });
  }

  const InputElement =
    element === 'input' ? (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={handleChange}
        onBlur={handleTouch}
        value={state.content}
      />
    ) : (
      <textarea
        id={id}
        rows={row || 3}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={handleChange}
        onBlur={handleTouch}
        value={state.content}
      />
    );

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {InputElement}
      {!state.validity && state.isTouched && <p>{errorText}</p>}
    </div>
  );
}
