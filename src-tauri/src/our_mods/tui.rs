//mod structures;

use std::vec::Vec;
use std::collections::HashMap;

use chrono::{DateTime};
use std::num::NonZeroU32;
use std::cmp;

// cursive TUI imports
use cursive::Cursive;
use cursive::theme::{Color, PaletteColor, Theme, BorderStyle};
use cursive::views::{Dialog, TextView, LinearLayout, EditView, DummyView, SelectView};
use cursive_table_view::{TableView};

use cursive::CursiveExt;
use cursive::align::HAlign;
use cursive::traits::*;
use std::cmp::Ordering;
extern crate cursive_table_view;

use super::structures::*;
use super::proc_functions::*;


static mut SHOW_TREE: bool = false;
static mut TREE_OPEN: bool = false;

// function to update the table view in the TUI
fn update_views(siv: &mut Cursive, procs: &mut Vec<Process>, pid_table: &mut HashMap<u32, u16>, sys_stats: &mut SysStats, config: Config, counter: u32) {
    if counter % 1 == 0
    {
        update_procs(pid_table, procs, sys_stats, config);
        let mut processes_to_display: Vec<Process> = Vec::new();
        processes_to_display = filter_process(procs);
        siv.call_on_name("cpu_name", |view: &mut TextView| {
            view.set_content(format!("CPU Name: {}", sys_stats.cpu_name));
        });
        siv.call_on_name("cpu_freq", |view: &mut TextView| {
            view.set_content(format!("CPU Frequency: {}MHz", sys_stats.cpu_freq));
        });
        siv.call_on_name("cpu_temp", |view: &mut TextView| {
            view.set_content(format!("CPU Temperature: {} \u{00b0}\u{0043}", sys_stats.cpu_temp));
        });
        siv.call_on_name("cpu_cores_num", |view: &mut TextView| {
            view.set_content(format!("Number of cores: {}", sys_stats.cpu_cores_num));
        });
        siv.call_on_name("uptime", |view: &mut TextView| {
            view.set_content(format!("System Uptime: {}s", sys_stats.uptime));
        });
        siv.call_on_name("mem_total", |view: &mut TextView| {
            view.set_content(format!("Memory: {}/{}MB", sys_stats.ram_hist.front().unwrap_or(&0), sys_stats.mem_total));
        });
        siv.call_on_name("swap_usage", |view: &mut TextView| {
            view.set_content(format!("Swap Usage: {} MB", sys_stats.swap_hist.front().unwrap_or(&0)));
        });
        siv.call_on_name("user_proc_count", |view: &mut TextView| {
            view.set_content(format!("Number of processes: {}", sys_stats.user_proc_count));
        });
        siv.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
            let selected_row = view.row().unwrap_or(0) as usize;
            view.set_items_stable(processes_to_display);
            view.set_selected_row(selected_row);
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

// function to display the TUI
pub fn display_tui(columns_to_display: Vec<String>) {
    let mut counter: u32 = 0;
    let mut processes_to_display: Vec<Process> = Vec::new();
    unsafe{
        update_procs(&mut _PID_TABLE, &mut _PROCESSES, &mut _SYS_STATS, *_CONFIG);
        processes_to_display = filter_process(&mut _PROCESSES);
    }

    let mut siv = Cursive::default();
    //unsafe { SHOW_TREE = true; }
    let theme = custom_theme_from_cursive(&siv);
    siv.set_theme(theme);

    // We can quit by pressing `q`
    siv.add_global_callback('q', |s| {
        unsafe{*TUI_RUNNING.get_mut() = false;}
        s.quit();
    });
    
    // pause real time update by pressing space
    siv.add_global_callback(' ', |s| {
        if s.fps() == NonZeroU32::new(0) {
            s.set_fps(unsafe{_CONFIG.update_every});
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

    let mut table = TableView::<Process, BasicColumn>::new();

    for col_name in columns_to_display {
            match col_name.as_str() {
                "PID" => table = table.column(BasicColumn::PID, "PID", |c| {
                    c.ordering(Ordering::Greater)
                    .align(HAlign::Right)
                    .width(6)
                }),
                "PPID" => table = table.column(BasicColumn::PPID, "PPID", |c| c.align(HAlign::Right).width(8)),
                "PRI" => table = table.column(BasicColumn::PRIORITY, "PRI", |c| c.align(HAlign::Right).width(6)),
                "CPU" => table = table.column(BasicColumn::CPU, "CPU %", |c| c.align(HAlign::Right).width(8).ordering(Ordering::Greater)),
                "MEM" => table = table.column(BasicColumn::MEM, "MEM %", |c| c.align(HAlign::Right).width(8).ordering(Ordering::Greater)),
                "STATE" => table = table.column(BasicColumn::STATE, "STATE", |c| c.align(HAlign::Left).width(8).ordering(Ordering::Greater)),
                "STARTTIME" => table = table.column(BasicColumn::STARTTIME, "STARTED", |c| c.align(HAlign::Left).width_percent(12)),
                "FD" => table = table.column(BasicColumn::FD, "FD", |c| c.align(HAlign::Left).width(7).ordering(Ordering::Greater)),
                "OWNER" => table = table.column(BasicColumn::OWNER, "OWNER", |c| c.align(HAlign::Left).width_percent(9)),
                "CMD" => table = table.column(BasicColumn::CMD, "CMD", |c| c.align(HAlign::Left)),
                _ => { println!("Invalid column name: {}", col_name); }
            }
        }

    table.set_items(processes_to_display);
    table.set_default_column(unsafe{_CONFIG.current_column.clone()});
    table.set_on_sort( move |siv: &mut Cursive, column: BasicColumn, _order: Ordering| {  
        unsafe {
            update_views(siv, &mut _PROCESSES, &mut _PID_TABLE, &mut _SYS_STATS, *_CONFIG,counter);
            _CONFIG.current_column = column;
        }
    });

    siv.add_layer(
        LinearLayout::vertical()
            .child( unsafe{
                Dialog::around(LinearLayout::vertical()
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("CPU Name: {}", _SYS_STATS.cpu_name)).h_align(HAlign::Left).with_name("cpu_name").full_width())
                        .child(TextView::new(format!("CPU Frequency: {}MHz", _SYS_STATS.cpu_freq)).h_align(HAlign::Left).with_name("cpu_freq").full_width())
                    )
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("CPU Temperature: {} \u{00b0}\u{0043}", _SYS_STATS.cpu_temp)).h_align(HAlign::Left).with_name("cpu_temp").full_width())
                        .child(TextView::new(format!("Number of cores: {}", _SYS_STATS.cpu_cores_num)).h_align(HAlign::Left).with_name("cpu_cores_num").full_width())
                    )
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("System Uptime: {}s", _SYS_STATS.uptime)).h_align(HAlign::Left).with_name("uptime").full_width())
                        .child(TextView::new(format!("Memory: {}/{} MB",_SYS_STATS.ram_hist.front().unwrap(), _SYS_STATS.mem_total)).h_align(HAlign::Left).with_name("mem_total").full_width())
                    )
                    .child(LinearLayout::horizontal()
                        .child(TextView::new(format!("Swap Usage: {} MB", _SYS_STATS.swap_hist.front().unwrap())).h_align(HAlign::Left).with_name("swap_usage").full_width())
                        .child(TextView::new(format!("Number of processes: {}", _SYS_STATS.user_proc_count)).h_align(HAlign::Left).with_name("user_proc_count").full_width())
                    )
                )
                .title("System Information") }
            )
            .child(Dialog::around(table.with_name("table").full_screen()).title("Processes"))
            .child(Dialog::around(LinearLayout::horizontal()
            .child(TextView::new("Exit <q> - Pause/Unpause realtime <space> - Process Tree <t> - Kill <k> - Kill with Children <w> - Suspend/Resume <p>/<r> - Change Nice <n> - Filter <s> - Clear filters <c> - Save config <ctrl+s>").h_align(HAlign::Center))
            
        ).title("Controls"))
        .child(TextView::new("Status: Updating in realtime...").h_align(HAlign::Right).with_name("status").full_width())
    );

    // add a callback to kill process when user presses 'k' while selecting a row
    siv.add_global_callback('k',   |s| {
        let mut pid = 0;
        s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
            let selected_row = view.item().unwrap() as usize;
            let selected_item = view.borrow_item(selected_row).unwrap().clone();
            pid = selected_item.pid;
        });
        let success = kill_process(pid);
        if success {
            s.add_layer(
                Dialog::around(TextView::new(format!("Successfully killed process {}", pid)))
                    .title("Success")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        } else {
            s.add_layer(
                Dialog::around(TextView::new(format!("Failed to kill process {}", pid)))
                    .title("Error")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        }
    });

    siv.add_global_callback('t',   |s| {
        if unsafe {TREE_OPEN} {
            let mut pid = 1;
            let tree_procs = unsafe{filter_process(&mut _PROCESSES)};
            s.call_on_name("treetable", |view: &mut TableView<Process, BasicColumn>| {
                let selected_row = view.item().unwrap_or(0) as usize;
                let selected_item = view.borrow_item(selected_row).unwrap().clone();
                pid = selected_item.pid;
            });
            let mut i = 0;
            let mut selindex = 0;
            
            for p in tree_procs.clone() {
                if p.pid == pid {
                    selindex = i;
                    break;
                }
                i+=1;
            }
            s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
                if i < unsafe{_PROCESSES.len()} {
                    view.set_selected_item(selindex);
                }
            });
            s.pop_layer();
            unsafe {
                TREE_OPEN = false;
                SHOW_TREE = false;
            }
        }
        else {
            unsafe{
                TREE_OPEN = true;
                SHOW_TREE = true;
            }
            let mut pid = 0;
            let tree_procs = unsafe{filter_process(&mut _PROCESSES)};
            s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
                let selected_row = view.item().unwrap_or(0) as usize;
                let selected_item = view.borrow_item(selected_row).unwrap().clone();
                pid = selected_item.pid;
            });
            let mut tree: TableView<Process, BasicColumn> = TableView::<Process, BasicColumn>::new();
            
            let mut selindex = 0;
            let mut i = 0;
            for p in tree_procs.clone() {
                if p.pid == pid {
                    selindex = i;
                    break;
                }
                i+=1;
            }
            tree.set_items(tree_procs);
            tree = tree.column(BasicColumn::PID, "PID", |c| {
                c.ordering(Ordering::Greater)
                .align(HAlign::Right)
                .width(7)
            });
            tree = tree.column(BasicColumn::CMD, "Tree", |c| c.ordering(Ordering::Less).align(HAlign::Left));
            
            tree.set_default_column(BasicColumn::CMD);
            tree.set_selected_item(selindex);
            
            //tree.disable();
            s.add_layer(
                Dialog::around( tree.with_name("treetable").full_screen() )
                    .title("Process Tree")
                    .button("Close", |s| {
                        let mut pid = 1;
                        let tree_procs = unsafe{filter_process(&mut _PROCESSES)};
                        s.call_on_name("treetable", |view: &mut TableView<Process, BasicColumn>| {
                            let selected_row = view.item().unwrap_or(0) as usize;
                            let selected_item = view.borrow_item(selected_row).unwrap().clone();
                            pid = selected_item.pid;
                        });
                        let mut i = 0;
                        let mut selindex = 0;
                        
                        for p in tree_procs.clone() {
                            if p.pid == pid {
                                selindex = i;
                                break;
                            }
                            i+=1;
                        }
                        s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
                            if i < unsafe{_PROCESSES.len()} {
                                view.set_selected_item(selindex);
                            }
                        });
                        s.pop_layer();
                        unsafe {
                            TREE_OPEN = false;
                            SHOW_TREE = false;
                        }
                    }),
            );
        }
        
    });

    // add a callback to pause process when user presses 'p' while selecting a row
    siv.add_global_callback('p',   |s| {
        let mut pid = 0;
        s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
            let selected_row: usize = view.item().unwrap_or(0) as usize;
            let selected_item = view.borrow_item(selected_row).unwrap().clone();
            pid = selected_item.pid;
        });
        let success = pause_process(pid);
        if success {
            s.add_layer(
                Dialog::around(TextView::new(format!("Successfully paused process {}", pid)))
                    .title("Success")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        } else {
            s.add_layer(
                Dialog::around(TextView::new(format!("Failed to pause process {}", pid)))
                    .title("Error")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        }
    });

    // add a callback to resume process when user presses 'r' while selecting a row
    siv.add_global_callback('r',   |s| {
        let mut pid = 0;
        s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
            let selected_row: usize = view.item().unwrap() as usize;
            let selected_item = view.borrow_item(selected_row).unwrap().clone();
            pid = selected_item.pid;
        });
        let success = resume_process(pid);
        if success {
            s.add_layer(
                Dialog::around(TextView::new(format!("Successfully resumed process {}", pid)))
                    .title("Success")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        } else {
            s.add_layer(
                Dialog::around(TextView::new(format!("Failed to resume process {}", pid)))
                    .title("Error")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        }
    });

    // add a callback to change process priority when user presses 'c' while selecting a row
    siv.add_global_callback('n', |s| {
        s.add_layer(
            Dialog::around(
                LinearLayout::vertical()
                    .child(TextView::new("Select new nice value:"))
                    .child(SelectView::new()
                        .item_str("-20").item_str("-19").item_str("-18").item_str("-17").item_str("-16").item_str("-15")
                        .item_str("-14").item_str("-13").item_str("-12").item_str("-11").item_str("-10").item_str("-9")
                        .item_str("-8").item_str("-7").item_str("-6").item_str("-5").item_str("-4").item_str("-3")
                        .item_str("-2").item_str("-1").item_str("0").item_str("1").item_str("2").item_str("3").item_str("4")
                        .item_str("5").item_str("6").item_str("7").item_str("8").item_str("9").item_str("10").item_str("11")
                        .item_str("12").item_str("13").item_str("14").item_str("15").item_str("16").item_str("17").item_str("18")
                        .item_str("19")
                        .popup().with_name("column_input").full_width()
                    )
                    .child(TextView::new("Please note that the lower the nice value, the higher the priority. The actual priority is calculated as 20 + nice value. If you are not running this application as elevated, then you can only decrease the priority of the process."))
            )
            .button("Update Nice Value", |s| {
                let mut pid = 0;
                let mut column = 0;
                s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
                    let selected_row: usize = view.item().unwrap() as usize;
                    let selected_item = view.borrow_item(selected_row).unwrap().clone();
                    pid = selected_item.pid;
                });
                s.call_on_name("column_input", |view: &mut SelectView| {
                    column = view.selection().unwrap().parse().unwrap();
                });
                let success = change_priority(pid, column);
                if success {
                    s.add_layer(
                        Dialog::around(TextView::new(format!("Successfully changed nice value of process with PID: {}", pid)))
                            .title("Success")
                            .button("Close", |s| {
                                s.pop_layer();
                                s.pop_layer();
                            }),
                    );
                } else {
                    s.add_layer(
                        Dialog::around(TextView::new(format!("Failed to change nice value of process with PID: {}", pid)))
                            .title("Error")
                            .button("Close", |s: &mut Cursive| {
                                s.pop_layer();
                            }),
                    );
                }
            })
            .button("Close", |s| {
                s.pop_layer();
            })
            .title("Change Nice Value")
        );
    });

    siv.add_global_callback(cursive::event::Event::Refresh, move |s| {
        unsafe{
            update_views(s, &mut _PROCESSES, &mut _PID_TABLE, &mut _SYS_STATS, *_CONFIG,counter);
        }
        counter += 1;
    });
    siv.set_autorefresh(true);
    siv.set_fps(unsafe{_CONFIG.update_every});

    siv.add_global_callback(cursive::event::Event::CtrlChar('f'), |siv|{
        siv.add_layer(
            Dialog::around(
                LinearLayout::vertical()
                    .child(
                        LinearLayout::horizontal()
                            .child(TextView::new("Search Column: ").h_align(HAlign::Left).with_name("search_column").full_width())
                            .child(DummyView)
                            .child(DummyView)
                            .child(TextView::new("Search Value: ").h_align(HAlign::Left).with_name("search_term").full_width())
                    )
                    .child(
                        LinearLayout::horizontal()
                            .child(SelectView::new().item_str("PID").item_str("CMD").popup().with_name("column_input").full_width())
                            .child(DummyView)
                            .child(DummyView)
                            .child(EditView::new().with_name("search_term_input").full_width())
                    )
            )
            .title("Search for a process")
            .button("Ok", |s: &mut Cursive| {
                let search_term = s.call_on_name("search_term_input", |view: &mut EditView| {
                    view.get_content()
                }).unwrap();
                let search_column = s.call_on_name("column_input", |view: &mut SelectView| {
                    view.add_item_str("Found");
                    view.selected_id().unwrap()
                }).unwrap();
                let mut search_column_str = "";
                if search_column == 0 {
                    search_column_str = "PID";
                } else if search_column == 1 {
                    search_column_str = "CMD";
                }
                unsafe{
                    _FILTERS.clear();
                    _FILTERS.push(
                        FilterItem{
                            column: search_column_str.to_string(), 
                            value: search_term.to_string(),
                            filter_type: "eq".to_string(),
                        }
                    );
                }
                s.pop_layer();
            })
        );
    });
    siv.add_global_callback(cursive::event::Event::CtrlChar('s'), |siv|{
        match save_config() {
            Ok(_) => {},
            Err(_e) => {
                siv.add_layer(Dialog::text("Failed to Save Configuration").title("Failed to Save Configuration File").button("Ok", |s| {
                    s.pop_layer();
                }));
            },
        };
    });

    siv.add_global_callback('s', |siv|{
        siv.add_layer(
            Dialog::around(
                LinearLayout::vertical()
                    .child(
                        LinearLayout::horizontal()
                            .child(TextView::new("Search Column: ").h_align(HAlign::Left).with_name("search_column").full_width())
                            .child(DummyView)
                            .child(DummyView)
                            .child(TextView::new("Search Value: ").h_align(HAlign::Left).with_name("search_term").full_width())
                    )
                    .child(
                        LinearLayout::horizontal()
                            .child(SelectView::new().item_str("PID").item_str("CMD").popup().with_name("column_input").full_width())
                            .child(DummyView)
                            .child(DummyView)
                            .child(EditView::new().with_name("search_term_input").full_width())
                    )
            )
            .title("Search for a process")
            .button("Ok", |s: &mut Cursive| {
                let search_term = s.call_on_name("search_term_input", |view: &mut EditView| {
                    view.get_content()
                }).unwrap();
                let search_column = s.call_on_name("column_input", |view: &mut SelectView| {
                    view.add_item_str("Found");
                    view.selected_id().unwrap()
                }).unwrap();
                let mut search_column_str = "";
                if search_column == 0 {
                    search_column_str = "PID";
                } else if search_column == 1 {
                    search_column_str = "CMD";
                }
                unsafe{
                    _FILTERS.clear();
                    _FILTERS.push(
                        FilterItem{
                            column: search_column_str.to_string(), 
                            value: search_term.to_string(),
                            filter_type: "eq".to_string(),
                        }
                    );
                }
                s.pop_layer();
            })
        );
    });

    siv.add_global_callback('c', |siv|{
        siv.add_layer(Dialog::text("Clearing filters").title("Clearing filters").button("Ok", |s| {
            s.pop_layer();
        }));
        unsafe{
            _FILTERS.clear();
        }
    });

    siv.add_global_callback('w', |s| {
        let mut pid = 0;
        let selected_item = s.call_on_name("table", |view: &mut TableView<Process, BasicColumn>| {
            let selected_row: usize = view.item().unwrap() as usize;
            let selected_item = view.borrow_item(selected_row).unwrap().clone();
            pid = selected_item.pid;
            selected_item
        }).unwrap();
        let success = kill_processes_recursively(&selected_item);
        if success {
            s.add_layer(
                Dialog::around(TextView::new(format!("Successfully killed all children {}", pid)))
                    .title("Success")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        } else {
            s.add_layer(
                Dialog::around(TextView::new(format!("Failed to kill all children {}", pid)))
                    .title("Error")
                    .button("Close", |s| {
                        s.pop_layer();
                    }),
            );
        }

    });

    siv.run();
}

