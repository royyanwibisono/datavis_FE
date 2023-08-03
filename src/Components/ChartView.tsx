import { Serie } from '@nivo/line';
import axios from 'axios';
import React, { useEffect } from 'react';
import InputComponent, { InputValues, ItemKey } from './InputComponent';
import MyLineChart from './MyLineChart';
import MyLineChartus from './MyLineChartus';

const ChartView: React.FC = () => {
  const [TMin, setTMin] = React.useState<string>("")
  const [TMax, setTMax] = React.useState<string>("")
  const [Resolution, setResulition] = React.useState<string>("1s")
  const [Data, setData] = React.useState<Serie[]|null>(null)
  const [Items, setItems] = React.useState<ItemKey[]>([])

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
          formateddata[i-1].data.push({ x : index+1, y : row[i] as number, xtime: new Date(row[0] as string)})
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

  useEffect(() => {
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
  },[]);

  return (<>
    <h1>Vibration Line Chart</h1>
    <InputComponent onSubmit={handleFormSubmit} itemKeys={Items} onItemKeyToggled={itemToggled} res={Resolution} ts={TMin} te={TMax}/>
    {Data !== null && Resolution !== 'us' && <MyLineChart data={Data}/>}
    {Data !== null && Resolution === 'us' && <MyLineChartus data={Data}/>}
  </>)
}

export default ChartView;