import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import * as ImagePicker from 'expo-image-picker';
import { commonPost } from "../components/functions.js";
import Carousel , {Pagination} from "react-native-snap-carousel";
import Background from './Background';

var coinsIcon = require("../assets/Images/coins.png");
var cards = require("../assets/Images/cards_credit.png");
var vaccount = require("../assets/Images/network_account.png");
var mtransfer = require("../assets/Images/transfer.png")


const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT);

function CouponCard({navigation, route, color_first, color_darker_second, four_array, width, height, onTap}) {
    
    if(four_array){
    if(four_array.answerd==1){
        color_first = '#198754';   
    }
    if(four_array.answerd==2){
        color_first = '#ffc107';   
    }
   }
    return(
        <TouchableOpacity style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", backgroundColor: color_first, width: width, height: height, borderRadius: 16, padding: 10, margin: 10, opacity: 0.75}} onPress={() => onTap(four_array.id,four_array.answerd)}>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
                <Image source={mtransfer} style={{width: 30, height: 30, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 2}}>
                </Image>
                <View style={{backgroundColor: color_darker_second, alignSelf: "center", justifyContent: "center", alignItems: "center", width: 40, height: 40, borderRadius: 10}}>
                    <Text style={{...customstyles.h5, fontSize: 15, fontWeight: "normal", color: "white"}}>
                        ${four_array.data_share_price + four_array.open_to_contact_price}
                    </Text>
                </View>
            </View>
            <View style={{display: "flex", flexDirection: "column"}}>
                <Text style={{...customstyles.h5, fontSize: 15, fontWeight: "bold", marginBottom: 2, color: "white"}}>
                    {four_array.offer_title}
                </Text>
                <Text style={{...customstyles.h5, fontSize: 12.5, fontWeight: "bold", color: "white"}}>
                    from {four_array.comp_name}
                </Text>
            </View>
        </TouchableOpacity>
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

export default CouponCard;


