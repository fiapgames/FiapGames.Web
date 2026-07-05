import { httpClient } from './httpClient';

export const healthApi = {
  check: () => httpClient.get<string>('/health'),
};
