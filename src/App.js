import { useEffect, useState } from "react"
import axios from "axios"
import MovieCard from "./components/MovieCard"
import "./App.css"
import YouTube from "react-youtube"

function App() {
  const MOVIE_API = "https://api.themoviedb.org/3/"
  const SEARCH_API = MOVIE_API + "search/movie"
  const DISCOVER_API = MOVIE_API + "discover/movie"
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"

  const [playing, setPlaying] = useState(false)
  const [trailer, setTrailer] = useState(null)
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [movie, setMovie] = useState({ title: "Loading Movies" })

  useEffect(() => {
    getMovies()
    // console.log(movies)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMovies = async (event) => {
    if (event) {
      event.preventDefault()
    }

    const { data } = await axios.get(
      `${searchKey ? SEARCH_API : DISCOVER_API}`,
      {
        params: {
          api_key: "0ef14fb15ebf8738272817a78a6fe9e1",
          query: searchKey,
        },
      }
    )

    setMovies(data.results)
    setMovie(data.results[0])

    if (data.results.length) {
      getMovie(data.results[0].id)
    }
  }

  const getMovie = async (id) => {
    const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
      params: {
        api_key: "0ef14fb15ebf8738272817a78a6fe9e1",
        append_to_response: "videos",
      },
    })
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      )
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = (movie) => {
    getMovie(movie.id)
    setPlaying(false)
    setMovie(movie)
    window.scrollTo(0, 0)
  }

  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
    ))

  return (
    <div className="App">
      <header className="center-max-size header">
        <span className={"brand"}>Trailer Finder</span>
        <form className="form" onSubmit={getMovies}>
          <input
            className="search"
            type="text"
            id="search"
            placeholder="Search for a movie!"
            onInput={(event) => setSearchKey(event.target.value)}
          />
          <button className="submit-search" type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
      </header>
      {movies.length ? (
        <main>
          {movie ? (
            <div
              className="poster"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className={"youtube amru"}
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button
                    onClick={() => setPlaying(false)}
                    className={"button close-video"}
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className="center-max-size">
                  <div className="poster-content">
                    {trailer ? (
                      <button
                        className={"button play-video"}
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Preview
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1>{movie.title}</h1>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className={"center-max-size container"}>{renderMovies()}</div>
        </main>
      ) : (
        "Sorry, no movies found"
      )}
    </div>
  )
}

export default App
