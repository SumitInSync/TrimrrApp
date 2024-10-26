import React from 'react'

function error({message}) {
  return (
    <span className='text-sm text-red-400 '>
      {message}
    </span>
  )
}

export default error
