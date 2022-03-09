import React from "react";
import { useKeepAwake } from "expo-keep-awake";
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { Audio } from "expo-av";
import grass from "../assets/grass_bg.png";
import goback from "../assets/goback.png";
import trueImg from "../assets/true.png";
import falseImg from "../assets/false.png";
import soundon from "../assets/soundon.png";
import soundoff from "../assets/soundoff.png";
import correct from "../assets/correct.png";
import wrongorempty from "../assets/wrongorempty.png";
import correct_voice from "../assets/correct_voice.mp3";
import wrong_voice from "../assets/wrong_voice.mp3";
import whatisred from "../assets/whatisred.mp3";
import finish from "../assets/finish.mp3";
import finishgif from "../assets/gif/finish.gif";

const cardGap = 20;

const displayWidth = Dimensions.get("window").width;
const displayHeight = Dimensions.get("window").height;

const gameQuestions = [
  { id: 1, name: "Blue", audio: whatisred, color: "#0D47A1" },
  { id: 2, name: "White", audio: whatisred, color: "#FAFAFA" },
  { id: 3, name: "Black", audio: whatisred, color: "#212121" },
  { id: 4, name: "Red", audio: whatisred, color: "#D50000" },
  { id: 5, name: "Yellow", audio: whatisred, color: "#FFFF00" },
];

let uniKey = 1;
let allQuestions = [];
let allAnswers = [];
let allReplies = [];
let playedOnce = true;

