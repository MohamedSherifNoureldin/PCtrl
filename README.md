# PCtrl - Linux Process/Task Manager based on Rust
Pctrl is a robust, featureful, easy-to-use and powerful process manager based on the Rust programming language. It provides an overview of the system, as in what processes are currently running and the system, and gives administrators control to manipulate these processes. Pctrl is designed to compete with all currently available Linux process managers by providing powerful controls as well as a friendly interface choice of running in either a Terminal User Interface (TUI), Graphical User Interface (GUI) or both. 

We have built this project as part of the Operating Systems (CSCE 3401) course at the American University in Cairo with the aim to experiment and learn the rust programming language. 

## Demo
### TUI
![TUI](
demo/TUI.gif
)
### GUI
![GUI](
demo/GUI.gif
)

## Features
- [x] Run as a TUI or GUI or both
- [x] List all processes in a tabular format
- [x] List all processes in a tree format
- [x] Sort processes by any column
- [x] Search for a process by name or pid
- [x] Filter processes by various categories
- [x] View process details
- [x] View graphs demonstrating both overall system and individual process usage of memory and cpu
- [x] Kill a process
- [x] Change process priority
- [x] Pause/Unpause a process
- [x] Change process niceness
- [x] Change process owner
- [x] Export processes list to a csv file
- [x] Monitor a process and restart it if it crashes
- [x] Track and save a process's resource usage over time in a file

## Installation
### Deb Package
1. Download the deb package from the releases page
2. Install the package using 
    ```bash
    sudo apt install ./pctrl_1.0.0_amd64.deb
    ```
### AppImage
1. Download the AppImage from the releases page
2. Make the AppImage executable
    ```bash
    chmod +x pctrl_1.0.0_amd64.AppImage
    ```
3. Run the AppImage
    ```bash
    ./pctrl_1.0.0_amd64.AppImage
    ```

## Building from source
1. Clone the repository
    ```bash
    git clone https://
    ```
2. Install system dependencies
    ```bash
    sudo apt update
    sudo apt install libwebkit2gtk-4.0-dev \
            build-essential \
            curl \
            wget \
            libssl-dev \
            libgtk-3-dev \
            libayatana-appindicator3-dev \
            librsvg2-dev \
            libncursesw5-dev
    ```
3. Install Rust
    ```bash
    curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
    ```
4. Install the latest LTS version of Node & NPM
5. Install Tauri-CLI
    ```bash
    cargo install tauri-cli
    ```
6. Install Node packages
    ```bash
    npm install
    ```
7. Build the project
    ```bash
    cargo tauri build
    ```
8. Build results will be located in the `src-tauri/target/release` directory

## Usage
- Run the TUI only (default mode)
    ```bash
    pctrl
    ```
- Run the GUI only
    ```bash
    pctrl gui_only
    ```
- Run both the TUI and GUI concurrently
    ```bash
    pctrl gui
    ```
- To view list of command line arguments that Pctrl accepts along with commands that Pctrl accepts
    ```bash
    pctrl --help
    ```
- To record information about a certain process and save it in a file
    ```bash
    pctrl --record <pid>
    ```
    Output file: \{HOME\}/.local/share/pctrl/pctrl\_\{PID\}.plog
- To monitor a process and restart it whenever it crashes
    ```bash
    pctrl keepalive <PID>
    ```
- To filter the processes to be displayed in the TUI processes table
    ```bash
    pctrl filter --columns <COLUMNS_TO_FILTER_ON> --type <TYPE OF FILTER> --value <VALUE TO FILTER ON>
    ```
    Example of filtering for processes with pid greater than 2 and priority 20 and CPU less than 5:
    ```bash
    pctrl filter --columns PID,PRI,CPU --type greater,eq,less --value 2,20,5
    ```
- To search for a certain process using PID or Name (CMD)
    ```bash
    pctrl search --type <TYPE OF SEARCH> --value <VALUE TO SEARCH FOR>
    ```
    Example of searching for a process with pid 2:
    ```bash
    pctrl search --type PID --value 2
    ```
- As for the usage of the TUI itself, the TUI contains a Control box that shows what keyboard buttons to click on in order to achieve certain functionality. Most actions described in this box are invoked on the selected item in the processes table. To sort in the TUI, you only need to click on the header of the column you want to sort on and clicking on it toggles the sorting order.
- Similarly, the GUI is self-explanatory and hence doesn't have to be specially explained. However, it is worth noting that some features appear only when you have a process selected from the processes table (such as buttons to manipulate the process) and the tab to show the selected process's graphs.

## Directory Structure
- `src` contains the source code for the react frontend of the GUI
    - `App.css` a custom stylesheet for the GUI
    - `App.jsx` the main component of the GUI responsible for rendering the different tabs and processing the data received from the backend
    - `main.jsx` the entry point of the GUI
    - `ProcessTable.jsx` the component responsible for rendering the processes table
    - `ProcessTree.jsx` the component responsible for rendering the processes tree
    - `ProcessInfo.jsx` the component responsible for rendering the selected process's information
    - `SystemInfo.jsx` the component responsible for rendering the system information tab along with its graphs
    - `Theme.jsx` custom theme for the GUI
- `src-tauri` contains the source code for the backend and the TUI
    - `src` actual rust source code
        - `main.rs` the entry point of the backend. It is responsible for handling the command line arguments, starting the TUI or GUI or both accordingly and reading the configuration file
        - `our_mods.rs` just a file to hold all the modules we created
        - `our_modes` contains the code for our modules
            - `gui.rs` contains the code for the tauri methods that are called from the GUI
            - `tui.rs` contains the code for the cursive TUI
            - `proc_functions.rs` contains the code for the functions that read and parse the process information from the system as well as the functions that manipulate processes.
            - `structures.rs` contains the code for the structures needed across the project
