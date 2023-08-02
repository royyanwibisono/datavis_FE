import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css'
import InputComponent, { InputValues, ItemKey } from './Components/InputComponent'
import MyLineChart from './Components/MyLineChart'
import { Serie } from '@nivo/line';
import MyLineChartus from './Components/MyLineChartus';
import { Routes,Route, useNavigate  } from 'react-router-dom'
import DataView from './Components/DataView';

function App() {
  const navigate = useNavigate()
  const [TMin, setTMin] = React.useState<string>("")
  const [TMax, setTMax] = React.useState<string>("")
  const [Resolution, setResulition] = React.useState<string>("1s")
  const [Data, setData] = React.useState<Serie[]|null>(null)
  const [Items, setItems] = React.useState<ItemKey[]>([])

  // const [underhang_bearing_accelerometer, setDataUBA] = React.useState<Serie[]|null>(null)
  // const [overhang_bearing_accelerometer, setDataOBA] = React.useState<Serie[]|null>(null)
  // const [DataMicrophone, setDataMicrophone] = React.useState<Serie[]|null>(null)

  const formatData = (res: string, responsedata: DataResponse) => {
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
      for (let i = 1; i < row.length; i++) {
        if (res === "us"){
          formateddata[i-1].data.push({ x : index+1, y : row[i] as number})
        } else {
          formateddata[i-1].data.push({ x : new Date(row[0] as string), y : row[i] as number})
        }
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
        formatData(inputValues.res, response.data)
        setResulition(inputValues.res)
        setTMin(inputValues.ts)
        setTMax(inputValues.te)
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
    if (window.location.hash.length > 1){
      navigate(window.location.hash.substring(1))
    }
    else {
      axios.post('http://localhost:7000/timerange', { res : Resolution}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          // Handle the response if needed
          console.log('Response:', response.data);

          handleFormSubmit({
            res: Resolution,
            ts: (response.data.TMin + ""),//.substring(0, (response.data.TMin + "").length - 1),
            te: (response.data.TMax + "")//.substring(0, (response.data.TMax + "").length - 1),
          })

          setTMin(response.data.TMin)
          setTMax(response.data.TMax)
        })
        .catch((error) => {
          // Handle errors
          console.error('Error:', error);
        });
    }
  }, []);

  return (<>
    <Routes>
      <Route index path={'/data'} element={<DataView hashValue={window.location.pathname} searchValue={window.location.search} />} />
      <Route index path={'/'} element={<>
        <a href={`/data?res=us&ts=${TMin}&te=${TMax}&cols=tachometer,oba_radial&skipr=5000`}>Data View</a>
        <h1>Vibration Line Chart</h1>
        <InputComponent onSubmit={handleFormSubmit} itemKeys={Items} onItemKeyToggled={itemToggled} res={Resolution} ts={TMin} te={TMax}/>
        {Data !== null && Resolution !== 'us' && <MyLineChart data={Data}/>}
        {Data !== null && Resolution === 'us' && <MyLineChartus data={Data}/>}
        </>} />
    </Routes>
    </>
  )
}

export default App
