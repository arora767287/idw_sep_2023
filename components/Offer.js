import React, { Component } from 'react';
import MyTabs from "./MyTabs";
import { Alert,  Share, TextInput, View, StyleSheet, Text, Image, SectionList, FlatList, Dimensions, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable, ImageBackground, PermissionsAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { Picker } from "@react-native-picker/picker";
import Dialog from "react-native-dialog";
import { offerDetails, updatelocatoinstatus, companyFilter, priceFilter, commonGet, commonPost,insertlocation, getValuation, commonPostText} from "../components/functions.js";
import Checkbox from 'expo-checkbox';
import NormOffer from "./NormOffer";
import CustomLabel from "./CustomLabel";
//import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import Carousel, {Pagination} from "react-native-snap-carousel";
import SearchBar from "react-native-dynamic-search-bar";
import { BottomNavigation, RadioButton } from 'react-native-paper';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import OfferInfo from "./OfferInfo.js";
import Geolocation from '@react-native-community/geolocation';
import  ModelAlert  from './ModelAlert';
const windowHeight = Dimensions.get("window").height
const WIN_HEIGHT = Dimensions.get('window').height - 30;
const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
const screenHeight = Dimensions.get('window').height
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT);
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)
var coinsIcon = require("../assets/Images/coins.png");
var cards = require("../assets/Images/cards_credit.png");
var vaccount = require("../assets/Images/network_account.png");
var mtransfer = require("../assets/Images/transfer.png")
//import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import PaginationDot from "react-native-animated-pagination-dot";
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native'
import { withNavigationFocus } from 'react-navigation';

const slide1 = require('../assets/Images/McDonalds-coupons.jpg');

const currImage = require("../assets/Images/new_background.jpg");

class Offer extends Component{
    enableScroll = () => this.setState({ scrollEnabled: true });
    disableScroll = () => this.setState({ scrollEnabled: false });
    multiSliderValuesChange = (values) => {
        this.setState({
            fromValue: values[0],
            toValue: values[1]
        })
    }
    groupFours = (listGroup) => {
        //console.log(listGroup)
        var newFours = []
        var currFourList = []
        for(let i = 0; i<listGroup.length; i++){
            if(currFourList.length < 4){
                currFourList.push(listGroup[i])
            }
            else{
                newFours.push(currFourList);
                currFourList = []
                currFourList.push(listGroup[i])
            }
            if(i == listGroup.length - 1){
                newFours.push(currFourList);
                break;
            }
        }
        return newFours;
    }

    _renderThumb = () => {
        <Thumb/>
    }
    _renderRail = () => { 
        <Rail/>
    }
    _renderRailSelected = () => {
        <RailSelected/>
    }
    _renderLabel = ({value}) => {
        <Label text={value}/>
    }
    _renderNotch = () => {
        <Notch/>
    }
    _handleValueChange = (low, high) => {
        setLow(low);
        setHigh(high);
    }

    handleOnChangeText = (text) => {
        //console.log(text == "");
        if(text == ""){
            this.setState({                
                spinnerVisibility: false,
                displaySections: this.state.fourSections,
                searchText: text
            });
        }
        else{
            var newSECTIONS = [];
            if(this.state.checked == "by company"){
                console.log("CLICKED");
                var currDisplay = this.state.SECTIONS;
                for(let i = 0; i<currDisplay.length; i++){
                    if(currDisplay[i].comp_name.indexOf(text) == 0){
                        newSECTIONS.push(currDisplay[i])
                    }
                }
            }
            else if(this.state.checked == "by name"){
                var newSECTIONS = [];
                var currDisplay = this.state.SECTIONS;
                for(let i = 0; i<currDisplay.length; i++){
                    if(currDisplay[i].offer_title.indexOf(text) == 0){
                        newSECTIONS.push(currDisplay[i])
                    }
                }
            }
            console.log(currDisplay);
            //console.log(newSECTIONS);
            var newSectionFinal = this.groupFours(newSECTIONS);
            this.setState({
                searchText: text,
                spinnerVisibility: true,
                displaySections: newSectionFinal,
              });
        }
      };

    handleFilter = () => {
        this.setState({
            menuVisible: !this.state.menuVisible
        });
        //console.log(this.state.menuVisible);
    }

