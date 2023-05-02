use std::collections::LinkedList;
use std::vec::Vec;
use std::collections::HashMap;

use std::{thread, time::Duration};
extern crate dirs;
use std::fs::{create_dir, OpenOptions};
use std::io::{SeekFrom, Seek, Write, stdout, self};
use chrono::{DateTime, Local, Utc};
use std::path::{Path};
use std::fs::read_to_string; 

use users::{get_user_by_uid, get_group_by_gid, Group}; // library for linux users
use procfs::{ticks_per_second, Meminfo}; // proc reading library
use super::structures::*;

use std::process::{Command, Stdio};

fn log_data<T>(list: &mut LinkedList<T>, val:T, config: Config) {
    if list.len() == config.record_length as usize {
        list.cursor_back_mut().remove_current();
    }

    list.push_front(val);
}

macro_rules! min {
    ($a:expr, $b:expr, $def:expr) => {
        if $a > $b {
            ($a - $b) as f32
        } else {
            $def
        }
    };
}



pub fn update_procs(pid_table: &mut HashMap<u32, u16>, procs: &mut Vec<Process>, sys_stats: &mut SysStats, config: Config) {

    let mut child_queue: Vec<(u32, u32)> = Vec::new(); // ppid, pid

    let mut total_net = 0;

    let mut proc_count:u32 = 0;

    let mut cpu_count: u8 = 0;

    let mut cpus_usage :Vec<f32> = Vec::new();

    let mut cpu_total:Vec<f64> = Vec::new();

    let uptime = procfs::Uptime::new().unwrap().uptime;



    let mut childcounts = 0;


    //sys_stats._idle.clear();

    let kstat = procfs::KernelStats::new().unwrap();
    let cputime = kstat.cpu_time;
    let cputot = kstat.total;
    //let _cputot = ((cputot.user + cputot.nice + cputot.system + cputot.idle + cputot.iowait.unwrap_or(0) + cputot.irq.unwrap_or(0) + cputot.softirq.unwrap_or(0) + cputot.steal.unwrap_or(0)) / ticks_per_second()) as f64;

    for cpu in cputime {
        // + cpu.guest.unwrap_or(0) + cpu.guest_nice.unwrap_or(0);
        
        //100.0 * ((stat.utime+stat.stime) - _prev_duration) as f32 / (cpu_total - sys_stats._cpu_total) as f32 * cpu_count as f32

        let idle = ((cpu.idle + cpu.iowait.unwrap_or(0)) ) ;
        let _cputot = ((cpu.user + cpu.nice + cpu.system + cpu.idle + cpu.iowait.unwrap_or(0) + cpu.irq.unwrap_or(0) + cpu.softirq.unwrap_or(0) + cpu.steal.unwrap_or(0) + cpu.guest.unwrap_or(0) + cpu.guest_nice.unwrap_or(0)) ) ;
        let work = cpu.user + cpu.nice + cpu.system + cpu.irq.unwrap_or(0) + cpu.softirq.unwrap_or(0);
        let mut var;
        if sys_stats._cpu_total.len() <= (cpu_count) as usize || cpu_count == 0 {
            var = 0;
        }
        else {
            var = sys_stats._cpu_total[(cpu_count) as usize];
        }
         let mut var1;
        if sys_stats._idle.len() <= cpu_count as usize || cpu_count == 0 {
            var1 = 0;
        }
        else {
            var1 = sys_stats._idle[(cpu_count) as usize];
        }
        let totald = min!(_cputot, var, 0.0) as f64;

        // let idled = (idle - (var1 / ticks_per_second() as f64)) as f64;
        let workd = min!(work, var1, 0.0) as f64;



        // ((stat.utime+stat.stime)/ticks_per_second()) as f32  / (uptime as f32 - (stat.starttime/ticks_per_second()) as f32)
        
        if sys_stats._cpu_total.len() <= (cpu_count) as usize || cpu_count == 0 {
            sys_stats._cpu_total.push(_cputot);
        }
        else {
            sys_stats._cpu_total[cpu_count as usize] = (_cputot);
        }
        if sys_stats._idle.len() <= cpu_count as usize || cpu_count == 0 {
            sys_stats._idle.push(idle);
        }
        else {
            sys_stats._idle[cpu_count as usize] = (work);
        }
        //cpu_total.push(_cputot);
        cpus_usage.push( (((workd / totald)) * 100.0) as f32);
        //println!("cputotal: {}", _cputot);
        //println!("usage: {}", cpus_usage[cpu_count as usize]);
        //println!("idle: {}", idle);
        //println!("idled: {}", idled);
        //println!("totald: {}", totald);
        //cpus_usage.push(s.cpus());
        //cpus_usage.push( (totald - idled) as f32/ totald as f32);

        
        
        

        cpu_count += 1;

    }


    let mut last_read : u32 = 1;

    //procs.clear();

    pid_table.clear();



    for prc in procfs::process::all_processes().unwrap() {

        let prc = prc.unwrap();

        let stat = prc.stat().unwrap();

        if !prc.is_alive() {continue};  //For only reading alive proces, ie not dead or zombie



        last_read = stat.pid as u32;

        proc_count += 1;

        let i: usize;



        let mut cmd: String = String::new();
        for entry in prc.cmdline().unwrap() {
            cmd.push_str(&format!("{} ", entry));
        }
            
        if proc_count as usize > procs.len() {
            i = procs.len();
            let newproc : Process = Process::default();
            procs.push(newproc);
        }
        else {
            i = proc_count as usize - 1;
            if procs[i].pid != stat.pid as u32 { // proc has been replaced -> clear all history while updating
                procs[i].cpu_hist.clear();
                procs[i].ram_hist.clear();
                procs[i].disk_hist.clear();
                procs[i].net_hist.clear();
            }
            procs[i].children.clear();
        }

        if i >= procs.len() { continue }
        pid_table.insert(stat.pid as u32, i as u16);
        // Read Proc data
        procs[i].state = format!("{:?}",stat.state().unwrap());
        //procs[i].name = stat.comm;
        

        

        if cmd.is_empty() {

            procs[i].name = stat.comm.clone();

        }

        else {

            procs[i].name = cmd;

        }

        procs[i]._mem_total = sys_stats.mem_total;

        procs[i].pid = stat.pid as u32;

        procs[i].parent_pid = stat.ppid as u32;

        procs[i].priority = stat.priority as u8;

        procs[i].start_time = stat.starttime().unwrap();

        procs[i].dir = prc.exe().unwrap_or_default();

        procs[i].owner = get_user_by_uid(prc.uid().unwrap()).unwrap().name().to_str().unwrap().to_string();

        procs[i].group = get_group_by_gid(stat.pgrp as u32).unwrap_or(Group::new(0, "none")).name().to_str().unwrap().to_string();

        match prc.fd_count() {

            Ok(_fdcount) => {procs[i].open_fds = _fdcount as u16; // only for root user

            },

            Err(_e) => {},

        };



        if stat.ppid > 0 { // parent-child relating

            if pid_table.contains_key(&(stat.ppid as u32)) {

                procs[pid_table[&(stat.ppid as u32)] as usize].children.push(stat.pid as u32);

                childcounts += 1;

            }

            else {

                child_queue.push((stat.ppid as u32, stat.pid as u32));

            }

        }

        

        let _prev_duration = procs[i]._prev_duration;

        let _statm =  match prc.statm() {

            Ok(statm) => { log_data(&mut procs[i].ram_hist, (stat.rss_bytes() / (1000*1000)) as u32, config); // size in mb 

            },

            Err(_e) => {},

        };

        //log_data(&mut procs[i].cpu_hist, 100.0 * ((stat.utime+stat.stime) - _prev_duration) as f32 / ((cpu_total - sys_stats._cpu_total) as f32 / cpu_count as f32) as f32, config); // cpu percent time utilization

        //log_data(&mut procs[i].cpu_hist, ((cpu_total - sys_stats._cpu_total) - ()) as f32 / (cpu_total - sys_stats._cpu_total) as f32 * 100.0, config); // cpu percent time utilization

        

        log_data(&mut procs[i].cpu_hist, ((stat.utime+stat.stime)/ticks_per_second()) as f32  / (uptime as f32 - (stat.starttime/ticks_per_second()) as f32) as f32, config); // cpu percent time utilization

        

        let _prcio = match prc.io() {

            Ok(prcio) => {log_data(&mut procs[i].disk_hist, (prcio.write_bytes/(1024*1024)) as u32, config); // cpu percent time utilization

            },

            Err(_e) => {},

        };

        log_data(&mut procs[i].swap_hist, (stat.nswap /256) as u16, config); //swap in mb

        

        let mut netsum:u32 = 0;

        let _devstatus = match prc.dev_status() {

            Err(_e) => {},

            Ok(devstatus) => {

                for (_key, net_devstat) in devstatus.iter() {

                    netsum += (net_devstat.recv_bytes + net_devstat.sent_bytes) as u32;

                    total_net += net_devstat.recv_bytes + net_devstat.sent_bytes;

                }

            }

        };

        log_data(&mut procs[i].net_hist, netsum, config); //network usage in kb

        procs[i]._prev_duration = stat.utime+stat.stime;

    }

    for i in (last_read+1)..(procs[procs.len() -1].pid+1 as u32) { // check if latest procs have ended

        if pid_table.contains_key(&(i.clone())) {

            if pid_table[&(i.clone())] < procs.len() as u16 {

                procs.remove(pid_table[&(i.clone())] as usize);

            }

            pid_table.remove(&(i.clone()));

            if pid_table.contains_key(&i) {

                println!("entry still exists");

                }

        }

    }

    // // check for any missed children procs assignment

    // for entry in child_queue {

    //     procs[ pid_table[&entry.0] as usize].children.push(entry.1 as u32); // add missing children 

    // }

    if  procs.len() > proc_count as usize { // remove any extra processs at the end of the vector

        for i in (proc_count as usize) .. procs.len() {

            if i < procs.len() {

                procs.remove(i);

            }

        }

    }



    // UPDATE SYSTEM DATA

    sys_stats.uptime = uptime;

    let meminfo = Meminfo::new().unwrap();

    sys_stats.mem_total = (meminfo.mem_total as u64 / (1024*1024) as u64) as u32;

    log_data(&mut sys_stats.cpu_hist, cpus_usage.clone(), config);

    log_data(&mut sys_stats.ram_hist ,sys_stats.mem_total -  ((meminfo.mem_free) / (1024*1024)) as u32, config);

    let mut sum = 0;

    for d in procfs::diskstats().unwrap() {

        sum += d.sectors_written;

    }

    log_data(&mut sys_stats.disk_hist , (sum * 512/(1024*1024)) as u32, config);

    log_data(&mut sys_stats.net_hist , (total_net/1024) as u32, config); // in mb

    log_data(&mut sys_stats.swap_hist ,((meminfo.swap_total - meminfo.swap_free) / (1024 * 1024)) as u16, config);

    sys_stats.cpu_cores_num = cpu_count;

    sys_stats.user_proc_count = proc_count;

    

    let freq = read_to_string("/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq").unwrap_or_default();

    let temp = read_to_string("/sys/class/thermal/thermal_zone0/temp").unwrap_or_default();



    let freq = freq.trim().parse::<f64>().unwrap_or_default() / 1000.0;

    let temp = temp.trim().parse::<f64>().unwrap_or_default() / 1000.0;

    sys_stats.cpu_freq = freq as u16;

    sys_stats.cpu_temp = temp as i8;



    let cpuinfo = read_to_string("/proc/cpuinfo").unwrap_or_default();

    let model_name = cpuinfo.lines().find(|line| line.starts_with("model name")).unwrap_or_default();
    let model_name = model_name.split(":").nth(1).unwrap_or_default().trim();
    sys_stats.cpu_name = (*model_name).to_string();
    //sys_stats._cpu_total = cpu_total;
}

