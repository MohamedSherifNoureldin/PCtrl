#![feature(linked_list_cursors)]
use std::collections::LinkedList;
use std::vec::Vec;
use std::collections::HashMap;
use std::path::PathBuf;
use std::fs::read_to_string;
use std::{thread, time};

use users::{get_user_by_uid, get_group_by_gid, Group}; // libraru for linux users
use procfs::{process::{ProcState}}; // proc reading library



// trait ProccessFn { // process functions here
//     fn getCPU(&self);
//     fn getRAM(&self);
//     fn getDISK(&self);
//     fn getNET(&self);
//     fn getSWAP(&self);
// }


#[derive(Default)]
struct Process {
    PID: u32,
    parent_PID: u32,
    children: Vec<u32>,
    name: String,
    owner: String,
    group: String,
    priority: u8,
    state: p_state,
    open_fds: u16,
    run_duration: u32,
    dir: PathBuf, // program location as a pathbuf  

                  //do .into_os_string().into_string().unwrap() to convert to string
    
    _prev_duration: u64,
    //Data Record
    CPU_hist:  LinkedList<f32>,
    RAM_hist:  LinkedList<u32>,  //   units is megabytes
    DISK_hist: LinkedList<u32>,  //   units is megabytes
    NET_hist:  LinkedList<u32>,  //   units is megabytes
    SWAP_hist: LinkedList<u16>, //   units is megabytes
}

struct p_state{
    procstate: ProcState
}
impl Default for p_state {
    fn default() -> Self {
        Self {
            procstate: ProcState::Running
        }
    }
}

#[derive(Default)]
struct SysStats {
    CPU_Name: String,
    CPU_Freq: u16,
    CPU_Temp: i8,
    CPU_coresnum: u8,
    uptime: f64, // in seconds
    mem_total: u32, // in megabytes
    
    user_proc_count: u32,

    // Records
    CPU_hist: LinkedList<Vec<f32>>, // vector of usage per cpu core
    RAM_hist:  LinkedList<u32>,
    DISK_hist:  LinkedList<u32>, // change type according to units
    NET_hist:  LinkedList<u32>, // change type according to units
    SWAP_hist:  LinkedList<u16>,

    _cpu_total: u64,
}

#[derive(Copy, Clone)]
struct Config {
    record_length : u32,
    update_freq : f32,
}
impl Config {
    fn start() -> Config {
        // reaf config file and assign to config
        Config {
            record_length: 0,
            update_freq : 0.0,
        }
    }
}

// impl ProccessFn for Process {
//     // define Process functions here

// }

// main structures

fn Log_Data<T>(list: &mut LinkedList<T>, val:T, config: Config) { // all stat data entry should be through this function 
    if list.len() == config.record_length as usize {
        list.cursor_back_mut().remove_current();
    }
    list.push_front(val);
}

