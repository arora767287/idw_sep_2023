import React, { Component, useState } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, ToastAndroid, ActivityIndicator, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, ImageBackground } from 'react-native';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { userDetailById, commonPost, commonGet, commonPostWithoutToken, commonGetWithoutToken } from './functions';
import Loader from './Loader';
import { Ionicons } from '@expo/vector-icons';
import { customstyles } from "../customstyle";
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import Background from './Background';
const currImage = require("../assets/Images/new_background.jpg");
import {Dropdown} from "react-native-element-dropdown";
import newDropdown from "./newDropdown.js";
import AntDesign from 'react-native-vector-icons/AntDesign'
class EditProfile extends Component {
    state = {
        user_id: '',
        title: '',
        id_type: '',
        id_number: '',
        fname: '',
        middle_name: '',
        lname: '',
        preferred_name: '',
        user_email: '',
        isd_code: '',
        phone: '',
        gender: '',
        dob: '',
        address: '',
        income_year: '',
        yearly_income: '',
        industry: '',
        isLoading: false,
        school_attended: '',
        nationality: '',
        marital_status: '',
        dataLoading: false,
        api_resp: '',

        fname_err: '',
        lname_err: '',

        userTitles: [],
        userIdTypes: [],
        userMobileCountries: [],
        userNationality: [],
        userGenders: [],
        userMarriageTitle: [],

        isFocus: false,
        titleValue:0,
        idTypeValue:0,
        isdValue:0,
        maritalStatusValue:0,


    }

    componentDidMount() {
        let userData = this.props.route.params.userDetails;
        //console.log(userData);
        this.getUser(userData.id);
        this.getTitles();
        this.getIdTypes();
        this.getMobileCountry();
        this.getNationalities();
        this.getGenders();
        this.getMarriageTitles();
        this.setState({
            dataLoading: true,
            user_id: userData.id,
        });
    }

