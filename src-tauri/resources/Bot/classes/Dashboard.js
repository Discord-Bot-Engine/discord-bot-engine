import {Bot} from "./Bot.js";
import express from "express";
import session from "express-session";
import { handler } from "../dashboard/build/handler.js";
import settings from "../data/settings.json" with { type: "json" };
import dashboard from "../data/dashboard.json" with { type: "json" };
import * as fs from "node:fs";
import path from "node:path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
class DashboardClass {
    port = process.env.PORT ?? settings.port ?? 3000;
    app = express();
    inputs = dashboard.inputs;
    data = new Map()
    clientSecret = settings.clientSecret

    start() {
        this.loadFiles()
        this.setupHandlers()
        this.app.listen(this.port, () => {
            console.log(`Dashboard running on http://localhost:${this.port}`);
        });
    }

    loadFiles() {
        Object.keys(dashboard.data).forEach((server) => {
            const map = new Map()
            const inputs = dashboard.data[server];
            Object.keys(inputs).forEach((input) => {
                map.set(input, inputs[input]);
            })
            this.data.set(server, map);
        })
    }

    saveFiles() {
        const data = {}
        this.data.keys().forEach((server) => {
            const inputs = this.data.get(server);
            data[server] = {}
            inputs.keys().forEach((key) => {
                data[server][key] = inputs.get(key)
            })
        })
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        fs.writeFileSync(path.resolve(__dirname, "../data/dashboard.json"), JSON.stringify({inputs: this.inputs, data}))
    }

    addInput(name, page, type, value, values) {
        this.inputs.push({ name, page, type, value, values });
        this.saveFiles()
    }

    deleteInput(name) {
        this.inputs = this.inputs.filter(input => input.name !== name)
        this.data.keys().forEach(server => {
            if(this.data.has(server))
                this.data.get(server).delete(name)
        });
        this.saveFiles()
    }

    setInputValue(server, name, value) {
        if(!this.data.has(server)) this.data.set(server, new Map())
        this.data.get(server).set(name, value)
        this.saveFiles()
        Bot.client.emit("dashboardValueChange", server, name, value)
    }

    getInputValue(server, name) {
        if(!this.data.has(server)) this.data.set(server, new Map())
        if(!this.data.get(server).has(name)) this.data.get(server).set(name, this.inputs.find(i => i.name === name).value)
        return this.data.get(server).get(name);
    }

    setupHandlers() {
        this.app.use(session({
            secret: settings.clientSecret,
            resave: false,
            saveUninitialized: false
        }));
        this.app.use((req, res, next) => {
            req.bot = Bot;
            req.dashboard = this
            next();
        });
        this.app.use((req, res, next) => {
            if(req.path.startsWith('/guild/') || req.path.startsWith("/_app/") || req.path.startsWith("/auth/")|| req.path.startsWith("/admin/") || req.path === "/")
                handler(req,res,next)
            else {
                express.json()(req,res,next)
                Bot.client.emit("httpRequest", req, res)
            }
        });
    }
}

export const Dashboard = new DashboardClass();