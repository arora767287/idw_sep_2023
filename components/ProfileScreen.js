import React, {Component } from 'react';
import { Alert, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
//import SideSwipe from 'react-native-sideswipe';
import { customstyles } from "../customstyle";
import { commonGet, commonPost, commonGetwithkey, getFolderPercent, getQuestionsAnswered, transactionlist, commonPostText, LoginAPI, eKYCStart, eKYCVerify, retriveWallet} from './functions';
import Background from './Background';
import fractionUnicode from 'fraction-unicode';
import * as Progress from 'react-native-progress';
import { ComplexAnimationBuilder } from 'react-native-reanimated';
import Loader from "./Loader.js"
const slide1 = require('../assets/Images/McDonalds-coupons.jpg');
const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 30;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH) - 200;
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(SLIDER_WIDTH)/2.5 ;
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';
import PaginationDot from "react-native-animated-pagination-dot"
import NormCard from "./NormCard"
import Dialog from "react-native-dialog";
const currImage = require("../assets/Images/new_background.jpg");
const windowHeight = Dimensions.get("window").height;
import Moment from 'moment';

const RNfirebaseConfig = {
    apiKey: "AIzaSyDDwxTxsPQ9X0WUd1mI-Go3HFjJrfHpZoM",
    //authDomain: "note-app-rn.firebaseapp.com",
    projectId: "identity-wallet-92a26",
    databaseURL: "",
    storageBucket: "identity-wallet-92a26.appspot.com",
    messagingSenderId: "288772838619",
    appId: "1:288772838619:ios:722745011bebd0e3a9a8fe"
  };
  

const infoData = {
   labels: ["Swim", "Bike", "Run"], // optional
   data: [0.4, 0.6, 0.8]
 };
const percentage = 66;
const chartConfig= {
backgroundColor: "#EFF1F3",
backgroundGradientFrom: "#EFF1F3",
backgroundGradientTo: "#EFF1F3",
decimalPlaces: 2, // optional, defaults to 2dp
color: (opacity = 1) => `rgba(102, 35, 151, ${opacity})`,
labelColor: (opacity = 1) => `rgba(102, 35, 151, ${opacity})`,
style: {
   borderRadius: 16
},
propsForDots: {
   r: "6",
   strokeWidth: "2",
   stroke: "#ffa726"
}
}
 
const WIN_HEIGHT = Dimensions.get('window').height - 30;
const screenHeight = Dimensions.get('window').height
 
var coinsIcon = require("../assets/Images/coins.png");
var cards = require("../assets/Images/cards_credit.png");
var vaccount = require("../assets/Images/network_account.png");
var mtransfer = require("../assets/Images/transfer.png")
var valueEnd = 66;
var folderPercents = null;
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
       "amount": -50,
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
];

/*const firebaseConfig = {
    //...
  };
 */
//need to put in conditional for when to run
const app = firebase.initializeApp(RNfirebaseConfig);
class ProfileScreen extends Component {
   state = {
       userData: '',
       activeIndex: 0,
       carouselItems: [],
       selectedMenu: '',
       visible: false,
       is_wallet_check: '',
       isLoading: false,
       firstFrac: null,
       secondFrac: null,
       percentValue: null,
       listTags: [],
       listCategories: [],
       generalFolder: [],
       numAnswered: 0,
       transactionList: [],
       kycID: [],
       kycDone: false,
       couponpopup: false,
       email_err: '',
       current_location:'',
       configured: false
   }
 
