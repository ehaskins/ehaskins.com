import React from 'react'
import Link from 'gatsby-link'
import { Location } from '@reach/router'

import Typography from '../utils/typography'

let { rhythm, scale } = Typography

class Template extends React.Component {
  render() {
    const { loc, children } = this.props
    let header

    let rootPath = `/`

    if (loc.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
            Eric's Blog
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(-1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
            Eric's Blog
          </Link>
        </h3>
      )
    }
    return (
      <div
        style={{
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
      >
        {header}
        {children}
      </div>
    )
  }
}

export default props => (
  <Location>
    {locationProps => <Template loc={locationProps.location} {...props} />}
  </Location>
)
