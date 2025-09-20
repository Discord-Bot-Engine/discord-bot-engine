import {execSync} from 'child_process';
export default class PackageManager {
    static type = "Package Manager"
    static html = `
            <dbe-list name="packages" title="Packages" modalId="packagesModal" itemTitle="(item, i) => item.data.get('name') ?? ('Package #'+i)"></dbe-list>
            <div id="packagesModal">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Name"></dbe-label>
                    <dbe-input name="name" class="col-span-3"></dbe-input>
                </div>
            </div>
    `
    static load(context) {
        context.data.get("packages")?.forEach(async module => {
            const name = module.data.get("name")
            try {
                await import(name);
            } catch (e) {
                console.log(`Installing ${name} module...`);
                execSync(`npm install ${name}`, {
                    stdio: [0, 1, 2],
                });
                console.log(`A restart might be required in order to finish installing this module!`);
            }
        });
    }
}