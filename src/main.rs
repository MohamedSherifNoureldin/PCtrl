#![feature(linked_list_cursors)]
use std::collections::LinkedList;
use std::vec::Vec;
use std::collections::HashMap;
use std::path::PathBuf;

use users::{get_user_by_uid, get_current_uid, get_group_by_gid}; // libraru for linux users
use procfs::{process::{Process, ProcState}, ticks_per_second}; // proc reading library


trait ProccessFn { // process functions here
    fn getCPU(&self);
    fn getRAM(&self);
    fn getDISK(&self);
    fn getNET(&self);
    fn getSWAP(&self);
}
struct Process {
    PID: u32,
    parent_PID: u32,
    children: Vec<u32>,
    name: String,
    owner: String,
    group: String,
    priority: u8,
    state: ProcState,
    OpenFileDesc: Vec<String>,
    run_duration: u32,
    dir: PathBuf, // program location as a pathbuf  
                  //do .into_os_string().into_string().unwrap() to convert to string
    
    //Data Record
    CPU_hist: LinkedList<u8>,
    RAM_hist: LinkedList<u8>,
    DISK_hist: LinkedList<u8>, // change type according to units
    NET_hist: LinkedList<u8>, // change type according to units

    //Other Data (not recorded)
    SWAP_Usage: u32,
}

struct SysStats {
    CPU_Name: String,
    CPU_Freq: u16,
    CPU_Temp: i8,
    CPU_coresnum: u8,
    
    UserProcessesCount: u32,

    // Records
    CPU_hist: LinkedList<u8>,
    RAM_hist: LinkedList<u8>,
    DISK_hist: LinkedList<u8>, // change type according to units
    NET_hist: LinkedList<u8>, // change type according to units
}

impl ProccessFn for Process {
    // define Process functions here

}

// main structures
static mut u32: recordLength;

fn Log_Data<T>(list: &mut LinkedList<T>, val:T) { // all stat data entry should be through this function 
    if (list.len() == recordLength) {
        list.cursor_back_mut().remove_current();
    }
    list.push_front(val);
}

fn Update_Procs(pidTable: &mut HashMap, procs: &mut Vec<Process>) {
    //create map <pid, proc> to find procs easily and update them
    let me = procfs::process::Process::myself().unwrap();
    let me_stat = me.stat().unwrap();
    let tps = procfs::ticks_per_second().unwrap();

    println!("ttr_nr is {}", me_stat.tty_nr);
    println!("{: >5} {: <8} {: >8} {}", "PID", "TTY", "TIME", "CMD");

    let tty = format!("pty/{}", me_stat.tty_nr().1);
    for prc in procfs::process::all_processes().unwrap() {
        let prc = prc.unwrap();
        let stat = prc.stat().unwrap();

        let i:u32;
        if (pidTable.contains_key(statpid)) {
            i = pidTable[stat.pid]; // index of desired process
            if (procs[i].name != stat.comm) { // proc has been replaced -> clear all history while updating
                procs[i].CPU_hist.clear();
                procs[i].RAM_hist.clear();
                procs[i].DISK_hist.clear();
                procs[i].NET_hist.clear();
            }
        }
        else {
            i = procs.len();
            pidTable.insert(stat.pid, procs.len());
            newproc = Process;
            procs.push(newproc);
        }
        // Read Proc data
        procs[i].name = stat.comm;
        procs[i].PID = stat.pid;
        procs[i].parent_PID = stat.ppid;
        procs[i].priority = stat.priority;
        procs[i].state = stat.state().unwrap();
        procs[i].dir = prc.exe().unwrap();
        procs[i].owner = get_user_by_uid(prc.uid().unwrap()).unwrap().name();
        procs[i].group = get_group_by_gid(stat.pgrp).unwrap().name();
        procs[i].run_duration = (stat.utime / ticks_per_second()) as u32;
        // children: Vec<u32>,
        // OpenFileDesc: Vec<String>,
        Log_Data(procs[i].RAM_hist, prc.statm().unwrap().size * 4); // size in Kb  
        // //Data Record
        // CPU_hist: LinkedList<u8>,
        // DISK_hist: LinkedList<u8>, // change type according to units
        // NET_hist: LinkedList<u8>, // change type according to units

        // //Other Data (not recorded)
        // SWAP_Usage: u32,

        if stat.tty_nr == me_stat.tty_nr {
            // total_time is in seconds
            let total_time =
                (stat.utime + stat.stime) as f32 / (tps as f32);
            println!(
                "{: >5} {: <8} {: >8} {}",
                stat.pid, tty, total_time, stat.comm
            );
        }
    }
}
fn main() {
    // main structures
    let mut processes : Vec<Process> = Vec::new(); 
    let mut getProc : HashMap::new();

    // arrays of indices sorted per each stat
    let mut MemSort : Vec<u32> = Vec::new(); // contains the indices of processes relative to the processes vector, sorted in their respective order
    let mut CPUSort : Vec<u32> = Vec::new(); // processes[ memsort[0] ]  = max memory usage
    let mut DiskSort : Vec<u32> = Vec::new();
    let mut NETSort : Vec<u32> = Vec::new();
    let mut PrioritySort : Vec<u32> = Vec::new();
    let mut PrioritySort : Vec<u32> = Vec::new();

    let mut timeStep : u16; // milliseconds between each data refresh

    println!("Hello, world!");
}
