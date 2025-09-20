import {fileURLToPath} from "url";
import path from "node:path"
import * as fs from "node:fs";
import { dirname } from 'path';

(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const triggerClassesPath = path.resolve(__dirname, "../triggers")
    const actionClassesPath = path.resolve(__dirname, "../actions")
    const extensionClassesPath = path.resolve(__dirname, "../extensions")
    let triggerClasses = await Promise.all(fs.readdirSync(triggerClassesPath).filter(file => file.endsWith(".js")).map(file => import("file://" + path.join(triggerClassesPath, file)).catch(() => {})))
    let actionClasses = await Promise.all(fs.readdirSync(actionClassesPath).filter(file => file.endsWith(".js")).map(file => import("file://" + path.join(actionClassesPath, file)).catch(() => {})))
    let extensionClasses = await Promise.all(fs.readdirSync(extensionClassesPath).filter(file => file.endsWith(".js")).map(file => import("file://" + path.join(extensionClassesPath, file)).catch(() => {})))
    triggerClasses = triggerClasses.filter(m => m).map(m => m.default).map(trigger => ({type: trigger.type, variableTypes: trigger.variableTypes, html:trigger.html, open: trigger.open?.toString()}))
    actionClasses = actionClasses.filter(m => m).map(m => m.default).map(action => ({type: action.type, title:action.title.toString(),variableTypes: action.variableTypes, html: action.html, open: action.open?.toString()}))
    extensionClasses = extensionClasses.filter(m => m).map(m => m.default).map(extension => ({type: extension.type, html: extension.html, open: extension.open?.toString()}))
    console.log(JSON.stringify({type:"triggers", data:triggerClasses}))
    console.log(JSON.stringify({type:"actions", data:actionClasses}))
    console.log(JSON.stringify({type:"extensions", data:extensionClasses}))
})()