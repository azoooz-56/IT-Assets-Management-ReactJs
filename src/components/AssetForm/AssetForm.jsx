import React from 'react';
import PropTypes from 'prop-types';
import './AssetForm.css';

function AssetForm({ currentAsset, newAsset, onInputChange, onAddOrEdit, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{currentAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAddOrEdit();
          }}
        >
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={newAsset.brand}
              onChange={onInputChange}
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
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="warranty_expiration_date">Warranty Expiration Date</label>
            <input
              type="date"
              id="warranty_expiration_date"
              name="warranty_expiration_date"
              value={newAsset.warranty_expiration_date}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={newAsset.status}
              onChange={onInputChange}
              required
            >
              <option value="New">New</option>
              <option value="In Use">In Use</option>
              <option value="Damaged">Damaged</option>
              <option value="Dispose">Dispose</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            {currentAsset ? 'Update Asset' : 'Add Asset'}
          </button>
        </form>
      </div>
    </div>
  );
}

AssetForm.propTypes = {
  currentAsset: PropTypes.object,
  newAsset: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onAddOrEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AssetForm;
