import React, { ChangeEvent } from 'react';

interface InputDropdownProps {
  options: string[];
  value: string;
  onChange: (selectedValue: string) => void;
}

const InputDropdown: React.FC<InputDropdownProps> = ({ options, value, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select value={value} onChange={handleChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default InputDropdown;
