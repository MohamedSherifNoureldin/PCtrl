use std::collections::LinkedList;
use std::vec::Vec;
use std::collections::HashMap;
use std::path::PathBuf;
use chrono::{DateTime, Local};
use procfs::process::ProcState;

use cursive_table_view::{TableViewItem };
use std::cmp::Ordering;
use once_cell::sync::Lazy;




// main structures
pub static mut _PROCESSES : Lazy<Vec<Process>> = Lazy::new(|| Vec::new()); 
pub static mut _PID_TABLE : Lazy<HashMap<u32, u16>> = Lazy::new(|| HashMap::new());
pub static mut _SYS_STATS : Lazy<SysStats> = Lazy::new(|| SysStats::default());
pub static mut _CONFIG : Lazy<Config> = Lazy::new(|| Config::start());
pub static mut _FILTERS : Lazy<Vec<FilterItem>> = Lazy::new(|| Vec::new());
pub static mut PAUSE_REC:bool = false;


macro_rules! pub_struct {
    ($name:ident {$($field:ident: $t:ty,)*}) => {
        #[derive(Debug, Clone, Default, PartialEq)] // ewww
        pub struct $name {
            $(pub $field: $t),*
        }
    }
}

// STRUCTS
//#[derive(Default, Clone, Debug, PartialEq)]
pub_struct! (Process {
    index: u32,
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
    pub current_column : BasicColumn,
}
impl Config {
    pub fn start() -> Config {
        // reaf config file and assign to config
        Config {
            record_length: 10,
            update_every : 1,
            max_rec_limit : 60000,
            current_column : BasicColumn::CMD,
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
    Index,
}

pub_struct! (FilterItem {
    column: String,
    value: String,
    filter_type: String,
});


//CURSIVE
impl BasicColumn {
    pub fn as_str(&self) -> &str {
        match *self {
            BasicColumn::PID => "PID",
            BasicColumn::PPID => "PPID",
            BasicColumn::CMD => "CMD/Name",
            BasicColumn::PRIORITY => "PRIORITY",
            BasicColumn::CPU => "CPU %",
            BasicColumn::MEM => "MEM %",
            BasicColumn::STATE => "STATE",
            BasicColumn::STARTTIME => "StartTime",
            BasicColumn::OWNER => "OWNER",
            BasicColumn::FD => "FDs",
            BasicColumn::Index => "index",
        }
    }
    pub fn from_str(input: &str) -> BasicColumn {
        match input {
            "PID" => BasicColumn::PID,
            "PPID" => BasicColumn::PPID,
            "CMD/Name" => BasicColumn::CMD,
            "PRIORITY" => BasicColumn::PRIORITY,
            "CPU %" => BasicColumn::CPU,
            "MEM %" => BasicColumn::MEM,
            "STATE" => BasicColumn::STATE,
            "StartTime" => BasicColumn::STARTTIME,
            "OWNER"=> BasicColumn::OWNER,
            "FDs" => BasicColumn::FD,
            "index" => BasicColumn::Index,
            &_ => todo!(),
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
            BasicColumn::CPU => format!("{:.2}", self.cpu_hist.front().unwrap_or(&0.0) * 100 as f32),
            BasicColumn::MEM => 
                if self._mem_total == 0 {
                    format!("0.00")
                } else {
                    format!("{:.2}", ((self.ram_hist.front().unwrap_or(&0) * 100) as f32/self._mem_total as f32))
                    //format!("{}", (self.net_hist.front().unwrap() ))
                },
            // BasicColumn::MEM => format!("{:.4}", self.ram_hist.front().unwrap()),
            BasicColumn::STATE => format!("{:?}", self.state.procstate),
            BasicColumn::STARTTIME => format!("{}", self.start_time.format("%H:%M %d/%m")),
            BasicColumn::OWNER => self.owner.to_string(),
            BasicColumn::FD => format!("{}", self.open_fds),
            BasicColumn::Index => self.index.to_string(),
        }
    }

    fn cmp(&self, other: &Self, column: BasicColumn) -> Ordering where Self: Sized {
        match column {
            BasicColumn::PID => self.pid.cmp(&other.pid),
            BasicColumn::PPID => self.parent_pid.cmp(&other.parent_pid),
            BasicColumn::CMD => self.index.cmp(&other.index),
            BasicColumn::PRIORITY => self.priority.cmp(&other.priority),
            BasicColumn::CPU => self.cpu_hist.front().unwrap_or(&0.0).partial_cmp(&other.cpu_hist.front().unwrap_or(&0.0)).unwrap_or(Ordering::Equal),
            BasicColumn::MEM => self.ram_hist.front().unwrap_or(&0).cmp(&other.ram_hist.front().unwrap_or(&0)),
            BasicColumn::STATE => format!("{:?}", self.state.procstate).cmp(&format!("{:?}", &other.state.procstate)),
            BasicColumn::STARTTIME => self.start_time.cmp(&other.start_time),
            BasicColumn::OWNER => self.owner.cmp(&other.owner),
            BasicColumn::FD => self.open_fds.cmp(&other.open_fds),
            BasicColumn::Index => self.index.cmp(&self.index.clone()),
        }
    }
}
