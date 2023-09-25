import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native'

function TranItem(time, amount, brand_name, imagepath, title){
    var currImage = require("../assets/Images/transfer.png");
    var amountType = false;
    if(amount >= 0){
        amountType = true;
    }
    return(
        <View style={styles.tranBackground}>
            <Image source={currImage} style={styles.imageStyle}></Image>
            <View style={styles.textView}>
                { amountType ?
                    <Text style={styles.titleText}>+${amount}</Text>
                :
                    <Text style={styles.titleText}>-${amount}</Text>
                } 
                <Text style={styles.dateTimeText}>{title}</Text>
                <Text style={styles.dateTimeText}>{time}</Text>
            </View>
            <Text style={styles.brandNameText}>{brand_name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tranBackground: {
        width: "80%",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 10,
        flexDirection: "row"
    },
    imageStyle: {
        width: 50,
        height: 50
    },
    textView:{
        flexDirection: "column"
    },
    titleText:{
        fontSize: 20,
        color: "#663297",
    },
    dateTimeText: {
        fontSize: 20,
        color: "#663297",
    },
    brandNameText:{
        alignSelf: "flex-end",
        fontSize: 10,
        opacity: 0.5,
    }


});


export default TranItem;