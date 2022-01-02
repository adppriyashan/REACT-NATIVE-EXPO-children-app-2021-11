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

const cardGap = 20;

const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;

const cardWidth = (displayHeight - (cardGap * 4)) / 4;

let gameAnswer = "";

let questionsPast = [];
let questionNo = 1;

const gameQuestions = [
    { id: 1, name: 'Red', audio: null, color: '#D50000' },
    { id: 2, name: 'Green', audio: null, color: '#2E7D32' },
    { id: 3, name: 'Black', audio: null, color: '#212121' },
    { id: 4, name: 'Blue', audio: null, color: '#0D47A1' },
    { id: 5, name: 'White', audio: null, color: '#FAFAFA' },
    { id: 6, name: 'Pink', audio: null, color: '#D81B60' },
    { id: 7, name: 'Yellow', audio: null, color: '#FBC02D' },
    { id: 8, name: 'Indica', audio: null, color: '#303F9F' },
    { id: 9, name: 'Gray', audio: null, color: '#616161' },
    { id: 10, name: 'Orange', audio: null, color: '#F4511E' },
    { id: 11, name: 'Purple', audio: null, color: '#4527A0' },
    { id: 12, name: 'Brown', audio: null, color: '#4E342E' },
];

let selected4Questions = [];

function getAnswer() {
    return selected4Questions[Math.floor(Math.random() * selected4Questions.length)];
}

function getNewQuestion() {
    selected4Questions = [];
    for (let index = 0; index < 4; index++) {

        let tempAllQuestions = gameQuestions;
        var selectedQuestion = getRandomQuestion(tempAllQuestions);

        for (let index1 = 0; index1 < tempAllQuestions.length; index1++) {
            var que = tempAllQuestions[index1];
            if (que.id == selectedQuestion.id) {
                tempAllQuestions.splice(index1, 1);
                break;
            }
        }
        selected4Questions.push(selectedQuestion);
    }
    gameAnswer = getAnswer();
}

function getRandomQuestion(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function GameScreen({ navigation }) {

    useKeepAwake();
    changeScreenOrientation();
    getNewQuestion();

    const [sound, setSound] = React.useState();

    async function playSound() {
        if (isMusicPlaying == false) {
            isMusicPlaying = true;
            const { sound } = await Audio.Sound.createAsync(background_music, {
                isLooping: true
            });
            setSound(sound);
            await sound.playAsync();
        }
    }

    // playSound();

    return (
        <View style={styles.bgcontainer}>
            <LinearGradient colors={['#00796B', '#00796B', '#2E7D32']} style={styles.linearGradient}>
                <View style={styles.container}>
                    <ImageBackground source={grass} resizeMode="cover" style={styles.imageGrass} />


                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'absolute',
                        height: displayWidth,
                        width: displayHeight
                    }}>
                        <View style={{ flex: 1, paddingLeft: cardGap }}>
                            <Text style={{
                                color: '#FAFAFA',
                                top: 20.0,
                                position:'absolute',
                                fontSize: 30,
                            }}>What is {gameAnswer.name} ?</Text>
                        </View>
                        <View style={{ flex: 1, paddingLeft: cardGap, alignItems:'center', alignContent:'center'  }}>
                            <Text style={{
                                color: '#FAFAFA',
                                marginLeft :cardGap,
                                position:'absolute',
                                bottom: 10.0,
                                left:0,
                                right:0,
                                fontSize: 30,
                                justifyContent: 'center'
                            }}>What is {gameAnswer.name} ?</Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                position: 'absolute',
                                bottom: 10.0
                            }}>
                                {selected4Questions.map((ques, i) => {
                                    return (
                                        <View
                                            key={ques.id}
                                            style={{
                                                marginTop: cardGap,
                                                marginLeft: cardGap / 2,
                                                marginRight: cardGap / 2,
                                                width: cardWidth,
                                                height: cardWidth,
                                                shadowOpacity: 0.2,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: ques.color
                                            }}
                                        >
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
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
    }
});

async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
}