fn Update_Procs(pidTable: &mut HashMap<i32, u16>, procs: &mut Vec<Process>, sys_stats: &mut SysStats, config: Config) {
    let me = procfs::process::Process::myself().unwrap();
    let me_stat = me.stat().unwrap();
    let tps = procfs::ticks_per_second();
    let mut child_queue: Vec<(i32, i32)> = Vec::new(); // ppid, pid


    //println!("ttr_nr is {}", me_stat.tty_nr);
    //println!("{: >5} {: <8} {: >8} {}", "PID", "TTY", "TIME", "CMD");
    let mut total_net = 0;
    let _tty = format!("pty/{}", me_stat.tty_nr().1);
    let mut proc_count =0;

    let mut cpu_count: u8 = 0;
    let mut cpus_usage :Vec<f32> = Vec::new();
    let mut cpu_total =0;
    for cpu in procfs::KernelStats::new().unwrap().cpu_time {
    	let mut prev:f32 = 0.0;
    	if (sys_stats.CPU_hist.len() > 0) { prev= sys_stats.CPU_hist.front().unwrap()[cpu_count as usize]}
        cpus_usage.push( ((cpu.idle as f32 - prev/100.0 * config.update_freq) /config.update_freq*100.0) );
        cpu_count += 1;
        cpu_total += cpu.user + cpu.nice+cpu.system+cpu.idle+cpu.iowait.unwrap_or(0)+cpu.irq.unwrap_or(0)+cpu.softirq.unwrap_or(0)+cpu.steal.unwrap_or(0)+cpu.guest.unwrap_or(0)+cpu.guest_nice.unwrap_or(0);
    }

    for prc in procfs::process::all_processes().unwrap() {
        let prc = prc.unwrap();
        let stat = prc.stat().unwrap();
        //if (!prc.is_alive()) {continue};  //For only reading alive proces, ie not dead or zombie

        proc_count += 1;
        let i: usize;
        if pidTable.contains_key(&stat.pid) {
            i = pidTable[&stat.pid] as usize; // index of desired process
            if procs[i].name != stat.comm { // proc has been replaced -> clear all history while updating
                procs[i].CPU_hist.clear();
                procs[i].RAM_hist.clear();
                procs[i].DISK_hist.clear();
                procs[i].NET_hist.clear();
            }
        }
        else {
            i = procs.len();
            pidTable.insert(stat.pid, procs.len() as u16);
            let newproc : Process = Process::default();
            procs.push(newproc);
        }
        //let prev_duration = ((procs[i].run_duration as i64 * tps as i64)  - ((stat.cutime + stat.cstime) as i64 + stat.guest_time.unwrap() as i64));
        
        // Read Proc data
        procs[i].state.procstate = stat.state().unwrap();
        procs[i].name = stat.comm;
        procs[i].PID = stat.pid as u32;
        procs[i].parent_PID = stat.ppid as u32;
        procs[i].priority = stat.priority as u8;
        procs[i].run_duration = (stat.utime + stat.stime + stat.cutime as u64 + stat.cstime as u64 + stat.guest_time.unwrap_or_default() / tps) as u32;  
        procs[i].dir = prc.exe().unwrap_or_default();
        procs[i].owner = get_user_by_uid(prc.uid().unwrap()).unwrap().name().to_str().unwrap().to_string();
        procs[i].group = get_group_by_gid(stat.pgrp as u32).unwrap_or(Group::new(0, "none")).name().to_str().unwrap().to_string();
        let fdcout = match prc.fd_count() {
            Ok(fdcount) => {procs[i].open_fds = prc.fd_count().unwrap() as u16; // only for root user
            },
            Err(e) => {},
        };
        // assert_eq!(procs[i].run_duration, (stat.utime + stat.stime + stat.cutime as u64 + stat.cstime as u64 + stat.guest_time.unwrap_or_default() / tps));
        // assert_eq!((stat.utime+stat.stime) as i64, ((procs[i].run_duration as u64 * tps) as u64 - ((stat.cutime + stat.cstime) as u64 + stat.guest_time.unwrap())) as i64);

        if stat.ppid > 0 { // parent-child relating
            if pidTable.contains_key(&stat.ppid) {
                procs[pidTable[&stat.ppid] as usize].children.push(stat.pid as u32);
            }
            else {
                child_queue.push((stat.ppid, stat.pid));
            }
        }
        
        let prev_duration = procs[i]._prev_duration;
        let statm =  match prc.statm() {
            Ok(statm) => { Log_Data(&mut procs[i].RAM_hist, (statm.size / 256) as u32, config); // size in mb 
            },
            Err(e) => {},
        };
        Log_Data(&mut procs[i].CPU_hist, (100.0 * ((stat.utime+stat.stime) - prev_duration) as f32 / (cpu_total - sys_stats._cpu_total) as f32 / cpu_count as f32), config); // cpu percent time utilization
        //Log_Data(&mut procs[i].CPU_hist, (((stat.utime+stat.stime)as i128 - prev_duration) as f32 /config.update_freq *100.0) as u8, config); // cpu percent time utilization
        let prcio = match prc.io() {
            Ok(prcio) => {Log_Data(&mut procs[i].DISK_hist, (prcio.write_bytes/(1024*1024)) as u32, config); // cpu percent time utilization
            },
            Err(e) => {},
        };
        Log_Data(&mut procs[i].SWAP_hist, (stat.nswap /256) as u16, config); //swap in mb
        
        
        let mut netsum:u32 = 0;
        let devstatus = match prc.dev_status() {
            Err(e) => {},
            Ok(devstatus) => {
                for (_key, net_devstat) in devstatus.iter() {
                    netsum += (net_devstat.recv_bytes + net_devstat.sent_bytes) as u32;
                    total_net += net_devstat.recv_bytes + net_devstat.sent_bytes;
                }
            }
        };
    
        
        Log_Data(&mut procs[i].NET_hist, netsum, config); //network usage in kb

        procs[i]._prev_duration = (stat.utime+stat.stime);
    }
    // check for any missed children procs assignment
    for entry in child_queue {
        procs[ pidTable[&entry.0] as usize].children.push(entry.1 as u32); // add missing children 
    }

    // UPDATE SYSTEM DATA
    sys_stats.uptime = procfs::Uptime::new().unwrap().uptime;
    
    
    Log_Data(&mut sys_stats.CPU_hist, cpus_usage, config);
    Log_Data(&mut sys_stats.RAM_hist ,((procfs::Meminfo::new().unwrap().mem_total - procfs::Meminfo::new().unwrap().mem_free) / 1024) as u32, config);
    let mut sum = 0;
    for d in procfs::diskstats().unwrap() {
        sum += d.sectors_written;
    }
    Log_Data(&mut sys_stats.DISK_hist , (sum * 512/(1024*1024)) as u32, config);
    Log_Data(&mut sys_stats.NET_hist , (total_net/1024) as u32, config); // in mb
    Log_Data(&mut sys_stats.SWAP_hist ,((procfs::Meminfo::new().unwrap().swap_total - procfs::Meminfo::new().unwrap().swap_free) / 1024) as u16, config);
    sys_stats.CPU_coresnum = cpu_count;
    sys_stats.user_proc_count = proc_count;

    let freq = read_to_string("/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq").unwrap_or_default();
    let temp = read_to_string("/sys/class/thermal/thermal_zone0/temp").unwrap_or_default();

    let freq = freq.trim().parse::<f64>().unwrap_or_default() / 1000.0;
    let temp = temp.trim().parse::<f64>().unwrap_or_default() / 1000.0;
    sys_stats.CPU_Freq = freq as u16;
    sys_stats.CPU_Temp = temp as i8;

    let cpuinfo = read_to_string("/proc/cpuinfo").unwrap_or_default();
    let model_name = cpuinfo.lines().find(|line| line.starts_with("model name")).unwrap_or_default();
    let model_name = model_name.split(":").nth(1).unwrap_or_default().trim();
    sys_stats.CPU_Name = (*model_name).to_string();
    sys_stats._cpu_total = cpu_total;
    //println!("CPU model name: {}", model_name);

    // println!("CPU frequency: {:.2} GHz", freq);
    // println!("CPU temperature: {:.2} \u00b0C", temp);

}



