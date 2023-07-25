import React from 'react';
import { Point, ResponsiveLine, Serie } from '@nivo/line';
import { timeFormat } from 'd3-time-format';

interface Datas {
  data: Serie[]
}

interface P {
  point: Point
}

const formatTime = timeFormat('%H:%M:%S:%L');

const MyLineChart: React.FC<Datas> = ({data}) => {
  const enabledData = data.filter((series) => series.enabled);

  let delta = "milisecond";

  if (enabledData !== null && enabledData.length > 0 && enabledData[0].data.length > 1) {
    const firstDataPoint = enabledData[0].data[0];
    const secondDataPoint = enabledData[0].data[1];

    // Check if both data points have valid 'x' properties (Date type)
    if (firstDataPoint.x instanceof Date && secondDataPoint.x instanceof Date) {
      const deltaInMillis = Math.abs(secondDataPoint.x.getTime() - firstDataPoint.x.getTime());

      if (deltaInMillis >= 1000) {
        delta = 'second';
      } else if (deltaInMillis >= 1) {
        delta = 'millisecond'
      } else {
        delta = 'microsecond';
      }
    }
  }


  const MyCustomTooltip: React.FC<P> = ({ point }) => {
    return (
      <div style={{ background: '#00000080', padding: '4px', border: '1px solid black' }}>
        <p>{point.serieId}</p>
        <p>X: {formatTime(new Date(point.data.x))}</p>
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
          type: 'time',
          format: '%Y-%m-%dT%H:%M:%S.%LZ', // Format for microsecond resolution
          precision: delta, // Set precision to microsecond
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
        axisBottom={{
          format: '%H:%M:%S.%L', // Format to display date with microsecond resolution
        }}
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
      {/* <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
          type: 'time',
          format: '%Y-%m-%dT%H:%M:%S.%LZ', // Format for microsecond resolution
          precision: 'second', // Set precision to microsecond
        }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        colors={{ scheme: 'category10' }}
        enableCrosshair={false}
        useMesh={false}
        enableSlices="x"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            justify: false,
            translateX: 100,
            translateY: 40,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
          },
        ]}
        axisBottom={{
          format: '%H:%M:%S.%L', // Format to display date with microsecond resolution
          // tickValues: 'every 1 second', // Show ticks every second (adjust as needed)
        }}
        tooltip={(tooltipProps) => (
          <div
            style={{
              background: 'blue',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <p>Date: {tooltipProps.point.data.xFormatted}</p>
            <p>Value: {tooltipProps.point.data.yFormatted}</p>
          </div>
        )}
      /> */}
    </div>
  );
};

export default MyLineChart;