   componentDidMount() {
       //this.onLogin();
       const value = AsyncStorage.getItem('userInfo')
           .then((value) => {
               console.log("This information")
               const newValue = AsyncStorage.getItem('allDocs').then((other) => {
                console.log("z All Docs");
                console.log(other);
               })
               console.log(value);
               this.setState({
                   userData: JSON.parse(value),
               });
               
               this.setState({
                kycID: JSON.parse(value).verification_id});
 
               if ((JSON.parse(value).mm_wallet_check == 1)) {
                   this.setState({
                       is_wallet_check: 1,

                   });
               } else {
                   this.setState({
                       is_wallet_check: 0,
                   });
               }
               this.setState({
                current_location: JSON.parse(value).current_location
               });
               console.log("PrintingValues");
               this.getListCategories();
               this.getNumAnswered(this.state.userData.id);
                var currLoc = JSON.parse(value).current_location;
                if(currLoc==1){
                    console.log("Paypal Transaction")
                let data = {
                    id: JSON.parse(value).id,
                    api_url: 'paypaltransactionlist'
                }
                const newResponse = commonPost(data)
                .then(resp => {
                    
                    let result = resp;
                    console.log("Current New Result", result);
                    if(result.data){
                    this.setState({transactionList: result.data});
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
                           this.setState({
                            transactionList: fullList
                           })
                       }
                     
                      // console.log(transactionArr);
                   })
                  }
           }).catch((error) => {
            console.log("Transactions: ", error);
            console.log("This information")
            this.setState({
                userData: JSON.parse(value),
            });
            
            this.setState({
             kycID: JSON.parse(value).verification_id});

            if ((JSON.parse(value).mm_wallet_check == 1)) {
                this.setState({
                    is_wallet_check: 1,
                });
            } else {
                this.setState({
                    is_wallet_check: 0,
                });
            }
            console.log("PrintingValues");
            this.getListCategories();
            this.getNumAnswered(this.state.userData.id);
            //this.viewtransactionlist(this.state.userData.id)
            throw error;
           })
        //if(true){
        console.log("Initialized")
            messaging().onNotificationOpenedApp(remoteMessage => {
                console.log('Message handled', remoteMessage);
                const title= remoteMessage.notification.title;
                const  body = remoteMessage.notification.body;
                const  offerid = remoteMessage.data.offerId;
                
                Alert.alert(
                title,
                body,
                [
                    {
                        text: 'Cancel',
                        onPress: () => this.confirmFun(offerid,3),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => this.confirmFun(offerid,1) },
                ]
            );
            });
        //this.checklocationstatus();
        this.requestPermission();
        this.getToken();
        this.setState({
            configured: true
        })
        //}
      
 
       this.getGeneralOffer();
   }
   onLogin() {
    var currVar = this.props.route.userData;
    this.setState({userData: currVar})
    let data = {
        email: currVar.email,
        password: currVar.password,
        api_url: 'login'
    }
    this.setState({
        isLoading: true,
    })
    console.log(data);
    var response = LoginAPI(data)
        .then(res => {
            console.log(res);
            let message = res.message;
            let status = res.status;
            let userDetails = res.user;
          //  console.log(userDetails);

            if ((status == 1)) {
                AsyncStorage.setItem('userInfo', JSON.stringify(userDetails));
                //this.props.navigation.navigate('ProfileScreen');
                this.props.navigation.push('MyTabs', { userInfo: userDetails });
                this.setState({
                    email: '',
                    password: '',
                    api_resp: '',
                    isLoading: false,
                })
            } else {
                this.setState({
                    api_resp: message,
                    api_color: customstyles.alertdanger,
                    isLoading: false,
                })
                setTimeout(() => {
                    this.setState({
                        api_resp: '',
                        api_color: '',
                    })
                }, 5000);
            }
        })
        .catch((error)=> {
            throw error
        });
}
   getlocation = () => {
    Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          const currentLongitude = 
            JSON.stringify(position.coords.longitude);
          const currentLatitude = 
            JSON.stringify(position.coords.latitude);
            let data = {
                api_url: 'insertGeoLoction',
                user_id:this.state.userData.id,
                latitude:currentLongitude,
                longitude:currentLatitude
            }
            console.log(data)
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp.data;
                    console.log(resp);
                })
                .catch((error) => {
                    throw error;
                })
        },
        (error) => {
            console.log("Cannot tab location")
            console.log(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 1000
        },
      );
}

       checklocationstatus = () => {
        let data = {
            api_url: 'profile'
        }
        var resp = commonGet(data)
            .then(resp => {
                let result = resp.data;
                console.log("result+++++++"+resp.location_access_constent)
           if(resp.location_access_constent==1){
            Geolocation.getCurrentPosition(
                //Will give you the current location
                (position) => {
                    this.getlocation();
                },
                (error) => {
                  console.log(error)
                  geolocation.requestAuthorization()
                    .then((data) => {
                        this.getlocation();
                    })
                    .catch((err) => {
                        throw err;
                    });
                },
                {
                  enableHighAccuracy: false,
                  timeout: 30000,
                  maximumAge: 1000
                },
              );
           }
           
            })
            .catch((error) => {
                throw error;
            })
    }
 
   onPressTags = (indexKey) =>{
       var currListTags = [];
       for(let i = 0; i<this.state.listTags.length; i++){
           currListTags.push(i == indexKey);
       }
       this.setState({
           listTags: currListTags,
           firstFrac: this.state.listCategories[indexKey].insertedcount,
           secondFrac: this.state.listCategories[indexKey].totalcount,
           percentValue: this.state.listCategories[indexKey].percentage
       });
   }

   onPressEditProfile = () => {
       this.props.navigation.navigate('EditProfile', {
           userDetails: this.state.userData,
       })
   }

   viewtransactionlist = (user_id) => {
    this.setState({
        isLoading: true
    })
    var resp = transactionlist(user_id,1) 
        .then(resp => {
            let result = resp;
            finalList = [];
            console.log("TransactionsResp", result);
            for(let i = 0; i < result.transactions.length; i++){
                if(result.transactions[i].type != "Get Card"){
                    finalList.push(result.transactions[i]);
                }
            }
            this.setState({
                transactionList: finalList,
                isLoading: false
            });
            console.log("PrevTransactionList", finalList);
            console.log("TransactionList", this.state.transactionList);
        })
        .catch((error) => {
            this.setState({
                isLoading: false
            })
            //this.viewtransactionlist(this.state.userData.id)
            throw error;
        })

        /*
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
        */          
    }
 
   onPressCategory = () => {
       this.props.navigation.navigate('Category', {
           userDetails: this.state.userData,
           fromPlace: "profile"
       })
   }
   onPressWallet = () => {
    if(this.state.userData.current_location != 1){
        var resp = retriveWallet(this.state.userData.id)
        .then(resp => {
            console.log("resp", resp.code);
                if(resp.code==404){
                    let data = {
                        id: this.state.userData.id,
                        type: 'billing'
                    }
                    var resp1 = getUserAddress(data)
                    .then(resp1 => {
                        console.log("resp"+resp);
                        console.log(resp1);
                        if(resp1.code==403){
                            alert("Please update your billing address")
                            this.props.navigation.navigate('Address', { userDetails: this.state.userData.id })
                        }else{
                            alert("Please create your wallet")
                        }
                    })
                    .catch((error) => {
                        throw error;
                    })
                }else{
                    this.props.navigation.navigate('Wallet', { user_id: this.state.userData.id })
                }
        })
        .catch((error) => {
            console.log("error")
            console.log(error)
        })
    } else {
        this.props.navigation.navigate('Wallet', { user_id: this.state.userData.id })
    }
    // this.props.navigation.navigate('Wallet', {
    //     userDetails: this.state.userData,
    // })
}
   onPressAdd = () =>{
       this.props.navigation.navigate('Info', {
           user_id: this.state.userData.id,
       })
   }
   onPressAddress = () => {
       this.props.navigation.navigate('Address', {
           userDetails: this.state.userData,
       })
   }
   offerNavigate = () => {
    console.log(this.state.userData);
    let data = {
     id: this.state.userData.id,
     api_url: 'userDetailById'
 }
 var resp = commonPost(data)
     .then(resp => {
         
         let result = resp.data;
         console.log(result);
     if( this.state.userData.current_location == 1 || result.dob){
         this.props.navigation.navigate('Offer', { user_id: this.state.userData.id, userDetails:this.state.userData })
     }else{
         if(this.state.userData.current_location != 1){
             alert("Plesae fill your complete profile details to view offers")
             this.props.navigation.navigate('EditProfile', { userDetails: this.state.userData })   
         } 
     }
     })
     .catch((error) => {
         console.log(error)
     })
  
}
  offerQuestion = () => {
    console.log(this.state.userData);
    this.props.navigation.navigate('Question', {
        user_id: this.state.userData.id,
    });
}
   onPressInfo = () => {
       this.props.navigation.navigate('Info', {
           user_id: this.state.userData.id,
       })
   }

   onPressQuestion = () => {
    this.props.navigation.navigate('Question', {
        user_id: this.state.userData.id,
    })
   }

   changepassword = () => {
    this.props.navigation.navigate('ChangePassword', {
        userDetails: this.state.userData,
    })
}
 
