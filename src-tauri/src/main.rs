#![feature(linked_list_cursors)]
use std::vec::Vec;

//cmd args
use clap::{Command, ArgAction};
use once_cell::sync::Lazy;

//local imports
pub mod our_mods;
use crate::our_mods::structures::*;
use crate::our_mods::tui::*;
use crate::our_mods::proc_functions::*;
use crate::our_mods::gui::*;

use std::io::prelude::*;
use std::fs::File;
extern crate dirs;
use std::thread;


// main function
fn main() {
    unsafe{ _CONFIG = Lazy::new(|| read_config()); }; // read config file
    
    let matches = Command::new("lpm")
        .version("0.1.0")
        .arg(
            clap::Arg::new("columns")
                .short('c')
                .long("columns")
                .value_delimiter(',')
                .value_name("COLUMN_LIST")
                .help("Comma-separated list of columns to display, in the order they should appear")
                .default_value("PID,PPID,CMD,PRI,CPU,MEM,OWNER,STATE,STARTTIME,FD")
                .value_parser(["PID", "PPID", "CMD", "PRI", "CPU", "MEM", "OWNER","STATE", "STARTTIME", "FD"])
                .action(ArgAction::Append),
        )
        .subcommand(
            Command::new("record")
            .about("Record information about certain processes in a file")
            .arg(
                clap::Arg::new("record_pids")
                .value_name("PIDS_TO_RECORD")
                .help("PID to record")
                .value_parser(clap::value_parser!(u32))
                .required(true)
            )
            // .arg(
            //     clap::Arg::new("output_file")
            //     .short('o')
            //     .long("output_file")
            //     .value_name("FILE_TO_RECORD_IN")
            //     .help("File to record in")
            //     .required(true)
            // )
        )
        .subcommand(
            Command::new("keepalive")
            .about("Monitor and revive a process whener it crashes.")
            .arg(
                clap::Arg::new("keepalive_pid")
                .value_name("PID_TO_TRACK")
                .help("PID to track")
                .value_parser(clap::value_parser!(u32))
                .required(true)
            )
        )
        .subcommand(
            Command::new("filter")
            .about("Filter the processes to be displayed")
            .arg(
                clap::Arg::new("target_column")
                .short('c')
                .long("columns")
                .value_name("COLUMNS_TO_FILTER_ON")
                .help("Comma-separated list of columns to be filtered on")
                .value_delimiter(',')
                .value_parser(["PID", "PPID", "PRI", "CPU", "MEM", "STATE", "STARTTIME", "FD", "OWNER", "CMD"])
                .required(true)
            )
            .arg(
                clap::Arg::new("filter_type")
                .short('t')
                .long("type")
                .value_name("TYPE OF FILTER")
                .help("Comma-separated list of type of filter to be applied on respective column")
                .value_parser(["eq", "neq", "greater", "less"])
                .default_value("eq")
                .required(true)
            )
            .arg(
                clap::Arg::new("filter_value")
                .short('v')
                .long("value")
                .value_name("VALUE TO FILTER ON")
                .help("Comma-separated list of values to be filtered on respective column with respective filter type")
                .value_delimiter(',')
                .required(true)
            )
        )
        .subcommand(
            Command::new("search")
            .about("Search for a certian process using NAME or PID")
            .arg(
                clap::Arg::new("search_column")
                .short('c')
                .long("column")
                .value_name("COLUMN_TO_SEARCH_ON")
                .help("Column to be searched on")
                .value_parser(["PID", "CMD"])
                .default_value("PID")
                .required(true)
            )
            .arg(
                clap::Arg::new("search_value")
                .short('v')
                .long("value")
                .value_name("SEARCH_VALUE")
                .help("Search value to be used to search for a process")
                .required(true)
            )
        )
        .subcommand(
            Command::new("gui")
            .about("Launch the GUI version of the application with the TUI")
        )
        .subcommand(
            Command::new("gui_only")
            .about("Start the application as a GUI")
        )
        
        .get_matches();
    
    let columns_to_display: Vec<String> = matches.get_many::<String>("columns").unwrap().map(|s| s.trim().to_string().to_uppercase()).collect();
    let mut record_mode = false;
    // parse commands arguments
    match matches.subcommand() {
        Some(("filter", sub_matches)) => {
            let filter_columns: Vec<String> = sub_matches.get_many::<String>("target_column").unwrap().map(|s| s.trim().to_string().to_uppercase()).collect();
            let filter_types: Vec<String> = sub_matches.get_many::<String>("filter_type").unwrap().map(|s| s.trim().to_string()).collect();
            let filter_values: Vec<String> = sub_matches.get_many::<String>("filter_value").unwrap().map(|s| s.trim().to_string().to_uppercase()).collect();
            if filter_columns.len() != filter_types.len() || filter_columns.len() != filter_values.len() || filter_types.len() != filter_values.len() {
                println!("Error: Number of columns to filter on, number of filter types and number of filter values are not equal");
                std::process::exit(1);
            }
            unsafe{
                _FILTERS.clear();
                for i in 0..filter_columns.len() {
                    _FILTERS.push(
                        FilterItem{
                            column: filter_columns[i].clone(), 
                            value: filter_values[i].clone(),
                            filter_type: filter_types[i].clone(),
                        }
                    );
                }
            }
        },
        Some(("search", sub_matches)) => {
            let search_column: String = sub_matches.get_one::<String>("search_column").unwrap().trim().to_string().to_uppercase();
            let search_term: String = sub_matches.get_one::<String>("search_value").unwrap().trim().to_string().to_uppercase();
            unsafe{
                _FILTERS.clear();
                _FILTERS.push(
                    FilterItem{
                        column: search_column.clone(), 
                        value: search_term.clone(),
                        filter_type: "eq".to_string(),
                    }
                );
            }
        },
        Some(("record", sub_matches)) => {
            let recording_procs: Vec<u32> = sub_matches.get_many::<u32>("record_pids").unwrap().cloned().collect();
            unsafe{ 
                    record_prc(&mut _PROCESSES, &mut _PID_TABLE, recording_procs[0], recording_procs, &mut _CONFIG);
                    record_mode = true;
            }
        },
        Some(("keepalive", sub_matches)) => {
            let keepalive_pid: u32 = sub_matches.get_one::<u32>("keepalive_pid").unwrap().clone();
            keep_alive(keepalive_pid);
            record_mode = true;
        },
        // Some(("setnice", sub_matches)) => {
        //     let setpriority_pid: u32 = sub_matches.get_one::<u32>("setpriority_pid").unwrap().clone();
        //     let setpriority_val: i32 = sub_matches.get_one::<i32>("setpriority_val").unwrap().clone();
        //     if change_priority(setpriority_pid, setpriority_val) { // changes nice value
        //         println!("Nice value for PID:{} updated successfully.", setpriority_pid);
        //     }
        //     else {
        //         println!("Couldn't set nice value for PID:{} to {}", setpriority_pid, setpriority_val);
        //         println!("Tip: use sudo when setting a higher priority (lower nice value).");
        //     }
        //     record_mode = true;
        // },
        Some(("gui", _)) => {
            let col_to_disp = columns_to_display.clone();
            //run tui as thread (closes when GUI is closed)
            let mut tui = thread::spawn(move || {
                display_tui(col_to_disp);
            });
            unsafe{TUI_Running = true;}
            display_gui();
            // wait for tui to end if display_gui fails
            tui.join().unwrap(); 
            
        //     // run gui as child proc, running sma eprogram twice, not as efficient.
        //     let mut child =
        //     process::Command::new("./lpm gui_only")
        //     //.stdout(process::Stdio::piped())
        //     //.stderr(process::Stdio::piped())
        //     .spawn()
        //     .expect("Couldn't run program");
        },
        Some(("gui_only", _)) => {
            display_gui();
            record_mode = true;
        },
        _ => unsafe{_FILTERS.clear()},
    }

    if !record_mode {
        display_tui(columns_to_display);
    }
    
}
 
