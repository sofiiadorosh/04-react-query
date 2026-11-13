import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query],
    queryFn: () => fetchMovies(query),
    enabled: Boolean(query),
  });

  useEffect(() => {
    if (isSuccess && !data.length) {
      toast('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const handleMoviesSearch = (query: string) => {
    setQuery(query);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleMoviesSearch} />
      {data && data.length > 0 && (
        <MovieGrid onSelect={handleMovieClick} movies={data} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
