import React from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text, Image, ImageBackground, ScrollView, Modal} from 'react-native';
import { customstyles } from '../customstyle';
import Icon from 'react-native-ionicons'
import TranItem from "./TranItem";
import { AntDesign } from '@expo/vector-icons'; 
import { retriveWallet, commonPost } from './functions';
import Dialog from "react-native-dialog";


function Account({navigation, route}){

    const [userId, setuserId] = React.useState('');
    const [virtualDetail, setVirtual] = React.useState('');

    React.useEffect(() => {
        let userId = route.params.user_id;
        setuserId(userId);
        console.log(userId + 'Wallet');

        let data = {
            id: userId,
            type: 'getaccount',
            api_url: 'virtualAccount'
        }
        var response = commonPost(data)
            .then(res => {
                setVirtual(res.data[0].fast_accounts);
            })
            .catch(error => console.log(error));
        console.log(virtualDetail);
    }, []);
    return(

        <View>
            { virtualDetail.length > 0 &&
            <View>
                <View style={{ ...customstyles.mb5 }}>
                    <Text style={{ ...customstyles.textCenter, ...customstyles.h2 }}>Virtual Account Details</Text>
                </View>
                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.h6, }}>Account Number:</Text>
                    </View>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].account_number != '' && virtualDetail[0].account_number}</Text>
                    </View>
                </View>
                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.h6, }}>Holder Name:</Text>
                    </View>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].bank_holder_name != '' && virtualDetail[0].bank_holder_name}</Text>
                    </View>
                </View>
                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.bglight, ...customstyles.p5 }}>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.h6, }}>Bank Account Limit:</Text>
                    </View>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].bank_account_limit != '' && virtualDetail[0].bank_account_limit}</Text>
                    </View>
                </View>
                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.p5, ...customstyles.bglight }}>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.h6, }}>Bank Bic:</Text>
                    </View>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].bank_bic != '' && virtualDetail[0].bank_bic}</Text>
                    </View>
                </View>

                <View style={{ ...customstyles.row, ...customstyles.mb5, ...customstyles.p5, ...customstyles.bglight }}>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.h6, }}>Status:</Text>
                    </View>
                    <View style={customstyles.col6}>
                        <Text style={{ ...customstyles.textsm, }}>{virtualDetail[0].status != '' && virtualDetail[0].status}</Text>
                    </View>
                </View>
                <View style={customstyles.textCenter}>
                    <Button title="Add Beneficary Account" style={customstyles.btnRedsmall} />
                </View>
                <View style={customstyles.textCenter}>
                    <Button title="Close" style={customstyles.btnRedsmall} />
                </View>
            </View>
            }
            <Text>New App</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    tranBackground: {
        width: "95%",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 10,
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

export default Account;