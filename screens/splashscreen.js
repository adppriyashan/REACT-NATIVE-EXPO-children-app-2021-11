import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { ImageBackground, StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import logoAPP from '../assets/logo.png'

const bgColor = '#FAFAFA';
const textColor = '#757575';
const footerText = 'Developed By Vinuri Hemalka';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    image: {
        flex: 1,
        width: Dimensions.get('window').width * 0.8,
    },
    bgcontainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: bgColor
    },
    textstyle: {
        bottom: 20.0,
        color: textColor
    }
});


export default function SplashScreen({ navigation }) {

    useKeepAwake();
    
    const pressHandler = () => {
        navigation.replace('Home');
    }

    setTimeout(pressHandler, 5000);

    return (
        <View style={styles.bgcontainer}>
            <View style={styles.container}>
                <ImageBackground source={logoAPP} resizeMode="contain" style={styles.image}>
                </ImageBackground>
                <Text style={styles.textstyle}>{footerText}</Text>
            </View>
        </View>
    );

}
