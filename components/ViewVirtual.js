import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { customstyles } from "../customstyle";
import Loader from './Loader';
import { TextInput } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { retriveWallet } from './functions';
import { commonPost } from './functions';
import Background from './Background';
import ViewBeneficaryAcc from './ViewBeneficaryAcc';
import MyTabs from './MyTabs';

function ViewVirtual({ navigation, route }) {

    const [userId, setuserId] = useState('');
    const [loader, setLoader] = useState(false);
    const [succResp, setSuccResp] = useState('');
    const [errResp, setErrResp] = useState('');
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [virtualAccNo, setvirtualAccNo] = useState([]);
    const [virtualHolderName, setvirtualHolderName] = useState([]);
    const [virtualAccLimit, setvirtualAccLimit] = useState([]);
    const [virtualBankCode, setvirtualBankCode] = useState([]);
    const [virtualBankStatus, setvirtualBankStatus] = useState([]);
    useEffect(() => {
        setuserId(route.params.user_id);
        retriveVirtualAcc(route.params.user_id);
    }, []);


    let retriveVirtualAcc = (userId) => {
        let data = {
            id: userId,
            type: 'getaccount',
            api_url: 'virtualAccount'
        }
        setLoader(true);
        var response = commonPost(data)
            .then(res => {
                console.log(res);
                setLoader(false);
            if(res.data.length>0){
                setVisible(true);
                setVisible1(false);
                 let fastacc =res.data[0].fast_accounts;
                 console.log(fastacc[0]);
                 setvirtualAccNo(fastacc[0].account_number);
                 setvirtualHolderName(fastacc[0].bank_holder_name);
                 setvirtualAccLimit(fastacc[0].bank_account_limit);
                 setvirtualBankCode(fastacc[0].bank_bic);
                 setvirtualBankStatus(fastacc[0].status);
            }else{
                setVisible(false);
                setVisible1(true);
            }
            })
            .catch((error) => {
                throw error;
             });
    }
    const addbenefacc = () => {
        navigation.navigate('ViewBeneficaryAcc', { user_id: userId});
    }
    let createVirtualCard = () => {

        let data = {
            id: userId,
            type: 'create',
            api_url: 'virtualAccount'
        }
        setLoader(true);
        var response = commonPost(data)
            .then(res => {
                setLoader(false);
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
                    retriveVirtualAcc(userId);
                    setTimeout(() => {
                        setSuccResp('');
                    }, 4000);
                }

            })
            .catch(error => console.log(error));
    }

    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{display: "flex", flexDirection: "row", marginLeft: 15, padding: 15}}>
                <View style={{justifyContent: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                        <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', marginLeft: 10}}>Account</Text>
            </View>
            <View >
        { visible1 && <TouchableOpacity  onPress={() => createVirtualCard()} style={{paddingLeft:'42%'}}>
                                <Text style={{ ...styles.addcardbtn,width:'90%' }}>Add Virtual Account</Text>
                            </TouchableOpacity> }
         </View>
           <ScrollView style={styles.innerView}>
                <Text style={{...customstyles.titleText, fontSize: 20, fontFamily: null, fontWeight: "bold", marginLeft: 15}}> Virtual Account Information </Text>
           {loader   && <Loader />} 
           {
                        succResp != '' && <Text style={{ color: 'green' }}>{succResp}</Text>
                    }
                    {
                        errResp != '' && <Text style={{ color: 'red' }}>{errResp}</Text>
                    }
                {visible && 
                    <View style={{ backgroundColor: "white", borderColor: "#662397", borderWidth: 10, borderRadius: 10, padding: 5, width: "90%", alignSelf: "center", marginTop: 10}}>
                        <Text style={{...customstyles.titleText, fontSize: 20, fontFamily: null, fontWeight: "bold"}}> Details </Text>
                        <TextInput
                            label="Card Holder Name"
                            value={virtualHolderName}
                            style={{...otherStyles.textInputDesign, flex: 0.5}}
                            theme={{ colors: { text: "#662397" } }}
                            editable={false}
                        />
                        <View style={{display: "flex", flexDirection: "row", flex: 1}}>
                            <TextInput
                                label={<Text>Account Number</Text>}
                                value={virtualAccNo}
                                style={{...otherStyles.textInputDesign, flex: 0.55}}
                                theme={{ colors: { text: "#662397"} }}
                                editable={false}
                            />
                            <TextInput
                                label="Status"
                                value={virtualBankStatus}
                                style={{...otherStyles.textInputDesign, flex: 0.45}}
                                theme={{ colors: { text: "#662397" } }}
                                editable={false}
                            />
                        </View>
                        <View style={{display: "flex", flexDirection: "row", flex: 1}}>
                            <TextInput
                                label="Bank Account Limit"
                                value={virtualAccLimit ? virtualAccLimit : "Null"}
                                style={{...otherStyles.textInputDesign, flex: 0.5}}
                                theme={{ colors: { text: "#662397" } }}
                                editable={false}
                            />
                            <TextInput
                                label="Bank Code"
                                value={virtualBankCode}
                                style={{...otherStyles.textInputDesign, flex: 0.5}}
                                theme={{ colors: { text: "#662397" } }}
                                editable={false}
                            />
                        </View>
                    </View>
                    /*
                <View style={styles.container} >
                    <View style={{ ...customstyles.whitebox, ...customstyles.shadowBlock, ...customstyles.mb10, ...customstyles.mt15 }}>
                        <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.h6, }}>Account Number</Text>
                            </View>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>: {virtualAccNo}</Text>
                            </View>
                        </View>
                        <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.h6, }}>Holder Name</Text>
                            </View>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>: {virtualHolderName}</Text>
                            </View>
                        </View>
                        <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.h6, }}>Bank Account Limit</Text>
                            </View>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>: {virtualAccLimit ? virtualAccLimit : "Null"}</Text>
                            </View>
                        </View>
                        <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.h6, }}>Bank Code</Text>
                            </View>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>: {virtualBankCode}</Text>
                            </View>
                        </View>
                        <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.h6, }}>Status</Text>
                            </View>
                            <View style={customstyles.col6}>
                                <Text style={{ ...customstyles.textsm, ...customstyles.textpurple,textTransform:'capitalize' }}>: {virtualBankStatus}</Text>
                            </View>
                        </View>

                    </View>

                    </View>
                
                <TouchableOpacity onPress={addbenefacc} style={{width: "90%", alignSelf: "center"}}>
                    <Text style={{ ...customstyles.btnRedsmall, ...customstyles.mx5 }}>Manage Beneficiary Accounts</Text>
                </TouchableOpacity>*/
                } 
                <ViewBeneficaryAcc navigation={navigation} user_id={userId}/>

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
    },   addcardbtn: {
        borderRadius: 25,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: "#dc3545",
        color: "#fff",
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "Roboto",
        borderWidth: 0,
        textAlign: "center",
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

export default ViewVirtual;
