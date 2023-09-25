import React, { Component } from 'react';
import { Image, TouchableHighlight, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit } from '@regulaforensics/react-native-face-api-beta'
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customstyles } from "../customstyle";
import Loader from './Loader';
import { Ionicons } from '@expo/vector-icons';
import { LoginAPI, commonGet,commonGetwihoutktoken, commonGetFace } from './functions';
import { Alert } from 'react-native';
var image1 = new MatchFacesImage()
var image2 = new MatchFacesImage()
class Facereaction extends Component {
    constructor(props) {
        super(props);
    }

    state = {

        title: '',
        fname: '',
        lname: '',
        reg_email: '',
        country_code: '',
        phone: '',
        nationality_code: '',
        password: '',
        conf_pass: '',
        id_type: '',
        id_number: '',
        img: false,
        img1: new MatchFacesImage(),
        img2: new MatchFacesImage(),
        fname_err: '',
        lname_err: '',
        email_err: '',
        phone_err: '',
        password_err: '',
        conf_pass_err: '',
        img_err: '',
        similarity:'',
        userTitles: [],
        userIdTypes: [],
        userMobileCountries: [],
        resdata: [],
        api_resp: '',
        api_resp_error: '',
        isLoading: false,
        isLoading1: false,
        allUser: null,
    }

    componentDidMount() {
       
    }

    // Close
    pickImage(checked) {
       FaceSDK.presentFaceCaptureActivity(result => {
        let tempImage = new MatchFacesImage();
        if(checked == true) {
            tempImage.bitmap = FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap
            tempImage.imageType = 3
            tempImage.uri = "data:image/png;base64," + FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap;
            this.setState({ img1: tempImage })
            this.setState({img: true})
            this.getemail();
        }
        }, e => { })
       
      }

