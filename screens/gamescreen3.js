import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Image, Text } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Audio } from "expo-av";
import grass from '../assets/grass_bg.png'
import goback from '../assets/goback.png'
import trueImg from '../assets/true.png'
import falseImg from '../assets/false.png'
import soundon from '../assets/soundon.png'
import soundoff from '../assets/soundoff.png'
import correct from '../assets/correct.png'
import wrongorempty from '../assets/wrongorempty.png'
import correct_voice from '../assets/correct_voice.mp3'
import wrong_voice from '../assets/wrong_voice.mp3'
import finish from '../assets/finish.mp3'
import finishgif from '../assets/gif/game4.gif'

import audio1 from '../assets/whatisred.mp3'

import number1 from '../assets/vegfruits/1.png'
import number2 from '../assets/vegfruits/2.png'
import number3 from '../assets/vegfruits/3.png'
import number4 from '../assets/vegfruits/4.png'
import number5 from '../assets/vegfruits/5.png'
import number6 from '../assets/vegfruits/6.png'
import number7 from '../assets/vegfruits/7.png'
import number8 from '../assets/vegfruits/8.png'
import number9 from '../assets/vegfruits/9.png'
import number10 from '../assets/vegfruits/10.png'
import number11 from '../assets/vegfruits/11.png'
import number12 from '../assets/vegfruits/12.png'
import number13 from '../assets/vegfruits/13.png'
import number14 from '../assets/vegfruits/14.png'
import number15 from '../assets/vegfruits/15.png'
import number16 from '../assets/vegfruits/16.png'
import number17 from '../assets/vegfruits/17.png'
import number18 from '../assets/vegfruits/18.png'
import number19 from '../assets/vegfruits/19.png'
import number20 from '../assets/vegfruits/20.png'

const cardGap = 20;

const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;

const gameQuestions = [
    { id: 1, name: 'කැරට්', audio: audio1, img: number1, typeq: 1 },
    { id: 2, name: 'බීට්', audio: audio1, img: number2, typeq: 1 },
    { id: 3, name: 'අල', audio: audio1, img: number3, typeq: 1 },
    { id: 4, name: 'ළූණු', audio: audio1, img: number4, typeq: 1 },
    { id: 5, name: 'වට්ටක්කා', audio: audio1, img: number5, typeq: 1 },
    { id: 6, name: 'රතු මිරිස්', audio: audio1, img: number6, typeq: 1 },
    { id: 7, name: 'වම්බටු', audio: audio1, img: number7, typeq: 1 },
    { id: 8, name: 'ගෝවා', audio: audio1, img: number8, typeq: 1 },
    { id: 9, name: 'තක්කාලි', audio: audio1, img: number9, typeq: 1 },
    { id: 10, name: 'ඇපල්', audio: audio1, img: number10, typeq: 2 },
    { id: 11, name: 'අලිගැටපේර', audio: audio1, img: number11, typeq: 2 },
    { id: 12, name: 'කෙසෙල්', audio: audio1, img: number12, typeq: 2 },
    { id: 13, name: 'චෙරි', audio: audio1, img: number13, typeq: 2 },
    { id: 14, name: 'මිදි', audio: audio1, img: number14, typeq: 2 },
    { id: 15, name: 'අඹ', audio: audio1, img: number15, typeq: 2 },
    { id: 16, name: 'දොඩම්', audio: audio1, img: number16, typeq: 2 },
    { id: 17, name: 'ස්ට්‍රෝබෙරි', audio: audio1, img: number17, typeq: 2 },
    { id: 18, name: 'කොමඩු', audio: audio1, img: number18, typeq: 2 },
    { id: 19, name: 'අන්නාසි', audio: audio1, img: number19, typeq: 2 },
    { id: 20, name: 'පැපොල්', audio: audio1, img: number20, typeq: 2 }
];

let initStateLoading = true;
let uniKey = 1;
let allQuestions = [];
let allAnswers = [];
let allReplies = [];
let playedOnce = true;

