import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, View, StyleSheet, Dimensions, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { commonPost } from './functions';
import Carousel, {Pagination} from "react-native-snap-carousel";
import { TextInput } from "react-native-paper";
import  ModelAlert  from './ModelAlert';
import { useIsFocused } from "@react-navigation/native";
import Background from './Background';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 30;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)

function ViewBeneficaryAcc({ navigation, route, user_id}) {
    const isFocused = useIsFocused();
    const [userId, setuserId] = useState('');
    const [accList, setAccList] = useState([]);
    const [bankid, setBankid] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const [succResp, setSuccResp] = useState('');
    const [errResp, setErrResp] = useState('');
    const [Alert_Visibility, setAlert_Visibility] = useState(false);

    const [activeIndex, setActiveIndex] = useState(0);
    const ref = React.useRef(null);
    const renderItem = React.useCallback(({ item, index }) => (
        <View style={{ backgroundColor: "white", borderColor: "#662397", borderWidth: 10, borderRadius: 10, padding: 5, width: "100%", alignSelf: "center", marginTop: 10}}>
             <Text style={{...customstyles.titleText, fontSize: 20, fontFamily: null, fontWeight: "bold"}}> Account {index + 1} </Text>
            <TextInput
                label="Holder Name"
                value={item.bank_holder_name}
                style={{...otherStyles.textInputDesign, flex: 0.5}}
                theme={{ colors: { text: "#662397" } }}
                editable={false}
            />
            <View style={{display: "flex", flexDirection: "row", flex: 1}}>
                <TextInput
                    label={<Text>Account Number</Text>}
                    value={item.bank_account_number}
                    style={{...otherStyles.textInputDesign, flex: 0.5}}
                    theme={{ colors: { text: "#662397"} }}
                    editable={false}
                />
                <TextInput
                    label="Bank Code"
                    value={item.bank_code}
                    style={{...otherStyles.textInputDesign, flex: 0.5}}
                    theme={{ colors: { text: "#662397" } }}
                    editable={false}
                />
            </View>
        </View>
      ), []);

      useEffect(() => {
        const value = AsyncStorage.getItem('userInfo')
            .then((value) => {
                let userData = JSON.parse(value);
                setuserId(userData.id);
                retriveacc(userData.id);
            });
      
    }, []);

    let retriveacc = (user_id) => {
        setisLoading(true);
        let data = {
            id: user_id,
            type: 'getaccount',
            api_url: 'beneficiaryAccount'
        }
        console.log(data);
        var response = commonPost(data)
        .then(res => {
            console.log(res.data);
            console.log(res.data.length);
            setisLoading(false);
            let status = res.code;
            if (res.data.length>0) {
                setAccList(res.data);
               // setAccList.sort(function(a, b){return b.id-a.id});
                setAccList.sort((a, b) => (a.id > b.id) ? 1 : -1)
                console.log(accList);
            } else {
                setErrResp("Record Not Found");
            }
        })
        .catch(error => console.log(error));
       
    }

    let delfun = (bankid) => {
        setAlert_Visibility(true);
        console.log(bankid)
        setBankid(bankid)
    }
    const confirmalert = () => {
        setAlert_Visibility(false);
        console.log(bankid)
        let data = {
            id: userId,
            bank_id : bankid,
            type: 'delete',
            api_url: 'beneficiaryAccount'
        }
        setisLoading(true)
        var resp = commonPost(data)
            .then(resp => {
                setisLoading(false)
                let result = resp;
                if(result.status=="deleted"){
                    setBankid('')
                    setSuccResp("Account Successfully Deleted");
                    setTimeout(() => {
                        setSuccResp('');
                        retriveacc(userId)
                    }, 4000);
                }
              
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const addbenefacc = () => {
        navigation.navigate('AddBeneficaryAcc', { user_id: userId});
    }
    const cancelAlertBox = () => {
        console.log("status")
        setAlert_Visibility(false);
    }

    return (
        <SafeAreaView style={styles.scrollArea}>
         <ModelAlert
         Alert_Visibility={Alert_Visibility}
         cancelAlertBox={cancelAlertBox}
         title={"Delete Beneficiary Account."}
         body={"Are you sure you want to delete beneficiary account?"}
         confirmalert={confirmalert}
         />
        {isLoading   && <Loader />} 
             <ScrollView style={styles.innerView}>
                <View style={{...styles.container, display: "flex", justifyContent: "center"}}>
                    <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "flex-start"}}>
                            <Text style={{...customstyles.titleText, fontSize: 20, fontFamily: null, fontWeight: "bold", marginTop: 10}}> Beneficiary Account Information</Text>
                        </View>
                    {
                        accList.length > 0 &&
                        <Carousel
                        layout="default"
                        ref={ref}
                        data={accList}
                        sliderWidth={SLIDER_WIDTH}
                        style={{alignSelf: "center", justifyContent: "center"}}
                        itemWidth={ITEM_WIDTH}
                        renderItem={renderItem}
                        onSnapToItem={(index) => setActiveIndex(index)}
                        />
                    }
                    {
                        accList.length > 0 ?
                        <View style={[customstyles.row, customstyles.mt10, { justifyContent: "space-between" }]}>
                                <TouchableOpacity onPress={addbenefacc} style={{...customstyles.btnThemexs, justifyContent: "center"}}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <Ionicons name="add-outline" size={20} color="#662397" />
                                        <Text style={{color: "#662397"}}> Add Account </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => delfun(accList[activeIndex].id)} style={customstyles.btnThemexs}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Ionicons name="remove" size={20} color="#662397" />
                                        <Text style={{color: "#662397"}}> Delete Account</Text>
                                    </View>
                                </TouchableOpacity>
                            
                        </View> : 
                        <View style={[customstyles.row, customstyles.mt10, { justifyContent: "space-between" }]}>
                                <TouchableOpacity onPress={addbenefacc} style={{...customstyles.btnThemexs, justifyContent: "center"}}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <Ionicons name="add-outline" size={20} color="#662397" />
                                        <Text style={{color: "#662397"}}> Add Account </Text>
                                    </View>
                                </TouchableOpacity>   
                        </View> 

                    }
                    {
                        accList.length > 0 &&
                            <Pagination
                            dotsLength={accList.length}
                            activeDotIndex={activeIndex}
                            containerStyle={{ borderColor: "#663297", borderWidth: 0, backgroundColor: "transparent", alignSelf: "center", justifyContent: "center", width: "90%", borderRadius: 10, paddingVertical: 3}}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                marginHorizontal: 2,
                                backgroundColor: '#663297'
                            }}
                            inactiveDotStyle={{
                                width: 10,
                                height: 10,
                                marginHorizontal: 2,
                                backgroundColor: '#663297'
                                // Define styles for inactive dots here
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            >
                            </Pagination>
                        }
                    </View>
            
                    {
                        errResp != '' && 
                        <View style={{borderColor: "#662397", flex: 0.5, backgroundColor: "transparent", marginTop: 30, borderWidth: 10, borderRadius: 10}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center", color: "#aaa", padding: 10}}>
                                {errResp}
                            </Text>
                        </View>
                    }
                    {
                        succResp != '' && <Text style={{ color: 'green' }}>{succResp}</Text>
                    }
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
    addcardbtn: {
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
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
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
export default ViewBeneficaryAcc;