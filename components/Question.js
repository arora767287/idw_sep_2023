import React, { Component, useEffect   } from 'react';
import { Alert, Linking, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image, Pressable, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import RadioButtonRN from 'radio-buttons-react-native-expo';
import Checkbox from 'expo-checkbox';
import { customstyles } from "../customstyle";
import { commonPost, commonFilePost, getRandomQuestion, getCategories, getQuestionListing, getQuestionsAnswered, getCategoryKeycode, uploaddoc} from "../components/functions.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Background from './Background';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as Progress from 'react-native-progress';
import fractionUnicode from 'fraction-unicode';
import DocumentPicker from "react-native-document-picker";
import * as FileSystem from 'expo-file-system';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';



const currImage = require("../assets/Images/new_background.jpg")
const windowHeight = Dimensions.get('window').height;

/*
const [value, setValue] = React.useState(g;
const [isFocus, setIsFocus] = React.useState(false);
*/

class Question extends Component {
    state = {
        user_submission_id: '',
        DataisLoaded: false,
        Questions: [],
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
        percentValue: 0,
        listCategories: [],
        dropdownData: [],
        value: '',
        isFocus: false,
        label: '',
        changedQuestion: false,
        prevTime: '',
        curTime: '',
        deltaTime: '',
        secondQuestion: '',
        secondQuestionOptions: [],
        linkAccounts: [],
        userInfo: '',
        viewingInfo: false,
        base64image: '',
        otherAns: "",
        stage: "", //plaidState
        state: "", 
        connect: "",
        disconnect: ""
    }


    componentDidMount() {
        try{
            if(this.props.route.params != undefined){
                this.setState({ user_submission_id: this.props.route.params.user_id });
                this.setState({
                  DataisLoaded: false
                })
                this.getRandomQuestion2(this.props.route.params.user_id);
                this.getIndQuestionInfo(this.props.route.params.user_id);
            } else {
                //console.log("UNDEFINED!");
                this.setState({
                    DataisLoaded: true
                })
                this.getRandomQuestion2(this.state.user_submission_id);
                this.getIndQuestionInfo(this.state.user_submission_id);
            }
            const value = AsyncStorage.getItem('userInfo')
            .then((value) => {
                let userData = JSON.parse(value);
                this.setState({userInfo: userData});
            }).catch((error) => {
                //console.log("This error: ", error);
                throw error;
            })
            //var curr_id = this.props.route.params.user_id
            //const [state] = usePlaidLinkState(`${curr_id}`);
        }
        catch(error){
            //console.log(error);
            throw error;
        }
    }

    //client_user_id = 'unique-user-id'; // defined inside the class

    async pickImage(item) {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //(permissionResult, "permissionTrue");
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required! Please go to the Settings app and modify your permissions for the Identity Wallet app to enable access to Photos.");
            return;
        } else {
            try {
                const res = await DocumentPicker.pickSingle({
                   type: [DocumentPicker.types.allFiles],
                });
                //("URI Foun"d");
                console.log("Image Found: ", res);
                setTimeout(() => {
                    this.setState({
                        base64image: res
                    })
                    this.submitDocument(item)
                }, 1000);
              } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                  //("error -----", err);
                } else {
                  throw err;
                }
              }
        }

    };

    /*
        let user_id = this.state.user_submission_id;
        let doc_title = `${item.name}Upload`;
        let folder_id = 8;
        let data = {
            user_id: this.state.user_submission_id,
            folder_id: folder_id,
            doc_cat_id: item.doc_cat,
            api_url: 'checkCategory'
        }
        ////(data);
        var resp = commonFilePost(data)
            .then(resp => {
    */

    submitDocument(item) {
        var user_id = this.state.user_submission_id;
        var doc_title = `${item.name}Upload`;
        var folder_id = 8;
        var formData = new FormData();
        console.log("Base64: ", this.state.base64image)
        var currDoc = {
            uri:this.state.base64image.uri,
            type:this.state.base64image.type,
            name:this.state.base64image.name
        };
        var base_64 = this.state.base64image;
        var currName = base_64.name;
        currName = currName.replace(/ /g,"_");
        console.log("Curr Final name", currName)
        base_64.name = currName;
        setTimeout(() => {
                this.setState({
                base64image: base_64
            })
        }, 10);

        formData.append('document', currDoc);
        formData.append('user_id',user_id);
        formData.append('folder_id',folder_id);
        formData.append('doc_title',doc_title);
        formData.append('filename',base_64.name);
        formData.append('doc_cat_id',item.doc_cat);
        formData.append('catstatus',1);
        console.log("Curr FileName", this.state.base64image.name);
        //setDataisLoaded(false);
        var resp = uploaddoc(formData)
        .then(resp => {
            let result = resp;
            console.log("Current Response: ", resp);
            let status = resp.status;
            let message = result.message;
            console.log("Result status", status);
            Alert.alert(
                `Congratulations!`,
                `Your ${item.name} data has been successfully uploaded. You can update it here or on the Info Store whenever you like. We will soon make this completely automated!`,
                [
                    {text: "Cancel", onPress: () => {} },
                    {text: "OK", onPress: () => {}},
                ]
            );
        })
        .catch((error) => {
            console.log("Current Error: ", error);
            throw error;
        })
    }




    onMoveCategory = () => {
        //console.log("Clicked");
        this.props.navigation.navigate("Category", {userDetails: this.state.userInfo, fromPlace: "offers"});
    }

    getIndQuestionInfo = (user_id) => {
        
        try{
            let listQuestions = [];
            var categoryInfo = [];
            let resp = getQuestionListing(user_id)
              .then(resp => {
                  console.log("Curr Question Output: ", resp);
                  let result = resp.data;
                  listQuestions = result;
                  console.log("all qs", listQuestions.length);
                  let categories = [];
                  let newResp = getCategoryKeycode()
                    .then(newResp => {
                      let result = newResp.data;
                      categories = result
                      console.log("Categories ", categories);
                      let listGetAnswers = [];
                      let finalResp = getQuestionsAnswered(user_id)
                      .then(finalResp => {
                        console.log("listAllAnswers: ", finalResp.data)
                        let result = finalResp.data;
                        listGetAnswers = result
                        var listAnswered = [];
                        console.log("Finale")
                        for(let i = 0; i < listGetAnswers.length; i++){
                          listAnswered.push(listGetAnswers[i].questionbank_id);
                        }
                        var categoryNames = [];
                        for(let i = 0; i<categories.length; i++){
                          if(!categoryNames.includes(categories[i].category_name)){
                            categoryNames.push(categories[i].category_name)
                            categoryInfo.push({"category_name" : categories[i].category_name, "category_id": categories[i].category_id, "countAnswered": 0, "countTotal": 0, "fraction": 1});
                          }
                        }
                        categoryInfo.push({"category_name": "Total", "category_id": 0, "countAnswered": 0, "countTotal": 0, "fraction": 1})
                        console.log("Full List Questions: ", listQuestions);
                        for(let i = 0; i<listQuestions.length; i++){
                          var currQuestion = listQuestions[i].id
                          var answered = listAnswered.includes(currQuestion);
                          var currKeycode = listQuestions[i].keycode_id;
                          //Search through categories to find which category question keycode belongs to
                          var categoryID;
                          for(let j = 0; j < categories.length; j++){
                            if(currKeycode == categories[j].keycode_id){
                              categoryID = categories[j].category_id;
                            }
                          }
                          ////console.log("Category ID " + categoryID);
                          if(categoryID != null && answered){
                            categoryInfo[categoryID - 1].countAnswered += 1;
                            categoryInfo[categoryID - 1].countTotal += 1;
                          }
                          else if(categoryID != null && !answered){
                            categoryInfo[categoryID - 1].countTotal += 1;
                          }
                        }
                        for(let i = 0; i<categoryInfo.length; i++){
                            //console.log("FractionCount:", categoryInfo[i].fraction)
                            if(categoryInfo[i].countTotal == 0){
                                categoryInfo[i].fraction = 0;
                            }
                            else{
                                categoryInfo[i].fraction = categoryInfo[i].countAnswered/categoryInfo[i].countTotal;
                            }
                          //console.log("CategoryCount:", categoryInfo[i].countAnswered);
                          //console.log("CategoryTotal:", categoryInfo[i].countTotal);
                          //console.log("FractionCount:", categoryInfo[i].fraction);
                        }
                        for(let i = 0; i<categoryInfo.length - 1; i++){
                            categoryInfo[categoryInfo.length - 1].countAnswered += categoryInfo[i].countAnswered;
                            categoryInfo[categoryInfo.length - 1].countTotal += categoryInfo[i].countTotal;
                        }
                        categoryInfo[categoryInfo.length - 1].fraction = categoryInfo[categoryInfo.length - 1].countAnswered/categoryInfo[categoryInfo.length - 1].countTotal;
                        result = categoryInfo;
                        var finalArray = []
                        //console.log(categoryInfo);
                        for(let i = 0; i< result.length - 1; i++){
                            finalArray.push(result[i])
                        }
                        let oldPercentValue = this.state.percentValue;
                        if(oldPercentValue == this.state.percentValue){
                            this.setState({changedQuestion: false});
                        } else {
                            this.setState({changedQuestion: true});
                        }
                        var google_logo = require("../assets/Images/google_logo.png")
                        var instagram_logo =  require("../assets/Images/instagram_logo.png")
                        var uber_logo = require("../assets/Images/uber_logo.png")
                        var linkedin_logo =  require("../assets/Images/linkedin_logo.png")
                        var tiktok_logo = require("../assets/Images/tiktok_logo.png")
                        var spotify_logo = require("../assets/Images/spotify_logo.png")
                        var youtube_logo = require("../assets/Images/youtube_logo.png")
                        var snapchat_logo = require("../assets/Images/snapchat_logo.png")
                        var facebook_logo = require("../assets/Images/facebook_logo.png")
                        //console.log("Result:", result);
                        this.setState({
                            google_logo: require("../assets/Images/google_logo.png"),
                            instagram_logo: require("../assets/Images/instagram_logo.png"),
                            uber_logo: require("../assets/Images/uber_logo.png"),
                            linkedin_logo: require("../assets/Images/linkedin_logo.png"),
                            tiktok_logo: require("../assets/Images/tiktok_logo.png"),
                            facebook_logo: require("../assets/Images/facebook_logo.png"),
                            youtube_logo: require("../assets/Images/youtube_logo.png"),
                            spotify_logo: require("../assets/Images/spotify_logo.png"),
                            snapchat_logo: require("../assets/Images/snapchat_logo.png")
                        })
                        this.setState({
                            listCategories: finalArray,
                            numQuestions: result[result.length - 1].countTotal,
                            numAnswered: result[result.length - 1].countAnswered,
                            percentValue: result[result.length - 1].countAnswered/result[result.length - 1].countTotal,
                            DataisLoaded: true,
                            user_submission_id: user_id,
                            linkAccounts: [
                                {"name": "Google", "desc": "Link data from your Google Services to Identity Wallet", "inst": "1. Login to Google after clicking 'Let's Go!' below \n 2. Click `CREATE NEW EXPORT` \n 3. Then, wait until you obtain an export in your email, and upload it below!","mode": 1, "img": this.state.google_logo, "doc_cat": 41, "url": "https://takeout.google.com/settings/takeout"},
                                {"name": "Instagram", "desc": "Link data from your Instagram account to Identity Wallet", "inst": "1. Login to Instagram after clicking 'Let's Go!' below \n 2. Select `JSON` \n 3. Proceed to request the download \n 4. You'll receive it in your email, after which you can upload it here. ", "mode": 2, "url": "https://www.instagram.com/download/request", "img": this.state.instagram_logo, "doc_cat": 42},
                                {"name": "Uber", "desc" : "Link data from your Uber account to Identity Wallet", "inst": "1. Login to Uber after clicking 'Let's Go!' below \n 2. Click `Request Your Data` \n 3. Upload the file you receive in your email below: ", "mode" : 2, "url": "https://auth.uber.com/v2/?breeze_local_zone=phx2&next_url=https%3A%2F%2Fmyprivacy.uber.com%2Fprivacy%2Fexploreyourdata%2Fdownload&state=BgTKjZe7EuE5yexqVzW1VJYVEaTlIBavZHhw6YNqY-k%3D", "img": this.state.uber_logo, "doc_cat": 43},
                                {"name": "LinkedIn", "desc" : "Link data from your LinkedIn account to Identity Wallet", "inst" : "1. Login to LinkedIn after clicking 'Let's Go!' below \n 2. Click `Download Larger Data Archive` \n 3. `Request Archive` and upload the file you receive after 24 hours in your email below: ", "mode" : 2, "url": "https://www.linkedin.com/mypreferences/d/download-my-data", "img": this.state.linkedin_logo, "doc_cat": 44},
                                {"name": "Snapchat", "desc": "Link data from your Snapchat account to Identity Wallet", mode: 2, url: "https://accounts.snapchat.com/accounts/v2/login?continue=%2Faccounts%2Freauthenticate%3Fcontinue%3Dhttps%253A%252F%252Faccounts.snapchat.com%252Faccounts%252Fdownloadmydata", "img": this.state.snapchat_logo, "doc_cat": 44},
                                {"name": "YouTube", "desc": "Link data from your YouTube account to Identity Wallet", mode: 2, url: "https://myaccount.google.com/dashboard?continue=https://myaccount.google.com/b/109672717102334862473/data-and-privacy?hl%3Den", "img": this.state.youtube_logo, "doc_cat": 44},
                                {"name": "Facebook", "desc": "Link data from your Facebook account to Identity Wallet", mode: 2, url: "https://www.facebook.com/login.php?next=https%3A%2F%2Fwww.facebook.com%2Fdyi", "img":  this.state.facebook_logo, "doc_cat": 44},
                                {"name": "TikTok", "desc": "Link data from your TikTok account to Identity Wallet", mode: 2, url: "https://www.tiktok.com/setting/download-your-data", "img":  this.state.tiktok_logo, "doc_cat": 44},
                                {"name": "Spotify", "desc": "Link data from your Spotify account to Identity Wallet", mode: 2, url: "https://www.spotify.com/us/account/privacy/?_ga=2.123532045.767375598.1587744503-485410661.1587744503&flow_ctx=58e72db3-84bb-4c25-8c66-e5e41d262eeb%3A1694587686", "img": this.state.spotify_logo, "doc_cat": 44}
                            ]
                        });
                        //console.log("linkAccounts: ", this.state.linkAccounts.length);
                      }).catch((error) => {
                        console.log("New Error: ", error);
                        throw error;
                      })
                    }).catch((error) => {
                        console.log("New Other Error: ", error);
                        throw error;
                    })
                  }).catch((error) => {
                    console.log("New Final Error: ", error);
                    throw error;
                  })
                  return resp;
          }
          catch(error){
            console.log(error.stack);
            throw error;
          }
    }



    getCategories = (userId) => {
        let resp = getCategories(userId)
        .then(resp => {
            let result = resp.data;
            this.setState({
                listCategories: result,

            })
        })
        .catch((error) => {
            console.log("Category Error", error);
            throw error;
        })
    }
    getRandomQuestion2 = (userId) => {
        if(this.state.Questions == '' && this.state.secondQuestion == ''){
            let resp = getRandomQuestion(userId)
            .then(resp => {
                //console.log("UserQuestion: ", userId);
                //console.log("QuestionResp: ", resp);
                let result = resp.data;
                let options = result[0].question_options;
                //console.log(result);
                setTimeout(() => {
                    this.setState({
                        DataisLoaded: false,
                        Questions: result,
                        questionOptions: options
                    })
                }, 10);
                this.renderAnsOptions(options)
                this.getIndQuestionInfo(this.state.user_submission_id);
            })
            .catch((error) => {
                Alert.alert(
                    'Unable to load questions right now',
                    'We\'re working on fixing the issue. Try again later to see the Question Store at its best!',
                    [
                        { text: 'OK', onPress: () => {} },
                    ]
                );
                //this.componentDidMount();
                console.log("Get Questions Error: ", error);
                throw error;
            })
            let secondResp = getRandomQuestion(userId)
            .then((otherResp) => {
                let result = otherResp.data;
                let options = result[0].question_options;
                setTimeout(() => {
                    this.setState({
                        DataisLoaded: false,
                        secondQuestion: result,
                        secondQuestionOptions: options
                    })
                }, 10);
            }).catch((error) => {
                console.log("Other Question Error: ", error);
                throw error;
            })
        } else {
            //setTimeout(() => {
            this.setState({
                DataisLoaded: false,
                Questions: this.state.secondQuestion,
                questionOptions: this.state.secondQuestionOptions
            })
            //s}, 2000)
            this.renderAnsOptions(this.state.secondQuestionOptions);
            let secondResp = getRandomQuestion(userId)
            .then((otherResp) => {
                let result = otherResp.data;
                let options = result[0].question_options;
                //console.log(result);
                setTimeout(() => {
                    this.setState({
                        DataisLoaded: true,
                        secondQuestion: result,
                        secondQuestionOptions: options
                    })
                }, 10);
                //this.getIndQuestionInfo(this.state.user_submission_id);
            }).catch((error) => {
                console.log("Question Issue Error", error);
                throw error;
            })
        }
    }
    startQuiz = () => {
        this.setState({
            clicked: true
        })
    }
    qusSkip = (qus_id) => {
        let ques_id = qus_id;
        let userId = this.state.user_submission_id;
        this.getUserAnswer(ques_id, userId, '0', null);
    }
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
    submitAnswer = (qus_id, qus_mode, other_ans) => {
        let ques_id = qus_id;
        let userId = this.state.user_submission_id;
        let is_interested = '1';
        let ques_mode = qus_mode;
        let base_64 = this.state.image_base64;
        let final_ans = '';

        if ((base_64)) {
            ////console.log('Image');
            final_ans = base_64;
        } else {
            if (this.state.text_input) {
                ////console.log('Input');
                final_ans = this.state.text_input;
            } else if (this.state.number_text) {
                ////console.log('Number');
                final_ans = this.state.number_text;
            } else if (this.state.radio_btn) {
                ////console.log('Radio');
                final_ans = this.state.radio_btn; //Radio button option
                other_ans = this.state.otherAns
            } 
            else if(this.state.label){
                final_ans = this.state.label;
            }
            else if(this.state.selectedCheckboxes.toString()){
                ////console.log('Checbox');
                final_ans = this.state.selectedCheckboxes.toString();
                other_ans = this.state.otherAns;
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

        ////console.log(final_ans);
        if(final_ans == '' && other_ans == ''){
            this.qusSkip(qus_id);
        }
        else if ((base_64)) {
            this.getDocument(ques_id, userId, is_interested, final_ans);
        } 
        else {
            this.getUserAnswer(ques_id, userId, is_interested, final_ans, other_ans);
        }
    }
    //   Close

    // Image Picker
    /**
     * 
     * let pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        } else {
            try {
                const res = await DocumentPicker.pickSingle({
                   type: [DocumentPicker.types.allFiles],
                });
                console.log("URI Found");
                  setFilename(res.name)
                  FileSystem.readAsStringAsync(res.uri, {"encoding": 'base64'})
                  .then(res =>{
                  setbase64image(`data:image/jpg;base64,${res}`)
                  });
              } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                  console.log("error -----", err);
                } else {
                  throw err;
                }
              }
        }

    };
     */
    // Close

    newFunction = async () => {
        this.setState({
            DataisLoaded: false
        });  
        this.getIndQuestionInfo(this.state.user_submission_id).then((resp) => {
            this.setState({
                clicked: false,
            }).then(() => {
                this.setState({
                    DataisLoaded: true
                })
            }).catch((error) => {
                console.log("Random New Function error: ", error);
                throw error;
            })
        }).catch((error) => {
            throw error;
        })
        console.log("Percent: ", this.state.percentValue);
    }

    // Submitting Asn
    getUserAnswer = (ques_id, userId, is_interested, final_ans, other_ans) => {

        let data = {
            user_id: userId,
            question_id: ques_id,
            is_interested: is_interested,
            answer: final_ans,
            other_option_answer: other_ans, 
            api_url: 'getUserAnswer'
        }
        this.setState({
            DataisLoaded: false,
        });
        //console.log("Data Submitted: ", data);
        var resp = commonPost(data)
            .then(resp => {
                let result = resp.data;
                let status = result.status;
                //console.log("Question output: " + result);

                if ((status != 1)) {
                    let message = result.message;
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
                        otherAns: "",
                         radio_btn: ''
                    });
                }, 10);

                setTimeout(() => {
                    this.getRandomQuestion2(userId);
                }, 10);

            })
            .catch((error) => {
                console.log("Submission Error: ", error);
                throw error;
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
        this.setState({
            DataisLoaded: false,
        })
        //console.log("Options Rendered: ", newData);
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
        ////console.log(data);

        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                //console.log(result);
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
                }, 10);

                setTimeout(() => {
                    this.getRandomQuestion2(userId);
                    this.setState({
                        DataisLoaded: false,
                    });
                }, 10);
            })
            .catch((error) => {
                console.log("Final Submit Error: ", error);
                throw error;
            })

    }
    setFocus = (amount) =>{
        this.setState({isFocus: amount})
    }
    uploadInfo = (item) => {

        Alert.alert(
            `Instructions to download your ${item.name} data`,
            `${item.inst}`,
            [
                {text: "Log in to " + item.name , onPress: () => {Linking.openURL(`${item.url}`)}},
                {text: 'Upload Now (I have my data)', onPress: () => {this.pickImage(item)} },
                {text: "Cancel", onPress: () => {} }
            ]
        );
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
                    //console.log(item)
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
    /*
    renderLabel = () => {
        if (value || isFocus) {
          return (
            <Text style={[styles.label, isFocus && { color: 'blue' }]}>
              Options
            </Text>
          );
        }
        return null;
      };
    */
    // Close

    render() {

        const { DataisLoaded, items} = this.state;
        if (!DataisLoaded) {
            return <Loader />;
        }

        if (!this.state.clicked) {

            return (

                <SafeAreaView style={{backgroundColor: "white"}}>
                    <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                        <Text style={{...customstyles.titleText, fontSize: 35, color: "#20004A", fontWeight: 'bold', flex: 1, marginLeft: 15}}>Question Store</Text>
                    </View>
                    <ScrollView style={{...styles.innerView, borderRadius: 10}}>
                        <View style={{...styles.container, justifyContent: "space-around", paddingBottom: windowHeight*0.15}}>

                            <View style={{ ...customstyles.filterContainer, marginBottom: 20, padding: 15, ...customstyles.mt30, ...customstyles.filterContainerOutline, flexDirection: "column"}}>
                                <Text style={{ ...customstyles.textCenter, fontSize: 15, color: "#20004A"}}>Answer questions about your identity to make more data available for offers in the marketplace!</Text>

                                <TouchableOpacity onPress={this.startQuiz}
                                    style={{ ...customstyles.px30, ...customstyles.my20 }}>
                                    <Text style={{...customstyles.btnThemexs, color: "#20004A", borderColor: "#20004A"}}>START</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", justifyContent: "space-around", ...customstyles.filterContainerOutline}}>
                                <Text style={{color: "#662397", fontSize: 20, paddingLeft: 15, padding: 5, fontWeight: "bold", color: "#20004A"}}>Data Progress</Text>
                                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                                    <View style={{ backgroundColor: "transparent", padding: 5, borderRadius:20, borderColor: "transparent", width: "48%", justifyContent: "space-around"}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                            <View style={{display: "flex", flexDirection: "column"}}>
                                                <View style={{padding: 5, flexDirection: "column", justifyContent: "center", alignSelf: "center", borderWidth: 2, alignItems: "center", width: 100, height: 100, ...customstyles.filterContainerOutline, borderRadius: 16}}>
                                                    <Text style={{fontSize: 35, justifyContent: "center", alignSelf: "center", fontWeight: "bold", alignSelf: "center", color: "#20004A"}}>{this.state.numAnswered}</Text>
                                                    {/*<Text style={{fontSize: 10, justifyContent: "center", alignSelf: "center", flex: 0.25, textAlign: "center"}}>of</Text>
                                                    <Text style={{fontSize: 15, justifyContent: "center", alignSelf: "center", flex: 0.375, fontWeight: "bold"}}>50</Text>*/}
                                                </View>
                                                <Text style={{color: "#662397", fontSize: 15, marginTop: 10, color: "#20004A"}}>Questions Answered</Text>
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <View style={{ backgroundColor: "transparent", padding: 15, backgroundColor: "transparent", opacity: 0.75, borderRadius:20, borderColor: "transparent", width: "48%"}}>
                                        <View style={{flexDirection: 'column', justifyContent: "center", alignSelf: 'center', alignItems: "center"}}>
                                            <Progress.Circle size={120} indeterminateAnimationDuration={2000} animated={this.state.changedQuestion} showsText style={[customstyles.progressChart]} progress={this.state.percentValue} thickness={10} unfilledColor= "#cbb8d9" color="#20004A" fill="#00000000" borderWidth={0}>
                                            </Progress.Circle>                                          
                                        </View>
                                    </View>
                                </View>
                                <View style={{display: "flex", flexDirection: "column", ...customstyles.filterContainerOutline}}>
                                    <View style={{display: "flex", flexDirection: "row", padding: 10}}>
                                        {/*<Text style={{color: "#662397", fontSize: 20, fontWeight: "bold", color: "white"}}>Data Categories</Text>*/}
                                        <TouchableOpacity onPress={() => {this.setState({viewingInfo: !this.state.viewingInfo})}} style={{alignSelf: "flex-end"}}>
                                            {!this.state.viewingInfo ?
                                                <Text style={{ ...customstyles.underline, color: "#662397", alignSelf: "flex-start", color: "#20004A", fontSize: 15}}>Hide Category Breakdown</Text>:
                                                <Text style={{ ...customstyles.underline, color: "#662397", alignSelf: "flex-start", color: "#20004A", fontSize: 15}}>Show Category Breakdown</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={{flex: 1, padding: 5, borderColor: "transparent", borderWidth: 2, borderRadius: 5, maxHeight: 150}}>
                                    {!this.state.viewingInfo ? 
                                        <View style={{paddingBottom: windowHeight*0.01}}>
                                            {
                                                this.state.listCategories.length > 0 &&
                                                this.state.listCategories.map((item, index) => (
                                                    <TouchableOpacity style={styles.tranBackground}>
                                                        <View style={styles.textView}>
                                                            <Text style={{...styles.titleText, marginBottom: 5}}>{item.category_name}</Text>
                                                            <View style={{display: "flex", flexDirection: "row", marginLeft: "auto", marginRight: 15, justifyContent: "center", alignSelf: "space-around"}}>
                                                                <Progress.Bar progress={item.fraction} width={200} animationType= "spring" color="#662397" unfilledColor="#cbb8d9" borderColor="white" borderWidth={1.5} alignSelf="center" animated/>
                                                            </View>
                                                        </View>
                                                        <Text style={{color: "#663297", fontWeight: 'normal', alignSelf: "flex-end", fontSize: 20}}>{Math.round(item.fraction*100)}%</Text>
                                                    </TouchableOpacity>
                                                ))
                                            }
                                        </View> : 
                                        <View>
                                        </View>
                                    }
                                    </ScrollView>
                                </View>
                            </View>
                            {/*<PlaidLinkWrapper client_user_id={"Hello"}>
                                {(state, connect, disconnect) => (
                                    state != null && 
                                )}
                                </PlaidLinkWrapper>*/}
                            <Text style={{color: "#662397", fontSize: 20, marginTop: 10, paddingLeft: 15, padding: 5, fontWeight: "bold", color: "#20004A"}}>Increase your data valuation by connecting to other platforms!</Text>
                            {
                                this.state.linkAccounts.length > 0 && this.state.linkAccounts.map((item, i) => (
                                    <View key = {i} style={{ ...customstyles.filterContainer, padding: 15, marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                        <View>
                                            <Image source={item.img} style={{width: 60, height: 60}}/>
                                        </View>
                                        <View style={{alignSelf: "flex-end", width: "80%"}}>
                                            <Text style={{ ...customstyles.textCenter, fontSize: 15, color: "#20004A"}}>{item.desc}</Text>

                                            <TouchableOpacity onPress={() => {this.uploadInfo(item)}}
                                                style={{ ...customstyles.px30, marginVertical: 10}}>
                                                <Text style={{...customstyles.btnThemexs, color: "#20004A", borderColor: "#20004A"}}>UPLOAD</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                </SafeAreaView >);
        }
        console.log("Equals null? ", this.state.Questions == null)
        console.log("Equals? ", this.state.Questions)

        return (

            <SafeAreaView style={styles.scrollArea}>
                <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                    <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15, color: "white"}}>Question Store</Text>
                </View>
                <ScrollView style={{...styles.innerView}}>
                    <View style={{...styles.container, justifyContent: "center", alignSelf: "center", width: "100%"}}>
                        <View style={{ ...customstyles.filterContainer, justifyContent: "center",  marginBottom: 10, padding: 15, ...customstyles.mt30, backgroundColor: "#662397", opacity: 1, borderRadius:20, borderColor: "transparent", width: "100%"}}>
                            {
                                true ?

                                    this.state.Questions.map((item, i) => (
                                        <View key={i} >

                                            <View>
                                                <Text style={{ ...customstyles.h5, ...customstyles.my10, color: "white", fontWeight: "normal"}}>{item.keycode_id}, {item.question_mode}: {item.question}</Text>
                                            </View>

                                            {
                                                item.question_mode == '1' &&
                                                <View>
                                                    <TextInput
                                                        placeholder={'Answer'}
                                                        placeholderTextColor={'grey'}
                                                        onChangeText={(text_input) => this.setState({ text_input })}
                                                        style={{ ...customstyles.inputtheme, color: "white", borderColor: "white", borderWidth: 1, borderRadius: 10}}
                                                    />
                                                </View>

                                            }

                                            {
                                                item.question_mode == '2' &&

                                                <View>
                                                    {
                                                        this.renderDropdown()
                                                    }
                                                    <TextInput
                                                        placeholder={'Other (if above not applicable)'}
                                                        placeholderTextColor={'grey'}
                                                        onChangeText={(text_input) => this.setState({ number_text: text_input })}
                                                        style={{ ...customstyles.inputtheme, color: "white", borderColor: "white", borderWidth: 1, borderRadius: 10, marginTop: -10}}
                                                    />

                                                </View>

                                            }

                                            {
                                                item.question_mode == '3' &&
                                                <View>
                                                    {
                                                        this.state.questionOptions.map((checkBoxItem, k) => (
                                                            <View style={{ ...customstyles.checkboxlist, backgroundColor: "white" }} key={k}>
                                                                <Checkbox
                                                                    value={!!this.state.selectedCheckboxes.includes(checkBoxItem.id)}
                                                                    onValueChange={() => this.onChange(checkBoxItem.id)}
                                                                    Checked={this.state.selectedCheckboxes.includes(checkBoxItem.id)}
                                                                    color="#662397"
                                                                    style={{ ...customstyles.ml10,...customstyles.checkboxhidden, alignSelf: "center", justifyContent: "center"}}
                                                                />
                                                                <Text style={{marginLeft: 30, color: "#662397" }}>{checkBoxItem.option}</Text>
                                                            </View>

                                                        ))
                                                    }
                                                    <TextInput
                                                        placeholder={'Other (if above not applicable)'}
                                                        placeholderTextColor={'grey'}
                                                        onChangeText={(text_input) => this.setState({ number_text: text_input })}
                                                        style={{ ...customstyles.inputtheme, color: "white", borderColor: "white", borderWidth: 1, borderRadius: 10, marginTop: -10}}
                                                    />
                                                </View>
                                            }

                                            {
                                                item.question_mode == '4' &&

                                                <View>
                                                    <TouchableOpacity onPress={this.pickImage} style={{ ...customstyles.py15, ...customstyles.bgtheme, ...customstyles.rowverticalcenter, ...customstyles.textCenter, ...customstyles.radius10 }}>

                                                        <Ionicons name="cloud-upload-outline" size={36} color="#fff"></Ionicons>
                                                        <Text style={{ ...customstyles.h5, ...customstyles.textwhite, ...customstyles.ml10 }}>Upload File</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }

                                            {
                                                item.question_mode == '5' &&
                                                <View>
                                                    <TextInput
                                                        placeholder={'Numeric Value'}
                                                        placeholderTextColor={'grey'}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(number_text) => this.setState({ number_text: number_text })}
                                                        style={{ ...customstyles.inputtheme, color: "white", borderColor: "white", borderWidth: 1, borderRadius: 10}}
                                                    />
                                                </View>

                                            }

                                            {
                                                item.question_mode == '6' &&
                                                <View>
                                                    <TextInput
                                                        placeholder={'Answer'}
                                                        onChangeText={(text_input) => this.setState({ text_input })}
                                                        style={{ ...customstyles.inputtheme }}
                                                    />
                                                </View>

                                            }
                                                                                        {
                                                item.question_mode == '7' &&
                                                <View style={{height:150, overflow: "hidden", flex: 1,borderStyle: 'solid', borderWidth: 2, borderColor:"#fff"}}>
                                                <ScrollView contentContainerStyle={{ flexGrow: 1 }}> 
                                              {
                                                  this.state.questionOptions.map((checkBoxItem, k) => (
                                                  
                                                      <View  key={k}>
                                                           <TouchableOpacity onPress={() => this.getanswer(checkBoxItem.option,checkBoxItem.id)}  style={{marginBottom:10}}>
                                                          
                                                    <Image source={{uri: checkBoxItem.path}} style={(this.state.selected == checkBoxItem.id) ? styles.boxSelected : styles.boxStyle}></Image>
                                                         </TouchableOpacity>
                                                      </View>
                                                      
                                                  ))
                                              }
                                            </ScrollView>     
                                          </View>

                                            }

                                            {/* Skip & Submit button */}
                                            <View style={{...customstyles.mt10, display: "flex", flexDirection: "row", width: "100%"}}>
                                                <TouchableOpacity onPress={() => this.qusSkip(item.id)} style={{...customstyles.px30, backgroundColor: "#662397", borderColor: "white", borderWidth: 1, borderRadius: 16, marginRight: 10}}>
                                                    <Text style={{...customstyles.btnThemesmall, backgroundColor: "#662397"}}>SKIP</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.submitAnswer(item.id, item.question_mode, this.state.otherAns)} style={{...customstyles.px30, backgroundColor: "white", borderRadius: 16, marginLeft: 10}}>
                                                    <Text style={{...customstyles.btnThemesmall, backgroundColor: "white", color: "#662397"}}>SUBMIT</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {/* Close */}
                                        </View>
                                    ))
                                    :               
                                <View>         
                                     <Text style={{ ...customstyles.textCenter, fontSize: 25, color: "white", fontWeight: "bold"}}>YOU'RE A DATA WIZARD!</Text>     
                                    <Text style={{ ...customstyles.textCenter, fontSize: 15, color: "white"}}>You've filled the question store with answers to all questions available! Woohoo! We'll be coming back with more soon.</Text>
                                </View>
                            }
                        </View>
                        <View style={{...customstyles.mb10}}>
                            <TouchableOpacity
                                onPress={ () => {this.newFunction()}} style={{backgroundColor: "transparent", borderRadius: 16, borderWidth: 2, borderColor: "#fff"}}>
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
    boxStyle:{
        height:150,width:150,borderStyle: 'solid', borderWidth: 2, borderColor:"#663792"
    },
    boxSelected:{
        height:150,width:150,borderStyle: 'solid', borderWidth: 2, borderColor:"red"
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

      tranBackground: {
        width: "90%",
        display: "flex",
        justifyContent: "space-around",
        backgroundColor: "white",
        borderColor: "#aaa",
        borderWidth: 2,
        flexDirection: "row",
        alignSelf: "center",
        borderRadius:0,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10
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
        fontSize: 15,
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
        padding:3.5,
        borderColor: "black",
        borderWidth: 2,
        marginLeft: "auto",
        marginRight: 15
    },  searchBarIcons:{
        height: 30,
        padding: 5,
        borderRadius: 15,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        elevation: 20,
        backgroundColor: "#662397",
        shadowColor: "#757575",
        shadowRadius: 8,
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 3,
        },
      }, addcardbtn: {
        borderRadius: 25,
        paddingLeft: 35,
        paddingRight: 35,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: "#dc3545",
        color: "#fff",
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "Roboto",
        borderWidth: 0,
        textAlign: "center",
      },
      inputtheme: {
        // height: "10%",
        height: 46,
        width: "100%",
        borderWidth: 2,
        borderColor: "#663792",
        borderRadius: 30,
        marginBottom: 10,
        //placeholderColor: "#555",
        //placeholderOpacity: .5,
        color: "#555",
        fontSize: 16,
        fontFamily: "Roboto",
        fontWeight: "normal",
        paddingLeft: 35,
        paddingRight: 35,
      },

});



export default Question;