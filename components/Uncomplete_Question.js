import React, { Component   } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import RadioButtonRN from 'radio-buttons-react-native-expo';
import Checkbox from 'expo-checkbox';
import { customstyles } from "../customstyle";
import { commonPost, commonPostText, getRandomQuestion, getCategories, getQuestionListing, getQuestionsAnswered, getCategoryKeycode } from "../components/functions.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Background from './Background';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as Progress from 'react-native-progress';
import fractionUnicode from 'fraction-unicode';
import * as FileSystem from 'expo-file-system';
import * as Linking from "expo-linking";
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import { withNavigationFocus } from 'react-navigation';

const currImage = require("../assets/Images/new_background.jpg")


class Uncomplete_Question extends Component {

    state = {
        user_submission_id: '',
        offer_id: '',
        DataisLoaded: false,
        Questions: '',
        Question_type: [],
        clicked: false,
        text_input: '',
        radio_btn: '',
        number_text: '',
        api_resp: '',
        image_base64: '',
        selectedCheckboxes: [],
        questionOptions: [],
        image: '',
        numQuestions: 1, 
        numAnswered: 1,
        percentValue: 1,
        listCategories: [],
        dropdownData: [],
        value: '',
        isFocus: false,
        question_status: false,
        label: '',
        ques_id: ''
    }

    componentDidMount() {
        try{
            let userId = this.props.route.params.user_id;
            let offer_id = this.props.route.params.offer_id;
         
            this.setState({ user_submission_id: userId });
            this.setState({ offer_id: offer_id });
            this.getRandomQuestion(userId,offer_id);
        }
        catch(error){
            console.log(error);
        }
        //this.getCategories(userId);
        //this.getAllQuestionCounts(userId);
    }


    // Get Question Listing Api
    getRandomQuestion = (userId,offer_id) => {
        console.log("Testing response")
        this.setState({
            DataisLoaded: false
        })
        console.log("userId"+userId)
        console.log("offer_id"+offer_id)
        let data = {
            offer_id: offer_id,
            user_id: userId,
            api_url: 'getUnanswerQuestion'
        }
        let resp = commonPost(data)
            .then(resp => {
                if(resp.status == 0){
                    this.setState({
                        question_status: true
                    })  
                    try{
                        this.props.navigation.push("MyTabs", {screen: "Offer", params: {user_id: userId,  userDetails: this.props.route.params.userDetails}});
                    }
                    catch(e){
                        console.log("Whoops");
                        console.log(e);
                    }
                }else{
                let result= resp.data;
                console.log(result);
                let options = result[0].question_options;
              
                //console.log(options);
                this.setState({
                    Questions: result,
                    questionOptions: options,
                    DataisLoaded: true,
                    question_status: false,
                })
                this.renderAnsOptions(this.state.questionOptions)
            }
            })
            .catch((error) => {
                console.log("Set Loaded True")
                console.log("Error", error)
            })
    }
    // Close



