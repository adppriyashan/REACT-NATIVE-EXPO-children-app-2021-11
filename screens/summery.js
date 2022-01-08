import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { View, ImageBackground, StyleSheet, Dimensions, Text } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Audio } from "expo-av";
import grass from '../assets/grass_bg.png'
import leftgif from '../assets/gif/game2.gif'
import rightgif from '../assets/gif/game3.gif'
import normal from '../assets/normal.mp3'
import good from '../assets/good.mp3'
import verygood from '../assets/verygood.mp3'

const cardGap = 20;

const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;


export default function GameScreen({ navigation }) {
    useKeepAwake();
    changeScreenOrientation();

    const [initstateval, setInitstateval] = React.useState(true);
    const [initstatevalsound, setInitstatevalsound] = React.useState(false);
    const [sound, setSound] = React.useState();
    const [name, setName] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [soundtrack, setSoundtrack] = React.useState(null);

    async function playSound() {
        console.log('playing sound function ' + initstatevalsound);
        if (initstatevalsound == true && soundtrack != null) {
            setInitstatevalsound(false);
            console.log('playing sound');
            const { sound } = await Audio.Sound.createAsync(soundtrack, {
                isLooping: true
            });
            setSound(sound);
            await sound.playAsync();
        }
    }

    if (initstateval) {
        getAllSummaryData();
    }


    return (<View style={styles.bgcontainer}>
        <LinearGradient colors={['#00796B', '#00796B', '#2E7D32']} style={styles.linearGradient}>
            <View style={styles.container}>
                <ImageBackground source={grass} resizeMode="cover" style={styles.imageGrass} />
                <View style={{
                    flexDirection: 'column',
                    position: 'absolute',
                    height: displayWidth,
                    width: displayHeight,
                    paddingTop: 30,
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignSelf: 'flex-start',
                        alignItems: 'flex-start'
                    }}>
                        <View style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', left: 0 }}>
                            <Text style={{ fontSize: 30, color: 'white', textAlign: 'center' }}>ක්‍රීඩාවේ සාරාංශය</Text>
                        </View>
                    </View>



                    <View style={{
                        flex: 6
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            paddingTop: 30,
                        }}>
                            <View style={{
                                flex: 2
                            }}>
                                <View style={{ position: 'absolute', height: '100%', width: '100%' }}>
                                    <View style={{ flex: 1, height: '100%' }}>
                                        <ImageBackground source={leftgif} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flex: 6
                            }}>
                                <View style={{ position: 'absolute', height: '100%', width: '100%' }}>
                                    <View style={{ flex: 1, height: '100%', width: '100%', paddingTop: 100 }}>
                                        <Text style={{ fontSize: 35, color: 'white', textAlign: 'center', textAlignVertical: 'center' }}>{name} </Text>
                                        <Text style={{ fontSize: 25, color: 'white', textAlign: 'center', textAlignVertical: 'center' }}>ඔයා</Text>
                                        <Text style={{ fontSize: 35, color: 'white', textAlign: 'center', textAlignVertical: 'center' }}>{status}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flex: 2
                            }}>
                                <View style={{ position: 'absolute', height: '100%', width: '100%' }}>
                                    <View style={{ flex: 1, height: '100%' }}>
                                        <ImageBackground source={rightgif} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        </LinearGradient>
    </View>);

    async function getAllSummaryData() {
        getValueFor('name').then((nameVal) => {
            if (nameVal != null) {
                setInitstateval(false);
                setName(nameVal);
                getValueFor('game1').then((game1) => {
                    getValueFor('game2').then((game2) => {
                        getValueFor('game3').then((game3) => {
                            getValueFor('game4').then((game4) => {

                                let totalGameScore = Number(((game1 == null) ? 0 : game1)) + Number(((game2 == null) ? 0 : game2)) + Number(((game3 == null) ? 0 : game3)) + Number(((game4 == null) ? 0 : game4));
                                if (totalGameScore > 5) {
                                    setStatus('සමාන්‍යයි');
                                    setSoundtrack(normal);
                                } else if (totalGameScore > 25) {
                                    setStatus('හොදයි');
                                    setSoundtrack(good);
                                } else if (totalGameScore > 35) {
                                    setStatus('ගොඩාක් හොදයි');
                                    setSoundtrack(verygood);
                                } else {
                                    setStatus("");
                                }
                                setInitstatevalsound(true);
                                playSound();

                            });
                        });
                    });
                });
            }
        });
    }

}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } else {
        return null
    }
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
