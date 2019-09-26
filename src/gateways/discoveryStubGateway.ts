import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry, { IAxiosRetryConfig, exponentialDelay } from 'axios-retry';
import { IFlight } from '../models/Flight';
import Config from '../providers/Config';

type AxiosOptions = AxiosRequestConfig & { 'axios-retry': IAxiosRetryConfig };

const BASE_URL = 'https://discovery-stub.comtravo.com';
const FIRST_SOURCE_PATH = '/source1';
const SECOND_SOURCE_PATH = '/source2';

const config = Config.getInstance().getConfig();
const defaultAxiosRetryConfig = {
  retries: 1,
  retryDelay: exponentialDelay,
};
const client = axios.create({ baseURL: BASE_URL });
axiosRetry(client);

async function getFlights(
  path: string,
  options: AxiosOptions,
): Promise<IFlight[]> {
  try {
    const { data } = await client.get(path, options);
    return data.flights;
  } catch (error) {
    console.log(
      `Failed to request flights: messages=${error.message}, path=${path}`,
    );
    throw error;
  }
}

function getFirstSourceFlights(): Promise<IFlight[]> {
  return getFlights(FIRST_SOURCE_PATH, {
    'axios-retry': defaultAxiosRetryConfig,
  });
}

function getSecondSourceFlights(): Promise<IFlight[]> {
  return getFlights(SECOND_SOURCE_PATH, {
    auth: {
      username: config.username,
      password: config.password,
    },
    'axios-retry': defaultAxiosRetryConfig,
  });
}

export { getFirstSourceFlights, getSecondSourceFlights, getFlights };
