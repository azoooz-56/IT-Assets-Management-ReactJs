import React, { useState, useEffect } from "react";
import Header from "../../Header/Header";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import "./Assets.css";
import { SnackbarProvider, useSnackbar } from "notistack";

function Assets() {
  const [rowData, setRowData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newAsset, setNewAsset] = useState({
    brand: "",
    serial_number: "",
    warranty_expiration_date: "",
    status: "New",
  });

  const [columnDefs] = useState([
    { headerName: "ID", field: "id", sortable: true, filter: true },
    { headerName: "Brand", field: "brand", sortable: true, filter: true },
    {
      headerName: "Serial Number",
      field: "serial_number",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Warranty Expiration Date",
      field: "warranty_expiration_date",
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatDateForDisplay(params.value), // Format date for display
    },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: function (params) {
        return (
          <div className="action-buttons">
            <button
              className="edit-button"
              onClick={() => handleEdit(params.data)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(params.data.id)}
            >
              Delete
            </button>
          </div>
        );
      },
      sortable: false,
      filter: false,
    },
  ]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/assets");
      const formattedData = response.data.map((asset) => ({
        ...asset,
        warranty_expiration_date: convertToInputDateFormat(
          asset.warranty_expiration_date
        ),
      }));
      setRowData(formattedData);
    } catch (error) {
      console.error("Error fetching assets:", error);
      enqueueSnackbar("Error fetching assets", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asset) => {
    setCurrentAsset(asset);
    setNewAsset({
      brand: asset.brand,
      serial_number: asset.serial_number,
      warranty_expiration_date: convertToInputDateFormat(
        asset.warranty_expiration_date
      ),
      status: asset.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/assets/${id}`);
      fetchAssets();
      enqueueSnackbar("Asset deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting asset:", error);
      enqueueSnackbar("Error deleting asset", { variant: "error" });
    }
  };

  const handleAddOrEdit = async () => {
    try {
      const updatedFields = {};

      if (newAsset.warranty_expiration_date) {
        updatedFields.warranty_expiration_date = convertToInputDateFormat(
          newAsset.warranty_expiration_date
        );
      }

      if (currentAsset) {
        Object.keys(newAsset).forEach((key) => {
          if (newAsset[key] !== currentAsset[key]) {
            updatedFields[key] = newAsset[key];
          }
        });
        if (Object.keys(updatedFields).length > 0) {
          await axios.put(
            `http://127.0.0.1:8000/api/assets/${currentAsset.id}`,
            updatedFields
          );
          enqueueSnackbar("Asset updated successfully", { variant: "success" });
        } else {
          enqueueSnackbar("No changes detected for asset", { variant: "info" });
        }
      } else {
        if (newAsset.warranty_expiration_date) {
          newAsset.warranty_expiration_date = convertToInputDateFormat(
            newAsset.warranty_expiration_date
          );
        }
        await axios.post("http://127.0.0.1:8000/api/assets", newAsset);
        enqueueSnackbar("New asset added successfully", { variant: "success" });
      }

      fetchAssets();
      setShowModal(false);
      setNewAsset({
        brand: "",
        serial_number: "",
        warranty_expiration_date: "",
        status: "New",
      });
      setCurrentAsset(null);
    } catch (error) {
      console.error("Error adding or editing asset:", error);
      enqueueSnackbar("Error adding or editing asset", { variant: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setCurrentAsset(null);
    setNewAsset({
      brand: "",
      serial_number: "",
      warranty_expiration_date: "",
      status: "New",
    });
    setShowModal(true);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format as yyyy-mm-dd for display
  };

  const convertToInputDateFormat = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`; // Convert to yyyy-mm-dd for input
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
          <div className="ag-theme-alpine ag-grid-container">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
            />
          </div>
        )}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
              <h2>{currentAsset ? "Edit Asset" : "Add New Asset"}</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddOrEdit();
                }}
              >
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={newAsset.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="serial_number">Serial Number</label>
                  <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    value={newAsset.serial_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="warranty_expiration_date">
                    Warranty Expiration Date
                  </label>
                  <input
                    type="date"
                    id="warranty_expiration_date"
                    name="warranty_expiration_date"
                    value={newAsset.warranty_expiration_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newAsset.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="New">New</option>
                    <option value="In Use">In Use</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Dispose">Dispose</option>
                  </select>
                </div>
                <button type="submit" className="submit-button">
                  {currentAsset ? "Update Asset" : "Add Asset"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </SnackbarProvider>
  );
}

export default Assets;
