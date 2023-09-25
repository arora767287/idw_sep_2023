import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, ToastAndroid, ActivityIndicator, TouchableOpacity } from 'react-native';
import Loader from './Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
import { LoginAPI } from './functions';
import { Ionicons } from '@expo/vector-icons';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

class Forgot extends Component {
    state = {
        username: '',
        api_resp: '',
        isLoading: false,
        api_color: '',
        username_err: '',
    }
    validateInput() {
        const { username } = this.state;
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        let isValid = true;

        if ((username == '')) {
            this.setState({
                username_err: 'Email is required'
            });
            setTimeout(() => {
                this.setState({
                    username_err: '',
                });
            }, 2000);
            return;
            isValid = false;
        } else {
            this.setState({
                username_err: ''
            })
        }

        if (pattern.test(username) === false) {
            this.setState({
                username_err: 'Email is not valid'
            });
            setTimeout(() => {
                this.setState({
                    username_err: '',
                });
            }, 2000);
            isValid = false;
            return;
        } else {
            this.setState({
                username_err: ''
            })
        }

        if (isValid) {
            this.forgot();
        }
    }

    forgot = () => {

        let data = {
            email: this.state.username,
            api_url: 'forgotPassword'
        }

        var response = LoginAPI(data)
            .then(res => {
                console.log(res);
                let message = res.message;
                let status = res.status;

                this.setState({
                    isLoading: true,
                })


                if ((status == 1)) {
                    //Alert.alert(message);
                    setTimeout(() => {
                        this.setState({
                            api_resp: message,
                            isLoading: false,
                            api_color: customstyles.alertPrimary
                        })
                    }, 2000);
                    setTimeout(() => {
                        this.setState({
                            api_resp: '',
                            api_color: ''
                        });
                    }, 7000);
                    setTimeout(() => {
                        this.props.navigation.navigate('LoginScreen');
                    }, 8000);
                } else {
                    //Alert.alert(message);
                    setTimeout(() => {
                        this.setState({
                            api_resp: message,
                            isLoading: false,
                            api_color: customstyles.alertdanger
                        })
                    }, 2000);
                    setTimeout(() => {
                        this.setState({
                            api_resp: '',
                            api_color: ''
                        })
                    }, 7000);
                }
                console.log("API RESP: ", this.state.api_resp);
                console.log(this.state.api_resp.length);
            })
    }

    loginNavigation = (user_id) => {
        this.props.navigation.navigate('LoginScreen');
    }

    render() {
        return (
            <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} start={{ x: 0, y: .5 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}
            >
                <View style={customstyles.logincontainer}>
                    {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[customstyles.btnWhitecircle, { width: 36, height: 36, marginBottom: 30 }]}>
                        <Ionicons name="md-chevron-back-outline" size={24} color="#663792" />
                    </TouchableOpacity> */}
                    <View style={{ paddingVertical: 20 }}>
                        <Text style={customstyles.headingWhite}>Forgot Password</Text>
                    </View>

                    {
                        this.state.api_resp.length > 0 &&
                        <Text style={this.state.api_color}>{this.state.api_resp}</Text>
                    }

                    <TextInput
                        value={this.state.username}
                        onChangeText={(username) => this.setState({ username })}
                        placeholder={'Enter Email'}
                        autoCapitalize={'none'}
                        style={customstyles.input}
                        placeholderTextColor="#fff"
                    />
                    {
                        this.state.username_err.length > 0 &&
                        <Text style={customstyles.alertdanger}>{this.state.username_err}</Text>
                    }
                    <TouchableOpacity onPress={this.validateInput.bind(this)}>
                        <View
                            style={{
                                ...styles.button, ...customstyles.shadowBlock, backgroundColor: this.state.isLoading ? "#fff" : "#FFF",
                            }}
                        >
                            <Text style={styles.buttonText}>
                                {this.state.isLoading ? "LOGGING IN..." : "SUBMIT"}
                            </Text>
                            {this.state.isLoading && <Loader />}
                        </View>
                    </TouchableOpacity>

                    <View style={{ ...customstyles.rowverticalcenter, ...customstyles.mt10 }}>
                        <Text style={customstyles.labelwhite}>Already have an account  </Text>
                        <Text>
                            <TouchableOpacity onPress={this.loginNavigation}>
                                <Text style={{ ...customstyles.labelwhite, ...customstyles.underline }}>Login Here</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>

                </View>
            </LinearGradient >
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
        paddingVertical: 30,
        paddingHorizontal: 20
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

export default Forgot;