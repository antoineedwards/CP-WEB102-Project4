import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SpaceCard from './components/spaceCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 style={{color:'white'}}>Space Explorer</h1>
      <p style={{color:'white'}}>
        Disover new images from space
      </p>
      <SpaceCard/>
    </>
  )
}

export default App
