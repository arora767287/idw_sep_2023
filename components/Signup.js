import React, { Component } from 'react';
import { Alert, Linking, Image, TouchableHighlight, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit } from '@regulaforensics/react-native-face-api-beta'
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import {Dropdown} from "react-native-element-dropdown";
import { customstyles } from "../customstyle";
import Loader from './Loader';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { LoginAPI, commonGet, commonGetWithoutToken, commonPost, commonPostWithoutToken } from './functions';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {WebView} from 'react-native-webview';
class Signup extends Component {
    constructor(props) {
        super(props);
    }

    state = {

        title: '',
        fname: '',
        lname: '',
        gender: '',
        reg_email: '',
        paypal_reg_email: '',
        country_code: '',
        phone: '',
        nationality_code: '',
        password: '',
        conf_pass: '',
        id_type: '',
        id_number: '',
        img: '',
        img1: require('../assets/Images/portrait.png'),
        fname_err: '',
        lname_err: '',
        email_err: '',
        phone_err: '',
        currentlocation_err: '',
        password_err: '',
        conf_pass_err: '',
        img_err: '',
        currentlocation: 1,
        terms:false,
        termscon:false,
        termsconval:1,
        terms_err: '',

        userTitles: [],
        userIdTypes: [],
        userMobileCountries: [],
        userNationality: [],
        userCurrentlocation: [],
        api_resp: '',
        api_resp_error: '',


        isFocus: false,
        titleValue:'',
        idTypeValue:'',
        genderValue:'',
        nationalityValue: '',
        isdValue:'',
        currLocationValue: '',
        maritalStatusValue:'',
    }

    componentDidMount() {
        this.getTitles();
        this.getIdTypes();
        this.getMobileCountry();
        this.getNationalities();
        this.getGenders();
        this.getCurrentlocationlist();
    }

