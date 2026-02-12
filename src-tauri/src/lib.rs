use std::path::{Path, PathBuf};
use std::{env, fs, io};
use tauri_plugin_drpc;
use tauri::path::BaseDirectory;
use tauri::{Emitter, Manager};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_shell::ShellExt;
use std::collections::HashMap;
use std::ops::Add;
use std::os::windows::process::CommandExt;
use std::process::Command;
use std::sync::{Arc, Mutex};
use serde_json::{json, Value};

struct BotManager {
    bots: Mutex<HashMap<String, CommandChild>>,
}
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command(rename_all = "snake_case")]
fn save_translation(
    app: tauri::AppHandle,
    name: String,
    translation: String,
) {
            let translation_path = app
                .path()
                .resolve("translations", BaseDirectory::AppLocalData)
                .unwrap().join(format!("{name}.json"));
            if let Err(err) = fs::write(&translation_path, &translation) {
                eprintln!("Failed to write to {:?}: {}", &translation_path, err);
            }
}
#[tauri::command]
fn load_translations(app: tauri::AppHandle) -> String {
    let translations_dir = app
        .path()
        .resolve("translations", BaseDirectory::AppLocalData)
        .unwrap();

    if !translations_dir.exists() {
            fs::create_dir(translations_dir).unwrap();
        return "{}".to_string();
    }

    let mut map = serde_json::Map::new();

    if let Ok(entries) = fs::read_dir(&translations_dir) {
        for entry in entries.flatten() {
            let path: PathBuf = entry.path();

            if path.is_file() && path.extension().and_then(|e| e.to_str()) == Some("json") {
                if let Some(file_stem) = path.file_stem().and_then(|s| s.to_str()) {
                    map.insert(file_stem.to_string(), fs::read_to_string(&path).unwrap().parse().unwrap());
                }
            }
        }
    }

    Value::Object(map).to_string()
}

