import { Bot } from "../classes/Bot.js";
import AntiSpamClient from "discord-anti-spam";
import {Events, PermissionsBitField} from "discord.js";

export default class AutoModeration {
    static type = "Auto Moderation";

    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Is enabled?"></dbe-label>
        <dbe-select name="enabled" class="col-span-3" value="False" values="True,False"></dbe-select>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Warn threshold"></dbe-label>
        <dbe-input name="warnThreshold" class="col-span-3" value="3"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Mute threshold"></dbe-label>
        <dbe-input name="muteThreshold" class="col-span-3" value="6"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Kick threshold"></dbe-label>
        <dbe-input name="kickThreshold" class="col-span-3" value="9"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Ban threshold"></dbe-label>
        <dbe-input name="banThreshold" class="col-span-3" value="12"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Unmute time (minutes)"></dbe-label>
        <dbe-input name="unMuteTime" class="col-span-3" value="60"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Verbose logging?"></dbe-label>
        <dbe-select name="verbose" class="col-span-3" value="True" values="True,False"></dbe-select>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Remove messages?"></dbe-label>
        <dbe-select name="removeMessages" class="col-span-3" value="True" values="True,False"></dbe-select>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Warn message"></dbe-label>
        <dbe-input name="warnMessage" class="col-span-3" value="{@user}, stop spamming!"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Mute message"></dbe-label>
        <dbe-input name="muteMessage" class="col-span-3" value="You have been muted for spamming!"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Kick message"></dbe-label>
        <dbe-input name="kickMessage" class="col-span-3" value="You have been kicked for spamming!"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Ban message"></dbe-label>
        <dbe-input name="banMessage" class="col-span-3" value="You have been banned for spamming!"></dbe-input>
    </div>
    `;

    static load(context) {
        const enabled = context.data.get("enabled") === "True";
        if (!enabled) return;

        const options = {
            warnThreshold: Number(context.data.get("warnThreshold") ?? 3),
            muteThreshold: Number(context.data.get("muteThreshold") ?? 6),
            kickThreshold: Number(context.data.get("kickThreshold") ?? 9),
            banThreshold: Number(context.data.get("banThreshold") ?? 12),
            unMuteTime: Number(context.data.get("unMuteTime") ?? 60),
            verbose: true,
            removeMessages: context.data.get("removeMessages") === "True",
            warnMessage: context.data.get("warnMessage") ?? "{@user}, stop spamming!",
            muteMessage: context.data.get("muteMessage") ?? "You have been muted for spamming!",
            kickMessage: context.data.get("kickMessage") ?? "You have been kicked for spamming!",
            banMessage: context.data.get("banMessage") ?? "You have been banned for spamming!",
            ignoredPermissions: [PermissionsBitField.Flags.Administrator]
        };

        const antiSpam = new AntiSpamClient(options);

        Bot.client.on(Events.MessageCreate, async (msg) => {
            if(!msg.guild) return;
            const disabled = await Bot.getData(`$AUTOMOD$$$${msg.guild.id}`)
            if(disabled) return;
            antiSpam.message(msg);
        });

        Bot.client.on(Events.GuildMemberRemove, async (member) => {
            antiSpam.userleave(member);
        });
    }
}
