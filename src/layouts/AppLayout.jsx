import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

function AppLayout() {
  return (
    <div>
      <main className='min-h-screen  px-7 '>
        <Header />
       <Outlet/>
      </main>
      <div className='p-10 text-center bg-gray-800 mt-10'>
        Made with 💖 by Sumit
      </div>
    </div>
  )
}

export default AppLayout
