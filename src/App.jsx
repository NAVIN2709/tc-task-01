import React from 'react'
import Home from './pages/Home'
import Chats from './pages/Chats'
import Profile from './pages/Profile'
import {BrowserRouter, Router, Route, Link, Routes} from 'react-router-dom'
import Newplace from './pages/components/Newplace'
import ChatDetail from '../src/chats/[id]'

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/newplace" element={<Newplace />} />
        <Route path="/chats/:id" element={<ChatDetail />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App