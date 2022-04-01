import React from 'react'
import { GithubUser } from '../organism/GithubUser'
import { GithubRepository } from '../organism/GithubRepository'
import { GithubRepositoryIssue } from '../organism/GithubRepositoryIssue'

export const Github = () => {
  const [search, setSearch] = React.useState('')
  const [user, setUser] = React.useState(null)
  const [repository, setRepository] = React.useState(null)
  const [show, setShow] = React.useState(false)
  const handleOnchangeSearch = e => {
    setShow(false)
    setSearch(e.target.value)
  }

  const handleOnSearch = () => {
    setUser(null)
    setRepository(null)
    setShow(true)
  }

  const handleUserKeyPress = event => {
    const { keyCode } = event
    // on enter
    if (keyCode === 13) {
      handleOnSearch()
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress)
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [])

  const showSearchResult = show && !user && !repository
  const showRepository = user && !repository
  return (
    <div className='github'>
      <div className='github__search'>
        <label>
          <input
            className='github__search-input'
            type="text"
            value={search}
            onChange={handleOnchangeSearch}
            placeholder='Search users...'
          />
          <i className="fa fa-search"/>
        </label>
        <button
          className='github__search-button'
          type="submit"
          onClick={handleOnSearch}
        >
          SEARCH
        </button>
      </div>
      {showSearchResult && (<div className='github__user'>
        <GithubUser search={search} selectUser={setUser}/>
      </div>)}
      {showRepository && (<div className='github__repository'>
         <GithubRepository user={user} selectRepository={setRepository}/>
      </div>)}
      {repository && (<div className='github__issue'>
        <GithubRepositoryIssue user={user} repository={repository}/>
      </div>)}
    </div>
  )
}
