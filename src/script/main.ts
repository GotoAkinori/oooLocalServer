import * as process from 'process';
import * as server_main from './server';
import * as config_common from '../config/common.json';
import * as client from './client';
import * as child_process from 'child_process';
import * as server_applications from './server_applications';

// Argument
const procArg: { [key: string]: (string | boolean) } = {};
for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case "-f":
        case "--file": {
            i++;
            procArg.file = process.argv[i];
        } break;
        case "-a":
        case "--application": {
            i++;
            procArg.application = process.argv[i];
        } break;
    }
}

// Start Server
(async function () {
    try {
        await server_applications.init();
        await server_main.startServer();
    } catch (ex) {
        if ((ex as any).code != "EADDRINUSE") {
            console.error(ex);
        }
    } finally {
        if (procArg.file && procArg.application) {
            // configuration
            let config_application = server_applications.getConfig(procArg.application as string);

            // add file
            let data = await client.getJson(`http://localhost:${config_common.port}/command/add-file?file=${encodeURIComponent(procArg.file)}&application=${procArg.application}`);

            // load file
            let url = config_application.launch;
            url = url.replace(/\{id\}/g, `${data.no}`);
            url = url.replace(/\{port\}/g, `${config_common.port}`);
            child_process.exec(`start ${url}`);
        }
    }
})();
