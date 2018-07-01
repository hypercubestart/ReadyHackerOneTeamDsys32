import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from './react-components/Login/Login'
import RegisterScreen from './react-components/Register/Register'
import MenuScreen from './react-components/Menu/Menu'
import SplashScreen from './react-components/Splash/Splash'
import CheckoutScreen from './react-components/Checkout/Checkout'
import OrderConfirmationScreen from './react-components/OrderConfirmation/OrderConfirmation'

export default class App extends React.Component {
  render() {
    return <RootStack/>
  }
}

const RootStack = createStackNavigator({
  Splash: SplashScreen,
  Login: LoginScreen,
  Register: RegisterScreen,
  Menu: MenuScreen,
  Checkout: CheckoutScreen,
  OrderConfirmation: OrderConfirmationScreen
},
{
  initialRouteName: 'Splash',
  headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
})