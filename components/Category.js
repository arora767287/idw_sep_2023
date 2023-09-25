import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { getCategories, getUserPrefrence, commonPost } from "./functions.js";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import Background from './Background';
import MyTabs from './MyTabs';
import  ModelAlert  from './ModelAlert';
class Category extends Component {

    state = {
        categories: [],
        DataisLoaded: false,
        values: [],
        api_resp: '',
        response_color: '',
        selectedCheckboxes: [],
        error_vald: '',
        user_id_ori: '',
        catId: '',
        is_val_checked: false,
        removePrefstatus: false,
        isLoading: false,
        user_pref: '',
        const_pref: [],
        test_arr: [],
    }

    componentDidMount() {
        let userDetails = this.props.route.params.userDetails;
        let user_id = userDetails.id;
        this.setState({
            user_id_ori: user_id
        });
        this.getCategory(user_id);
        this.getUserPrefrence(user_id);
    }

    // Get Prefrence
    getUserPrefrence = (user_id) => {
        let resp = getUserPrefrence(user_id)
            .then(resp => {
                let result = resp.data;
                //console.log('result', result);
                let i = 0;
                let temp_selected = [];
                if (result.length > 0) {
                    for (i = 0; i < result.length; i++) {
                        temp_selected.push(result[i].category_id);
                    }
                }
                this.setState({
                    user_pref: temp_selected.toString(),
                    test_arr: temp_selected
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // Category Listing
    getCategory = (user_id) => {
        let resp = getCategories(user_id)
            .then(resp => {
                let result = resp.data;
                this.setState({
                    categories: result,
                    checkboxes: result,
                    DataisLoaded: true,
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // Set Prefrence 
    setCategory = (e) => {
        e.preventDefault();
        //console.log(this.state.selectedCheckboxes); return;
        let cat_list = this.state.selectedCheckboxes;
        if (cat_list == '') {
            this.setState({
                error_vald: "",
            });
            setTimeout(() => {
                this.setState({ error_vald: '' });
            }, 3000)
        } else {
            let categories = this.state.selectedCheckboxes;
            let previous_str = categories.concat(this.state.user_pref);
            let final_str = previous_str.toString();

            let data = {
                user_id: this.state.user_id_ori,
                category_id: final_str,
                api_url: 'setUserPreference'
            }
            //console.log(data); return;
            this.setState({
                isLoading: true,
            })

            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    let message = result.message;
                    let status = result.status;
                    if (status == 1) {
                        this.setState({
                            api_resp: "Your preferences have been updated in our system.",
                            response_color: customstyles.alertPrimary,
                            isLoading: false,
                        });
                        setTimeout(() => {
                            this.setState({ api_resp: '' });
                            this.props.navigation.goBack();
                        }, 3000)

                    }
                    else {
                        this.setState({
                            api_resp: message,
                            response_color: customstyles.alertdanger,
                            isLoading: false,
                        });
                        setTimeout(() => {
                            this.setState({ api_resp: '' });
                        }, 3000)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
    // Close
    onChange = (checked, id) => {
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
        //console.log(this.state.selectedCheckboxes);
    };

    removePref(cat_id) {
        this.setState({
            catId: cat_id
        })
        this.showAlert()
    }
    confirmRemovePref = () => {
        this.setState({
            removePrefstatus: false,
        });
        let data = {
            id: this.state.user_id_ori,
            cat_id: this.state.catId,
            api_url: 'deletePreference'
        }
        console.log(data);
        var response = commonPost(data)
            .then(res => {
                console.log(res);
                this.setState({
                    catId: '',
                });
                let status = res.status;
                let message = res.message;
                if ((status == 1)) {
                    this.setState({
                        error_vald: 'Removing Preference',
                    });
                    setTimeout(() => {
                        this.getCategory(this.state.user_id_ori);
                        this.setState({ error_vald: '' });
                    }, 3000);
                } else {
                    this.setState({
                        error_vald: 'Something went wrong',
                    });
                    setTimeout(() => {
                        this.setState({ error_vald: '' });
                    }, 3000)
                }

            })
            .catch(error => console.log(error));
    }
   cancelRemovePref = () => {
        this.setState({
            removePrefstatus: false,
        });
    }

   showAlert = () => {
        Alert.alert(
            "Removal Confirmation",
            "Are you sure you want to remove this preference?",
            [
            {
                text: "Cancel",
                onPress: () => Alert.alert("Cancelled"),
                style: "cancel",
            },
            {
                text: "OK",
                onPress: () => this.confirmRemovePref(),
                style: "submit",
            },
            ],
            {
            cancelable: true,
            onDismiss: () =>
                Alert.alert(
                "This alert was dismissed by tapping outside of the alert dialog."
                ),
            }
        );
    }

    render() {

        const { DataisLoaded, items } = this.state;
        if (!DataisLoaded) {
            return <Loader />;
        }
        return (

            <SafeAreaView style={styles.scrollArea}>
                {/* <Background /> */}
                <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                            <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 35, color: "#662397", fontWeight: 'bold', flex: 1, alignSelf: "center",  marginLeft: 15}}>Categories</Text>
                </View>
                <ScrollView style={styles.innerView}>
                    <View style={styles.container}>
                        {/* <View style={customstyles.header80}>
                            <Text style={customstyles.heading}>Categories</Text>
                        </View> */}

                        <View>
                            {
                                this.state.api_resp.length > 0 &&
                                <Text style={this.state.response_color}>{this.state.api_resp}</Text>
                            }
                            <Text style={{ color: 'red' }}>{this.state.error_vald}</Text>
                            {
                                this.state.categories ?
                                    this.state.categories.map((item, i) => (
                                        ((item.Selected == 'Inactive')) ?
                                            <View style={{ ...customstyles.checkboxlist, backgroundColor: "white" }} key={i}>
                                                <Checkbox
                                                    value={(item.Selected == 'Inactive') ? this.state.selectedCheckboxes.includes(item.id) : !this.state.selectedCheckboxes.includes(item.id)}
                                                    onValueChange={(checked) => this.onChange(checked, item.id)}
                                                    Checked={!!this.state.selectedCheckboxes.includes(item.id)}
                                                    color="#662397"
                                                    style={{ ...customstyles.ml10,...customstyles.checkboxhidden, alignSelf: "center", justifyContent: "center"}}
                                                />
                                                <Text style={{ ...customstyles.checkboxlistText, color: "#662397" }}>{item.category_name}</Text>
                                            </View>

                                            :
                                            <View style={{ ...customstyles.checkboxlist, backgroundColor: "white" }} key={i}>
                                                <Checkbox
                                                    value={(item.Selected == 'Inactive') ? this.state.selectedCheckboxes.includes(item.id) : !this.state.selectedCheckboxes.includes(item.id)}
                                                    onValueChange={(checked) => this.onChange(checked, item.id)}
                                                    Checked={!!this.state.selectedCheckboxes.includes(item.id)}
                                                    color="#662397"
                                                    style={{ ...customstyles.ml10,...customstyles.checkboxhidden, alignSelf: "center", justifyContent: "center"}}
                                                />
                                                <Text style={{ ...customstyles.checkboxlistText, color: "#662397" }}>{item.category_name}</Text>

                                                <View key={item.id} style={{...customstyles.upright,...customstyles.mr5, ...{marginTop: 8,}}}>
                                                    <TouchableOpacity style={{ ...customstyles.uprightDelete, backgroundColor: "#662397" }} onPress={() => this.removePref(item.id)} >
                                                        <Ionicons name="close-outline" size={24} color="white" />
                                                    </TouchableOpacity>
                                                </View>

                                                {/* <Button onPress={() => this.removePref(item.id)} title="X" color="red" /> */}
                                            </View>
                                        // <View style={styles.section} key={i}>
                                        //     <Checkbox
                                        //         style={styles.checkbox}
                                        //         value={true}
                                        //         disabled={true}
                                        //         color='#663792'
                                        //         style={customstyles.mr10}
                                        //     />
                                        //     <Text>{item.category_name}</Text>
                                        //     <Button onPress={() => this.removePref(item.id)} title="X" color="red" />
                                        // </View>
                                    ))
                                    :
                                    <Text>No Data</Text>
                            }
                            <TouchableOpacity onPress={this.setCategory} style={customstyles.textCenter}>
                                <View
                                    style={customstyles.btnTheme}
                                >
                                    <Text style={customstyles.btnthemeText}>
                                        {this.state.isLoading ? "Updating..." : "Update"}
                                    </Text>
                                </View>
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
        backgroundColor: "white"
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 20,
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
    }
});
export default Category;