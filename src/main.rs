#![feature(linked_list_cursors)]
use std::collections::LinkedList;
use std::vec::Vec;
use std::collections::HashMap;
use std::path::PathBuf;
use std::fs::{read_to_string, File};
use std::io::Write;

use std::num::NonZeroU32;
use chrono::{DateTime, Local};

use users::{get_user_by_uid, get_group_by_gid, Group}; // library for linux users
use procfs::{process::{ProcState}, ticks_per_second}; // proc reading library

// cursive TUI imports
use cursive::Cursive;
use cursive::theme::{Color, PaletteColor, Theme, BorderStyle};
use cursive::views::{Dialog, TextView, LinearLayout};
use cursive_table_view::{TableView, TableViewItem };
use cursive::CursiveExt;
use cursive::align::HAlign;
use cursive::traits::*;
use std::cmp::Ordering;
extern crate cursive_table_view;

// structure for holding a single process data
#[derive(Default, Clone, Debug, PartialEq)]
struct Process {
    pid: u32,
    parent_pid: u32,
    children: Vec<u32>,
    name: String,
    owner: String,
    group: String,
    priority: u8,
    state: PState,
    open_fds: u16,
    run_duration: u32,
    start_time: DateTime<Local>, // to string via .to_rfc2822()
    dir: PathBuf, // program location as a pathbuf  
    _mem_total: u32,
                  //do .into_os_string().into_string().unwrap() to convert to string
    _prev_duration: u64,
    //Data Record
    cpu_hist:  LinkedList<f32>,
    ram_hist:  LinkedList<u32>,  //   units is megabytes
    disk_hist: LinkedList<u32>,  //   units is megabytes
    net_hist:  LinkedList<u32>,  //   units is megabytes
    swap_hist: LinkedList<u16>, //   units is megabytes
}

// setting the default state of the process to running
#[derive(Clone, Debug, PartialEq)]
struct PState{
    procstate: ProcState
}
impl Default for PState {
    fn default() -> Self {
        Self {
            procstate: ProcState::Running
        }
    }
}

// structure for holding system wide data
#[derive(Default)]
struct SysStats {
    cpu_name: String,
    cpu_freq: u16,
    cpu_temp: i8,
    cpu_cores_num: u8,
    uptime: f64, // in seconds
    mem_total: u32, // in megabytes
    
    user_proc_count: u32,

    // Records
    cpu_hist: LinkedList<Vec<f32>>, // vector of usage per cpu core
    ram_hist:  LinkedList<u32>,
    disk_hist:  LinkedList<u32>, // change type according to units
    net_hist:  LinkedList<u32>, // change type according to units
    swap_hist:  LinkedList<u16>,

    _cpu_total: u64,
    _idle: u64,
}

// structure for holding the user's configuration data
#[derive(Copy, Clone)]
struct Config {
    record_length : u32,
    update_freq : f32,
}
impl Config {
    fn start() -> Config {
        // reaf config file and assign to config
        Config {
            record_length: 10,
            update_freq : 0.1,
        }
    }
}

// TUI table columns enum along with their string representation
#[derive(Copy, Clone, PartialEq, Eq, Hash)]
enum BasicColumn {
    PID,
    PPID,
    CMD,
    PRIORITY,
    CPU,
    MEM,
    STATE,
    STARTTIME,
    OWNER,
    FD,
}

impl BasicColumn {
    fn as_str(&self) -> &str {
        match *self {
            BasicColumn::PID => "PID",
            BasicColumn::PPID => "PPID",
            BasicColumn::CMD => "CMD/Name",
            BasicColumn::PRIORITY => "PRIORITY",
            BasicColumn::CPU => "CPU",
            BasicColumn::MEM => "MEM",
            BasicColumn::STATE => "STATE",
            BasicColumn::STARTTIME => "StartTime",
            BasicColumn::OWNER => "OWNER",
            BasicColumn::FD => "FDs",
        }
    }
}

