import React, {Component} from 'react'
import {StyleProvider, getTheme, variables} from 'native-base'
import Router from './router'

export default class Application extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(variables)}>
        <Router/>
      </StyleProvider>
    )
  }
}