    // qus Skip Button
     qusSkip = (qus_id) => {
        console.log("ques_id"+qus_id)
        let ques_id = this.state.qus_id;
        let userId = this.state.user_submission_id;
        let is_interested = '0';

        let data = {
            user_id: userId,
            question_id: qus_id,
            is_interested: is_interested,
            api_url: 'getUserAnswer'
        }
        console.log(data)

        this.setState({
            DataisLoaded: false,
        })
        console.log(data)
        var resp = commonPost(data)
            .then(resp => {
                console.log(resp)
                let result = resp;
                let status = result.status;
                let message = result.message;
                if ((status === 1)) {
                    this.setState({
                        DataisLoaded: true,
                        number_text: '',
                        text_input: '',
                        radio_btn: '',
                        selectedCheckboxes: [],
                        image_base64: '',
                    })
                    this.getRandomQuestion(userId,this.state.offer_id); 
                } else {
                    // Something Went Wrong
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // Checkbox Handle
    onChange = id => {
        this.setState({
            is_val_checked: !this.state.is_val_checked,
        });
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

    renderLabel = () => {
        if (this.state.value || this.state.isFocus) {
          return (
            <Text style={{backgroundColor: "transparent", color: "white"}}>
                Options
            </Text>
          );
        }
        return null;
      };
    // Close

    // Submit Answers 
    submitAnswer = (qus_id) => {
        let ques_id = qus_id;
        let userId = this.state.user_submission_id;
        let is_interested = '1';

        let base_64 = this.state.image_base64;
        let final_ans = '';

        if ((base_64)) {
            //console.log('Image');
            final_ans = base_64;
        } else {
            if (this.state.text_input) {
                //console.log('Input');
                final_ans = this.state.text_input;
            } else if (this.state.number_text) {
                //console.log('Number');
                final_ans = this.state.number_text;
            } else if (this.state.radio_btn) {
                //console.log('Radio');
                final_ans = this.state.radio_btn; //Radio button option
            } 
            else if(this.state.label){
                final_ans = this.state.label;
            }
            else if(this.state.selectedCheckboxes.toString()){
                //console.log('Checbox');
                final_ans = this.state.selectedCheckboxes.toString();
            }
            else{
                final_ans = '';
            }
        }

        this.setState({
            label: '',
            radio_btn: '',
            number_text: '',
            text_input: '',
            selectedCheckboxes: [],
            value: ''
        })

        //console.log(final_ans);
        if(final_ans == ''){
            this.qusSkip(qus_id) ;
        }
        else if ((base_64)) {
            this.getDocument(ques_id, userId, is_interested, final_ans);
        } 
        else {
            this.getUserAnswer(ques_id, userId, is_interested, final_ans);
        }
    }
    //   Close

    // Image Picker
    pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(permissionResult, "permissionTrue");
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return
        } else {
            try {
                const res = await DocumentPicker.pickSingle({
                   type: [DocumentPicker.types.allFiles],
                });
                console.log("URI Found");
                  setFilename(res.name)
                  FileSystem.readAsStringAsync(res.uri, {"encoding": 'base64'})
                  .then(res =>{
                        this.setState({
                            image_base64:`data:image/jpg;base64,${res}`
                        });
                  })
              } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                  console.log("error -----", err);
                } else {
                  throw err;
                }
              }
        }

    };
    // Close

    // Submitting Asn
    getUserAnswer = (ques_id, userId, is_interested, final_ans) => {

        let data = {
            user_id: userId,
            question_id: ques_id,
            is_interested: is_interested,
            answer: final_ans,
            api_url: 'getUserAnswer'
        }
        console.log("Curr Data: ", data);
        this.setState({
            DataisLoaded: false,
        });

        var resp = commonPost(data)
            .then(resp => {
                let result = resp.data;
                let message = result.message;
                let status = result.status;
                console.log("Current API Result: ", resp);

                if ((status != 1)) {
                    this.setState({
                        api_resp: message
                    });
                } else {
                    this.setState({
                        api_resp: '',
                    });
                }
                
                setTimeout(() => {
                    this.setState({
                        api_resp: '',
                        text_input: '',
                        number_text: '',
                        selectedCheckboxes: [],
                        radio_btn: '',
                    });
                }, 10);

                setTimeout(() => {
                    this.getRandomQuestion(userId,this.state.offer_id);
                    this.setState({
                        DataisLoaded: true,
                    });
                }, 10);

            })
            .catch((error) => {
                console.log(error)
            })

    }

    renderAnsOptions = (option_list) =>{
        const newData = []
        option_list.map((currOption, j) => {
            newData.push({label: currOption.option, value: j})
        })
        this.setState({
            dropdownData: newData
        })
        return newData;
    }

    getDocument = (ques_id, userId, is_interested, final_ans) => {
        let data = {
            user_id: userId,
            question_id: ques_id,
            is_interested: is_interested,
            document: final_ans,
            api_url: 'getUserAnswer'
        }
        //console.log(data);

        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
            
                console.log(result);
                let status = result.status;
                let message = result.message;

                if ((status != 1)) {
                    this.setState({
                        api_resp: message
                    });
                } else {
                    this.setState({
                        api_resp: ''
                    });
                }

                setTimeout(() => {
                    this.setState({
                        api_resp: '',
                        text_input: '',
                        number_text: '',
                        radio_btn: '',
                        selectedCheckboxes: [],
                        image_base64: '',
                    });
                }, 3000);

                setTimeout(() => {
                    this.getRandomQuestion(userId,this.state.offer_id);
                    this.setState({
                        DataisLoaded: true,
                    });
                }, 2000);
            })
            .catch((error) => {
                console.log(error)
            })

    }
    setFocus = (amount) =>{
        this.setState({isFocus: amount})
    }
    renderDropdown = () => {
        
        return(
            <View style={styles.container}>
                <Dropdown
                style={[styles.dropdown, {borderColor: 'white', borderWidth: 2 }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={{...styles.inputSearchStyle}}
                iconStyle={styles.iconStyle}
                data={this.state.dropdownData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!this.state.isFocus ? 'Select option': ''}
                searchPlaceholder="Search..."
                value={this.state.value}
                onFocus={() => this.setFocus(true)}
                onBlur={() => this.setFocus(false)}
                onChange={(item) => {
                    console.log(item)
                    this.setState({
                        value: item.value,
                        label: item.label,
                        isFocus: false
                    })
                }}
                renderLeftIcon={() => (
                    <AntDesign
                    style={styles.icon}
                    color={this.state.isFocus ? 'white' : 'white'}
                    name="Safety"
                    size={20}
                    />
                )}
                />
            </View>
        )
    }

    render() {

        const { DataisLoaded, items} = this.state;
        if (!DataisLoaded) {
            return <Loader />
        }

      

        return (
            <SafeAreaView style={styles.scrollArea}>
                <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                    <Text style={{...customstyles.titleText, fontSize: 35, color: "white", fontWeight: 'bold', flex: 1, marginLeft: 15}}>Question Store</Text>
                </View>
                <ScrollView style={{...styles.innerView}}>
                    <View style={{...styles.container, justifyContent: "center", alignSelf: "center", width: "100%"}}>
                        <View style={{ ...customstyles.filterContainer, marginBottom: 20, padding: 15, ...customstyles.mt30, backgroundColor: "#662397", opacity: 0.75, borderRadius:20, borderColor: "transparent"}}>
                            {
                                this.state.Questions ?

                                    this.state.Questions.map((item, i) => (
                                        <View key={i} >

                                            <View>
                                                <Text style={{ ...customstyles.h5, ...customstyles.my10, color: "white", fontWeight: "normal"}}>{item.question}</Text>
                                            </View>

                                            {
                                                item.question_mode == '1' ?
                                                <View>
                                                    <TextInput
                                                        placeholder={'Answer'}
                                                        placeholderTextColor={'grey'}
                                                        onChangeText={(text_input) => this.setState({ text_input })}
                                                        style={{ ...customstyles.inputtheme, color: "white", borderColor: "white", borderWidth: 1, borderRadius: 10}}
                                                    />
                                                </View> :
                                                <View />
                                            }

                                            {
                                                item.question_mode == '2' ?

                                                <View>
                                                    {
                                                        this.renderDropdown()
                                                    }

                                                </View> :
                                                <View/>


                                            }

                                            {
                                                item.question_mode == '3' ?
                                                <View>
                                                    {
                                                        this.state.questionOptions.map((checkBoxItem, k) => (
                                                            <View style={{ ...customstyles.checkboxlist, }} key={k}>
                                                                <Checkbox
                                                                    value={!!this.state.selectedCheckboxes.includes(checkBoxItem.id)}
                                                                    onValueChange={() => this.onChange(checkBoxItem.id)}
                                                                    selected={this.state.selectedCheckboxes.includes(checkBoxItem.id)}
                                                                    color={!!this.state.selectedCheckboxes.includes(checkBoxItem.id) ? 'transparent' : undefined}
                                                                    style={{ ...customstyles.mr10, ...customstyles.checkboxhidden }}
                                                                />
                                                                <Text style={{ ...customstyles.checkboxarea }}>
                                                                    {
                                                                        this.state.selectedCheckboxes.includes(checkBoxItem.id) ? <View style={customstyles.checkboxlistsquareselected} ><Ionicons name="checkbox-outline" size={28} color="#663792" /></View> : <View style={customstyles.checkboxlistsquare} ><Ionicons name="square-outline" size={28} color="#663792" /></View>
                                                                    }
                                                                </Text>
                                                                <Text style={{ ...customstyles.checkboxlistText }}>{checkBoxItem.option}</Text>
                                                            </View>
                                                        ))
                                                    }
                                                </View> :
                                                <View/>
                                            }

                                            {
                                                item.question_mode == '4' ?

                                                <View>
                                                    <TouchableOpacity onPress={this.pickImage} style={{ ...customstyles.py15, ...customstyles.bgtheme, ...customstyles.rowverticalcenter, ...customstyles.textCenter, ...customstyles.radius10 }}>

                                                        <Ionicons name="cloud-upload-outline" size={36} color="#fff"></Ionicons>
                                                        <Text style={{ ...customstyles.h5, ...customstyles.textwhite, ...customstyles.ml10 }}>Upload File</Text>
                                                    </TouchableOpacity>
                                                </View> :
                                                <View/>
                                            }

                                            {
                                                item.question_mode == '5' ?
                                                <View>
                                                    <TextInput
                                                        placeholder={'Numeric Value'}
                                                        placeholderTextColor={'grey'}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(number_text) => this.setState({ number_text })}
                                                        style={{ ...customstyles.inputtheme, color: "white", borderColor: "white", borderWidth: 1, borderRadius: 10}}
                                                    />
                                                </View> :
                                                <View/>

                                            }

                                            {
                                                item.question_mode == '6' ?
                                                <View>
                                                    <TextInput
                                                        placeholder={'Answer'}
                                                        onChangeText={(text_input) => this.setState({ text_input })}
                                                        style={{ ...customstyles.inputtheme }}
                                                    />
                                                </View> :
                                                <View/>

                                            }

                                            <View style={{...customstyles.mt10, display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                                                <TouchableOpacity onPress={() => this.submitAnswer(item.id)} style={{...customstyles.px30, backgroundColor: "white", borderRadius: 16}}>
                                                    <Text style={{...customstyles.btnThemesmall, backgroundColor: "white", color: "#662397"}}>SUBMIT</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.qusSkip(item.id)} style={{...customstyles.px30, backgroundColor: "#662397", borderColor: "white", borderWidth: 1, borderRadius: 16}}>
                                                    <Text style={{...customstyles.btnThemesmall, backgroundColor: "#662397"}}>SKIP</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                    : 'No Data'
                            }
                        </View>
                        <View style={{...customstyles.mb10}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        question_status: true,
                                        DataisLoaded: true,
                                    }) 
                                    this.props.navigation.push("MyTabs", {screen: "Offer", params: {user_id: this.props.route.params.user_id,  userDetails: this.props.route.params.userDetails}})
                                    }   
                                } style={{backgroundColor: "#aaa", borderRadius: 16}}>
                                <Text style={{padding: 10, textAlign: "center", color: "white", fontSize: 20}}>EXIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >
        );
    }
}


const styles = StyleSheet.create({

    scrollArea: {
        flex: 1,
        width: "100%",
        backgroundColor: "#20004A"
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 15,
    },
    container: {
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#ecf0f1',
        marginBottom: 30,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        shadowColor: 'red',
        shadowOffset: { width: 10, height: 2 },
        shadowOpacity: .5,
        shadowRadius: 7,
        borderColor: "#eee",
        borderWidth: 2,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
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
        color: "white",
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
      },

});
export default Uncomplete_Question;