// TUI table column functions to display and compare data
impl TableViewItem<BasicColumn> for Process {

    fn to_column(&self, column: BasicColumn) -> String {
        match column {
            BasicColumn::PID => format!("{}", self.pid),
            BasicColumn::PPID => format!("{}", self.parent_pid),
            BasicColumn::CMD => self.name.to_string(),
            BasicColumn::PRIORITY => format!("{}", self.priority),
            BasicColumn::CPU => format!("{:.4}", self.cpu_hist.front().unwrap() * 100 as f32),
            // BasicColumn::MEM => format!("{:.4}", ((self.ram_hist.front().unwrap() * 100) as f32/self._mem_total as f32)),
            BasicColumn::MEM => format!("{:.4}", self.ram_hist.front().unwrap()),
            BasicColumn::STATE => format!("{:?}", self.state.procstate),
            // BasicColumn::STATE => format!("{:?}", self.state),
            BasicColumn::STARTTIME => self.start_time.to_rfc2822(),
            BasicColumn::OWNER => self.owner.to_string(),
            BasicColumn::FD => format!("{}", self.open_fds),
        }
    }

    fn cmp(&self, other: &Self, column: BasicColumn) -> Ordering where Self: Sized {
        match column {
            BasicColumn::PID => self.pid.cmp(&other.pid),
            BasicColumn::PPID => self.parent_pid.cmp(&other.parent_pid),
            BasicColumn::CMD => self.name.cmp(&other.name),
            BasicColumn::PRIORITY => self.priority.cmp(&other.priority),
            BasicColumn::CPU => self.cpu_hist.front().unwrap().partial_cmp(&other.cpu_hist.front().unwrap()).unwrap_or(Ordering::Equal),
            BasicColumn::MEM => self.ram_hist.front().unwrap().cmp(&other.ram_hist.front().unwrap()),
            BasicColumn::STATE => format!("{:?}", self.state.procstate).cmp(&format!("{:?}", &other.state.procstate)),
            // BasicColumn::STATE => self.state.cmp(&other.state),
            BasicColumn::STARTTIME => self.start_time.cmp(&other.start_time),
            BasicColumn::OWNER => self.owner.cmp(&other.owner),
            BasicColumn::FD => self.open_fds.cmp(&other.open_fds),
        }
    }
}


// function to add data to the linked list
fn log_data<T>(list: &mut LinkedList<T>, val:T, config: Config) { // all stat data entry should be through this function 
    if list.len() == config.record_length as usize {
        list.cursor_back_mut().remove_current();
    }
    list.push_front(val);
}

