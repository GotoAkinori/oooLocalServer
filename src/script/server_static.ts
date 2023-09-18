import * as http from 'http';
import * as fs from 'fs/promises';
import * as config_common from '../config/common.json';
import * as server_applications from './server_applications';
import * as path from 'path';

export async function staticFile(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    query: { [key: string]: string }
) {
    let filePath = "";
    let extension = "";

    if (req.url) {
        filePath = server_applications.getStaticFilepath(req.url);
        extension = path.extname(filePath);
    }

    if (filePath) {
        let content = await fs.readFile(filePath);
        res.writeHead(200, {
            'Content-Type': (config_common.mime as any)[extension] ?? "application/octet-stream"
        });
        res.end(content);
    } else {
        res.writeHead(404);
        res.end();
    }
}
