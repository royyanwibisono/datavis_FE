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
  res: string;
  ts: string;
  te: string;
}

export interface InputValues {
  res: string;
  ts: string;
  te: string;
}

const InputComponent: React.FC<InputComponentProps> = ({ onSubmit, itemKeys, onItemKeyToggled, res, ts, te}) => {
  const [inputRes, setInputRes] = useState<string>(res)
  const [inputTs, setInputTs] = useState<string>(ts)
  const [inputTe, setInputTe] = useState<string>(te)

  // Update state when props change
  React.useEffect(() => {
    setInputRes(res);
    setInputTs(ts);
    setInputTe(te);
  }, [res, ts, te]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "ts"){
      setInputTs(value)
    }
    if (name === "te"){
      setInputTe(value)
    }
  };

  const handleSubmit = () => {
    onSubmit({
        res: inputRes,
        ts: inputTs,
        te: inputTe,
      });
  };

  const handleToggle = (id: number) => {
    if (itemKeys && itemKeys.length > 0 && onItemKeyToggled) onItemKeyToggled(itemKeys[id])
  };

  const onSelected = (selectedValue: string) => {
    setInputRes(selectedValue)
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
        Resolution : <InputDropdown onChange={onSelected} options={["1s","50ms", "ms", "us"]} value={inputRes} />
        Time Range : <input type="text" onChange={handleInputChange} name="ts" value={inputTs} /> <input type="text" onChange={handleInputChange} name="te" value={inputTe}/>
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
