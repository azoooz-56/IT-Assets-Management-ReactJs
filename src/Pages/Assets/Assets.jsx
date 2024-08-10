import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import AssetTable from '../../components/AssetTable/AssetTable';
import AssetForm from '../../components/AssetForm/AssetForm';
import { formatDateForDisplay, convertToInputDateFormat } from '../../helpers/dateUtils';

import { SnackbarProvider, useSnackbar } from 'notistack';
import axios from 'axios';
import './Assets.css';

function Assets() {
  const [rowData, setRowData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newAsset, setNewAsset] = useState({
    brand: '',
    serial_number: '',
    warranty_expiration_date: '',
    status: 'New',
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/assets');
      const formattedData = response.data.map((asset) => ({
        ...asset,
        warranty_expiration_date: convertToInputDateFormat(asset.warranty_expiration_date),
      }));
      setRowData(formattedData);
    } catch (error) {
      console.error('Error fetching assets:', error);
      enqueueSnackbar('Error fetching assets', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asset) => {
    setCurrentAsset(asset);
    setNewAsset({
      brand: asset.brand,
      serial_number: asset.serial_number,
      warranty_expiration_date: convertToInputDateFormat(asset.warranty_expiration_date),
      status: asset.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/assets/${id}`);
      fetchAssets();
      enqueueSnackbar('Asset deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting asset:', error);
      enqueueSnackbar('Error deleting asset', { variant: 'error' });
    }
  };

  const handleAddOrEdit = async () => {
    try {
      const updatedFields = { ...newAsset };
      if (currentAsset) {
        await axios.put(`http://127.0.0.1:8000/api/assets/${currentAsset.id}`, updatedFields);
        enqueueSnackbar('Asset updated successfully', { variant: 'success' });
      } else {
        await axios.post('http://127.0.0.1:8000/api/assets', updatedFields);
        enqueueSnackbar('New asset added successfully', { variant: 'success' });
      }
      fetchAssets();
      setShowModal(false);
      setNewAsset({
        brand: '',
        serial_number: '',
        warranty_expiration_date: '',
        status: 'New',
      });
      setCurrentAsset(null);
    } catch (error) {
      console.error('Error adding or editing asset:', error);
      enqueueSnackbar('Error adding or editing asset', { variant: 'error' });
      
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setCurrentAsset(null);
    setNewAsset({
      brand: '',
      serial_number: '',
      warranty_expiration_date: '',
      status: 'New',
    });
    setShowModal(true);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div>
        <Header title="Assets" />
        <button className="add-button" onClick={openAddModal}>
          Add Asset
        </button>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <AssetTable
            rowData={rowData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {showModal && (
          <AssetForm
            currentAsset={currentAsset}
            newAsset={newAsset}
            onInputChange={handleInputChange}
            onAddOrEdit={handleAddOrEdit}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </SnackbarProvider>
  );
}

export default Assets;