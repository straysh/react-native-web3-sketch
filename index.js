/** @format */
/**
 * convert -resize 542x962! launch_screen.png launch_screen2.png
 * http://www.albertgao.xyz/2018/05/30/24-tips-for-react-native-you-probably-want-to-know/
 * https://github.com/react-community/jsc-android-buildscripts
 */


import {AppRegistry, YellowBox} from 'react-native'
import App from './src'
import {name as appName} from './app.json'

YellowBox.ignoreWarnings([
  'Warning: componentWillMount',
  'Warning: isMounted',
  'Warning: componentWillReceiveProps',
  'Module RCTImageLoader',
  'Class RCTCxxModule was not exported',
  'Remote debugger'
])
AppRegistry.registerComponent(appName, () => App)
