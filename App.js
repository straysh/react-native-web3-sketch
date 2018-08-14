/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react'
import {Platform, Text, View} from 'react-native'
import
  bip39 from 'react-native-bip39'
import {Buffer} from 'buffer'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
})

export default class App extends Component {
  state = {
    mnemonic: ''
  }

  constructor(props) {
    super(props)

    try {
      bip39.generateMnemonic().then(mnemonic => {
        console.log(mnemonic)
        this.setState({mnemonic})
      }).catch(e => {
        console.error(e)
      })
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    // let mnemonic = Buffer.from(`1203`, 'hex')
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello World!</Text>
        <Text>{instructions}</Text>
        <Text>{this.state.mnemonic.toString()}</Text>
      </View>
    )
  }
}
