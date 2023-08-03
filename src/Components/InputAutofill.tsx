// InputAutofill.tsx
import React, { useState } from 'react';

interface InputAutofillProps {
  placeholder: string;
  autocompleteOptions: string[]; // Pass autocompleteOptions as a prop
  initialValue : string;
  setInput: (value: string) => void;
}

const InputAutofill: React.FC<InputAutofillProps> = ({ placeholder, autocompleteOptions, initialValue, setInput }) => {
  const [inputValue, setValue] = useState(initialValue);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter the options based on the input value
    const filtered = autocompleteOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setFilteredOptions([]);
  };

  const setInputValue = (value: string)=>{
    // setValue(value);
    setInput(value);
  }

  React.useEffect(() =>{
    setValue(initialValue);
  },[initialValue])

  return (
    <div className="input-autofill">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
      {filteredOptions.length > 0 && (
        <ul className="autocomplete-list">
          {filteredOptions.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputAutofill;
