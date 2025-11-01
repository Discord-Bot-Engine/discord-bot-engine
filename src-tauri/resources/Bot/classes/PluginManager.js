import path from "node:path";
import { parse } from "acorn";
import * as fs from "node:fs";
import { __dirname } from "./Bot.js";
import { execSync } from "child_process";

(async () => {
    const triggerClassesPath = path.resolve(__dirname, "../triggers");
    const actionClassesPath = path.resolve(__dirname, "../actions");
    const extensionClassesPath = path.resolve(__dirname, "../extensions");

    const triggersFolder = fs.readdirSync(triggerClassesPath).filter((file) => file.endsWith(".js"));
    const actionsFolder = fs.readdirSync(actionClassesPath).filter((file) => file.endsWith(".js"));
    const extensionsFolder = fs.readdirSync(extensionClassesPath).filter((file) => file.endsWith(".js"));
    let imports = [];
    triggersFolder.forEach((file) => {
        const contents = fs.readFileSync(
            path.join(triggerClassesPath, file),
            "utf8"
        );
        const ast = parse(contents, {
            sourceType: "module",
            ecmaVersion: "latest",
        });
        for (const node of ast.body) {
            if (node.type === "ImportDeclaration") {
                imports.push(node.source.value);
            }
        }
    });
    actionsFolder.forEach((file) => {
        const contents = fs.readFileSync(
            path.join(actionClassesPath, file),
            "utf8"
        );
        const ast = parse(contents, {
            sourceType: "module",
            ecmaVersion: "latest",
        });
        for (const node of ast.body) {
            if (node.type === "ImportDeclaration") {
                imports.push(node.source.value);
            }
        }
    });
    extensionsFolder.forEach((file) => {
        const contents = fs.readFileSync(
            path.join(extensionClassesPath, file),
            "utf8"
        );
        const ast = parse(contents, {
            sourceType: "module",
            ecmaVersion: "latest",
        });
        for (const node of ast.body) {
            if (node.type === "ImportDeclaration") {
                imports.push(node.source.value);
            }
        }
    });
    imports = imports.filter((i) => !i.startsWith("./") && !i.startsWith("../"));
    imports = imports.filter((imp, i) => imports.indexOf(imp) === i);
    let rerun = false;
    for (const imp of imports) {
        await install(imp);
    }
    if (rerun) return console.log("RERUN");
    async function install(name) {
        try {
            await import(name);
        } catch (e) {
            rerun = true;
            execSync(`npm install ${name}`, {
                stdio: "ignore",
                cwd: __dirname,
            });
        }
    }
    let triggerClasses = await Promise.all(
        triggersFolder.map(async (file) => ({
            file,
            content: await import("file://" + path.join(triggerClassesPath, file)).catch(() => {}),
        }))
      );
    let actionClasses = await Promise.all(
        actionsFolder.map(async (file) => ({
            file,
            content: await import("file://" + path.join(actionClassesPath, file)).catch(() => {}),
        }))
    );
    let extensionClasses = await Promise.all(
        extensionsFolder.map(async (file) => ({
            file,
            content: await import("file://" + path.join(extensionClassesPath, file)).catch(() => {}),
        }))
    );

    triggerClasses = triggerClasses
        .filter((m) => m.content)
        .map((trigger) => ({
            ...trigger.content.default,
            open: trigger.content.default.open?.toString(),
            close: trigger.content.default.close?.toString(),
            file: trigger.file,
        }));
    actionClasses = actionClasses
        .filter((m) => m.content)
        .map((action) => ({
            ...action.content.default,
            open: action.content.default.open?.toString(),
            close: action.content.default.close?.toString(),
            file: action.file,
        }));
    extensionClasses = extensionClasses
        .filter((m) => m.content)
        .map((extension) => ({
            ...extension.content.default,
            open: extension.content.default.open?.toString(),
            close: extension.content.default.close?.toString(),
            file: extension.file,
        }));
    console.log(JSON.stringify({ type: "triggers", data: triggerClasses }));
    console.log(JSON.stringify({ type: "actions", data: actionClasses }));
    console.log(JSON.stringify({ type: "extensions", data: extensionClasses }));
})();
