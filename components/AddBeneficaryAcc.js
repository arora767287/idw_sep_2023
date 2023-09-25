import React, { useEffect, useState } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { commonPost } from './functions';
import Background from './Background';
import Dialog from "react-native-dialog";

function AddBeneficaryAcc({ navigation, route }) {
    const [userId, setuserId] = useState('');
    const [accno, setAccno] = useState('');
    const [erraccno, setErrAccno] = useState('');
    const [errholdername, setErrHoldername] = useState('');
    const [errbankcode, setErrBankcode] = useState('');
    const [holdername, setHoldername] = useState('');
    const [bankcode, setBankcode] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const [succResp, setSuccResp] = useState('');
    const [errResp, setErrResp] = useState('');

    useEffect(() => {
        let userId = route.params.user_id;
        setuserId(userId);
    }, []);



    const addbenefacc = () => {
        if ((accno == '')) {
            setErrAccno('Account Number is required');
            return;
        } else {
            setErrAccno('');
        }
        if ((holdername == '')) {
            setErrHoldername('Holder Name is required');
            return;
        } else {
            setErrHoldername('');
        }
        if ((bankcode == '')) {
            setErrBankcode('Bank Code is required');
            return;
        } else {
            setErrBankcode('');
        }
      if((accno != '')&& (holdername != '')&& (bankcode != '')){
      
        let data = {
            id: userId,
            type: 'create',
            api_url: 'beneficiaryAccount',
            bank_acc : accno,
            acc_holder_name : holdername,
            bank_code: bankcode
         
        }
        setisLoading(true);
        console.log(data);
        var response = commonPost(data)
            .then(res => {
                console.log(res);
                setisLoading(false);
                let status = res.code;
                if ((status == 400)) {
                    setErrResp(res.description);
                    setTimeout(() => {
                        setErrResp('');
                    }, 4000);
                } else {
                    setSuccResp("Your Beneficary Account Successfully Added");
                    setTimeout(() => {
                        setSuccResp('');
                        navigation.goBack()
                    }, 4000);
                }
            })
            .catch(error =>   {setisLoading(false);console.log(error)});
      }
    };

    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                        <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <Text style={{ ...customstyles.headerHeading, ...customstyles.flexgrow1, }}>Add Beneficary Account</Text>

            </View>
            <ScrollView style={styles.innerView}>
            <View style={{...customstyles.mt30, ...customstyles.mb20}}>
            {
                        succResp != '' && <Text style={{ color: 'green' }}>{succResp}</Text>
                    }
                    {
                        errResp != '' && <Text style={{ color: 'red' }}>{errResp}</Text>
                    }
            <Text style={[customstyles.textpurple, { marginBottom: 3 }]}>Account Number</Text>
                        <TextInput
                            name="accno" placeholder={'Account Number'}
                            keyboardType={'numeric'}
                            value={accno}
                            onChangeText={(accno) => setAccno(accno )}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                        />
                      
                         {
                                   erraccno != "" &&
                                <Text style={customstyles.alertdanger}>{erraccno}</Text>
                            }
                      
            <Text style={[customstyles.textpurple, { marginBottom: 3 }]}>Holder Name</Text>
                        <TextInput
                           placeholder={'Holder Name'}
                            onChangeText={(holdername) => setHoldername(holdername)}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                        />
                           {
                                errholdername != "" &&
                                <Text style={customstyles.alertdanger}>{errholdername}</Text>
                            }
                          
            <Text style={[customstyles.textpurple, { marginBottom: 3 }]}>Bank Code</Text>
                        <TextInput
                            name="bankcode" placeholder={'Bank Code'}
                            value={bankcode}
                            onChangeText={(bankcode) => setBankcode( bankcode )}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                        />
                       {
                            errbankcode != "" &&
                                <Text style={customstyles.alertdanger}>{errbankcode}</Text>
                        }
                           {isLoading   && <Loader />} 
                        <TouchableOpacity onPress={addbenefacc} >
                                <Text style={{ ...styles.addcardbtn}}>Add </Text>
                            </TouchableOpacity> 
              </View>
            </ScrollView>
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
    }, button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor:"#dc3545",
        width:150,
        padding: 10,
        marginBottom: 20,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 14
    },
    btnTheme: {
        borderRadius: 30,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 13,
        paddingBottom: 13,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: "#663792",
        color: "#fff",
        fontSize: 18,
        lineHeight: 22,
        fontFamily: "Thonburi",
        borderWidth: 0,
        textAlign: "center",
        // letterSpacing: 1,
        //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)",
      },
      addcardbtn: {
        borderRadius: 25,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: "#663792",
        color: "#fff",
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "Thonburi",
        borderWidth: 0,
        textAlign: "center",
      },
});
export default AddBeneficaryAcc;