import { useState } from 'react'
import './App.css'
import AddBooking from './Components/AddBooking'
import Booking from './Components/Booking'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AddBooking />
      {/* {<Booking />} */}
    </>
  )
}

export default App
