import React from 'react';
import { Alert, StyleSheet, View, Button, TouchableOpacity, Text, Image, ImageBackground, ScrollView, Modal} from 'react-native';
import { customstyles } from '../customstyle';
import Icon from 'react-native-ionicons'
import TranItem from "./TranItem";
import {getBalance, transactionlist, commonPost} from "./functions.js";
import { AntDesign } from '@expo/vector-icons'; 
import { retriveWallet, commonPost } from './functions';
import Dialog from "react-native-dialog";
import SearchBar from "react-native-dynamic-search-bar";
import Loader from "./Loader";
import Moment from 'moment';

function NewWallet({ route, navigation }){

    const [userId, setuserId] = React.useState('');    
    const [userdata, setuserdata] = React.useState('');eact.useState('');
    const [errResp, setErrResp] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [virtualDetail, setVirtual] = React.useState([]);
    const currImage = require("../assets/Images/new_background.jpg");
    const [wallVisible, setWallVisible] = React.useState(false);

    const [loader, setLoader] = React.useState(false);
    const [wallet, setWallet] = React.useState('');
    const [holder, setHolder] = React.useState([]);
    const [issueDate, setDates] = React.useState([]);
    const [walletStatus, setWalletStatus] = React.useState('');
    const [transactionArr, setTransactionArr] = React.useState([]);
    const [listTransactions, setlistTransactions] = React.useState([]);
    const [listpTransactions, setlistpTransactions] = React.useState([]);

    const [earnamt, setEarnamt] = React.useState(0);
    const [penndingamt, setPenndingamt] = React.useState(0);

    React.useEffect(() => {
        const value = AsyncStorage.getItem('userInfo')
        .then((value) => {
           console.log("This information")
         
           setuserdata(JSON.parse(value));
           let userdatas=JSON.parse(value);
           console.log(userdatas.current_location);
           if(userdatas.current_location==1){
            let data = {
                id: route.params.user_id,
                api_url: 'paypaltransactionlist'
            }
            const newResponse = commonPost(data)
            .then(resp => {
               
                let result = resp;
                console.log(result);
                if(result.data){
                    setlistpTransactions(result.data);
                }
            })
           }else{
            console.log("test");
            var resp = transactionlist(route.params.user_id,1)
            .then(resp => {
                console.log("resp.data-------------");
                let result = resp;
                console.log(result);
                if(result.transactions){
                    setlistTransactions(result.transactions);
                }
              
               // console.log(transactionArr);
            })
           }
       });
        let userId = route.params.user_id;
        setuserId(userId);
        console.log(userId + 'Wallet');
        let data = {
            id: route.params.user_id,
            api_url: 'getearnamount'
        }
        const newResponse = commonPost(data)
        .then(resp => {
           
            console.log(resp.data);
            setEarnamt(resp.data.earnamt);
            setPenndingamt(resp.data.pendingamt);
        })
      
        .catch((error) => {
            setisLoading(false)
            console.log(error)
        })
        Moment.locale('en');
    }, []);

    let retrieveUserWallet = () => {
        navigation.navigate("RetriveWallet", {user_id: userId})
        /*
        var resp = retriveWallet(userId)
            .then(resp => {
                console.log("resp", resp);
                setLoader(true);
                setWallet(resp.number);
                setHolder(resp.holder.name);
                setDates(resp.date);
                setWalletStatus(resp.status.text);
                setWallVisible(true);
            })
            .catch((error) => {
                console.log(error)
            })
        */
    }
    let showCard = () => {
        {/*navigation.navigate('ViewCard', { user_id: userId });*/}
        navigation.navigate('AllCards', {user_id: userId})
    }

    let checkAccount = () => {
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
                if ((code == 400 && message == "Error: account_number record already exist")) { //Already exists
                    navigation.navigate("ViewVirtual", {user_id: userId})
                    setErrResp(message);
                    setTimeout(() => {
                        setErrResp('');
                    }, 4000);
                } else { //Doesn't Exist
                    
                    Alert.alert(
                        'Create Virtual Account',
                        'Are you sure you want to create a new virtual account?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => createVirtualCard() },
                        ]
                    );

                    setSuccResp('Virtual Account Created Successfully');
                    setTimeout(() => {
                        setSuccResp('');
                    }, 4000);
                }

            })
            .catch(error => console.log(error));
    }

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
                    Alert.alert(
                        'Deactivated User Account',
                        'Your matchmove account is currently deactivated.',
                        [
                            { text: 'OK', onPress: () => {} },
                            {
                                text: 'Request Activation',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            }
                        ]
                    );

                } else {
                    navigation.navigate("ViewVirtual", {user_id: userId})
                    setSuccResp('Virtual Account Created Successfully');
                    setTimeout(() => {
                        setSuccResp('');
                    }, 4000);
                }

            })
            .catch(error => console.log(error));
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

    /*let createVirtualCard = () => {
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
                } 
                else {
                    setSuccResp('Virtual Account Created Successfully');
                    setTimeout(() => {
                        setSuccResp('');
                    }, 4000);
                    navigation.navigate("Account", {user_id: userId, virtualInfo: virtualDetail})
                }
                //console.log(visible);

            })
            .catch(error => console.log(error));
        
    }*/
    const clickAccount = () => {
        //Check if they already have a virtual account or not

        let data = {
            id: userId,
            type: 'getaccount',
            api_url: 'virtualAccount'
        }
        var response = commonPost(data)
            .then(res => {
                setVirtual(res.data[0].fast_accounts);
                newFunction(res.data[0].fast_accounts);
            })
            .catch(error => console.log(error));
        
        //console.log(virtualDetail);

    }
    

    const newFunction = (stringVirtual) =>{
        if(stringVirtual.length > 0){
            navigation.navigate("Account", {user_id: userId, virtualInfo: virtualDetail})
        }
        else{
            console.log("Doing")
            createVirtualCard();
        }
    }

    const handleCancel = () => {
        setVisible(false);
    }; 

    const [tempBalance, setTempBalance] = React.useState(0);
    const [username, setUsername] = React.useState("Nitya");
    const [lookTran, setLookTran] = React.useState(false);
    var newList = ["Hello", "Hi"]
    var listTransactions1 = [
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

   //console.log(listTransactions[0].brand_name);

    var coinsIcon = require("../assets/Images/coins.png");
    var cards = require("../assets/Images/cards_credit.png");
    var vaccount = require("../assets/Images/network_account.png");
    var mtransfer = require("../assets/Images/transfer.png")

    let lookAllTran = () =>{
        if(userdata.current_location==1){
            navigation.navigate("Transactionplist", {user_id: userId});
            }else{
                navigation.navigate("Transactionlist", {user_id: userId});    
            }
    }
    return (
        <View style={{flex: 10, marginLeft: 20, marginTop: 30}}>
 
            <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold',paddingBottom:15}}>Your Wallet</Text>
            { userdata.current_location==1 &&
            <View style={{...customstyles.walletBalanceBackground,}}>
                <Text style={{...customstyles.walletBalanceText, fontSize:20, color: "white", marginLeft: 15}}>Your Data Earnings: </Text>
                <Text style={{...customstyles.titleText, color: "white", marginLeft: 15,marginRight: 30, fontSize: 24}}>$ {earnamt}</Text>
                <Text style={{...customstyles.walletBalanceText, fontSize:20, color: "white", marginLeft: 15}}>Pending Data Earnings: </Text>
                <Text style={{...customstyles.titleText, color: "white", marginLeft: 15,marginRight: 30, fontSize: 24}}>$ {penndingamt}</Text>
            </View> } 
            { userdata.current_location!=1 &&
            <View style={{...customstyles.walletBalanceBackground,}}>
                <Text style={{...customstyles.walletBalanceText, fontSize:20, color: "white", marginLeft: 15}}>Your Data Earnings: </Text>
                <Text style={{...customstyles.titleText, color: "white", marginLeft: 15,marginRight: 30, fontSize: 24}}>$ {earnamt}</Text>
                <Text style={{...customstyles.walletBalanceText, fontSize:20, color: "white", marginLeft: 15}}>Pending Data Earnings: </Text>
                <Text style={{...customstyles.titleText, color: "white", marginLeft: 15,marginRight: 30, fontSize: 24}}>$ {penndingamt}</Text>
            </View> } 
            {/*
            Actions Section --> Three options :| configuration
            */}
               { userdata.current_location!=1 &&
            <View style={{flex: 1, justifyContent: "center"}}>
                <Text style={{...customstyles.titleText, fontWeight: 'bold'}}>Actions</Text>
            </View>}
            { userdata.current_location!=1 &&
            <View flexDirection="row" style={{justifyContent: "center", padding: 2, flex: 3}}>
                <View style={{ width: "45%", marginRight: 10, borderRadius: 16, padding:1}}>
                    <TouchableOpacity onPress={retrieveUserWallet} style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "black", borderWidth: 10}}>
                        <Text style={{...customstyles.titleText, flex: 0.5, fontSize: 15, padding: 5, justifyContent: "flex-end", alignSelf: "flex-end"}}>View Wallet</Text>
                        <Image source={coinsIcon} style={{flex: 0.5, width: 60, height: 60, justifyContent: "flex-end"}}>
                        </Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "black", borderWidth: 10}} onPress={checkAccount}>
                        <Text style={{...customstyles.titleText, flex: 0.5, fontSize: 15, padding: 5, alignSelf: "flex-end"}}>
                            Account
                        </Text>
                        <Image source={vaccount} style={{flex: 0.5, width: 60, height: 60, justifyContent: "flex-end"}}>
                        </Image>
                    </TouchableOpacity>
                </View> 
                <View style={{ width: "45%", marginRight: 20, borderRadius: 16, padding:1, flex: 3}}>
                    <TouchableOpacity style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "black", borderWidth: 10}} onPress={showCard}>
                        <Text style={{...customstyles.titleText, flex: 0.5, fontSize: 15, padding: 5, justifyContent: "flex-end", alignSelf: "flex-end"}}>Cards</Text>
                        <Image source={cards} style={{flex: 0.5, width: 60, height: 60, justifyContent: "flex-end"}}>
                        </Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("TransferAmt", {user_id: userId})}style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "black", borderWidth: 10}}>
                        <Text style={{...customstyles.titleText, flex: 0.5, fontSize: 15, padding: 5, alignSelf: "flex-end"}}>
                            Send
                        </Text>
                        <Image source={mtransfer} style={{flex: 0.5, width: 60, height: 60, justifyContent: "flex-end"}}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>}
            {/*
            Transactions listing section -- faded towards the least recent
            */}
            <View style={{flex: 1, alignItems: "center", justifyContent: "space-between", flexDirection: "row", marginRight: 20}}>
                <Text style={{...customstyles.titleText, fontWeight: 'bold'}}>Recent Transactions</Text>
                <TouchableOpacity onPress={lookAllTran}>
                    <AntDesign name="rightcircle" size={30} color="#663297" style={{justifyContent: "center"}} />
                </TouchableOpacity>
            </View>
            { userdata.current_location!=1 ?
            <View style={{flex: 3, }}>
                {listTransactions.length>0 ?  
                <ScrollView style={{padding: 5}}>
                    {
                        listTransactions.map((object, i) => (
                            <TouchableOpacity style={styles.tranBackground}>
                                <Image source={mtransfer} style={styles.imageStyle}></Image>
                                <View style={styles.textView}>
                                    { object.amount>0 ?
                                        <Text style={styles.titleText}>+${object.amount}</Text>
                                    :
                                        <Text style={styles.titleText}>-${object.amount}</Text>
                                    } 
             <Text style={styles.dateTimeText}>From: {object.description}</Text>
            <Text style={styles.dateTimeText}>To: {object.details.name}</Text>
            <Text style={styles.dateTimeText}>{Moment(object.created_at).format('Y-MM-DD HH:MM ')}</Text>
                                </View>
                            </TouchableOpacity>
                        ))                        
                    }
                </ScrollView>:
                 <View>
                 <Text style={{textAlign: "center", color: "grey", fontSize: 15}}>Record Not Exists</Text>
             </View>}
            </View>:
             <View style={{flex: 3, }}>
             {listpTransactions.length>0 ?  
             <ScrollView style={{padding: 5}}>
                 {
                     listpTransactions.map((object, i) => (
                         <TouchableOpacity style={styles.tranBackground}>
                             <Image source={mtransfer} style={styles.imageStyle}></Image>
                             <View style={styles.textView}>
                            <Text style={styles.titleText}>${object.amount}</Text>
          <Text style={styles.dateTimeText}>From: {object.from}</Text>
         <Text style={styles.dateTimeText}>To: {object.to}</Text>
         <Text style={styles.dateTimeText}>{Moment(object.transaction_date).format('Y-MM-DD HH:MM ')}</Text>
                             </View>
                         </TouchableOpacity>
                     ))                        
                 }
             </ScrollView>:
              <View>
              <Text style={{textAlign: "center", color: "grey", fontSize: 15}}>Record Not Exists</Text>
          </View>}
         </View>
            }
            <View style={{flex: 0.1}}>
                
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    tranBackground: {
        width: "95%",
        backgroundColor: "white",
        borderColor: "#662397",
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
        padding:2.5,
        borderColor: "black",
        borderWidth: 2,
        marginLeft: "auto",
        marginRight: 15
    }
});


export default NewWallet;
