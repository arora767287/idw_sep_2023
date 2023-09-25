import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { Ionicons } from '@expo/vector-icons';
import {couponlist,commonPost } from './functions';
class Couponllist extends Component {

    state = {
        couponarr: [],
        DataisLoaded: false,
        values: [],
        api_resp: '',
        response_color: '',
        selectedCheckboxes: [],
        error_vald: '',
        user_id_ori: '',
        catId: '',
        categoryname: '',
        is_val_checked: false,
        removePrefstatus: false,
        isLoading: false,
        isLoading1: false,
        user_pref: '',
        count: 10,
        const_pref: [],
        test_arr: [],
    }

    componentDidMount() {
        let user_id = this.props.route.params.user_id;
       
        this.getCoupon(user_id);
     
    }

     fetchMore = () => {
      console.log("test");
        this.setState({ count: this.state.count+10 });
        let data = {
            user_id:this.props.route.params.user_id,
            countval:this.state.count,
        }
        var resp = couponlist(data)
            .then(resp => {
                console.log(resp);
                let result = resp.data;
               console.log("resp++++++++++");
               console.log(result);
               let res=result.data;
               let list = [...this.state.couponarr, ...res]
               this.setState({
                couponarr: list,
            })
              
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Category Listing
    getCoupon = (user_id) => {
        let data = {
            user_id:user_id,
            countval:this.state.count,
        }
        console.log("user_id")
        console.log(user_id)
        var resp = couponlist(data)
            .then(resp => {
                console.log("Text");
                console.log(resp);
                let result = resp.data;
                let res=result.data;
               console.log("resp++++++++++");
               console.log(res);
               this.setState({
                couponarr: res,
            })
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    }
    // Close
    addcoupon(code,company_id) {
    
    let data = {
        user_id:this.props.route.params.user_id,
        company_id:company_id,
        coupon_code:code,
        api_url:'updatecompanycoupan',
    }
    console.log(data)
    var resp = commonPost(data)
        .then(resp => {
            let result = resp.message;
            let status = resp.status;
           // setCouponarr(result);
           if(status==1){
            this.getCoupon(this.props.route.params.user_id);
           }
           console.log("resp++++++++++");
           console.log(result);
        
        })
        .catch((error) => {
            console.log(error)
        })
    }
   
    onImageLoadFinished = ({ id, success }) => {
		// Do something
	}

	onScratchProgressChanged = ({ value, id }) => {
        console.log("value");
        console.log(value);
	}

	onScratchDone = ({ isScratchDone, id }) => {
	console.log("isScratchDone");
	console.log(isScratchDone);
	}

	onScratchTouchStateChanged = ({ id, touchState }) => {
		// Example: change a state value to stop a containing
		// FlatList from scrolling while scratching
		this.setState({ scrollEnabled: !touchState });
        console.log("touchState");
	   console.log(touchState);
	}
    render() {

        const { isLoading1, items } = this.state;
        if (isLoading1) {
            return <Loader />;
        }
        return (

            <View style={{flex: 10, marginLeft: 20, marginRight: 20, marginTop: 50}}>
                <View style={{alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name="leftcircle" size={30} color="#663297"  />
                    </TouchableOpacity>
                    <Text style={{...customstyles.titleText, fontWeight: 'bold', fontSize: 30, paddingLeft: 15 }}>Coupon List</Text>
                </View>
            <View style={{flex: 3, alignItems: "center", marginLeft: -20, marginRight: -20, padding: 10}}>
           
                        {this.state.isLoading   && <Loader />} 
                        {this.state.couponarr.length>0 ?  
                <FlatList
            data={this.state.couponarr}
            numColumns={2}
            renderItem={({item,index}) =>  
            <View style={{display: "flex", flexDirection: "row"}}>
                <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {item.used>0 ? 
                        <TouchableOpacity style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", backgroundColor: "#662397", width: 150, height: 140, borderRadius: 16, padding: 10, margin: 10, opacity: 1}}>
                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
                                <View style={{backgroundColor: "#662397", opacity: 0.5, alignSelf: "center", justifyContent: "center", alignItems: "center", width: 125, height: 40, borderRadius: 10}}>
                                    <Text style={{...customstyles.h5, fontSize: 15, fontWeight: "normal", color: "white"}}>
                                        {item.offer_title}
                                    </Text>
                                </View>
                            </View>
                            <View style={{display: "flex", flexDirection: "column"}}>
                                <Text style={{...customstyles.h5, fontSize: 12.5, fontWeight: "bold", color: "white", textAlign: "center"}}>
                                    Code
                                </Text>
                                <Text style={{...customstyles.h5, fontSize: 15, marginBottom: 2, color: "white", textAlign: "center", marginBottom: 10}}>
                                    {item.code}
                                </Text>
                                <Text style={{...customstyles.h5, fontSize: 12.5, fontWeight: "bold", color: "white",  textAlign: "center"}}>
                                    Company
                                </Text>
                                <Text style={{...customstyles.h5, fontSize: 12.5, color: "white", marginBottom: 10, textAlign: "center"}}>
                                    {item.comp_name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    :
                    <TouchableOpacity style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", backgroundColor: "#662397", width: 150, height: 120, borderRadius: 16, padding: 10, margin: 10, opacity: 0.75}} onPress={() => this.addcoupon(item.code,item.company_id)}>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
                            <Text style={{...customstyles.h5, fontSize: 16, fontWeight: "normal", color: "white",paddingLeft:18,paddingTop:32}}>
                            Show Coupon
                            </Text>
                        </View>
                    </TouchableOpacity> 
                    }
            </View>
        </View>
          
     
                                 } 
                                //  onEndReachedThreshold={0.9}
                                 onEndReached={ this.fetchMore}
          />:
          <View>
    
      </View>
        }
            </View>
           
        </View>
        );
    }
}

const styles = StyleSheet.create({
    tranBackground: {
        width: "100%",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 2,
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
        flexDirection: "column",
        height:50,
        width:300
    },
    titleText:{
        fontFamily: "Avenir-Next",
        fontSize: 20,
        color: "#663297",
        paddingTop:7,
        paddingLeft:85
    },
    dateTimeText: {
        fontFamily: "Avenir-Next",
        fontSize: 10,
        color: "#663297",
    },
    brandNameText:{
        alignSelf: "center",
        fontSize: 10,
        opacity: 0.5,
        fontFamily: "Avenir-Next",
        padding:3.5,
        borderColor: "black",
        borderWidth: 2,
        marginLeft: "auto",
        marginRight: 15
    },  searchBarIcons:{
        height: 30,
        padding: 5,
        borderRadius: 15,
        alignSelf: "center",
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
export default Couponllist;