// function to read system wide processes along with system wide data and update the data structures
fn update_procs(pid_table: &mut HashMap<u32, u16>, procs: &mut Vec<Process>, sys_stats: &mut SysStats, config: Config) {
    //let tps = procfs::ticks_per_second();
    let mut child_queue: Vec<(u32, u32)> = Vec::new(); // ppid, pid
    let mut total_net = 0;
    let mut proc_count = 0;

    let mut cpu_count: u8 = 0;
    let mut cpus_usage :Vec<f32> = Vec::new();
    let mut cpu_total = 0;
    let uptime = procfs::Uptime::new().unwrap().uptime;

    for cpu in procfs::KernelStats::new().unwrap().cpu_time {
    	//let mut prev:f32 = 0.0;
    	if sys_stats.cpu_hist.len() > 0 {
            //prev = sys_stats.cpu_hist.front().unwrap()[cpu_count as usize]
        }
        cpu_total = cpu.user + cpu.nice + cpu.system + cpu.idle + cpu.iowait.unwrap_or(0) + cpu.irq.unwrap_or(0) + cpu.softirq.unwrap_or(0) + cpu.steal.unwrap_or(0);// + cpu.guest.unwrap_or(0) + cpu.guest_nice.unwrap_or(0);
        //100.0 * ((stat.utime+stat.stime) - prev_duration) as f32 / (cpu_total - sys_stats._cpu_total) as f32 * cpu_count as f32
        let idle = cpu.idle + cpu.iowait.unwrap_or(0);
        let totald = cpu_total as f64 - sys_stats._cpu_total as f64;
        let idled = idle as f64 - sys_stats._idle as f64;
        cpus_usage.push( (totald - idled) as f32/ totald as f32);
        sys_stats._idle = idle;
        cpu_count += 1;
    }

    for prc in procfs::process::all_processes().unwrap() {
        let prc = prc.unwrap();
        let stat = prc.stat().unwrap();
        if (!prc.is_alive()) {continue};  //For only reading alive proces, ie not dead or zombie
        
        proc_count += 1;
        let i: usize;
        if pid_table.contains_key(&(stat.pid as u32)) {
            i = pid_table[&(stat.pid as u32)] as usize; // index of desired process
            if procs[i].name != stat.comm { // proc has been replaced -> clear all history while updating
                procs[i].cpu_hist.clear();
                procs[i].ram_hist.clear();
                procs[i].disk_hist.clear();
                procs[i].net_hist.clear();
            }
        }
        else {
            i = procs.len();
            pid_table.insert(stat.pid as u32, i as u16);
            let newproc : Process = Process::default();
            procs.push(newproc);
        }
        //let prev_duration = ((procs[i].run_duration as i64 * tps as i64)  - ((stat.cutime + stat.cstime) as i64 + stat.guest_time.unwrap() as i64));
        
        // Read Proc data
        procs[i].state.procstate = stat.state().unwrap();
        //procs[i].name = stat.comm;
        let mut cmd: String = String::new();
        for entry in prc.cmdline().unwrap() {
            cmd.push_str(&format!("{} ", entry));
        }
        
        if (cmd.is_empty()) {
            procs[i].name = stat.comm.clone();;
        }
        else {
            procs[i].name = cmd;
        }
        procs[i]._mem_total = sys_stats.mem_total;
        procs[i].pid = stat.pid as u32;
        procs[i].parent_pid = stat.ppid as u32;
        procs[i].priority = stat.priority as u8;
        //procs[i].run_duration = ((stat.utime + stat.stime + stat.cutime as u64 + stat.cstime as u64 + stat.guest_time.unwrap_or_default()) / tps) as u32;  
        procs[i].start_time = stat.starttime().unwrap();
        procs[i].dir = prc.exe().unwrap_or_default();
        procs[i].owner = get_user_by_uid(prc.uid().unwrap()).unwrap().name().to_str().unwrap().to_string();
        procs[i].group = get_group_by_gid(stat.pgrp as u32).unwrap_or(Group::new(0, "none")).name().to_str().unwrap().to_string();
        let _fdcout = match prc.fd_count() {
            Ok(_fdcount) => {procs[i].open_fds = prc.fd_count().unwrap() as u16; // only for root user
            },
            Err(_e) => {},
        };

        if stat.ppid > 0 { // parent-child relating
            if pid_table.contains_key(&(stat.ppid as u32)) {
                procs[pid_table[&(stat.ppid as u32)] as usize].children.push(stat.pid as u32);
            }
            else {
                child_queue.push((stat.ppid as u32, stat.pid as u32));
            }
        }
        
        let prev_duration = procs[i]._prev_duration;
        let _statm =  match prc.statm() {
            Ok(statm) => { log_data(&mut procs[i].ram_hist, (statm.size / 256) as u32, config); // size in mb 
            },
            Err(_e) => {},
        };
        //log_data(&mut procs[i].cpu_hist, 100.0 * ((stat.utime+stat.stime) - prev_duration) as f32 / ((cpu_total - sys_stats._cpu_total) as f32 / cpu_count as f32) as f32, config); // cpu percent time utilization
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
    // check for any missed children procs assignment
    for entry in child_queue {
        procs[ pid_table[&entry.0] as usize].children.push(entry.1 as u32); // add missing children 
    }

    // UPDATE SYSTEM DATA
    sys_stats.uptime = uptime;
    
    sys_stats.mem_total = (10 * procfs::Meminfo::new().unwrap().mem_total as u64 / (1024*1024) as u64) as u32;
    log_data(&mut sys_stats.cpu_hist, cpus_usage, config);
    // if sys_stats.disk_hist.len() > 2 {
    //     println!("systemcpu: {}", 0.5 * (cpus_usage[0] + cpus_usage[1]) );
    // }
    log_data(&mut sys_stats.ram_hist ,((procfs::Meminfo::new().unwrap().mem_total as u64 - procfs::Meminfo::new().unwrap().mem_free) / 1024) as u32, config);
    let mut sum = 0;
    for d in procfs::diskstats().unwrap() {
        sum += d.sectors_written;
    }
    log_data(&mut sys_stats.disk_hist , (sum * 512/(1024*1024)) as u32, config);
    log_data(&mut sys_stats.net_hist , (total_net/1024) as u32, config); // in mb
    log_data(&mut sys_stats.swap_hist ,((procfs::Meminfo::new().unwrap().swap_total - procfs::Meminfo::new().unwrap().swap_free) / 1024) as u16, config);
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
    sys_stats._cpu_total = cpu_total;
}

// function to display the TUI
fn display_tui()
{
    let mut counter: u32 = 0;

    let mut pid_table: HashMap<u32, u16> = HashMap::new();
    let mut procs: Vec<Process> = Vec::new();
    let mut sys_stats: SysStats = SysStats {
        cpu_name: String::new(),
        cpu_freq: 0,
        cpu_temp: 0,
        cpu_cores_num: 0,
        uptime: 0.0,
        mem_total: 0,
        user_proc_count: 0,
        cpu_hist: LinkedList::new(),
        ram_hist: LinkedList::new(),
        disk_hist: LinkedList::new(),
        net_hist: LinkedList::new(),
        swap_hist: LinkedList::new(),
        _cpu_total:0,
        _idle:0,
    };
    let config = Config { record_length: 5, update_freq: 1.0 };

    update_procs(&mut pid_table, &mut procs, &mut sys_stats, config);

    let mut siv = Cursive::default();

    let theme = custom_theme_from_cursive(&siv);
    siv.set_theme(theme);

    // We can quit by pressing `q`
    siv.add_global_callback('q', Cursive::quit);
    
    // pause real time update by pressing space
    siv.add_global_callback(' ', |s| {
        if s.fps() == NonZeroU32::new(0) {
            s.set_fps(1);
            s.call_on_name("status", |view: &mut TextView| {
                view.set_content("Status: Updating in realtime...");
            });
        } else {
            s.set_fps(0);
            s.call_on_name("status", |view: &mut TextView| {
                view.set_content("Status: Paused");
            });
        }
    });

    let mut table = TableView::<Process, BasicColumn>::new()
        .column(BasicColumn::PID, "PID", |c| {
            c.ordering(Ordering::Less)
            .align(HAlign::Right)
            .width_percent(5)
        })
        .column(BasicColumn::PPID, "PPID", |c| c.align(HAlign::Right))
        .column(BasicColumn::CMD, "CMD", |c| c.align(HAlign::Right))
        .column(BasicColumn::PRIORITY, "PRIORITY", |c| c.align(HAlign::Right))
        .column(BasicColumn::CPU, "CPU", |c| c.align(HAlign::Right))
        .column(BasicColumn::MEM, "MEM", |c| c.align(HAlign::Right))
        .column(BasicColumn::STATE, "STATE", |c| c.align(HAlign::Right))
        .column(BasicColumn::STARTTIME, "STARTTIME", |c| c.align(HAlign::Right))
        .column(BasicColumn::OWNER, "OWNER", |c| c.align(HAlign::Right))
        .column(BasicColumn::FD, "FD", |c| c.align(HAlign::Right));

        // BasicColumn::PID => "PID",
        // BasicColumn::PPID => "PPID",
        // BasicColumn::CMD => "CMD/Name",
        // BasicColumn::PRIORITY => "PRIORITY",
        // BasicColumn::CPU => "CPU",
        // BasicColumn::MEM => "MEM",
        // BasicColumn::STATE => "STATE",
        // BasicColumn::STARTTIME => "StartTime",
        // BasicColumn::OWNER => "OWNER",
        // BasicColumn::FD => "FDs",

    
    table.set_items(procs.clone());

    // Detect clicks on column headers
    table.set_on_sort(|siv: &mut Cursive, column: BasicColumn, order: Ordering| {
        siv.add_layer(
            Dialog::around(TextView::new(format!("{} / {:?}", column.as_str(), order)))
                .title("Sorted by")
                .button("Close", |s| {
                    s.pop_layer();
                }),
        );
    });


    siv.add_layer(
        LinearLayout::vertical()
            .child(
                Dialog::around(LinearLayout::vertical()
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("CPU Name: {}", sys_stats.cpu_name)).h_align(HAlign::Left).with_name("cpu_name").full_width())
                        .child(TextView::new(format!("CPU Frequency: {}MHz", sys_stats.cpu_freq)).h_align(HAlign::Left).with_name("cpu_freq").full_width())
                    )
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("CPU Temperature: {} \u{00b0C}", sys_stats.cpu_temp)).h_align(HAlign::Left).with_name("cpu_temp").full_width())
                        .child(TextView::new(format!("Number of cores: {}", sys_stats.cpu_cores_num)).h_align(HAlign::Left).with_name("cpu_cores_num").full_width())
                    )
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("System Uptime: {}s", sys_stats.uptime)).h_align(HAlign::Left).with_name("uptime").full_width())
                        .child(TextView::new(format!("Memory: {}/{} MB",sys_stats.ram_hist.front().unwrap(), sys_stats.mem_total)).h_align(HAlign::Left).with_name("mem_total").full_width())
                    )
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("Swap Usage: {}%", sys_stats.swap_hist.front().unwrap())).h_align(HAlign::Left).with_name("swap_usage").full_width())
                        .child(TextView::new(format!("Number of processes: {}", sys_stats.user_proc_count)).h_align(HAlign::Left).with_name("user_proc_count").full_width())
                    )
                )
                .title("System Information")
            )
            .child(Dialog::around(table.with_name("table").full_screen()).title("Processes"))
            .child(Dialog::around(LinearLayout::horizontal()
                .child(TextView::new("Press <q> to exit. Press <space> to pause/unpase real time update"))
                .child(TextView::new("Status: Updating in realtime...").h_align(HAlign::Right).with_name("status").full_width()
            )).title("Controls"))
    );


    siv.add_global_callback(cursive::event::Event::Refresh, move |s| {
        update_views(s, &mut procs, &mut pid_table, &mut sys_stats, config, counter);
        counter += 1;
    });
    siv.set_autorefresh(true);
    siv.set_fps(1);


    siv.run();
}

