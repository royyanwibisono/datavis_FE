import React, { useEffect } from 'react';
import { Routes,Route, useNavigate  } from 'react-router-dom'
import DataView from './Components/DataView';
import ChartView from './Components/ChartView';
import Navbar from './Components/Navbar';

function App() {
  const navigate = useNavigate()
  // This useEffect will trigger when the component mounts (on page load)
  useEffect(() => {
    if (window.location.hash.length > 1){
      navigate(window.location.hash.substring(1))
    }
  }, []);

  return (
    <Navbar>
      <Routes>
        <Route index path={'/data'} element={<DataView key={window.location.search} hashValue={window.location.pathname} searchValue={window.location.search} />} />
        <Route index path={'/'} element={<ChartView />} />
      </Routes>
    </Navbar>
  )
}

export default App
