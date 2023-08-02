import React from 'react';
import { Point, ResponsiveLine, Serie } from '@nivo/line';

interface Datas {
  data: Serie[]
}

interface P {
  point: Point
}


const MyLineChartus: React.FC<Datas> = ({data}) => {
  const enabledData = data.filter((series) => series.enabled);

  const MyCustomTooltip: React.FC<P> = ({ point }) => {
    return (
      <div style={{ background: '#00000080', padding: '4px', border: '1px solid black' }}>
        <p>{point.serieId}</p>
        <p>X: {point.data.xFormatted}</p>
        <p>Y: {point.data.yFormatted}</p>
      </div>
    );
  };

  return (
    <div style={{ height: '800px', width: '100vw', minWidth: '600px'}}>
      <ResponsiveLine
        data={enabledData}
        margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
        xScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false
        }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        // axisBottom={{
        //   format: '%H:%M:%S.%L', // Format to display date with microsecond resolution
        // }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'float',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        colors={{ scheme: 'category10' }}
        enablePoints={false}
        legends={[
          {
            anchor: 'right',
            itemBackground: "white",
            itemTextColor: "#777",
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 40,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 110,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
          },
        ]}
        tooltip={({ point }) => <MyCustomTooltip point={point} />}
      />
    </div>
  );
};

export default MyLineChartus;
