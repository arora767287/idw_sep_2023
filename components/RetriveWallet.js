import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, ActivityIndicator} from 'react-native';
import { customstyles } from "../customstyle";
import Loader from './Loader';
import { Ionicons } from '@expo/vector-icons';
import { retriveWallet } from './functions';
import Background from './Background';
import MyTabs from './MyTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { ObjectNotInActiveTierError } from '@aws-sdk/client-s3';

function RetriveWallet({ navigation, route }) {

    const [notActive, setNotActive] = useState(true);
    const [userId, setuserId] = useState('');
    const [loader, setLoader] = useState(false);
    const [wallet, setWallet] = useState('');
    const [holder, setHolder] = useState([]);
    const [issueDate, setDates] = useState([]);
    const [walletStatus, setWalletStatus] = useState('');

    useEffect(() => {
        const value = AsyncStorage.getItem('userInfo').then((value) => {
            setuserId(JSON.parse(value).id);
            retriveUserWallet(JSON.parse(value).id);
        })
    }, []);


    let retriveUserWallet = (user_id) => {
        var resp = retriveWallet(user_id)
            .then(resp => {
                console.log("resp", resp);
                console.log("EqualValue", resp.code == 400);
                if(resp.code == 400 && resp.description == "User is currently inactive") {                
                    setTimeout(() => {
                        setNotActive(true);
                        setLoader(true);    
                    }, 1000);
                } else {
                    setWallet(resp.number);
                    setHolder(resp.holder.name);
                    setDates(resp.date);
                    setWalletStatus(resp.status.text);
                    setTimeout(() => {
                        setLoader(true);
                        setNotActive(false)
                    }, 1000);
                }
            })
            .catch((error) => {
                console.log(error)
                throw error;
            })
    }

    if (!loader) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{display: "flex", flexDirection: "row", marginLeft: 15, marginTop: 10, marginBottom: 20, justifyContent: "center", alignItems: "center"}}>
                <View style={{alignSelf: "center", justifyContent: "center", padding: 15, marginLeft: -15}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { justifyContent: "center", alignSelf: "center"}]}>
                        <Ionicons name="md-chevron-back-outline" size={20} color="white" style={{alignSelf: "center"}} />
                    </TouchableOpacity>
                </View>         
                <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, alignSelf: "center", justifyContent: "center"}}>View Wallet</Text>
            </View>     
            <ScrollView style={styles.innerView}>
                {!notActive &&
                <View>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                label={<Text>Wallet Name</Text>}
                                value={holder}
                                style={{...otherStyles.textInputDesign}}
                                theme={{ colors: { text: "#662397"} }}
                                editable={false}
                            />
                        </View>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                label={<Text>Wallet Number</Text>}
                                value={wallet}
                                style={{...otherStyles.textInputDesign}}
                                theme={{ colors: { text: "#662397"} }}
                                editable={false}
                            />
                        </View>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                label={<Text>Wallet Expiry Date</Text>}
                                value={issueDate.expiry}
                                style={{...otherStyles.textInputDesign}}
                                theme={{ colors: { text: "#662397"} }}
                                editable={false}
                            />
                        </View>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                    label={<Text>Wallet Issue Date</Text>}
                                    value={issueDate.issued}
                                    style={{...otherStyles.textInputDesign}}
                                    theme={{ colors: { text: "#662397"} }}
                                    editable={false}
                                />
                        </View>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                    label={<Text>Wallet Status</Text>}
                                    value={walletStatus}
                                    style={{...otherStyles.textInputDesign}}
                                    theme={{ colors: { text: "#662397"} }}
                                    editable={false}
                                />
                        </View>
                    </View>
                    }
                        {notActive && loader &&
                        <View style={{display: "flex", justifyContent: "center", alignSelf: "center", width: "90%"}}>
                            <Text style={{fontSize: 15, color: "black", textAlign: "center", fontWeight: "bold", marginBottom: 20}}>
                                Your MatchMove account has been deactivated.
                            </Text>
                            <TouchableOpacity style={customstyles.btnThemexs} onPress={this.onPressWallet} >
                                <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                    <Text style={{color: "#662397", padding: 5}}>Reactivate Account</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }

            </ScrollView>
        </SafeAreaView>
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
        // flex: 1,
        width: "100%",
        paddingHorizontal: 20,
        marginLeft: "auto",
        marginRight: "auto",
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
        borderRadius:10,
        borderWidth: 1, 
        borderColor: "#662397"
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

export default RetriveWallet;