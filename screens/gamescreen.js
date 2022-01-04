import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Image, Text } from 'react-native'
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
import exit from '../assets/exit_home.png'
import goback from '../assets/goback.png'
import soundon from '../assets/soundon.png'
import soundoff from '../assets/soundoff.png'
import correct from '../assets/correct.png'
import wrongorempty from '../assets/wrongorempty.png'
import correct_voice from '../assets/correct_voice.mp3'
import wrong_voice from '../assets/wrong_voice.mp3'
import whatisred from '../assets/whatisred.mp3'
import finish from '../assets/finish.mp3'
import finishgif from '../assets/gif/finish.gif'



const cardGap = 20;

const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;

const gameQuestions = [
    { id: 1, name: 'Red', audio: whatisred, color: '#D50000' },
    { id: 2, name: 'Green', audio: whatisred, color: '#2E7D32' },
    { id: 3, name: 'Black', audio: whatisred, color: '#212121' },
    { id: 4, name: 'Blue', audio: whatisred, color: '#0D47A1' },
    { id: 5, name: 'White', audio: whatisred, color: '#FAFAFA' },
    { id: 6, name: 'Pink', audio: whatisred, color: '#D81B60' },
    { id: 7, name: 'Yellow', audio: whatisred, color: '#FFFF00' },
    { id: 8, name: 'Indica', audio: whatisred, color: '#303F9F' },
    { id: 9, name: 'Gray', audio: whatisred, color: '#616161' },
    { id: 10, name: 'Orange', audio: whatisred, color: '#F4511E' },
    { id: 11, name: 'Purple', audio: whatisred, color: '#4527A0' },
    { id: 12, name: 'Brown', audio: whatisred, color: '#4E342E' },
];

let initStateLoading = true;
let uniKey = 1;
let allQuestions = [];
let allAnswers = [];
let allReplies = [];
let playedOnce = true;
let soundsOn = true;

