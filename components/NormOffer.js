import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import * as ImagePicker from 'expo-image-picker';
import { commonPost } from "../components/functions.js";
import Carousel , {Pagination} from "react-native-snap-carousel";
import Background from './Background';
import NormCard from "./NormCard";

const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 25;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT);
const window_width = Dimensions.get('window').width/2 - 40;
const window_height = window_width;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT);


function NormOffer({navigation, route, four_array, openFunction, list_offer_ids}) {
    const color_list = ["#fff", "#fff", "#fff", "#fff"]
    const color_darker_list = ["#371252", "#261559", "#14145e", "#173966"]
    if(four_array.length == 4){
        return(
        <View style={{display: "flex", flexDirection: "row"}}>
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <NormCard color_first={color_list[0]} color_darker_second={color_darker_list[0]} four_array={four_array[0]} width={window_width} height={SLIDER_HEIGHT/2 + 5} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
                <NormCard color_first={color_list[1]} color_darker_second={color_darker_list[1]} four_array={four_array[1]} width={window_width} height={SLIDER_HEIGHT/2 + 5} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
            </View>
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <NormCard color_first={color_list[2]} color_darker_second={color_darker_list[0]} four_array={four_array[2]} width={window_width} height={SLIDER_HEIGHT/2 + 5} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
                <NormCard color_first={color_list[3]} color_darker_second={color_darker_list[1]} four_array={four_array[3]} width={window_width} height={SLIDER_HEIGHT/2 + 5} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
            </View>
        </View>
        )
    }
    else if(four_array.length == 3){
        return(
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <NormCard color_first={color_list[0]} color_darker_second={color_darker_list[0]} four_array={four_array[0]} width={window_width} height={SLIDER_HEIGHT/2 + 5} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
                    <NormCard color_first={color_list[1]} color_darker_second={color_darker_list[1]} four_array={four_array[1]} width={window_width} height={SLIDER_HEIGHT/2 + 5} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
                </View>
                <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <NormCard color_first={color_list[2]} color_darker_second={color_darker_list[2]} four_array={four_array[2]} width={2*window_width + 20} height={SLIDER_HEIGHT/2 + 5} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
                </View>
            </View>
        )
    }
    else if(four_array.length == 2){
        return(
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <NormCard color_first={color_list[0]} color_darker_second={color_darker_list[0]} four_array={four_array[0]} width={300} height={115} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
                <NormCard color_first={color_list[2]} color_darker_second={color_darker_list[1]} four_array={four_array[1]} width={300} height={115} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
            </View>
        )
    }
    else if(four_array.length == 1){
        return(
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <NormCard color_first={color_list[3]} color_darker_second={color_darker_list[0]} four_array={four_array[0]} width={300} onTap={openFunction} list_offer_ids={list_offer_ids}/> 
            </View>
        )
    }
    else{
        return(
            <View></View>
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

export default NormOffer;


