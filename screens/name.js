import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { View, ImageBackground,Text, StyleSheet, Dimensions, TextInput } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import grass from '../assets/grass_bg.png'
import exit from '../assets/exit_home.png'
import startbtn from '../assets/start_btn.png'
import homegirl from '../assets/home_girl.png'


export default function Name({ navigation }) {

    useKeepAwake();
    changeScreenOrientation();

    const [text, setText] = React.useState("");

    return (
        <View style={styles.bgcontainer}>
            <LinearGradient colors={['#00796B', '#00796B', '#2E7D32']} style={styles.linearGradient}>
                <View style={styles.container}>
                    <ImageBackground source={grass} resizeMode="cover" style={styles.imageGrass} />
                    <Text style={{ textAlign:'center',top:0, color:'white', fontSize:30 }}>ඔයගෙ නම මොකක්ද ?</Text>
                    <TextInput
                        style={styles.inputfield}
                        onChangeText={setText}
                        onEndEditing={() => {
                            if (text != null && text != '') {
                                save('name', text).then((val) => {
                                    navigation.replace('Categories');
                                });
                            }

                        }}
                        allowFontScaling={true}
                        autoFocus={true}
                        value={text}
                    />
                </View>
            </LinearGradient>
        </View>
    );
}

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

var styles = StyleSheet.create({
    linearGradient: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').height,
    },
    inputfield: {
        height: Dimensions.get('window').width * 0.2,
        width: Dimensions.get('window').height * 0.6,
        margin: 12,
        backgroundColor: '#5D4037',
        borderColor: '#3E2723',
        borderWidth: 10,
        color: 'white',
        fontSize: 40,
        borderRadius: 100,
        padding: 20,
        textAlign:'center'
    },
    bgcontainer: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
    },
    container: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    imageGrass: {
        flex: 1,
        width: Dimensions.get('window').height,
    },
    imageStart: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.8,
    },
});

async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
}
