#![feature(linked_list_cursors)]
use std::collections::LinkedList;
use std::vec::Vec;

trait ProccessFn { // process functions here
    fn getCPU(&self);
    fn getRAM(&self);
    fn getDISK(&self);
    fn getNET(&self);
    fn getSWAP(&self);
}
struct Process {
    PID: u32,
    Parent_PID: u32,
    Children: Vec<u32>,
    Name: String,
    Owner: String,
    Priority: u8,
    State: char,
    OpenFileDesc: Vec<String>,
    RunDuration: u32,
    Dir: String,
    RecordIndex: u32, // index of its record data in the P_Data vector
    
    //Data Record
    CPU_hist: LinkedList<u8>,
    RAM_hist: LinkedList<u8>,
    DISK_hist: LinkedList<u8>, // change type according to units
    NET_hist: LinkedList<u8>, // change type according to units

    //Other Data (not recorded)
    SWAP_Usage: u32;
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
fn Log_Data<T>(list: &mut LinkedList<T>, val:T) { // all stat data entry should be through this function 
    list.push_front(val);
    list.cursor_back_mut().remove_current();
}
fn main() {
    // main structures
    let mut processes : Vec<Process> = Vec::new();
    //let mut P_Data : Vec<ProcessRecord> = Vec::new(); // process record data
    
    // arrays of indices sorted per each stat
    let mut MemSort : Vec<u32> = Vec:new(); // contains the indices of processes relative to the processes vector, sorted in their respective order
    let mut CPUSort : Vec<u32> = Vec:new();
    let mut DiskSort : Vec<u32> = Vec:new();
    let mut NETSort : Vec<u32> = Vec:new();
    let mut PrioritySort : Vec<u32> = Vec:new();
    let mut PrioritySort : Vec<u32> = Vec:new();

    let mut timeStep : u16; // milliseconds between each data refresh

    println!("Hello, world!");
}
