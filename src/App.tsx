import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './components/Home'
import { ProcessToken } from './components/ProcessToken'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/process-token' element={<ProcessToken />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
