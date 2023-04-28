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
  // CPU
  const [cpuUsageDataLineGraph, setCpuUsageDataLineGraph] = useState([]);
  const [cpuUsageDataBarChart, setCpuUsageDataBarChart] = useState([]);
  // MEM
  const [memUsageDataLineGraph, setMemUsageDataLineGraph] = useState([]);
  const [memUsageDataPieChart, setMemUsageDataPieChart] = useState([]);

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
        
        // cpu
        // cpu usage line graph data
        const cpuUsageDataLineGraph = res.cpu_hist.map((data, index) => {
          const cores = data.reduce((acc, val, coreIndex) => {
            acc[`core${coreIndex + 1}`] = val;
            return acc;
          }, {});
        
          return {
            name: `${index + 1}st second`,
            ...cores,
          };
        });
        setCpuUsageDataLineGraph(cpuUsageDataLineGraph);

        // cpu usage bar chart data
        const cpuUsageDataBarChart = res.cpu_hist[0].map((coreUsage, index) => {
          return {
            core: `core${index + 1}`,
            usage: coreUsage,
          };
        });
        setCpuUsageDataBarChart(cpuUsageDataBarChart);

        // mem
        // mem usage line graph data
        const memUsageDataLineGraph = res.ram_hist.map((data, index) => {
          return {
            name: `${index + 1}st second`,
            mem_usage: data,
            swap_usage: res.swap_hist[index],
          };
        });
        setMemUsageDataLineGraph(memUsageDataLineGraph);
      })

      // mem usage pie chart data
      const totalMemUsage = {};
      let otherProcessesMemUsage = 0;
      let totalUsedMemory = 0;
      rows.forEach((process) => {
        const processName = process.name;
        const ramHist = process.ram_hist;
        const memUsage = ramHist[0]*100/systemInfo.mem_total;

        // If the process's memory usage is greater than 5%, add it to the total memory usage object
        if (memUsage > 5) {
          totalMemUsage[processName] = memUsage;
        }
        // If the process's memory usage is less than or equal to 5%, add it to the total memory usage of other processes
        if (memUsage <= 5) {
          otherProcessesMemUsage += memUsage;
        }
        totalUsedMemory += memUsage;
      });

      // Add the total memory usage of other processes to the total memory usage object
      if (otherProcessesMemUsage > 0) {
        totalMemUsage['Other Processes'] = otherProcessesMemUsage;
      }

      // Add the total memory usage of the system to the total memory usage object
      totalMemUsage['Free Memory'] = 100 - totalUsedMemory;

      // Convert the total memory usage object to an array of objects with the desired format
      const memUsageDataPieChart = Object.keys(totalMemUsage).map((processName) => ({
        name: processName,
        mem_usage: totalMemUsage[processName],
      }));

      setMemUsageDataPieChart(memUsageDataPieChart);
      console.log(memUsageDataPieChart);

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
        cpuUsageDataLineGraph={cpuUsageDataLineGraph}
        cpuUsageDataBarChart={cpuUsageDataBarChart}
        memUsageDataLineGraph={memUsageDataLineGraph}
        memUsageDataPieChart={memUsageDataPieChart}
      />
    </TabPanel>
  </TabContext>

  );
}

export default App;
