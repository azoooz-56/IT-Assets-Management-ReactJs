import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AssetTable.css';
import { formatDateForDisplay } from './../../helpers/dateUtils';

function AssetTable({ rowData, onEdit, onDelete }) {
  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Brand', field: 'brand', sortable: true, filter: true },
    { headerName: 'Serial Number', field: 'serial_number', sortable: true, filter: true },
    {
      headerName: 'Warranty Expiration Date',
      field: 'warranty_expiration_date',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatDateForDisplay(params.value),
    },
    { headerName: 'Status', field: 'status', sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: function (params) {
        return (
          <div className="action-buttons">
            <button
              className="edit-button"
              onClick={() => onEdit(params.data)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => onDelete(params.data.id)}
            >
              Delete
            </button>
          </div>
        );
      },
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div className="ag-theme-alpine ag-grid-container">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  );
}

export default AssetTable;
