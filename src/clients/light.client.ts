import Papa from 'papaparse';
import DataRow from '../models/DataRow';

const TRANSFORM_MAP: { [key in keyof DataRow]: (value: string) => string | number | Date } = {
    datetime: (value: string) => new Date(value).getTime(),
    duration: (value: string) => parseInt(value, 10),
    consumption: (value: string) => parseInt(value, 10),
    generation: (value: string) => parseInt(value, 10),
    unit: (value: string) => value,
};

class LightClient {
    getSolarIntervals = () => this.get('/solar-interval-data.csv')
    getHighWinterIntervals = () => this.get('/high-winter-interval-data.csv')
    getLowWinterInternals = () => this.get('/low-winter-interval-data.csv')

    private get(csvUrl: string): Promise<DataRow[]> {
        return new Promise((resolve, reject) => {
            try {
                Papa.parse<DataRow>(csvUrl, {
                    download: true,
                    header: true,
                    complete: (results) => resolve(results.data),
                    error: reject,
                    transform: (value: string, field: keyof DataRow) => 
                        TRANSFORM_MAP[field]?.(value) ?? value
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default LightClient;
