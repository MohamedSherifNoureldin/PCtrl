// Import the crate and some standard libraries
extern crate daemonize;
use std::fs::File;
use std::io::Write;
use daemonize::Daemonize;
use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::Path;
use std::{thread, time};
use std::os::unix::net::{UnixListener, UnixStream};
use std::io::Read;


// Define a function that writes some data to a file
fn write_to_file() -> std::io::Result<()>{
    let mut file = File::create("./tmp/daemon.txt")?;
    let data = b"Hello from the daemon!\n";
    file.write_all(data)?;
    let perm = fs::Permissions::from_mode(0o777);
    file.set_permissions(perm).unwrap();

    Ok(())
}
fn write_to_stream(mut stream: UnixStream) {
    let data = b"Hello from the daemon!\n";
    stream.write_all(data).unwrap();
}
// Define a function that takes a Unix listener and waits for a connection from the parent process
fn wait_for_connection(listener: UnixListener) {
    // Accept a connection from the listener
    let (stream, _) = listener.accept().unwrap();

    // Write some data to the stream
    write_to_stream(stream);
}

// Define the main function
fn main() {
    // Define a path to a directory
let path = Path::new("./tmp");

// Create the directory if it does not exist
fs::create_dir_all(path).unwrap();

// Create a permissions object with read, write and execute permissions for everyone
let perm = fs::Permissions::from_mode(0o777);
//let perm1 = fs::Permissions::from_mode(0o777);

// Set the permissions for the directory
fs::set_permissions(path, perm).unwrap();

    let socket_path = "./tmp/daemon.sock";
    let stdout = File::create("./tmp/daemon.out").unwrap();
    //let stdin = File::create("/tmp/daemon.in").unwrap();

    // Create a daemonize object with some options
    let daemonize = Daemonize::new()
        .pid_file("./tmp/test.pid") // Specify a pid file
        .chown_pid_file(true) // Change the ownership of the pid file
        .working_directory("./") // Set the working directory
        .user("nobody") // Set the user id
        .group("daemon") // Set the group id
        .umask(0o777) // Set the umask
        .stdout(stdout)
        //.stdin(stdin)
        //.exit_action(|| println!("Executed before master process exits")) // Execute some code before exiting the parent process
        .privileged_action(|| "Executed before drop privileges"); // Execute some code before dropping privileges

    // Start the daemonization process and get the outcome
    let outcome = daemonize.execute(); {
            // If we are in the parent process, we can print some information
            if daemonize::Outcome::is_parent(&outcome)  {
                println!("Success, daemonized with pid");
                // Create a Unix socket and connect to the child process
                let mut stream = UnixStream::connect(socket_path).unwrap();
                
                // Read some data from the stream
                let mut buffer = [0; 100];
                let n = stream.read(&mut buffer).unwrap();
                println!("Received: {}", String::from_utf8_lossy(&buffer[..n]));
                
                thread::sleep(time::Duration::from_secs(2));
            }
            // If we are in the child process, we can execute our function
            if daemonize::Outcome::is_child(&outcome)   {
                //write_to_file().unwrap(); 
                
                let listener = UnixListener::bind(socket_path).unwrap();

                // Wait for a connection from the parent process
                wait_for_connection(listener);

            }
    }
}