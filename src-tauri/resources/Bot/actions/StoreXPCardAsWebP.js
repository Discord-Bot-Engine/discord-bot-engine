import puppeteer from "puppeteer";
import {spawn} from "child_process"
import ffmpegPath from "ffmpeg-static"
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import {PassThrough} from 'stream';
import fs from "fs"
import tmp from "tmp"
import {Bot} from "../classes/Bot.js";
export default class StoreXPCardAsWebP {
    static type = "Store XP Card As WebP";
    static title(data) {
        return `Store "${data.get("member")}" XP Card`;
    }
    static variableTypes = ["Buffer", "Member"];
    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Member"></dbe-label>
        <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="XP Member Data Field"></dbe-label>
        <dbe-input name="xp" class="col-span-3" value="XP"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Max XP Member Data Field"></dbe-label>
        <dbe-input name="maxxp" class="col-span-3" value="MAX_XP"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Level Member Data Field"></dbe-label>
        <dbe-input name="level" class="col-span-3" value="LEVEL"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Store webp buffer in variable"></dbe-label>
        <dbe-variable-list name="value" class="col-span-3" variableType="Buffer"></dbe-variable-list>
    </div>
    `;
    static load(context) {}

    static async run({ data, actionManager, getVariable, setVariable }) {
        const member = getVariable(data.get("member"));
        const xp = await Bot.getData(`${member.id}${member.guild.id}${data.get("xp")}`);
        const maxXp = await Bot.getData(`${member.id}${member.guild.id}${data.get("maxXp")}`);
        const level = await Bot.getData(`${member.id}${member.guild.id}${data.get("level")}`);
        const html = `
    <style>
        :root{
            --w: 100%;
            --h: 100%;
            --bg: linear-gradient(135deg,#0f1724 0%, #111827 100%);
            --muted: rgba(255,255,255,0.55);
            --accent-start: #6ee7b7;
            --accent-end: #60a5fa;
            --radius: 14px;
            --shadow: 0 8px 30px rgba(2,6,23,0.6);
            --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .xp-card{
            width: var(--w);
            height: var(--h);
            font-family: var(--font-sans);
            position: relative;
            border-radius: var(--radius);
            background: var(--bg);
            padding: 18px;
            box-sizing: border-box;
            color: #fff;
            box-shadow: var(--shadow);
            overflow: hidden;
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .xp-panel{
            position: absolute;
            inset: 8px;
            border-radius: calc(var(--radius) - 4px);
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            pointer-events: none;
        }

        .avatar-wrap{
            width: 124px;
            height: 124px;
            min-width: 124px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            box-sizing: border-box;
            z-index: 2;
        }

        .avatar{
            width: 110px;
            height: 110px;
            border-radius: 50%;
            overflow: hidden;
            display:block;
            border: 3px solid rgba(255,255,255,0.06);
            box-shadow: 0 6px 18px rgba(2,6,23,0.6), inset 0 2px 6px rgba(255,255,255,0.02);
            background: linear-gradient(180deg,#111 0%, #222 100%);
        }

        .avatar img{
            width:100%;
            height:100%;
            object-fit:cover;
            display:block;
            background-color: #5865F2; /* Discord blurple behind fallback */
        }

        .content{
            flex: 1;
            display:flex;
            flex-direction: column;
            justify-content: center;
            gap: 10px;
            z-index:2;
        }

        .top-row{
            display:flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .display-name{
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.2px;
            display:flex;
            align-items:center;
            gap:8px;
        }

        .level-badge{
            background: rgba(255,255,255,0.07);
            padding: 8px 12px;
            border-radius: 999px;
            font-weight: 800;
            min-width: 64px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            font-size: 14px;
            color: white;
        }

        .xp-wrap{ margin-top:6px; }

        .xp-bar{
            width: 100%;
            height: 28px;
            background: rgba(255,255,255,0.07);
            border-radius: 999px;
            padding: 2px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.07);
        }

        .xp-fill{
            height: 100%;
            width: 0%;
            border-radius: 999px;
            background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
            display:flex;
            align-items:center;
            justify-content:flex-end;
            padding-right: 14px;
            box-sizing:border-box;
            box-shadow: 0 6px 18px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
            transition: width 1.25s cubic-bezier(.22,.9,.32,1);
        }

        .xp-fill::after{
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01) 30%, rgba(255,255,255,0.06) 70%);
            opacity: 0.55;
            transform: translateX(0%);
            mix-blend-mode: overlay;
            pointer-events: none;
        }

        .xp-text, .xp-right{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-weight: 700;
            font-size: 12px;
            color: rgba(255,255,255,0.95);
            text-shadow: 0 1px 0 rgba(0,0,0,0.6);
            z-index: 3;
        }
        .xp-text{ left: 12px; }
        .xp-right{ right: 12px; }

        .meta-row{
            display:flex;
            justify-content:flex-end;
            align-items:center;
            color: var(--muted);
            font-size: 12px;
            margin-top: 8px;
        }
    </style>

<div class="xp-card">
    <div class="xp-panel"></div>

    <div class="avatar-wrap">
        <div class="avatar">
            <img id="avatar-img" alt="User avatar"
                 src=""
                 onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg';" />
        </div>
    </div>

    <div class="content">
        <div class="top-row">
            <div style="display:flex;flex-direction:column;">
                <div class="display-name" id="displayName">{avatar}</div>
                <div style="color:var(--muted); font-size:13px; margin-top:6px;" id="subtitle">{member} • {joinDate}</div>
            </div>
            <div><div class="level-badge" id="levelBadge">Lv. {level}</div></div>
        </div>

        <div class="xp-wrap">
            <div class="xp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <div class="xp-fill" id="xpFill" style="width:0%"></div>
                <div class="xp-text" id="xpLeft">{xp} XP</div>
                <div class="xp-right" id="xpRight">{xp} / {maxXp}</div>
            </div>
            <div class="meta-row">
                <div id="nextLevelText">{maxXp - xp} XP to next level</div>
            </div>
        </div>
    </div>
</div>

<script>
    const user = {
        avatar: "${member.displayAvatarURL()}",
        displayName: "${member.displayName.replaceAll("\"", "\\\"")}",
        xp: ${xp},
        maxXp: ${maxXp},
        level: ${level},
        joined: "${member.joinedAt}"
    };

