import React, {useEffect} from 'react';
import { Alert, Linking, StyleSheet, View, Button, Dimensions, TouchableOpacity, Text, Image, ImageBackground, ScrollView, Modal, SafeAreaView} from 'react-native';
import { customstyles } from '../customstyle';
import Icon from 'react-native-ionicons'
import TranItem from "./TranItem";
import {getBalance, transactionlist, commonPost, linkTokenCreation} from "./functions.js";
import { AntDesign } from '@expo/vector-icons'; 
import Dialog from "react-native-dialog";
import SearchBar from "react-native-dynamic-search-bar";
import Loader from "./Loader";
import Moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PlaidProvider, PlaidProviderLinkWebView, usePlaidLinkWebViewProps} from 'react-native-use-plaid';
import {usePlaidLinkState, PlaidLinkStage} from 'react-native-use-plaid';
import PlaidLink from 'react-native-plaid-link-sdk';
//import { PlaidLink, LinkSuccess, LinkExit, LinkLogLevel, LinkIOSPresentationStyle } from 'react-native-plaid-link-sdk';

function NewWallet({ route, navigation }){

    const [linkToken, setLinkToken] = React.useState(null);
    const [userId, setuserId] = React.useState('');   
    const [userdata, setuserdata] = React.useState('');
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

    const windowHeight = Dimensions.get("window").height
    const WIN_HEIGHT = Dimensions.get('window').height - 30;
    const SLIDER_WIDTH = Dimensions.get('window').width - 40;
    const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
    const screenHeight = Dimensions.get('window').height
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
    const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT);
    const IMG_WIDTH = Math.round(ITEM_WIDTH);
    const IMG_HEIGHT = Math.round(ITEM_HEIGHT)

    async function getLinkToken() {
        try {
          var currData = await linkTokenCreation();
          console.log("Current JSON Data");
          console.log(currData);
          var jsonData = JSON.parse(currData);
          setTimeout(() => {
            setLinkToken(jsonData.link_token);
          }, 1000)
          console.log("Link Token ", linkToken)
          console.log(jsonData);
        } catch (error) {
          console.error(error);
        }
    };
    function useLinkToken() {
        if(linkToken){
            Linking.openURL(`https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=${linkToken}`);
        }
    }
    /*let returnLinkToken = () => {
        console.log("FirstLinkToken ", linkToken)
        return(
            <View>
                <PlaidLink
                    tokenConfig={{
                        token: {linkToken},
                        // OPTIONAL - log level.
                        logLevel: LinkLogLevel.ERROR,
                        // OPTIONAL - Hides native activity indicator if true.
                        noLoadingState: false,
                    }}
                    onSuccess={(success: LinkSuccess) => { console.log(success) }}
                    onExit={(exit: LinkExit) => { console.log(exit) }}
                    // OPTIONAL - MODAL or FULL_SCREEEN presentation on iOS. Defaults to MODAL.
                    // UI is always presented in full screen on Android.
                    iOSPresentationStyle={LinkIOSPresentationStyle.MODAL}
                >
                    <Text>Add Account</Text>
                </PlaidLink>
            </View>
        )
    }*/
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
                    fullList = []
                    for(let i = 0; i<result.transactions.length; i++){
                        if(result.transactions[i].type != "Get Card"){
                            fullList.push(result.transactions[i]);
                        }
                    }
                    setlistTransactions(fullList);
                }
              
               // console.log(transactionArr);
            })
           }
           getLinkToken();
           console.log("Link Token Final ", linkToken)
           console.log("NewWalletInfo");
           let userId = route.params.user_id;
           setuserId(userId);
           console.log(userId + 'Wallet');
           let data = {
               id: route.params.user_id,
               api_url: 'getearnamount'
           }
           if(userdatas.current_location == 1){
               const newResponse = commonPost(data)
               .then(resp => {
                    console.log(route.params.user_id);
                   console.log("Paypal Wallet: ", resp.data);
                   setEarnamt(resp.data.earnamt);
                   setPenndingamt(resp.data.pendingamt);
               })
             
               .catch((error) => {
                   //setisLoading(false)
                   console.log(error)
               })
           } else {
               getBalance(userId).then(res => {
                   console.log(res);
                   setTempBalance(res.funds.available.amount);
               })
           }
           
           
           /*.then((result) => {
                console.log("FinalOne")
                console.log(typeof result); 
                /*setTimeout(() => {
                    setLinkToken(result.link_token);
                }, 1000)
                console.log(link_token);
                Moment.locale('en');
           })*/
       });
    }, [linkToken]);

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
                console.log("Create Accounts: ")
                console.log(res);
                let code = res.code;
                let message = res.description;
                if ((code == 400 && message == "Error: account_number record already exist")) { //Already exists
                    navigation.navigate("ViewVirtual", {user_id: userId})
                    setErrResp(message);
                    setTimeout(() => {
                        setErrResp('');
                    }, 4000);
                } else if(code == 500){
                    Alert.alert(
                        'Unable to load virtual accounts',
                        'We\'re working to fix this issue on our server. Please try again later.',
                        [
                            { text: 'OK', onPress: () => {} },
                        ]
                    );
                }else { //Doesn't Exist
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
                navigation.navigate("Transactions", {user_id: userId});    
            }
    }
    return (
        <PlaidProvider
        redirectUri="https://cdn.plaid.com/link/v2/stable/link.html" /* example */
        basePath="sandbox"
        clientName="IdentityWallet"
        clientId="6486ced0ab8edd001b9f0a55"
        clientSecret="2224d52552490ca8664398faba5cb2">
            <SafeAreaView style={{...styles.scrollArea, height: WIN_HEIGHT, backgroundColor: "white"}}>
                <View style={{backgroundColor: "white"}}>
                        <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                            <Text style={{ ...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15, marginBottom: 10, color: "#20004A"}}>My Wallet</Text>
                        </View>
                    { userdata.current_location==1 &&
                    <View style={{...customstyles.filterContainerOutline}}>
                        <View style={{...customstyles.walletBalanceBackground, backgroundColor: "#fff", borderColor: "white", borderWidth: 10, opacity: 1, marginLeft: 20, borderShadow: "#fff"}}>
                            <Text style={{...customstyles.walletBalanceText, fontSize:20, color: "white", marginLeft: 15, color: "#662397"}}>Your Data Earnings: </Text>
                            <Text style={{...customstyles.titleText, color: "white", marginLeft: 15,marginRight: 30, fontSize: 24, color: "#662397"}}>$ {earnamt}</Text>
                            <Text style={{...customstyles.walletBalanceText, fontSize:20, color: "white", marginLeft: 15, color: "#662397"}}>Pending Data Earnings: </Text>
                            <Text style={{...customstyles.titleText, color: "white", marginLeft: 15,marginRight: 30, fontSize: 24, color: "#662397"}}>$ {penndingamt}</Text>
                        </View> 
                        {/*
                            linkToken != null && returnLinkToken()
                    */}
                    </View>} 
                    { userdata.current_location!=1 &&
                    <View style={{...customstyles.walletBalanceBackground}}>
                        <Text style={{...customstyles.walletBalanceText, fontSize:20, color: "white", marginLeft: 15}}>Balance: </Text>
                        <Text style={{...customstyles.titleText, color: "white", marginLeft: 15,marginRight: 30, fontSize: 24}}>$ {tempBalance}</Text>
                    </View> } 
                    {/*
                    Actions Section --> Three options :| configuration
                    */}
                    { userdata.current_location!=1 &&
                    <View style={{flex: 1, justifyContent: "center"}}>
                        <Text style={{...customstyles.titleText, fontWeight: 'bold'}}>Actions</Text>
                    </View>}
                    { userdata.current_location!=1 &&
                    <View flexDirection="row" style={{justifyContent: "center", padding: 2}}>
                        <View style={{ width: "45%", marginRight: 10, borderRadius: 16, padding:5}}>
                            <TouchableOpacity style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "#662397", borderWidth: 0, padding: 5}} onPress={retrieveUserWallet}>                        
                                <Text style={{...customstyles.titleText, flex: 0.5, fontSize: 15, padding: 5, justifyContent: "flex-end", alignSelf: "flex-end"}}>View Wallet</Text>
                                <Image source={coinsIcon} style={{flex: 0.5, width: 60, height: 60, justifyContent: "flex-end"}}>
                                </Image>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "#662397", borderWidth: 0, padding: 5, marginTop: 9}} onPress={checkAccount}>
                                <Text style={{...customstyles.titleText, flex: 0.5, fontSize: 15, padding: 5, alignSelf: "flex-end"}}>
                                    Account
                                </Text>
                                <Image source={vaccount} style={{flex: 0.5, width: 60, height: 60, justifyContent: "flex-end"}}>
                                </Image>
                            </TouchableOpacity>
                        </View> 
                        <View style={{ width: "45%", marginRight: 20, borderRadius: 16, padding:5, flex: 3}}>
                            <TouchableOpacity style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "#662397", borderWidth: 0, padding: 5}} onPress={showCard}>
                                <Text style={{...customstyles.titleText, flex: 0.5, fontSize: 15, padding: 5, justifyContent: "flex-end", alignSelf: "flex-end"}}>Cards</Text>
                                <Image source={cards} style={{flex: 0.5, width: 60, height: 60, justifyContent: "flex-end"}}>
                                </Image>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("TransferAmt", {user_id: userId})}style={{ justifyContent: "space-between", flex: 1, flexDirection:"row", backgroundColor:"white", borderRadius:16, marginBottom: 5, borderColor: "#662397", borderWidth: 0, padding: 5, marginTop: 9}}>
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
                    <Text style={{...customstyles.titleText, fontWeight: 'bold', color: "#20004A", marginLeft: 20, marginTop: 20}}>Connect Payment Data</Text>
                    {/*<PlaidLinkWrapper client_user_id={userId.toString()}/>*/}
                    {/*<PlaidComponent linkToken={linkToken}/>*/}
                    <View style={{ ...customstyles.filterContainer, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "90%", marginLeft: 20}}>
                        <View style={{alignSelf: "flex-start"}}>
                            <TouchableOpacity onPress={() => useLinkToken()} style={{ ...customstyles.px30, marginVertical: 10, alignSelf: "flex-start"}}>
                                <Text style={{ color: "#20004A", borderColor: "#20004A", borderRadius: 10, fontSize: 15, textAlign: "left"}}>Connect Payment Data</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{alignItems: "center", justifyContent: "space-between", flexDirection: "row", marginLeft: 20, marginTop: 20, width: "90%"}}>
                        <Text style={{...customstyles.titleText, fontWeight: 'bold', color: "#20004A"}}>Recent Transactions</Text>
                        <TouchableOpacity onPress={lookAllTran}>
                            <AntDesign name="rightcircle" size={30} color="#fff" style={{justifyContent: "center"}} />
                        </TouchableOpacity>
                    </View>
                    { userdata.current_location!=1 ?
                    <View style={{flex: 3}}>
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
                        <View style={{justifyContent: "space-around"}}>
                            <Text style={{alignSelf: "flex-start", color: "grey", fontSize: 30, marginLeft: 20}}>No Transactions Found</Text>
                        </View>
                        }
                    </View>:
                    <View style={{marginLeft: 20}}>
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
                            <Text style={{color: "grey", fontSize: 20, marginTop: 10}}>No Transactions Found</Text>
                    </View>}
                </View>
                    }
                </View>
            </SafeAreaView>
        </PlaidProvider>
    );
}


