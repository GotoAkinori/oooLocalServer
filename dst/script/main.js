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
const process = __importStar(require("process"));
const server_main = __importStar(require("./server"));
const config_common = __importStar(require("../config/common.json"));
const client = __importStar(require("./client"));
const child_process = __importStar(require("child_process"));
const server_applications = __importStar(require("./server_applications"));
// Argument
const procArg = {};
for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case "-f":
        case "--file":
            {
                i++;
                procArg.file = process.argv[i];
            }
            break;
        case "-a":
        case "--application":
            {
                i++;
                procArg.application = process.argv[i];
            }
            break;
    }
}
// Start Server
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield server_applications.init();
            yield server_main.startServer();
        }
        catch (ex) {
            if (ex.code != "EADDRINUSE") {
                console.error(ex);
            }
        }
        finally {
            if (procArg.file && procArg.application) {
                // configuration
                let config_application = server_applications.getConfig(procArg.application);
                // add file
                let data = yield client.getJson(`http://localhost:${config_common.port}/command/add-file?file=${encodeURIComponent(procArg.file)}&application=${procArg.application}`);
                // load file
                let url = config_application.launch;
                url = url.replace(/\{id\}/g, `${data.no}`);
                url = url.replace(/\{port\}/g, `${config_common.port}`);
                child_process.exec(`start ${url}`);
            }
        }
    });
})();
//# sourceMappingURL=main.js.map