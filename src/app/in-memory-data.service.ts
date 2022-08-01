import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const movies = [
    { id: 1, title: "Interstellar" },
    { id: 2, title: "Inception" },
    { id: 3, title: "Watch Out, We're Mad" },
    { id: 4, title: "Who Finds a Friend, Finds a Treasure" },
    { id: 5, title: "Non c'è due senza quattro" }
    ];
    return {movies};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the movies array is empty,
  // the method below returns the initial number (11).
  // if the movies array is not empty, the method below returns the highest
  // hero id + 1.
  genId(movies: Movie[]): number {
    return movies.length > 0 ? Math.max(...movies.map(movie => movie.id)) + 1 : 0;
  }
}