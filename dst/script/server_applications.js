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
exports.getStaticFilepath = exports.getConfig = exports.init = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const applications = {};
const fileMap = [];
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let files = (yield fs.readdir(path.join(__dirname, "../config/applications")))
            .filter(v => v.endsWith(".json"));
        for (let file of files) {
            let name = file.substring(0, file.length - 5); // remove extension (".json")
            let config = JSON.parse((yield fs.readFile(path.join(__dirname, "../config/applications", file))).toString());
            applications[name] = config;
            for (let fileMapItem of config.static_files) {
                fileMap.push(fileMapItem);
            }
        }
    });
}
exports.init = init;
function getConfig(name) {
    return applications[name];
}
exports.getConfig = getConfig;
function getStaticFilepath(url) {
    for (let fileMapItem of fileMap) {
        if (url.startsWith(fileMapItem.url)) {
            return path.join(fileMapItem.path, url.substring(fileMapItem.url.length).split("?")[0]);
        }
    }
    throw "File not found";
}
exports.getStaticFilepath = getStaticFilepath;
//# sourceMappingURL=server_applications.js.map