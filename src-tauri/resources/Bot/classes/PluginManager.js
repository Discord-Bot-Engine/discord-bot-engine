import path from "node:path";
import { parse } from "acorn";
import * as fs from "node:fs";
import { __dirname } from "./Bot.js";
import { execSync } from "child_process";

(async () => {
    const triggerClassesPath = path.resolve(__dirname, "../triggers");
    const actionClassesPath = path.resolve(__dirname, "../actions");
    const extensionClassesPath = path.resolve(__dirname, "../extensions");

    const triggersFolder = fs.promises.readdir(triggerClassesPath);
    const actionsFolder = fs.promises.readdir(actionClassesPath);
    const extensionsFolder = fs.promises.readdir(extensionClassesPath);
    let imports = [];
    let triggerContents = Promise.all(
        (await triggersFolder)
            .filter((file) => file.endsWith(".js"))
            .map((f) =>
                fs.promises.readFile(path.join(triggerClassesPath, f), "utf8"),
            ),
    );
    let actionContents = Promise.all(
        (await actionsFolder)
            .filter((file) => file.endsWith(".js"))
            .map((f) =>
                fs.promises.readFile(path.join(actionClassesPath, f), "utf8"),
            ),
    );
    let extensionContents = Promise.all(
        (await extensionsFolder)
            .filter((file) => file.endsWith(".js"))
            .map((f) =>
                fs.promises.readFile(path.join(extensionClassesPath, f), "utf8"),
            ),
    );
    (await triggerContents).forEach((contents) => {
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
    (await actionContents).forEach((contents) => {
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
    (await extensionContents).forEach((contents) => {
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
        const npm = process.argv[3] ? `"${process.argv[3]}"` : "npm";
        try {
            await import(name);
        } catch (e) {
            rerun = true;
            execSync(`${npm} install ${name}`, {
                stdio: "ignore",
                cwd: __dirname,
            });
        }
    }
    let triggerClasses = await Promise.all(
        (await triggersFolder).map(async (file) => ({
            file,
            content: await import(
            "file://" + path.join(triggerClassesPath, file)
                ).catch(() => {}),
        })),
    );
    let actionClasses = await Promise.all(
        (await actionsFolder).map(async (file) => ({
            file,
            content: await import(
            "file://" + path.join(actionClassesPath, file)
                ).catch(() => {}),
        })),
    );
    let extensionClasses = await Promise.all(
        (await extensionsFolder).map(async (file) => ({
            file,
            content: await import(
            "file://" + path.join(extensionClassesPath, file)
                ).catch(() => {}),
        })),
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
