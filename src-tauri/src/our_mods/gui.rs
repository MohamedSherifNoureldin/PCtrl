use crate::our_mods::proc_functions::*;
use crate::our_mods::structures::*;
use crate::our_mods::tui::*;

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
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

pub fn display_gui() {
    tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![greet, get_processes])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
  