    getCurrentlocationlist = () => {
        let data = {
            api_url: 'currentLocation',
        }
        var resp = commonGet(data)
            .then(resp => {
                console.log("resp||||||+++++++++++++++")
                console.log(resp)
                let result = resp.data;
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.country_name, value: i + 1})
                ));
                this.setState({
                    userCurrentlocation: newData
                });
            })
            .catch((error) => {
                console.log("error+++++++++++")
                console.log(error)
            })
    }

    setCurrentlocation(value) {
        this.setState({
            currentlocation: value
        })
       
    }

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
        this.setState({isFocus: false})
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
                    newData.push({label: item.description.display_name, value: i, otherValue: item.code})
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
                console.log("Mobile Country Codes: ", result);
                var newData = [];
                newData.push({label: "USA", value: "+1"})
                result.map((item, i) => (
                    newData.push({label: item.code, value: item.description})
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
        console.log("Getting genders");
        let data = {
            api_url: 'getEnumerationsData',
            type: 'genders',
        }
        var resp = commonPostWithoutToken(data)
            .then(resp => {
                console.log(resp);
                let result = resp.genders;
                var newData = [];
                result.map((item, i) => (
                    newData.push({label: item.code, value: i, otherValue: item.code})
                ));
                this.setState({
                    userGenders: newData
                });
            })
            .catch((error) => {
                console.log(error)
                console.log("got genders");
            })
    }

    setGender = (value) => {
        //console.log(value);
        this.setState({
            gender: value
        });
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



    // Dropdoewn handling
    setTitle(value) {
        this.setState({
            title: value
        })
    }
    SetTerms(value) {
        if(value){
         this.setState({
             terms: value,
             termsconval:2
         })
     }
     else {
        this.setState({
            terms: value,
            termsconval:1
        })     
    }
     }

    setIdType(value) {
        this.setState({
            id_type: value
        })
    }

    setMobileCountry(value) {
        this.setState({
            country_code: value
        })
    }

    setNationality(value) {
        this.setState({
            nationality_code: value
        })
    }

    // Close
    pickImage() {
       FaceSDK.presentFaceCaptureActivity(result => {
        this.setState({ img: FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap })
        this.setState({ img1: { uri: "data:image/png;base64," + FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap } })
          }, e => { })
       
      }

    validateInput() {
        const { fname, lname, reg_email, phone, password, conf_pass,img1, gender, currentlocation, terms } = this.state;
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        //Alert.alert('Credentials', `${username} + ${password}`);
        if ((fname == '')) {
            this.setState({
                fname_err: 'First name is required'
            })
            return;
        } else {
            this.setState({
                fname_err: ''
            })
        }

        if ((lname == '')) {
            this.setState({
                lname_err: 'Last name is required'
            })
            return;
        } else {
            this.setState({
                lname_err: ''
            })
        }

        if ((reg_email == '')) {
            this.setState({
                email_err: 'Email is required'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }


        if (pattern.test(reg_email) === false) {
            this.setState({
                email_err: 'Email is not valid'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }

        if ((currentlocation == '')) {
            this.setState({
                currentlocation_err: 'Current Location is required'
            })
            return;
        } else {
            this.setState({
                currentlocation_err: ''
            })
        }
        if ((!terms)) {
            this.setState({
                terms_err: 'Terms and conditions is required'
            })
            return;
        } else {
            this.setState({
                terms_err: ''
            })
        }

        if ((password == '')) {
            this.setState({
                password_err: 'Password is required'
            })
            return;
        } else {
            this.setState({
                password_err: ''
            })
        }

        if ((conf_pass == '')) {
            this.setState({
                conf_pass_err: 'Confirm Password is required'
            })
            return;
        } else {
            this.setState({
                conf_pass_err: ''
            })
        }

        if ((password != conf_pass)) {
            this.setState({
                password_err: 'Confirm Password & Password does not match'
            })
            return;
        }
        else {
            this.setState({
                password_err: ''
            })
        }

        if ((fname != '') && (lname != '') && (reg_email != '') && (password != '') && (conf_pass != '') && (currentlocation != '')) {
            console.log("Registering")
            this.register();
        }
    }
   
    register = async () => {
       
        let data = {
            title: this.state.title,
            fname: this.state.fname,
            lname: this.state.lname,
            email: this.state.reg_email,
            country_code: this.state.isdValue,
            paypal_email: this.state.reg_email,
            phone: this.state.phone,
            nationality: this.state.nationality_code,
            currentlocation: 1,
            password: this.state.password,
            faceimage: "data:image/png;base64," + this.state.img,
            coupon: this.state.coupon,
            termsandconditions: this.state.termsconval,
            platform: Platform.OS,
            gender: this.state.gender,
            api_url: "registration"
        }

        console.log(data);
        this.setState({
            isLoading: true,
        })
        var response = LoginAPI(data)
            .then(res => {
                console.log("res");
                console.log("New Res")
                console.log(res);
                let message = res.message;
                let description = res.description;
                let status = res.status;
                let mm_code = res.code;

                if ((status == 2)) {
                    //Alert.alert(message);
                    this.setState({
                        api_resp_error: message,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp_error: '',
                        });
                    }, 5000);
                } else if ((status == 0)) {
                    this.setState({
                        api_resp_error: message,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp_error: '',
                        });
                    }, 5000);
                } else if ((mm_code == 400) || (mm_code == 401) || (mm_code == 403) || (mm_code == 500)) {
                    this.setState({
                        api_resp_error: description,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp_error: '',
                        });
                    }, 5000);
                }
                else {
                    this.props.navigation.navigate('Slideshow');
                    /*
                    this.setState({
                        api_resp: message,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp: '',
                        })
                    }, 5000);
                    setTimeout(() => {
                        this.props.navigation.navigate('HomeScreen');
                    }, 5000);
                    */
                }
            }) .catch((error) => {
                console.log(error);
                Alert.alert(
                    'Try again',
                    'Did you fill all of the parameters in correctly? Please check and try again.',
                    [
                        { text: 'OK', onPress: () => {} },
                    ]
                );
            })


    }



    render() {
        {/*if (this.state.termscon) return <WebView source={{ uri: "https://identity-wallet.com/assets/front/img/Identity-Wallet-Privacy-Policy.pdf" }} />*/}
        return (
            <LinearGradient colors={['#20004A', '#20004A', '#20004A']} start={{ x: 0, y: .8 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                <SafeAreaView style={styles.scrollArea}>
                    <ScrollView style={styles.innerView}>
                        <View style={styles.logincontainer}>
                            <View style={{paddingVertical: 10, display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: 20, marginBottom: 10}}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[customstyles.btnWhitecircle, { width: 36, height: 36, alignSelf: "center"}]}>
                                    <Ionicons name="md-chevron-back-outline" size={24} color="#663792" />
                                </TouchableOpacity>
                                <View style={{ ...customstyles.header, ...customstyles.px15, paddingTop: -20,}}>
                                    <Text style={{...customstyles.titleText, fontSize: 35, color: "white", fontWeight: 'bold', flex: 1, marginLeft: 15}}>Signup</Text>
                                </View>
                            </View>
                            {
                                this.state.api_resp_error.length > 0 &&
                                <Text style={customstyles.alertdanger}>{this.state.api_resp_error}</Text>
                            }

                         {/*
                                <Dropdown
                                    style={[styles.dropdown, {borderColor: '#fff', borderWidth: 2, marginBottom: 10}]}
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
                                    onFocus={() => this.setFocus(true)}
                                    onBlur={() => this.setFocus(false)}
                                    onChange={(item) => {
                                        console.log(item)
                                        this.setState({
                                            title: item.label,
                                            isFocus: false,
                                            titleValue: item.value
                                        })
                                    }}
                                /> */}
                                    {/*
                                <Dropdown
                                    style={[styles.dropdown, {borderColor: '#fff', borderWidth: 2, marginBottom: 10}]}
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
                                    onFocus={() => this.setFocus(true)}
                                    onBlur={() => this.setFocus(false)}
                                    onChange={(item) => {
                                        console.log(item)
                                        this.setState({
                                            gender: item.label,
                                            isFocus: false,
                                            genderValue: item.value
                                        })
                                    }}
                                /> */}
                            <View>
                                <TextInput
                                    value={this.state.fname}
                                    onChangeText={(fname) => this.setState({ fname })}
                                    placeholder={'Enter First Name'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.fname_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.fname_err}</Text>
                                }
                            </View>

                            <View>
                                <TextInput
                                    value={this.state.lname}
                                    onChangeText={(lname) => this.setState({ lname })}
                                    placeholder={'Enter Last Name'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.lname_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.lname_err}</Text>
                                }
                            </View>

                            <View>
                                <TextInput
                                    value={this.state.reg_email}
                                    onChangeText={(reg_email) => this.setState({ reg_email })}
                                    placeholder={'Enter Email'}
                                    autoCapitalize={"none"}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.email_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.email_err}</Text>
                                }
                            </View>
                            {/*
                            <Dropdown
                                style={[styles.dropdown, {borderColor: '#fff', borderWidth: 2, marginBottom: 10}]}
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
                                onFocus={() => this.setFocus(true)}
                                onBlur={() => this.setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    this.setState({
                                        isd_code: item.label,
                                        isFocus: false,
                                        isdValue: item.value
                                    })
                                }}
                                />
                            */}
                            <View>
                                <TextInput
                                    value={this.state.phone}
                                    keyboardType={'numeric'}
                                    onChangeText={(phone) => this.setState({ phone })}
                                    placeholder={'Enter Phone No'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />

                                {
                                    this.state.phone_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.phone_err}</Text>
                                }
                            </View>
                                {/*
                                <Dropdown
                                    style={[styles.dropdown, {borderColor: '#fff', borderWidth: 2, marginBottom: 10}]}
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
                                    onFocus={() => this.setFocus(true)}
                                    onBlur={() => this.setFocus(false)}
                                    onChange={(item) => {
                                        console.log(item)
                                        this.setState({
                                            nationality_code: item.label,
                                            isFocus: false,
                                            nationalityValue: item.value
                                        })
                                    }}
                                    />
                                */}
                            <View>
                                <TextInput
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({ password })}
                                    placeholder={'Enter Password'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.password_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.password_err}</Text>
                                }
                            </View>

                            <View>
                                <TextInput
                                    value={this.state.conf_pass}
                                    secureTextEntry={true}
                                    onChangeText={(conf_pass) => this.setState({ conf_pass })}
                                    placeholder={'Confirm Password'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.conf_pass_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.conf_pass_err}</Text>
                                }
                               
                            </View>
                            {/*<Dropdown
                                style={[styles.dropdown, {borderColor: '#fff', borderWidth: 2, marginBottom: 10}]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={{...styles.inputSearchStyle}}
                                iconStyle={styles.iconStyle}
                                data={this.state.userCurrentlocation}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!this.state.isFocus ? 'Select Country': ''}
                                searchPlaceholder="Search..."
                                value={this.state.currLocationValue}
                                onFocus={() => this.setFocus(true)}
                                onBlur={() => this.setFocus(false)}
                                onChange={(item) => {
                                    console.log(item)
                                    this.setState({
                                        currentlocation: item.label,
                                        isFocus: false,
                                        currLocationValue: item.value
                                    })
                                }}
                                />
                                <TextInput
                                value={this.state.coupon}
                                onChangeText={(coupon) => this.setState({ coupon })}
                                placeholder={'Enter Referral Code (if you have one)'}
                                style={[customstyles.input]}
                                placeholderTextColor="#aaa"
                            />
                            {
                                this.state.currentlocation_err.length > 0 &&
                                <Text style={customstyles.alertdanger}>{this.state.currentlocation_err}</Text>
                            }
                        */}
                            
                            <View>
                                <TextInput
                                    value={this.state.paypal_reg_email}
                                    onChangeText={(paypal_reg_email) => this.setState({ paypal_reg_email })}
                                    placeholder={'Enter PayPal Email '}
                                    style={customstyles.input}
                                    autoCapitalize='none'
                                    placeholderTextColor="#aaa"
                                    editable={this.state.currLocationValue == 1}
                                />
                               
                            </View>
                        
                            {/*
                           <View style={{ flexDirection: "column", alignItems: "center" }}>
                                <TouchableHighlight onPress={() => this.pickImage()}>
                                    <Image
                                    style={{
                                        height: 150,
                                        width: 150,
                                    }}
                                    source={this.state.img1}
                                    resizeMode="contain" />
                                </TouchableHighlight>
                                <Text style={{fontSize:12,color:"#fff",paddingBottom:5}}>Configure Face ID Login</Text>
                                    {
                                        this.state.img_err.length > 0 &&
                                        <Text style={customstyles.alertdanger}>{this.state.img_err}</Text>
                                    }
                            </View> 
                            {
                                
                                this.state.api_resp.length > 0 &&
                                <Text style={customstyles.alertPrimary}>{this.state.api_resp}</Text>
                            }
                        */}
                            <View style={{...customstyles.mb15,paddingLeft:30, marginTop: 15, display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    <Checkbox
                                        value={this.state.terms}
                                        onValueChange={(checked) => this.SetTerms(checked)}
                                        color={this.state.terms ? 'transparent' : undefined}
                                        checked={this.state.terms ? true : false}
                                        style={{ ...customstyles.mr5, ...customstyles.signupcheckbox }}
                                    />
                                <Text style={{justifyContent: "center",  marginBottom: -5}}>
                                    <TouchableOpacity  onPress={() => {Linking.openURL('https://identity-wallet.com/assets/front/img/Identity-Wallet-Privacy-Policy.pdf')}}>
                                        <Text style={{ ...customstyles.labelwhite, ...customstyles.underline }}>I agree to the terms & conditions *</Text>
                                    </TouchableOpacity>
                                </Text>
                            </View>
                            {
                              this.state.terms_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.terms_err}</Text>
                                }
                                 {
                                this.state.api_resp_error.length > 0 &&
                                <Text style={customstyles.alertdanger}>{this.state.api_resp_error}</Text>
                            }
                            <TouchableOpacity onPress={this.validateInput.bind(this)}>
                                <View
                                    style={{
                                        ...styles.button, ...customstyles.shadowBlock,
                                        backgroundColor: this.state.isLoading ? "#fff" : "#FFF",
                                    }}
                                >
                                    <Text style={styles.buttonText}>
                                        {this.state.isLoading ? "LOGGING IN..." : "SUBMIT"}
                                    </Text>
                                    {this.state.isLoading && <Loader />}
                                </View>
                            </TouchableOpacity>

                            <View style={{ ...customstyles.rowverticalcenter, ...customstyles.mb25 }}>
                                <Text style={customstyles.labelwhite}>Already have an account?</Text>
                                <TouchableOpacity onPress={this.loginNavigation}>
                                    <Text style={{ ...customstyles.labelwhite, ...customstyles.underline }}>  Login Here</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
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
        paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 20,

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
    picker: {
        marginVertical: 30,
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderColor: "#fff",
        color: '#fff'
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 10,
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
        color: "#aaa",
        marginLeft: 10
      },
      selectedTextStyle: {
        fontSize: 16,
        color: "white",
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

export default Signup;