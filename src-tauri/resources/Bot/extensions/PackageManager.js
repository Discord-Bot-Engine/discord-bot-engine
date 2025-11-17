import {execSync} from 'child_process';
import { parse } from "acorn";
import path from "node:path";
import fs from "node:fs";
import {__dirname, Bot} from "../classes/Bot.js";

export default class PackageManager {
    static type = "Package Manager"
    static html = `
            <dbe-list name="packages" title="Packages" modalId="packagesModal" itemTitle="(item, i) => item.data.get('name') ?? ('Package #'+i)"></dbe-list>
            <template id="packagesModal">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Name"></dbe-label>
                    <dbe-input name="name" class="col-span-3"></dbe-input>
                </div>
            </template>
    `
    static load(context) {
        const triggerClassesPath = path.resolve(__dirname, "../triggers")
        const actionClassesPath = path.resolve(__dirname, "../actions")
        const extensionClassesPath = path.resolve(__dirname, "../extensions")
        const triggersFolder = fs.readdirSync(triggerClassesPath).filter(file => file.endsWith(".js"))
        const actionsFolder = fs.readdirSync(actionClassesPath).filter(file => file.endsWith(".js"))
        const extensionsFolder = fs.readdirSync(extensionClassesPath).filter(file => file.endsWith(".js"))
        let imports = [];
        triggersFolder.forEach((file) => {
            const contents = fs.readFileSync(path.join(triggerClassesPath, file), "utf8")
            const ast = parse(contents, { sourceType: "module", ecmaVersion: "latest" });
            for (const node of ast.body) {
                if (node.type === "ImportDeclaration") {
                    imports.push(node.source.value);
                }
            }
        })
        actionsFolder.forEach((file) => {
            const contents = fs.readFileSync(path.join(actionClassesPath, file), "utf8")
            const ast = parse(contents, { sourceType: "module", ecmaVersion: "latest" });
            for (const node of ast.body) {
                if (node.type === "ImportDeclaration") {
                    imports.push(node.source.value);
                }
            }
        })
        extensionsFolder.forEach((file) => {
            const contents = fs.readFileSync(path.join(extensionClassesPath, file), "utf8")
            const ast = parse(contents, { sourceType: "module", ecmaVersion: "latest" });
            for (const node of ast.body) {
                if (node.type === "ImportDeclaration") {
                    imports.push(node.source.value);
                }
            }
        })
        imports = imports.filter(i => !i.startsWith("./") && !i.startsWith("../"))
        imports = imports.filter((imp, i) => imports.indexOf(imp) === i);
        imports.forEach(imp => install(imp))
        context?.data.get("packages")?.forEach(async module => {
            const name = module.data.get("name")
            await install(name)
        });
        async function install(name) {
            const npm = Bot.npm ? `"${Bot.npm}"` : "npm";
            try {
                await import(name);
            } catch (e) {
                console.log(`Installing ${name} module...`);
                execSync(`${npm} install ${name}`, {
                    stdio: 'pipe',
                    cwd: __dirname
                });
                console.log(`A restart might be required in order to finish installing this module!`);
            }
        }
    }
}