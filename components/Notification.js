import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import * as ImagePicker from 'expo-image-picker';
import { commonPost } from "../components/functions.js";
import Background from './Background';

const currImage = require("../assets/Images/new_background.jpg");

function Notification({ navigation, route }) {
    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                        <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: "#662397", fontSize: 25, fontWeight: "bold", ...customstyles.flexgrow1, marginLeft: 10}}>Notifications</Text>
            </View>
            <ScrollView style={styles.innerView}>
                <View style={styles.container}>

                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    scrollArea: {
        flex: 1,
        width: "100%",
        backgroundColor: "white",
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 10,
    }
});

export default Notification;


