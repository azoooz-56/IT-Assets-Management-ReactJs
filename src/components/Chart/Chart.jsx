import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Chart.css';

function Chart({ assets }) {
  const [brandData, setBrandData] = useState([]);
  const [statusSeries, setStatusSeries] = useState([]);

  useEffect(() => {
    if (assets) {
      const brandCount = {};
      const statusCounts = {};

      assets.forEach(asset => {
        brandCount[asset.brand] = (brandCount[asset.brand] || 0) + 1;
        if (!statusCounts[asset.status]) {
          statusCounts[asset.status] = [];
        }
        statusCounts[asset.status].push(asset);
      });

      setBrandData(Object.entries(brandCount).map(([brand, count]) => ({ name: brand, y: count })));

      const seriesData = Object.entries(statusCounts).map(([status, assets]) => ({
        name: status,
        data: [assets.length],
      }));

      setStatusSeries(seriesData);
    }
  }, [assets]);

  const optionsBrandPie = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Number of Assets by Brand',
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        name: 'Brand',
        data: brandData,
        showInLegend: true,
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}', 
        },
      },
    ],
  };

  const optionsStatusColumn = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Number of Assets by Status',
    },
    xAxis: {
      categories: ['Status'], 

    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Assets',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
      },
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      floating: false,
      borderWidth: 1,
      shadow: false,
    },
    series: statusSeries,
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true, 
        },
      },
    },
  };

  return (
    <div className="chart">
      <div className="chart-item">
        <HighchartsReact highcharts={Highcharts} options={optionsBrandPie} />
      </div>
      <div className="chart-item">
        <HighchartsReact highcharts={Highcharts} options={optionsStatusColumn} />
      </div>
    </div>
  );
}

export default Chart;
