import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { MOVIES } from './mock-movies';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesUrl = 'api/movies';  // URL to web api

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /*getMovies(): Observable<Movie[]> {
    const movies = of(MOVIES);
    //this.messageService.add("MovieService: fetched movies");
    return movies;
  }*/
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.moviesUrl).pipe(tap(_ => this.log('fetched heroes')), catchError(this.handleError<Movie[]>('getHeroes', [])));
  }

  getMovie(id: number): Observable<Movie> {
    const url = `${this.moviesUrl}/${id}`;
    return this.http.get<Movie>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Movie>(`getMovie id=${id}`))
    );
  }

  /** Log a MovieService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`MovieService: ${message}`);
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** PUT: update the movie on the server */
  updateMovie(movie: Movie): Observable<any> {
    return this.http.put(this.moviesUrl, movie, this.httpOptions).pipe(
      tap(_ => this.log(`updated movie id=${movie.id}`)),
      catchError(this.handleError<any>('updateMovie'))
  );
  }

/** POST: add a new hero to the server */
addMovie(movie: Movie): Observable<Movie> {
  return this.http.post<Movie>(this.moviesUrl, movie, this.httpOptions).pipe(
    tap((newMovie: Movie) => this.log(`added movie w/ id=${newMovie.id}`)),
    catchError(this.handleError<Movie>('addHero'))
  );
}

deleteMovie(id: number): Observable<Movie>{
  const url = `${this.moviesUrl}/${id}`;

  return this.http.delete<Movie>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted movie id = ${id}`)),
    catchError(this.handleError<Movie>('deleteMovie'))
  );
}

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

/* GET movies whose name contains search term */
searchMovies(term: string): Observable<Movie[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Movie[]>(`${this.moviesUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found movies matching "${term}"`) :
       this.log(`no movies matching "${term}"`)),
    catchError(this.handleError<Movie[]>('searchMovies', []))
  );
}

}
