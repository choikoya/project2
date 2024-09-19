//시간별 출입 차량 통계 차트

import React from 'react';
import { Line } from 'react-chartjs-2';

function TimeVehicleChart({ data, options }) {
  return (
    <div className="flex-item">
      <Line data={data} options={options} />
    </div>
  );
}

export default TimeVehicleChart;
