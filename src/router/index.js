import {Root} from 'native-base'
import React from 'react'
import {createStackNavigator} from 'react-navigation'

import HomepageScreen from 'screens/homepage'
import Bip39Screen from 'screens/bip39'
import RenderlogScreen from 'components/renderlog'
import FromWeiScreen from 'screens/web3/FromWei'
import EthersScreen from 'screens/ethers'

const AppStack = createStackNavigator({
  Homepage: HomepageScreen,
  Bip39: Bip39Screen,
  Renderlog: RenderlogScreen,
  Web3: FromWeiScreen,
  Ethers: EthersScreen,
}, {
  initialRouteName: 'Homepage',
  headerMode: 'none',
})

export default () =>
  <Root>
    <AppStack/>

  </Root>;
