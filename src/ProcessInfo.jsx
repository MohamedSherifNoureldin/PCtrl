import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import * as React from 'react';
import "./App.css";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';

import { PieChart, Pie, Sector, BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



function ProcessInfo({rows, selectedRow}) {
    const colors = 
    [
        "#e2a461", "#95cced", "#1bc464", "#cf1df7", "#efb7ac", "#d3443d", "#f95d52", "#3aef37", "#3056dd", "#bdef58", "#d18504", "#8bedb9", "#9ffceb", "#2cd369", "#8becf4", "#f4a79a",
        "#63ff66","#4298b2","#b2ffbc","#b4e03a","#d16e4d","#0b3070","#35dd59","#c093d8","#c10359","#ed80ab","#77f75d","#7a50af","#acff63","#39d6b1","#393ff9","#0c34ad","#3ef2a1",
        "#ed82e9","#dac0f7","#e881af","#ed1c31","#ebf271","#ef1fc9","#118409","#52a0b7","#ffe399","#6cd873","#8cd6db","#f9c0f0","#ce755a","#a7f4a1","#11dd2c","#afe3ed","#f4b7f2",
        "#9edded","#a8a1f4","#d15df4","#f9f4a9","#ef0792","#58a7b7","#75db08","#5b249e","#671299","#abfcdd",
    ]
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const [processInfo, setProcessInfo] = useState([]);
    const [cpuUsageDataLineGraph, setCpuUsageDataLineGraph] = useState([]);
    const [memUsageDataLineGraph, setMemUsageDataLineGraph] = useState([]);

    useEffect(() => {
        if(selectedRow === null) return;
        let actualProcessInfo = {};
        for(let i = 0; i < rows.length; i++) {
            if(rows[i].pid === selectedRow) {
                setProcessInfo(rows[i]);
                actualProcessInfo = rows[i];
                break;
            }
        }

        // cpu
        // cpu usage line graph data
        const cpuUsageDataLineGraph = actualProcessInfo.cpu_hist.map((data, index) => {
            return {
                name: (index==0)?'1 sec':`${index + 1} secs`,
                cpu_usage: (data*100).toFixed(4),
            };
        });
        setCpuUsageDataLineGraph(cpuUsageDataLineGraph);

        // mem
        // mem usage line graph data
        const memUsageDataLineGraph = actualProcessInfo.ram_hist.map((data, index) => {
        return {
            name: (index==0)?'1 sec':`${index + 1} secs`,
            mem_usage: data,
            swap_usage: actualProcessInfo.swap_hist[index],
        };
        });
        setMemUsageDataLineGraph(memUsageDataLineGraph);


    }, [rows, selectedRow]);
    return (
        <Box>
            <Divider style={{marginBottom: 40}}>
                <Chip label="Process Information" style={{width: 300}}/>
            </Divider>
            <Box>
            <Grid container rowSpacing={3} columnSpacing={2} columns={{ xs: 6, sm: 6, md: 12 }}>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Process ID:</b> {processInfo.pid}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>Parent ID:</b> {processInfo.parent_pid}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Priority:</b> {processInfo.priority}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>Number of Open File Descriptors:</b> {processInfo.open_fds}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Owner:</b> {processInfo.owner}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>Owner's Group:</b> {processInfo.group}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Start Time:</b> {Date(processInfo.start_time).toLocaleString()}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>State:</b> {processInfo.state}</span>
                </Grid>
                <Grid md={12} xs={6} style={{textAlign: 'center'}}>
                    <span><b>Process Command Line:</b> {processInfo.name}</span>
                </Grid>
            </Grid>
            </Box>
            <Divider style={{marginBottom: 40, marginTop: 40}}>
                <Chip label="CPU Usage Graph" style={{width: 300}}/>
            </Divider>
            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={500}>
                <LineChart
                width={500}
                height={300}
                data={cpuUsageDataLineGraph}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%"/>
                    <Tooltip />
                    <Legend />

                    <Line
                    connectNulls
                    type="monotone"
                    dataKey="cpu_usage"
                    label="CPU Usage"
                    stroke="#42a5f5"
                    />
                </LineChart>
            </ResponsiveContainer>
            
            <Divider style={{marginBottom: 40, marginTop: 40}}>
                <Chip label="Memory & Swap Usage Graph" style={{width: 300}}/>
            </Divider>

            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={500}>
                <LineChart
                width={500}
                height={300}
                data={memUsageDataLineGraph}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="MB"/>
                    <Tooltip />
                    <Legend />

                    <Line
                    connectNulls
                    type="monotone"
                    dataKey="mem_usage"
                    stroke={colors[2]}
                    />
                    <Line
                    connectNulls
                    type="monotone"
                    dataKey="swap_usage"
                    stroke={colors[3]}
                    />
                </LineChart>
            </ResponsiveContainer>




        </Box>
    );
}

export default ProcessInfo;