    function setUpCard(u){
        const avatarImg = document.getElementById("avatar-img");
        avatarImg.src = u.avatar || "https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg";

        document.getElementById("displayName").childNodes[0].nodeValue = u.displayName;
        document.getElementById("levelBadge").textContent = "Lv. " + (u.level ?? "1");
        document.getElementById("xpRight").textContent = \`\${u.xp} / \${u.maxXp}\`;
        document.getElementById("xpLeft").textContent = \`\${u.xp} XP\`;
        document.getElementById("subtitle").textContent = u.joined || "";

        const xpFill = document.getElementById("xpFill");
        const pct = Math.max(0, Math.min(100, Math.round((Number(u.xp) / Number(u.maxXp || 1)) * 100)));
        xpFill.style.width = "0%";
        requestAnimationFrame(() => setTimeout(() => xpFill.style.width = pct + "%", 100));

        const remaining = Math.max(0, Number(u.maxXp || 0) - Number(u.xp || 0));
        document.getElementById("nextLevelText").textContent = \`\${remaining} XP to next level\`;
    }

    setUpCard(user);
</script>`
        const width = 500;
        const height = 200;
        const duration = 3;
        const value = data.get("value");
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.setViewport({ width, height });
        const recorder = new PuppeteerScreenRecorder(page, {
            fps:60,
            "format": "png",
            "videoCodec": "png",
            "videoPixelFormat": "rgba"
        });
        await page.setContent(`  <html>
    <head>
      <style>
        * {
            box-sizing: border-box;
        }
        body {
          overflow:hidden;
          margin:0;
          width: ${width}px;
          height: ${height}px;
          color:white;
        }
      </style>
    </head>
    <body>${html}</body>
  </html>`, { waitUntil: "networkidle0" });
        const pipeStream = new PassThrough();
        const bytes = []
        pipeStream.on("data", (data) => {
            bytes.push(data);
        })
        const client = await page.target().createCDPSession();
        await client.send("Emulation.setDefaultBackgroundColorOverride", {
            color: { r: 0, g: 0, b: 0, a: 0 },
        });
        await recorder.startStream(pipeStream);
        setTimeout(async () => {
            await recorder.stop()
            await browser.close()
            const buffer = await mp4BufferToWebP(Buffer.concat(bytes))
            setVariable(value, buffer);
            actionManager.runNext();
        }, duration * 1000)
        async function mp4BufferToWebP(mp4Buffer) {
            return new Promise((resolve, reject) => {
                const outputPath = tmp.tmpNameSync({ postfix: ".webp" });
                const args = [
                    "-loglevel", "error",
                    "-i", "pipe:0",
                    "-an",
                    "-vsync", "0",
                    "-vf", `fps=60`,
                    "-c:v", "libwebp",
                    "-lossless", "0",
                    "-q:v", "80",
                    "-preset", "default",
                    "-loop", "0",
                    outputPath
                ];

                const ffmpeg = spawn(ffmpegPath, args);

                ffmpeg.on("close", (code) => {
                    if (code === 0) {
                        resolve(fs.readFileSync(outputPath));
                        fs.unlinkSync(outputPath);
                    } else {
                        reject(new Error(`FFmpeg failed with code ${code}`));
                    }
                });

                ffmpeg.stdin.write(mp4Buffer);
                ffmpeg.stdin.end();
            });
        }
    }
}