pub fn record_prc(procs: &mut Vec<Process>, pid_table: &mut HashMap<u32, u16>, pid: u32, recording_procs: Vec<u32>, config: &mut Config) { // recordings exist in "/usr/local/pctrl/", process record format is plog
    let home = dirs::home_dir().unwrap().into_os_string().into_string().unwrap();
    let file_name = format!("{}/.local/share/pctrl/pctrl_{}.plog", home, pid);    
    //println!("{}/.local/share/pctrl", home);
    unsafe{update_procs(&mut _PID_TABLE, &mut _PROCESSES, &mut _SYS_STATS, *_CONFIG);}

    if !Path::new(&format!("{}/.local/share/pctrl", home)).exists() {
        create_dir(&format!("{}/.local/share/pctrl", home)).unwrap();
    }
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        //.create_new(true)
        //.append(true)
        .open(file_name)
        .unwrap();
    if !pid_table.contains_key(&pid) {
        println!("Err in records proc: couldn't find pid!");
        return
    }
    println!("Recording process {}:{}...", pid, procs[pid_table[&pid] as usize].name);
    println!("Press <ctrl+c> to stop recording.");
    //let prc = &procs[pid_table[&pid] as usize];
    // let mut which_file: bool = false;
    let mut counter = 0;
    let mut stopped = false;
    let mut i =0;
    //while recording_procs.iter().any(|e| pid.contains(e)) && unsafe{!PAUSE_REC} {
    while recording_procs.contains(&pid) && unsafe{!PAUSE_REC} {
        unsafe{update_procs(&mut _PID_TABLE, &mut _PROCESSES, &mut _SYS_STATS, *_CONFIG);} //REMOVE
        if !pid_table.contains_key(&pid) {
            println!("-Process Exited-");
            return
        }
        let prc: Option<&Process> = Some(&procs[pid_table[&pid] as usize]);
        match prc {
            Some(&ref p) => {
                let def32:u32 =0;
                let def16:u16 = 0;
                let timestamp: DateTime<Utc> = DateTime::from_utc(Local::now().naive_utc(), Utc);
                /*println!("{}", format!("{} {} {:?} {} {} {} {} {} {}", p.name, p.owner, 
                p.state.procstate, p.cpu_hist.front().unwrap(), p.ram_hist.front().unwrap_or(&def32), 
                p.disk_hist.front().unwrap_or(&def32), p.net_hist.front().unwrap_or(&def32), p.swap_hist.front().unwrap_or(&def16), timestamp.format("%d/%m/%Y %H:%M:%S")));*/
                writeln!(file, "{}", format!("{} {} {} {} {} {} {} {} {}", p.name, p.owner, 
                p.state, p.cpu_hist.front().unwrap(), p.ram_hist.front().unwrap_or(&def32), 
                p.disk_hist.front().unwrap_or(&def32), p.net_hist.front().unwrap_or(&def32), p.swap_hist.front().unwrap_or(&def16), timestamp.format("%d/%m/%Y %H:%M:%S"))).unwrap();
                stopped = false
            }, // writing using the macro 'writeln!'
            None => {
                writeln!(file, "-Process Exited-").unwrap();
                //println!("-Process Exited-");
                stopped = true
            },
        }
        if !stopped {
            counter += 1;
            if counter > config.max_rec_limit {
                // remove from beginning of file
                file.seek(SeekFrom::Start(0)).unwrap();
                counter = 0;
            }
        }
        thread::sleep(Duration::from_secs(config.update_every as u64));
        i += 1;
    }
}