onPressOffer = () => {
    let data = {
        id: this.state.userData.id,
        api_url: 'userDetailById'
    }
    var resp = commonPost(data)
        .then(resp => {
            
            let result = resp.data;
            console.log(result);
        if(result.dob){
            this.props.navigation.navigate('Offer', { user_id: this.state.userData.id, userDetails:this.state.userData })
        }else{
            alert("Plesae fill your complete profile details to view offers")
            this.props.navigation.navigate('EditProfile', { userDetails: this.state.userData })    
        }
        })
        .catch((error) => {
            throw error;
        })
}

   getMessages = () => {
    this.props.navigation.navigate('Messages', {
        user_id: this.state.userData.id,
    })
}

getcouponlist = () => {
    this.props.navigation.navigate('Couponllist', {
        user_id: this.state.userData.id,
    })
}
 
   getNotification = () => {
       this.props.navigation.navigate('Messages', {
           user_id: this.state.userData.id
       })
   }
 
   getNumAnswered = (user_id) => {
        try{
            let listGetAnswers = [];
            let finalResp = getQuestionsAnswered(user_id)
            .then(finalResp => {
                let result = finalResp.data;
                console.log("List Answered: ", result);
                listGetAnswers = result
                var count = 0;
                var currTime = "";
                var fullDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).split(",")[0];
                var date = fullDate.split("/")[1];
                if(date.length == 1){
                    date = "0" + date;
                }
                var month = fullDate.split("/")[0];
                if(month.length == 1){
                    month = "0" + month;
                }
                var year = fullDate.split("/")[2];
                var todayDate = year + "-" + month + "-" + date;
                console.log("Days");
                console.log(todayDate);
                for (let i = 0; i < listGetAnswers.length; i++){
                    currTime = listGetAnswers[i].updated_at;
                    console.log(listGetAnswers[i]);
                    console.log("Day Check: " + currTime.substring(0, currTime.indexOf(" ")));
                    if(currTime.substring(0, currTime.indexOf(" ")) == todayDate){
                        count += 1;
                    }
                }
                if(count >= 5){
                    count = 5;
                }
                this.setState({
                    numAnswered: count
                })
                console.log("Count Questions: ", count);
            })
        } catch(error){
            this.getNumAnswered(this.state.userData.id)
            throw error;
        }
    }
 
   userLogout = () => {
       Alert.alert('Logout', 'Are you sure you want to log out?', [
           {
               text: 'Cancel',
               onPress: () => {this.setState({logoutstatus: false})},
               style: 'cancel',
           },
           { text: 'Yes', onPress: () => { AsyncStorage.removeItem('userInfo'); this.props.navigation.navigate('HomeScreen'); this.setState({logoutstatus: true}); } },
       ]);
   }
 
   LoggedOut = () => {
       console.log('LoggedOut');
   }
 
   openMenu = () => {
       this.setState({
           visible: true,
       })
   }
 
   closeMenu = () => {
       this.setState({
           visible: false,
       })
   }

   async requestPermission() {
        try {
        await messaging().requestPermission();
        this.getToken();
        } catch (error) {
        alert('permission rejected');
        }
    }

    async getToken() {
        const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log(fcmToken)
                let data = {
                    api_url: 'insertToken',
                    user_id:this.state.userData.id,
                    fcmToken:fcmToken,
                }
                console.log(data)
                var resp = commonPost(data)
                    .then(resp => {
                        let result = resp.data;
                        console.log(resp);
                    })
                    .catch((error) => {
                        throw error;
                    })
            }
            console.log('Device_token')
    }


    // check Kyc
    initiateKYC = () => {
        //Get verification_id from userData
        Alert.alert(
            'Check KYC Status',
            'Your KYC has not been completed. Would you like to proceed to complete it?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => linkKYC() },
            ]
        );
    
        let linkKYC = () => {
            let userId = this.state.userData.id;
            //console.log(data); return;
    
            var resp = eKYCVerify(userId)
                .then(resp => {
                    let result = resp;
                    let status = result.status;
                    let link = result.links.href;
                    if ((status == 200)) {
                        this.setState({
                            active_msg: 'Redirecting you to complete KYC...',
                        }); 
                        setTimeout(() => {
                            this.setState({
                                active_msg: '',
                            });
                        }, 4000);
                        Alert.alert(
                        'Complete KYC',
                        'Click the "OK" button below to open your KYC in a third-party platform and proceed.\n' + link,
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'Open Link in Browser', onPress: () => openURL(link) },
                        ]
                        );
                    } else if ((status == 201)) {
                    //Missing parameters, go to edit profile page
                        this.setState({
                            deactive_msg: 'Missing parameters in profile needed to complete KYC.',
                        });
                        setTimeout(() => {
                            this.setState({
                                deactive_msg: '',
                            });
                        }, 2000);
                        this.onPressEditProfile();
                    } else {
                    this.setState({
                        deactive_msg: 'Please try again later.',
                    });
                    setTimeout(() => {
                            this.setState({
                                deactive_msg: '',
                            });
                        }, 2000);
                    }
                })
                .catch((error) => {
                    throw error;
                })
        }
    
    }
      
    confirmKYC = () => {
        let userId = this.state.userData.id;
      
        var resp = eKYCStart(userId)
        .then(resp => {
            let result = resp;
            let status = result.verification_details.status;
            let actual_status = result.status;
      
            if(actual_status == 4 && status == "approved"){
                Alert.alert(
                    'KYC Status',
                    'Your KYC has successfully been completed!',
                    [
                        { text: 'OK', onPress: () => this.setState({kycDone: true}) },
                    ]
                );
            } else {
                initiateKYC();
            }
            
        })
        .catch((error) => {
            throw error;
        })
      
      
      }
    openURL = ({ url }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            }
        }, [url]);
    }
    createcoupon = () => {
        this.setState({
            couponpopup: true,
        })
    }
    cancelbox = () => {
        this.setState({
            couponpopup: false,
        })
    }
    handleSendEmail = () => {
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        console.log(this.state.referemail);
        if ((this.state.referemail == '')) {
            this.setState({
                email_err: 'Email is required'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }
        if (pattern.test(this.state.referemail) === false) {
            this.setState({
                email_err: 'Email is not valid'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }
        this.setState({
            couponpopup: false,
        })
        let data = {
            user_id:this.state.userData.id,
            referemail: this.state.referemail,
            api_url: 'createcoupon'
        }
       // console.log(data); 

        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                let message = result.message;
                // let status = result.status;
                console.log(result);
                if(result.status==1){
                    this.setState({
                        active_msg: message,
                    });
                    setTimeout(() => {
                        this.setState({
                            active_msg: '',
                        });
                    }, 2000);
                }else{
                    this.setState({
                        deactive_msg: message,
                    });
                    setTimeout(() => {
                        this.setState({
                            deactive_msg: '',
                        });
                    }, 2000);
            }
            })
            .catch((error) => {
                throw error;
            })
    }
 
   // deactiveAccount
   deactiveAccount = () => {
       let userId = this.state.userData.id;
 
       Alert.alert(
           'Delete Account',
           'Are you sure you want deactivate your account?',
           [
               {
                   text: 'Cancel',
                   onPress: () => console.log('Cancel Pressed'),
                   style: 'cancel',
               },
               { text: 'Yes', onPress: () => this.state.userData.current_location == 0 ? confirmDeactiveDelete() : confirmDeactive() }
           ]
       );
       
       let confirmDeactive = () => {
        this.setState({
            deactivateStatus: false,
        })
        let data = {
            user_id: this.state.userData.id,
            api_url: 'deleteUser'
        }
       // console.log(data); 

        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                let message = result.description;
                // let status = result.status;
                console.log(result);
                this.setState({
                    deactive_msg: message,
                })
                setTimeout(() => {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('LoginScreen');
                    this.setState({
                        deactive_msg: '',
                    });
                }, 4000);
            })
            .catch((error) => {
                console.log(error)
            })
    }
 
       let confirmDeactiveDelete = () => {
           let data = {
               id: userId,
               api_url: 'deactivateMMuser'
           }
           //console.log(data); return;
 
           var resp = commonPost(data)
               .then(resp => {
                   let result = resp;
                   let message = result.description;
                   // let status = result.status;
                   console.log(result);
                   this.setState({
                       deactive_msg: message,
                   })
                   setTimeout(() => {
                       AsyncStorage.clear();
                       this.props.navigation.navigate('LoginScreen');
                       this.setState({
                           deactive_msg: '',
                       });
                   }, 4000);
               })
               .catch((error) => {
                   console.log("Delete error: ", error);
                   throw error;
               })
       }
   }
   // Close


   // Close
   // Create Wallet
   createWallet = () => {
        if(!this.state.isLoading){
            Alert.alert(
                'Create Wallet',
                'Are you sure you want to create a digital wallet?',
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
                let userId = this.state.userData.id;
                let data = {
                    id: userId,
                    api_url: 'createWallet'
                }
                this.setState({
                    isLoading: true,
                });
                var resp = commonPostText(data)
                    .then(resp => {
                        let result = resp;
                        console.log("Wallet Created? ", result);
      
                        let message = result.description;
                        let code = result.code;
                        if ((code == 400)) {
                            this.setState({
                                deactive_msg: message,
                                isLoading: false,
                            });
                            setTimeout(() => {
                                this.setState({
                                    deactive_msg: '',
                                });
                            }, 4000);
                            this.onPressEditProfile();
                        } else {
                            var newData = this.state.userData
                            newData.mm_wallet_check = 1
                            AsyncStorage.setItem("userInfo", JSON.stringify(newData));
                            this.setState({
                                active_msg: message,
                                isLoading: false,
                                is_wallet_check: 1
                            });
                            setTimeout(() => {
                                this.setState({
                                    active_msg: '',
                                });
                            }, 4000);
                        }
                    })
                    .catch((error) => {
                        throw error;
                    })
            }
        }
   }
   getGeneralFolder = () => {
       let data = {
           id: '0',
           api_url: 'getCommonFolder'
       }
 
       var resp = commonGet(data)
           .then(resp => {
               let result = resp.data;
               //console.log(result);
               setDataisLoaded(true);    
           })
           .catch((error) => {
               console.log(error)
           })
   }
   // Close
   getListCategories = () => {
       console.log("User ID: ", this.state.userData.id);
       console.log("Find Categories");
       getFolderPercent(this.state.userData.id).then((folderPercents) => {
           var currListCategories = [];
           console.log("Folder Percents: ", folderPercents);
           for(let i = 0; i<folderPercents.data.length; i++){
               currListCategories.push(folderPercents.data[i]);
               if(folderPercents.data[i].percentage > 100){
                   folderPercents.data[i].percentage = 100;
               }
               if(folderPercents.data[i].insertedcount > folderPercents.data[i].totalcount){
                   folderPercents.data[i].insertedcount = folderPercents.data[i].totalcount;
               }
           }
           console.log("currListCategories", currListCategories);
           var currListTags = [];
           for(let i = 0; i<currListCategories.length; i++){
               currListTags.push(i == 0);
           }
           this.setState({
               listTags: currListTags,
               listCategories: currListCategories,
               firstFrac: currListCategories[0].insertedcount,
               secondFrac: currListCategories[0].totalcount,
               percentValue: currListCategories[0].percentage
           })
           console.log("AllListCategories", this.state.listCategories);
       }).catch((error) => {
        console.log("Error getting all categories.");
        console.log(error);
        this.getListCategories();
       })
 
   } 
   // Get General offer
   getGeneralOffer = () => {
       let data = {
           api_url: 'userOffer'
       }
       var resp = commonGet(data)
           .then(resp => {
                console.log("Resp: ", resp);
               let result = resp.data.data;
               if (result) {
                   this.setState({
                       carouselItems: result,
                   })
                   console.log(result);
               }
           })
           .catch((error) => {
               console.log(error)
           })
   }
   // Close
   setmenu = (value) => {
       //console.log(value);
       if ((value == 'Edit Profile')) {
           this.onPressEditProfile();
       } else if ((value == 'Set Prefrence')) {
           this.onPressCategory();
       } else {
           this.userLogout();
       }
       this.setState({
           selectedMenu: value
       });
   }
 
   _renderItem({ item, index }) {    // coursel
       return (
           <View style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}} key={index}>
                <NormCard color_first={"#662397"} text_color={"white"} color_darker_second={"black"} four_array={item} width={IMG_WIDTH * 0.9} height={115} showDescription touchableOn/>
           </View>
       )
   }
