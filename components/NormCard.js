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
var dataoffer = require("../assets/Images/encrypted.png")
var megaphone = require("../assets/Images/megaphone.png")


const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT);

function NormCard({navigation, route, color_first, text_color, color_darker_second, four_array, width, height, onTap, showDescription, touchableOn, list_offer_ids}) {
    const checkSubscribeIntersect = (offer_id) => {
        let result = list_offer_ids;
        for(let i = 0; i<result.length; i++){
            var currOffer = result[i]
            if(currOffer == offer_id){
                console.log(currOffer)
                return false;
            }
        }
        return true;
    }
    var text_color = text_color
    if(!onTap){
        onTap = () => {};
    }
    if(list_offer_ids && !checkSubscribeIntersect(four_array.id) && four_array.answerd != 2){
        onTap = () => {
            Alert.alert(
                'You\'re already in!',
                'You\'ve already subscribed to this offer. Click on subscribed to look at the offers you\'re already signed up for.',
                [
                    { text: 'OK', onPress: () => {} },
                ]
            );
        };
    }
    if(four_array.answerd==1 || four_array.answerd == 0){
        color_first = '#198754';   
        text_color = "white"
    }
    if(four_array.answerd==2){
        color_first = '#ebeab7';   
        text_color = "#662397"
    }
    if(touchableOn || four_array.answerd==1){
        return(
            <View style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", backgroundColor: color_first, width: width, height: height, borderRadius: 16, padding: 5, margin: 10, opacity: 1, padding: 10, paddingBottom:10}} onPress={() => onTap(four_array.id,four_array.answerd)}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
                    {
                    four_array.offer_type == '1' ?
                    <Image source={dataoffer} style={{width: 25, height: 25, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0}}>
                    </Image> : 
                    four_array.offer_type == '2' ?
                    <Image source={megaphone} style={{width: 25, height: 25, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0}}></Image> :
                    <View style={{display: "flex", flexDirection: "row", alignItems: "flex-start"}}>
                        <Image source={dataoffer} style={{width: 20, height: 20, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0, marginRight: 5}}>
                        </Image>
                        <Image source={megaphone} style={{width: 20, height: 20, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0}}></Image> 
                    </View>
                    }
                    <View style={{backgroundColor: "white", alignSelf: "center", justifyContent: "center", alignItems: "center", width: 65, height: 40, borderRadius: 10}}>
                        <Text style={{...customstyles.h5, fontSize: 12, fontWeight: "normal", color: "#662397"}}>
                            ${four_array.data_share_price + four_array.open_to_contact_price}
                        </Text>
                    </View>
                </View>
                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{...customstyles.h5, fontSize: 15, fontWeight: "bold", marginBottom: 2, color: text_color}}>
                        {four_array.offer_title}
                    </Text>
                    <Text style={{...customstyles.h5, fontSize: 12.5, fontWeight: "bold", color: text_color}}>
                        from {four_array.comp_name}
                    </Text>
                </View>
            </View>
        )
    } else {
        return(
            <TouchableOpacity style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", backgroundColor: color_first, width: width, height: height, borderRadius: 16, padding: 5, margin: 10, opacity: 1, padding: 10, paddingBottom: 10}} onPress={() => onTap(four_array.id,four_array.answerd)}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
                    {
                    four_array.offer_type == '1' ?
                    <Image source={dataoffer} style={{width: 25, height: 25, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0}}>
                    </Image> : 
                    four_array.offer_type == '2' ?
                    <Image source={megaphone} style={{width: 25, height: 25, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0}}></Image> :
                    <View style={{display: "flex", flexDirection: "row", alignItems: "flex-start"}}>
                        <Image source={dataoffer} style={{width: 25, height: 25, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0, marginRight: 5}}>
                        </Image>
                        <Image source={megaphone} style={{width: 25, height: 25, alignSelf: "center", borderColor: "white", borderRadius: 10, borderWidth: 0}}></Image> 
                    </View>
                    }
                    <View style={{backgroundColor: color_darker_second, alignSelf: "center", justifyContent: "center", alignItems: "center", width: 70, height: 40, borderRadius: 10}}>
                        <Text style={{...customstyles.h5, fontSize: 15, fontWeight: "normal", color: "white"}}>
                            ${four_array.data_share_price + four_array.open_to_contact_price}
                        </Text>
                    </View>
                </View>
                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{...customstyles.h5, fontSize: 15, fontWeight: "bold", marginBottom: 2, color: text_color}}>
                        {four_array.offer_title}
                    </Text>
                    <Text style={{...customstyles.h5, fontSize: 12.5, fontWeight: "bold", color: text_color}}>
                        from {four_array.comp_name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
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

export default NormCard;