    // Dropdown Lisitngs
    getTitles = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'titles',
        }
        var resp = commonPostWithoutToken(data)
            .then(resp => {
                let result = resp.titles;
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.code, value: i})
                ));
                //console.log(result);
                this.setState({
                    userTitles: newData
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    setFocus = (amount) =>{
        this.setState({isFocus: amount})
    }

    getIdTypes = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'id_types',
        }
        var resp = commonPostWithoutToken(data)
            .then(resp => {
                let result = resp.id_types.primary;
                console.log("ID: " + result);
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.description.display_name, value: i})
                ));
                //console.log(result);
                this.setState({
                    userIdTypes: newData
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getMobileCountry = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'mobile_country_codes',
        }
        var resp = commonPostWithoutToken(data)
            .then(resp => {
                let result = resp.mobile_country_codes;
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.code, value: i})
                ));
                this.setState({
                    userMobileCountries: newData
                })
                //console.log(result);
            })
            .catch((error) => {
                console.log(error)
            })
    }


    getNationalities = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'nationalities',
        }
        var resp = commonPostWithoutToken(data)
            .then(resp => {
                let result = resp.nationalities;
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.code, value: i})
                ));
                this.setState({
                    userNationality: newData
                })
                //console.log(result);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getGenders = () => {
        let data = {
            api_url: 'mmGenders'
        }
        var resp = commonGetWithoutToken(data)
            .then(resp => {
                let result = resp.data;
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.code, value: i})
                ));
                //console.log(result);
                this.setState({
                    userGenders: newData
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getMarriageTitles = () => {
        let data = {
            api_url: 'mmMaritalStatus'
        }
        var resp = commonGetWithoutToken(data)
            .then(resp => {
                let result = resp.data;
                //console.log(result);
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.code, value: i})
                ));
                this.setState({
                    userMarriageTitle: newData
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Close

    getUser = (user_id) => {
        console.log(user_id);
        var resp = userDetailById(user_id)
            .then(resp => {
                this.setState({
                    dataLoading: false
                });
                let result = resp.data;
                //console.log(result);
                this.setState({
                    title: result.title,
                    id_type: result.mm_id_type,
                    fname: result.fname,
                    id_number: result.mm_id_number,
                    middle_name: result.middle_name,
                    lname: result.lname,
                    preferred_name: result.preferred_name,
                    user_email: result.email,
                    isd_code: result.isd_code,
                    phone: result.phone,
                    dob: result.dob,
                    gender: result.gender,
                    address: result.address,
                    income_year: result.income_year,
                    yearly_income: result.yearly_income,
                    industry: result.industry,
                    nationality: result.mm_nationalities,
                    school_attended: result.school_attended,
                    marital_status: result.marital_status
                });
            })
            .catch((error) => {
                console.log(error)
            })

    }

    // Picker Item Selections::
    setTitle = (value) => {
        //console.log(value);
        this.setState({
            title: value
        });
    }

    setIdType = (value) => {
        //console.log(value);
        this.setState({
            id_type: value
        });
    }

    setMobileCountry = (value) => {
        //console.log(value);
        this.setState({
            isd_code: value
        });
    }

    setGender = (value) => {
        //console.log(value);
        this.setState({
            gender: value
        });
    }

    setMarital = (value) => {
        //console.log(value);
        this.setState({
            marital_status: value
        });
    }

    schoolAttended = (value) => {
        //console.log(value);
        this.setState({
            school_attended: value
        });
    }

    setNationality = (value) => {
        //console.log(value);
        this.setState({
            nationality: value
        });
    }
    // Close

    validateInput = () => {
        const { fname, lname } = this.state;
        if ((fname == '')) {
            Alert.alert('First name is required');
            // this.setState({
            //     fname_err: 'First name is required'
            // })
            return;
        } else {
            this.setState({
                fname_err: ''
            })
        }

        if ((lname == '')) {
            Alert.alert('Last name is required');
            // this.setState({
            //     lname_err: 'Last name is required'
            // })
            return;
        } else {
            this.setState({
                lname_err: ''
            })
        }

        if ((fname != '') && (lname != '')) {
            this.updateProfile();
        }
    }

    updateProfile = () => {

        let data = {
            id: this.state.user_id,
            title: this.state.title,
            id_type: this.state.id_type,
            id_number: this.state.id_number,
            fname: this.state.fname,
            lname: this.state.lname,
            middle_name: this.state.middle_name,
            preferred_name: this.state.preferred_name,
            isd_code: this.state.isd_code,
            dob: this.state.dob,
            gender: this.state.gender,
            address: this.state.address,
            marital_status: this.state.marital_status,
            income_year: this.state.income_year,
            yearly_income: this.state.yearly_income,
            industry: this.state.industry,
            school_attended: this.state.school_attended,
            nationality: this.state.nationality,
            api_url: 'updateMMuser'
        }

        console.log(data);

        this.setState({
            isLoading: true,
        })

        var resp = commonPost(data)
            .then(resp => {
                let message = resp.message;
                let status = resp.status;
                console.log(resp);
                console.log("Message: ", message);
                if ((status == 1)) {
                    Alert.alert(message);
                    this.setState({
                        api_resp: message,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp: '',
                        })
                        this.props.navigation.goBack();
                    }, 5000)
                } else {
                    this.setState({
                        isLoading: false,
                        api_resp: message,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp: '',
                        })
                    }, 5000)
                    //Alert.alert('Error in Profile update');
                }
                //console.log(result);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    render() {

        if (this.state.dataLoading) {
            return <Loader />;
        }

        return (

            <SafeAreaView style={styles.scrollArea}>
                <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                            <Ionicons name="md-chevron-back-outline" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 35, color: "#662397", fontWeight: 'bold', flex: 1, alignSelf: "center", marginLeft: 15}}>Edit Profile</Text>
                </View>
                <ScrollView style={styles.innerView}>
                    <View style={{...customstyles.mt30, ...customstyles.mb20}}>
                        <Text style={[customstyles.textwhite, { paddingTop:4, color: "#000" }]}>Title</Text>
                        <Dropdown
                            style={[styles.dropdown, {borderColor: 'black', borderWidth: 2 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={{...styles.inputSearchStyle}}
                            iconStyle={styles.iconStyle}
                            data={this.state.userTitles}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Title': ''}
                            searchPlaceholder="Search..."
                            value={this.state.titleValue}
                            onFocus={() => this.setFocus(false)}
                            onBlur={() => this.setFocus(false)}
                            onChange={(item) => {
                                console.log(item)
                                this.setState({
                                    title: item.label,
                                    isFocus: false,
                                    titleValue: item.value
                                })
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                style={styles.icon}
                                color={this.state.isFocus ? '#662397' : '#662397'}
                                name="Safety"
                                size={20}
                                />
                            )}
                            />
                        <Text style={[customstyles.textwhite, { paddingTop:4, color: "#000" }]}>ID Type</Text>
                        <Dropdown
                            style={[styles.dropdown, {borderColor: 'black', borderWidth: 2 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={{...styles.inputSearchStyle}}
                            iconStyle={styles.iconStyle}
                            data={this.state.userIdTypes}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select ID Type': ''}
                            searchPlaceholder="Search..."
                            value={this.state.idTypeValue}
                            onFocus={() => this.setFocus(false)}
                            onBlur={() => this.setFocus(false)}
                            onChange={(item) => {
                                console.log(item)
                                this.setState({
                                    id_type: item.label,
                                    isFocus: false,
                                    idTypeValue: item.value
                                })
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                style={styles.icon}
                                color={this.state.isFocus ? '#662397' : '#662397'}
                                name="Safety"
                                size={20}
                                />
                            )}
                            />

                <Text style={[customstyles.textwhite, { paddingTop:4, color: "#000" }]}>ID Number</Text>
                        <TextInput
                            name="id_number" placeholder={'ID Number'}
                            value={this.state.id_number ? this.state.id_number : ''}
                            onChangeText={(id_number) => this.setState({ id_number })}
                            style={[customstyles.inputtheme, { marginBottom: 10, borderColor: "#000" }]} 
                            color="#662397"/>

                        <Text style={[customstyles.textwhite, { marginBottom: 1, color: "#000"}]}>First Name</Text>
                        <TextInput
                            name="fname" placeholder={'First Name'}
                            value={this.state.fname ? this.state.fname : ''}
                            onChangeText={(fname) => this.setState({ fname })}
                            style={[customstyles.inputtheme, { marginBottom: 10, borderColor: "#000" }]} 
                            color="#662397"
                        />

                        {
                            this.state.fname_err.length > 0 &&
                            <Text style={customstyles.alertdanger}>{this.state.fname_err}</Text>
                        }

                    <Text style={[customstyles.textwhite, { paddingTop:1, color: "#000" }]}>Middle Name</Text>
                        <TextInput
                            name="middle_name" placeholder={'Middle Name'}
                            value={this.state.middle_name ? this.state.middle_name : ''}
                            onChangeText={(middle_name) => this.setState({ middle_name })}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                            color="#662397"
                        />

                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Last Name</Text>
                        <TextInput
                            name="lname" placeholder={'Last Name'}
                            value={this.state.lname ? this.state.lname : ''}
                            onChangeText={(lname) => this.setState({ lname })}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                            color="#662397"

                        />
                        {
                            this.state.lname_err.length > 0 &&
                            <Text style={customstyles.alertdanger}>{this.state.lname_err}</Text>
                        }


                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Preferred Name</Text>
                        <TextInput
                            name="preferred_name" placeholder={'Pref Name'}
                            value={this.state.preferred_name ? this.state.preferred_name : ''}
                            onChangeText={(preferred_name) => this.setState({ preferred_name })}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                            color="#662397"

                        />

                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Email </Text>
                        <TextInput
                            name="email" placeholder={'Email'}
                            editable={false}
                            selectTextOnFocus={false}
                            value={this.state.user_email ? this.state.user_email : ''}
                            color="#662397"
                            style={[customstyles.inputtheme, { marginBottom: 10, backgroundColor: '#e0dede' }]}
                        />

                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000"}]}>Mobile Country Code</Text>
                        <Dropdown
                            style={[styles.dropdown, {borderColor: 'black', borderWidth: 2 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={{...styles.inputSearchStyle}}
                            iconStyle={styles.iconStyle}
                            data={this.state.userMobileCountries}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Mobile Country Code': ''}
                            searchPlaceholder="Search..."
                            value={this.state.isdValue}
                            onFocus={() => this.setFocus(false)}
                            onBlur={() => this.setFocus(false)}
                            onChange={(item) => {
                                console.log(item)
                                this.setState({
                                    isd_code: item.label,
                                    isFocus: false,
                                    isdValue: item.value
                                })
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                style={styles.icon}
                                color={this.state.isFocus ? '#662397' : '#662397'}
                                name="Safety"
                                size={20}
                                />
                            )}
                            />



                        <Text style={[customstyles.textwhite, { paddingTop: 3, color: "#000" }]}>Phone Number</Text>
                        <TextInput
                            name="phone" placeholder={'Phone'}
                            value={this.state.phone ? this.state.phone : ''}
                            editable={false}
                            selectTextOnFocus={false}
                            style={[customstyles.inputtheme, { marginBottom: 10, backgroundColor: '#e0dede' }]}
                        />


                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Date Of Birth</Text>
                        <TextInput
                            name="dob" placeholder={'DOB'}
                            value={this.state.dob ? this.state.dob : ''}
                            onChangeText={(dob) => this.setState({ dob })}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                            color="#662397"
                        />

                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000"}]}>Select Gender</Text>
                        <Dropdown
                            style={[styles.dropdown, {borderColor: 'black', borderWidth: 2 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={{...styles.inputSearchStyle}}
                            iconStyle={styles.iconStyle}
                            data={this.state.userGenders}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Gender': ''}
                            searchPlaceholder="Search..."
                            value={this.state.genderValue}
                            onFocus={() => this.setFocus(false)}
                            onBlur={() => this.setFocus(false)}
                            onChange={(item) => {
                                console.log(item)
                                this.setState({
                                    gender: item.label,
                                    isFocus: false,
                                    genderValue: item.value
                                })
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                style={styles.icon}
                                color={this.state.isFocus ? '#662397' : '#662397'}
                                name="Safety"
                                size={20}
                                />
                            )}
                            />

                        <Text style={[customstyles.textwhite, { paddingTop: 3, color: "#000"}]}>Select Marital Status</Text>
                            <Dropdown
                            style={[styles.dropdown, {borderColor: 'black', borderWidth: 2 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={{...styles.inputSearchStyle}}
                            iconStyle={styles.iconStyle}
                            data={this.state.userMarriageTitle}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Marital Status': ''}
                            searchPlaceholder="Search..."
                            value={this.state.maritalStatusValue}
                            onFocus={() => this.setFocus(false)}
                            onBlur={() => this.setFocus(false)}
                            onChange={(item) => {
                                console.log(item)
                                this.setState({
                                    marital_status: item.label,
                                    isFocus: false,
                                    maritalStatusValue: item.value
                                })
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                style={styles.icon}
                                color={this.state.isFocus ? '#662397' : '#662397'}
                                name="Safety"
                                size={20}
                                />
                            )}
                            />


                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Income Year</Text>

                        <TextInput
                            name="income_year" placeholder={'Income Year'}
                            value={this.state.income_year != '' ? this.state.income_year : ''}
                            onChangeText={(income_year) => this.setState({ income_year })}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                            color="#662397"
                        />


                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Yearly Income</Text>
                        <TextInput
                            placeholder={'Yearly Income'}
                            value={this.state.yearly_income ? this.state.yearly_income : ''}
                            onChangeText={(yearly_income) => this.setState({ yearly_income })}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                            color="#662397"
                        />

                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Industry</Text>
                        <TextInput
                            placeholder={'Industry Income'}
                            value={this.state.industry ? this.state.industry : ''}
                            onChangeText={(industry) => this.setState({ industry })}
                            style={[customstyles.inputtheme, { marginBottom: 10 }]}
                            color="#662397"
                        />

                        <Text style={[customstyles.textwhite, { marginBottom: 3, color: "#000" }]}>Nationality</Text>

                        <Dropdown
                            style={[styles.dropdown, {borderColor: 'black', borderWidth: 2 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={{...styles.inputSearchStyle}}
                            iconStyle={styles.iconStyle}
                            data={this.state.userNationality}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!this.state.isFocus ? 'Select Nationality': ''}
                            searchPlaceholder="Search..."
                            value={this.state.nationalityValue}
                            onFocus={() => this.setFocus(false)}
                            onBlur={() => this.setFocus(false)}
                            onChange={(item) => {
                                console.log(item)
                                this.setState({
                                    nationality: item.label,
                                    isFocus: false,
                                    nationalityValue: item.value
                                })
                            }}
                            renderLeftIcon={() => (
                                <AntDesign
                                style={styles.icon}
                                color={this.state.isFocus ? '#662397' : '#662397'}
                                name="Safety"
                                size={20}
                                />
                            )}
                            />
                        {/*<View style={customstyles.dropdownBoxTheme}>
                            <Picker
                                selectedValue={this.state.school_attended}
                                onValueChange={(value, index) => this.schoolAttended(value)}
                                mode="dropdown" // Android only
                                style={customstyles.dropdowntheme}
                                color="white"
                            >
                                <Picker.Item label="School Attended" value="" color='black' />
                                <Picker.Item label="Yes" value="1" selectedValue={this.state.school_attended == 1 ? true : false} color='black' />
                                <Picker.Item label="No" value="0" selectedValue={this.state.school_attended == 0 ? true : false} color='black' />

                            </Picker>
                            </View>*/}

                        {
                            this.state.api_resp.length > 0 &&
                            <Text style={{ color: 'green' }}>{this.state.api_resp}</Text>
                        }

                        <TouchableOpacity onPress={this.validateInput.bind(this)} style={{ ...customstyles.btnTheme}}>
                                <Text style={{textAlign: "center", color: "white"}}>
                                    {this.state.isLoading ? "Updating..." : "Update"}
                                </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        width: "100%",
    },
    scrollArea: {
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 10,
        marginBottom: 20,
        borderRadius: 30,
    },
    buttonText: {
        color: "#663792",
        fontWeight: "bold",
        fontSize: 20
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: '#662397',
        marginBottom: 10,
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingVertical: 15,
        // paddingHorizontal: 12,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
    },
    datePickerStyle: {
        width: 200,
        marginTop: 20,
    },
    picker: {
        marginVertical: 30,
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderColor: "#662397",
        color: '#fff'
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
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
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      }
});

export default EditProfile;