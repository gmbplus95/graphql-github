import React from 'react'
import {
  gql,
  useMutation,
  useQuery
} from '@apollo/client'
import { Pagination } from './Pagination'

const DEFAULT_PER_PAGE = 6

const GET_REPOSITORY_ISSUE = (repoName) => {
  return gql(`
        query {
        search(first: ${DEFAULT_PER_PAGE}, type: ISSUE, query: "repo:${repoName} state:open") {
          issueCount
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
            ... on Issue {
                author {
                  login
                }
                createdAt
                title
                number
                url
                id
              }
            }
          }
      }
    }
  `)
}

const GET_REPOSITORY_ISSUE_NEXT = (repoName, after) => {
  return gql(`
        query {
        search(first: ${DEFAULT_PER_PAGE},after: "${after}", type: ISSUE, query: "repo:${repoName} state:open") {
          issueCount
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
            ... on Issue {
                author {
                  login
                }
                createdAt
                title
                number
                url
                id
              }
            }
          }
      }
    }
  `)
}

const GET_REPOSITORY_ISSUE_PREV = (repoName, before) => {
  return gql(`
        query {
        search(last: ${DEFAULT_PER_PAGE},before: "${before}", type: ISSUE, query: "repo:${repoName} state:open") {
          issueCount
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
            ... on Issue {
                author {
                  login
                }
                createdAt
                title
                number
                url
                id
              }
            }
          }
      }
    }
  `)
}

// create issue
// Define mutation
const CREATE_ISSUE =
   gql`
  mutation CreateIssue($repoId: ID!, $title: String!, $body: String!) {
    createIssue(input: {repositoryId: $repoId, title: $title, body: $body}) {
      issue {
        number
        body
      }
    }
  }
`

export const GithubRepositoryIssue = (props) => {
  const { user, repository } = props
  const [showModal, setShowModal] = React.useState(false)
  if (!repository || !user) {
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
        after: state.search.pageInfo.endCursor,
        before: '',
        currentPage: page
      })
    } else {
      setCursor({
        after: '',
        before: state.search.pageInfo.startCursor,
        currentPage: page
      })
    }
  }
  const callApi = () => {
    if (!cursor.after && !cursor.before) {
      return useQuery(GET_REPOSITORY_ISSUE(`${user}/${repository.name}`))
    }
    if (cursor.after) {
      return useQuery(GET_REPOSITORY_ISSUE_NEXT(`${user}/${repository.name}`, cursor.after))
    }
    if (cursor.before) {
      return useQuery(GET_REPOSITORY_ISSUE_PREV(`${user}/${repository.name}`, cursor.before))
    }
  }
  const { loading, error, data } = callApi()
  const [state, setState] = React.useState(null)
  React.useEffect(() => {
    if (data) {
      setState(data)
    }
  }, [data])

  if (error) {
    return <>Something went wrong!</>
  }

  if (loading) {
    return <>Fetching...</>
  }
  if (!state?.search || (state?.search?.nodes && state?.search?.edges.length === 0)) {
    return <>No issue found!</>
  }
  const { edges, issueCount } = state.search
  const handleOpenDialog = () => {
    setShowModal(true)
  }
  if (!edges || edges.length === 0) {
    return <>
      <h3>
        OPEN ISSUES in REPOSITORY: {user}/{repository.name}
      </h3>
      No issues found!
      <button className='github__issue-button' onClick={handleOpenDialog}>+ New issue</button>
      <IssueModal
        show={showModal}
        hideModal={() => setShowModal(false)}
        repositoryId={repository.id}
      />
    </>
  }

  return (
    <>
      <h3>
        OPEN ISSUES in REPOSITORY: {user}/{repository.name}
        <button className='github__issue-button' onClick={handleOpenDialog}>+ New issue</button>
      </h3>
      {renderRepositoryIssue(edges)}
      <Pagination
        totalPage={Math.ceil(issueCount / DEFAULT_PER_PAGE)}
        callback={handlePageChange}
        currentPage={cursor.currentPage}
        totalItem={issueCount}
      />
      <IssueModal show={showModal} hideModal={() => setShowModal(false)} repositoryId={repository.id}/>
    </>
  )
}

const renderRepositoryIssue = (items) => {
  if (items.length > 1) {
    items = [...items].sort((a, b) => {
      return a.node.number - b.node.number // sort by issue number
    })
  }
  const getTimeAndAuthor = (target, author) => {
    const now = new Date()
    const targetDate = new Date(target)
    const diff = new Date(now.getTime() - targetDate.getTime())
    const days = diff.getUTCDate() - 1
    if (days) {
      return `${days} day ago by ${author}`
    }
    if (diff.getUTCHours()) {
      return `${diff.getUTCHours()} hours ago by ${author}`
    }
    return `${diff.getUTCMinutes()} minutes ago by ${author}`
  }
  return (
    <div className='result'>
      {items.map((item, index) => {
        const d = item.node
        return (
          <div className='list-issue' key={index}>
            <a href={d.url}>ISSUE #{d.number}: {d.title}</a>
            <span>{getTimeAndAuthor(d.createdAt, d.author.login)}</span>
          </div>
        )
      })}
    </div>
  )
}

const IssueModal = (props) => {
  const { show, hideModal, repositoryId } = props
  const [createIssue] = useMutation(CREATE_ISSUE)
  const [form, setForm] = React.useState({
    title: '',
    body: ''
  })
  if (!show) {
    return null
  }
  const handleCreateIssue = () => {
    if (form.title === '' || form.description === '') {
      alert('title and description are required!')
      return
    }
    createIssue(
      { variables: { repoId: repositoryId, title: form.title, body: form.body } }).then(res => {
      hideModal()
      alert('Create issue success')
    })
  }
  return (
    <div
      className="github__modal"
    >
      <div className='github__modal-mask' />
      <div className='github__modal-body'>
          <div className='header'>
            New Issue
          </div>
          <div className='content'>
            <label htmlFor="title">
              <input value={form.text} type="text" id='title' placeholder='Title' onChange={e => setForm({ ...form, title: e.target.value })}/>
            </label>
            <label htmlFor="description">
              <textarea value={form.body} id='description' placeholder='Description' rows="10" onChange={e => setForm({ ...form, body: e.target.value })}/>
            </label>
          </div>
          <div className='footer'>
            <div>
              <button
                className='footer__btn-cancel'
                onClick={() => hideModal()}
              >
                Cancel
              </button>
              <button
                className='footer__btn-create'
                onClick={handleCreateIssue}
              >
                Create
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}
