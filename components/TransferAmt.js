import React, { useEffect, useState } from 'react';
import { Alert, Button, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { commonPost,getRecList } from './functions';
import { retriveWallet } from './functions';
import Background from './Background';
import Dialog from "react-native-dialog";
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
//import { Picker } from "@react-native-picker/picker";


function TransferAmt({ navigation, route }) {
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    const [userId, setuserId] = useState('');
    const [bankno, setBankno] = useState('');
    const [bankholdername, setBankholdername] = useState('');
    const [bankcode, setbankcode] = useState('');
    const [desitnationno, setDesitnationno] = useState('');
    const [accList, setAccList] = useState([]);
    const [newAccList, setNewAccList] = useState([]);
    const [accno, setAccno] = useState('');
    const [holdername, setHoldername] = useState('');
    const [bbankcode, setBBankcode] = useState('');
    const [viewdist, setViewdist] = useState(false);
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [erramount, setErrAmount] = useState('');
    const [errdestno, setErrDestno] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const [succResp, setSuccResp] = useState('');
    const [errResp, setErrResp] = useState('');
    const [transinvisiable, setTransinVisiable] = useState(true);
    const [transoutvisiable, setTransoutVisiable] = useState(false);
    const [listNumbers, setListNumbers] = useState([]);

    useEffect(() => {
        setuserId(route.params.user_id);
        retriveUserAcc(route.params.user_id);
        /*
        setTimeout(() => {
            setListNumbers([{label: "Hello", value: "Hello"}, {label: "Hello", value: "Hello"}]);
        }, 1000);*/
        //getDocNames()
        retriveacc(route.params.user_id);
    }, []);


    let retriveUserAcc = (user_id) => {
        let data = {
            id: user_id,
            type: 'getaccount',
            api_url: 'virtualAccount'
        }
        setisLoading(true);
        var response = commonPost(data)
            .then(res => {
                setisLoading(false);
                let fastacc =res.data[0].fast_accounts;
                console.log("resp----------", res);
                setBankno(fastacc[0].account_number);
                setBankholdername(fastacc[0].bank_holder_name);
                setbankcode(fastacc[0].bank_bic);
            })
            .catch((error) => {
                Alert.alert(
                    'Unable to load virtual accounts right now',
                    'We\'re working on fixing the issue. Please try again later.',
                    [
                        { text: 'OK', onPress: () => {} },
                    ]
                );
                navigation.goBack();
                console.log(error); 
                throw error;
            })
    }
    let retriveacc = (user_id) => {
        let data = {
            id: user_id,
            type: 'getaccount',
            api_url: 'beneficiaryAccount'
        }
        var listAll = [];
        setisLoading(true);
        var response = commonPost(data)
        .then(res => {
            setisLoading(false);
            console.log("Current Account List: ", res);
            let status = res.code;
            if(status == 500 || status == 400){
                Alert.alert(
                    'Unable to load virtual accounts right now',
                    'We\'re working on fixing the issue. Please try again later.',
                    [
                        { text: 'OK', onPress: () => {} },
                    ]
                );
                navigation.goBack();
            } else {
                setAccList(res.data);
            }
            /*
            res.data.map((dataOption) => {
                listAll.push({label: dataOption.bank_account_number, value:  dataOption.bank_account_number})
            });
            setTimeout(() => {
                setListNumbers(listAll);
            }, 1000);
            */
        })
        .catch((error) => {
            Alert.alert(
                'Unable to load virtual accounts right now',
                'We\'re working on fixing the issue. Please try again later.',
                [
                    { text: 'OK', onPress: () => {} },
                ]
            );
            navigation.goBack();
            console.log(error)
            throw error;
        });
       
    }

    let getDocNames = () => {
        console.log("All Names:")
        try{
            var listAll = [];
            getRecList(folder_id).then((listOptions) => {
                console.log("FirstOne");
                console.log(listOptions);
                ("List Options: ", listOptions.data);
                listOptions.data.map((dataOption) => {
                    listAll.push({label: dataOption.doc_name, value: dataOption.id})
                });
                setListNumbers(listAll);
            }).catch((error) => {
                Alert.alert(
                    'Unable to load virtual accounts right now',
                    'We\'re working on fixing the issue. Please try again later.',
                    [
                        { text: 'OK', onPress: () => {} },
                    ]
                );
                navigation.goBack();
                console.log(error);
                throw error;
            })
            //("Dropdown Data: ", dropdownData);
        }
        catch(error){
            //("Getting dropdown");
            //(error.stack);
            console.log(error.stack);
        }
    }

    const transintab = () => {
        setTransinVisiable(true)
        setTransoutVisiable(false)
    }
    const transouttab = () => {
        setTransinVisiable(false)
        setTransoutVisiable(true)
    }
    const sendamt = () => {
        if ((amount == '')) {
            setErrAmount('Amount is required');
            return;
        } else {
            setErrAmount('');
        }
        if (amount.match(/^-?\d*(\.\d+)?$/)) {
            setErrAmount('');
        } else {
            setErrAmount('Amount is not valid');
            return;
        }
        if ((desitnationno == '')) {
            setErrDestno('Select Destination Account');
            return;
        } else {
            setErrDestno('');
        }
      if((amount != '')&& (desitnationno != '')){
      
        let data = {
            id: userId,
            api_url: 'transferIn',
            amount : amount,
            purpose_of_transfer : purpose,
            sr_acc_number : bankno,
            sr_name: bankholdername,
            sr_bank_code: bankcode,
            bnf_acc_number: accno,
            bnf_name: holdername,
            bnf_bank_code: bankcode,
         
        }
        setisLoading(true);
        console.log(data);
        var response = commonPost(data)
            .then(res => {
                console.log(res);
                setisLoading(false);
                if (res.success) {
                    setSuccResp("Amount send successfully");
                    setDesitnationno('')
                    setViewdist(false)
                    setAmount('')
                    setPurpose('')
                    setTimeout(() => {
                        setSuccResp('');
                       
                    }, 4000);
                } else {
                    setErrResp(res.description);
                    setTimeout(() => {
                        setErrResp('');
                    }, 4000);
                }
            })
            .catch((error) =>   
                {
                    //setisLoading(false);     
                    Alert.alert(
                        'Unable to load virtual accounts right now',
                        'We\'re working on fixing the issue. Please try again later.',
                        [
                            { text: 'OK', onPress: () => {} },
                        ]
                    );
                    console.log(error)
                    throw error;
                }
            );
      }
    };
    const getaccno = (value) => {
         console.log(value)
         setDesitnationno(value)
         if(value==""){
            setViewdist(false)
            setDesitnationno('')
         }else{
         let obj = accList.find(o => o.bank_account_number === value);
         setTimeout(() => {
            setViewdist(true)
            setAccno(obj.bank_account_number)
            setHoldername(obj.bank_holder_name)
            setBBankcode(obj.bank_code)
         }, 500)
         }
    }
    if(isLoading){
        return(
            <Loader />
        )
    }
    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                        <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <Text style={{ ...customstyles.headerHeading, ...customstyles.flexgrow1, }}>Beneficiary Account </Text>

            </View>
            <ScrollView style={styles.innerView}>
            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.p5 }}>
                            <View style={{width: "100%"}}>
                            <TouchableOpacity onPress={() => transintab()} >
                                <Text style={{ ...styles.transferbtn, backgroundColor: transinvisiable ? "#663792" : "#A387BD",}}>Transfer In</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                        {
                        errResp != '' && <Text style={{ color: 'red' }}>{errResp}</Text>
                    }
                    {
                        succResp != '' && <Text style={{ color: 'green' }}>{succResp}</Text>
                    }
                      { transinvisiable && <View>
            <View style={{...customstyles.mb20}}>
            
            <Text style={[customstyles.textpurple, { marginBottom: 3 }]}>Source Account:</Text>
                <TextInput
                        name="amount" placeholder={'Enter Amount'}
                        value={bankno}
                        editable={false}
                        keyboardType={'numeric'}
                        onChangeText={(amount) => setAmount(amount)}
                        style={[customstyles.inputtheme, { marginBottom: 10 }]}
                    />
            <Text style={[customstyles.textpurple, { marginBottom: 3 }]}>Choose Destination Account</Text>
            <View>
            {       
                accList.length > 0 ?
                    <View style={{borderColor: "#000", borderWidth: 2, justifyContent: "center", height:100}}>
                        <Picker
                            selectedValue={desitnationno}
                            onValueChange={(value, index) => getaccno(value)}
                            style={{borderRadius: 16, borderColor: "#662397", borderWidth: 0, justifyContent: "center", height: 30}}
                            itemStyle={{height: 100, fontSize: 20}}
                        >                           
                            {
                                accList ?
                                <Picker.Item label='Select Destination Account' value='0' color='black' /> &&
                                accList.map((item, i) => (
                                    <Picker.Item key={i} label={item.bank_account_number} value={item.bank_account_number} color='black'/>
                                ))
                                : <Picker.Item label='No Destination Account Found' value='0' color='black' />
                            }
                        </Picker>
                    </View> :
                    <View>
                        <TextInput
                        placeholder={'Enter Amount'}
                        value="No Destination Accounts Found"
                        editable={false}
                        style={[customstyles.inputtheme, { marginBottom: 10, backgroundColor: "#bbb" }]}
                        />
                    </View>

            }
            </View>
            {
                errdestno != "" &&
                <Text style={customstyles.alertdanger}>{errdestno}</Text>
            }
    
                   {viewdist && 

                    <View style={{marginBottom: 10}}>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                label={<Text>Account Number</Text>}
                                value={accno}
                                style={{...otherStyles.textInputDesign}}
                                theme={{ colors: { text: "#662397"} }}
                                editable={false}
                            />
                        </View>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                label={<Text>Holder Name</Text>}
                                value={holdername}
                                style={{...otherStyles.textInputDesign}}
                                theme={{ colors: { text: "#662397"} }}
                                editable={false}
                            />
                        </View>
                        <View style={{ backgroundColor: "white"}}>
                            <TextInput
                                label={<Text>Bank Code</Text>}
                                value={bbankcode}
                                style={{...otherStyles.textInputDesign}}
                                theme={{ colors: { text: "#662397"} }}
                                editable={false}
                            />
                        </View>
                    </View>
                }
                  <Text style={[customstyles.textpurple, { marginBottom: 3, marginTop: 10 }]}>Amount to transfer</Text>

                <TextInput
                    name="amount" placeholder={'Enter Amount'}
                    value={amount}
                    keyboardType={'numeric'}
                    onChangeText={(amount) => setAmount(amount)}
                    style={[customstyles.inputtheme, { marginBottom: 10 }]}
                />
                 {
                            erramount != "" &&
                                <Text style={customstyles.alertdanger}>{erramount}</Text>
                        }
                  <Text style={[customstyles.textpurple, { marginBottom: 3 }]}>Purpose of transfer </Text>
                 
                <TextInput
                    name="purpose" placeholder={'Enter Purpose'}
                    value={purpose}
                    onChangeText={(purpose) => setPurpose(purpose)}
                    style={[customstyles.inputtheme, { marginBottom: 10 }]}
                />
                     
                           {isLoading   && <Loader />} 
                           
                           <TouchableOpacity onPress={accList.length > 0 ? sendamt : () => {}} >
                                <Text style={{ ...styles.addcardbtn, opacity: accList.length > 0 ? 1: 0.4}}>SEND</Text>
                            </TouchableOpacity>
                            </View> 
              </View>}
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
    wallettxt: {
        paddingLeft:10,paddingTop:5,paddingBottom:5,fontSize:18
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
        borderColor: "transparent",
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
        borderWidth: 1,
        textAlign: "center",
      },
      transferbtn: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        marginTop: 10,
        color: "#fff",
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "Thonburi",
        borderWidth: 1,
        textAlign: "center",
      },
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
        color: "white",
        fontFamily: "Thonburi"
      },
      selectedTextStyle: {
        fontSize: 16,
        color: "white",
        fontFamily: "Thonburi"
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
});

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
export default TransferAmt;