export default function GameScreen({ navigation }) {

    useKeepAwake();
    changeScreenOrientation();

    const [sound, setSound] = React.useState();
    const [newquestions, setNewquestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([false, false, false, false, false, false, false, false, false, false]);
    const [answer, setAnswer] = React.useState([]);
    const [showloading, setShowloading] = React.useState(true);

    if (initStateLoading == true) {
        getNewQuestionProcess();
    }

    async function getNewQuestionProcess() {
        initStateLoading = false;
        uniKey++;
        getNewQuestion().then((newquestionsTempArray) => {
            getAnswer(newquestionsTempArray).then((newanswerrecord) => {
                console.log(soundsOn);
                if (soundsOn && allQuestions.length < 10) {
                    playedOnce = true;
                    playSound(newanswerrecord.audio);
                }

                if (allQuestions.length == 10 && soundsOn) {
                    playedOnce = true;
                    playSound(finish);
                }

                allQuestions.push(newquestionsTempArray);
                allAnswers.push(newanswerrecord);
                setAnswer(newanswerrecord);
                setNewquestions(newquestionsTempArray);
                setShowloading(false);
            });
        });
    }

    async function playSound(soundsEffects) {
        if (playedOnce) {
            const { sound } = await Audio.Sound.createAsync(soundsEffects);
            setSound(sound);
            await sound.playAsync();
            playedOnce = false;
        }
    }


    if (showloading == true) {
        return (
            <View style={styles.bgcontainer}>
                <LinearGradient colors={['#00796B', '#00796B', '#2E7D32']} style={styles.linearGradient}>
                    <View style={styles.container}>
                        <ImageBackground source={grass} resizeMode="cover" style={styles.imageGrass} />
                        <Text style={{ textAlign: 'center' }}>Loading</Text>
                    </View>
                </LinearGradient>
            </View>
        );
    } else {
        if (true) {
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
                                width: displayHeight,
                                paddingTop: 30,

                            }}>
                                <View style={{
                                    flex: 2, width: displayHeight
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: displayHeight,
                                        flexWrap: 'nowrap',
                                        height: '100%',
                                    }}>
                                        <View style={{ flex: 1, height: '100%' }}>
                                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                                <ImageBackground source={goback} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 10, height: '100%' }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                width: '100%',
                                                flexWrap: 'nowrap',
                                                height: '100%',
                                            }}>
                                                {answers.map((val, index) => {
                                                    return (
                                                        <View key={index + "answer"} style={{ flex: 1 }}>
                                                            <ImageBackground source={(answers[index] == true) ? correct : wrongorempty} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                                        </View>
                                                    );
                                                })}

                                            </View>
                                        </View>
                                        <View style={{ flex: 1, height: '100%' }}>
                                            <View style={{
                                                flexDirection: 'column',
                                                justifyContent: 'space-around',
                                                width: '100%',
                                                flexWrap: 'nowrap',
                                                height: '100%',
                                                width: '100%',
                                            }}>
                                                <TouchableOpacity style={{ flex: 1, height: '100%', width: '100%' }} onPress={() => {
                                                    soundsOn = true;
                                                }}>
                                                    <View style={{ height: '100%', width: '100%' }}>

                                                        <ImageBackground source={soundon} resizeMode='contain' style={{ width: '100%', height: '100%' }} />

                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ flex: 1, height: '100%', width: '100%' }} onPress={() => {
                                                    soundsOn = false;
                                                }}>
                                                    <View style={{ height: '100%', width: '100%' }}>

                                                        <ImageBackground source={soundoff} resizeMode='contain' style={{ width: '100%', height: '100%' }} />

                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', alignContent: 'center' }}>
                                    <Text style={{
                                        color: '#FAFAFA',
                                        marginLeft: cardGap,
                                        position: 'absolute',
                                        textAlign: 'center',
                                        left: 0,
                                        right: 0,
                                        fontSize: 30,
                                        justifyContent: 'center'
                                    }}>Score {getTrueAnswers()}/10</Text>
                                </View>
                                <View style={{ flex: 3, alignItems: 'center', alignContent: 'center' }}>
                                    <Image
                                        style={{ width: '100%', height: '100%' }}
                                        source={finishgif} resizeMode='contain' />
                                </View>
                            </View>

                        </View>
                    </LinearGradient>
                </View>
            );
        } else {
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
                                width: displayHeight,
                                paddingTop: 30,

                            }}>
                                <View style={{
                                    flex: 2, width: displayHeight
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: displayHeight,
                                        flexWrap: 'nowrap',
                                        height: '100%',
                                    }}>
                                        <View style={{ flex: 1, height: '100%' }}>
                                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                                <ImageBackground source={goback} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 10, height: '100%' }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                width: '100%',
                                                flexWrap: 'nowrap',
                                                height: '100%',
                                            }}>
                                                {answers.map((val, index) => {
                                                    return (
                                                        <View key={index + "answer"} style={{ flex: 1 }}>
                                                            <ImageBackground source={(answers[index] == true) ? correct : wrongorempty} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                                        </View>
                                                    );
                                                })}

                                            </View>
                                        </View>
                                        <View style={{ flex: 1, height: '100%' }}>
                                            <View style={{
                                                flexDirection: 'column',
                                                justifyContent: 'space-around',
                                                width: '100%',
                                                flexWrap: 'nowrap',
                                                height: '100%',
                                                width: '100%',
                                            }}>
                                                <View style={{ flex: 1, height: '100%', width: '100%' }}>
                                                    <ImageBackground source={soundon} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                                </View>
                                                <View style={{ flex: 1, height: '100%', width: '100%' }}>
                                                    <ImageBackground source={soundoff} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', alignContent: 'center' }}>
                                    <Text style={{
                                        color: '#FAFAFA',
                                        marginLeft: cardGap,
                                        position: 'absolute',
                                        textAlign: 'center',
                                        left: 0,
                                        right: 0,
                                        fontSize: 30,
                                        justifyContent: 'center'
                                    }}>What is {(answer) ? answer.name : 'Nan'} ?</Text>
                                </View>
                                <View style={{ flex: 2, marginBottom: 20 }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: displayHeight,
                                        flexWrap: 'nowrap',
                                        height: '100%',
                                    }}>
                                        {newquestions.map((ques, i) => {
                                            return (
                                                <TouchableOpacity key={ques.id + uniKey} onPress={() => checkForAnswer(ques.id)} style={{
                                                    flex: 1,
                                                    width: '100%',
                                                    height: '100%',
                                                    marginLeft: 10,
                                                    marginRight: 10,
                                                }}>
                                                    <View
                                                        key={ques.id + uniKey}
                                                        style={{
                                                            borderWidth: 3,
                                                            borderRadius: 200,
                                                            borderColor: 'black',
                                                            width: '100%',
                                                            height: '100%',
                                                            shadowOpacity: 0.2,
                                                            backgroundColor: (ques) ? ques.color : '#F4511E'
                                                        }}
                                                    >
                                                    </View>
                                                </TouchableOpacity>
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
    }

    function getTrueAnswers() {
        let trueRecords = 0;
        for (let index = 0; index < answers.length; index++) {
            if (answers[index] == true) {
                trueRecords++;
            }
        }
        return '' + trueRecords;
    }

    async function getAnswer(listQuestions) {
        console.log(listQuestions.length);
        console.log('new answer generated');
        console.log('*******************************');
        return listQuestions[Math.floor(Math.random() * (3 + 1))];
    }

    async function getNewQuestion() {
        var selected4Questions = [];
        let newSuffuled = shuffleArray(gameQuestions);
        for (let index = 0; index < 4; index++) {
            selected4Questions.push(newSuffuled[index]);
        }
        console.log('new question generated');
        return selected4Questions;
    }

    function shuffleArray(listNew) {
        let i = listNew.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = listNew[i];
            listNew[i] = listNew[j];
            listNew[j] = temp;
        }
        return listNew;
    }

    async function checkForAnswer(answerid) {
        if (soundsOn) {
            playedOnce = true;
            await playSound((answerid == answer.id) ? correct_voice : wrong_voice).then(() => {
                setShowloading(true);
                answers[allQuestions.length - 1] = (answerid == answer.id) ? true : false;
                setAnswers(answers);
                allReplies.push((answerid == answer.id) ? true : false);
                getNewQuestionProcess();
            });
        }

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
    imageExit: {
        position: 'absolute',
        top: 0,
        left: 40,
        flex: 1,
        width: '80%',
        height: '80%',
    },
});

async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
}
