import React, { useEffect, useState, useRef } from 'react';
import { Alert, FlatList, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { commonPost, commonGet} from "../components/functions.js";
import { AntDesign } from '@expo/vector-icons'; 
import Moment from 'moment';
function Messages({ navigation, route }) {
    const [isLoading, setisLoading] = useState(false);
    const [msgArr, setMsgArr] =useState([]);
    const [company, setCompany] = useState("");
    useEffect(() => {
        getmessagelist(route.params.user_id);
        Moment.locale('en');
    }, []);

    let findOfferCompany = (offer_id, user_id) => {
        let data = {
            api_url: 'getSubcribeOfferList',
            user_id:user_id,
        }
        var resp = commonPost(data)
            .then(resp => {
                let result = resp.data;
                for(let i = 0; i < resp.data.length; i++){
                    if(resp.data[i].id == offer_id){
                        console.log("Company: ", resp.data[i].comp_name)
                        setTimeout(() => {
                            setCompany(resp.data[i].comp_name)
                        }, 50)
                        return;
                    }
                } 
                setTimeout(() => {
                    setCompany("Identity Wallet")
                }, 50)
            })
            .catch((error) => {
                console.log("Error" , error)
            })
        }

    let getmessagelist = (user_id) => {
        setisLoading(true)
        let data = {
            user_id: user_id,
            api_url: `getMessages?user_id=${user_id}`
        }
        var resp = commonPost(data)
            .then(resp => {
                setisLoading(false)
                let result = resp;
                console.log("Messages: ", result.data);
                setTimeout(()=>{
                    setMsgArr(result.data);
                }, 500)
              
            })
            .catch((error) => {
                getmessagelist(route.params.user_id);
                console.log("Messages Error: ", error)
            })
        }
        let pressfun = (offerid,title,body) => {
            Alert.alert(
                title,
                body, //Look at WebURL to see previous version
                [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                    },
                    { text: 'Cool!', onPress: () => {} },
                ]
            );
        }
        let confirmFun=(offerid,status) => {
           
            if(offerid!=0){
            let data = {
                user_id: route.params.user_id,
                offer_id: offerid,
                status: status,
                api_url: 'acceptOffer'
            }
            console.log(data);
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{alignItems: "center", flexDirection: "row", marginLeft: 20, marginBottom: 20}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="leftcircle" size={30} color="#663297"  />
                </TouchableOpacity>
                <Text style={{...customstyles.titleText, fontWeight: 'bold', fontSize: 35, paddingLeft: 15 }}>Messages</Text>
            </View>
            <ScrollView style={styles.innerView}>
                <View style={styles.container}>
                {isLoading   && <Loader />} 
                <FlatList
        data={msgArr}
        renderItem={({item,index}) =>  
                <TouchableOpacity style={styles.tranBackground} onPress={() => pressfun(item.offer_id,item.title,item.messages)}>
                    {findOfferCompany(item.offer_id, route.params.user_id)}
                <View style={styles.textView}>
                <Text style={styles.titleText}>{item.title} from {company}</Text>
                    <Text style={styles.message}>{item.messages}</Text>
                </View>
                <Text style={styles.dateTimeText}>{Moment(item.updated_at).format('Y-MM-DD HH:MM ')}</Text>
            </TouchableOpacity> 
        } 
       
      />
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    tranBackground: {
        width: "100%",
        backgroundColor: "#662397",
        borderColor: "transparent",
        borderWidth: 2,
        flexDirection: "row",
        alignSelf: "center",
        borderRadius:8,
        marginBottom: 10,
    },
    imageStyle: {
        width: 50,
        height: 50,
        alignSelf: "center",
        padding: 5
    },
    textView:{
        flexDirection: "column"
    },
    titleText:{
        fontSize: 20,
        paddingLeft:15,
        color: "#fff",
        width: "70%"
    },
    message: {
        fontSize: 12,
        paddingLeft:15,
        color: "#fff",
        paddingBottom:5,
        width: "70%"
    },
    dateTimeText: {
        alignSelf: "flex-end",
        fontSize: 12,
        padding:3.5,
        color: "#fff",
        marginLeft: "auto",
        marginRight: 0,
    },
    container: {
        marginHorizontal: 20
    },
      inputtheme: {
        // height: "10%",
        height: 46,
        width: "100%",
        borderWidth: 2,
        borderColor: "#663792",
        borderRadius: 30,
        marginBottom: 10,
        //placeholderColor: "#555",
        //placeholderOpacity: .5,
        color: "#555",
        fontSize: 16,
        fontFamily: "Roboto",
        fontWeight: "normal",
        paddingLeft: 35,
        paddingRight: 35,
      },
});


export default Messages;
