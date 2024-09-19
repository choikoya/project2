//차량 구분 도넛 차트

import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function VehicleTypeDoughnut({ data, options }) {
  return (
    <div className="flex-item small-chart">
      <Doughnut data={data} options={options} width={200} height={200} />
    </div>
  );
}

export default VehicleTypeDoughnut;
