// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use std::thread;
use std::time::Duration;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn open_player_window(app: tauri::AppHandle, url: String) -> Result<(), String> {
    WebviewWindowBuilder::new(&app, "player", WebviewUrl::External(url.parse().unwrap()))
        .title("The Vault - Auto Player")
        .inner_size(800.0, 600.0)
        .resizable(true)
        .build()
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    // Start the Node.js server when app launches
    thread::spawn(|| {
        let mut attempts = 0;
        while attempts < 3 {
            match Command::new("node")
                .arg("server.js")
                .env("PORT", "8888")
                .current_dir(std::env::current_exe().unwrap().parent().unwrap())
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
            {
                Ok(mut child) => {
                    let _ = child.wait();
                    break;
                }
                Err(_) => {
                    attempts += 1;
                    thread::sleep(Duration::from_millis(1000));
                }
            }
        }
    });

    // Give server time to start
    thread::sleep(Duration::from_millis(2000));

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, open_player_window])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Inject a script to handle window.open calls
            let inject_script = r#"
                window.__tauri_open_player = function(url) {
                    window.__TAURI__.invoke('open_player_window', { url: url });
                };
                
                // Override window.open for player windows
                const originalOpen = window.open;
                window.open = function(url, name, features) {
                    if (url && url.includes('player.html')) {
                        window.__tauri_open_player(url);
                        return null;
                    }
                    return originalOpen.call(window, url, name, features);
                };
            "#;
            
            // Navigate to the working page after a short delay
            tauri::async_runtime::spawn(async move {
                tokio::time::sleep(Duration::from_millis(1000)).await;
                let _ = window.navigate("http://localhost:8888/working.html".parse().unwrap());
                tokio::time::sleep(Duration::from_millis(500)).await;
                let _ = window.eval(inject_script);
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}