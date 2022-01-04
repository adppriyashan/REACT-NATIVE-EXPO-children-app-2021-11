import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Text } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from "expo-av";
import grass from '../assets/grass_bg.png'
import game_cat1 from '../assets/game_cat1.png'
import game_cat2 from '../assets/game_cat2.png'
import game_cat3 from '../assets/game_cat3.png'
import game_cat4 from '../assets/game_cat4.png'
import game_cat5 from '../assets/game_cat5.png'
import background_music from '../assets/backgroundmusic.mp3'



var isMusicPlaying = false;

const cardGap = 5;

const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;

const cardWidth = (displayHeight - (cardGap * 5)) / 5;

export default function Categories({ navigation }) {

    useKeepAwake();
    changeScreenOrientation();

    const [sound, setSound] = React.useState();

    async function playSound() {
        if (isMusicPlaying == false) {
            isMusicPlaying = true;
            const { sound } = await Audio.Sound.createAsync(background_music,{
                isLooping :true
            });
            setSound(sound);
            await sound.playAsync();
        }
    }

    const categories = [
        { id: 1, name: 'Category 1', img: game_cat1 },
        { id: 2, name: 'Category 2', img: game_cat2 },
        { id: 3, name: 'Category 3', img: game_cat3 },
        { id: 4, name: 'Category 4', img: game_cat4 },
        { id: 5, name: 'Category 4', img: game_cat5 },
    ];

    playSound();

    function goToGame(){
        if(isMusicPlaying==true){
            sound.setStatusAsync({ shouldPlay: false, positionMillis: 0 })
            sound.stopAsync();
            isMusicPlaying=false;
        }
        navigation.navigate('GameScreen');
    }

    return (
        <View style={styles.bgcontainer}>
            <LinearGradient colors={['#00796B', '#00796B', '#2E7D32']} style={styles.linearGradient}>
                <View style={styles.container}>
                    <ImageBackground source={grass} resizeMode="cover" style={styles.imageGrass} />
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        position: 'absolute',
                    }}>
                        {categories.map((cat, i) => {
                            return (
                                <View
                                    key={cat.id}
                                    style={{
                                        marginTop: cardGap,
                                        marginLeft: cardGap / 2,
                                        marginRight: cardGap / 2,
                                        width: cardWidth,
                                        height: cardWidth,
                                        shadowOpacity: 0.2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <TouchableOpacity onPress={()=>goToGame() }>
                                        <ImageBackground source={cat.img} resizeMode="cover" style={{
                                            width: cardWidth,
                                            height: cardWidth,
                                        }} />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

var styles = StyleSheet.create({
    linearGradient: {
        height: displayWidth,
        width: displayHeight,
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
        width: displayHeight,
    },
});

async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
}
