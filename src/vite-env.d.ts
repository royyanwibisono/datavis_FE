/// <reference types="vite/client" />
interface DataResponse {
  Keys: []
  DataValue: []
  RowCount: number
}

interface AccelerometerData {
  time: number;
  value: number;
}