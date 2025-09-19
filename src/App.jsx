import './App.css'

import { LoginPage } from './components/LoginPage'
import ChatApp from './components/ChatApp'
import Registration from './trail/Registration';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


function App() {

  return (
    <Router>
      <Routes>

      <Route path="/" element={<LoginPage/>} />
      <Route path="/chat" element={<ChatApp/>} />
      <Route path="/reg" element={<Registration/>} />
      </Routes>
    </Router>
    
  )
}

export default App