//import AppLoading from 'expo-app-loading';
   render() {
       return (
        <SafeAreaView style={{...styles.scrollArea, height: WIN_HEIGHT, backgroundColor: "white"}}>
               <View style={{backgroundColor: "white"}}>
                    <View style={{...customstyles.header, width: "95%"}}>
                       <View style={{ ...customstyles.header, ...customstyles.px15, height: "150%"}}>
                                <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', marginLeft: 30, flex: 1,color: "#20004A"}}>Welcome, {"\n"}{this.state.userData.fname != '' ? this.state.userData.fname : ''} {this.state.userData.lname != '' ? this.state.userData.lname : ''}</Text>
                        </View>
                           <Menu
                               visible={this.state.visible}
                               onDismiss={this.closeMenu}
                               style={{
                                   width: 200,
                                   marginTop: 50,
                                   borderRadius: 50
                               }}
                               anchor={<Button onPress={this.openMenu}>
                                   <Ionicons name="person-circle-outline" size={32} color="#20004A" />
                               </Button>}>
                               { this.state.userData.current_location!=1  &&   
                               <Menu.Item onPress={this.onPressEditProfile} icon="pencil-outline" title="Edit Profile" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} >
                               </Menu.Item>
                                }
                               <Menu.Item onPress={this.onPressCategory} icon="shape-outline" title="Categories" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                               { this.state.userData.current_location!=1  &&   
                               <View>
                                <Menu.Item onPress={this.confirmKYC} icon="check" title="Check KYC" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />                      
                                <Menu.Item onPress={this.onPressAddress} icon="home-outline" title="Set Address" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                                </View>
                               }
                                <Menu.Item onPress={this.deactiveAccount} icon="toggle-switch-outline" title="Delete Account" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />                                
                                <Menu.Item onPress={this.getNotification} icon="bell-outline" title="Notifications" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                                <Menu.Item onPress={this.getcouponlist} icon="ticket-percent-outline" title="Coupon" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                               <Menu.Item onPress={this.userLogout} icon="power" title="Logout" />
                           </Menu>
                    </View>
                        <Dialog.Container visible={this.state.couponpopup}>
                          <Dialog.Title style={{...customstyles.h4,textAlign:'center'}}>Refer to a friend</Dialog.Title>
                            <Dialog.Description>
                                <Text style={{padding: 10, marginBottom: 10}}>Enter the email of the person you would like to refer Identity Wallet to.</Text>
                            </Dialog.Description>
                            <Dialog.Input onChangeText={(referemail) => this.setState({ referemail })}
                                style={{width:250, color: "#662397"}}></Dialog.Input>
                            <View>{
                                    this.state.email_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.email_err}</Text>
                                }</View>
                            <Dialog.Button label="Cancel" onPress={this.cancelbox} />
                            <Dialog.Button label="Submit" onPress={this.handleSendEmail} />
                        </Dialog.Container>

                    <ScrollView style={{backgroundColor: " #20004A", marginTop: -20}}>
                       <View style={customstyles.px15}>
                           {
                               this.state.deactive_msg !== '' &&
                               <Text style={{ color: 'red' }}>{this.state.deactive_msg}</Text>
                           }
                           {
                               this.state.active_msg !== '' &&
                               <Text style={{ color: 'green' }}>{this.state.active_msg}</Text>
                           }
                           {/*<Text style={[customstyles.titleText, {color: "#20004A"}] }>Welcome {this.state.userData.fname != '' ? this.state.userData.fname : ''} {this.state.userData.lname != '' ? this.state.userData.lname : ''}</Text>*/}
                       </View>
                       <View style={customstyles.px15}>
                           <Text style={{...customstyles.update, color: "#20004A"}}>Here are your updates!</Text>
                       </View>
                       {this.state.userData.coupon_status==0 &&  <View style={{...customstyles.px15, marginTop: -5}} >
                        <TouchableOpacity  onPress={() => this.createcoupon()}>
                            <Text style={{...customstyles.update, color: "#20004A", ...customstyles.underline}}>Refer a friend!</Text></TouchableOpacity>
                        </View>}
                       <View style={[customstyles.row, customstyles.justifyContentcenter, customstyles.px10, { marginBottom: 30, justifyContent: "space-around"}]}>
                           <TouchableOpacity style={[customstyles.p5, customstyles.filterContainer, { width: "43%", flexDirection: "column"}]} onPress={this.onPressAdd}>
                                   <Text style={[customstyles.titleText, {textAlign: "center", fontWeight: "bold", color: "#663297"}]}>Info Store</Text>
                                   <Text style={{color: "#662397", fontSize: 10, textAlign: "center", padding: 5}}>Upload more documents for easy access!</Text>
                                   <ScrollView persistentScrollbar horizontal style={{display: "flex", flexDirection: "row", backgroundColor: "transparent", height: 40}}>
                                       <View style={{flexDirection: "row", justifyContent: "center", padding: 5, alignSelf: "center"}}>
                                           {
                                               this.state.listCategories.map((object, i) => (
                                                   <View style={{display: "flex"}}>
                                                       <TouchableOpacity style={ this.state.listTags[i] ? customstyles.tagStyle2 : customstyles.tagStyle1} key={i} onPress={() => this.onPressTags(i)}>
                                                           <Text style={ this.state.listTags[i] ? customstyles.tagText2: customstyles.tagText1}>{object.folder_name}</Text>
                                                       </TouchableOpacity>
                                                   </View>
                                               ))
                                           }
                                       </View>
                                   </ScrollView>
                                   <View style={{padding: 10}}>
                                       {
                                           (this.state.percentValue != null && this.state.firstFrac != null && this.state.secondFrac != null) ?
                                           <View style={{...customstyles.filterContainer, flexDirection: "column"}}>
                                               <Text style={[storeStyle.completionText]}>Progress</Text>
                                               <View style={{display: "flex", flexDirection: "row"}}>
                                                   <View style={{flexDirection: 'column', alignSelf: 'flex-start', alignItems: "center"}}>
                                                       <Progress.Circle size={60} animated={true} style={[customstyles.progressChart]} progress={this.state.percentValue/100} thickness={20} unfilledColor= "#cbb8d9" color="#662397" fill="#00000000" borderWidth={0}>
                                                       </Progress.Circle>                                         
                                                       <Text style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}>{Math.round(this.state.percentValue)}%</Text>
                                                   </View>
                                                   <View style={{padding: 5, flex: 1, flexDirection: "column", alignSelf: "center", backgroundColor: "transparent"}}>
                                                       <Text style={{fontSize: 30, justifyContent: "center", alignSelf: "center", fontWeight: "bold", alignSelf: "center", color: "#662397"}}>{fractionUnicode(this.state.firstFrac,this.state.secondFrac)}</Text>
                                                       <TouchableOpacity style={[customstyles.btnThemexs, {marginTop: 5}]} >
                                                           <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                                               <Text style={{color: "#662397", fontSize: 10}}>View</Text>
                                                           </View>
                                                       </TouchableOpacity>
                                                       {/*<Text style={{fontSize: 10, justifyContent: "center", alignSelf: "center", flex: 0.25, textAlign: "center"}}>of</Text>
                                                       <Text style={{fontSize: 15, justifyContent: "center", alignSelf: "center", flex: 0.375, fontWeight: "bold"}}>50</Text>*/}
                                                   </View>
                                               </View>
                                           </View> :
                                           <View>
                                           </View>
                                       }
                                   </View>
                            </TouchableOpacity>
                           <TouchableOpacity style={{...customstyles.filterContainer, display: "flex", flexDirection: 'column',  borderRadius: 10,  width: "43%", marginLeft: "5%", height: "100%"}} onPress={this.offerQuestion}>
                                <View style={{display: "flex", flexDirection: "column", opacity:1}}>
                                    <Text style={[customstyles.titleText, {marginBottom: 5, alignSelf: "center"}]}>Questions</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "column"}}>
                                        <View style={{display: "flex", flexDirection: "row"}}>
                                            <Text style={{fontSize: 10, color: "#662397", textAlign: "center", padding: 10}}>Answer 5 questions today to meet your daily goal!</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', backgroundColor: "white", alignSelf: 'center', alignItems: "center", marginTop: 20}}>
                                            <Progress.Circle size={120} showsText animated={true} style={[customstyles.progressChart]} thickness={25} progress={this.state.numAnswered/5} unfilledColor= "#cbb8d9" color="#662397" fill="#00000000" borderWidth={0}>
                                            </Progress.Circle>                                         
                                        </View>
                                    </View>
                                    {/*<TouchableOpacity style={{...customstyles.btnThemexs, marginTop: 30}} onPress={this.offerQuestion} >
                                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                            <Text style={{color: "#662397", padding: 5}}>To Question Store</Text>
                                        </View>
                                </TouchableOpacity>*/}
                            </TouchableOpacity>
                           {/*<View style={[customstyles.p15, customstyles.filterContainer, { width: "43%", alignSelf: "center", padding: 10, marginLeft: "5%", flexDirection: "column"}]}>
                               <Text style={[customstyles.titleText, {marginBottom: 5, textAlign: "center"}]}>Wallet</Text>
                               {
                                   this.state.is_wallet_check == 0 && this.state.current_location != 1?
                                       <View>
                                           <Text style={{...customstyles.titleText, textAlign: "center", color: "black", opacity: 0.5, fontSize: 20, fontFamily: null, fontWeight: "normal", padding: 20}}>Don't have a wallet?</Text>
                                           <TouchableOpacity onPress={this.createWallet} style={customstyles.textCenter}>
                                               <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                                                   <Text style={customstyles.btnThemexs}>
                                                       {this.state.isLoading ? "Creating..." : "Create Wallet"}
                                                   </Text>
                                               </View>
                                           </TouchableOpacity>
                                       </View> :
                                       <View style={{flex: 1.5}}>
                                           <TouchableOpacity style={customstyles.btnThemexs} onPress={this.onPressWallet} >
                                               <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                                   <Text style={{color: "#662397", padding: 5}}>View Details</Text>
                                               </View>
                                           </TouchableOpacity>
                                           <Text style={{fontSize: 10, fontWeight: "bold", marginBottom: 5}}>Recent Transactions</Text>
                                           <ScrollView style={{flex: 1, padding: 5, borderColor: "#662397", borderWidth: 2, borderRadius: 5, maxHeight: 150}}>
                                               {
                                                   this.state.transactionList.length > 0 ?
                                                   this.state.transactionList.map((object, i) => (
                                                           <TouchableOpacity style={ object.amount > 0 ? otherStyles.tranGreenBackground : otherStyles.tranRedBackground }>
                                                               <Image source={mtransfer} style={otherStyles.imageStyle}></Image>
                                                               <View style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                                                    <View style={otherStyles.textView}>
                                                                        { object.amount>0 ?
                                                                            <Text style={otherStyles.titleText}>+${object.amount}</Text>
                                                                        :
                                                                            <Text style={otherStyles.titleText}>-${object.amount.toString().split("-")[1]}</Text>
                                                                        }
                                                                    </View>
                                                                    <View style={otherStyles.secondTextView}>
                                                                        <Text style={otherStyles.dateTimeText}>{Moment(object.transaction_date).format('Y-MM-DD HH:MM')}</Text>
                                                                    </View>
                                                               </View>
                                                               <View style={{flex: 0.5}}>
                                                               </View>
                                                           </TouchableOpacity>  
                                                   )):
                                                    <Text style={{fontSize: 12, fontWeight: "bold", padding: 10}}>
                                                        No transactions found
                                                    </Text>
 
                                               }
                                           </ScrollView>
                                       </View>
                               }
                            </View>*/}
                        </View>
                       {/* carousel */}
                    <View style={{display: "flex", flexDirection: "row", ...customstyles.justifyContentcenter, ...customstyles.px10, marginBottom: 10, justifyContent: "space-around"}}>
                       <View style={{display: "flex", flexDirection: 'column',  width: "100%", marginBottom: 20}}>
                           <View style={{display: "flex", flexDirection: "column", opacity:1}}>
                               <Text style={[customstyles.titleText, {marginBottom: 5, alignSelf: "flex-start"}]}>Offers</Text>
                           </View>
                           <Text style={{fontSize: 10, color: "#662397", textAlign: "auto", padding: 10}}>The latest data offers in the marketplace today...</Text>
                           <View onPress={this.onPressOffer} style={{display: "flex", flexDirection: "row" }}>
                               <Carousel
                                   style={{marginLeft: "auto", justifyContent: "center"}}
                                   layout={"default"}
                                   ref={ref => this.carousel = ref}
                                   data={this.state.carouselItems}
                                   sliderWidth={IMG_WIDTH}
                                   sliderHeight={125}
                                   itemWidth={IMG_WIDTH}
                                   itemHeight={125}
                                   renderItem={this._renderItem}
                                   autoplayInterval={1500}
                                   loop={true}
                                   vertical={false}
                                   onSnapToItem={index => this.setState({ activeIndex: index })} />
                           </View>
                           <View style={{justifyContent: "center", alignSelf: "center", padding: 2.5}}>
                                <PaginationDot
                                    activeDotColor={'#662397'}
                                    curPage={this.state.activeIndex}
                                    sizeRatio={0.5}
                                    maxPage={this.state.carouselItems.length}
                                    vertical={false}
                                />
                            </View>
                            {/*<TouchableOpacity style={{...customstyles.btnThemexs}} onPress={this.offerNavigate} >
                                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                        <Text style={{color: "#662397", padding: 5}}>Visit Marketplace</Text>
                                    </View>
                            </TouchableOpacity>*/}
                       </View>
                       {/* Close */}
                       </View>
                       </ScrollView>
               </View >
            </SafeAreaView>
       );
   }
}
 
