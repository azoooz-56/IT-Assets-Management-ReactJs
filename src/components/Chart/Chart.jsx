import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Chart.css';

function Chart({ assets }) {
  const [brandData, setBrandData] = useState([]);
  const [statusSeries, setStatusSeries] = useState([]);

  useEffect(() => {
    if (assets) {
      // Calculate brand distribution
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

      // Prepare status data for column chart
      const seriesData = Object.entries(statusCounts).map(([status, assets]) => ({
        name: status,
        data: [assets.length], // If you have more complex data, you need to adjust this
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
          enabled: true, // Enable data labels
          format: '{point.name}: {point.y}', // Format the data labels
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
      categories: ['Status'], // X-axis category (single category since we have multiple series)

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
          enabled: true, // Enable data labels
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
