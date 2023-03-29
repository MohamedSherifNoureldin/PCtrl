#![feature(linked_list_cursors)]
use std::collections::LinkedList;
use std::vec::Vec;
use std::collections::HashMap;
use std::path::PathBuf;

use users::{get_user_by_uid, get_current_uid, get_group_by_gid}; // libraru for linux users
use procfs::{process::{Process, ProcState}, ticks_per_second, DiskStat}; // proc reading library


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
    open_fds: u16,
    run_duration: u32,
    dir: PathBuf, // program location as a pathbuf  
                  //do .into_os_string().into_string().unwrap() to convert to string
    
    //Data Record
    CPU_hist: LinkedList<u8>,
    RAM_hist: LinkedList<u32>,   //   units is megabytes
    DISK_hist: LinkedList<u32>, //   units is megabytes
    NET_hist: LinkedList<u32>,  //   units is megabytes
    SWAP_Usage: LinkedList<u16>,//   units is megabytes

    //Other Data (not recorded)
    
}

struct SysStats {
    CPU_Name: String,
    CPU_Freq: u16,
    CPU_Temp: i8,
    CPU_coresnum: u8,
    uptime: f64, // in seconds
    mem_total: u32, // in megabytes
    
    UserProcessesCount: u32,

    // Records
    CPU_hist: &mut LinkedList<&mut Vec<u8>>, // vector of usage per cpu core
    RAM_hist: &mut LinkedList<u32>,
    DISK_hist: &mut LinkedList<u32>, // change type according to units
    NET_hist: &mut LinkedList<u32>, // change type according to units
    SWAP_Usage: &mut LinkedList<u16>,
}

impl ProccessFn for Process {
    // define Process functions here

}

// main structures
static mut u32: recordLength;
static mut f16: update_freq = 2; // update data every x seconds

fn Log_Data<T>(list: &mut LinkedList<T>, val:T) { // all stat data entry should be through this function 
    if (list.len() == recordLength) {
        list.cursor_back_mut().remove_current();
    }
    list.push_front(val);
}

fn Update_Procs(pidTable: &mut HashMap, procs: &mut Vec<Process>, sys_stats: &mut SysStats) {
    //create map <pid, proc> to find procs easily and update them
    let me = procfs::process::Process::myself().unwrap();
    let me_stat = me.stat().unwrap();
    let tps = procfs::ticks_per_second().unwrap();
    let child_queue: Vec<(i32, i32)> = Vec::new(); // ppid, pid

    //println!("ttr_nr is {}", me_stat.tty_nr);
    //println!("{: >5} {: <8} {: >8} {}", "PID", "TTY", "TIME", "CMD");
    let mut total_net =0;
    let tty = format!("pty/{}", me_stat.tty_nr().1);
    let mut proc_count =0;
    for prc in procfs::process::all_processes().unwrap() {
        let prc = prc.unwrap();
        let stat = prc.stat().unwrap();
        //if (!prc.is_alive()) {continue};  //For only reading alive proces, ie not dead or zombie

        proc_count += 1;
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
        procs[i].run_duration = (stat.utime + stat.stime + cutime + cstime + guest_time / ticks_per_second()) as u32;  
        procs[i].open_fds = prc.fd_count().unwrap();
        if (stat.ppid > 0) { // parent-child relating
            if (pidTable.contains_key(&stat.ppid)) {
                procs[pidTable[stat.ppid]].children.push(stat.pid);
            }
            else {
                child_queue.push((stat.ppid, stat.pid));
            }
        }
        
        Log_Data(procs[i].RAM_hist, (prc.statm().unwrap().size / 256) as u32); // size in mb 
        Log_Data(procs[i].CPU_hist, ((stat.utime+stat.stime - (procs[i].run_duration*ticks_per_second() - (cutime + cstime + guest_time)))/update_freq *100.0) as u8); // cpu percent time utilization
        Log_Data(procs[i].DISK_hist, prc.io().unwrap().write_bytes/(1024*1024)); // cpu percent time utilization
        Log_Data(procs[i].SWAP_hist, stat.nswap /256); //swap in mb
        
        
        let mut netsum = 0;
        for (key, net_devstat) in prc.dev_status().unwrap().iter() {
            netsum += net_devstat.recv_bytes + net_devstat.sent_bytes;
            total_net += net_devstat.recv_bytes + net_devstat.sent_bytes;
        }
        Log_Data(procs[i].NET_hist, netsum); //network usage in kb

        let diskstats = procfs::diskstats().unwrap();

        // if stat.tty_nr == me_stat.tty_nr {
        //     // total_time is in seconds
        //     let total_time =
        //         (stat.utime + stat.stime) as f32 / (tps as f32);
        //     println!(
        //         "{: >5} {: <8} {: >8} {}",
        //         stat.pid, tty, total_time, stat.comm
        //     );
        // }
    }
    // check for any missed children procs assignment
    for entry in child_queue {
        procs[ pidTable[entry.0] ].children.push(entry.1); // add missing children 
    }

    // UPDATE SYSTEM DATA
    sys_stats.uptime = procfs::Uptime::new().unwrap().uptime;
    let mut cpu_count: u8;
    let mut cpus_usage :Vec<u8>;
    for cpu in procfs::KernelStats::cpu_time {
        cpus_usage[cpu_count] = (cpu.idle - CPU_hist.front().unwrap()[cpu_count]/100 * update_freq) /update_freq*100;
        cpu_count += 1;
    }
    Log_Data(sys_stats.CPU_hist, &mut cpus_usage);
    Log_Data(sys_stats.RAM_hist ,(procfs::Meminfo::new().unwrap().mem_total - procfs::Meminfo::new().unwrap().mem_free) / 1024);
    let mut sum = 0;
    for d in diskstats {
        sum += d.sectors_written;
    }
    Log_Data(sys_stats.DISK_hist , sum * 512/(1024*1024));
    Log_Data(sys_stats.NET_hist , total_net/1024); // in mb
    Log_Data(sys_stats.SWAP_Usage ,(procfs::Meminfo::new().unwrap().swap_total - procfs::Meminfo::new().unwrap().swap_free) / 1024);
    sys_stats.CPU_coresnum = cpu_count;
    sys_stats.UserProcessesCount = proc_count;

    let freq = fs::read_to_string("/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq").unwrap();
    let temp = fs::read_to_string("/sys/class/thermal/thermal_zone0/temp").unwrap();

    let freq = freq.trim().parse::<f64>().unwrap() / 1000.0;
    let temp = temp.trim().parse::<f64>().unwrap() / 1000.0;
    sys_stats.CPU_Freq = freq;
    sys_stats.CPU_Temp = temp;

    let cpuinfo = fs::read_to_string("/proc/cpuinfo").unwrap();
    let model_name = cpuinfo.lines().find(|line| line.starts_with("model name")).unwrap();
    let model_name = model_name.split(":").nth(1).unwrap().trim();
    sys_stats.CPU_Name = model_name
    //println!("CPU model name: {}", model_name);

    // println!("CPU frequency: {:.2} GHz", freq);
    // println!("CPU temperature: {:.2} °C", temp);

}
fn main() {
    // main structures
    let mut processes : Vec<Process> = Vec::new(); 
    let mut getProc : HashMap::new();
    let sys_stats : SysStats;

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
