import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import * as React from 'react';
import "./App.css";
import Box from '@mui/material/Box';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

import { styled, alpha } from '@mui/material/styles';
import { treeItemClasses } from '@mui/lab/TreeItem';
import Divider from '@mui/material/Divider';


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
  
function ProcessesTree({processes}) 
{
    console.log(processes);
    const [treeData, setTreeData] = useState(buildTree(processes, 0));
    console.log(treeData);

    return (
        <TreeView
        defaultCollapseIcon={<IndeterminateCheckBoxIcon />}
        defaultExpandIcon={<AddBoxIcon />}
        defaultEndIcon={<DisabledByDefaultIcon className="close"/>}
        >{treeData.map((node) => renderTree(node))}</TreeView>
    )
}

export default ProcessesTree;