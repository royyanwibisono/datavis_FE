import { Serie } from '@nivo/line';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ItemKey } from './InputComponent';
import MyLineChartus from './MyLineChartus';
import InputAutofill from './InputAutofill';
import { Link } from 'react-router-dom';

interface Props {
  hashValue: string | null;
  searchValue: string | null;
}

const DataView: React.FC<Props> = (prop) => {
  const [TMin, setTMin] = React.useState<string>("")
  const [TMax, setTMax] = React.useState<string>("")
  const [hashValue, setHashValue] = useState<string | null>(prop.hashValue);
  const [res, setRes] = useState<string>("us");
  const [ts, setTs] = useState<string>("");
  const [te, setTe] = useState<string>("");
  const [cols, setCols] = useState<string>("tachometer")
  const [skipr,SetSkipr] = useState<string>("50000")
  const [Data, setData] = React.useState<Serie[]|null>(null)

  useEffect(() => {
    // Read hash value from location hash
    const hash = prop.hashValue;
    if (hash) {
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
  
    axios.post(window.location.protocol+'//'+window.location.hostname+":7000"+'/timerange', { res : "1s"}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        // Handle the response if needed
        console.log('Response:', response.data);
        setTMin(response.data.TMin)
        setTMax(response.data.TMax)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },[])

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
    if (prop.hashValue) {
      axios.post(window.location.protocol+'//'+window.location.hostname+":7000"+prop.hashValue, inputValues, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          // Handle the response if needed
          console.log('Response:', response.data);
          formatData(response.data)
        })
        .catch((error) => {
          // Handle errors
          console.error('Error:', error);
        });
    }
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Resolution Value:</td>
            <td>
              <InputAutofill
                placeholder='Resolution Value'
                initialValue={res}
                autocompleteOptions={["us", "ms", "50ms", "1s"]}
                setInput={setRes}
              />
            </td>
            <td rowSpan={5}>
              <Link to={hashValue+`?res=${res}&ts=${ts}&te=${te}&cols=${cols}&skipr=${skipr}`}>Execute &gt;&gt;</Link>
            </td>
          </tr>
          <tr>
            <td>Time Start Value:</td>
            <td>
              <InputAutofill
                placeholder='Time Start Value'
                initialValue={ts}
                autocompleteOptions={[TMin, TMax]}
                setInput={setTs}
              />
            </td>
          </tr>
          <tr>
            <td>Time Ends Value:</td>
            <td>
              <InputAutofill
                placeholder='Time Ends Value'
                initialValue={te}
                autocompleteOptions={[TMin, TMax]}
                setInput={setTe}
              />
            </td>
          </tr>
          <tr>
            <td>Columns Value:</td>
            <td>
              <InputAutofill
                placeholder='Columns Value'
                initialValue={cols}
                autocompleteOptions={["tachometer", "uba_axial", "uba_radial", "uba_tangential", "oba_axial", "oba_radial", "oba_tangential", "microphone"]}
                setInput={setCols}
              />
            </td>
          </tr>
          <tr>
            <td>Skip Row Value:</td>
            <td>
              <InputAutofill
                placeholder='Skip Row Value'
                initialValue={skipr}
                autocompleteOptions={["1", "20", "50", "100", "1000", "10000"]}
                setInput={SetSkipr}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {Data !== null && <MyLineChartus data={Data}/>}
    </div>
  );
};

export default DataView;