// function to update the table view in the TUI
fn update_views(siv: &mut Cursive, procs: &mut Vec<Process>, pid_table: &mut HashMap<u32, u16>, sys_stats: &mut SysStats, config: Config, counter: u32) {
    if counter % 1 == 0
    {
        update_procs(pid_table, procs, sys_stats, config);
        siv.call_on_name("cpu_name", |view: &mut TextView| {
            view.set_content(format!("CPU Name: {}", sys_stats.cpu_name));
        });
        siv.call_on_name("cpu_freq", |view: &mut TextView| {
            view.set_content(format!("CPU Frequency: {}MHz", sys_stats.cpu_freq));
        });
        siv.call_on_name("cpu_temp", |view: &mut TextView| {
            view.set_content(format!("CPU Temperature: {} \u{00b0C}", sys_stats.cpu_temp));
        });
        siv.call_on_name("cpu_cores_num", |view: &mut TextView| {
            view.set_content(format!("Number of cores: {}", sys_stats.cpu_cores_num));
        });
        siv.call_on_name("uptime", |view: &mut TextView| {
            view.set_content(format!("System Uptime: {}s", sys_stats.uptime));
        });
        siv.call_on_name("mem_total", |view: &mut TextView| {
            view.set_content(format!("Memory: {}/{}MB", sys_stats.ram_hist.front().unwrap(), sys_stats.mem_total));
        });
        siv.call_on_name("swap_usage", |view: &mut TextView| {
            view.set_content(format!("Swap Usage: {}%", sys_stats.swap_hist.front().unwrap()));
        });
        siv.call_on_name("user_proc_count", |view: &mut TextView| {
            view.set_content(format!("Number of processes: {}", sys_stats.user_proc_count));
        });
        siv.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
            view.set_items_stable(procs.clone());
        });
    }
}

