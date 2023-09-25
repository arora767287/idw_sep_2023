import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LoginAPI, commonPost } from './functions';
import Loader from './Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            username_err: '',
            password_err: '',
            api_resp: '',
            isLoading: false,
            listDocs: []
        };
    }

    async getDocs(userId, folderId){
        let data = {
            user_id: userId,
            folder_id: folderId,
            api_url: 'getFileList'
        }
        try{
            const result = await commonPost(data)
            if ((result.status != 0)) {
                console.log("DocumentsNewStatus", result);
                for(let i = 0; i<result.data.length; i++){
                    var currDoc = result.data[i]
                    var currList = this.state.listDocs
                    currList.push(currDoc)
                    this.setState({listDocs: currList})
                    console.log("Current New ID", folderId)
                    console.log(currList)
                }

            }
        }
        catch(error){
            throw error;
        }
    }

    getFolders(user_id){
        console.log("Running Folders")
        let data = {
            id: user_id,
            api_url: 'getFolderName'
        }
        console.log("This User ID: ", user_id)
        const newResponse = commonPost(data)
        .then(resp => {
            console.log("resp.data current");
            console.log(resp);
            if(resp.data != null){
                for(let i = 0; i< resp.data.length; i++){
                    var currId = resp.data[i].id;
                    console.log("Calling Docs")
                    this.getDocs(user_id, currId);
                }
            }
        }).catch((error) => {
            throw error;
        })
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
             console.log("Response Data: ", resp);
             Alert.alert(
                'Reactivated Account',
                'Your account has been reactivated, logging you in!',
                [
                    { text: 'OK', onPress: () => this.onLogin() },
                ]
            );
        }).catch((error) => {
            Alert.alert(
                'Unable to reactivate account',
                'Your account cannot be reactivated at this time. Contact us or try again later.',
                [
                    { text: 'OK', onPress: () => {} },
                ]
            );
        })
    }

    movePage(userDetails) {
        AsyncStorage.setItem('userInfo', JSON.stringify(userDetails));
        console.log("Curr User ID: ", userDetails.id);
        this.getFolders(userDetails.id);
        setTimeout(() => {
            var jsonForm = {"listDocs": this.state.listDocs };
            AsyncStorage.setItem('allDocs', JSON.stringify(jsonForm));
        }, 1000)
        this.props.navigation.push('MyTabs', { userData: userDetails, user_id: userDetails.id });
        this.setState({
            email: '',
            password: '',
            api_resp: '',
            isLoading: false,
        })
    }


    validateInput() {
        const { email, password } = this.state;
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        let isValid = true;
        //Alert.alert('Credentials', `${username} + ${password}`);
        console.log(password.length);
        if ((email == '')) {
            this.setState({
                username_err: 'Email is required'
            })
            isValid = false;
            return;
        } else {
            this.setState({
                username_err: ''
            })
        }

        if (pattern.test(email) === false) {
            this.setState({
                username_err: 'Email is not valid'
            })
            isValid = false;
            return;
        } else {
            this.setState({
                username_err: ''
            })
        }

        if ((password == '')) {
            this.setState({
                password_err: 'Password is required'
            })
            isValid = false;
            return;
        } else {
            this.setState({
                password_err: ''
            })
        }
        if ((password.length < '6')) {
            this.setState({
                password_err: 'The password must be at least 6 characters.'
            })
            isValid = false;
            return;
        } else {
            this.setState({
                password_err: ''
            })
        }

        if (isValid) {
            //console.log('Login Logic');
            this.onLogin();
        }
    }
    onLogin() {
        let data = {
            email: this.state.email,
            password: this.state.password,
            api_url: 'login'
        }
        this.setState({
            isLoading: true,
        })
        console.log(data);
        var response = LoginAPI(data)
            .then(res => {
                console.log(res);
                AsyncStorage.setItem('userInfo', JSON.stringify(userDetails));
                let message = res.message;
                let status = res.status;
                let userDetails = res.user;
                console.log("User STATUS: ", status);

                if ((status == 1)) {
                    this.movePage(userDetails);
                } else if ((status == 2)) {
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
                            { text: 'OK', onPress: () => this.reactivateAccount(userDetails.id) },
                        ]
                    );
                } else if ((status == 3)) {
                    Alert.alert(
                        'Blocked Account',
                        'Your account has been blocked. Please contact identity.wallet.atlanta@gmail.com, or visit our website for our customer support number. ',
                    );
                }
                else {
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
            .catch((error) => 
                console.log(error)
            );
    }

    onMoveFaceScan = () => {
        this.props.navigation.navigate('Facereaction')
    }
    onMoveForgot = () => {
        this.props.navigation.navigate('Forgot')
    }
    signupNavigation = (user_id) => {
        this.props.navigation.navigate('Signup');
    }

    render() {
        return (
            <LinearGradient colors={['#20004A', '#20004A', '#20004A']} start={{ x: 0, y: .8 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                <View style={customstyles.logincontainer}>
                    {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[customstyles.btnWhitecircle, { width: 36, height: 36, marginBottom: 30 }]}>
                        <Ionicons name="md-chevron-back-outline" size={24} color="#663792" />
                    </TouchableOpacity> */}

                    <View style={{ paddingVertical: 20 }}>
                        <Text style={customstyles.headingWhite}>Login</Text>
                    </View>
                    {
                        this.state.api_resp.length > 0 &&
                        <Text style={customstyles.alertdanger}>{this.state.api_resp}</Text>
                    }
                    <TextInput
                        autoCapitalize="none"
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        placeholder={'Email'}
                        style={customstyles.input}
                        placeholderTextColor="#fff"
                    />
                    {
                        this.state.username_err.length > 0 &&
                        <Text style={customstyles.alertdanger}>{this.state.username_err}</Text>
                    }

                    <TextInput
                        autoCapitalize="none"
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        style={customstyles.input}
                        placeholderTextColor="#fff"
                    />
                    {
                        this.state.password_err.length > 0 &&
                        <Text style={customstyles.alertdanger}>{this.state.password_err}</Text>
                    }
                   <View style={{ ...customstyles.verticalrowcenter, ...customstyles.mt10,paddingRight:5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        {/*<TouchableOpacity onPress={this.onMoveFaceScan}>
                            <Text style={{...customstyles.labelwhite,...customstyles.underline}}>Login with Face ID </Text>
                </TouchableOpacity>*/}
                        <TouchableOpacity onPress={this.onMoveForgot} style={{justifyContent: "flex-end"}}>
                            <Text style={{ ...customstyles.labelwhite, ...customstyles.underline }}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={this.validateInput.bind(this)}>
                        <View
                            style={{ ...styles.button, ...customstyles.shadowBlock, backgroundColor: this.state.isLoading ? "#fff" : "#FFF", }}
                        >
                            <Text style={styles.buttonText}>
                                {this.state.isLoading ? "LOGGING IN..." : "LOGIN"}
                            </Text>
                            {this.state.isLoading && <Loader />}
                          
                        </View>
                    </TouchableOpacity>

                    <View style={{ ...customstyles.rowverticalcenter, ...customstyles.mt10 }}>
                        <Text style={customstyles.labelwhite}>Don't have an account? </Text>
                        <TouchableOpacity onPress={this.signupNavigation}>
                            <Text style={{ ...customstyles.labelwhite, ...customstyles.underline }}>Create Account</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: "center",
    },
    linearGradient: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        padding: 30,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
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
});

export default LoginScreen;