import path from "node:path"
import * as fs from "node:fs";
import {__dirname} from "./Bot.js";

(async () => {
    const triggerClassesPath = path.resolve(__dirname, "../triggers")
    const actionClassesPath = path.resolve(__dirname, "../actions")
    const extensionClassesPath = path.resolve(__dirname, "../extensions")

    const triggersFolder = fs.readdirSync(triggerClassesPath).filter(file => file.endsWith(".js"))
    const actionsFolder = fs.readdirSync(actionClassesPath).filter(file => file.endsWith(".js"))
    const extensionsFolder = fs.readdirSync(extensionClassesPath).filter(file => file.endsWith(".js"))

    let triggerClasses = await Promise.all(
        triggersFolder.map(file =>
            ({
                file,
                content: import("file://" + path.join(triggerClassesPath, file)).catch(() => {})
            })
        )
    )
    let actionClasses = await Promise.all(
        actionsFolder.map(file =>
            ({
                file,
                content: import("file://" + path.join(actionClassesPath, file)).catch(() => {})
            })
        )
    )
    let extensionClasses = await Promise.all(
        extensionsFolder.map(file =>
            ({
                file,
                content: import("file://" + path.join(extensionClassesPath, file)).catch(() => {})
            })
        )
    )

    triggerClasses = triggerClasses.filter(m => m).map(trigger => ({
        type: trigger.content.default.type,
        variableTypes: trigger.content.default.variableTypes,
        html: trigger.content.default.html,
        open: trigger.content.default.open?.toString(),
        file: trigger.file
    }))
    actionClasses = actionClasses.filter(m => m).map(action => ({
        type: action.content.default.type,
        title: action.content.default.title.toString(),
        variableTypes: action.content.default.variableTypes,
        html: action.content.default.html,
        open: action.content.default.open?.toString(),
        file: action.file
    }))
    extensionClasses = extensionClasses.filter(m => m).map(extension => ({
        type: extension.content.default.type,
        html: extension.content.default.html,
        open: extension.content.default.open?.toString(),
        file: extension.file
    }))

    console.log(JSON.stringify({ type:"triggers", data: triggerClasses }))
    console.log(JSON.stringify({ type:"actions", data: actionClasses }))
    console.log(JSON.stringify({ type:"extensions", data: extensionClasses }))
})()