export default function GameScreen4({ navigation }) {
  useKeepAwake();
  changeScreenOrientation();

  const [isrecording, setIsrecording] = React.useState(false);
  const [recording, setRecording] = React.useState();
  const [sound, setSound] = React.useState();
  const [initstateloading, setInitstateloading] = React.useState(true);
  const [soundsstatus, setSoundsstatus] = React.useState(true);
  const [newquestions, setNewquestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [answer, setAnswer] = React.useState([]);
  const [showloading, setShowloading] = React.useState(true);
  const [showanswercheck, setShowanswercheck] = React.useState(0);
  const [whichanswer, setWhichanswer] = React.useState(falseImg);

  if (initstateloading == true) {
    getNewQuestionProcess();
  }

  console.log(getTrueAnswers());

  if (allQuestions.length == 10) {
    save("game1", getTrueAnswers());
  }

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      setIsrecording(false);
      console.log("Stopping recording..");
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);

      console.log("Uploading " + uri);
      let apiUrl = "https://punchipanchi.herokuapp.com/predict";
      let uriParts = uri.split(".");
      let fileType = uriParts[uriParts.length - 1];

      let formData = new FormData();
      formData.append("audio", {
        uri,
        name: 'recording.wav',
        type: 'audio/wav; codecs=MS_PCM',
      });

      let options = {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      console.log((await fetch(apiUrl, options)).status);
    } catch (error) {
      console.log(error);
    }
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

        if (isrecording == false) {
          startRecording().then(() => setIsrecording(true));
        }
      });
    });
  }

  if (isrecording == true) {
    console.log("Stopping recording in 5 secs..");
    const pressHandler = () => {
      stopRecording();
    };

    setTimeout(pressHandler, 5000);
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
        <LinearGradient
          colors={["#00796B", "#00796B", "#2E7D32"]}
          style={styles.linearGradient}
        >
          <View style={styles.container}>
            <ImageBackground
              source={grass}
              resizeMode="cover"
              style={styles.imageGrass}
            />
            <Text style={{ textAlign: "center" }}>Loading</Text>
          </View>
        </LinearGradient>
      </View>
    );
  } else {
    if (allQuestions.length == 11) {
      return (
        <View style={styles.bgcontainer}>
          <LinearGradient
            colors={["#00796B", "#00796B", "#2E7D32"]}
            style={styles.linearGradient}
          >
            <View style={styles.container}>
              <ImageBackground
                source={grass}
                resizeMode="cover"
                style={styles.imageGrass}
              />

              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "absolute",
                  height: displayWidth,
                  width: displayHeight,
                  paddingTop: 30,
                }}
              >
                <View
                  style={{
                    flex: 2,
                    width: displayHeight,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: displayHeight,
                      flexWrap: "nowrap",
                      height: "100%",
                    }}
                  >
                    <View style={{ flex: 1, height: "100%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          uniKey = 1;
                          allQuestions = [];
                          allAnswers = [];
                          allReplies = [];
                          playedOnce = true;
                          setInitstateloading(true);
                          navigation.goBack();
                        }}
                      >
                        <ImageBackground
                          source={goback}
                          resizeMode="contain"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 10, height: "100%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          width: "100%",
                          flexWrap: "nowrap",
                          height: "100%",
                        }}
                      >
                        {answers.map((val, index) => {
                          return (
                            <View key={index + "answer"} style={{ flex: 1 }}>
                              <ImageBackground
                                source={
                                  answers[index] == true
                                    ? correct
                                    : wrongorempty
                                }
                                resizeMode="contain"
                                style={{ width: "100%", height: "100%" }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View style={{ flex: 1, height: "100%", width: "100%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          setSoundsstatus(soundsstatus == false ? true : false);
                        }}
                      >
                        <ImageBackground
                          source={soundsstatus == false ? soundon : soundoff}
                          resizeMode="contain"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FAFAFA",
                      marginLeft: cardGap,
                      position: "absolute",
                      textAlign: "center",
                      left: 0,
                      right: 0,
                      fontSize: 30,
                      justifyContent: "center",
                    }}
                  >
                    ලකුණු {getTrueAnswers()} යි.
                  </Text>
                </View>
                <View
                  style={{
                    flex: 3,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={finishgif}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      );
    } else {
      return (
        <View style={styles.bgcontainer}>
          <LinearGradient
            colors={["#00796B", "#00796B", "#2E7D32"]}
            style={styles.linearGradient}
          >
            <View style={styles.container}>
              <ImageBackground
                source={grass}
                resizeMode="cover"
                style={styles.imageGrass}
              />

              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "absolute",
                  height: displayWidth,
                  width: displayHeight,
                  paddingTop: 30,
                }}
              >
                <View
                  style={{
                    flex: 2,
                    width: displayHeight,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: displayHeight,
                      flexWrap: "nowrap",
                      height: "100%",
                    }}
                  >
                    <View style={{ flex: 1, height: "100%" }}>
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ImageBackground
                          source={goback}
                          resizeMode="contain"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 10, height: "100%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          width: "100%",
                          flexWrap: "nowrap",
                          height: "100%",
                        }}
                      >
                        {answers.map((val, index) => {
                          return (
                            <View key={index + "answer"} style={{ flex: 1 }}>
                              <ImageBackground
                                source={
                                  answers[index] == true
                                    ? correct
                                    : wrongorempty
                                }
                                resizeMode="contain"
                                style={{ width: "100%", height: "100%" }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View style={{ flex: 1, height: "100%", width: "100%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          setSoundsstatus(soundsstatus == false ? true : false);
                        }}
                      >
                        <ImageBackground
                          source={soundsstatus == false ? soundon : soundoff}
                          resizeMode="contain"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FAFAFA",
                      marginLeft: cardGap,
                      position: "absolute",
                      textAlign: "center",
                      left: 0,
                      right: 0,
                      fontSize: 30,
                      justifyContent: "center",
                    }}
                  >
                    What is {answer ? answer.name : "Nan"} ?
                  </Text>
                </View>
                <View style={{ flex: 2, marginBottom: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: displayHeight,
                      flexWrap: "nowrap",
                      height: "100%",
                    }}
                  >
                    {newquestions.map((ques, i) => {
                      return (
                        <TouchableOpacity
                          key={ques.id + uniKey}
                          onPress={() => checkForAnswer(ques.name)}
                          style={{
                            flex: 1,
                            width: "100%",
                            height: "100%",
                            marginLeft: 10,
                            marginRight: 10,
                          }}
                        >
                          <View
                            key={ques.id + uniKey}
                            style={{
                              borderWidth: 3,
                              borderRadius: 200,
                              borderColor: "black",
                              width: "100%",
                              height: "100%",
                              shadowOpacity: 0.2,
                              backgroundColor: ques ? ques.color : "#F4511E",
                            }}
                          ></View>
                          <ImageBackground
                            source={whichanswer}
                            resizeMode="contain"
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              opacity: showanswercheck == ques.id ? 1.0 : 0.0,
                            }}
                          />
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
    return "" + trueRecords;
  }

  async function getAnswer(listQuestions) {
    console.log(listQuestions.length);
    console.log("new answer generated");
    console.log("*******************************");
    return listQuestions[Math.floor(Math.random() * (3 + 1))];
  }

  async function getNewQuestion() {
    var selected4Questions = [];
    let newSuffuled = shuffleArray(gameQuestions);
    for (let index = 0; index < 4; index++) {
      selected4Questions.push(newSuffuled[index]);
    }
    console.log("new question generated");
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

      console.log("ANDWER NAME " + answerid);
      console.log("Real NAME " + answer.name);

      setShowanswercheck(answerid);
      setWhichanswer(answerid == answer.name ? trueImg : falseImg);
      await playSound(
        answerid == answer.name ? correct_voice : wrong_voice
      ).then(() => {
        setTimeout(() => {
          setShowanswercheck(0);
          setShowloading(true);
          answers[allQuestions.length - 1] =
            answerid == answer.name ? true : false;
          setAnswers(answers);
          allReplies.push(answerid == answer.name ? true : false);
          getNewQuestionProcess();
        }, 1000);
      });
    } else {
      setShowloading(true);
      answers[allQuestions.length - 1] = answerid == answer.name ? true : false;
      setAnswers(answers);
      allReplies.push(answerid == answer.name ? true : false);
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
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageGrass: {
    flex: 1,
    width: displayHeight,
  },
  imageExit: {
    position: "absolute",
    top: 0,
    left: 40,
    flex: 1,
    width: "80%",
    height: "80%",
  },
});

async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
  );
}
