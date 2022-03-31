import React from 'react'

export const PageNumber = (props) => {
  const { num, active } = props
  return (
    <button
      disabled={true}
      className={`${active ? 'active' : ''}`}
    >
      {num}
    </button>
  )
}
