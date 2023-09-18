"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFile = void 0;
const target_files = [];
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
            no: 0
        }));
    }
}
exports.addFile = addFile;
//# sourceMappingURL=file.js.map