import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home'
import SplashScreen from '../screens/splashscreen'
import Categories from '../screens/categories'
import GameScreen from '../screens/gamescreen'
import NameScreen from '../screens/name'
import GameScreen1 from '../screens/gamescreen1'
import GameScreen2 from '../screens/gamescreen2'
import GameScreen3 from '../screens/gamescreen3'
import GameScreen4 from '../screens/gamescreen4'
import Summery from '../screens/summery'

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
    Name: {
        screen: NameScreen,
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
    GameScreen1: {
        screen: GameScreen1,
        navigationOptions: {
            headerShown: false
        }
    },
    GameScreen2: {
        screen: GameScreen2,
        navigationOptions: {
            headerShown: false
        }
    },
    GameScreen3: {
        screen: GameScreen3,
        navigationOptions: {
            headerShown: false
        }
    },
    GameScreen4: {
        screen: GameScreen4,
        navigationOptions: {
            headerShown: false
        }
    },
    Summery: {
        screen: Summery,
        navigationOptions: {
            headerShown: false
        }
    },
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);