"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http = __importStar(require("http"));
const config_common = __importStar(require("../config/common.json"));
const server_file_1 = require("./server_file");
const server_static_1 = require("./server_static");
const exception_1 = require("./exception");
const server = http.createServer((req, res) => {
    try {
        if (req.url) {
            const [urlPart, queryPart] = req.url.split("?");
            const urlPath = urlPart.split("/");
            let query = {};
            if (queryPart) {
                for (let [key, value] of queryPart.split("&").map(v => v.split("="))) {
                    query[key] = decodeURIComponent(value);
                }
            }
            while (urlPath[0] == "" || urlPath[0] == ".") {
                urlPath.shift();
            }
            if (urlPath[0] == "command" && urlPath[1] == "add-file") {
                (0, server_file_1.addFile)(req, res, query);
            }
            else if (urlPath[0] == "command" && urlPath[1] == "load") {
                (0, server_file_1.loadFile)(req, res, query);
            }
            else if (urlPath[0] == "command" && urlPath[1] == "save") {
                (0, server_file_1.saveFile)(req, res, query);
            }
            else if (urlPath[0] == "command" && urlPath[1] == "close") {
                if ((0, server_file_1.closeFile)(req, res, query) == false) {
                    process.exit(0);
                }
            }
            else {
                (0, server_static_1.staticFile)(req, res, query);
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Server is aliving');
        }
    }
    catch (exception) {
        if (exception instanceof exception_1.ServerException) {
            console.error("[" + exception.code + "] " + exception.message);
            res.writeHead(exception.code);
            res.end();
        }
    }
});
function startServer() {
    return new Promise((res, rej) => {
        server.listen(config_common.port);
        server.on("listening", () => {
            console.log("Server start");
            res();
        });
        server.on("error", (err) => {
            console.log("ERROR");
            rej(err);
        });
    });
}
exports.startServer = startServer;
//# sourceMappingURL=server.js.map