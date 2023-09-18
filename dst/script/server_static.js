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
exports.staticFile = void 0;
const fs = __importStar(require("fs/promises"));
const config_common = __importStar(require("../config/common.json"));
const server_applications = __importStar(require("./server_applications"));
const path = __importStar(require("path"));
function staticFile(req, res, query) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let filePath = "";
        let extension = "";
        if (req.url) {
            filePath = server_applications.getStaticFilepath(req.url);
            extension = path.extname(filePath);
        }
        if (filePath) {
            let content = yield fs.readFile(filePath);
            res.writeHead(200, {
                'Content-Type': (_a = config_common.mime[extension]) !== null && _a !== void 0 ? _a : "application/octet-stream"
            });
            res.end(content);
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });
}
exports.staticFile = staticFile;
//# sourceMappingURL=server_static.js.map