// function to kill the running process
pub fn kill_process(pid: u32) -> bool {
    let output = std::process::Command::new("kill")
        .arg("-9")
        .arg(pid.to_string())
        .output()
        .expect("failed to kill process");
    output.status.success()
}



pub fn pause_process(pid: u32) -> bool {
    let output = std::process::Command::new("kill")
        .arg("-STOP")
        .arg(pid.to_string())
        .output()
        .expect("failed to pause process");
   output.status.success()
}

pub fn resume_process(pid: u32) -> bool {
    let output = std::process::Command::new("kill")
        .arg("-CONT")
        .arg(pid.to_string())
        .output()
        .expect("failed to resume process");

    output.status.success()
}
pub fn saveConfig() -> Result<(), std::io::Error> {
    let home = dirs::home_dir().unwrap().into_os_string().into_string().unwrap();
    let file_name = format!("{}/.local/share/pctrl/pctrl.conf", home); 
    if !Path::new(&format!("{}/.local/share/pctrl", home)).exists() {
        create_dir(&format!("{}/.local/share/pctrl", home)).unwrap();
    }
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        //.create_new(true)
        //.append(true)
        .open(file_name)?;
    let mut config : Config = unsafe {_CONFIG.clone()};

    writeln!(file, "{}\n{}\n{}\n{}", config.record_length, config.update_every, config.max_rec_limit, config.current_column.as_str());    
    let filters = unsafe{_FILTERS.clone()};
    
    for filter in filters {
        writeln!(file, "{}|{}|{}", filter.column, filter.value, filter.filter_type);                    
    };
            
    Ok(())
}

