import React from 'react'
import { GithubUser } from '../organism/GithubUser'
import { GithubRepository } from '../organism/GithubRepository'

export const Github = () => {
  const [search, setSearch] = React.useState('')
  const [user, setUser] = React.useState(null)
  let searchValue = ''

  const handleOnchangeSearch = e => {
    searchValue = e.target.value
    setUser(null)
  }

  const handleOnSearch = () => {
    if (searchValue && searchValue !== search) {
      setSearch(searchValue)
    }
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

  return (
    <div className='github'>
      <div className='github__search'>
        <label>
          <input
            className='github__search-input'
            type="text"
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
      {!user && (<div className='github__user'>
        <GithubUser search={search} selectUser={setUser}/>
      </div>)}
      {user && (<div className='github__repository'>
         <GithubRepository user={user}/>
      </div>)}
    </div>
  )
}
