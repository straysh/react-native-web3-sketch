import {Root} from 'native-base'
import React from 'react'
import {createStackNavigator} from 'react-navigation'

import Bip39Screen from 'screens/bip39'
import RenderlogScreen from 'components/renderlog'

const AppStack = createStackNavigator({
  Bip39: Bip39Screen,
  Renderlog: RenderlogScreen,
}, {
  initialRouteName: 'Bip39',
  headerMode: 'none',
})

export default () =>
  <Root>
    <AppStack/>
  </Root>;
