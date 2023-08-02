import { Serie } from '@nivo/line';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ItemKey } from './InputComponent';
import MyLineChartus from './MyLineChartus';


interface Props {
  hashValue: string | null;
  searchValue: string | null;
}

const DataView: React.FC<Props> = (prop) => {
  const [hashValue, setHashValue] = useState<string | null>(null);
  const [res, setRes] = useState<string | null>("us");
  const [ts, setTs] = useState<string | null>("");
  const [te, setTe] = useState<string | null>("");
  const [cols, setCols] = useState<string | null>("tachometer")
  const [skipr,SetSkipr] = useState<string | null>("50000")
  const [Data, setData] = React.useState<Serie[]|null>(null)

  useEffect(() => {
    // Read hash value from location hash
    const hash = prop.hashValue;
    if (hash) {
      // Remove the leading '#' character
      setHashValue(hash);
    }

    // Read search value from location search
    const search = prop.searchValue;
    if (search) {
      const searchParams = new URLSearchParams(search);
      const searchObject: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        searchObject[key] = value;
        switch (key) {
          case 'res':
            setRes(value)
            break;
          case 'ts':
            setTs(value)
            break;
          case 'te':
            setTe(value)
            break;
          case 'cols':
            setCols(value)
            break;
          case 'skipr':
            SetSkipr(value)
            break;
          default:
            break;
        }
      }); 
      
      handleFormSubmit(searchObject)
    }
  }, [prop.hashValue, prop.searchValue]);

  const formatData = (responsedata: DataResponse) => {
    const formateddata : Serie[] = [];
    const ik: ItemKey[] = []
    for (let index = 1; index < responsedata.Keys.length; index++) {
      const d: Serie = {
        id:responsedata.Keys[index],
        data : [],
        enabled: true,
      }

      formateddata.push(d);
      ik.push({
        name: d.id,
        toggle: true
      } as ItemKey);
    }

    for (let index = 0; index <  responsedata.DataValue.length; index++) {
      const row: unknown[] = responsedata.DataValue[index];
      for (let i = 1; i < row.length; i++) {
        formateddata[i-1].data.push({ x : index+1, y : row[i] as number})
      }
    }

    setData(formateddata)

  };


  const handleFormSubmit = (inputValues: Record<string, string>) => {
    axios.post('http://localhost:7000/data', inputValues, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        // Handle the response if needed
        // console.log('Response:', response.data);
        formatData(response.data)
      })
      .catch((error) => {
        // Handle errors
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <p>Hash Value: {hashValue || 'No hash value found'}</p>
      <p>Resolution Value: {res || 'No Res value found'}</p>
      <p>Time Start Value: {ts || 'No Res value found'}</p>
      <p>Time Ends Value: {te || 'No Res value found'}</p>
      <p>Columns Value: {cols || 'No Res value found'}</p>
      <p>Skip Row Value: {skipr || 'No Res value found'}</p>
      {Data !== null && <MyLineChartus data={Data}/>}

    </div>
  );
};

export default DataView;