pub fn filter_process(procs: &mut Vec<Process>) -> Vec<Process> {
    let mut filtered_procs: Vec<Process> = procs.clone();
        for filter in unsafe{_FILTERS.iter()} {
            if filter.column == "PID" || filter.column == "PPID" || filter.column == "PRI" || filter.column == "FD" 
            {
                filtered_procs = procs
                        .into_iter()
                        .filter(|p: &&mut Process| {
                            let target_field_value = match filter.column.as_str() {
                                "PID" => p.pid,
                                "PPID" => p.parent_pid,
                                "PRI" => p.priority as u32,
                                "FD" => p.open_fds as u32,
                                _ => 0,
                            };

                            let filter_field_value: u32 = match filter.column.as_str() {
                                "PID" => filter.value.parse::<u32>().unwrap_or(0),
                                "PPID" => filter.value.parse::<u32>().unwrap_or(0),
                                "PRI" => filter.value.parse::<u32>().unwrap_or(0),
                                "FD" => filter.value.parse::<u32>().unwrap_or(0),
                                _ => 0,
                            };

                            match filter.filter_type.as_str() {
                                "eq" => target_field_value == filter_field_value,
                                "neq" => target_field_value != filter_field_value,
                                "greater" => target_field_value > filter_field_value,
                                "less" => target_field_value < filter_field_value,
                                _ => false,
                            }
                })
                .map(|p| p.clone())
                .collect::<Vec<Process>>();
            } 
            else if filter.column == "CMD" || filter.column == "OWNER" || filter.column == "STATE" 
            {
                filtered_procs = procs
                        .into_iter()
                        .filter(|p| {
                            let target_field_value = match filter.column.as_str() {
                                "CMD" => p.name.clone(),
                                "OWNER" => p.owner.clone(),
                                "STATE" => format!("{:?}", p.state),
                                _ => String::new(),
                            };

                    let filter_field_value = match filter.column.as_str() {
                        "CMD" => filter.value.to_string(),
                        "OWNER" => filter.value.to_string(),
                        "STATE" => filter.value.to_string(),
                        _ => String::new(),
                    };
                    let num = cmp::min(filter_field_value.len(), target_field_value.len());

                    match filter.filter_type.as_str() {
                        "eq" => target_field_value[0..num].trim() == filter_field_value[0..num].trim(),
                        "neq" => target_field_value.trim() != filter_field_value.trim(),
                        "greater" => target_field_value.trim() > filter_field_value.trim(),
                        "less" => target_field_value.trim() < filter_field_value.trim(),
                        _ => false,
                    }
                })
                .map(|p| p.clone())
                .collect::<Vec<Process>>();
            } 
            else if filter.column == "CPU" || filter.column == "MEM"
            {
                filtered_procs = procs
                        .into_iter()
                        .filter(|p| {
                            let target_field_value = match filter.column.as_str() {
                                "CPU" => p.cpu_hist.front().unwrap_or(&0.0) * 100 as f32,
                                "MEM" => (p.ram_hist.front().unwrap_or(&0) * 100) as f32/p._mem_total as f32,
                                _ => 0.0,
                            };

                    let filter_field_value = match filter.column.as_str() {
                        "CPU" => filter.value.parse::<f32>().unwrap_or(0.0),
                        "MEM" => filter.value.parse::<f32>().unwrap_or(0.0),
                        _ => 0.0,
                    };

                    match filter.filter_type.as_str() {
                        "eq" => target_field_value == filter_field_value,
                        "neq" => target_field_value != filter_field_value,
                        "greater" => target_field_value > filter_field_value,
                        "less" => target_field_value < filter_field_value,
                        _ => false,
                    }
                })
                .map(|p| p.clone())
                .collect::<Vec<Process>>();
            }
            else if filter.column == "STARTTIME"
            {
                filtered_procs = procs
                        .into_iter()
                        .filter(|p| {
                            let target_field_value: DateTime<chrono::Local> = p.start_time;
                            let filter_field_value = DateTime::parse_from_str(&filter.value, "%d/%m/%Y %H:%M").unwrap_or_default();
                        match filter.filter_type.as_str() {
                            "eq" => target_field_value == filter_field_value,
                            "neq" => target_field_value != filter_field_value,
                            "greater" => target_field_value > filter_field_value,
                            "less" => target_field_value < filter_field_value,
                            _ => false,
                        }
                })
                .map(|p| p.clone())
                .collect::<Vec<Process>>();
            }
        }
    //}
    if unsafe {SHOW_TREE == true} {
        //construct tree ordering:
        let mut i = 0;
        while i < filtered_procs.len() { // remove any children
            if i >= filtered_procs.len() {
                break;
            }
            if filtered_procs[i].parent_pid != 0 {
                filtered_procs.remove(i);
                continue;
            }
            i += 1;
        }
        i = 0;
    
        while i < filtered_procs.len().clone() {
            let mut saved_i = i;
            let child_list = filtered_procs[i].children.clone();
            filtered_procs[i].index = i as u32;
            for child in child_list { 
                if unsafe{_PID_TABLE.contains_key(&child)} {
                    if unsafe{_PID_TABLE[&child] as usize >= procs.len()} {
                        continue;
                    }
                    saved_i += 1;
                    filtered_procs.insert(saved_i,  procs[unsafe {_PID_TABLE[&child] as usize } ].clone()); 
                    let mut parent_spaces: String = String::new();
                    for letter in filtered_procs[i].name.chars() {
                        if letter == ' ' || letter == '-' || letter == '>' {
                            parent_spaces += " ";
                        }
                        else if letter == '|' {
                            parent_spaces += "|";
                        }
                        else {
                            break;
                        }
                    }
                    let name = filtered_procs[saved_i].name.clone();
                    filtered_procs[saved_i].name = format!("{}|--> {}", parent_spaces, name);
                    assert_eq!(filtered_procs[saved_i].parent_pid, filtered_procs[i].pid);
                }
            }
            i += 1;
        }
    }
    filtered_procs
}

