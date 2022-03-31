import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './styles/app.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // https://reactrouter.com/docs/en/v6/getting-started/overview
import reportWebVitals from './reportWebVitals'
import { MainLayout } from './components/layout/MainLayout'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client'
import { NotFound } from './components/pages/NotFound'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GITHUB_GRAPHQL_URL,
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_PERSONAL_ACCESS_KEY}`
  },
  cache: new InMemoryCache()
})

ReactDOM.render(
    <ApolloProvider client={client}>
      <React.StrictMode>
          <Router>
              <Routes>
                  {/* MainLayout Route */}
                  <Route path='/' element={<MainLayout />} />
                   <Route path='*' element={<NotFound />} />
              </Routes>
          </Router>
      </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
