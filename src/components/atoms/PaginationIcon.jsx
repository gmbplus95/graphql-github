import React from 'react'

export const Priv = (props) => {
  const { onClick, disable } = props
  return (
    <button disabled={disable} onClick={onClick} style={{ cursor: 'pointer' }}>
      <svg width='8' height='13' viewBox='0 0 8 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M0.0927557 6.52554C0.0927557 6.75192 0.178152 6.97828 0.348585 7.15088L5.71445 12.5822C6.05579 12.9277 6.6092 12.9277 6.9504 12.5822C7.2916 12.2368 7.2916 11.6768 6.9504 11.3312L2.20239 6.52554L6.95023 1.71982C7.29143 1.37432 7.29143 0.814316 6.95023 0.468982C6.60904 0.123312 6.05562 0.123312 5.71428 0.468982L0.348419 5.9002C0.177958 6.07288 0.0927557 6.29924 0.0927557 6.52554Z' fill='#444444' />
      </svg>
    </button>
  )
}

export const Next = (props) => {
  const { onClick, disable } = props
  return (
    <button disabled={disable} onClick={onClick} style={{ cursor: 'pointer' }}>
      <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M7.64706 6.00002C7.64706 6.21508 7.55526 6.43012 7.37204 6.59409L1.60374 11.7538C1.2368 12.0821 0.641878 12.0821 0.275091 11.7538C-0.0916968 11.4257 -0.0916968 10.8937 0.275091 10.5654L5.37921 6.00002L0.275269 1.43459C-0.0915186 1.10636 -0.0915186 0.574357 0.275269 0.24629C0.642056 -0.0820961 1.23698 -0.0820961 1.60392 0.24629L7.37222 5.40595C7.55547 5.57 7.64706 5.78504 7.64706 6.00002Z' fill='#444444' />
      </svg>
    </button>
  )
}
