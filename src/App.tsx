import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css'
import InputComponent, { InputValues, ItemKey } from './Components/InputComponent'
import MyLineChart from './Components/MyLineChart'
import { Serie } from '@nivo/line';

interface DataResponse {
  Keys: []
  DataValue: []
  RowCount: number
}

function App() {
  // const [TMin, setTMin] = React.useState<string>("")
  // const [TMax, setTMax] = React.useState<string>("")
  const [Data, setData] = React.useState<Serie[]|null>(null)
  const [Items, setItems] = React.useState<ItemKey[]>([])

  // const [underhang_bearing_accelerometer, setDataUBA] = React.useState<Serie[]|null>(null)
  // const [overhang_bearing_accelerometer, setDataOBA] = React.useState<Serie[]|null>(null)
  // const [DataMicrophone, setDataMicrophone] = React.useState<Serie[]|null>(null)

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

      setItems(ik);
    }

    for (let index = 0; index <  responsedata.DataValue.length; index++) {
      const row: unknown[] = responsedata.DataValue[index];
      for (let y = 1; y < row.length; y++) {
        formateddata[y-1].data.push({ x : new Date(row[0] as string), y : row[y] as number})
      }
    }

    setData(formateddata)

  };


  const handleFormSubmit = (inputValues: InputValues) => {
    axios.post('http://localhost:7000/chart', inputValues, {
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

  const itemToggled = (itemKey: ItemKey) => {
    console.log(itemKey)
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemKey.name ? { ...item, toggle: !itemKey.toggle } : item
      )
    );

    setData((prevItems) =>
      prevItems!.map((item) =>
        item.id === itemKey.name ? { ...item, enabled: !itemKey.toggle } : item
      )
    );

    console.log(Data)
  }

  // This useEffect will trigger when the component mounts (on page load)
  useEffect(() => {
    axios.post('http://localhost:7000/timerange', { res : "1s"}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        // Handle the response if needed
        console.log('Response:', response.data);
        // setTMin(response.data.TMin)
        // setTMax(response.data.TMax)

        handleFormSubmit({
          res: "1s",
          ts: (response.data.TMin + ""),//.substring(0, (response.data.TMin + "").length - 1),
          te: (response.data.TMax + "")//.substring(0, (response.data.TMax + "").length - 1),
        })
      })
      .catch((error) => {
        // Handle errors
        console.error('Error:', error);
      });
  }, []);

  return (
    <>
      <h1>My Nivo Line Chart</h1>
      <InputComponent onSubmit={handleFormSubmit} itemKeys={Items} onItemKeyToggled={itemToggled}/>
      {Data !== null && <MyLineChart data={Data}/>}
    </>
  )
}

export default App
