import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity,BackHandler } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import grass from '../assets/grass_bg.png'
import exit from '../assets/exit_home.png'
import startbtn from '../assets/start_btn.png'
import homegirl from '../assets/home_girl.png'


export default function Home({ navigation }) {

    useKeepAwake();
    changeScreenOrientation();

    return (
        <View style={styles.bgcontainer}>
            <LinearGradient colors={['#00796B', '#00796B', '#2E7D32']} style={styles.linearGradient}>
                <View style={styles.container}>
                    <ImageBackground source={grass} resizeMode="cover" style={styles.imageGrass} />
                    <TouchableOpacity style={styles.imageExit} onPress={() => BackHandler.exitApp()}>
                        <ImageBackground source={exit} resizeMode="cover" style={styles.imageExit} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageStartTouchable} onPress={() => navigation.replace('Categories')}>
                        <ImageBackground source={startbtn} resizeMode="contain" style={styles.imageStart} />
                    </TouchableOpacity>
                    <ImageBackground source={homegirl} resizeMode="contain" style={styles.homeGirl} />
                </View>
            </LinearGradient>
        </View>
    );
}

var styles = StyleSheet.create({
    linearGradient: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').height,
    },
    bgcontainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    imageGrass: {
        flex: 1,
        width: Dimensions.get('window').height,
    },
    imageExit: {
        position: 'absolute',
        top: 0,
        left: 40,
        flex: 1,
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3,
    },
    imageStart: {
        bottom: 0,
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.8,
    },
    imageStartTouchable: {
        position: 'absolute',
        flex: 1,
        bottom: 0,
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.8,
    },
    homeGirl: {
        position: 'absolute',
        right: 0,
        flex: 1,
        bottom: 0,
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.8,
    }
});

async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
}
