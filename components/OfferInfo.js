import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Alert, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, ActivityIndicator, ImageBackground, Dimensions} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput } from "react-native-paper"
import { customstyles } from "../customstyle";
import Loader from './Loader';
import { Ionicons } from '@expo/vector-icons';
import { ViewCards, activateCard, getCardById, commonPost } from './functions';
import Background from './Background';
import Dialog from "react-native-dialog";
import MyTabs from './MyTabs';
import Carousel, {Pagination} from "react-native-snap-carousel";

const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT);
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)

var mtransfer = require("../assets/Images/transfer.png")

function OfferInfo({ navigation, route, comp_name, offer_title, data_share_price, open_to_contact_price, offer_description, four_array}) {
//navigation={this.props.navigation} route={this.props.route} comp_name={this.state.offervalue1} offer_title={this.state.offervalue2} data_share_price={this.state.offervalue3}open_to_contact_price={this.state.offervalue4} offer_description={this.state.offervalue5}
    return (
        <View style={{width: "100%"}}>
            <ScrollView>
                <View style={{display: "flex", flexDirection: "column", width: "95%", alignSelf: "center", alignItems: "center", backgroundColor: "transparent", flex: 10}}>
                    <View style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", borderColor: "#20004A", borderWidth: 0, borderRadius: 16, padding: 10, margin: 10, opacity: 1, width: "95%"}}>
                        <View style={{display: "flex", flexDirection: "row", marginBottom: 5, alignItems: "center", justifyContent: "space-between"}}>
                            <View style={{display: "flex", flexDirection: "column"}}>
                                <Text style={{...customstyles.h5, fontSize: 20, fontWeight: "bold", marginBottom: 2, marginRight: 20, color: "#20004A"}}>
                                    {offer_title}
                                </Text>
                                <View style={{display: "flex", justifyContent: "flex-start", alignSelf: "flex-start", alignItems: "center", flexDirection: "row"}}>
                                    <Image source={mtransfer} style={{width: 20, height: 20, padding: 10, alignSelf: "center", borderColor: "#20004A", borderRadius: 10, borderWidth: 2}}></Image>
                                    <Text style={{...customstyles.h5, fontSize: 10, fontWeight: "bold", marginBottom: 2, marginRight: 20, color: "#20004A", marginLeft: 4, alignSelf: "center"}}>{comp_name}</Text>
                                </View>
                            </View>
                            <View style={{borderColor: "#20004A", backgroundColor: "white", borderWidth: 2, alignSelf: "center", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: 10}}>
                                <Text style={{...customstyles.h5, fontSize: 15, fontWeight: "normal"}}>
                                    ${data_share_price + open_to_contact_price}
                                </Text>
                            </View>
                        </View>
                        <View style={{display: "flex", flexDirection: "column"}}>
                            <Text style={{...customstyles.h5, fontSize: 10, fontWeight: "normal", color: "#20004A"}}>
                                {offer_description}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{display: "flex", flex: 1}}>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollArea: {
        flex: 1,
        width: "100%",
        backgroundColor: "white"
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        // paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 60,
    },
})

const otherStyles = StyleSheet.create({
    textInputDesign: {
        backgroundColor: "transparent",
        fontFamily: "Thonburi"
    },
    tranGreenBackground: {
        width: "100%",
        backgroundColor: "#6df291",
        borderColor: "black",
        borderWidth: 1,
        flexDirection: "row",
        borderRadius: 4,
        flex: 1.5,
        marginBottom: 7.5,

    },
    tranRedBackground: {
        width: "100%",
        backgroundColor: "#f27d6d",
        borderColor: "black",
        borderWidth: 1,
        flexDirection: "row",
        borderRadius: 4,
        flex: 1.5,
        marginBottom: 7.5,

    },
    imageStyle: {
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
        borderRadius:10,
        borderWidth: 1, 
        borderColor: "#20004A"
    },
    imageSmallStyle:{
        width: 10,
        height: 10
    },
    titleText:{
        alignSelf: "center",
        fontSize: 15,
        opacity: 0.5,
        fontWeight: "bold"
    },
    dateTimeText:{
        fontSize: 10,
        opacity: 0.5,
    },
    textView:{
        flexDirection: "column",
        display: "flex",
        alignItems: 'center',
        justifyContent: "center"
    },
    secondTextView:{
        flexDirection: "column",
        padding:2.5,
        marginLeft: "auto",
        alignSelf: "center",
    }


});
export default OfferInfo;