fn main() {
    // main structures
    let _processes : Vec<Process> = Vec::new(); 
    let _getProc : HashMap<i32, u16> = HashMap::new();
    let _sys_stats : SysStats = SysStats::default();
    let _config : Config = Config::start();

    // arrays of indices sorted per each stat
    let _mem_sort : Vec<u32> = Vec::new(); // contains the indices of processes relative to the processes vector, sorted in their respective order
    let _cpu_sort : Vec<u32> = Vec::new(); // processes[ memsort[0] ]  = max memory usage
    let _disk_sort : Vec<u32> = Vec::new();
    let _net_sort : Vec<u32> = Vec::new();
    let _priority_sort : Vec<u32> = Vec::new();



    println!("Hello, world!");
    
    test_update_procs();
}


fn test_update_procs() {
    let mut pidTable: HashMap<i32, u16> = HashMap::new();
    let mut procs: Vec<Process> = Vec::new();
    let mut sys_stats: SysStats = SysStats {
        CPU_Name: String::new(),
        CPU_Freq: 0,
        CPU_Temp: 0,
        CPU_coresnum: 0,
        uptime: 0.0,
        mem_total: 0,
        user_proc_count: 0,
        CPU_hist: LinkedList::new(),
        RAM_hist: LinkedList::new(),
        DISK_hist: LinkedList::new(),
        NET_hist: LinkedList::new(),
        SWAP_hist: LinkedList::new(),
        _cpu_total:0,
    };
    let config = Config { record_length: 5, update_freq: 1.0 };
    Update_Procs(&mut pidTable, &mut procs, &mut sys_stats, config);
    thread::sleep(time::Duration::from_secs(1));
    Update_Procs(&mut pidTable, &mut procs, &mut sys_stats, config);
    
    println!("{: >8} {: >8} {: >8} {: >8} {: >8} {: >8}", "PID", "PPID", "CMD", "CPU", "OWNER", "DIR");
    
    for prc in procs {
        println!("{: <8} {: <8} {: <8} {:.1} {: <8} {: <8}", prc.PID, prc.parent_PID, prc.name, prc.CPU_hist.front().unwrap(), prc.owner, prc.dir.display());
    }
    
}

#[test]
fn test_log_data() {
    let mut list: LinkedList<u32> = LinkedList::new();
    let config = Config { record_length: 5, update_freq: 1.0 };
    Log_Data(&mut list, 10, config);
    assert_eq!(list.len(), 1);
    assert_eq!(list.front().unwrap(), &10);
    Log_Data(&mut list, 20, config);
    assert_eq!(list.len(), 2);
    assert_eq!(list.front().unwrap(), &20);
    Log_Data(&mut list, 30, config);
    Log_Data(&mut list, 40, config);
    Log_Data(&mut list, 50, config);
    Log_Data(&mut list, 60, config);
    assert_eq!(list.len(), 5);
    assert_eq!(list.front().unwrap(), &60);
}