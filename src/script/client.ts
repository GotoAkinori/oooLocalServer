import * as http from 'http';

export function getJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let request = http.request(url, {
            method: "GET"
        }, response => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk.toString();
            });
            response.on("error", (error) => {
                reject(error);
            });
            response.on("close", () => {
                reject("Close");
            });
            response.on("end", (...chunk: string[]) => {
                data += chunk.join().toString();
                try {
                    resolve(JSON.parse(data));
                } catch (ex) {
                    reject({
                        error: ex,
                        data: data
                    });
                }
            });
        });

        request.end();
    });
}

