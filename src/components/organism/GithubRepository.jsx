import React from 'react'
import {
  useQuery,
  gql
} from '@apollo/client'
import { Pagination } from './Pagination'

const DEFAULT_PER_PAGE = 6

const GET_REPOSITORIES_BY_USER = (user) => {
  return gql(`
    query {
      user(login: "${user}") {
        repositories(first: ${DEFAULT_PER_PAGE}, isFork: false) {
          totalCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          nodes {
            name
            stargazerCount
            id
            watchers {
              totalCount
            }
          }
        }
      }
    }
  `)
}

const GET_REPOSITORIES_BY_USER_NEXT = (user, after) => {
  return gql(`
    query {
      user(login: "${user}") {
        repositories(first: ${DEFAULT_PER_PAGE},after: "${after}", isFork: false) {
          totalCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          nodes {
            name
            stargazerCount
            id
            watchers {
              totalCount
            }
          }
        }
      }
    }
  `)
}

const GET_REPOSITORIES_BY_USER_PREV = (user, before) => {
  return gql(`
    query {
      user(login: "${user}") {
        repositories(last: ${DEFAULT_PER_PAGE},before: "${before}", isFork: false) {
          totalCount
          pageInfo {
            startCursor
            endCursor
          }
          nodes {
            name
            id
            stargazerCount
            watchers {
              totalCount
            }
          }
        }
      }
    }
  `)
}

export const GithubRepository = (props) => {
  const { user, selectRepository } = props
  if (!user) {
    return null
  }
  const [cursor, setCursor] = React.useState({
    after: '',
    before: '',
    currentPage: 1
  })

  const handlePageChange = page => {
    if (page > cursor.currentPage) {
      setCursor({
        after: state.user.repositories.pageInfo.endCursor,
        before: '',
        currentPage: page
      })
    } else {
      setCursor({
        after: '',
        before: state.user.repositories.pageInfo.startCursor,
        currentPage: page
      })
    }
  }
  const callApi = () => {
    if (!cursor.after && !cursor.before) {
      return useQuery(GET_REPOSITORIES_BY_USER(user))
    }
    if (cursor.after) {
      return useQuery(GET_REPOSITORIES_BY_USER_NEXT(user, cursor.after))
    }
    if (cursor.before) {
      return useQuery(GET_REPOSITORIES_BY_USER_PREV(user, cursor.before))
    }
  }
  const { loading, error, data } = callApi()
  const [state, setState] = React.useState([])
  React.useEffect(() => {
    if (data) {
      setState(data)
    }
  }, [data])

  if (error) {
    return <>Something went wrong!</>
  }
  if (loading && !cursor.currentPage) {
    return <>Fetching...</>
  }
  if (!state?.user || !state?.user?.repositories) {
    return <>No repository found!</>
  }

  const { nodes, totalCount } = state.user.repositories

  const handleSelectRepository = item => {
    selectRepository(item)
  }

  return (
      <>
        <h2>REPOSITORIES of USER: {user}</h2>
        {renderRepository(nodes, handleSelectRepository)}
        <Pagination
          totalPage={Math.round(totalCount / DEFAULT_PER_PAGE)}
          callback={handlePageChange}
          currentPage={cursor.currentPage}
          totalItem={totalCount}
        />
      </>
  )
}

const renderRepository = (items, handleSelectRepository) => {
  return (
    <div className='result'>
      {items.map((item, index) => {
        return (
          <div className='list-repository' key={index} onClick={() => handleSelectRepository(item)}>
            <span>{item?.name}</span>
            <span>{`${item?.stargazerCount} stars/ ${item?.watchers?.totalCount} watching` }</span>
          </div>
        )
      })}
    </div>
  )
}
