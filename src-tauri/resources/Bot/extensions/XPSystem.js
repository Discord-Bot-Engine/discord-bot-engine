import {Bot} from "../classes/Bot.js"
import {Events} from "discord.js";
export default class XPSystem {
    static type = "XP System";
    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Is enabled?"></dbe-label>
        <dbe-select name="enable" class="col-span-3" value="False" values="True,False"></dbe-select>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="XP member data field"></dbe-label>
        <dbe-input name="xp" class="col-span-3" value="XP"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Max XP member data field"></dbe-label>
        <dbe-input name="maxxp" class="col-span-3" value="MAX_XP"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Level member data field"></dbe-label>
        <dbe-input name="level" class="col-span-3" value="LEVEL"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Max XP multiplier"></dbe-label>
        <dbe-input name="maxxpmulti" class="col-span-3" value="1.5"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="XP multiplier"></dbe-label>
        <dbe-input name="xpmulti" class="col-span-3" value="1"></dbe-input>
    </div>
    `
    static load(context) {
        const enabled = context.data.get("enable") === "True";
        if(!enabled) return;
        const xpf = context.data.get("xp");
        const maxxpf = context.data.get("maxxp");
        const levelf = context.data.get("level");
        const maxxpmulti = Number(context.data.get("maxxpmulti"));
        const xpmulti = Number(context.data.get("xpmulti"));
        Bot.client.on(Events.MessageCreate, async msg => {
            if(!msg.guild) return;
            const disabled = await Bot.getData(`$XPSYSTEM$$$${msg.guild.id}`)
            if(disabled) return;
            const member = msg.member.id;
            const guild = msg.guild.id;
            const xp = await Bot.getData(`${member}${guild}${xpf}`) ?? 0
            const maxxp = await Bot.getData(`${member}${guild}${maxxpf}`) ?? 100
            const level = await Bot.getData(`${member}${guild}${levelf}`) ?? 1
            const xpvalue = (Math.floor(Math.random() * (50 - 20 + 1)) + 20) * xpmulti;
            let currentxp = Number(xp) + xpvalue
            let currentlevel = Number(level);
            let currentmaxxp = Number(maxxp);
            if(currentxp >= Number(maxxp)) {
                currentxp = 0;
                currentlevel = Number(level) + 1;
                currentmaxxp = Math.round(Number(maxxp) * maxxpmulti);
                Bot.client.emit("levelUp", msg, currentlevel)
            }
            await Bot.setData(`${member}${guild}${levelf}`, currentlevel)
            await Bot.setData(`${member}${guild}${maxxpf}`, currentmaxxp)
            await Bot.setData(`${member}${guild}${xpf}`, currentxp)
        })
    }
}