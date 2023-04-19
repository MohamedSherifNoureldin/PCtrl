use std::collections::LinkedList;
use std::vec::Vec;
use std::path::PathBuf;
use chrono::{DateTime, Local};
use procfs::process::ProcState;


macro_rules! pub_struct {
    ($name:ident {$($field:ident: $t:ty,)*}) => {
        #[derive(Debug, Clone, Default, PartialEq)] // ewww
        pub struct $name {
            $(pub $field: $t),*
        }
    }
}

// structure for holding a single process data
//#[derive(Default, Clone, Debug, PartialEq)]
pub_struct! (Process {
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
});

// setting the default state of the process to running
#[derive(Clone, Debug, PartialEq)]
pub struct PState {
    pub procstate: ProcState,
}
impl Default for PState {
    fn default() -> Self {
        Self {
            procstate: ProcState::Running
        }
    }
}

// structure for holding system wide data
//#[derive(Default)]
pub_struct! (SysStats {
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
});

// structure for holding the user's configuration data
#[derive(Copy, Clone)]
pub struct Config {
    pub record_length : u32,
    pub update_every : u32,
    pub max_rec_limit : u32,
}
impl Config {
    pub fn start() -> Config {
        // reaf config file and assign to config
        Config {
            record_length: 10,
            update_every : 1,
            max_rec_limit : 60000,
        }
    }
}

// TUI table columns enum along with their string representation
#[derive(Copy, Clone, PartialEq, Eq, Hash)]
pub enum BasicColumn {
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

pub_struct! (FilterItem {
    column: String,
    value: String,
    filter_type: String,
});