fn read_config() -> Config {
    let home = dirs::home_dir().unwrap().into_os_string().into_string().unwrap();
    let file_name = format!("{}/.local/share/pctrl/pctrl.conf", home); 
    //let file_name = String::from("pctrl.conf"); 
    let f = File::open(file_name);
    let mut config :Config = Config::start();
    let mut _f = match f {
        Ok(mut file) =>  {
            let mut data = String::new();
            file.read_to_string(&mut data);
            let contents = data.split('\n').collect::<Vec<&str>>();

            if contents.len() >= 4 {
                config.record_length = contents[0].parse::<u32>().unwrap();
                config.update_every = contents[1].parse::<u32>().unwrap();
                config.max_rec_limit = contents[2].parse::<u32>().unwrap();
                config.current_column = BasicColumn::from_str(contents[3]);
                // println!("read: {}", config.record_length);
                // println!("read: {}", config.update_every);
                // println!("read: {}", config.max_rec_limit);
                // println!("read: {}", config.current_column.as_str());
                if contents.len() > 4 {
                    for i in 4..contents.len() {
                        let parts = contents[i].split('|').collect::<Vec<&str>>();
                        if parts.len() < 3 {break}
                        let col = parts[0];
                        let val = parts[1];
                        let ftype = parts[2];
                        // println!("read: {} . {} . {}", col, val, ftype);
                        unsafe{
                            _FILTERS.push(FilterItem {
                                column: col.to_string(),
                                value: val.to_string(),
                                filter_type: ftype.to_string(),
                            });
                        }
                    }
                }
            }
        },
        Err(e) => {}
    };

    config
}
