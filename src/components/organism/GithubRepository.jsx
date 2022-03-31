import React from 'react'
import {
  useQuery,
  gql
} from '@apollo/client'
import { Pagination } from './Pagination'

const GET_REPOSITORIES_BY_USER = (user) => {
  return gql(`
    query {
      user(login: "${user}") {
        repositories(first: 6, isFork: false) {
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
        repositories(first: 6,after: "${after}", isFork: false) {
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
        repositories(first: 6,before: "${before}", isFork: false) {
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
  const { user } = props
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

  if (loading) {
    return 'Fetching repository...'
  }
  if (error) {
    console.log(error)
    return <>Something went wrong!</>
  }
  if (!state?.user || state?.user?.repositories.length === 0) {
    return <>No result found!</>
  }
  const { nodes, totalCount } = state.user.repositories
  if (!nodes || nodes.length === 0) {
    return <>No result found!</>
  }
  return (
      <>
        <h2>REPOSITORIES of USER: {user}</h2>
        {renderRepository(nodes)}
        <Pagination totalPage={Math.round(totalCount / 6)} callback={handlePageChange} currentPage={cursor.currentPage} />
      </>
  )
}

const renderRepository = (items) => {
  return (
    <div className='result'>
      {items.map((item, index) => {
        return (
          <div className='list-repository' key={index}>
            <span>{item?.name}</span>
            <span>{`${item?.stargazerCount} stars/ ${item?.watchers?.totalCount} watching` }</span>
          </div>
        )
      })}
    </div>
  )
}
