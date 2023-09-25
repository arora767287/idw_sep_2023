import React, { useEffect, useState,useRef  } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, FlatList, ScrollView, Modal} from 'react-native';
import { customstyles } from '../customstyle';
import Loader from './Loader';
import { AntDesign } from '@expo/vector-icons'; 
import Moment from 'moment';
import SearchBar from "react-native-dynamic-search-bar";
import {transactionlist,commonPost } from './functions';
import { Ionicons } from '@expo/vector-icons';
function Transactionplist({route, navigation}){
    var mtransfer = require("../assets/Images/transfer.png")
    const [count, setCount] = useState(2);
    const [userId, setuserId] = useState('');
    const [transactionArr, setTransactionArr] =useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [searchvisible, setsearchvisible] = useState(false);
    const [holdername, setholdername] = useState('');
    const [purpose, setpurpose] = useState('');
    const [amount, setamount] = useState('');
    useEffect(() => {
        let userId = route.params.user_id;
        setuserId(userId);
        console.log(userId + 'Wallet');
        viewtransactionlist(route.params.user_id);
        Moment.locale('en');
    }, []);
    let fetchMore = () => {
        setCount(count + 1);
        console.log("count="+count);
        setisLoading(true)
        var resp = transactionlist(userId,count)
            .then(resp => {
                setisLoading(false)
                let result = resp;
                let list = [...transactionArr, ...result.data]
                setTransactionArr(list);
               // console.log(transactionArr);
            })
            .catch((error) => {
                setisLoading(false)
                console.log(error)
            })
    }
    const nativecard = () => {
        navigation.navigate("Cartransactionlist", {user_id: userId});
    }
    const searchbtn = () => {
            var listFolders = [];
            for(let i = 0; i<transactionArr.length; i++){
                if(holdername!=""){
                  
                if(transactionArr[i].details.holdername.indexOf(holdername) == 0 ){
                    listFolders.push(transactionArr[i])
                }
            }
                if(purpose!=""){
                if(transactionArr[i].details.purpose_of_transfer.indexOf(purpose) == 0 ){
                    listFolders.push(transactionArr[i])
                }
            }
                if(amount!=""){

                if(transactionArr[i].amount.indexOf(amount) == 0){
                    listFolders.push(transactionArr[i])
                }
            }
            }
            setTransactionArr(listFolders);
      };
    const clearbtn = () => {
        viewtransactionlist(route.params.user_id);
        setholdername('');
        setpurpose('');
        setamount('');
      };
    let searchbtnfun = () => {
        if(searchvisible){
            setsearchvisible(false)
        }else{
            setsearchvisible(true)
        }
        }

    let viewtransactionlist = (user_id) => {
        setisLoading(true)
            let data = {
                id: user_id,
                api_url: 'paypaltransactionlist'
            }
            const newResponse = commonPost(data)
            .then(resp => {
                setisLoading(false)
                let result = resp;
                console.log("Transaction page result", result);
                if(result.data){
                    //list = []
                    //list.push({amount: 10, from: "Hello", to: "Nitya", transaction_date: "01/02/2002"})
                    setTransactionArr(result.data);
                }
            })
        }
    return (
    <View style={{flex: 4.1, backgroundColor: "#20004A"}}>
    <View style={{flex: 4.1, marginLeft: 20, marginRight: 20, marginTop: 50, backgroundColor: "#20004A"}}>
        <View style={{alignItems: "center", justifyContent: "flex-start",flexDirection: "row", marginBottom: 10}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="leftcircle" size={30} color="white"  />
            </TouchableOpacity>
            <Text style={{...customstyles.titleText, fontWeight: 'bold', fontSize: 30, paddingLeft:15, color: "white"}}>All Transactions</Text>
        </View>
   
        <View style={{flex: 3, alignItems: "center", marginLeft: -20, marginRight: -20, padding: 10}}>
            {/**List of transactions from for loop mapping*/}
           
            {searchvisible   &&  <View style={{borderWidth:1,backgroundColor:"#fff",padding: 30,paddingTop:10,borderRadius:5}}> 
                <View style={{paddingBottom:10}}>
                   <TextInput
                    name="amount" placeholder={'Search by Amount'}
                    value={amount}
                    onChangeText={(amount) => setamount(amount)}
                    style={[styles.inputtheme, { marginBottom: 10 }]}
                />
                    </View> 
                <View style={{paddingBottom:10}}>
                        
                         <TextInput
                    name="purpose" placeholder={'Search by Purpose'}
                    value={purpose}
                    onChangeText={(purpose) => setpurpose(purpose)}
                    style={[styles.inputtheme, { marginBottom: 10 }]}
                />
                    </View> 
                <View style={{paddingBottom:10}}>
                <TextInput
                    name="holdername" placeholder={'Search by HolderName'}
                    value={holdername}
                    onChangeText={(holdername) => setholdername(holdername)}
                    style={[styles.inputtheme, { marginBottom: 10 }]}
                />
                       
                    </View> 
                    <View style={{ display: "flex", flexDirection: "row"}}>
                <View style={{display: "flex", flexDirection: "column"}}>
                <TouchableOpacity onPress={searchbtn} >
                                <Text style={{ ...styles.addcardbtn }}>Search</Text>
                            </TouchableOpacity>
                </View>
                <View style={{display: "flex", flexDirection: "column",paddingLeft:10}}>
                <TouchableOpacity onPress={clearbtn} >
                                <Text style={{ ...styles.addcardbtn }}>Clear</Text>
                            </TouchableOpacity>
                </View>
            </View>
                    </View>}
                    {isLoading   && <Loader />} 
                    {transactionArr.length>0 ?  
                        <FlatList
                        data={transactionArr}
                        renderItem={({item,index}) =>  

                            <TouchableOpacity style={styles.tranBackground}>
                                <Image source={mtransfer} style={styles.imageStyle}></Image>
                                <View style={{...styles.textView, paddingBottom: 5}}>
                                    { item.amount>0 ?
                                        <Text style={styles.titleText}>+${item.amount}</Text>
                                    :
                                        <Text style={styles.titleText}>-${item.amount}</Text>
                                    } 
                                    <Text style={styles.dateTimeText}>From: {item.from}</Text>
                                    <Text style={styles.dateTimeText}>To: {item.to}</Text>
                                    <Text style={styles.dateTimeText}>{Moment(item.transaction_date).format('Y-MM-DD HH:MM ')}</Text>

                                </View>
                                <Text style={styles.brandNameText}></Text>
                            </TouchableOpacity>
                                        } 
                            />:
                    <View style={{alignSelf: "flex-start"}}>
                        <Text style={{color: "grey", fontSize: 20, alignSelf: "flex-start", marginLeft: 20}}>No Transactions Found</Text>
                    </View>
    }
        </View>
       
    </View>
    </View>
    );
}

const styles = StyleSheet.create({
    tranBackground: {
        width: "100%",
        backgroundColor: "white",
        borderColor: "transparent",
        borderWidth: 5,
        flexDirection: "row",
        alignSelf: "center",
        borderRadius:16,
        marginBottom: 10
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
        color: "#663297",
    },
    dateTimeText: {
        fontSize: 10,
        color: "#663297",
        width: "75%"
    },
    brandNameText:{
        alignSelf: "center",
        fontSize: 10,
        opacity: 0.5,
        padding:3.5,
        borderColor: "black",
        borderWidth: 2,
        marginLeft: "auto",
        marginRight: 15
    },  searchBarIcons:{
        height: 30,
        padding: 5,
        borderRadius: 15,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        elevation: 20,
        backgroundColor: "#662397",
        shadowColor: "#757575",
        shadowRadius: 8,
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 3,
        },
      }, addcardbtn: {
        borderRadius: 25,
        paddingLeft: 35,
        paddingRight: 35,
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



export default Transactionplist;