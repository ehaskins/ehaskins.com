import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import Typography from '../utils/typography'
let { rhythm } = Typography

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Eric Haskins`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Eric Haskins</strong>, maker of things.
        </p>
      </div>
    )
  }
}

export default Bio
