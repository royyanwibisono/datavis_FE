import React from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';

interface FFTChartProps {
  data: Serie[];
}

const FFTChart: React.FC<FFTChartProps> = ({ data }) => {
  return (
    <div style={{ height: '400px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          legend: 'Frequency',
          legendOffset: 36,
          tickRotation: -90,
        }}
        axisLeft={{
          legend: 'Amplitude',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enablePoints={false}
        enableGridX={false}
        enableGridY={true}
      />
    </div>
  );
};

export default FFTChart;
