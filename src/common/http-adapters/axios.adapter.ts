import { Injectable } from '@nestjs/common';
import * as https from 'https';
import axios, { AxiosInstance } from 'axios';

import { HttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private readonly axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      const { data } = await this.axios.get<T>(url, {
        httpsAgent: agent,
      });

      return data;
    } catch (error) {
      console.log(error);
      throw new Error('Error at axios adapter');
    }
  }
}
