import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import Card from '../../Card/Card';
import Chart from '../../Chart/Chart';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [assetData, setAssetData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/assets');
      setAssetData(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const getStatusCounts = () => {
    const counts = assetData.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  };

  const getBrandCounts = () => {
    const counts = assetData.reduce((acc, asset) => {
      acc[asset.brand] = (acc[asset.brand] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([brand, count]) => ({ brand, count }));
  };

  const totalAssets = assetData.length;

  const statusCounts = getStatusCounts();
  const brandCounts = getBrandCounts();

  // Find the most frequent status and brand
  const mostFrequentStatus = statusCounts.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), { status: 'None', count: 0 });
  const mostFrequentBrand = brandCounts.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), { brand: 'None', count: 0 });

  // Suggestion for the fourth card
  const suggestion = `Consider adding more detailed analytics or trends based on asset usage or historical data.`;

  return (
    <div>
      <Header title="Dashboard" />
      {loading && <div className="loading-spinner">Loading...</div>} {/* Move loading indicator here */}
      <div className="card-container">
        <Card
          icon="database"
          title="Total Assets"
          number={totalAssets}
        />
        <Card
          icon="hard-drive"
          title={`Most Status: ${mostFrequentStatus.status}`}
          number={mostFrequentStatus.count}
        />
        <Card
          icon="laptop"
          title={`Most Brand: ${mostFrequentBrand.brand}`}
          number={mostFrequentBrand.count}
        />
        {/* <Card
          icon="suggestion"
          title="Suggestion"
          number={suggestion}
        /> */}
      </div>
      <div className="grid-system">
        <Chart assets={assetData} />
        {/* <Leaderboard />
        <Overview /> */}
      </div>
    </div>
  );
}

export default Dashboard;
