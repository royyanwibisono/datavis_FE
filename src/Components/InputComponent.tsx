import React, { useState } from 'react';
import InputDropdown from './InputDropdown';

export interface ItemKey {
  name: string
  toggle: boolean
}

interface InputComponentProps {
  onSubmit: (inputValues: InputValues) => void;
  itemKeys?: ItemKey[];
  onItemKeyToggled?: (item: ItemKey) => void
}

export interface InputValues {
  res: string;
  ts: string;
  te: string;
}

const InputComponent: React.FC<InputComponentProps> = ({ onSubmit, itemKeys, onItemKeyToggled}) => {
  const [inputValues, setInputValues] = useState<InputValues>({
    res: '',
    ts: '',
    te: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(inputValues);
    // You can reset the input fields here if needed
    setInputValues({
      res: '',
      ts: '',
      te: '',
    });
  };

  const handleToggle = (id: number) => {
    if (itemKeys && itemKeys.length > 0 && onItemKeyToggled) onItemKeyToggled(itemKeys[id])
  };

  const onSelected = (selectedValue: string) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      ["res"]: selectedValue,
    }));
  }

  return (
    <>
      {itemKeys && <div style={{ paddingInline: '30px'}}>
        {itemKeys?.map((itemKey,index) => (
          <label key={itemKey.name}>
            <input
              type="checkbox"
              checked={itemKey.toggle}
              onChange={() => handleToggle(index)}
            />
            {itemKey.name}
          </label>
        ))}
      </div>}
      <div style={{ padding: '30px'}}>
        Resolution : <InputDropdown onChange={onSelected} options={["1s","50ms", "ms", "us"]} value={inputValues.res} />
        Time Range : <input type="text" onChange={handleInputChange} name="ts" /> <input type="text" onChange={handleInputChange} name="te" />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div style={{ padding: '30px'}}>
        <button>Prev</button>
        <button>Next</button>
      </div>
    </>
    
  );
};

export default InputComponent;
