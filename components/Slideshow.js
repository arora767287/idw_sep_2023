import React from 'react';
import { Alert, StyleSheet, View, Button, TouchableOpacity, Text, Image, ImageBackground, Dimensions, ScrollView, Modal} from 'react-native';
import { customstyles } from '../customstyle';
import Icon from 'react-native-ionicons'
import TranItem from "./TranItem";
import {getBalance, transactionlist, commonPost} from "./functions.js";
import { AntDesign } from '@expo/vector-icons'; 
import Dialog from "react-native-dialog";
import SearchBar from "react-native-dynamic-search-bar";
import Loader from "./Loader";
import Moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, {Pagination} from "react-native-snap-carousel";
import firstPage from "./Images/final.png";
import secondPage from "./Images/final2.png";
import thirdPage from "./Images/final3.png";
import PaginationDot from "react-native-animated-pagination-dot";

function Slideshow({ route, navigation }){
    const SLIDER_WIDTH = Dimensions.get('window').width;
    const SLIDER_HEIGHT = Dimensions.get('window').height;
    const [activeIndex, setActiveIndex] = React.useState(0);
    const ref = React.useRef(null);
    var arrayImages = [firstPage, secondPage, thirdPage, "Hello"]
    const homeRender = () => {navigation.navigate("HomeScreen")};
    //console.log("CURRENTINDEX: ", activeIndex);
    const renderItem = React.useCallback(({ item, index }) => (

        activeIndex != 3 ?
            <Image source={arrayImages[index]}  style={{width: "100%", height: "100%"}}>
            </Image> :
            <TouchableOpacity onPress={()=> navigation.navigate("HomeScreen")} style={{width: "100%", height: "100%"}}>
                <Image source={arrayImages[index]}>
                 </Image>
            </TouchableOpacity>
      ), []);
      const handleNavigate = (index) => {
        if(index < 3){
            setActiveIndex(index)
        } else {
            navigation.navigate("HomeScreen")
            Alert.alert(
                'Email Verification',
                'Thanks for registering! We\'ve sent you a verification email. Please check your inbox to verify your account before trying to log in.',
                [
                    { text: 'OK', onPress: () => {} },
                ]
            );
        }
      }
    return (

        <View style={{display: "flex", alignSelf: "center", backgroundColor: "#20004A"}}>
            <Carousel
            layout="default"
            ref={ref}
            data={arrayImages}
            sliderWidth={SLIDER_WIDTH}
            sliderHeight={SLIDER_HEIGHT}
            style={{display: "flex", justifyContent: "center", alignSelf: "center"}}
            itemWidth={SLIDER_WIDTH}
            renderItem={renderItem}
            onSnapToItem={(index) => handleNavigate(index)}
            /> 
            <View style={{display: "flex", flexDirection: "row", alignSelf: "center"}}>
                <View style={{paddingTop: 10, alignSelf: "center", display: "flex", flexDirection: "column", marginBottom: 40}}>
                    <PaginationDot
                        activeDotColor={'#fff'}
                        curPage={activeIndex}
                        sizeRatio={0.5}
                        maxPage={3}
                    />
                </View>
            </View>
        </View> 
    )
}

export default Slideshow;