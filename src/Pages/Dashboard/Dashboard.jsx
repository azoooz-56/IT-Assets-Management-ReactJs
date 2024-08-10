import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Chart from '../../components/Chart/Chart';
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

  const mostFrequentStatus = statusCounts.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), { status: 'None', count: 0 });
  const mostFrequentBrand = brandCounts.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), { brand: 'None', count: 0 });


  return (
    <div>
      <Header title="Dashboard" />
      {loading ? <div className="loading-spinner">Loading...</div> : (
        <>
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
      </div>
      <div className="grid-system">
        <Chart assets={assetData} />
      </div>
        </>
      )}

    </div>
  );
}

export default Dashboard;
