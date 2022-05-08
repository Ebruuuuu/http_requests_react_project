import React, { useState, useEffect, useCallback } from 'react'

import MoviesList from './components/MoviesList'
import AddMovie from './components/AddMovie'
import './App.css'
const App = () => {
  //Component states
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  //sendHttpRequest function is an asynchronous function
  //The http request is a side effect

  //GET Request
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true)
    //To make sure that we clear any previous errors we might have gotten.
    setError(null)

    try {
      //fetch API returns a promise
      //await keyword is used instead of the then-catch block
      const response = await fetch(
        'https://http-5b0bf-default-rtdb.europe-west1.firebasedatabase.app/movies.json'
      )
      //ok field signals whether the response was successful or not.
      if (!response.ok) {
        throw new Error('Something went wrong!')
      }

      //the JSON data is converted to JavaScript data
      //This also returns a promise
      //data is fetched as an object
      const data = await response.json()

      //The array of data is created
      const loadedMovies = []
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingTest: data[key].openingTest,
          releaseDate: data[key].releaseDate,
        })
      }
      setMovies(loadedMovies)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMoviesHandler()
  }, [fetchMoviesHandler])

  //POST Request
  async function addMovieHandler(movie) {
    const response = await fetch(
      'https://http-5b0bf-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        //headers does not require technically for firebase.
        headers: { 'Content-Type': 'application/json' },
      }
    )
    const data = await response.json()
    console.log(data)
  }

  let content = <p>Found no movies.</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />

    if (isLoading) {
      content = <p>Loading...</p>
    }

    if (error) {
      content = <p>{error}</p>
    }
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  )
}

export default App
