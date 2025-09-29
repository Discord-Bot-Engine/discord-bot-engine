use std::path::{Path};
use std::{fs, io};
use tauri::path::BaseDirectory;
use tauri::{Emitter, Manager};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_shell::ShellExt;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use serde_json::{json, Value};

struct BotManager {
    bots: Mutex<HashMap<String, CommandChild>>,
}
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command(rename_all = "snake_case")]
fn debug_action(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    bot_path: String,
    trigger_id:String,
    action_id: String,
) -> Result<(), String> {
    let mut bots = state.bots.lock().map_err(|e| e.to_string())?;

    let bot = bots.get_mut(&bot_path).ok_or("Bot not found")?;
    let data = format!("$DEBUGGER$$$ {trigger_id} {action_id}");
    bot.write(data.as_bytes()).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn attach_debugger(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    bot_path: String,
) -> Result<(), String> {
    let mut bots = state.bots.lock().map_err(|e| e.to_string())?;

    let bot = bots.get_mut(&bot_path).ok_or("Bot not found")?;
    let data = "$DBE$$$ ATTACH DEBUGGER";
    bot.write(data.as_bytes()).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn remove_debugger(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    bot_path: String,
) -> Result<(), String> {
    let mut bots = state.bots.lock().map_err(|e| e.to_string())?;

    let bot = bots.get_mut(&bot_path).ok_or("Bot not found")?;
    let data = "$DBE$$$ REMOVE DEBUGGER";
    bot.write(data.as_bytes()).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
async fn run_bot(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    bot_path: String,
) -> Result<(), String> {
    let mut run_command = _app
        .shell()
        .sidecar("node")
        .map_err(|e| e.to_string())?;
    run_command = run_command.args(vec![bot_path.clone()]);

    let (mut _rx, child) = run_command.spawn().map_err(|e| e.to_string())?;

    let mut bots = state.bots.lock().unwrap();
    bots.insert(bot_path.clone(), child);

    tauri::async_runtime::spawn(async move {
        while let Some(event) = _rx.recv().await {
            match event {
                CommandEvent::Stdout(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes).to_string();
                    let _ = _app.emit("stdout", [bot_path.clone(), line]);
                }
                CommandEvent::Stderr(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes).to_string();
                    let _ = _app.emit("stdout", [bot_path.clone(), line]);
                }
                _ => {}
            }
        }
    });

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn stop_bot(
    state: tauri::State<'_, BotManager>,
    bot_path: String,
) -> Result<(), String> {
    let mut bots = state.bots.lock().unwrap();

    if let Some(mut child) = bots.remove(&bot_path) {
        let data = String::from("$DBE$$$ STOP");
        child.write(data.as_bytes()).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err(format!("Bot not found: {}", bot_path))
    }
}

#[tauri::command(rename_all = "snake_case")]
fn is_bot_running(
    state: tauri::State<'_, BotManager>,
    bot_path: String,
) -> bool {
    let mut bots = state.bots.lock().unwrap();
    bots.contains_key(&bot_path)
}

#[tauri::command(rename_all = "snake_case")]
async fn load_bot_plugins(
    _app: tauri::AppHandle,
    bot_path: String,
) -> Result<(), String> {
    let run_command = _app
        .shell()
        .sidecar("node")
        .map_err(|e| e.to_string())?
        .args([format!("{bot_path}/classes/PluginManager.js")]);

    let (mut _rx, child) = run_command.spawn().map_err(|e| e.to_string())?;

    tauri::async_runtime::spawn(async move {
        while let Some(event) = _rx.recv().await {
            if let CommandEvent::Stdout(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes).to_string();
                _app.emit("plugins", [bot_path.clone(), line]).unwrap();
            }
        }
    });

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn download_action(_app: tauri::AppHandle, bot_path:String, action:String, sha:String, data:String) {
    let path = Path::new(&bot_path).join("actions").join(sha+&action);
    tauri::async_runtime::spawn(async move {
        fs::write(&path, data).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn download_trigger(_app: tauri::AppHandle, bot_path:String, trigger:String, sha:String, data:String) {
    let path = Path::new(&bot_path).join("triggers").join(sha+&trigger);
    tauri::async_runtime::spawn(async move {
        fs::write(&path, data).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn download_extension(_app: tauri::AppHandle, bot_path:String, extension:String, sha:String, data:String) {
    let path = Path::new(&bot_path).join("extensions").join(sha+&extension);
    tauri::async_runtime::spawn(async move {
        fs::write(&path, data).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn remove_action(_app: tauri::AppHandle, bot_path:String, action:String, sha:String) {
    let path = Path::new(&bot_path).join("actions").join(sha+&action);
    tauri::async_runtime::spawn(async move {
        fs::remove_file(&path).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn remove_trigger(_app: tauri::AppHandle, bot_path:String, trigger:String, sha:String) {
    let path = Path::new(&bot_path).join("triggers").join(sha+&trigger);
    tauri::async_runtime::spawn(async move {
        fs::remove_file(&path).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn remove_extension(_app: tauri::AppHandle, bot_path:String, extension:String, sha:String) {
    let path = Path::new(&bot_path).join("extensions").join(sha+&extension);
    tauri::async_runtime::spawn(async move {
        fs::remove_file(&path).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn save_bot_triggers(
    _app: tauri::AppHandle,
    bot_path: String,
    modified_triggers: Vec<String>,
    trigger_contents: Vec<String>,
    removed_triggers: Vec<String>,
) {
    tauri::async_runtime::spawn(async move {
        for (file, content) in modified_triggers.into_iter().zip(trigger_contents.into_iter()) {
            let trigger_path = Path::new(&bot_path).join("data").join(file + ".json");
            if let Err(err) = fs::write(&trigger_path, content) {
                eprintln!("Failed to write to {:?}: {}", trigger_path, err);
            }
        }
        for file in removed_triggers {
            let trigger_path = Path::new(&bot_path).join("data").join(file + ".json");
            if let Err(err) = fs::remove_file(&trigger_path) {
                eprintln!("Failed to remove {:?}: {}", trigger_path, err);
            }
        }
    });
}

#[tauri::command(rename_all = "snake_case")]
fn load_bot_triggers(bot_path: String) -> String {
    let data_dir = Path::new(&bot_path).join("data");

    let mut triggers: Vec<Value> = Vec::new();

    if let Ok(entries) = fs::read_dir(&data_dir) {
        for entry in entries.flatten() {
            if let Ok(file_type) = entry.file_type() {
                if file_type.is_file() {
                    if let Some(file_name) = entry.file_name().to_str() {
                        if file_name.len() == 41 {
                            match fs::read_to_string(entry.path()) {
                                Ok(content) => {
                                    match serde_json::from_str::<Value>(&content) {
                                        Ok(json_obj) => triggers.push(json_obj),
                                        Err(err) => eprintln!("Invalid JSON in {:?}: {}", entry.path(), err),
                                    }
                                }
                                Err(err) => eprintln!("Failed to read {:?}: {}", entry.path(), err),
                            }
                        }
                    }
                }
            }
        }
    }

    json!(triggers).to_string()
}

#[tauri::command(rename_all = "snake_case")]
fn save_bot_extensions(_app: tauri::AppHandle, bot_path:String, extensions_json:String) {
    let extensions_path = Path::new(&bot_path).join("data").join("extensions.json");
    tauri::async_runtime::spawn(async move {
        fs::write(&extensions_path, extensions_json).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn load_bot_extensions(bot_path:String) -> String {
    let extensions_path = Path::new(&bot_path).join("data").join("extensions.json");
    fs::read_to_string(&extensions_path).expect("Failed to read extensions file")
}

#[tauri::command(rename_all = "snake_case")]
fn load_bot_settings(bot_path:String) -> String {
    let settings_path = Path::new(&bot_path).join("data").join("settings.json");
    fs::read_to_string(&settings_path).expect("Failed to read settings file")
}

#[tauri::command(rename_all = "snake_case")]
fn save_bot_settings(_app: tauri::AppHandle, bot_path:String, bots_json:String, settings_json:String) {
    let bots_path = _app
        .path()
        .resolve("bots.json", BaseDirectory::AppLocalData)
        .unwrap();
    let settings_path = Path::new(&bot_path).join("data").join("settings.json");
    tauri::async_runtime::spawn(async move {
        fs::write(&bots_path, bots_json).unwrap();
    });
    tauri::async_runtime::spawn(async move {
        fs::write(&settings_path, settings_json).unwrap();
    });
}

#[tauri::command]
fn load_bots(_app: tauri::AppHandle) -> String {
    let bots_path = _app
        .path()
        .resolve("bots.json", BaseDirectory::AppLocalData)
        .unwrap();
        fs::read_to_string(&bots_path).expect("Failed to read bots file")
}

#[tauri::command(rename_all = "snake_case")]
fn save_bots(_app: tauri::AppHandle, json: String) {
    let bots_path = _app
        .path()
        .resolve("bots.json", BaseDirectory::AppLocalData)
        .unwrap();
    tauri::async_runtime::spawn(async move {
        fs::write(&bots_path, json).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn copy_bot_files(_app: tauri::AppHandle, bot_path: String) {
    let resource_path = _app
        .path()
        .resolve("resources/Bot", BaseDirectory::Resource)
        .unwrap();
    let triggers = Path::new(&bot_path).join("Bot").join("data").join("triggers");
    tauri::async_runtime::spawn(async move {
        copy_dir_all(&resource_path, &bot_path).unwrap();
        fs::create_dir_all(&triggers).unwrap();
        _app.emit("finished_copying", &bot_path).unwrap();
    });
}

fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(BotManager {
            bots: Mutex::new(HashMap::new()),
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            debug_action,
            attach_debugger,
            remove_debugger,
            run_bot,
            stop_bot,
            is_bot_running,
            load_bot_plugins,
            download_action,
            download_trigger,
            download_extension,
            remove_action,
            remove_trigger,
            remove_extension,
            save_bot_triggers,
            load_bot_triggers,
            save_bot_extensions,
            load_bot_extensions,
            load_bot_settings,
            save_bot_settings,
            load_bots,
            save_bots,
            copy_bot_files
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
