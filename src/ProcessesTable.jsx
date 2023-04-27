import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";

import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, ButtonGroup } from '@mui/material';
import new_theme from "./theme";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import "./App.css";

// icons
import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const columns = [
    { field: 'pid', headerName: 'PID', flex: 1 },
    { field: 'name', headerName: 'CMD', flex: 3 },
    { field: 'priority', headerName: 'PRI', flex: 1},
    { field: 'parent_pid', headerName: 'PPID', flex: 1},
    { field: 'owner', headerName: 'OWNER', flex: 2},
    { field: 'state', headerName: 'STATE', flex: 2},
    { field: 'open_fds', headerName: 'FD', flex: 1},
    { field: 'start_time', headerName: 'STARTTIME',
      valueGetter: (params) => {
        const options = {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit'
        };
        return `${params.row.start_time ? new Date(params.row.start_time).toLocaleString('en-US', options) : ''}`
      },
      flex: 2
    },
    { field: 'cpu_usage', headerName: 'CPU %',
      valueGetter: (params) => {
        return `${(params.row.cpu_hist[0]*100).toFixed(4)}`
       },
      flex: 1,
      cellClassName: (params) => {
        if(params.row.cpu_hist[0]*100 < 25)
          return 'green';
        else if(params.row.cpu_hist[0]*100 < 50)
          return 'yellow';
        else if(params.row.cpu_hist[0]*100 < 75)
          return 'orange';
        else
          return 'red'; 
      },
      sortComparator: (v1, v2) => {
        return v1 - v2;
      },
    },
    { field: 'memory_usage', headerName: 'MEM %', 
      valueGetter: (params) => {
        return `${((params.row.ram_hist[0]/params.row._mem_total)*100).toFixed(4)}`
       },
       cellClassName: (params) => {
        let mem_usage = (params.row.ram_hist[0]/params.row._mem_total)*100;
        if(mem_usage < 25)
          return 'green';
        else if(mem_usage < 50)
          return 'yellow';
        else if(mem_usage < 75)
          return 'orange';
        else
          return 'red'; 
       },
       flex: 1
      },
  ];
  

function ProcessesTable({rows, pausedTableUpdate, setPausedTableUpdate}) {


    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [selectedRow, setSelectedRow] = useState(null);


    const killProcess = () => {
        invoke("kill_process", { pid: selectedRow }).then((res) => {
          console.log(res);
        });
    };
  
    const pauseProcess = () => {
      invoke("pause_process", { pid: selectedRow }).then((res) => {
        console.log(res);
      });
    };
  
    const resumeProcess = () => {
      invoke("resume_process", { pid: selectedRow }).then((res) => {
        console.log(res);
      });
    };
  
    return (
    <Box>
        <DataGrid 
          autoHeight
          getRowId={(row) => row.pid}
          rows={rows}
          columns={columns}
          initialState={{
            denesity : 'Comfortable',
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10,20,30,40,50]}
          slots={{
            toolbar: GridToolbar,
          }}
          disableMultipleRowSelection={true}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
            setSelectedRow(newRowSelectionModel[0]);
          }}
          rowSelectionModel={rowSelectionModel}
          hideFooterSelectedRowCount={true}
          
        />
        <div style={{ display: 'flex', justifyContent: "space-between" }}>
          {selectedRow && (
          <ButtonGroup
            color="primary"
            aria-label="row actions"
            variant="contained"
            size="large"
            style={{
              alignItems: 'flex-end',
            }}
          >
            <Button onClick={killProcess} startIcon={<CloseIcon />}>Kill Process</Button>
            <Button onClick={pauseProcess} startIcon={<PauseIcon />}>Pause Process</Button>
            <Button onClick={resumeProcess} startIcon={<PlayArrowIcon />}>Resume Process</Button>
          </ButtonGroup>
          )}
          <Button variant="contained" size="large" startIcon={pausedTableUpdate?<PlayArrowIcon />:<PauseIcon />} onClick={() => setPausedTableUpdate(!pausedTableUpdate)}>
            {pausedTableUpdate?'Resume Table Update':'Pause Table Update'}
          </Button>
        </div>
    </Box>
    )
}

export default ProcessesTable;