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
import SettingsIcon from '@mui/icons-material/Settings';

// dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const columns = [
    { field: 'pid', headerName: 'PID', flex: 1 },
    { field: 'parent_pid', headerName: 'PPID', flex: 1},
    { field: 'name', headerName: 'CMD', flex: 3 },
    { field: 'priority', headerName: 'PRI', flex: 1},
    { field: 'owner', headerName: 'OWNER', flex: 2},
    { field: 'state', headerName: 'STATE', flex: 2},
    { field: 'open_fds', headerName: 'FD #', flex: 1},
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
        if(params.row._mem_total === 0)
          return '0.0000';
        else
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
  

function ProcessesTable({rows, pausedTableUpdate, setPausedTableUpdate, selectedRow, setSelectedRow, rowSelectionModel, setRowSelectionModel}) {

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

    const changePriority = () => {
      invoke("change_priority_process", { pid: selectedRow, priority: niceValue }).then((res) => {
        console.log("Pri response:", res);
        console.log("Nice value:", niceValue);
        console.log("PID:", selectedRow);
        closeDialog();
      });
    };

    const [open, setOpen] = React.useState(false);
    const openDialog = () => {
      setOpen(true);
    };
    const closeDialog = () => {
      setOpen(false);
    };

    const [niceValue, setNiceValue] = React.useState(0);
  
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
            sorting: {
              sortModel: [{ field: 'pid', sort: 'desc' }],
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
          <Button variant="contained" size="large" startIcon={pausedTableUpdate?<PlayArrowIcon />:<PauseIcon />} onClick={() => setPausedTableUpdate(!pausedTableUpdate)}>
            {pausedTableUpdate?'Resume Table Update':'Pause Table Update'}
          </Button>
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
            <Button onClick={openDialog} startIcon={<SettingsIcon />}>Change Priority</Button>
            <Button onClick={killProcess} startIcon={<CloseIcon />}>Kill Process</Button>
            <Button onClick={pauseProcess} startIcon={<PauseIcon />}>Pause Process</Button>
            <Button onClick={resumeProcess} startIcon={<PlayArrowIcon />}>Resume Process</Button>
          </ButtonGroup>
          )}
        </div>
        <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Change Process Priority</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a nice value from -20 to 19. Please note that the lower the nice value, the higher the priority. The actual priority is calculated as 20 + nice value. If you are not running this application as elevated, then you can only decrease the priority of the process.
          </DialogContentText>
          <FormControl fullWidth style={{marginTop: 20}}>
            <InputLabel id="nice-value-select-label">Nice Value</InputLabel>
            <Select
              labelId="nice-value-select-label"
              id="nice-value-select"
              value={niceValue}
              label="Nice Value"
              onChange={(e) => setNiceValue(e.target.value)}
            >
              <MenuItem value={-20}>-20</MenuItem>
              <MenuItem value={-19}>-19</MenuItem>
              <MenuItem value={-18}>-18</MenuItem>
              <MenuItem value={-17}>-17</MenuItem>
              <MenuItem value={-16}>-16</MenuItem>
              <MenuItem value={-15}>-15</MenuItem>
              <MenuItem value={-14}>-14</MenuItem>
              <MenuItem value={-13}>-13</MenuItem>
              <MenuItem value={-12}>-12</MenuItem>
              <MenuItem value={-11}>-11</MenuItem>
              <MenuItem value={-10}>-10</MenuItem>
              <MenuItem value={-9}>-9</MenuItem>
              <MenuItem value={-8}>-8</MenuItem>
              <MenuItem value={-7}>-7</MenuItem>
              <MenuItem value={-6}>-6</MenuItem>
              <MenuItem value={-5}>-5</MenuItem>
              <MenuItem value={-4}>-4</MenuItem>
              <MenuItem value={-3}>-3</MenuItem>
              <MenuItem value={-2}>-2</MenuItem>
              <MenuItem value={-1}>-1</MenuItem>
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={13}>13</MenuItem>
              <MenuItem value={14}>14</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={17}>17</MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={19}>19</MenuItem>
            </Select>
          </FormControl>
              
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={changePriority}>Update Priority</Button>
        </DialogActions>
      </Dialog>
    </Box>
    )
}

export default ProcessesTable;