// function to return a theme with the colors we want for the TUI
fn custom_theme_from_cursive(siv: &Cursive) -> Theme {
    let mut theme = siv.current_theme().clone();

    theme.palette[PaletteColor::Background] = Color::TerminalDefault;
    theme.palette[PaletteColor::View] = Color::TerminalDefault;
    theme.palette[PaletteColor::Primary] = Color::Rgb(255, 255, 255);
    theme.palette[PaletteColor::HighlightText] = Color::Rgb(0, 0, 0);
    theme.palette[PaletteColor::Highlight] = Color::Rgb(0, 230, 118);
    theme.palette[PaletteColor::HighlightInactive] = Color::Rgb(77, 182, 172);
    theme.shadow = false;
    theme.borders = BorderStyle::Simple;

    theme
}

// main function
fn main() {
    // main structures
    let _processes : Vec<Process> = Vec::new(); 
    let _get_proc : HashMap<i32, u16> = HashMap::new();
    let _sys_stats : SysStats = SysStats::default();
    let _config : Config = Config::start();

    let mut recording_procs: Vec<u32>; // pass this to record_prc function, any proc to be recorded should be added to this

    // test_update_procs();
    display_tui();
}

static mut PAUSE_REC:bool = false;
 

fn record_prc(procs:Vec<Process>, pid_table: &mut HashMap<u32, u16>, pid: u32, recording_procs: Vec<u32>, config: Config) { // recordings exist in "/usr/local/pctrl/", process record format is plog
    let file_name = format!("/usr/local/pctrl/pctrl_{}.plog", pid);
    let mut file = File::create(format!("/usr/local/pctrl/pctrl_{}.plog", pid)).unwrap();
    // match File::create(file_name) {
    //     Ok(file) => {},//println!("{:?}", file),
    //     Err(_) => println!("Unable to create the file: '{}'", file_name)
    // }
    if (pid_table[&pid] > procs.len() as u16) {
        println!("Err in records proc: couldn't find pid!");
        return
    }
    let prc = &procs[pid_table[&pid] as usize];
    let mut which_file: bool = false;
    let mut counter = 0;
    //while recording_procs.iter().any(|e| pid.contains(e)) && unsafe{!PAUSE_REC} {
    while recording_procs.contains(&pid) && unsafe{!PAUSE_REC} {
        writeln!(&file, "{}", format!("{} {} {:?} {} {} {} {} {}", prc.name, prc.owner, 
        prc.state.procstate, prc.cpu_hist.front().unwrap(), prc.ram_hist.front().unwrap(), 
        prc.disk_hist.front().unwrap(), prc.net_hist.front().unwrap(), prc.swap_hist.front().unwrap())); // writing using the macro 'writeln!'
        counter += 1;
        if counter > config.record_length {
            // remove from beginning of file
            if which_file {
                file = File::create(format!("/usr/local/pctrl/pctrl_{}.plog", pid)).unwrap(); 
                which_file = false; 
                //Ok(())
            }
            else {
                file = File::create(format!("/usr/local/pctrl/pctrl_{}.plog1", pid)).unwrap();
                which_file = true;
                //Ok(())
            }

            counter = 0;
        }
    }
}

fn read_record(pid: u32) {

}