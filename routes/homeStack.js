import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home'
import SplashScreen from '../screens/splashscreen'
import Categories from '../screens/categories'
import GameScreen from '../screens/gamescreen'

const screens = {
    SplashScreen: {
        screen: SplashScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false
        }
    },
    Categories: {
        screen: Categories,
        navigationOptions: {
            headerShown: false
        }
    },
    GameScreen: {
        screen: GameScreen,
        navigationOptions: {
            headerShown: false
        }
    },
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);