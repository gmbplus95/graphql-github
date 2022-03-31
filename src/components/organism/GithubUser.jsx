import React from 'react'
import {
  useQuery,
  gql
} from '@apollo/client'

const GET_USERS = (search, limit = 10) => {
  return gql(`
    query {
        search(query: "${search}", type: USER, first: ${limit}) {
          userCount
          repositoryCount
          edges {
            node {
              ... on User {
                login
                name
                email
              }
            }
          }
        }
      }
    `)
}

export const GithubUser = (props) => {
  const { search, selectUser } = props
  if (!search) {
    return null
  }
  const [limit, setLimit] = React.useState(10)
  const { loading, error, data } = useQuery(GET_USERS(search, limit))
  if (loading) return 'Waiting...'
  if (error) {
    console.log(error)
    return <>Something went wrong!</>
  }
  if (!data?.search || data?.search?.edges.length === 0) {
    return <>No result found!</>
  }

  const { edges, userCount } = data.search
  if (edges && edges.length === 0) {
    return <>No result found!</>
  }
  const handleClickLoadmore = () => {
    setLimit(limit + 10)
  }
  return (
    <>
      <h2>USERS</h2>
      <div className='result'>
        {edges.map((item, index) => {
          return (
              <div className='list-user' key={index} onClick={() => selectUser(item?.node?.login)}>
                <i className="fa fa-user" aria-hidden="true"/>
                <span>{item?.node?.name} - {item?.node?.email}</span>
              </div>
          )
        })}
      </div>
      {userCount > limit && (
        <button className='loadmore' onClick={handleClickLoadmore}>LOAD 10 MORE USERS...</button>
      )}
    </>
  )
}