const styles = StyleSheet.create({
   scrollArea: {
       flex: 1,
       width: "100%",
       // paddingTop: StatusBar.currentHeight,
       paddingBottom: 0,
       backgroundColor: "white",
   },
   innerView: {
       //flex: 1,
       height: "100%",
       paddingHorizontal: 20,
       // paddingBottom: 15,
   },
 
   container: {
       // flex: 1,
       //alignItems: 'center',
       justifyContent: 'center',
       // backgroundColor: '#ecf0f1',
       marginBottom: 30,
   },
   row: {
       flexDirection: "row",
       flexWrap: "wrap",
       justifyContent: "space-between",
       width: "100%"
   },
   input: {
       width: 200,
       height: 44,
       padding: 10,
       borderWidth: 1,
       borderColor: 'black',
       marginBottom: 10,
   },
   button: {
       alignItems: "center",
       backgroundColor: "#DDDDDD",
       padding: 10,
       marginBottom: 20,
   },
   offerTitleHeading: {
       position: "absolute",
       left: 0,
       right: 0,
       top: 0,
       paddingTop: 5,
       paddingBottom: 5,
       paddingHorizontal: 10,
       color: "#fff",
       textAlign: "left",
       backgroundColor: "rgba(0, 0, 0, .5)",
       fontSize: 15,
       //fontWeight: "600",
   },
   company_name: {
       position: "absolute",
       left: 0,
       bottom: 0,
       textAlign: "left",
       backgroundColor: "rgba(0, 0, 0, .5)",
       borderTopRightRadius: 20,
       color: "#fff",
       margin: 0,
       paddingVertical: 5,
       paddingHorizontal: 10,
       fontSize: 10
   },
   price: {
       position: "absolute",
       bottom: 0,
       right: 0,
       textAlign: "left",
       backgroundColor: "rgba(0, 0, 0, .5)",
       borderTopLeftRadius: 20,
       color: "#fff",
       margin: 0,
       paddingVertical: 5,
       paddingHorizontal: 10,
       fontSize: 10
   },
   sliderImg: {
       width: IMG_WIDTH,
       height: IMG_HEIGHT,
       //inlineSize: '100%',
       //aspectRatio: '16 / 9',
       //objectFit: 'cover',
   },
})
const storeStyle = StyleSheet.create({
   widgetStore: {
       width: "100%",
       padding: 15,
       backgroundColor: "#EFF1F3",
       borderRadius: 10,
       // shadowOffset: { width: 0, height: 0 },
       // shadowOpacity: 0.2,
       // shadowRadius: 10,
   },
   rectangle: {
       width: "90%",
       height: "70%",
       backgroundColor: "#963910",
       borderRadius: 10
   },
   storeImage: {
       width: 100,
       height: 100,
   },
   titleText: {
       fontWeight: "700",
       fontSize: 20,
       width: "100%",
       textAlign: 'center',
       alignSelf: "flex-start"
   },
   progress: {
       transform: [{ translateY: "-50%" }],
   },
   completionText: {
       fontWeight: "700",
       textAlign: 'center',
       marginBottom: 10,
   },
   subTitleText: {
       fontSize: 14,
       textAlign: "center",
       color: "#000",
   },
   button: {
       fontWeight: "700",
       backgroundColor: "#963910"
   },
   normalText: {
       transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
   }
})
 
const otherStyles = StyleSheet.create({
   tranGreenBackground: {
       width: "100%",
       backgroundColor: "#c1e8b3",
       borderColor: "black",
       borderWidth: 1,
       flexDirection: "row",
       borderRadius: 4,
       flex: 1.5,
       marginBottom: 7.5,
 
   },
   tranRedBackground: {
       width: "100%",
       backgroundColor: "#e8b3b4",
       borderColor: "black",
       borderWidth: 1,
       flexDirection: "row",
       borderRadius: 4,
       flex: 1.5,
       marginBottom: 7.5,
 
   },
   imageStyle: {
       width: 30,
       height: 30
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
       fontSize: 9,
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
 
export default ProfileScreen;