#[tauri::command]
fn load_themes(app: tauri::AppHandle) -> Vec<String> {
    let themes_dir = app
        .path()
        .resolve("themes", BaseDirectory::AppLocalData)
        .unwrap();

    if !themes_dir.exists() {
            fs::create_dir(themes_dir).unwrap();
        return vec![];
    }

    let mut theme_files = Vec::new();
    if let Ok(entries) = fs::read_dir(&themes_dir) {
        for entry in entries.flatten() {
            let path: PathBuf = entry.path();
            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "css" {
                        if let Some(path_str) = path.to_str() {
                            theme_files.push(path_str.to_string());
                        }
                    }
                }
            }
        }
    }
    theme_files
}

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
fn mark_break_point(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    bot_path: String,
    action_id: String,
) -> Result<(), String> {
    let mut bots = state.bots.lock().map_err(|e| e.to_string())?;

    let bot = bots.get_mut(&bot_path).ok_or("Bot not found")?;
    let data = format!("$DEBUGGER$$$ MARK {action_id}");
    bot.write(data.as_bytes()).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn remove_break_point(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    bot_path: String,
    action_id: String,
) -> Result<(), String> {
    let mut bots = state.bots.lock().map_err(|e| e.to_string())?;

    let bot = bots.get_mut(&bot_path).ok_or("Bot not found")?;
    let data = format!("$DEBUGGER$$$ REMOVE {action_id}");
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
async fn upload_bot(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    host: String,
    port: String,
    username: String,
    password: String,
    bot_path: String,
) -> Result<(), String> {
    let node = _app
        .path()
        .resolve("resources/sftp", BaseDirectory::Resource)
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "windows")]
    let exe_path = node.join("sftp-win.exe");

    #[cfg(target_os = "macos")]
    let exe_path = if cfg!(target_arch = "aarch64") {
        node.join("mac/sftp-macos-arm64")
    } else {
        node.join("mac/sftp-macos-x64")
    };

    #[cfg(target_os = "linux")]
    let exe_path = node.join("sftp-linux");


    let mut command = Command::new(exe_path);
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    let output = command
        .args(vec![&bot_path, "/", &host, &username, &password, &port])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Uploader failed with code {:?}. stderr: {}",
            output.status.code(),
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

#[tauri::command(rename_all = "snake_case")]
async fn run_bot(
    _app: tauri::AppHandle,
    state: tauri::State<'_, BotManager>,
    bot_path: String,
) -> Result<(), String> {
    let mut run_command: tauri::api::shell::Command<_>;
    #[cfg(target_os = "windows")]
    {
        let node = _app
                .path()
                .resolve("resources/nodejs", BaseDirectory::Resource)
                .unwrap();
        run_command = _app
            .shell()
            .command(node.join("node.exe"))
            .current_dir(&bot_path)
            .args(vec![&bot_path, &node.join("npm.cmd").to_str().unwrap().to_string()]);
    }
    #[cfg(target_os = "macos")]
    {
            let node = if cfg!(target_arch = "aarch64") {
                _app
                    .path()
                    .resolve("resources/node-macos-arm64/bin", BaseDirectory::Resource)
                    .unwrap();
            } else {
                _app
                    .path()
                    .resolve("resources/node-macos-x64/bin", BaseDirectory::Resource)
                    .unwrap();
            };
         run_command =
                    _app
                    .shell()
                    .command(node.join("node"))
                    .current_dir(&bot_path)
                    .args(vec![&bot_path, &node.join("npm").to_str().unwrap().to_string()]);
    }
    #[cfg(target_os = "linux")]
    {
            let node = _app
                .path()
                .resolve("resources/node-linux-x64/bin", BaseDirectory::Resource)
                .unwrap();
        run_command = _app
            .shell()
            .command(node.join("node"))
            .current_dir(&bot_path)
            .args(vec![&bot_path, &node.join("npm").to_str().unwrap().to_string()]);
    }


    let (mut _rx, child) = run_command.spawn().map_err(|e| e.to_string())?;

    let mut bots = state.bots.lock().unwrap();
    bots.insert(bot_path.clone(), child);

    tauri::async_runtime::spawn(async move {
        while let Some(event) = _rx.recv().await {
            match event {
                CommandEvent::Stdout(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes).to_string();
                    let _ = _app.emit("stdout", [&bot_path, &line]);
                }
                CommandEvent::Stderr(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes).to_string();
                    let _ = _app.emit("stdout", [&bot_path, &line]);
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
    let mut run_command: tauri::api::shell::Command<_>;
    #[cfg(target_os = "windows")]
    {
            let node = _app
                .path()
                .resolve("resources/nodejs", BaseDirectory::Resource)
                .unwrap();
        run_command = _app
            .shell()
            .command(node.join("node.exe"))
            .current_dir(&bot_path)
            .args([format!("{bot_path}/classes/PluginManager.js"), node.join("npm.cmd").to_str().unwrap().to_string()]);
    }
    #[cfg(target_os = "macos")]
    {
              let node =
                  if cfg!(target_arch = "aarch64") {
                      _app
                          .path()
                          .resolve("resources/node-macos-arm64/bin", BaseDirectory::Resource)
                          .unwrap();
                  } else {
                      _app
                          .path()
                          .resolve("resources/node-macos-x64/bin", BaseDirectory::Resource)
                          .unwrap();
                  };
        run_command = _app
                    .shell()
                    .command(node.join("node"))
                    .current_dir(&bot_path)
                    .args([format!("{bot_path}/classes/PluginManager.js"), node.join("npm").to_str().unwrap().to_string()]);
    }
    #[cfg(target_os = "linux")]
    {
        let node = _app
            .path()
            .resolve("resources/node-linux-x64/bin", BaseDirectory::Resource)
            .unwrap();
        run_command = _app
            .shell()
            .command(node.join("node"))
            .current_dir(&bot_path)
            .args([format!("{bot_path}/classes/PluginManager.js"), node.join("npm").to_str().unwrap().to_string()]);
    }

    let (mut _rx, child) = run_command.spawn().map_err(|e| e.to_string())?;

    tauri::async_runtime::spawn(async move {
        while let Some(event) = _rx.recv().await {
            if let CommandEvent::Stdout(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes).to_string();
                _app.emit("plugins", [&bot_path, &line]).unwrap();
            }
        }
    });

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn download_action(
    _app: tauri::AppHandle,
    bot_path: String,
    action: String,
    sha: String,
    data: String,
) {
    let actions_dir = Path::new(&bot_path).join("actions");

    if let Err(e) = fs::create_dir_all(&actions_dir) {
        eprintln!("Failed to create actions directory: {}", e);
        return;
    }

    // Remove old actions with the same name (ignoring first 40 chars)
    if let Ok(entries) = fs::read_dir(&actions_dir) {
        for entry in entries.flatten() {
            let path = entry.path();

            if !path.is_file() {
                continue;
            }

            let Some(file_name) = path.file_name().and_then(|n| n.to_str()) else {
                continue;
            };

            if file_name.len() <= 40 {
                continue;
            }

            let suffix = &file_name[40..];

            if suffix == action {
                if let Err(e) = fs::remove_file(&path) {
                    eprintln!("Failed to remove old action {:?}: {}", path, e);
                }
            }
        }
    }

    // Write new action
    let new_path = actions_dir.join(format!("{}{}", sha, action));

    if let Err(e) = fs::write(&new_path, data) {
        eprintln!("Failed to write action {:?}: {}", new_path, e);
    }
}

#[tauri::command(rename_all = "snake_case")]
fn download_trigger(
    _app: tauri::AppHandle,
    bot_path: String,
    trigger: String,
    sha: String,
    data: String,
) {
    let triggers_dir = Path::new(&bot_path).join("triggers");

    if let Err(e) = fs::create_dir_all(&triggers_dir) {
        eprintln!("Failed to create triggers directory: {}", e);
        return;
    }

    if let Ok(entries) = fs::read_dir(&triggers_dir) {
        for entry in entries.flatten() {
            let path = entry.path();

            if !path.is_file() {
                continue;
            }

            let Some(file_name) = path.file_name().and_then(|n| n.to_str()) else {
                continue;
            };

            if file_name.len() <= 40 {
                continue;
            }

            if &file_name[40..] == trigger {
                let _ = fs::remove_file(&path);
            }
        }
    }

    let new_path = triggers_dir.join(format!("{}{}", sha, trigger));

    if let Err(e) = fs::write(&new_path, data) {
        eprintln!("Failed to write trigger {:?}: {}", new_path, e);
    }
}


#[tauri::command(rename_all = "snake_case")]
fn download_extension(
    _app: tauri::AppHandle,
    bot_path: String,
    extension: String,
    sha: String,
    data: String,
) {
    let extensions_dir = Path::new(&bot_path).join("extensions");

    if let Err(e) = fs::create_dir_all(&extensions_dir) {
        eprintln!("Failed to create extensions directory: {}", e);
        return;
    }

    if let Ok(entries) = fs::read_dir(&extensions_dir) {
        for entry in entries.flatten() {
            let path = entry.path();

            if !path.is_file() {
                continue;
            }

            let Some(file_name) = path.file_name().and_then(|n| n.to_str()) else {
                continue;
            };

            if file_name.len() <= 40 {
                continue;
            }

            if &file_name[40..] == extension {
                let _ = fs::remove_file(&path);
            }
        }
    }

    let new_path = extensions_dir.join(format!("{}{}", sha, extension));

    if let Err(e) = fs::write(&new_path, data) {
        eprintln!("Failed to write extension {:?}: {}", new_path, e);
    }
}


#[tauri::command(rename_all = "snake_case")]
fn download_translation(
    app: tauri::AppHandle,
    translation: String,
    sha: String,
    data: String,
) {
    let translations_dir = app
        .path()
        .resolve("translations", BaseDirectory::AppLocalData)
        .unwrap();

    if let Err(e) = fs::create_dir_all(&translations_dir) {
        eprintln!("Failed to create translations directory: {}", e);
        return;
    }

    if let Ok(entries) = fs::read_dir(&translations_dir) {
        for entry in entries.flatten() {
            let path = entry.path();

            if !path.is_file() {
                continue;
            }

            let Some(file_name) = path.file_name().and_then(|n| n.to_str()) else {
                continue;
            };

            if file_name.len() <= 40 {
                continue;
            }

            if &file_name[40..] == translation {
                let _ = fs::remove_file(&path);
            }
        }
    }

    let new_path = translations_dir.join(format!("{}{}", sha, translation));

    if let Err(e) = fs::write(&new_path, data) {
        eprintln!("Failed to write translation {:?}: {}", new_path, e);
    }
}


#[tauri::command(rename_all = "snake_case")]
fn download_dashboard_theme(
    _app: tauri::AppHandle,
    theme: String,
    sha: String,
    data: String,
    bot_paths: Vec<String>,
    dashboard_themes: Vec<String>,
) {
    for (bot_path, dashboard_theme) in bot_paths.iter().zip(dashboard_themes.iter()) {
        if dashboard_theme != &format!("{}{}", sha, theme) {
            continue;
        }

        let dashboard_theme_path = Path::new(bot_path)
            .join("dashboard")
            .join("static")
            .join("index.css");

        if let Err(e) = fs::write(&dashboard_theme_path, &data) {
            eprintln!(
                "Failed to write dashboard theme to {:?}: {}",
                dashboard_theme_path, e
            );
        }
    }
}


#[tauri::command(rename_all = "snake_case")]
fn download_theme(
    app: tauri::AppHandle,
    theme: String,
    sha: String,
    data: String,
) {
    let themes_dir = app
        .path()
        .resolve("themes", BaseDirectory::AppLocalData)
        .unwrap();

    if let Err(e) = fs::create_dir_all(&themes_dir) {
        eprintln!("Failed to create themes directory: {}", e);
        return;
    }

    if let Ok(entries) = fs::read_dir(&themes_dir) {
        for entry in entries.flatten() {
            let path = entry.path();

            if !path.is_file() {
                continue;
            }

            let Some(file_name) = path.file_name().and_then(|n| n.to_str()) else {
                continue;
            };

            if file_name.len() <= 40 {
                continue;
            }

            let suffix = &file_name[40..];

            if suffix == theme {
                if let Err(e) = fs::remove_file(&path) {
                    eprintln!("Failed to remove old theme {:?}: {}", path, e);
                }
            }
        }
    }

    let new_path = themes_dir.join(format!("{}{}", sha, theme));

    if let Err(e) = fs::write(&new_path, data) {
        eprintln!("Failed to write theme {:?}: {}", new_path, e);
    }
}


#[tauri::command(rename_all = "snake_case")]
fn remove_action(_app: tauri::AppHandle, bot_path:String, action:String, sha:String) {
    let path = Path::new(&bot_path).join("actions").join(sha+&action);
    fs::remove_file(&path).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
fn remove_trigger(_app: tauri::AppHandle, bot_path:String, trigger:String, sha:String) {
    let path = Path::new(&bot_path).join("triggers").join(sha+&trigger);
    fs::remove_file(&path).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
fn remove_extension(_app: tauri::AppHandle, bot_path:String, extension:String, sha:String) {
    let path = Path::new(&bot_path).join("extensions").join(sha+&extension);
    fs::remove_file(&path).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
fn remove_translation(_app: tauri::AppHandle, translation:String, sha:String) {
    let translations_dir = _app
        .path()
        .resolve("translations", BaseDirectory::AppLocalData)
        .unwrap();
    let path = Path::new(&translations_dir).join(sha+&translation);
    fs::remove_file(&path).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
fn remove_dashboard_theme(
    _app: tauri::AppHandle,
    theme: String,
    sha: String,
    bot_paths: Vec<String>,
    dashboard_themes: Vec<String>,
) {
    for (bot_path, dashboard_theme) in bot_paths.iter().zip(dashboard_themes.iter()) {
        if dashboard_theme != &format!("{}{}", sha, theme) {
            continue;
        }

        let dashboard_theme_path = Path::new(bot_path)
            .join("dashboard")
            .join("static")
            .join("index.css");

        if let Err(e) = fs::remove_file(&dashboard_theme_path) {
            eprintln!(
                "Failed to remove dashboard theme to {:?}: {}",
                dashboard_theme_path, e
            );
        }
    }
}
#[tauri::command(rename_all = "snake_case")]
fn remove_theme(_app: tauri::AppHandle, theme:String, sha:String) {
    let themes_dir = _app
        .path()
        .resolve("themes", BaseDirectory::AppLocalData)
        .unwrap();
    let path = Path::new(&themes_dir).join(sha+&theme);
    fs::remove_file(&path).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
fn save_bot_triggers(
    _app: tauri::AppHandle,
    bot_path: String,
    modified_triggers: Vec<String>,
    trigger_contents: Vec<String>,
    removed_triggers: Vec<String>,
) {
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
    fs::write(&extensions_path, extensions_json).unwrap();
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
fn save_bot_settings(_app: tauri::AppHandle, bot_path:String, bots_json:String, settings_json:String, theme:String) {
    let bots_path = _app
        .path()
        .resolve("bots.json", BaseDirectory::AppLocalData)
        .unwrap();
    let themes_path = _app
        .path()
        .resolve("themes", BaseDirectory::AppLocalData)
        .unwrap();
    let theme_path = themes_path.join(&theme);
    let dashboard_theme_path = Path::new(&bot_path).join("dashboard").join("static").join("index.css");
    let settings_path = Path::new(&bot_path).join("data").join("settings.json");
        fs::write(&bots_path, bots_json).unwrap();
        fs::write(&settings_path, settings_json).unwrap();
        if &theme == "default" {
            if fs::exists(&dashboard_theme_path).unwrap()
            {
                fs::remove_file(&dashboard_theme_path).unwrap();
            }
        } else {
            fs::copy(&theme_path, &dashboard_theme_path).unwrap();
        }
}

#[tauri::command]
fn load_bots(app: tauri::AppHandle) -> String {
    let bots_path = app
        .path()
        .resolve("bots.json", BaseDirectory::AppLocalData)
        .unwrap();

    if !bots_path.exists() {
        return "[]".to_string();
    }

    fs::read_to_string(&bots_path).unwrap_or_else(|_| "[]".to_string())
}

#[tauri::command(rename_all = "snake_case")]
fn save_bots(_app: tauri::AppHandle, json: String) {
    let bots_path = _app
        .path()
        .resolve("bots.json", BaseDirectory::AppLocalData)
        .unwrap();
        fs::write(&bots_path, json).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
fn copy_bot_files(_app: tauri::AppHandle, bot_path: String) {
    let resource_path = _app
        .path()
        .resolve("resources/Bot", BaseDirectory::Resource)
        .unwrap();
    tauri::async_runtime::spawn(async move {
        copy_dir_all(&resource_path, &bot_path, None).unwrap();
        _app.emit("finished_copying", &bot_path).unwrap();
    });
}

#[tauri::command(rename_all = "snake_case")]
fn update_bot_files(_app: tauri::AppHandle, bot_path: String) {
    let resource_path = _app
        .path()
        .resolve("resources/Bot", BaseDirectory::Resource)
        .unwrap();
    tauri::async_runtime::spawn(async move {
        copy_dir_all(&resource_path, &bot_path, Some(&resource_path.join("data"))).unwrap();
        _app.emit("finished_copying", &bot_path).unwrap();
    });
}

fn copy_dir_all(
    src: impl AsRef<Path>,
    dst: impl AsRef<Path>,
    exclude_path: Option<&Path>,
) -> std::io::Result<()> {
    std::fs::create_dir_all(&dst)?;
    for entry in std::fs::read_dir(src.as_ref())? {
        let entry = entry?;
        let ty = entry.file_type()?;
        let entry_path = entry.path();

        if let Some(exclude) = exclude_path {
            if ty.is_dir() && entry_path == exclude {
                continue;
            }
        }

        if ty.is_dir() {
            copy_dir_all(&entry_path, dst.as_ref().join(entry.file_name()), exclude_path)?;
        } else {
            std::fs::copy(&entry_path, dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

fn kill_all_bots(state: &BotManager) {
    let mut bots = state.bots.lock().unwrap();
    for (bot_path, mut child) in bots.drain() {
        let data = String::from("$DBE$$$ STOP");
        let _ = child.write(data.as_bytes()).map_err(|e| e.to_string());
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .manage(BotManager {
            bots: Mutex::new(HashMap::new()),
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            save_translation,
            load_translations,
            load_themes,
            debug_action,
            mark_break_point,
            remove_break_point,
            attach_debugger,
            remove_debugger,
            upload_bot,
            run_bot,
            stop_bot,
            is_bot_running,
            load_bot_plugins,
            download_action,
            download_trigger,
            download_extension,
            download_dashboard_theme,
            download_theme,
            download_translation,
            remove_action,
            remove_trigger,
            remove_extension,
            remove_dashboard_theme,
            remove_theme,
            remove_translation,
            save_bot_triggers,
            load_bot_triggers,
            save_bot_extensions,
            load_bot_extensions,
            load_bot_settings,
            save_bot_settings,
            load_bots,
            save_bots,
            copy_bot_files,
            update_bot_files
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_drpc::init())
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    app.run(move |app_handle, event| {
        #[cfg(all(desktop, not(test)))]
        match &event {
            tauri::RunEvent::ExitRequested { api, code, .. } => {
                if code.is_none() {
                    api.prevent_exit();
                    let state = app_handle.state::<BotManager>();
                    kill_all_bots(&state);
                    std::process::exit(0);
                }
            }
            tauri::RunEvent::WindowEvent {
                event: tauri::WindowEvent::CloseRequested { api, .. },
                label,
                ..
            } => {
                println!("closing window...");
                api.prevent_close();
                app_handle
                    .get_webview_window(label)
                    .unwrap()
                    .destroy()
                    .unwrap();
            }
            _ => {}
        }
    });
}