const styles = StyleSheet.create({
    tranBackground: {
        width: "95%",
        padding: 5,
        backgroundColor: "white",
        borderColor: "#662397",
        borderWidth: 0,
        flexDirection: "row",
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
    },

    scrollArea: {
        paddingTop: 20,
        flex: 1,
        width: "100%",
        backgroundColor: "white"
        // paddingTop: StatusBar.currentHeight,
    }
});

function PlaidLinkWrapper ({ children, client_user_id }) {
    /*const [state, { connect, disconnect }] = usePlaidLinkState({ client_user_id });
    var webViewProps = usePlaidLinkWebViewProps({ client_user_id: {client_user_id} })


    openInBrowser = () => {
        this.handleConnect(connect)
        console.log("WebView Props:", webViewProps);
        // If the method is not POST, you can simply open the URL in the browser.
      };
    
    useEffect(() => {
        if(state.link_token && state.stage == PlaidLinkStage.INITIALIZE){
            console.log("PRINTINGG")
            Linking.openURL(`${webViewProps.source.uri}?isWebview=true&token=${state.link_token}`);
        }
    }, [state])

    this.setState({
        state: state,
        connect: connect,
        disconnect: disconnect
    })
    handleConnect = (connect) => {
        console.log("NITYACONNECT")
        console.log(connect);
        connect({ country_codes: ['US'], language: 'en' })
        console.log("Current state: ", state);
        return "Hello";
      };
    
    handleDisconnect = (disconnect) => {
        disconnect({ client_user_id: client_user_id});
    };
    
    // Log the state and actions to the console
    console.log('State:', state);
    console.log('Connect:', connect);
    console.log('Disconnect:', disconnect);
    */
    // Pass the state and actions to the children function
    if (state.stage == PlaidLinkStage.INITIALIZE) {
        return (
            <View style={{ ...customstyles.filterContainer, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "90%", marginLeft: 20, height: 300}}>
                <PlaidProviderLinkWebView client_user_id={client_user_id} >
                </PlaidProviderLinkWebView>
            </View>
        )
    } else if(state.stage == PlaidLinkStage.SUCCESS) {
        return (
        <View style={{ ...customstyles.filterContainer, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "90%", marginLeft: 20}}>
            <View style={{alignSelf: "flex-start"}}>
                <View onPress={() => this.handleConnect(connect)} style={{ ...customstyles.px30, marginVertical: 10, alignSelf: "flex-start"}}>
                    <Text style={{ color: "#20004A", borderColor: "#20004A", borderRadius: 10, fontSize: 15, textAlign: "left"}}>Payment Data Connected</Text>
                </View>
            </View>
        </View>
        )
    }else {
        return (
        <View style={{ ...customstyles.filterContainer, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "90%", marginLeft: 20}}>
            <View style={{alignSelf: "flex-start"}}>
                <TouchableOpacity onPress={() => this.handleConnect(connect)} style={{ ...customstyles.px30, marginVertical: 10, alignSelf: "flex-start"}}>
                    <Text style={{ color: "#20004A", borderColor: "#20004A", borderRadius: 10, fontSize: 15, textAlign: "left"}}>Connect Bank Account</Text>
                </TouchableOpacity>
            </View>
        </View>
        )
    }
  }

  function PlaidComponent({linkToken}){
    const handlePlaidSuccess = (linkToken) => {
        // Handle the Plaid success callback here (e.g., send token to your server)
        console.log('Plaid Link success with token: ', linkToken);
    };
    
    const handlePlaidExit = () => {
        // Handle the Plaid exit/cancel callback here
        console.log('Plaid Link exited');
    };
    
    const config = {
        token: linkToken, // Your Plaid public key
        onSuccess: handlePlaidSuccess,
        onExit: handlePlaidExit,
    };
    
    return (
        <PlaidLink config={config}>
            <Text>Link your bank account</Text>
        </PlaidLink>
    );
  }
export default NewWallet;

