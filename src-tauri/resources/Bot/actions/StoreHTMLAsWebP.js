import puppeteer from "puppeteer";
import {spawn} from "child_process"
import ffmpegPath from "ffmpeg-static"
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import {PassThrough} from 'stream';

export default class StoreHTMLAsWebP {
    static type = "Store HTML As WebP";
    static title(data) {
        return `Store ${data.get("html").split("\n").length} HTML lines`;
    }
    static variableTypes = ["Buffer"];
    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="HTML"></dbe-label>
        <dbe-input name="html" multiline={true} class="col-span-3" onChange="(v) => document.getElementById('preview').innerHTML = v"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Width"></dbe-label>
        <dbe-input name="width" class="col-span-3" onChange="(v) => document.getElementById('preview').style.width = v + 'px'" value="100"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Height"></dbe-label>
        <dbe-input name="height" class="col-span-3" onChange="(v) => document.getElementById('preview').style.height = v + 'px'" value="100"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Duration in seconds"></dbe-label>
        <dbe-input name="duration" class="col-span-3" value="1"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Store webp buffer in variable"></dbe-label>
        <dbe-variable-list name="value" class="col-span-3" variableType="Buffer"></dbe-variable-list>
    </div>
    <div style="overflow:auto">
        <dbe-label>Preview</dbe-label>
        <div id="preview" class="border overflow-hidden"></div>
    </div>
    `;
    static load(context) {}

    static async run({ data, actionManager }) {
        const width = Number(data.get("width"));
        const height = Number(data.get("height"));
        const duration = Number(data.get("duration"));
        const value = data.get("value");
        const html = data.get("html");
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
            actionManager.setVariable(value, buffer);
            actionManager.runNext();
        }, duration * 1000)
        async function mp4BufferToWebP(mp4Buffer) {
            return new Promise((resolve, reject) => {
                const args = [
                    "-loglevel", "error",
                    "-i", "pipe:0",
                    "-an",
                    "-vsync", "0",
                    "-vf", `fps=60`,
                    "-c:v", "libwebp_anim",
                    "-lossless", "0",
                    "-q:v", "80",
                    "-preset", "default",
                    "-loop", "0",
                    "-f", "webp",
                    "pipe:1"
                ];


                const ffmpeg = spawn(ffmpegPath, args);

                const chunks = [];
                ffmpeg.stdout.on("data", (chunk) => chunks.push(chunk));
                ffmpeg.stderr.on("data", (err) => console.error("ffmpeg:", err.toString()));

                ffmpeg.on("close", (code) => {
                    if (code === 0) {
                        resolve(Buffer.concat(chunks));
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
