import * as fs from 'fs/promises';
import * as config_common from '../config/common.json';
import * as path from 'path';
import { ServerException } from './exception';

const applications: {
    [name: string]: {
        launch: string,
        static_files: {
            url: string,
            path: string
        }
    }
} = {};

const fileMap: {
    url: string,
    path: string
}[] = [];

export async function init() {
    let files = (await fs.readdir(path.join(__dirname, "../config/applications")))
        .filter(v => v.endsWith(".json"));

    for (let file of files) {
        let name = file.substring(0, file.length - 5); // remove extension (".json")
        let config = JSON.parse((await fs.readFile(path.join(__dirname, "../config/applications", file))).toString());
        applications[name] = config;

        for (let fileMapItem of config.static_files) {
            fileMap.push(fileMapItem);
        }
    }
}

export function getConfig(name: string) {
    return applications[name];
}

export function getStaticFilepath(url: string) {
    for (let fileMapItem of fileMap) {
        if (url.startsWith(fileMapItem.url)) {
            return path.join(fileMapItem.path, url.substring(fileMapItem.url.length).split("?")[0]);
        }
    }
    throw new ServerException(404, `File not found[${url}]`);
}
