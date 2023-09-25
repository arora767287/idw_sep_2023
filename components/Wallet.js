import React, { useEffect, useState } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
import { commonPost } from './functions';
import Background from './Background';
import Dialog from "react-native-dialog";

function Wallet({ navigation, route }) {

    const [userId, setuserId] = useState('');
    const [succResp, setSuccResp] = useState('');
    const [errResp, setErrResp] = useState('');
    const [visible, setVisible] = useState(false);
    const [virtualDetail, setVirtual] = useState([]);
    const currImage = require("../assets/Images/new_background.jpg");

    useEffect(() => {
        let userId = route.params.user_id;
        setuserId(userId);
        console.log(userId + 'Wallet');
    }, []);

    let retriveWallet = () => {
        /*
        navigation.navigate('RetriveWallet', {
            user_id: userId,
        })
        */
       navigation.navigate("NewWallet", {user_id: userId});
    }
    let showCard = () => {
        navigation.navigate('ViewCard', { user_id: userId });
    }

    // Create Wallet 
    let createCards = () => {

        Alert.alert(
            'Create Card',
            'Are you sure you want to create a new Card?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => confirmCreate() },
            ]
        );

        let confirmCreate = () => {
            let data = {
                id: userId,
                api_url: 'createCard'
            }

            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    console.log(result);
                    let status = result.code;
                    if ((status == 400)) {
                        setErrResp(result.description);
                        setTimeout(() => {
                            setErrResp('');
                        }, 4000);
                    } else {
                        setSuccResp(result.description);
                        setTimeout(() => {
                            setSuccResp('');
                        }, 4000);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
    // Close

    let createVirtualCard = () => {
        let data = {
            id: userId,
            type: 'create',
            api_url: 'virtualAccount'
        }
        var response = commonPost(data)
            .then(res => {
                console.log(res);
                let code = res.code;
                let message = res.description;
                if ((code == 400)) {
                    setErrResp(message);
                    setTimeout(() => {
                        setErrResp('');
                    }, 4000);
                } else {
                    setSuccResp('Virtual Account Created Successfully');
                    setTimeout(() => {
                        setSuccResp('');
                    }, 4000);
                }

            })
            .catch(error => console.log(error));
    }

    const handleOpen = () => {
        setVisible(true);
        let data = {
            id: userId,
            type: 'getaccount',
            api_url: 'virtualAccount'
        }
        var response = commonPost(data)
            .then(res => {
                //console.log(res.data[0].fast_accounts);
                setVirtual(res.data[0].fast_accounts);
            })
            .catch(error => console.log(error));
    };
    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <SafeAreaView style={styles.scrollArea}>
            <ImageBackground source={currImage} style={{width: "100%", height: "100%"}}>
            <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                <Text style={{ ...customstyles.headerHeading, ...customstyles.flexgrow1, }}>Wallet</Text>
            </View>
            <ScrollView style={styles.innerView}>
                <View style={styles.container}>
                    {
                        succResp != '' && <Text style={{ color: 'green' }}>{succResp}</Text>
                    }
                    {
                        errResp != '' && <Text style={{ color: 'red' }}>{errResp}</Text>
                    }

                    <View>
                        {
                            virtualDetail.length > 0 &&

                            <Dialog.Container visible={visible}>
                                <View style={{ ...customstyles.mb15 }}>
                                    <Text style={{ ...customstyles.textCenter, ...customstyles.h2 }}>Virtual Account Details</Text>
                                </View>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Account Number:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].account_number != '' && virtualDetail[0].account_number}</Text>
                                    </View>
                                </View>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Holder Name:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].bank_holder_name != '' && virtualDetail[0].bank_holder_name}</Text>
                                    </View>
                                </View>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Bank Account Limit:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].bank_account_limit != '' && virtualDetail[0].bank_account_limit}</Text>
                                    </View>
                                </View>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.p5, ...customstyles.bglight }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Bank Bic:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].bank_bic != '' && virtualDetail[0].bank_bic}</Text>
                                    </View>
                                </View>

                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.p5, ...customstyles.bglight }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Status:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].status != '' && virtualDetail[0].status}</Text>
                                    </View>
                                </View>
                                <View style={customstyles.textCenter}>
                                    <Dialog.Button label="Add Bank Account" onPress={handleCancel} style={customstyles.btnRedsmall} />
                                </View>
                                <View style={customstyles.textCenter}>
                                    <Dialog.Button label="Add Beneficary Account" onPress={handleCancel} style={customstyles.btnRedsmall} />
                                </View>
                                <View style={customstyles.textCenter}>
                                    <Dialog.Button label="Close" onPress={handleCancel} style={customstyles.btnRedsmall} />
                                </View>
                            </Dialog.Container>
                        }
                    </View>

                    <View style={{ ...customstyles.row, ...customstyles.mt30 }}>
                        <View style={{ ...customstyles.col6, ...customstyles.p10}} >
                            
                            <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} style={styles.gradientbtn} >
                                <TouchableOpacity
                                    onPress={retriveWallet}>
                                    <Text style={{...customstyles.textCenter, ...customstyles.textwhite, ...customstyles.textmd, }}>Retrieve Wallet</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        <View style={{ ...customstyles.col6, ...customstyles.p10}}>  
                                <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} style={styles.gradientbtn} >
                                    <TouchableOpacity
                                        onPress={createCards}>
                                        <Text style={{...customstyles.textCenter, ...customstyles.textwhite, ...customstyles.textmd, }}>Create Cards</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                        </View>
                        <View style={{ ...customstyles.col6, ...customstyles.p10, }}>                            
                            <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} style={styles.gradientbtn} >
                                <TouchableOpacity
                                    onPress={showCard}>
                                    <Text style={{...customstyles.textCenter, ...customstyles.textwhite, ...customstyles.textmd, }}>View Cards</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        <View style={{ ...customstyles.col6, ...customstyles.p10, }}>
                            <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} style={styles.gradientbtn} >
                                <TouchableOpacity
                                    onPress={() => createVirtualCard()}>
                                    <Text style={{...customstyles.textCenter, ...customstyles.textwhite, ...customstyles.textmd, }}>Create Virtual Account</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        <View style={{width: "100%", ...customstyles.p5 }}>
                            <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} style={styles.gradientbtn} >
                                <TouchableOpacity
                                    onPress={() => handleOpen()}>
                                    <Text style={{...customstyles.textCenter, ...customstyles.textwhite, ...customstyles.textmd, }}>View Virtual Account</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>


                </View>
            </ScrollView>
            </ImageBackground>
        </SafeAreaView >
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
        paddingHorizontal: 15,
    },
    gradientbtn: {
        height: 90,
        borderRadius: 5,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderColor: "white", 
        borderWidth: 10
    }
});
export default Wallet;