export default function GameScreen3({ navigation }) {

    useKeepAwake();
    changeScreenOrientation();

    const [sound, setSound] = React.useState();
    const [initstateloading, setInitstateloading] = React.useState(true);
    const [soundsstatus, setSoundsstatus] = React.useState(true);
    const [newquestions, setNewquestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([false, false, false, false, false, false, false, false, false, false]);
    const [answer, setAnswer] = React.useState([]);
    const [showloading, setShowloading] = React.useState(true);
    const [showanswercheck, setShowanswercheck] = React.useState(0);
    const [whichanswer, setWhichanswer] = React.useState(falseImg);

    if (initstateloading == true) {
        getNewQuestionProcess();
    }

    console.log(getTrueAnswers());

    if (allQuestions.length == 10) {
        save('game3', getTrueAnswers());
    }

    async function getNewQuestionProcess() {
        setInitstateloading(false);
        uniKey++;
        getNewQuestion().then((newquestionsTempArray) => {
            getAnswer(newquestionsTempArray).then((newanswerrecord) => {
                console.log(soundsstatus);
                if (soundsstatus == true && allQuestions.length < 10) {
                    playedOnce = true;
                    playSound(newanswerrecord.audio);
                }

                if (allQuestions.length == 10 && soundsstatus == true) {
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
        if (playedOnce && soundsstatus == true) {
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
        if (allQuestions.length == 11) {
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
                                        <TouchableOpacity onPress={() => {
                                                uniKey = 1;
                                                allQuestions = [];
                                                allAnswers = [];
                                                allReplies = [];
                                                playedOnce = true;
                                                navigation.goBack();
                                            }}>
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
                                        <View style={{ flex: 1, height: '100%', width: '100%', }}>
                                            <TouchableOpacity onPress={() => {
                                                setSoundsstatus((soundsstatus == false) ? true : false);
                                            }}>
                                                <ImageBackground source={(soundsstatus == false) ? soundon : soundoff} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                            </TouchableOpacity>
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
                                    }}>ලකුණු {getTrueAnswers()} යි.</Text>
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
                                        <View style={{ flex: 1, height: '100%', width: '100%', }}>
                                            <TouchableOpacity onPress={() => {
                                                setSoundsstatus((soundsstatus == false) ? true : false);
                                            }}>
                                                <ImageBackground source={(soundsstatus == false) ? soundon : soundoff} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                            </TouchableOpacity>
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
                                    }}>{(answer) ? answer.name : 'Nan'} {(answer.typeq == 1) ? 'එලවලුව' : 'පලතුර'}  තෝරන්න</Text>
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
                                                    <ImageBackground key={ques.id + uniKey} source={ques.img} resizeMode='contain' style={{
                                                        position: 'absolute', width: '100%', height: '100%', borderWidth: 3,
                                                        borderRadius: 200,
                                                        backgroundColor: 'white',
                                                        width: '100%',
                                                        height: '100%',
                                                    }} />
                                                    <ImageBackground source={whichanswer} resizeMode='contain' style={{ position: 'absolute', width: '100%', height: '100%', opacity: (showanswercheck == ques.id) ? 1.0 : 0.0 }} />
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

    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
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
        if (soundsstatus) {
            playedOnce = true;

            setShowanswercheck(answerid);
            setWhichanswer((answerid == answer.id) ? trueImg : falseImg);
            await playSound((answerid == answer.id) ? correct_voice : wrong_voice).then(() => {
                setTimeout(() => {
                    setShowanswercheck(0);
                    setShowloading(true);
                    answers[allQuestions.length - 1] = (answerid == answer.id) ? true : false;
                    setAnswers(answers);
                    allReplies.push((answerid == answer.id) ? true : false);
                    getNewQuestionProcess();
                }, 1000);
            });
        } else {
            setShowloading(true);
            answers[allQuestions.length - 1] = (answerid == answer.id) ? true : false;
            setAnswers(answers);
            allReplies.push((answerid == answer.id) ? true : false);
            getNewQuestionProcess();
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
