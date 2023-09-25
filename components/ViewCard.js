import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, ActivityIndicator, ImageBackground} from 'react-native';
import { customstyles } from "../customstyle";
import Loader from './Loader';
import { Ionicons } from '@expo/vector-icons';
import { ViewCards, activateCard, getCardById, commonPost } from './functions';
import Background from './Background';
import Dialog from "react-native-dialog";
import MyTabs from './MyTabs';

function ViewCard({ navigation, route }) {
    const [card, setCard] = useState([]);
    const [loader, setLoader] = useState(false);
    const [userId, setuserId] = useState('');
    const [visible, setVisible] = useState(false);

    const [cardDate, setCardDate] = useState([]);
    const [name, setName] = useState([]);
    const [cardId, setCardId] = useState([]);
    const [cardType, setCardType] = useState([]);
    const [activeCount, setActiveCount] = useState(0);
    const currImage = require("../assets/Images/new_background.jpg");


    useEffect(() => {
        retriveUserCard(route.params.user_id);
        setuserId(route.params.user_id);
    }, []);

    let retriveUserCard = (user_id) => {
        var resp = ViewCards(user_id)
            .then(resp => {
                setLoader(true);
                setCard(resp.cards);
                console.log("Length Cards: ", resp.cards.length);
                console.log("list_cards+++++");
                console.log(resp.cards)

                /*
                for(let i = 0; i < resp.cards.length; i++){
                    if(resp.cards[i].)
                }
                */
            })
            .catch((error) => {
                console.log(error)
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
                id: userId,
                card_id: card_id,
                api_url: 'activatedCard'
            }
            console.log("Post Data: ", data);
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    //console.log("result", result);
                    let status = result.status;
                    console.log(resp);
                    console.log("Card Status: ", status)
                    if ((status == 'active')) {
                        retriveUserCard(userId);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
    // Close

    // Popup Details
    const handleOpen = (card_id) => {
        setVisible(true);
        let data = {
            id: userId,
            cardno: card_id
        }
        var resp = getCardById(data)
            .then(resp => {
                let result = resp;
                console.log("result", result);
                setCardDate(result.date);
                setName(result.holder);
                setCardId(result);
                setCardType(result.type);
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
            <ImageBackground source={currImage} style={{width: "100%", height: "100%"}}>
            <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                        <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <Text style={{ ...customstyles.headerHeading, ...customstyles.flexgrow1, }}>My Card Details</Text>

            </View>
            <ScrollView style={styles.innerView}>
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

                        card.map((item, j) => (
                            <View key={j} style={{ ...customstyles.whitebox, ...customstyles.shadowBlock, ...customstyles.mb10, ...customstyles.mt15 }}>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Card Holder Name:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}> {item.holder.name}</Text>
                                    </View>
                                </View>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Card Name:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}> {item.type.name}</Text>
                                    </View>
                                </View>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Card No:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}> {item.number}</Text>
                                    </View>
                                </View>
                                {/* <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Card Expirt Date:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, }}> {item.date.expiry}</Text>
                                    </View>
                                </View> */}
                                {/* <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight,...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Card Issue Date:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, }}> {item.date.issued}</Text>
                                    </View>
                                </View> */}
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Card Type:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}> {item.type.type}</Text>
                                    </View>
                                </View>
                                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.h6, }}>Status:</Text>
                                    </View>
                                    <View style={customstyles.col6}>
                                        <Text style={{ ...customstyles.textsm, ...customstyles.textpurple }}> {item.status.text}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleOpen(item.id)}>
                                    <Text style={{ ...customstyles.btnThemesmall, ...customstyles.mx5 }}>View Card</Text>
                                </TouchableOpacity>
                                {
                                    item.status.text === 'active' ?
                                        <TouchableOpacity onPress={() => handleDeactivate(item.id)}>
                                            <Text style={{ ...customstyles.btnRedsmall, ...customstyles.mx5 }}>Deactivate Card</Text>
                                        </TouchableOpacity> :
                                        <TouchableOpacity onPress={() => handleActivate(item.id)}>
                                            <Text style={{ ...customstyles.btnThemesmall, ...customstyles.mx5 }}>Activate Card</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                        ))
                    }

                </View>
            </ScrollView>
            <MyTabs />
            </ImageBackground>
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

export default ViewCard;
