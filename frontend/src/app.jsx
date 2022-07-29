import { useEffect, useState } from 'preact/hooks'
import './app.css'
import { Header } from './components/Header'
import { Results } from './components/Results'
import api from "./api"
import DebounceSrcatch from './components/Search'
import useDarkMode from './components/useDarkMode'
export function App() {
  const [colorTheme, setTheme] = useDarkMode();
  const [results, setResults] = useState([]) 
  const doSearch = (query) => {
    api.Search(query).then(
        (results) => {
         setResults(results)
         console.log(results)
        },
        (error) => {
          console.warn(error)
        }
      )
  }

  return (
    <div>
    <Header/>
    <DebounceSrcatch onSearch={doSearch} />
    <Results results={results}/>
    </div>
  )
}
