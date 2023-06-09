import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import * as React from 'react';
import "./App.css";
import Box from '@mui/material/Box';
import { TreeView, TreeItem } from '@mui/lab';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

import { styled, alpha } from '@mui/material/styles';
import { treeItemClasses } from '@mui/lab/TreeItem';
import Divider from '@mui/material/Divider';
import { Button, ButtonGroup } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



function buildTree(processes, parentPid) {
    return processes
      .filter((process) => process.parent_pid === parentPid)
      .map((process) => ({
        id: process.pid,
        name: process.name,
        children: buildTree(processes, process.pid),
      }));
  }
  function renderTree(node) {
    return (
      <StyledTreeItem key={node.id} nodeId={node.id.toString()} label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
            <Box sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                <b>PID:</b> {node.id} <Divider/> <b>Name:</b> {node.name}
            </Box>
            <Box sx={{ p: 0.5, pr: 0 }}>
                {node.children.length > 0 ? node.children.length + (node.children.length == 1 ? ' child': ' children') : null}
            </Box>
        </Box>
      }>
        {Array.isArray(node.children)
          ? node.children.map((child) => renderTree(child))
          : null}
      </StyledTreeItem>
    );
  }

  const StyledTreeItem = styled((props) => (
    <TreeItem {...props}  />
  ))(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }));
  
const kill_processes_recursively = (pid) => {
  pid = parseInt(pid);
  console.log("PID: " + pid);
    invoke("kill_processes_recursively", {pid: pid}).then((result) => {
        console.log(result);
    });
}; 


function ProcessesTree({processes}) 
{
    useEffect(() => {
        console.log("ProcessesTree mounted")
        setTreeData(buildTree(processes, 0))
    }, [processes]);
    console.log(processes);
    const [treeData, setTreeData] = useState(buildTree(processes, 0));
    const [selectedNode, setSelectedNode] = useState(null);
    console.log(treeData);

    const [open, setOpen] = React.useState(false);
    const openDialog = () => {
      setOpen(true);
    };
    const closeDialog = () => {
      setOpen(false);
    };


    return (
      <Box>
        <div style={{ display: 'flex', justifyContent: "center" }}>
        {selectedNode && <Button variant="contained" size="large" onClick={() => {kill_processes_recursively(selectedNode); setTreeData(buildTree(processes, 0))}}>Kill entire branch</Button>}
        </div>
        <TreeView
        defaultCollapseIcon={<IndeterminateCheckBoxIcon />}
        defaultExpandIcon={<AddBoxIcon />}
        defaultEndIcon={<DisabledByDefaultIcon className="close"/>}
        onNodeSelect={(event, node) => {setSelectedNode(node); console.log(node);}}
        >{treeData.map((node) => renderTree(node))}</TreeView>
      </Box>
    )
}

export default ProcessesTree;