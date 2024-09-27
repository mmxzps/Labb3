import { useState } from 'react'
import './App.css'
import AddBooking from './Components/AddBooking'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AddBooking />
    </>
  )
}

export default App
