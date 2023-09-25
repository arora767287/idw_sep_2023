import React, { useEffect, useState,useRef  } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, FlatList, ScrollView, Modal} from 'react-native';
import { customstyles } from '../../customstyle';
import Loader from '../Loader';
import { AntDesign } from '@expo/vector-icons'; 
import Moment from 'moment';
import SearchBar from "react-native-dynamic-search-bar";
import {transactionlist } from '../functions';
import { Ionicons } from '@expo/vector-icons';
function Transactionlist({route, navigation}){
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
        navigation.navigate("Cardtransactionlist", {user_id: userId});
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
        var resp = transactionlist(user_id,1)
            .then(resp => {
                setisLoading(false)
                let result = resp;
                console.log("result");
                console.log(result);
                setTransactionArr(result.transactions);
              
            })
            .catch((error) => {
                setisLoading(false)
                console.log(error)
            })
        }
    return (
    <View style={{flex: 4.1, marginLeft: 20, marginRight: 20, marginTop: 30}}>
        <View style={{alignItems: "center", justifyContent: "space-between",flexDirection: "row"}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="leftcircle" size={30} color="#663297"  />

            </TouchableOpacity>
            <Text style={{...customstyles.titleText, fontWeight: 'bold', fontSize: 30,paddingRight:15}}>All Transactions</Text>
            {/* <TouchableOpacity onPress={searchbtnfun}  style={{...styles.searchBarIcons, flexDirection: "column"}} >
                                    <Ionicons name="search" size={20} color="#ffff" />
                                </TouchableOpacity> */}
        </View>
        <View style={{alignItems: "center", flexDirection: "row"}}>
        <TouchableOpacity >
                            <View>
                                <Text style={{ ...customstyles.btnTheme, ...customstyles.shadowBtn,width:150 }}>
                                   Wallet
                                </Text>
                            </View>
                        </TouchableOpacity> 
            <TouchableOpacity onPress={nativecard} >
                            <View>
                                <Text style={{ ...customstyles.btnTheme, ...customstyles.shadowBtn,width:150,marginLeft:8 }}>
                                   Card
                                </Text>
                            </View>
                        </TouchableOpacity> 
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
        <View style={styles.textView}>
            { item.amount>0 ?
                <Text style={styles.titleText}>+${item.amount}</Text>
            :
                <Text style={styles.titleText}>-${item.amount}</Text>
            } 
            <Text style={styles.dateTimeText}>From: {item.description}</Text>
            <Text style={styles.dateTimeText}>To: {item.details.name}</Text>
            <Text style={styles.dateTimeText}>{Moment(item.created_at).format('Y-MM-DD HH:MM ')}</Text>
        </View>
        <Text style={styles.brandNameText}>{item.indicator}</Text>
    </TouchableOpacity> 
                             } 
        onEndReachedThreshold={0.9}
        onEndReached={fetchMore}
      />:
      <View>
      <Text style={{textAlign: "center", color: "grey", fontSize: 10}}>Record Not Exists</Text>
  </View>
    }
        </View>
       
    </View>
    );
}

const styles = StyleSheet.create({
    tranBackground: {
        width: "100%",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 2,
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
        fontFamily: "Avenir-Next",
        fontSize: 20,
        color: "#663297",
    },
    dateTimeText: {
        fontFamily: "Avenir-Next",
        fontSize: 10,
        color: "#663297",
    },
    brandNameText:{
        alignSelf: "center",
        fontSize: 10,
        opacity: 0.5,
        fontFamily: "Avenir-Next",
        padding:3.5,
        borderColor: "black",
        borderWidth: 2,
        marginLeft: "auto",
        marginRight: 15
    },  searchBarIcons:{
        height: 30,
        padding: 5,
        borderRadius: 15,
        alignSelf: "center",
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


export default Transactionlist;