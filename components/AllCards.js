import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Alert, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, ActivityIndicator, ImageBackground, Dimensions} from 'react-native';
import { TextInput } from "react-native-paper"
import { customstyles } from "../customstyle";
import Loader from './Loader';
import { Ionicons } from '@expo/vector-icons';
import { ViewCards, activateCard, getCardById, commonPost, ViewCardsText, eKYCStart, eKYCVerify } from './functions';
import Background from './Background';
import Dialog from "react-native-dialog";
import MyTabs from './MyTabs';
import Carousel, {Pagination} from "react-native-snap-carousel";

const SLIDER_WIDTH = Dimensions.get('window').width - 140;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 40;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)

function AllCards({ navigation, route }) {

    const [notActive, setNotActive] = useState(true);
    const [card, setCard] = useState([]);
    const [loader, setLoader] = useState(false);
    const [userId, setuserId] = useState('');
    const [visible, setVisible] = useState(false);
    const [activeCount, setActiveCount] = useState(0);

    const [dataLoader, setDataLoader] = useState(false);

    const [succResp, setSuccResp] = useState('');
    const [errResp, setErrResp] = useState('');

    const [cardDate, setCardDate] = useState([]);
    const [name, setName] = useState([]);
    const [text, setText] = useState("EMAIL");
    const [cardId, setCardId] = useState([]);
    const [cardType, setCardType] = useState([]);
    const currImage = require("../assets/Images/new_background.jpg");
    const cardImage1 = require("../assets/Images/1.png")
    const cardImage2 = require("../assets/Images/2.png")
    const cardImage3 = require("../assets/Images/3.png")
    const cardImage4 = require("../assets/Images/5.png")
    const cardImage5 = require("../assets/Images/6.png")
    var cardImage6 = require("../assets/Images/13.png")
    var coinsIcon = require("../assets/Images/coins.png");
    const allCards = [cardImage1, cardImage2, cardImage3, cardImage4, cardImage5, cardImage6]


    const [activeIndex, setActiveIndex] = useState(0);
    const ref = React.useRef(null);
    const renderItem = React.useCallback(({ item, index }) => (
        <View style={{ display: "flex", justifyContent: "center", alignSelf: "center"}}>
            <Image source={allCards[index]} style={{...otherStyles.imageStyle, display: "flex", alignSelf: "center", justifyContent: "center"}}></Image>
        </View>
      ), []);
    useEffect(() => {
        retriveUserCard(route.params.user_id);
        setuserId(route.params.user_id);
        setTimeout(() => {
            setLoader(false);
        }, 1000);
    }, []);

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

            var checkKYC = eKYCStart(userId)
            .then(thisResp => {
                if(thisResp.status == "approved"){
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
                            retriveUserCard(userId);
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                } else {
                    setErrResp("Please complete KYC before proceeding.");
                    initiateKYC();
                }
            })
        }

    }

    onPressEditProfile = () => {
        this.props.navigation.navigate('EditProfile', {
            userDetails: this.state.userData,
        })
    }

    let initiateKYC = () => {
        //Get verification_id from userData
        Alert.alert(
            'Your KYC Status',
            'You have not completed the full KYC process yet. Would you like to proceed to complete it?',
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
            //console.log(data); return;
    
            var resp = eKYCVerify(userId)
                .then(resp => {
                    let result = resp;
                    let status = result.status;
                    let link = result.links.href;
                    if ((status == 200)) {
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
                        this.onPressEditProfile();
                    } else {
                        Alert.alert(
                            'Server Down',
                            'Please try again later, or contact identity.wallet.atlanta@gmail.com for assistance.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                }
                            ]
                            );
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    
    }

    let retriveUserCard = (user_id) => {
        var resp = ViewCards(user_id)
            .then(resp => {
                console.log("Response: ", resp);
                console.log("Response Cards: ", resp.cards);
                if(resp.code == 400 && resp.description == "User is currently inactive") {
                    setNotActive(true);
                    setLoader(true);
                    console.log("Activity: ", notActive);
                }  else{
                    var currCount = 0;
                    for(let i = 0; i<resp.cards.length; i++){
                        var currCard = resp.cards[i];
                        if(currCard.status.text == "active"){
                            currCount += 1;
                        }
                    }
                    setTimeout(() => {
                        setLoader(true);
                        setCardDate(resp.cards[0].date);
                        setCard(resp.cards);
                        setNotActive(false);
                        setActiveCount(currCount);
                    }, 1000)
                }
            })
            .catch((error) => {
                console.log(error)
                setLoader(true);
                setCardDate("");
                setCard([]);
            })
    }



    // Deactivate Card
    let handleDeactivate = (card_id) => {
        Alert.alert(
            'Deactivate Card',
            'Are you sure you want to deactivate this card?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => confirmDeactive() },
            ]
        );

        let confirmDeactive = () => {
            console.log("card_id", card_id);
            let data = {
                id: userId,
                card_id: card_id,
                api_url: 'suspendCard'
            }

            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    console.log("result", result);
                    let status = result.status;
                    if ((status == 'locked')) {
                        retriveUserCard(userId);
                    }
                    var currCount = activeCount - 1;
                    setActiveCount(currCount);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
    // Close

    // Activate Card
    let handleActivate = (card_id) => {

        Alert.alert(
            'Activate Card',
            'Are you sure you want to activate this card?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => confirmActive() },
            ]
        );

        let confirmActive = () => {
            console.log("card_id", card_id);
            let data = {
                card_id: card_id,
                api_url: 'activatedCard'
            }
            console.log("Current Active Count");
            console.log(activeCount);
            if(activeCount < 5){
                var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    console.log("result", result);
                    let status = result.status;
                    console.log("Status: ", status);
                    if ((status == 'active')) {
                        console.log("User ID Found: ", userId);
                        retriveUserCard(userId);
                    }
                    setTimeout(() => {
                        var newCount = activeCount + 1
                        setActiveCount(newCount);
                    }, 1000)
                })
                .catch((error) => {
                    console.log(error)
                })
            } else {  
                Alert.alert(
                    'Unable to activate card',
                    'Cannot activate this card, as 5 cards have already been activated. Deactivate at least one card that is currently activated and try again.',
                    [
                        { text: 'OK', onPress: () => {} },
                    ]
                );
            }
        }
    }
    // Close

    const newOpen = (current) => {
        console.log("Hello" + " " + current.id);
    }

    // Popup Details
    const handleOpen = (index_num) => {
        setActiveIndex(index_num);
        console.log("Card ID" + card[activeIndex].id);
        setVisible(false);
        let data = {
            id: userId,
            cardno: card[index_num].id
        }
        var resp = getCardById(data)
            .then(resp => {
                let result = resp;
                //console.log("result", result);
                setTimeout(() => {
                    setCardDate(result.date);
                    setName(result.holder);
                    setCardId(result);
                    setCardType(result.type);
                }, 100);
            })
            .catch((error) => {
                console.log(error)
            })
    };
    const handleCancel = () => {
        setVisible(false);
    };
    // Close

    if (!loader) {
        return <Loader />;
    }


    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{display: "flex", flexDirection: "row", marginLeft: 15, marginTop: 10, marginBottom: 20, justifyContent: "center", alignItems: "center"}}>
                <View style={{alignSelf: "center", justifyContent: "center", padding: 15, marginLeft: -15}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { justifyContent: "center", alignSelf: "center"}]}>
                        <Ionicons name="md-chevron-back-outline" size={20} color="white" style={{alignSelf: "center"}} />
                    </TouchableOpacity>
                </View>         
                <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, alignSelf: "center", justifyContent: "center"}}>My Cards</Text>
                <TouchableOpacity style={{...customstyles.btnTheme, backgroundColor: "#fff", borderRadius:25, marginRight: 10, borderColor: "#662397", borderWidth: 2}}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="add-outline" size={20} color="#662397" />
                        <Text onPress={createCards} style={{color: "#662397", fontSize: 15}}> New Card</Text>
                    </View>
                </TouchableOpacity>
            </View>     
            <ScrollView style={styles.innerView}>
                {!notActive && 
                <View style={styles.container}>
                    <View>
                        <Dialog.Container visible={visible}>
                            <View style={{ ...customstyles.mb15 }}>
                                <Text style={{ ...customstyles.textCenter, ...customstyles.h2 }}>Card Details</Text>
                            </View>
                            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.h6, }}>Card Name:</Text>
                                </View>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>{name.name}</Text>
                                </View>
                            </View>
                            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.h6, }}>Card Number:</Text>
                                </View>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>{cardId.number}</Text>
                                </View>
                            </View>
                            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.p5, ...customstyles.bglight }}>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.h6, }}>Card Type:</Text>
                                </View>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>{cardType.type}</Text>
                                </View>
                            </View>
                            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.h6, }}>Card Description:</Text>
                                </View>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>{cardType.description}</Text>
                                </View>
                            </View>
                            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.h6, }}>Card Name: </Text>
                                </View>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>{cardType.name}</Text>
                                </View>
                            </View>
                            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.h6, }}>Card Expiry:</Text>
                                </View>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>{cardDate.expiry}</Text>
                                </View>
                            </View>
                            <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.h6, }}>Card Issued:</Text>
                                </View>
                                <View style={customstyles.col6}>
                                    <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}>{cardDate.issued}</Text>
                                </View>
                            </View>
                            <View style={customstyles.textCenter}>
                                <Dialog.Button label="Close" onPress={handleCancel} style={customstyles.btnRedxs} />
                            </View>


                        </Dialog.Container>
                    </View>
                    {
                    card.length > 0 && cardDate &&
                    <View style={{display: "flex", height: SLIDER_HEIGHT, alignSelf: "center"}}>
                        <Carousel
                        layout="default"
                        ref={ref}
                        data={card}
                        sliderWidth={SLIDER_WIDTH}
                        sliderHeight={SLIDER_HEIGHT}
                        style={{display: "flex", justifyContent: "center", alignSelf: "center"}}
                        itemWidth={ITEM_WIDTH}
                        renderItem={renderItem}
                        onSnapToItem={(index) => handleOpen(index)}
                        /> 
                    </View>
                    }               
                    {
                    card.length > 0 && cardDate &&
                    <View style={{display: "flex"}}>
                        <Pagination
                                dotsLength={card.length}
                                activeDotIndex={activeIndex}
                                containerStyle={{ borderColor: "#663297", alignSelf: "center"}}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 2,
                                    backgroundColor: '#663297'
                                }}
                                inactiveDotStyle={{
                                    // Define styles for inactive dots here
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                                >
                        </Pagination>
                    </View>
                    }
                    {

                        card.length > 0 && cardDate &&
                            <View>
                                { !dataLoader && 
                                <View key={activeIndex} style={{ backgroundColor: "white"}}>
                                    <TextInput
                                        label={<Text>Card Name</Text>}
                                        value={card[activeIndex].type.name}
                                        style={{...otherStyles.textInputDesign}}
                                        theme={{ colors: { text: "#662397"} }}
                                        editable={false}
                                    />
                                    <View style={{ display: "flex", flexDirection: "row", flex: 1}}>
                                        <TextInput
                                            label="Card Holder Name"
                                            value={card[activeIndex].holder.name}
                                            style={{...otherStyles.textInputDesign, flex: 0.5}}
                                            theme={{ colors: { text: "#662397" } }}
                                            editable={false}
                                        />
                                        <TextInput
                                            label="Card Number"
                                            value={card[activeIndex].number}
                                            style={{...otherStyles.textInputDesign, flex: 0.5}}
                                            theme={{ colors: { text: "#662397" } }}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", flex: 1}}>
                                        <TextInput
                                            label="Card Type"
                                            value={card[activeIndex].type.type}
                                            style={{...otherStyles.textInputDesign, flex: 0.5}}
                                            theme={{ colors: { text: "#662397" } }}
                                            editable={false}
                                        />
                                        <TextInput
                                            label="Card Status"
                                            value={card[activeIndex].status.text}
                                            style={{...otherStyles.textInputDesign, flex: 0.5}}
                                            theme={{ colors: { text: "#662397" } }}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: 1}}>
                                        <TextInput
                                        label="Expiry Date"
                                        value={cardDate.expiry}
                                        style={{...otherStyles.textInputDesign, flex: 0.5}}
                                        theme={{ colors: { text: "#662397" } }}
                                        editable={false}
                                        />
                                        <TextInput
                                        label="Date of Issue"
                                        value={cardDate.issued}
                                        style={{...otherStyles.textInputDesign, flex: 0.5}}
                                        theme={{ colors: { text: "#662397" } }}
                                        editable={false}
                                        />
                                    </View>
                                    <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.p5 }}>
                                    </View>
                                </View>
                                }
                                {
                                    dataLoader &&                            
                                    <Loader />
                                }
                                    {
                                        card.length > 0 &&
                                        card[activeIndex].status.text === 'active' ?
                                            <TouchableOpacity onPress={() => handleDeactivate(card[activeIndex].id)}>
                                                <Text style={{ ...customstyles.btnRedsmall, ...customstyles.mx5 }}>Deactivate</Text>
                                            </TouchableOpacity> :
                                            <TouchableOpacity onPress={() => handleActivate(card[activeIndex].id)}>
                                                <Text style={{ ...customstyles.btnThemesmall, ...customstyles.mx5, backgroundColor: "green" }}> Activate </Text>
                                            </TouchableOpacity>
                                    }
                            </View>
                    }
                    {
                        card.length == 0 && 
                        <View style={{display: "flex", alignSelf: "center", justifyContent: "center"}}>
                            <Text style={{fontSize: 15, fontWeight: "bold"}}>No cards created yet! Make one now.</Text>
                        </View>
                    }

                </View>
                }  
                {notActive && 
                    <View style={{display: "flex", justifyContent: "center", alignSelf: "center", width: "90%"}}>
                        <Text style={{fontSize: 15, color: "black", textAlign: "center", fontWeight: "bold", marginBottom: 20}}>
                            Your MatchMove account has been deactivated.
                        </Text>
                        <TouchableOpacity style={customstyles.btnThemexs} onPress={this.onPressWallet} >
                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                <Text style={{color: "#662397", padding: 5}}>Reactivate Account</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }     
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
        // paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 60,
    },
})

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
export default AllCards;
