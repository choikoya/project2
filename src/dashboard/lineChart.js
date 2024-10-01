import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({ data, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.raw}`,
              },
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#333',
              },
            },
          },
          elements: {
            line: {
              tension: 0.4, // 부드러운 곡선
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 10,
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
