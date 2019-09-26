import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 *  Singleton object for Config environment
 */
export default class Config {
  private static instance: Config;
  private config: any;

  public constructor() {
    this.config = this._loadConfig();
  }

  public static getInstance() {
    if (!Config.instance) {
      Config.instance = new Config();
    }

    return Config.instance;
  }

  private _loadConfig() {
    dotenv.config({ path: path.join(__dirname, '../../.env') });

    const port = process.env.PORT || 8000;
    const cacheTtl = process.env.CACHE_TTL || 60;
    const username = process.env.DISCOVERY_STUB_SERVICE_USERNAME || '';
    const password = process.env.DISCOVERY_STUB_SERVICE_PASSWORD || '';

    return {
      port,
      cacheTtl,
      username,
      password,
    };
  }

  public getConfig() {
    return this.config;
  }
}
