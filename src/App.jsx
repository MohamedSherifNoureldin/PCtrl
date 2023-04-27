import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";

import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, ButtonGroup } from '@mui/material';

import "./App.css";


const columns = [
  { field: 'pid', headerName: 'PID', },
  { field: 'name', headerName: 'CMD', width: 300 },
  { field: 'priority', headerName: 'PRI'},
  { field: 'parent_pid', headerName: 'PPID'},
  { field: 'owner', headerName: 'OWNER'},
  { field: 'state', headerName: 'STATE'},
  { field: 'open_fds', headerName: 'FD'},
  { field: 'start_time', headerName: 'STARTTIME', width : 300,
    valueGetter: (params) => {
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      };
      return `${params.row.start_time ? new Date(params.row.start_time).toLocaleString('en-US', options) : ''}`
    },

    
  },
];

function App() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  function handleRowSelection(selection) {
    setSelectedRow(selection.length > 0 ? selection[0] : null);
  }

  function handleButtonClick() {
    // Handle button click for the selected row
  }

  useEffect(() => {
    let result = invoke("get_processes").then((res) => {
      setRows(res);
    });
  }, []);
  
  return (
    <div className="container">
      <h1>Welcome to LPM!</h1>
      <div style={{ width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.pid}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          slots={{
            toolbar: GridToolbar,
          }}
          onSelectionModelChange={handleRowSelection}

        />
      </div>
      {selectedRow && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonGroup
            color="primary"
            aria-label="row actions"
            variant="contained"
            size="large"
          >
            <Button onClick={handleButtonClick}>Action 1</Button>
            <Button>Action 2</Button>
            <Button>Action 3</Button>
          </ButtonGroup>
        </div>
      )}

    </div>
  );
}

export default App;