      reactivateAccount(user_id) {
        //Call API to reactivate account (set status to 1, and call activateMMuser function)
        let data = {
            id: user_id,
            api_url: 'activateUser'
        }
        this.setState({
            isLoading: true,
        })

        const response = commonPost(data)
        .then(resp => {
             console.log("Response Data: ", resp.data);
             this.getemail();
             Alert.alert(
                'Reactivated Account',
                'Your account has been reactivated, logging you in!',
                [
                    { text: 'OK', onPress: this.validateInput() },
                ]
            );
        }).catch((error) => {
            console.log(error);
        })
    }
    validateInput() {
        const { img1 } = this.state;
       
        if ((img1 == '')) {
            this.setState({
                img_err: 'Image required for face detection'
            })
            return;
        } else {
            this.setState({
                img_err: ''
            })
        }




        if ((img1 != '')) {
            this.setState({
                isLoading: true,
            });
           var request = new MatchFacesRequest();
           console.log("First Image: ", this.state.img1);
           console.log("Second Image: ", this.state.img2);

            request.images = [this.state.img1, this.state.img2]
            FaceSDK.matchFaces(JSON.stringify(request), response => {
              response = MatchFacesResponse.fromJson(JSON.parse(response))
              FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75, str => {
                var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))
                console.log(split);
              //console.log(Math.round(split.matchedFaces[0].similarity * 100))
              console.log(this.state.allUser);
              if(split.matchedFaces.length > 0 && Math.round(split.matchedFaces[0].similarity * 100) >80){
                console.log("User Status: ", this.state.allUser.status);
                if(this.state.allUser.status == 1){
                    this.setState({
                        api_resp: "Face ID Successful",
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp: '',
                        })
                        this.props.navigation.navigate('MyTabs', { userInfo: this.state.allUser });
                    }, 1000);
                } else if ((this.state.allUser.status == 2)) {
                    //Show reactivate account link
                    Alert.alert(
                        'Reactivate Account',
                        'Your account is currently deactivated. Would you like to reactivate it?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: this.reactivateAccount(this.state.allUser.id) },
                        ]
                    );
                } else if ((this.state.allUser.status == 3)) {
                    Alert.alert(
                        'Blocked Account',
                        'Your account has been blocked. Please contact identity.wallet.atlanta@gmail.com, or visit our website for our customer support number. ',
                    );
                }
              
              }else{
                this.setState({
                    api_resp_error: "Face and username don't match. Try again.",
                    isLoading: false,
                });
                setTimeout(() => {
                    this.setState({
                        api_resp_error: '',
                    })
                }, 1000);
              }
                this.setState({ similarity: split.matchedFaces.length > 0 ? ((split.matchedFaces[0].similarity * 100).toFixed(2) + "%") : "error" })
              }, e => { this.setState({ similarity: e }) })
            }, e => { this.setState({ similarity: e }) })
        }
    }
   
   

    getemail(){
        let data = {
            api_url: 'statusFaceImage',
            username: this.state.reg_email,
        }
        console.log(data)
        this.setState({
            isLoading1: true,
        });
        var resp = commonGetFace(data)
            .then(resp => {
                console.log("Data Response: ", resp)
                let result = resp.data;
                this.setState({
                    resdata: result,
                    isLoading1: false,
                })
                let tempImage = new MatchFacesImage();
                console.log("Resp FaceImage: ", resp.data.faceimage)
                tempImage.bitmap = resp.data.faceimage;
                tempImage.imageType = 3
                let newFace = resp.data.faceimage;
                tempImage.uri = "data:image/png;base64," + newFace;
                this.setState({ img2: tempImage })
                AsyncStorage.setItem('userInfo', JSON.stringify(result));
                this.setState({allUser: result});
                //
            })
            .catch((error) => {
                Alert.alert(
                    'Invalid Username',
                    'Enter your username to log in using Face ID.',
                    [
                        { text: 'OK', onPress: () => {}},
                    ]
                );
                console.log(error)
            })
        
    }

    render() {

        return (
            <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} start={{ x: 0, y: .8 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                <SafeAreaView style={styles.scrollArea}>
                    <ScrollView style={styles.innerView}>
                        <View style={styles.logincontainer}>
                            {/*
                            <View style={{ paddingVertical: 20 }}>
                                <Text style={customstyles.headingWhite}>Face ID Login</Text>
                            </View>
                            */}

                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[customstyles.btnWhitecircle, { width: 36, height: 36, marginBottom: 30 }]}>
                                <Ionicons name="md-chevron-back-outline" size={24} color="#663792" />
                            </TouchableOpacity>
                            {
                                this.state.api_resp_error.length > 0 &&
                                <Text style={customstyles.alertdanger}>{this.state.api_resp_error}</Text>
                            }

                            {
                                this.state.api_resp.length > 0 &&
                                <Text style={customstyles.alertPrimary}>{this.state.api_resp}</Text>
                            }
                            {
                                this.state.img == true &&
                                <Text style={customstyles.alertPrimary}>Face Scanned!</Text>
                            }
                           
                        <View  style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <View style={{width: "60%"}}>              
                                  <TextInput
                                    value={this.state.reg_email}
                                    onChangeText={reg_email => this.setState({ reg_email })}
                                    placeholder={'Username'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.email_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.email_err}</Text>
                                }
                            </View>
                           <View style={{ flexDirection: "column", alignItems: "center" }}>
                                <TouchableHighlight onPress={() => this.pickImage(true)} style={{marginBottom: 10, width: "100%"}}>
                                    {
                                        this.state.img ? 
                                        <View style={{backgroundColor: "white", padding: 10, alignSelf: "center", justifyContent: "center", textAlign: "center", borderRadius: 50}}>
                                            <Text style={{fontSize: 20, textAlign: "center", color: "#662397"}}>Scan Face </Text>
                                        </View>
                                        :
                                        <View>
                                        <View style={{backgroundColor: "white", padding: 10, alignSelf: "center", justifyContent: "center", textAlign: "center", borderRadius: 50}}>
                                            <Text style={{fontSize: 20, textAlign: "center", color: "#662397"}}>Scan Face </Text>
                                        </View>
                                            {/*
                                            <Text style={{textAlign: "center", color: "green", fontWeight: "bold"}}>Face Scanned</Text>
                                                <Image
                                            style={{
                                                height: 150,
                                                width: 150,
                                                borderWidth: 2,
                                                borderRadius: 10,
                                                borderColor: "#fff"
                                            }}
                                            source={this.state.img1}
                                            resizeMode="contain" />
                                        */}
                                        </View>
                                    }
                                </TouchableHighlight>
                                {
                                this.state.img_err.length > 0 &&
                                <Text style={customstyles.alertdanger}>{this.state.img_err}</Text>
                                }
                            </View> 
                        </View>
           
                            {this.state.isLoading1 && <ActivityIndicator size="large" color="#fff" />}
                            {this.state.isLoading && <ActivityIndicator size="large" color="#fff" />}
                            <TouchableOpacity onPress={this.validateInput.bind(this)}>
                                <View
                                    style={{
                                        ...styles.button, ...customstyles.shadowBlock,
                                        backgroundColor: this.state.isLoading ? "#fff" : "#FFF",
                                    }}
                                >
                                  
                                    <Text style={styles.buttonText}>
                                        SUBMIT
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        

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

});

export default Facereaction;