import puppeteer from "puppeteer";
import {spawn} from "child_process"
import ffmpegPath from "ffmpeg-static"
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import {PassThrough} from 'stream';
import fs from "fs"
import tmp from "tmp"
import { JSDOM } from "jsdom"

export class ImageBuilder{
    tags = []
    background = ""
    width = 0
    height = 0
    duration = 0

    setBackground(background) {
        this.background = background;
        return this
    }

    setWidth(width) {
        this.width = width;
        return this
    }

    setHeight(height) {
        this.height = height;
        return this
    }

    addTags(...tags) {
        tags.forEach(tag => {
            this.tags.push(tag(new Tag()))
        })
        return this
    }

    build() {
        return new Promise(async (resolve, reject) => {
            const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
            const page = await browser.newPage();
            await page.setViewport({ width:this.width, height:this.height });
            const recorder = new PuppeteerScreenRecorder(page, {
                fps:60,
                "format": "png",
                "videoCodec": "png",
                "videoPixelFormat": "rgba"
            });
            await preparePageContent(page, this);
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
                resolve(buffer)
            }, this.duration * 1000)
        })
    }
}

class Tag{
    type = ""
    tags = []
    properties = new Map()

    addTags(...tags) {
        tags.forEach(tag => {
            this.tags.push(tag(new Tag()))
        })
        return this
    }

    addText(text) {
        this.tags.push(text);
        return this;
    }

    setType(type) {
        this.type = type;
        return this
    }

    setProperty(property, value) {
        this.properties.set(property, value)
        return this
    }

    build(dom) {
        const el = dom.createElement(this.type)
        this.properties.keys().forEach(key => {
            el.setAttribute(key, this.properties.get(key))
        })
        this.tags.forEach(tag => {
            if(tag.build)
                el.appendChild(tag.build(dom))
            else {
                const text = dom.createTextNode(tag)
                el.appendChild(text)
            }
        })
        return el;
    }
}

async function preparePageContent(page, {background, width, height, tags}) {
    const dom = new JSDOM();
    tags.forEach(tag => {
        dom.window.document.body.appendChild(tag.build(dom.window.document));
    })
    await page.setContent(`  <html>
    <head>
      <style>
        @keyframes fade {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes swipeLeft {
            0% {
                transform: translateX(-${width}px);
            }
            100% {
                transform: translateX(0px);
            }
        }
        @keyframes swipeRight {
            0% {
                transform: translateX(${width}px);
            }
            100% {
                transform: translateX(0px);
            }
        }
        @keyframes swipeTop {
            0% {
                transform: translateY(-${height}px);
            }
            100% {
                transform: translateY(0px);
            }
        }
        @keyframes swipeBottom {
            0% {
                transform: translateY(${height}px);
            }
            100% {
                transform: translateY(0px);
            }
        }
        @keyframes fillHorizontal {
            0% {
                transform: scaleX(0);
            }
            100% {
                transform: scaleX(1);
            }
        @keyframes fillVertical {
            0% {
                transform: scaleY(0);
            }
            100% {
                transform: scaleY(1);
            }
        @keyframes fill {
            0% {
                transform: scale(0);
            }
            100% {
                transform: scale(1);
            }
        * {
            box-sizing: border-box;
        }
        body {
          overflow:hidden;
          margin:0;
          width: ${width}px;
          height: ${height}px;
          color:white;
          background-image: url("${background}");
        }
      </style>
    </head>
    <body>${dom.window.document.body.innerHTML}</body>
  </html>`, { waitUntil: "networkidle0" });
}
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