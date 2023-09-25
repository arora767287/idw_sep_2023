import React, { useEffect, useState,useRef  } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, FlatList, ScrollView, Modal} from 'react-native';
import { customstyles } from '../customstyle';
import Loader from './Loader';
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from '@expo/vector-icons'; 
import Moment from 'moment';
import SearchBar from "react-native-dynamic-search-bar";
import {transactioncardlist,commonPost, commonPostText, commonGet, ViewCards } from './functions';
import { Ionicons } from '@expo/vector-icons';
import {Dropdown} from "react-native-element-dropdown";
function Cardtransactionlist({route, navigation}){
    var mtransfer = require("../assets/Images/transfer.png")
    const [count, setCount] = useState(2);
    const [cardno, setCardno] = useState(2);
    const [userId, setuserId] = useState('');
    const [cards, setCard] = useState('');
    const [transactionArr, setTransactionArr] =useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [searchvisible, setsearchvisible] = useState(false);
    const [holdername, setholdername] = useState('');
    const [purpose, setpurpose] = useState('');
    const [amount, setamount] = useState('');
    const [cardnolabel, setCardnoLabel] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    useEffect(() => {
        let userId = route.params.user_id;
        setuserId(userId);
        console.log(userId + 'Wallet');
        retriveUserCard(route.params.user_id);
        Moment.locale('en');
    }, []);
    let fetchMore = () => {
        setCount(count + 1);
        console.log("count="+count);
        setisLoading(true)
        var resp = transactioncardlist(userId,count)
            .then(resp => {
                let result = resp;
                let list = [...transactionArr, ...result.data]
                setTransactionArr(list);
                setisLoading(false)
               // console.log(transactionArr);
            })
            .catch((error) => {
                setisLoading(false)
                console.log("Found Error");
                console.log(error)
            })
    }
    let retriveUserCard = (user_id) => {
        setisLoading(true);
        let data = {
            id: user_id,
            api_url: 'getUserWalletCard'
        }
        console.log("Getting Cards");
        var resp = ViewCards(user_id)
            .then(resp => {
                console.log(resp);
                console.log("cards++++++++++++++");
                console.log(resp.cards);
                currList = []
                for(let i = 0; i<resp.cards.length; i++){
                    currList.push({value: resp.cards[i].id, label: resp.cards[i].number});
                }
                console.log("Full List");
                console.log(currList);
                setTimeout(() => {
                    setCard(currList);
                    setisLoading(false);
                    console.log("All Cards");
                }, 1000);
                console.log(cards);
            })
            .catch((error) => {
                console.log("Retrieving Cards Mistake: ", error);
            })
    }
    const nativewallet = () => {
        navigation.navigate("Transactions", {user_id: userId});
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
        const getcard = (value) => {
            console.log("value"+value)
            setCardno(value)
            viewtransactionlist(route.params.user_id,value);
           
    }
    let viewtransactionlist = (user_id,card) => {
        setisLoading(true)
        var resp = transactioncardlist(user_id,1,card)
            .then(resp => {
                let result = resp;
                console.log(result);
                setTransactionArr(result.transactions);
                setisLoading(false)
              
            })
            .catch((error) => {
                console.log(error)
                setisLoading(false)
            })
        }
    return (
    <View style={{flex: 4.1, marginLeft: 20, marginRight: 20, marginTop: 50}}>
        <View style={{alignItems: "center", justifyContent: "flex-start",flexDirection: "row", marginBottom: 10}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="leftcircle" size={30} color="#663297"  />
            </TouchableOpacity>
            <Text style={{...customstyles.titleText, fontWeight: 'bold', fontSize: 30, paddingLeft:15}}>All Transactions</Text>
        </View>
        <View style={{alignItems: "center", flexDirection: "row"}}>
        <TouchableOpacity>
        <View style={{justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
            <TouchableOpacity onPress={nativewallet} style={{borderColor: "#662397", borderRadius: 32, backgroundColor: "#fff", borderWidth: 5, padding: 5, marginRight: 10}}>
                <View>
                    <Text style={{width:150, backgroundColor: "transparent", color: "#662397", textAlign: "center", fontSize: 20}}>
                        Wallet
                    </Text>
                </View>
            </TouchableOpacity> 
            <TouchableOpacity style={{borderColor: "#662397", borderRadius: 32, backgroundColor: "#662397", borderWidth: 5, padding: 5}} >
                <View>
                    <Text style={{width:150,marginLeft:8, textAlign: "center", fontSize: 20, color: "#fff"}}>
                        Card
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
    </View>
        <View style={{flex: 3, alignItems: "center", marginLeft: -20, marginRight: -20, padding: 10}}>
            {/**List of transactions from for loop mapping*/}
            {
                cards.length > 0 ?
                <Dropdown
                style={[styles.dropdown, {borderColor: '#662397', borderWidth: 2 }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={cards}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select Card Number': ''}
                searchPlaceholder="Search..."
                value={cardno}
                onFocus={() => setIsFocus(false)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    //(item)
                    console.log("FirstItem");
                    setCardno(item.id);
                    setCardnoLabel(item.value);
                    setIsFocus(false);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                    style={styles.icon}
                    color={isFocus ? '#662397' : '#662397'}
                    name="Safety"
                    size={20}
                    />
                )}
                /> :
                    <View>
                    </View>
            }
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
      <Text style={{textAlign: "center", color: "black", fontSize: 20, padding: 10}}>No Transactions Found!</Text>
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
      dropdown: {
        height: 50,
        marginTop: 10,
        width: "90%",
        color: "#662397",
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: '#662397',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
        color: "#662397",
        fontFamily: "Thonburi"
      },
      selectedTextStyle: {
        fontSize: 16,
        color: "#662397",
        fontFamily: "Thonburi"
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      }
});


export default Cardtransactionlist;