import { Result } from './result.interface';

export interface PokeResponse {
  count: number;
  next: string;
  previous: null;
  results: Result[];
}
