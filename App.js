import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from './react-components/Login/Login'

export default class App extends React.Component {
  render() {
    return <RootStack/>
  }
}

const RootStack = createStackNavigator({
  Login: LoginScreen,
},
{
  initialRouteName: 'Login',
  headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
})