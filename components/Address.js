import React, { useEffect, useState } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { commonPost, getEnumerations, getUserAddress, updateAddress } from './functions';
import Background from './Background';
import { Picker } from "@react-native-picker/picker";
import MyTabs from './MyTabs';
import { Dropdown } from 'react-native-element-dropdown';
import Checkbox from 'expo-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'

function Address({ navigation, route }) {
    const [userId, setuserId] = useState('');
    const [nationality, setNationality] = useState([]);
    const [country, setCountry] = useState([]);
    const [isdCode, setIsdCode] = useState([]);
    const [loader, setLoader] = useState(false);
    const [updateLoader, setUpdateLoader] = useState(false);
    const [updateLoader2, setUpdateLoader2] = useState(false);
    const [resErr, setResErr] = useState('');
    const [billErr, setBillErr] = useState('');
    const [resSucc, setResSucc] = useState('');
    const [billSucc, setBillSucc] = useState('');
    const [same, setAsSame] = useState(false);
    const [isFocus, setFocus] = useState(nationality.length == 0);

    // Residentail Address
    const [resident_add1, setResAdd1] = useState('');
    const [resident_add2, setResAdd2] = useState('');
    const [resident_city, setResCity] = useState('');
    const [resident_state, SetResState] = useState('');
    const [resident_zip, setResZip] = useState('');
    const [resident_isd, setResISD] = useState('');
    const [resident_country, setResCountry] = useState('');
    // Close

    // Resident address
    const [billing_add1, setBillAdd1] = useState('');
    const [billing_add2, setBillAdd2] = useState('');
    const [billing_city, setBillCity] = useState('');
    const [billing_state, SetBillState] = useState('');
    const [billing_zip, setBillZip] = useState('');
    const [billing_isd, setBillISD] = useState('');
    const [billing_country, setBillCountry] = useState('');
    const currImage = require("../assets/Images/new_background.jpg");
    // close

    useEffect(() => {
        setuserId(route.params.userDetails.id);
        getResidentialAdd(route.params.userDetails.id);
        getBillingAdd(route.params.userDetails.id);
        getNationality();
        getCountryList();
        getCountryCode();
    }, []);

    // Get Address ::
    let getResidentialAdd = (userId) => {
        let data = {
            id: userId,
            type: 'residential'
        }
        getCommonAddress(data);
    }

    let getBillingAdd = (userId) => {
        let data = {
            id: userId,
            type: 'billing'
        }
        getCommonAddress(data);
    }
    let getCommonAddress = (data) => {
        var resp = getUserAddress(data)
            .then(resp => {
                setLoader(true);
                if ((data.type == 'residential')) {
                    setResAdd1(resp.address_1);
                    setResAdd2(resp.address_2);
                    setResCity(resp.city);
                    SetResState(resp.state);
                    setResZip(resp.zipcode);
                    setResISD(resp.country_code);
                    setResCountry(resp.country);
                } else {
                    setBillAdd1(resp.address_1);
                    setBillAdd2(resp.address_2);
                    setBillCity(resp.city);
                    SetBillState(resp.state);
                    setBillZip(resp.zipcode);
                    setBillISD(resp.country_code);
                    setBillCountry(resp.country);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // Get Enumerations ::
    let getNationality = () => {
        let data = {
            type: 'nationalities'
        }
        getCommonListing(data);
    }
    let getCountryList = () => {
        let data = {
            type: 'country'
        }
        getCommonListing(data);
    }
    let getCountryCode = () => {
        let data = {
            type: 'mobile_country_codes'
        }
        getCommonListing(data);
    }
    let getCommonListing = (data) => {
        var resp = getEnumerations(data)
            .then(resp => {
                let result = resp;
                console.log(result, "This Result");
                if ((result.nationalities)) {
                    var newNationalities = [];
                    result.nationalities.map((dataOption, i) => {
                        newNationalities.push({label: dataOption, value: i})
                    });
                    setNationality(newNationalities);
                    console.log(result.nationalities);
                } else if (result.mobile_country_codes) {
                    var newCodes = [];
                    result.mobile_country_codes.map((dataOption, i) => {
                        newCodes.push({label: dataOption, value: i})
                    });
                    setIsdCode(newCodes);
                    console.log(result.mobile_country_codes);
                } else {
                    var newCountries = [];
                    result.countries.map((dataOption, i) => {
                        newCountries.push({label: dataOption, value: i})
                    });
                    setCountry(newCountries);
                    console.log(result.mobile_country_codes);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // Update Address::
    let updateUserAddress = (types) => {
        let type_of = '';
        let data = {};
        if (types == 'res') {
            data = {
                id: userId,
                address_1: resident_add1,
                address_2: resident_add2,
                city: resident_city,
                country: resident_country,
                country_code: resident_isd,
                state: resident_state,
                zipcode: resident_zip,
                type: 'residential',
                api_url: 'updateUserAddress'
            }
            setUpdateLoader(true);
        } else {
            data = {
                id: userId,
                address_1: billing_add1,
                address_2: billing_add2,
                city: billing_city,
                country: billing_country,
                country_code: billing_isd,
                state: billing_state,
                zipcode: billing_zip,
                type: 'billing',
                api_url: 'updateUserAddress'
            }
            setUpdateLoader2(true);
        }
        //console.log('data', data); return;


        var resp = commonPost(data)
            .then(resp => {

                let result = resp;
                // console.log('updateAddress', result);
                let status = resp.code;
                if ((result.billing)) {
                    if (status == 400) {
                        setBillErr(result.description);
                    } else {
                        setBillSucc('Details Update Successfully');
                    }
                    setUpdateLoader2(false);
                }
                else {
                    if (status == 400) {
                        setResErr(result.description);
                    } else {
                        setResSucc('Details Update Successfully');
                    }
                    setUpdateLoader(false);
                }
                setTimeout(() => {
                    setBillErr('');
                    setResErr('');
                    setBillSucc('');
                    setResSucc('');
                }, 5000);
            })
            .catch((error) => {
                console.log(error)
            })

    }
    // Close

    // Update Address::
    let sameAddress = (checked) => {
        setAsSame(!same);
        if ((checked)) {
            setBillAdd1(resident_add1);
            setBillAdd2(resident_add2);
            setBillCity(resident_city);
            SetBillState(resident_state);
            setBillZip(resident_zip);
            setBillISD(resident_isd);
            setBillCountry(resident_country);
        } else {
            Alert.alert(
                'Confirm Change',
                'Are you sure you do not want your billing address to be the same as your residential address?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => setAsSame(true),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => confirmed() },
                ]
            );

            let confirmed = () => {
                let data = {
                    id: userId,
                    type: 'billing'
                }
                getCommonAddress(data);
            }
        }


    }

    if (!loader) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={styles.scrollArea}>
                <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                    <View>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                            <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 30, color: "#662397", fontWeight: 'bold', flex: 1, marginLeft: 10}}>Update Address</Text>
                </View>
                <ScrollView style={styles.innerView}>
                    <View style={styles.container}>
                        <View style={{ ...customstyles.whitebox, ...customstyles.p20, ...customstyles.mt30 }}>
                            <Text style={{ ...customstyles.h4, ...customstyles.mb15 }}>Residential Address</Text>
                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Address 1</Text>
                            <TextInput
                                placeholder={'Address 1'}
                                value={resident_add1 != '' ? resident_add1 : ''}
                                onChangeText={text => setResAdd1(text)}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Address 2</Text>
                            <TextInput
                                name="address_two" placeholder={'Address 2'}
                                value={resident_add2 != '' ? resident_add2 : ''}
                                onChangeText={(address_2) => setResAdd2(address_2)}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>City</Text>
                            {/*<View style={customstyles.dropdownBoxTheme}>*/}
                            <View style={[{borderColor: "black", borderWidth: 2, marginBottom: 10}]}>
                                <Dropdown
                                style={[styles.dropdown, {borderColor: 'transparent', borderWidth: 2 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={{...styles.inputSearchStyle}}
                                iconStyle={styles.iconStyle}
                                data={nationality}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'City': ''}
                                searchPlaceholder="Search..."
                                value={resident_city}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    setResCity(item.label);
                                    setFocus(false);
                                    console.log(docCategoryValue);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? '#662397' : '#662397'}
                                    name="Safety"
                                    size={20}
                                    />
                                )}
                                />
                            </View>
                           {/* </View> */}

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Country</Text>
                            <View style={[{borderColor: "black", borderWidth: 2, marginBottom: 10}]}>
                                <Dropdown
                                style={[styles.dropdown, {borderColor: 'transparent', borderWidth: 2 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={{...styles.inputSearchStyle}}
                                iconStyle={styles.iconStyle}
                                data={country}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Country': ''}
                                searchPlaceholder="Search..."
                                value={resident_country}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    setResCountry(item.label);
                                    setFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? '#662397' : '#662397'}
                                    name="Safety"
                                    size={20}
                                    />
                                )}
                                />
                            </View>

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>ISD</Text>
                            <View style={[{borderColor: "black", borderWidth: 2, marginBottom: 10}]}>
                                <Dropdown
                                style={[styles.dropdown, {borderColor: 'transparent', borderWidth: 2 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={{...styles.inputSearchStyle}}
                                iconStyle={styles.iconStyle}
                                data={isdCode}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'ISD': ''}
                                searchPlaceholder="Search..."
                                value={resident_isd}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    setResISD(item.label);
                                    setFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? '#662397' : '#662397'}
                                    name="Safety"
                                    size={20}
                                    />
                                )}
                                />
                            </View>

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>State</Text>
                            <TextInput
                                placeholder={'State'}
                                value={resident_state != '' ? resident_state : ''}
                                onChangeText={(text) => SetResState(text)}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />
                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Zipcode</Text>
                            <TextInput
                                placeholder={'Zipcode'}
                                onChangeText={(text) => setResZip(text)}
                                value={resident_zip != '' ? resident_zip : ''}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />
                            {
                                resErr != '' &&
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{resErr}</Text>
                            }
                            {
                                resSucc != '' &&
                                <Text style={{ color: 'green', fontSize: 12, marginTop: 10 }}>{resSucc}</Text>
                            }
                            <TouchableOpacity onPress={() => updateUserAddress('res')}>
                                <View
                                    style={{ ...styles.button, ...customstyles.shadowBtn, backgroundColor: updateLoader == true ? "#663792" : "#663792", }}
                                >
                                    <Text style={{ ...styles.buttonText, ...customstyles.textwhite }}>
                                        {updateLoader == true ? "UPDATING..." : "UPDATE"}
                                    </Text>
                                    {updateLoader == true && <Loader />}
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ ...customstyles.checkboxinlineblock, ...customstyles.mt30 }}>
                            <Checkbox
                                value={same}
                                onValueChange={(checked) => sameAddress(checked)}
                                color="#662397"
                                checked={same ? true : false}
                                style={{ ...customstyles.mr10, ...customstyles.checkboxhidden }}
                            />
                            <Text style={{ ...customstyles.checkboxlistText, color: "#662397" }}>Use residential address</Text>
                        </View>

                        <View style={{ ...customstyles.whitebox, ...customstyles.p20, ...customstyles.mt30 }}>
                            <Text style={{ ...customstyles.h4, ...customstyles.my15 }}>Billing Address</Text>
                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Address 1</Text>
                            <TextInput
                                placeholder={'Address 1'}
                                value={billing_add1 != '' ? billing_add1 : ''}
                                onChangeText={text => setBillAdd1(text)}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Address 2</Text>
                            <TextInput
                                name="address_two" placeholder={'Address 2'}
                                value={billing_add2 != '' ? billing_add2 : ''}
                                onChangeText={(address_2) => setBillAdd2(address_2)}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>City</Text>
                            <View style={[{borderColor: "black", borderWidth: 2, marginBottom: 10}]}>
                                <Dropdown
                                style={[styles.dropdown, {borderColor: "transparent", width: "100%" }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={{...styles.inputSearchStyle}}
                                iconStyle={styles.iconStyle}
                                data={nationality}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'City': ''}
                                searchPlaceholder="Search..."
                                value={billing_city}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    setBillCity(item.label);
                                    setFocus(false);
                                    console.log(docCategoryValue);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? '#662397' : '#662397'}
                                    name="Safety"
                                    size={20}
                                    />
                                )}
                                />
                            </View>

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Country</Text>
                            <View style={[{borderColor: "black", borderWidth: 2, marginBottom: 10}]}>
                                <Dropdown
                                style={[styles.dropdown, {borderColor: 'transparent', borderWidth: 2 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={{...styles.inputSearchStyle}}
                                iconStyle={styles.iconStyle}
                                data={country}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Country': ''}
                                searchPlaceholder="Search..."
                                value={billing_country}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    setBillCountry(item.label);
                                    setFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? '#662397' : '#662397'}
                                    name="Safety"
                                    size={20}
                                    />
                                )}
                                />
                            </View>

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>ISD</Text>
                            <View style={[{borderColor: "black", borderWidth: 2, marginBottom: 10}]}>
                                <Dropdown
                                style={[styles.dropdown, {borderColor: 'transparent', borderWidth: 2 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={{...styles.inputSearchStyle}}
                                iconStyle={styles.iconStyle}
                                data={isdCode}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'ISD': ''}
                                searchPlaceholder="Search..."
                                value={billing_isd}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    setBillISD(item.label);
                                    setFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? '#662397' : '#662397'}
                                    name="Safety"
                                    size={20}
                                    />
                                )}
                                />
                            </View>

                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>State</Text>
                            <TextInput
                                placeholder={'State'}
                                value={billing_state != '' ? billing_state : ''}
                                onChangeText={(text) => SetBillState(text)}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />
                            <Text style={{ ...customstyles.textpurple, ...customstyles.mb5 }}>Zipcode</Text>
                            <TextInput
                                placeholder={'Zipcode'}
                                onChangeText={(text) => setBillZip(text)}
                                value={billing_zip != '' ? billing_zip : ''}
                                style={{ ...customstyles.inputtheme, ...customstyles.mb10 }}
                            />
                            {
                                billErr != '' &&
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{billErr}</Text>
                            }
                            {
                                billSucc != '' &&
                                <Text style={{ color: 'green', fontSize: 12, marginTop: 10 }}>{billSucc}</Text>
                            }
                            <TouchableOpacity onPress={() => updateUserAddress('bil')}>
                                <View
                                    style={{ ...styles.button, ...customstyles.shadowBtn, backgroundColor: updateLoader2 == true ? "#663792" : "#663792", }}
                                >
                                    <Text style={{ ...styles.buttonText, ...customstyles.textwhite }}>
                                        {updateLoader2 == true ? "UPDATING..." : "UPDATE"}
                                    </Text>
                                    {updateLoader2 == true && <Loader />}
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
                <MyTabs />
        </SafeAreaView >
    )
}


const styles = StyleSheet.create({

    scrollArea: {
        flex: 1,
        width: "100%",
        backgroundColor: "white",
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        // paddingHorizontal: 20,
    },
    container: {
        marginBottom: 50,
        paddingHorizontal: 20
    },
    button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 10,
        marginBottom: 20,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: "#663792",
        fontWeight: "bold",
        fontSize: 20
    },
    dropdown: {
        height: 50,
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
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
        height: 20
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
});
export default Address;