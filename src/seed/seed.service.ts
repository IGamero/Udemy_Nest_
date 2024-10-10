const https = require('https');
import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  async executeSeed() {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      const { data } = await this.axios.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=100',
        { httpsAgent: agent },
      );

      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const pokemonNumber: number = +segments[segments.length - 2];

        console.log({ name, pokemonNumber });
      });

      return data.results;
    } catch (error) {
      console.error('Error fetching data from PokeAPI', error);
      throw new Error('Failed to execute seed');
    }
  }
}
