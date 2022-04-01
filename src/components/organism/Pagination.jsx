import React from 'react'
import { Next, Priv } from '../atoms/PaginationIcon'
import { PageNumber } from '../atoms/PageNumber'

export const Pagination = (props) => {
  const { totalPage, callback, currentPage, totalItem } = props
  const [activeIndex, setActiveIndex] = React.useState(currentPage || 1)
  const [prev, setPrev] = React.useState(0)
  const [next, setNext] = React.useState(0)
  const [totalPageShow, setTotalPageShow] = React.useState(0)
  const [pages, setPages] = React.useState({
    start: 1,
    end: totalPage < 5 ? totalPage : 5
  })

  React.useEffect(() => {
    setTotalPageShow(pages.end - pages.start + 1)
  }, [pages])

  React.useEffect(() => {
    if (activeIndex !== currentPage) {
      callback && callback(activeIndex)
    }
    setPrev(activeIndex > 1 ? activeIndex - 1 : 1)
    setNext(totalPage > activeIndex ? activeIndex + 1 : totalPage)
    if (activeIndex > pages.end) {
      const plus = activeIndex - pages.end
      pages.end += plus
      pages.start += plus
      setPages(pages)
    }
    if (activeIndex === 1) {
      pages.end = totalPage < 5 ? totalPage : 5
      pages.start = activeIndex
      setPages(pages)
      return
    }
    if (activeIndex < pages.start) {
      pages.end -= 1
      pages.start = activeIndex
      setPages(pages)
    }
  }, [activeIndex])

  return (
      <>
        {props.children}
        <div className='github__pager'>
          <Priv onClick={() => setActiveIndex(prev)} disable={activeIndex === 1} />
          <div>
            {
              Array.from(Array(totalPageShow)).map((item, index) => {
                const val = index + pages.start
                return (
                  <PageNumber key={Math.random()} num={val} active={val === activeIndex} onClick={() => setActiveIndex(val)} />
                )
              })
            }
          </div>
          <Next onClick={() => setActiveIndex(next)} disable={activeIndex === totalPage} />
          <div>Page: { `${activeIndex}/${totalPage} of total: ${totalItem} records`}</div>
        </div>
      </>
  )
}
