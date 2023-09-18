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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeFile = exports.saveFile = exports.loadFile = exports.addFile = void 0;
const fs = __importStar(require("fs/promises"));
const target_files = [];
// -- URL
// /command/add-file
// -- RETURN
// {
//    no: <file ID number>
// }
function addFile(req, res, query) {
    if (query.file) {
        target_files.push(query.file);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            no: target_files.length - 1
        }));
    }
    else {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            no: -1
        }));
    }
}
exports.addFile = addFile;
// -- URL
// /command/load?id=<file ID>
// -- RETURN
// file data
function loadFile(req, res, query) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = Number(query.id);
        if (id >= 0) {
            try {
                let filePath = target_files[id];
                let content = yield fs.readFile(filePath);
                res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                res.end(content);
            }
            catch (ex) {
                console.log(ex);
                res.writeHead(404);
                res.end(ex);
            }
        }
    });
}
exports.loadFile = loadFile;
// -- URL
// /command/save?id=<file ID>
// -- RETURN
// file data
function saveFile(req, res, query) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = Number(query.id);
        if (id >= 0) {
            try {
                let filePath = target_files[id];
                let content = new Uint8Array();
                req.on("data", (data) => {
                    content = Buffer.concat([content, data]);
                });
                req.on("error", (err) => {
                    throw err;
                });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    yield fs.writeFile(filePath, content);
                    res.writeHead(200, {});
                    res.end();
                }));
            }
            catch (ex) {
                console.log(ex);
                res.writeHead(404);
                res.end(ex);
            }
        }
    });
}
exports.saveFile = saveFile;
// -- URL
// /command/save?id=<file ID>
// -- RETURN
// file data
function closeFile(req, res, query) {
    let id = Number(query.id);
    delete target_files[id];
    // return true if one or more files are opened, return false if all files are closed.
    return target_files.some(v => v);
}
exports.closeFile = closeFile;
//# sourceMappingURL=server_file.js.map