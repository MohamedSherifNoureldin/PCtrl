use crate::our_mods::proc_functions::*;
use crate::our_mods::structures::*;
use crate::our_mods::tui::*;
use once_cell::sync::Lazy;

#[tauri::command]
fn get_processes() -> Vec<Process> {
   let processes_to_display: Vec<Process>;
   unsafe {
      update_procs(&mut _PID_TABLE, &mut _PROCESSES, &mut _SYS_STATS, *_CONFIG);
      processes_to_display = filter_process(&mut _PROCESSES);   
   }
   processes_to_display
}

#[tauri::command]
fn kill_process(pid: u32) -> bool {
   let success = crate::our_mods::proc_functions::kill_process(pid);
   success
}

#[tauri::command]
fn pause_process(pid: u32) -> bool {
   let success = crate::our_mods::proc_functions::pause_process(pid);
   success
}

#[tauri::command]
fn resume_process(pid: u32) -> bool {
   let success = crate::our_mods::proc_functions::resume_process(pid);
   success
}

#[tauri::command]
fn get_system_info() -> SysStats {
   let system_info;
   unsafe{
      system_info = _SYS_STATS.clone();
   }
   system_info
}

pub fn display_gui() {
    tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![get_processes, kill_process, pause_process, resume_process, get_system_info])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
  