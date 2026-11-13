import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect, type ComponentType } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [query, setQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, selectedPage],
    queryFn: () => fetchMovies(query, selectedPage),
    enabled: Boolean(query),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && !data.results.length) {
      toast('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const handleMoviesSearch = (query: string) => {
    setQuery(query);
    setSelectedPage(1);
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
      {isSuccess && data.results.length > 0 && (
        <MovieGrid onSelect={handleMovieClick} movies={data.results} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
      {isSuccess && data.total_pages > 0 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setSelectedPage(selected + 1)}
          forcePage={selectedPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;
