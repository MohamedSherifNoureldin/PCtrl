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
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TableChartIcon from '@mui/icons-material/TableChart';

//tabs
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import ProcessesTable from "./ProcessesTable";
import SystemInfo from "./SystemInfo";

function App() {
  const [rows, setRows] = useState([]);
  const [systemInfo, setSystemInfo] = useState([])
  const [pausedTableUpdate, setPausedTableUpdate] = useState(false);

  // graphs
  const [cpuUsageData, setCpuUsageData] = useState([]);

  const MINUTE_MS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      if(pausedTableUpdate) return;
      invoke("get_processes").then((res) => {
        setRows(res);
      });
      invoke("get_system_info").then((res) => {
        setSystemInfo(res);
        console.log(res);
        const cpuUsageData = res.cpu_hist.map((data, index) => {
          const cores = data.reduce((acc, val, coreIndex) => {
            acc[`core${coreIndex + 1}`] = val;
            return acc;
          }, {});
        
          return {
            name: `${index + 1}st second`,
            ...cores,
          };
        });
        setCpuUsageData(cpuUsageData);
        
        console.log(cpuUsageData);
      })
      console.log("Updated Processes")
    }, MINUTE_MS);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [pausedTableUpdate]);

  // Tabs
  const [value, setValue] = React.useState('1');

  const handleValueChange = (event, newValue) => {
    setValue(newValue);
  };

  
  return (

    <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={handleValueChange} centered>
        <Tab label="Table of Processes" value="1" icon={<TableChartIcon />} iconPosition="start"/>
        <Tab label="System Information & Graphs" value="2" icon={<EqualizerIcon />} iconPosition="start"/>
      </TabList>
    </Box>
    <TabPanel value="1" style={{padding: 0, margin: 0}}>
      <ProcessesTable 
        rows={rows}
        pausedTableUpdate={pausedTableUpdate}
        setPausedTableUpdate={setPausedTableUpdate}
        />    
    </TabPanel>
    <TabPanel value="2">
      <SystemInfo
        systeminfo={systemInfo}
        cpuUsageData={cpuUsageData}
      />
    </TabPanel>
  </TabContext>

  );
}

export default App;
