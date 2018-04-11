import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
var Spinner = require('react-native-spinkit');
import { getFont } from '../utils/font';

const styles = StyleSheet.create({
    loading:{
        height:'100%',
        width:'100%',
        zIndex:999,
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        ...getFont('ExtraLight'),
        fontSize:28,
        textAlign:'center',
        marginLeft:40,
        marginRight:40,
    }
})

const Loading = (props) => (
    <View
        style={styles.loading}
        isVisible={props.loading}>
        <Spinner isVisible={props.loading} size={100} type='Bounce' color='red'/>
        <Text style = {styles.text}>{props.text}</Text>
    </View>
)

export default Loading;