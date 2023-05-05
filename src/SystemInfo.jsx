import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useMediaQuery } from '@mui/material';
import { PieChart, Pie, Sector, BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



function SystemInfo({systeminfo, cpuUsageDataLineGraph, cpuUsageDataBarChart, cpuUsageDataPieChart, memUsageDataLineGraph, memUsageDataPieChart}) 
{    
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const colors = 
    [
        "#e2a461","#95cced","#1bc464","#cf1df7","#efb7ac","#d3443d","#f95d52","#3aef37","#3056dd","#bdef58","#d18504","#8bedb9","#9ffceb","#2cd369","#8becf4","#f4a79a","#63ff66",
        "#4298b2","#b2ffbc","#b4e03a","#d16e4d","#0b3070","#35dd59","#c093d8","#c10359","#ed80ab","#77f75d","#7a50af","#acff63","#39d6b1","#393ff9","#0c34ad","#3ef2a1","#ed82e9",
        "#dac0f7","#e881af","#ed1c31","#ebf271","#ef1fc9","#118409","#52a0b7","#ffe399","#6cd873","#8cd6db","#f9c0f0","#ce755a","#a7f4a1","#11dd2c","#afe3ed","#f4b7f2","#9edded",
        "#a8a1f4","#d15df4","#f9f4a9","#ef0792","#58a7b7","#75db08","#5b249e","#671299","#abfcdd",
    ]
    return (
        <Box>
            <Divider style={{paddingBottom: 15}}>
                <Chip label="General Info" style={{width: 300}}/>
            </Divider>
            <Grid container rowSpacing={1} columnSpacing={2} columns={{ xs: 6, sm: 6, md: 12 }}>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Uptime:</b> {systeminfo.uptime} seconds</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>Number of processes:</b> {systeminfo.user_proc_count}</span>
                </Grid>
            </Grid>  

            <Divider style={{padding: 15}}>
                <Chip label="CPU" style={{width: 300}}/>
            </Divider>
            <Grid container rowSpacing={1} columnSpacing={2} columns={{ xs: 6, sm: 6, md: 12 }}>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Name:</b> {systeminfo.cpu_name}</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>Frequency:</b> {systeminfo.cpu_freq} MHz</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Temperature:</b> {systeminfo.cpu_temp} °C</span>
                </Grid>
                <Grid xs={6} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>Number of Cores:</b> {systeminfo.cpu_cores_num}</span>
                </Grid>
            </Grid>  

            <Divider style={{padding: 15}}>
                <Chip label="Memory" style={{width: 300}}/>
            </Divider>
            <Grid container rowSpacing={1} columnSpacing={2} columns={{ xs: 4, sm: 4, md: 12 }}>
                <Grid xs={4} style={{textAlign: isSmallScreen ? 'center' : 'left',}}>
                    <span><b>Total Memory:</b> {systeminfo.mem_total} MB</span>
                </Grid>
                <Grid xs={4} style={{textAlign: 'center'}}>
                    <span><b>Used Memory:</b> {systeminfo.ram_hist[0]} MB</span>
                </Grid>
                <Grid xs={4} style={{textAlign: isSmallScreen ? 'center' : 'right',}}>
                    <span><b>Swap Memory:</b> {systeminfo.swap_hist[0]} MB</span>
                </Grid>
            </Grid>  

            <Divider style={{padding: 15}}>
                <Chip label="CPU Graphs" style={{width: 300}}/>
            </Divider>

            <Grid container rowSpacing={1} columnSpacing={2} columns={{ xs: 6, sm: 6, md: 12 }}>
                <Grid xs={6}>
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
                        <XAxis dataKey="name"/>
                        <YAxis unit="%" ticks={[0, 25, 50, 75, 100]}/>
                        <Tooltip />
                        <Legend />
                        {Array.from({ length: systeminfo.cpu_cores_num }).map((_, index) => (
                            <Line
                            key={`line-${index}`}
                            connectNulls
                            type="monotone"
                            dataKey={`core${index + 1}`}
                            stroke={colors[index]}
                            isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
                </Grid>

                <Grid xs={6}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={500}>
                        <BarChart
                        width={500}
                        height={300}
                        data={cpuUsageDataBarChart}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="core" />
                            <YAxis unit="%" ticks={[0, 25, 50, 75, 100]}/>
                            <Tooltip />
                            <Bar
                                type="monotone"
                                dataKey="usage"
                                fill={colors[2]}
                                isAnimationActive={false}
                            >
                            {cpuUsageDataBarChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index%60]} />
                            ))}
                            </Bar>


                        </BarChart>
                    </ResponsiveContainer>
                </Grid>
                <Grid xs={12}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={500}>
                        <PieChart width={500} height={300}>
                            <Pie
                            data={cpuUsageDataPieChart}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="cpu_usage"
                            isAnimationActive={false}
                            label
                            >
                            {cpuUsageDataPieChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} label={entry.process} fill={colors[index%60]}/>
                            ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Grid>

            </Grid>

            <Divider style={{padding: 15}}>
                <Chip label="Memory Graphs" style={{width: 300}}/>
            </Divider>
            <Grid container rowSpacing={1} columnSpacing={2} columns={{ xs: 6, sm: 6, md: 12 }}>
                <Grid xs={6}>
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
                            <YAxis unit="MB" ticks={[0, systeminfo.mem_total]}/>
                            <Tooltip />
                            <Legend />

                            <Line
                            connectNulls
                            type="monotone"
                            dataKey="mem_usage"
                            stroke={colors[0]}
                            //isAnimationActive={false}
                            />
                            <Line
                            connectNulls
                            type="monotone"
                            dataKey="swap_usage"
                            stroke={colors[1]}
                            //isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
                <Grid xs={6}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={500}>
                        <PieChart width={500} height={300}>
                            <Pie
                            data={memUsageDataPieChart}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="mem_usage"
                            label
                            //isAnimationActive={false}
                            >
                            {memUsageDataPieChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index%60]}/>
                            ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SystemInfo;