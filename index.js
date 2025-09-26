/**
 * @format
 */

// Node.js polyfills for React Native
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import 'react-native-gesture-handler';

// React Native Firebase 초기화
import '@react-native-firebase/app';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
