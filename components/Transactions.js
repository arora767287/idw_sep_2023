import React, { useEffect, useState,useRef  } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, FlatList, ScrollView, Modal} from 'react-native';
import { customstyles } from '../customstyle';
import Loader from './Loader';
import { AntDesign } from '@expo/vector-icons'; 
//import Moment from 'moment';
import SearchBar from "react-native-dynamic-search-bar";
import {transactionlist } from './functions';
import { Ionicons } from '@expo/vector-icons';
import {RadioButton} from "react-native-paper"
function Transactionlist({route, navigation}){
    var mtransfer = require("../assets/Images/transfer.png")
    var listTransactions = [
        {
            "brand_name": "Citibank",
            "imagepath": "../assets/Images/transfer.png",
            "title": "New Account",
            "amount": 50,
            "time": "12:00 11/11/2011"
        },
        {
            "brand_name": "Citibank",
            "imagepath": "../assets/Images/transfer.png",
            "title": "New Account",
            "amount": 50,
            "time": "12:00 11/11/2011"
        },
        {
            "brand_name": "Citibank",
            "imagepath": "../assets/Images/transfer.png",
            "title": "New Account",
            "amount": 50,
            "time": "12:00 11/11/2011"
        },
        {
            "brand_name": "Citibank",
            "imagepath": "../assets/Images/transfer.png",
            "title": "New Account",
            "amount": 50,
            "time": "12:00 11/11/2011"
        },
        {
            "brand_name": "Citibank",
            "imagepath": "../assets/Images/transfer.png",
            "title": "New Account",
            "amount": 50,
            "time": "12:00 11/11/2011"
        },
        {
            "brand_name": "Citibank",
            "imagepath": "../assets/Images/transfer.png",
            "title": "New Account",
            "amount": 50,
            "time": "12:00 11/11/2011"
        },
        {
            "brand_name": "Citibank",
            "imagepath": "../assets/Images/transfer.png",
            "title": "New Account",
            "amount": 50,
            "time": "12:00 11/11/2011"
        }
    ];
    const [count, setCount] = useState(2);
    const [userId, setuserId] = useState('');
    const [transactionArr, setTransactionArr] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [searchvisible, setsearchvisible] = useState(false);
    const [checked, setChecked] = useState('amount')
    const [origList, setOrigList] = useState([]);
    useEffect(() => {
        let userId = route.params.user_id;
        setuserId(userId);
        console.log(userId + 'Wallet');
        viewtransactionlist(route.params.user_id);
    }, []);
    const nativecard = () => {
        navigation.navigate("Cardtransactionlist", {user_id: userId});
    }
    let fetchMore = () => {
        setCount(count + 1);
        console.log("count="+count);
        setisLoading(true)
        var resp = transactionlist(userId,count)
            .then(resp => {
                let result = resp;
                let list = [...transactionArr, ...result.transactions]
                setTransactionArr(list);
                console.log("These transactions")
                console.log("Transactions: ", transactionArr);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    let searchbtnfun = () => {
        if(searchvisible){
            setsearchvisible(false)
        }else{
            setsearchvisible(true)
        }
    }

    let viewtransactionlist = (user_id) => {
        setisLoading(true)
        console.log("User ID ", user_id);
        var resp = transactionlist(user_id,1)
            .then(resp => {
                let result = resp;
                finalList = [];
                for(let i = 0; i < result.transactions.length; i++){
                    if(result.transactions[i].type != "Get Card"){
                        finalList.push(result.transactions[i]);
                    }
                }
                setTimeout(() => {
                    setTransactionArr(finalList);
                    setOrigList(finalList);
                    setisLoading(false)
                }, 1000)
            })
            .catch((error) => {
                setisLoading(false)
                console.log(error)
            })
        }

    const handleOnChangeText = (text) => {
        console.log(origList);
        if(text == ""){
            viewtransactionlist(route.params.user_id)
        }
        else{
            let listAllTran = [];
            if(checked == "amount"){
                for(let i = 0; i<origList.length; i++){
                    console.log("Orange: ", origList[i].amount)
                    let amount = origList[i].amount.toString();
                    if(amount.indexOf(text) != -1){
                        listAllTran.push(origList[i]);
                    }
                }
            }
            else if(checked == "name"){
                for(let i = 0; i<origList.length; i++){
                    if(origList[i].details.bank_holder_name != null && origList[i].details.bank_holder_name.toLowerCase().indexOf(text.toLowerCase()) != -1){
                        listAllTran.push(origList[i]);
                    }
                }
            }
            else if(checked == "purpose"){
                for(let i = 0; i<origList.length; i++){
                    if(origList[i].details.purpose_of_transfer != null && origList[i].details.purpose_of_transfer.toLowerCase().indexOf(text.toLowerCase()) != -1){
                        listAllTran.push(origList[i]);
                    }
                }
            }
            setTransactionArr(listAllTran);
        }
      };
    return (
    <View style={{flex: 4.1, marginLeft: 20, marginRight: 20, marginTop: 50, backgroundColor: "#20004A"}}>
        <View style={{alignItems: "center", justifyContent: "flex-start",flexDirection: "row", marginBottom: 10}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="leftcircle" size={30} color="#663297"  />
            </TouchableOpacity>
            <Text style={{...customstyles.titleText, fontWeight: 'bold', fontSize: 30, paddingLeft:15}}>All Transactions</Text>
        </View>
        {/*            <TouchableOpacity onPress={searchbtnfun}  style={{...styles.searchBarIcons, flexDirection: "column"}} >
                <Ionicons name="search" size={20} color="#ffff" />
            </TouchableOpacity> */}
        <View style={{justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
            <TouchableOpacity style={{borderColor: "#662397", borderRadius: 32, backgroundColor: "#662397", borderWidth: 5, padding: 5, marginRight: 10}}>
                <View>
                    <Text style={{width:150, backgroundColor: "transparent", color: "white", textAlign: "center", fontSize: 20}}>
                        Wallet
                    </Text>
                </View>
            </TouchableOpacity> 
            <TouchableOpacity onPress={nativecard} style={{borderColor: "#662397", borderRadius: 32, backgroundColor: "white", borderWidth: 5, padding: 5}} >
                <View>
                    <Text style={{width:150,marginLeft:8, textAlign: "center", fontSize: 20, color: "#662397"}}>
                        Card
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={{flex: 3, alignItems: "center", marginTop: 20}}>
                {/**List of transactions from for loop mapping*/}
                <TouchableOpacity style={{...customstyles.filterContainer, marginBottom: 10, width: "100%", padding: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}} onPress={searchbtnfun}>
                    <Text style={{fontSize: 20, fontWeight: "normal", color: "#662397"}}>Customize Search Filters </Text>
                    <Ionicons  name={searchvisible ? "caret-up-outline" : "caret-down-outline"} color="#662397" size={20} style={{alignSelf: "center", justifyContent: "center"}}/>
                </TouchableOpacity>
                {searchvisible   && 
                <View style={{...customstyles.filterContainer}}>
                    <SearchBar
                    height={50}
                    style={{marginBottom: 10, width: "100%", marginTop: 10}}
                    fontSize={15}
                    fontColor="#fdfdfd"
                    iconColor="#fdfdfd"
                    cancelIconColor="#fdfdfd"
                    placeholder="Enter search"
                    onChangeText={handleOnChangeText}
                    />
                    <Text style={{color: "#662397", fontWeight: "bold", fontSize: 15, marginLeft: 10, marginBottom: 5}}>SEARCH BY</Text>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={{display: "flex", flexDirection: "row", padding: 5}}>
                            <View style={{flexDirection: "row", borderColor: "#662397", borderWidth: 2, borderRadius: 20, color: "#662397"}}>
                                <RadioButton
                                    value="name"
                                    status={ checked === 'name' ? 'checked' : 'unchecked' }
                                    onPress={() => setChecked('name')}
                                    color="#662397"
                                />
                            </View>
                            <Text style={{...customstyles.h5, fontWeight: "normal", fontSize: 15, alignSelf: "center", justifyContent: "center", padding: 5}}>name</Text>
                        </View>  
                        <View style={{display: "flex", flexDirection: "row", padding: 5}}>
                            <View style={{flexDirection: "row", borderColor: "#662397", borderWidth: 2, borderRadius: 20, color: "#662397"}}>
                                <RadioButton
                                    value="purpose"
                                    status={ checked === 'purpose' ? 'checked' : 'unchecked' }
                                    onPress={() => setChecked('purpose')}
                                    color="#662397"
                                />
                            </View>
                            <Text style={{...customstyles.h5, fontWeight: "normal", fontSize: 15, alignSelf: "center", justifyContent: "center", padding: 5}}>purpose</Text>
                        </View> 
                        <View style={{display: "flex", flexDirection: "row", padding: 5}}>
                            <View style={{flexDirection: "row", borderColor: "#662397", borderWidth: 2,borderRadius: 20, color: "#662397"}}>
                                <RadioButton
                                    value="amount"
                                    status={ checked === 'amount' ? 'checked' : 'unchecked' }
                                    onPress={() => setChecked('amount')}
                                    color="#662397"
                                />
                            </View>
                            <Text style={{...customstyles.h5, fontWeight: "normal", fontSize: 15, alignSelf: "center", justifyContent: "center", padding: 5}}>amount</Text>
                        </View>                       
                    </View>
                </View>}
            
            {isLoading   && <Loader />} 

            <View style={{flex: 3, alignItems: "center", marginTop: 20}}>
                <ScrollView>
                 {
                     transactionArr.length != 0 && 
                        transactionArr.map((object, i) => (
                            <TouchableOpacity style={styles.tranBackground}>
                                <Image source={mtransfer} style={styles.imageStyle}></Image>
                                <View style={{...styles.textView, paddingBottom: 5}}>
                                    { object.amount>0 ?
                                        <Text style={styles.titleText}>+${object.amount}</Text>
                                    :
                                        <Text style={styles.titleText}>-${object.amount}</Text>
                                    } 
                                    <Text style={styles.dateTimeText}>{object.description}</Text>
                                    <Text style={styles.dateTimeText}>Date: {object.date.split("T")[0]}</Text>
                                    <Text style={styles.dateTimeText}>Time: {object.date.split("T")[1].split("+")[0]}</Text>

                                </View>
                                <Text style={styles.brandNameText}>{object.details.name}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    {
                        !isLoading && transactionArr.length == 0 &&
                        <View style={{borderColor: "#aaa", backgroundColor: "transparent", borderWidth: 0, justifyContent: "flex-start"}}>
                            <Text style={{fontSize: 20, padding: 10}}>
                                No transactions found!
                            </Text>
                        </View>   
                    }
                </ScrollView>
            </View>

        </View>
       
    </View>
    );
}

const styles = StyleSheet.create({
    tranBackground: {
        width: "100%",
        backgroundColor: "white",
        borderColor: "black",
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
        fontFamily: "Thonburi",
        fontSize: 20,
        color: "#663297",
    },
    dateTimeText: {
        fontFamily: "Thonburi",
        fontSize: 10,
        color: "#663297",
        width: "75%"
    },
    brandNameText:{
        alignSelf: "center",
        fontSize: 10,
        opacity: 0.5,
        fontFamily: "Thonburi",
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


export default Transactionlist;