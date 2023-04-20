#![feature(linked_list_cursors)]
use std::vec::Vec;

//cmd args
use clap::{Command, ArgAction};

//local imports
pub mod ourMods;
use crate::ourMods::structures::*;
use crate::ourMods::tui::*;
use crate::ourMods::proc_functions::*;


// main function
fn main() {
    let matches = Command::new("lpm")
        .version("0.1.0")
        .arg(
            clap::Arg::new("columns")
                .short('c')
                .long("columns")
                .value_delimiter(',')
                .value_name("COLUMN_LIST")
                .help("Comma-separated list of columns to display, in the order they should appear")
                .default_value("PID,PPID,PRI,CPU,MEM,STATE,STARTTIME,FD,OWNER,CMD")
                .value_parser(["PID", "PPID", "PRI", "CPU", "MEM", "STATE", "STARTTIME", "FD", "OWNER", "CMD"])
                .action(ArgAction::Append),
        )
        // .arg(
        //     clap::Arg::new("record")
        //     .long("record")
        //     //.takes_value(true)
        //     .value_parser(clap::value_parser!(u32))
        //     .value_delimiter(',')
        //     .value_name("rec_pids")
        //     .help("Comma-separated list of PIDs to record.")
        //     .action(ArgAction::Append),
        // )
        .subcommand(
            Command::new("record")
            .about("Record information about certain processes in a file")
            .arg(
                clap::Arg::new("record_pids")
                .short('p')
                .long("pids")
                .value_name("PIDS_TO_RECORD")
                .help("Comma-separated list of PIDs to record")
                .value_delimiter(',')
                .value_parser(clap::value_parser!(u32))
                .required(true)
                .action(ArgAction::Append)
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
            unsafe{ // for testing
                    record_prc(&mut _PROCESSES, &mut _PID_TABLE, recording_procs[0], recording_procs, &mut _CONFIG);
                    record_mode = true;
            }
        },
        _ => unsafe{_FILTERS.clear()},
    }

    // // let filter_columns: Vec<String> = matches.subcommand_matches("filter").unwrap_or(Vec::new()).get_many::<String>("target_column").unwrap().map(|s| s.to_string()).collect();
    // let filter_columns: Vec<String> = matches.subcommand_matches("filter")
    //     .and_then(|subcommand| subcommand.get_many::<String>("target_column"))
    //     .map(|columns| columns.map(|s| s.to_string()).collect())
    //     .unwrap_or(vec![]);
    // let filter_types: Vec<String> = matches.subcommand_matches("filter")
    //     .and_then(|subcommand| subcommand.get_many::<String>("filter_type"))
    //     .map(|columns| columns.map(|s| s.to_string()).collect())
    //     .unwrap_or(vec![]);
    // let filter_values: Vec<String> = matches.subcommand_matches("filter")
    //     .and_then(|subcommand| subcommand.get_many::<String>("filter_value"))
    //     .map(|columns| columns.map(|s| s.to_string()).collect())
    //     .unwrap_or(vec![]);
    
    // if filter_columns.len() != filter_types.len() || filter_columns.len() != filter_values.len() || filter_types.len() != filter_values.len() {
    //     println!("Error: Number of columns to filter on, number of filter types and number of filter values are not equal");
    //     std::process::exit(1);
    // }
    // unsafe{
    //     _FILTERS.clear();
    //     for i in 0..filter_columns.len() {
    //         _FILTERS.push(
    //             FilterItem{
    //                 column: filter_columns[i].clone(), 
    //                 value: filter_values[i].clone(),
    //                 filter_type: filter_types[i].clone(),
    //             }
    //         );
    //     }
    // }

    // if record argument is made {
    // }
    if !record_mode {
        display_tui(columns_to_display);
        unsafe
        {
            filter_process(&mut _PROCESSES);
        }
    }
    
}
 
