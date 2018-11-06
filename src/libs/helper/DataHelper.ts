import * as https from 'https';
import * as http from 'http';
import * as zlib from 'zlib';

export class DataHelper {
    // Shuffles data and label using Fisher-Yates algorithm.
    static shuffleDataset(features: any[], labels: any[]) {
        let counter = features.length;
        let temp = 0;
        let index = 0;
        while (counter > 0) {
            index = (Math.random() * counter) | 0;
            counter--;
            // Shuffle features:
            temp = features[counter];
            features[counter] = features[index];
            features[index] = temp;
            // Shuffle labels:
            temp = labels[counter];
            labels[counter] = labels[index];
            labels[index] = temp;
        }
        return { features, labels };
    }

    static normalizeDataset(features: number[][], labels: number[]) {
        let maxLabel = 0;
        labels.forEach(label => {
            if (label > maxLabel) maxLabel = label;
        });
        labels = labels.map(label => label / maxLabel);
        for (let i = 0; i < features[0].length; i++) {
            let maxColumn = 0;
            features.forEach(featureRow => {
                if (featureRow[i] > maxColumn) maxColumn = featureRow[i];
            });
            for (let j = 0; j < features.length; j++) {
                features[j][i] = features[j][i] / maxColumn;
            }
        };
        return { features, labels };
    }

    static readBufferFromUri(uri: string, bytesLength?: number, bytesOffset = 0): Promise<Buffer | null> {
        return new Promise<Buffer | null>((resolve) => {
            let req: any = null;
            let callback = (res) => {
                let chunks: Buffer[] = [];
                let chunkSize: number = 0;
                let nextStage = res;
                if (uri.includes('.gz')) {
                    let unzip = zlib.createGunzip();
                    res.pipe(unzip);
                    nextStage = unzip;
                };
                nextStage.on('data', (buffer) => {
                    chunks.push(buffer);
                    chunkSize += buffer.byteLength;
                    if (bytesLength && chunkSize > (bytesOffset + bytesLength)) {
                        req.abort();
                        buffer = Buffer.concat(chunks);
                        return resolve(buffer.slice(bytesOffset, bytesOffset + bytesLength));
                    }
                }).on('end', () => {
                    let buffer = Buffer.concat(chunks);
                    return resolve(buffer.slice(bytesOffset));
                }).on('error', () => {
                    return resolve(null);
                });
            };
            console.log(`\n Reading file from ${uri} ...`);
            if (uri.includes('https')) req = https.get(uri, res => callback(res));
            else req = http.get(uri, res => callback(res));
        });
    }
}