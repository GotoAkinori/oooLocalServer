import * as http from 'http';
import * as config_common from '../config/common.json';
import { addFile, closeFile, loadFile, saveFile } from './server_file';
import { staticFile } from './server_static';

const server = http.createServer((req, res) => {
    if (req.url) {
        const [urlPart, queryPart] = req.url.split("?");
        const urlPath = urlPart.split("/");
        let query: { [key: string]: string } = {};
        if (queryPart) {
            for (let [key, value] of queryPart.split("&").map(v => v.split("="))) {
                query[key] = decodeURIComponent(value);
            }
        }

        while (urlPath[0] == "" || urlPath[0] == ".") {
            urlPath.shift();
        }

        if (urlPath[0] == "command" && urlPath[1] == "add-file") {
            addFile(req, res, query);
        } else if (urlPath[0] == "command" && urlPath[1] == "load") {
            loadFile(req, res, query);
        } else if (urlPath[0] == "command" && urlPath[1] == "save") {
            saveFile(req, res, query);
        } else if (urlPath[0] == "command" && urlPath[1] == "close") {
            if (closeFile(req, res, query) == false) {
                process.exit(0);
            }
        } else {
            staticFile(req, res, query);
        }
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server is aliving');
    }
});

export function startServer(): Promise<void> {
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