pub fn keep_alive(_pid: u32) {
    unsafe{
        update_procs(&mut _PID_TABLE, &mut _PROCESSES, &mut _SYS_STATS, *_CONFIG);
    }
    let mut pid = _pid.clone();
    if unsafe{ !_PID_TABLE.contains_key(&pid) } {
        println!("Process not found - Make sure the process is already running to use keepAlive");
        return;
    }
    let cmd = unsafe{ _PROCESSES[ _PID_TABLE[&pid] as usize ].name.clone() };

    let mut running: bool = true;
    println!("Keeping Alive PID:{} ..", pid);
    println!("Press <ctrl+c> to stop keepAlive.");
    while running  {        
        
        if unsafe{ !_PID_TABLE.contains_key(&pid)} {
            //println!("cmd is {}", cmd);
            // let parts = cmd.split(" ").collect::<Vec<&str>>();
            // let args = &cmd[parts[0].len()..];
            let output = Command::new("gnome-terminal")
            .args(&["--tab", "--", "bash", "-c", cmd.clone().as_str()])
            .output().expect("Failed to restart process");
            // let output = Command::new("/bin/sh")
            // .arg("-c")
            // .arg(cmd.clone())
            // .stdout(Stdio::piped())
            // .spawn()
            // //.output()
            // .expect("Failed to restart process");
            
            //println!("output: {:?}", output);

            //Command::new(parts[0]).arg(args).output().expect("Failed to restart process");
            unsafe {
                update_procs(&mut _PID_TABLE, &mut _PROCESSES, &mut _SYS_STATS, *_CONFIG);
                for i in (0 .. _PROCESSES.len()).rev()  {
                    //println!("{}", _PROCESSES[i].name.clone());
                    if cmd == _PROCESSES[i].name {
                        pid = _PROCESSES[i].pid;
                        break;
                    }
                    else if i == 0 {
                        println!("Failed to find pid");
                        return
                    }
                }
            }
            println!("Process revived at {:?}, new PID: {}", chrono::offset::Local::now(), pid);
        }

        thread::sleep(Duration::from_secs( 1 ));

        unsafe{
            update_procs(&mut _PID_TABLE, &mut _PROCESSES, &mut _SYS_STATS, *_CONFIG);
        }

       //print!("\r");

    }
}

pub fn change_priority(pid: u32, priority: i32) -> bool {
    let output;
    output = Command::new("renice")
        .arg(format!("{}", priority))
        .arg(format!("{}", pid))
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .output()
        .expect("Failed to change priority");

    output.status.success()
}