    _renderItem = ({item, index}) => {
        return(
            <View style={{justifyContent: "center", alignItems: "center"}}>
                <NormOffer four_array={item} openFunction={this.openDetail} list_offer_ids={this.state.subOfferIds}/>
            </View>
        )
        /*return(
            <TouchableOpacity onPress={() => this.openDetail(item.id)} style={{alignSelf: "center", justifyContent: "center"}}>
            <View style={{
                borderRadius: 5,
                paddingLeft: 0,
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 15,
                borderRadius: 10,
                overflow: "hidden",
                shadowColor: '#ddd',
                shadowOffset: { width: -2, height: 3 },
                shadowOpacity: 1.0,
                shadowRadius: 7,
                elevation: 8,
            }}>
                <Image source={slide1} style={styles.itemPhoto} />
                <Text style={styles.offerTitleHeading}>{item.offer_title}</Text>
                <Text style={styles.offerPrice}>${item.data_share_price + item.open_to_contact_price}</Text>
                <Text style={styles.compName}>{item.comp_name}</Text>
                <TouchableOpacity onPress={() => this.openDetail(item.id)} style={styles.viewoffer}><Text style={{ ...customstyles.textwhite, ...customstyles.h6 }}>View Offer</Text></TouchableOpacity>
            </View>
        </TouchableOpacity>
        )*/
    }
    forceUpdateHandler(){
        this.forceUpdate();
      };
    constructor(){
        super();
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    state = {
        userId: '',
        setOpen: false,
        DataisLoaded: false,
        SECTIONS: [],
        offerID: '',
        currentLongitude: '',
        currentLatitude: '',
        companyList: [],
        offerInfo: [],
        offerPopUp: [],
        subscribeoffer: false,
        userConcent: false,
        selectedCheckboxes: [],
        selectedOfferData: [],
        offervalue1: '',
        offervalue2: '',
        offervalue3: '',
        offervalue4: '',
        offervalue5: '',
        success_resp: '',
        locationstatus: '',
        fromValue: 2,
        toValue: 1000,
        reset_btn: false,
        apply_pref: false,
        activeIndex: 0,
        searchText: '',
        spinnerVisibility: false,
        removePrefstatus: false,
        displaySections: [],
        menuVisible: false,
        id_type: 0,
        dollarPress: false,
        prefPress: false,
        searchPress: false,
        groupPress: false,
        fourSections: [],
        searchFilterShow: false,
        allUserInfo: '',
        checked: 'by name',
        prefTicks: false,
        allChecks: false,
        termsCheck: false,
        tempBalance: 0,
        subOfferIds: [],
        allSubscribed: [1] 
    }

    componentDidMount() {
        console.log("Why work no?")
        console.log("Route Params: ", this.props);
        let user_id = this.props.route.params.user_id;
        let newUserDetails = this.props.route.params.userDetails;
        this.setState({
            userId: user_id,
            allUserInfo: newUserDetails
        });
        //this.subscribeofferfun(user_id);
        this.getOffer(user_id);
        /*if(this.props.route.params.reload){
            this.subscribeofferfun();
            console.log("RELOADING")
        } else {
            this.subscribeofferfun();
            this.getOffer();
        }*/
        this.companyList();
        this.checklocationstatus();
        this.getUserValuation(user_id);
        //this.checkSubscribeIntersect(this.props.route.params.user_id);
        console.log("currentLatitude+++++++++++++++")
      
    }

    checkSubscribeIntersect = (user_id) => { 
        let data = {
            api_url: 'getSubcribeOfferList',
            user_id:user_id,
        }
        var resp = commonPost(data)
            .then(resp => {
                let result = resp.data;
                console.log("Subscribed", result);
                var all_subscribed = []
                for(let i = 0; i<result.length; i++){
                    all_subscribed.push(result[i].id);
                    
                }
                this.setState({subOfferIds: all_subscribed});
                console.log("All Subscribed: ", all_subscribed);
            })
            .catch((error) => {
                console.log("ThisError: ", error)
            })
    }
 
  getOneTimeLocation = () => {
    let data = {
        api_url: 'updateLocationstatus',
        user_id:this.state.userId
    }
    var resp = commonPost(data)
        .then(resp => {
            let result = resp.data;
            console.log(resp);
        })
        .catch((error) => {
            console.log(error)
        })
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            const currentLongitude = 
              JSON.stringify(position.coords.longitude);
            const currentLatitude = 
              JSON.stringify(position.coords.latitude);
              this.setState({
                currentLongitude:currentLongitude,
                currentLatitude:currentLatitude
              })
              const message="Latitude="+this.state.currentLatitude+", Longitude="+this.state.currentLongitude
              let data = {
                api_url: 'insertGeoLoction',
                user_id:this.state.userId,
                latitude:this.state.currentLatitude,
                longitude:this.state.currentLongitude
            }
            console.log(data)
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp.data;
                    console.log(resp);
                })
                .catch((error) => {
                    console.log(error)
                })
             
              const selectedCheckboxes = this.state.selectedCheckboxes;
              const findIdx = selectedCheckboxes.indexOf(2);
              if (findIdx > -1) {
                  selectedCheckboxes.splice(findIdx, 1);
              } else {
                  selectedCheckboxes.push(2);
                 // Share.share(shareOptions);
              }
              this.setState({
                  selectedCheckboxes: selectedCheckboxes
              });
             // this.getAddressFromCoordinates(this.state.currentLatitude,this.state.currentLongitude)
              
