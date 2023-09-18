import * as http from 'http';
import * as fs from 'fs/promises';

const target_files: string[] = [];

// -- URL
// /command/add-file
// -- RETURN
// {
//    no: <file ID number>
// }
export function addFile(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    query: { [key: string]: string }
) {
    if (query.file) {
        target_files.push(query.file);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            no: target_files.length - 1
        }));
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            no: -1
        }));
    }
}

// -- URL
// /command/load?id=<file ID>
// -- RETURN
// file data
export async function loadFile(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    query: { [key: string]: string }
) {
    let id: number = Number(query.id);

    if (id >= 0) {
        try {
            let filePath = target_files[id];
            let content = await fs.readFile(filePath);
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            res.end(content);
        } catch (ex) {
            console.log(ex);
            res.writeHead(404);
            res.end(ex);
        }
    }
}


// -- URL
// /command/save?id=<file ID>
// -- RETURN
// file data
export async function saveFile(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    query: { [key: string]: string }
) {
    let id: number = Number(query.id);

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
            req.on("end", async () => {
                await fs.writeFile(filePath, content);
                res.writeHead(200, {});
                res.end();
            });
        } catch (ex) {
            console.log(ex);
            res.writeHead(404);
            res.end(ex);
        }
    }
}


// -- URL
// /command/save?id=<file ID>
// -- RETURN
// file data
export function closeFile(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    query: { [key: string]: string }
): boolean {
    let id: number = Number(query.id);
    delete target_files[id];

    // return true if one or more files are opened, return false if all files are closed.
    return target_files.some(v => v);
}