             // console.log(this.getAddressFromCoordinates(this.state.currentLatitude,))
          },
          (error) => {
            console.log(error)
            this.setState({
                removePrefstatus: true,
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 1000
          },
        );
      };
    //    getAddressFromCoordinates(latitude, longitude) {
    //     return new Promise((resolve, reject) => {
    //       fetch(
    //         'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    //           latitude +
    //           ',' +
    //           longitude +
    //           '&key=AIzaSyD4GSyxrgZEiQDCaNHNGd_sDjXj97ZStkg',
    //       )
    //         .then(response => response.json())
    //         .then(responseJson => {
    //           if (responseJson.status === 'OK') {
    //             resolve(responseJson?.results?.[0]?.formatted_address);
    //           } else {
    //             reject('not found');
    //           }
    //         })
    //         .catch(error => {
    //           reject(error);
    //         });
    //     });
    //   }
    // Open Popup detail
    openDetail = (offer_id,answerd) => {

        if(answerd==2){
            console.log('answerd ' + answerd);
            //this.props.navigation.navigate('Uncomplete_Question', { offer_id: offer_id,user_id: this.props.route.params.user_id});
            this.props.navigation.navigate('Uncomplete_Question', { offer_id: offer_id,user_id: this.props.route.params.user_id, userDetails: this.props.route.params.userDetails, runUpdate: this.forceUpdateHandler});
        } else{ 
            this.handleOpen();
            this.getOfferDetail(offer_id);
            this.setState({
                offerID: offer_id
            });
        } 
    }

    
    handleOpen = () => {
        this.setState({
            setOpen: true,
            offerID: '',
        });
    }
    handleClose = () => {
        this.setState({
            setOpen: false,
            checkBoxChecked: false,
            allChecks: false,
            termsCheck: false,
            prefTicks: false,
            offervalue1: '',
            offervalue2: '',
            offervalue3: '',
            offervalue4: '',
            offervalue5: '',
        }, () => {
            console.log("checks")
        })
        this.getOffer(this.state.userId);
        this.companyList();
        this.checklocationstatus();
        this.getUserValuation();
        //this.checkSubscribeIntersect(this.props.route.params.user_id);
    }

    componentDidUpdate(prevProps){
        if(prevProps.reload == true){
            //this.subscribeofferfun(this.props.route.params.user_id);
            this.getOffer(this.props.route.params.user_id);
            this.companyList();
            this.checklocationstatus();
            this.getUserValuation();
            //this.checkSubscribeIntersect(this.props.route.params.user_id);
        }
    }

    handleTerms = () => {
        this.setState({ termsCheck: !this.state.termsCheck }, () => {
            console.log(this.state.termsCheck, 'termsCheck');
          }); 
    }

    getOfferDetail(offer_id) {
        var resp = offerDetails(offer_id)
            .then(resp => {
                console.log("offerdetails", resp)
                let result = resp.data;
                console.log("Details")
                console.log(result);
                this.setState({
                    offerPopUp: result,
                    offerInfo: result.offerInfo,
                    offervalue1: result.comp_name,
                    offervalue2: result.offer_title,
                    offervalue3: result.data_share_price,
                    offervalue4: result.open_to_contact_price,
                    offervalue5: result.offer_description,
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close
    confirmRemovePref = () => {
 Geolocation.requestAuthorization()
                            .then((data) => {
                                this.getOneTimeLocation();
                            })
                            .catch((err) => {
                                console.log(err)
                            }); 
        this.setState({
            removePrefstatus: false,
        });
    }
   cancelRemovePref = () => {
        this.setState({
            removePrefstatus: false,
        });
    }
    filterByPref = (currListOffers) => {
        if(this.state.apply_pref){
            var finalArray = [];
            var currFinal = [].concat.apply([], currListOffers);
            let result = this.state.SECTIONS;
            for(let i = 0; i < result.length; i++){
                for(let j = 0; j<currFinal.length; j++){
                    if(result[i].id == currFinal[j].id){
                        finalArray.push(result[i])
                    }
                }
            }
            var newFours = this.groupFours(finalArray);
            //console.log(result);
            this.setState({
                displaySections: newFours,
                fourSections: newFours,
                apply_pref: false
            })
        }
        else{
            let data = {
                api_url: 'userOffer'
            }
            var resp = commonGet(data)
                .then(resp => {
                    let result = resp.data.data;
                    var finalArray = [];
                    var currFinal = [].concat.apply([], currListOffers);
                    for(let i = 0; i < result.length; i++){
                        for(let j = 0; j<currFinal.length; j++){
                            if(result[i].id == currFinal[j].id){
                                finalArray.push(result[i])
                            }
                        }
                    }
                    console.log("First Array: ")
                    console.log(result);
                    console.log("Second Array: ")
                    console.log(currFinal)
                    var newFours = this.groupFours(finalArray);
                    this.setState({
                        displaySections: newFours,
                        fourSections: newFours,
                        apply_pref: true
                    });
                }).catch((error) => {
                    console.log(error);
                })
        }
    }

    getUserValuation = (user_id) => {
        console.log("User ID Valuation: ", user_id)
        const value = getValuation(user_id).then(result => {
            console.log("Valuation Result ", result);
            //var currValue = result.agg_valuation; //Change based on actual way to get.
            console.log("Custom Valuation: ", result.Custom_Valuation);
            if(result.Custom_Valuation == null){
                Alert.alert(
                    'Your Identity Valuation',
                    'No valuation currently. Please complete the "Identity Data Valuation #1" offer for us to put an initial estimate on here!',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => {} },
                    ]
                );
            } else {
                this.setState({
                    tempBalance: result.Custom_Valuation
                })
            }
        }).catch((error) => {
            console.log("Valuation Error: ", error);
            throw error;
        })
    }

    // Get Offer
    getOffer = (userId) => {
        let data = {
            user_id:userId,
            api_url: 'getGeneralOffer'
        }
        var resp = commonPost(data)
            .then(newResp => { 
                console.log("ListOffers", newResp);
                var curr_offers = []
                    console.log("Found ID: ", userId);
                    let data = {
                        api_url: 'getSubcribeOfferList',
                        user_id:userId,
                    }
                    var resp = commonPost(data)
                    .then(resp => {
                        let all_sub = resp.data;
                        let result = [];
                        var all_offers = []
                        console.log("All Subscribed", resp.data);
                        console.log("All Others", this.state.allSubscribed);
                        if(all_sub == null){
                            all_sub = [];
                        }
                        for(let i = 0; i < all_sub.length; i++){
                            curr_offers.push(all_sub[i].id);
                            all_offers.push(all_sub[i].id);
                        }
                        for(let i = 0; i < newResp.data.length; i++){
                            if(!curr_offers.includes(newResp.data[i].id)){
                                result.push(newResp.data[i]);
                                all_offers.push(newResp.data[i].id);
                            }
                        }
                        for(let i = 0; i < all_sub.length; i++){
                            result.push(all_sub[i]);
                        }
                        console.log("All IDS: ", all_offers)
                        var newResult = result.reverse()
                        var newFours = this.groupFours(newResult);

                        this.setState({
                            SECTIONS: newResult,
                            displaySections: newFours,
                            fourSections: newFours,
                        })
                        this.setState({
                            DataisLoaded: true
                        })
                        console.log("New Subscribed", resp);
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
                //this.getOffer()
            })
    }
    // Close

    // Get Company List
    checklocationstatus = () => {
        let data = {
            api_url: 'profile'
        }
        var resp = commonGet(data)
            .then(resp => {
                let result = resp.data;
           
             this.setState({
                locationstatus: resp.location_access_constent,
            });
            console.log(resp);
            console.log("location_access"+this.state.locationstatus);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    companyList = () => {
        let data = {
            api_url: 'companylist'
        }
        var resp = commonGet(data)
            .then(resp => {
                let result = resp.data;
                console.log(result);
                this.setState({
                    companyList: result,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // User Concent  
    /*subscribeofferfun = (userId) => {
        console.log("Found ID: ", this.state.userId);
        let data = {
            api_url: 'getSubcribeOfferList',
            user_id:userId,
        }
        var resp = commonPost(data)
            .then(resp => {
                let result = resp.data;
                console.log("New Subscribed", resp);
                var newFours = this.groupFours(result);
                setTimeout(() => {
                    this.setState({
                        //SECTIONS: result,
                        //displaySections: newFours,
                        //fourSections: newFours,
                        DataisLoaded: true,
                        //DataisLoaded: true,
                        allSubscribed: result
                    })
                }, 50)
            })
            .catch((error) => {
                console.log(error)
            })
        //console.log(this.state.userConcent);
    }*/
    handleConcent = () => {
        this.setState({ userConcent: !this.state.userConcent });
        //console.log(this.state.userConcent);
    }
    // Close
    // Prefrence handle
    handlePrefrence = id => {
        console.log(id)
        if(id==2){
            if(this.state.locationstatus==0){
                console.log(this.state.locationstatus);
                const requestLocationPermission = async () => {
                    if (Platform.OS === 'ios') {
                    this.getOneTimeLocation();
                    } else {
                    try {
                        const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            this.getOneTimeLocation();
                        
                        
                        }else{
                            console.log("test")
                        } 
                    } catch (err) {
                        console.warn(err);
                    }
                    }
                };
                requestLocationPermission();
                return () => {
                    Geolocation.clearWatch(watchID);
                };
            }
        }
        const selectedCheckboxes = this.state.selectedCheckboxes;
        const findIdx = selectedCheckboxes.indexOf(id);
        if (findIdx > -1) {
            selectedCheckboxes.splice(findIdx, 1);
        } else {
            selectedCheckboxes.push(id);
        }
        this.setState({
            selectedCheckboxes: selectedCheckboxes
        });
    }
   
    // Close

    onHandleCategory = () => {
        console.log("Clicked");
        this.props.navigation.navigate("Category", {userDetails: this.state.allUserInfo, fromPlace: "offers"});
    }

    // Handle sharing options
    onChangeOffer = id => {
        //console.log(id);
        const selectedOfferData = this.state.selectedOfferData;
        const findIdx = selectedOfferData.indexOf(id);
        if (findIdx > -1) {
            selectedOfferData.splice(findIdx, 1);
        } else {
            selectedOfferData.push(id);
        }
        this.setState({
            selectedOfferData: selectedOfferData
        });
    }
    // Close

    handleAllChecks = () => {
        this.setState({ allChecks: !this.state.allChecks }, () => {
            console.log(this.state.allChecks, 'allChecks');
          }); 
    }

    // Company Filter
    filterByCompany = e => {
        let currentCompany = e;
        //console.log(currentCompany);
        this.setState({
            DataisLoaded: false,
            companyFilter: currentCompany
        });

        var resp = companyFilter(currentCompany)
            .then(resp => {
                let result = resp.data.data;
                //console.log(result);
                this.setState({
                    SECTIONS: result,
                    DataisLoaded: true,
                    reset_btn: true,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // Price Range Filters 
    addFilter = () => {
        let min_price = this.state.fromValue;
        let max_price = this.state.toValue;

        if ((max_price == '')) {
            Alert.alert('Please select valid price range');
        } else {
            let data = {
                min_price: min_price,
                max_price: max_price,
            }

            this.setState({
                DataisLoaded: false,
            });
            let result = [];
            currDisplay =  this.state.SECTIONS;
            for(let i = 0; i<currDisplay.length; i++) {
                var currPrice = currDisplay[i].open_to_contact_price + currDisplay[i].data_share_price
                if(currPrice <= max_price && currPrice >= min_price) {
                    result.push(currDisplay[i]);
                }
            }
            var newSectionFinal = this.groupFours(result);
            this.setState({
                displaySections: newSectionFinal,
                DataisLoaded: true,
                reset_btn: true,
            })
            this.filterByPref(newSectionFinal);
            /*
            var resp = priceFilter(data)
                .then(resp => {
                    let result = resp.data.data;
                    var newSectionFinal = this.groupFours(result);
                    this.setState({
                        displaySections: newSectionFinal,
                        DataisLoaded: true,
                        reset_btn: true,
                    })
                    this.filterByPref(newSectionFinal);
                })
                .catch((error) => {
                    console.log(error)
                })
            */
        }

    }
    // close

    // Reset Filter
    resetFilter = () => {

        Alert.alert(
            'Reset Filter',
            'Are you sure you want to reset the filters?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => resetCnfrm() },
            ]
        );

        let resetCnfrm = () => {
            this.getOffer();
            this.setState({
                DataisLoaded: false,
                reset_btn: false,
                companyFilter: '',
                apply_pref: false
            });
            setTimeout(() => {
                this.setState({ DataisLoaded: true });
            }, 1000)
        }
    }
    // close

    onDollarPress = () => {
        this.setState({
            dollarPress: !this.state.dollarPress,
            prefPress: false,
            searchPress: false,
            groupPress: false
        })
    }

    renderAboveThumbComponent = (index) => {
        if(index == 0){
            return (
                <View style={aboveThumbStyles.container} >
                  {first[this.state.fromValue]}
                </View>
            )
        }
        else{
            return (
                <View style={aboveThumbStyles.container} >
                  {first[this.state.toValue]}
                </View>
            )
        }
    
    };

    handleShowTicks = () => {
        this.setState({ prefTicks: !this.state.prefTicks }, () => {
            console.log(this.state.prefTicks, 'prefTicks');
          }); 
    }

    onPrefPress = () => {
        this.setState({
            dollarPress: false,
            prefPress: !this.state.prefPress,
            searchPress: false,
            groupPress: false
        })
    }

    onSearchPress = () => {
        this.setState({
            dollarPress: false,
            prefPress: false,
            searchPress: !this.state.searchPress,
            groupPress: false
        })
    }

    onGroupPress = () => {
        this.setState({
            dollarPress: false,
            prefPress: false,
            searchPress: false,
            groupPress: !this.state.groupPress
        })
    }

    // Submit Offer
    submitOffer = (e) => {

        let selected_options = this.state.selectedCheckboxes;
        let offer_id = this.state.offerID;
        let data_share = selected_options[0] ? '1' : '';
        let open_to_contact = selected_options[1] ? '1' : '';
        let userId = this.props.route.params.user_id;
        let offer_data = this.state.selectedOfferData ? this.state.selectedOfferData.toString() : '';

        if ((selected_options == '')) {
            console.log("None Selected");
            this.setState({
                form_err: 'Please select the type of offer you are providing your data for (data sharing, or open to contact)'
            });
            Alert.alert(
                'Select offer type',
                'Please select one of the types of offers listed below to proceed.',
                [
                    { text: 'OK', onPress: () => {} },
                ]
            );
            setTimeout(() => {
                this.setState({
                    form_err: ''
                });
            }, 5000);
            return;
        } else if ((!this.state.userConcent)) {
            console.log("No Consent");
            this.setState({
                form_err: 'Please agree to the terms of this offer'
            });
            Alert.alert(
                'Terms of offer',
                'Please read and agree to the terms of this offer to proceed.',
                [
                    { text: 'OK', onPress: () => {} },
                ]
            );
            setTimeout(() => {
                this.setState({
                    form_err: ''
                });
            }, 5000);
            return;
        } else {
            let data = {
                user_id: userId,
                offer_id: offer_id,
                data_share: data_share,
                open_to_contact: open_to_contact,
                terms_conditions: '1',
                offer_data: offer_data,
                api_url: 'saveUserOffer'
            }
            console.log("Offer Data Print: ", data);
            console.log("Info: ", this.state.offerInfo)
            var resp = commonPostText(data)
                .then(resp => {
                    let result = resp;
                    //console.log(result);
                    let message = result.message;
                    let status = result.status;
                    if ((status == 1)) {
                        this.setState({
                            success_resp: "Offer Redeemed Successfully",
                            checkBoxChecked: false,
                            dataSharePrice: '',
                            openToContact: '',
                        })
                        Alert.alert(
                            'Offer redeemed!',
                            'You\'re in! Take a look at the list of subscribed offers to complete your offer or answer any pending questions.',
                            [
                                { text: 'OK', onPress: () => {} },
                            ]
                        );
                    }
                    setTimeout(() => {
                        this.setState({
                            success_resp: '',
                            checkBoxChecked: false,
                            userConcent: false,
                            selectedCheckboxes: [],
                            selectedOfferData: [],
                        });
                    }, 500);

                    setTimeout(() => {
                        this.handleClose();
                        this.props.navigation.navigate("Offer", { user_id: this.state.userId, userDetails: this.props.route.params.userDetails})
                    }, 500);
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }

    handleShowing = () => {
        this.setState({
            searchFilterShow: !this.state.searchFilterShow
        })
    }
    handleChecked = () => {
        if(this.state.checked == "by company"){
            this.setState({
                checked: "by name"
            })
        }
        else if(this.state.checked == "by name"){
            this.setState({
                checked: "by company"
            }) 
        }
        //this.handleOnChangeText(this.state.searchText);
    }
    renderContent() {
        if(this.state.searchFilterShow){
            /*
            return(
                <View style={{ ...customstyles.filterContainer }}>
                    <Text style={{ ...customstyles.h5 }}>Price Range</Text>
                    <View style={{ height: 100, padding: 0, marginTop: -20 }}>
                        <Slider
                        min={0}
                        max={100}
                        step={1}
                        floatingLabel
                        renderThumb={this._renderThumb}
                        renderRail={this._renderRail}
                        renderRailSelected={this._renderRailSelected}
                        renderLabel={this._renderLabel}
                        renderNotch={this._renderNotch}
                        onValueChanged={this._handleValueChange}
                        />

                    </View>


                    <View>

                    </View>
                    <View style={{ ...customstyles.row, ...customstyles.mt10 }}>
                        <View style={{ ...customstyles.col8 }}>
                            <View style={{ ...customstyles.w100 }}>
                                <Text style={{ ...customstyles.h5 }}>Sort By Company</Text>
                            </View>
                            <View style={{ ...customstyles.dropdownBoxThemesm, ...customstyles.mt10 }}>
                                <Picker
                                    selectedValue={this.state.id_type}
                                    onValueChange={(value, index) => this.filterByCompany(value)}
                                    mode="dropdown"
                                >
                                    <Picker.Item label='Select Company' value='empty' color='black' style={{ fontSize: 14 }} />
                                    {
                                        this.state.companyList ?
                                            this.state.companyList.map((item, i) => (
                                                <Picker.Item key={i} label={item.comp_name} value={item.id} color="black" />
                                            ))
                                            : <Picker.Item label='No Company Yet' value='01' />
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={{ ...customstyles.col4, ...customstyles.mt15 }}>
                            {
                                this.state.reset_btn &&
                                <TouchableOpacity
                                    onPress={this.resetFilter} style={customstyles.ml5}>
                                    <Text style={{ ...customstyles.btnThemesmall, ...customstyles.mt20 }}>Reset</Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </View>
                </View>
            );
            */
           return(
               <View style={{...customstyles.filterContainer, flexDirection: "column", padding: 10, marginBottom: 10}}>
                    <TouchableOpacity onPress={this.handleShowing}>
                        <Text style={{padding: 10, fontSize: 20, fontWeight: "normal", color: "#20004A"}}>Customize Search Filters </Text>
                    </TouchableOpacity>
                   <View style={{display: "flex", flexDirection: "column"}}>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "80%", alignSelf: "center"}}>
                            <View style={{display: "flex", flexDirection: "column"}}>
                                <TouchableOpacity style={{...customstyles.searchBarStyleIcons, flexDirection: "column"}} onPress={this.onDollarPress}>
                                    <Ionicons name="logo-usd" size={25} color="#20004A" />
                                </TouchableOpacity>
                                <Text style={{...customstyles.h5, fontSize: 10, textAlign: "center", fontWeight: "normal", marginTop: 2}}>Price</Text>
                            </View>
                            <View style={{display: "flex", flexDirection: "column"}}>
                                <TouchableOpacity style={{...customstyles.searchBarStyleIcons, flexDirection: "column"}} onPress={this.onPrefPress}>
                                    <Ionicons name="toggle" size={25} color="#20004A" />
                                </TouchableOpacity>
                                <Text style={{...customstyles.h5, fontSize: 10, textAlign: "center", fontWeight: "normal", marginTop: 2}}>Preferences</Text>
                            </View>
                            <View style={{display: "flex", flexDirection: "column", }}>
                                <TouchableOpacity style={{...customstyles.searchBarStyleIcons, flexDirection: "column"}} onPress={this.onSearchPress}>
                                    <Ionicons name="search" size={25} color="#20004A" />
                                </TouchableOpacity>
                                <Text style={{...customstyles.h5, fontSize: 10, textAlign: "center", fontWeight: "normal", marginTop: 2}}>Search</Text>
                            </View>
                        </View>
                        <View style={{ ...customstyles.filterContainer, width: "100%", marginTop: 15}}>
                            {
                                this.state.dollarPress ? 
                                <View style={{display: "flex", alignSelf: "center", width: "100%"}}>
                                    <Text style={{...customstyles.h5, fontSize: 20, fontWeight: "bold", padding: 5}}>PRICE RANGE</Text>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}> 
                                        <Text style={{...customstyles.h5, fontSize: 20, fontWeight: "normal", alignSelf: "center"}}>${this.state.fromValue} - ${this.state.toValue}</Text>
                                    </View>
                                    <View style={{justifyContent: "center", alignSelf: "center"}}>
                                        <MultiSlider
                                        values={[this.state.fromValue, this.state.toValue]}
                                        onValuesChange={this.multiSliderValuesChange}
                                        min={2}
                                        max={1000}
                                        step={1}
                                        allowOverlap
                                        snapped
                                        customLabel={CustomLabel}
                                        selectedStyle={{backgroundColor: "#20004A", width: "100%"}}
                                        />
                                        <TouchableOpacity onPress={this.addFilter} >
                                            <Text style={{ ...styles.addcardbtn }}>SEARCH</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : this.state.prefPress ?
                                <View style={{display: "flex", flexDirection: "column", width: "100%"}}>
                                    <Text style={{borderColor: "#20004A", color: "#20004A", fontWeight: "bold", padding: 5, fontSize: 20, padding:5}}>PREFERENCES</Text>
                                    <View style={{display: "flex", flexDirection: "row", padding: 5, alignSelf: "center"}}>
                                        <View style={{ ...customstyles.checkboxinlineblock, ...customstyles.mt10, justifyContent: "center", flexDirection: "row", flex: 1, marginLeft: 20, marginRight: 20}}>
                                            <Checkbox
                                                value={this.state.apply_pref}
                                                onValueChange={this.addFilter}
                                                selected={this.state.apply_pref}
                                                color="#20004A"
                                                style={{ ...customstyles.mr10, ...customstyles.checkboxhidden, alignSelf: "center"}}
                                            />
                                            <Text style={{...customstyles.h5, fontWeight: "normal", fontSize: 15, alignSelf: "center", justifyContent: "center", padding: 5, flex:0.7}}>Apply category preferences</Text>
                                        </View>
                                        <View style={{ ...customstyles.checkboxinlineblock, ...customstyles.mt10, justifyContent: "center", flexDirection: "row", flex: 1, padding: 10}}>
                                            <TouchableOpacity style={{...customstyles.searchBarStyleIcons, shadowOpacity: 0, borderRadius: 10, borderColor: "#20004A",  borderWidth: 2, flexDirection: "row"}}  onPress={this.onHandleCategory}>
                                                <Ionicons name="settings" size={25} color="#20004A" />
                                            </TouchableOpacity>
                                            <Text style={{...customstyles.h5, fontWeight: "normal", fontSize: 15, alignSelf: "center", justifyContent: "center", padding: 5}}>Categories</Text>
                                        </View>
                                    </View>
                                </View>
                                : this.state.searchPress ?
                                <View style={{display: "flex", flexDirection: "column", padding: 5}}>
                                    <View style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                        <Text style={{borderColor: "#20004A", color: "#20004A", fontWeight: "bold", padding: 5, fontSize: 20}}>SEARCH</Text>
                                        <View style={{display: "flex", flexDirection: "row", padding: 15}}>
                                            <View style={{display: "flex", flexDirection: "row", padding: 5}}>
                                                <View style={{flexDirection: "row", borderColor: "#20004A", borderWidth: 2, borderRadius: 10, color: "#20004A"}}>
                                                    <RadioButton
                                                        value="by company"
                                                        status={ this.state.checked === 'by company' ? 'checked' : 'unchecked' }
                                                        onPress={this.handleChecked}
                                                        color="#20004A"
                                                    />
                                                </View>
                                                <Text style={{...customstyles.h5, fontWeight: "normal", fontSize: 15, alignSelf: "center", justifyContent: "center", padding: 5}}>by company</Text>
                                            </View>
                                            <View style={{display: "flex", flexDirection: "row", alignSelf: "center", justifyContent: "center", padding: 5}}>
                                                <View style={{flexDirection: "row", borderColor: "#20004A", borderWidth: 2, borderRadius: 10, color: "#20004A", width:40, height: 40}}>
                                                <RadioButton
                                                    value="by name"
                                                    status={ this.state.checked === 'by name' ? 'checked' : 'unchecked' }
                                                    onPress={this.handleChecked}
                                                    color="#20004A"
                                                    
                                                />
                                                </View>
                                                <Text style={{...customstyles.h5, fontWeight: "normal", fontSize: 15, alignSelf: "center", justifyContent: "center", padding: 5}}>by name</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{display: "flex", flexDirection: "row", marginBottom: 10, justifyContent: "flex-start"}}>
                                        <SearchBar
                                        height={50}
                                        style={{marginRight: 10, padding: 5}}
                                        fontSize={15}
                                        fontColor="#fdfdfd"
                                        iconColor="#fdfdfd"
                                        cancelIconColor="#fdfdfd"
                                        placeholder="Enter search"
                                        onChangeText={this.handleOnChangeText}
                                        />
                                        { this.state.menuVisible ? 
                                         <View>
                                         </View>:
                                         <View>
                                        </View>}
                                    </View>
                                </View>
                                : this.state.groupPress &&
                                <View>
                                    <Text>Some</Text>
                                </View>
                            }
                        </View>
                    </View>
               </View>
           )
        }
        return(
            <TouchableOpacity style={{...customstyles.filterContainer, padding: 10, marginBottom: 10}} onPress={this.handleShowing}>
                <Text style={{padding: 10, fontSize: 20, fontWeight: "normal", color: "#20004A"}}>Customize Filters </Text>
            </TouchableOpacity>
        )
    }
    // Close
    render() {
         const { DataisLoaded, items } = this.state;
         if (!DataisLoaded) {
             return <Loader />;
         }
        return (
            <SafeAreaView style={{...styles.scrollArea, height: WIN_HEIGHT}}>
                <ScrollView>
                    {
                        !this.state.setOpen &&
                
                    <>      
                        <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                            <Text style={{ ...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15, marginBottom: 10, color: "#20004A"}}>Marketplace</Text>
                        </View>
                      
                        <View style={styles.container}>
                                <View>
                                    <View style={{backgroundColor: "white", padding: 10, borderRadius: 16, flex: 1, marginBottom: 20, alignSelf: "center", width: "100%", justifyContent: "center", ...customstyles.filterContainer, flexDirection: "column"}}>
                                        <Text style={{...customstyles.walletBalanceText, fontSize:15, color: "#20004A", marginLeft: 15}}>Your Current Estimated Data Valuation: </Text>
                                        <Text style={{...customstyles.titleText, color: "#20004A", marginLeft: 15,marginRight: 30, fontSize: 24}}>$ {this.state.tempBalance}</Text>
                                    </View>  
                                    {this.renderContent()}
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: 10, marginTop: 20}}>
                                        <Text style={{fontSize: 25, color: "white"}}>Available Offers</Text>
                                        {/*<View style={{alignSelf: "center"}}>
                                            <View>
                                                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                    <Checkbox
                                                        value={!!this.state.subscribeoffer}
                                                        onValueChange={() => {}}
                                                        selected={this.state.subscribeoffer}
                                                        color="white"
                                                        style={{ ...customstyles.checkboxhidden3, alignSelf: "center", justifyContent: "center", marginLeft:180, ...customstyles.ml10 }} />
                                                    <View style={{ ...customstyles.checkboxlistTextinline1, ...customstyles.ml10, display: "flex", flexDirection: "row", alignSelf: "center"}}>
                                                        <Text style={{ color: "white", fontSize: 15}}>Subscribed Offers</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            </View>*/}
                                    </View>
                                    {this.state.displaySections.length > 0 ?
                                        <View style={{justifyContent: "center", alignSelf: "center"}}>
                                            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", height: SLIDER_HEIGHT * 1.5, borderRadius: 16, margin: 20, padding: 10}}>
                                                <Carousel
                                                    layout="default"
                                                    ref={(c) => { this._carousel = c; } }
                                                    data={this.state.displaySections}
                                                    layoutCardOffset={-18}
                                                    sliderWidth={SLIDER_WIDTH}
                                                    sliderHeight={50}
                                                    itemWidth={ITEM_WIDTH}
                                                    itemHeight={50}
                                                    style={{ alignSelf: "center", justifyContent: "center"}}
                                                    renderItem={this._renderItem}
                                                    onSnapToItem={(index) => this.setState({ activeIndex: index})}
                                                    vertical = {false} 
                                                />
                                                <View style={{display: "flex", flexDirection: "column", alignSelf: "center", justifyContent: "center", marginTop: 10}}>
                                                    <PaginationDot
                                                    activeDotColor={'#20004A'}
                                                    curPage={this.state.activeIndex}
                                                    sizeRatio={0.5}
                                                    maxPage={this.state.displaySections.length}
                                                    />
                                                </View>
                                         </View>
                                        </View> :
                                        <View style={{ justifyContent: "center", alignSelf: "center", padding: 30 }}>
                                            <Text style={{ color: "grey", fontWeight: "bold", fontSize: 20 }}>No Offers Found</Text>
                                        </View>}
                                </View>
                            </View></>
                    }

                        {
                            
                            this.state.setOpen &&
                            <View style={{height: WIN_HEIGHT}}>
                                <Text style={{ ...customstyles.titleText, fontSize: 35, marginLeft: 20, marginTop: 15, color: "#20004A", fontWeight: 'bold'}}>Offer Info</Text>
                               <View>
                                    {
                                        this.state.form_err != '' &&
                                        <Dialog.Description style={{ color: 'red' }}>{this.state.form_err}</Dialog.Description>
                                    }
                                    {
                                        this.state.success_resp != '' &&
                                        <Dialog.Description style={{ color: 'green' }}> {this.state.success_resp}</Dialog.Description>
                                    }
                                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: windowHeight*0.2}}>
                                        <OfferInfo navigation={this.props.navigation} route={this.props.route} comp_name={this.state.offervalue1} offer_title={this.state.offervalue2} data_share_price={this.state.offervalue3}open_to_contact_price={this.state.offervalue4} offer_description={this.state.offervalue5}/>
                                        <View style={{ width: "90%", alignSelf: "center"}}>
                                        <TouchableOpacity style={{...customstyles.filterContainer, padding: 10, marginBottom: 10}} onPress={this.handleShowTicks}>
                                            <Text style={{padding: 10, fontSize: 20, fontWeight: "normal", color: "#20004A"}}>Offer Preference </Text>
                                        </TouchableOpacity>
                                        <View>
                                        {
                                            this.state.prefTicks &&
                                            <><View style={{ ...customstyles.row }}>
                                                <ModelAlert
                                                    Alert_Visibility={this.state.removePrefstatus}
                                                    cancelAlertBox={this.cancelRemovePref}
                                                    title={"Geo Location"}
                                                    body={"Kindy enable geo-location tracking"}
                                                    confirmalert={this.confirmRemovePref}
                                                    />
                                                    <View>
                                                        <View style={{ ...customstyles.checkboxlist, ...customstyles.ml10, display: "flex", flexDirection: "row", backgroundColor: "white", borderRadius: 10, borderWidth: 0, width: "95%"}}>
                                                            <Checkbox
                                                                value={!!this.state.selectedCheckboxes.includes(1)}
                                                                onValueChange={() => this.handlePrefrence(1)}
                                                                selected={this.state.selectedCheckboxes.includes(1)}
                                                                color="#20004A"
                                                                style={{ ...customstyles.checkboxhidden2, alignSelf: "center", justifyContent: "center", marginLeft: 20}} />
                                                            <View style={{ ...customstyles.checkboxlistTextinline, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 10}}>
                                                                <Text style={{color: "#20004A", width: "80%"}}>Data Sharing</Text>
                                                                <Text style={{ color: "#20004A", marginLeft: "auto" ,paddingRight:20}}>${this.state.offerPopUp.data_share_price}</Text>
                                                            </View>
                                                        </View>
                        
                                                    </View>
                                                </View><View style={{ ...customstyles.row, marginBottom: 5}}>

                                                        <View>
                                                            <View style={{ ...customstyles.checkboxlist, ...customstyles.ml10, flexDirection: "row", backgroundColor: "white", borderRadius: 10, borderWidth: 0, width: "95%", marginBottom: 5}}>
                                                                <Checkbox
                                                                    value={!!this.state.selectedCheckboxes.includes(2)}
                                                                    onValueChange={() => this.handlePrefrence(2)}
                                                                    selected={this.state.selectedCheckboxes.includes(2)}
                                                                    color="#20004A"
                                                                    style={{ ...customstyles.checkboxhidden2, alignSelf: "center", justifyContent: "center", ...customstyles.ml20, marginLeft: 20}} />
                                                                <View style={{ ...customstyles.checkboxlistTextinline, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                                                    <Text style={{ color: "#20004A" }}>Open to Contact</Text>
                                                                    <Text style={{ color: "#20004A", marginLeft: "auto",paddingRight:20 }}>${this.state.offerPopUp.open_to_contact_price}</Text>
                                                                </View>
                                                            </View>

                                                        </View>
                                                    </View></>
                                            }
                                        </View>
                                            
                                            {
                                            this.state.selectedCheckboxes.includes(1) &&
                                            <TouchableOpacity style={{...customstyles.filterContainer, padding: 10, marginBottom: 10}} onPress={this.handleAllChecks}>
                                                <Text style={{padding: 10, fontSize: 20, fontWeight: "normal", color: "#20004A"}}>Data Sharing Settings </Text>
                                            </TouchableOpacity>
                                            }   
                                            <View>
                                            <View style={{ width: "100%", alignSelf: "center", marginBottom: 5}}>

                                                {
                                                    (this.state.allChecks && this.state.selectedCheckboxes.includes(1)) &&
                                                    this.state.offerInfo.map((data, j) => (
                                                        <View key={j} >
                                                            <View style={{ ...customstyles.row, }}>
                                                                <View style={{ ...customstyles.checkboxlist,  ...customstyles.ml10, flexDirection: "row", backgroundColor: "white", borderRadius: 10, borderWidth: 0, width: "100%"}}>
                                                                    <Checkbox
                                                                        value={!!this.state.selectedOfferData.includes(data.id)}
                                                                        onValueChange={() => this.onChangeOffer(data.id)}
                                                                        selected={this.state.selectedOfferData.includes(data.id)}
                                                                        color="#20004A"
                                                                        style={{...customstyles.checkboxhidden2, alignSelf: "center", justifyContent: "center", marginLeft: 20}}/>
                                                                    <View style={{ ...customstyles.checkboxlistTextinline, display: "flex", flexDirection: "row",justifyContent: "space-between", alignItems: "center"}}>
                                                                        <Text style={{...customstyles.mr10, color: "#20004A", width: "80%"}}>{data.keycode}</Text>
                                                                        <Text style={{color: "#20004A", marginLeft: "auto",paddingRight:20}}>${data.price}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    ))
                                                }

                                            </View>
                                            <TouchableOpacity style={{...customstyles.filterContainer, padding: 10, marginBottom: 10}} onPress={this.handleTerms}>
                                                 <Text style={{padding: 10, fontSize: 20, fontWeight: "normal", color: "#20004A"}}>Offer Terms </Text>
                                            </TouchableOpacity>
                                            {
                                                this.state.termsCheck &&
                                                <View style={{width: "95%", alignSelf: "center", backgroundColor: "#ecf0f1", opacity: 1, padding: 20, borderRadius: 16, marginBottom: 10}}>
                                                    <Text style={{...customstyles.textxs, color: "black", opacity: 1}}>{this.state.offerPopUp.offer_terms}</Text>
                                                </View>
                                            }
                                            </View>
                                        
                                        </View>
                                        <View style={{ ...customstyles.checkboxlist, backgroundColor: "white", width: "90%", alignSelf: "center", display: "flex", flexDirection: "row", justifyContent: "flex-start", borderRadius: 10, borderWidth: 0}}>
                                            <Checkbox
                                                value={this.state.userConcent}
                                                onValueChange={() => this.handleConcent()}
                                                selected={this.state.userConcent}
                                                color="#20004A"
                                            />
                                            <Text style={{color: "#20004A", marginLeft: 8}}> I agree to the terms of this offer</Text>
                                        </View>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", flex: 3, marginTop: 5}}>
                                            <TouchableOpacity style={{...customstyles.filterContainer, flexDirection: "column", backgroundColor: "white", padding: 10, marginLeft: "5%", flex: 0.45, textAlign: "center", borderColor: "#20004A", borderRadius: 10}} onPress={this.handleClose}>
                                                <Text style={{color: "#20004A", textAlign: "center", fontSize: 15}}>CANCEL</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{backgroundColor: "#20004A", padding: 10, marginRight: "5%", flex: 0.45, textAlign: "center", borderColor: "white", borderWidth: 2, borderRadius: 10}} onPress={this.submitOffer}>
                                                <Text style={{color: "white", textAlign: "center", fontSize: 15}}>SUBMIT</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                    }
            </ScrollView >
        </SafeAreaView>
        );
    }
}

const aboveThumbStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'grey',
        borderColor: 'purple',
        borderWidth: 1,
        height: 50,
        justifyContent: 'center',
        left: -10 / 2,
        width: 10,
    },
});

const styles = StyleSheet.create({

    scrollArea: {
        paddingTop: 20,
        flex: 1,
        width: "100%",
        backgroundColor: "white"
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        //alignItems: 'center',
        // backgroundColor: '#ecf0f1',
        marginBottom: 48,
        paddingHorizontal: 15,
        // paddingVertical: 50,
        // borderColor: "red",
        // borderWidth: 1,
        // paddingBottom: 10,
    },
    itemPhoto: {
        position: "relative",
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        // aspectRatio: 16 / 9,
    },
    offerTitleHeading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 100,
        color: "#fff",
        textAlign: "left",
        backgroundColor: "rgba(0, 0, 0, .5)",
        fontSize: 24,
    },
    compName: {
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
    },
    offerPrice: {
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
    },
    viewoffer: {
        position: "absolute",
        bottom: 0,
        right: 10,
        top: 9,
        textAlign: "right",
        color: "#fff",
        fontSize: 20,
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
        borderWidth: 1,
        textAlign: "center",
      },
      offerchkbox_row:{
       paddingLeft:25,
      }
});
export default Offer;