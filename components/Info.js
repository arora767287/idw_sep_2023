import React, { useEffect, useState, useReducer} from 'react';
import { Alert, Button, TextInput, Dimensions, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
import Dialog from "react-native-dialog";
import Carousel, {Pagination} from "react-native-snap-carousel";
import SearchBar from "react-native-dynamic-search-bar";
import { commonPost, commonGet, getFolderPercent, commonPostText } from "../components/functions.js";
import ShowDocs from "./ShowDocs";
import * as Progress from 'react-native-progress';
//import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
const windowHeight = Dimensions.get("window").height;
const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 30;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)
import PaginationDot from "react-native-animated-pagination-dot";
import { SourceSelectionCriteria } from '@aws-sdk/client-s3';
import { Dropdown } from "react-native-element-dropdown"
import AntDesign from 'react-native-vector-icons/AntDesign'

function Info({ navigation, route }) {

    const parentCall = () => {
        getListCategories();
    }

    const handleOnChangeText = (item) => {
        //console.log(text);
        /*if(text == ""){
            setTimeout(() => {
                console.log("Set to all folders", allFolders)
                setActiveIndex(0);
                setDisplayFolders(allFolders)
                setListCategories(allFolders)

            }, 500)
        }*/
        var text = item.label
        var listFolders = [];
        var first = null;
        for(let i = 0; i<allFolders.length; i++){
            if(allFolders[i].folder_name.indexOf(text) == 0){
                listFolders.push(allFolders[i])
                setLabel(item.label)
                setValue(item.value);
                if(first == null){
                    first = i;
                }
            }
        }
        setTimeout(() => {
            setActiveIndex(0);
            setDisplayFolders(listFolders);
        }, 500)

      };
    const [count, setCount] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [allFolders, setAllFolders] = useState([]);
    const [allFoldersNames, setAllFoldersNames] = useState([]);
    const [displayFolders, setDisplayFolders] = useState([]);
    const ref = React.useRef(null);
    const [progressAmount, setProgressAmount] = useState(1);
    const [listTags, setListTags] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [label, setLabel] = useState("Personal");
    const [value, setValue] = useState(0);
    const renderDocs = (item, index) => {
        console.log("Item", item);
        return( <ShowDocs key={item.id} user_id={userId} folder_id={item.id} folder_name={item.folder_name} active={true} parentCall={parentCall}/> );
      
    }

    const renderItem = (item, index) => (
        index == activeIndex?
            <View style={{backgroundColor: "white", display: "flex", borderWidth: 0, borderColor: "#663297", width: "100%", ...customstyles.filterContainer, flexDirection: "column"}}>
            {
                <View style={{padding: 10}}>
                    <LinearGradient colors={['white', 'white', 'white']} start={{ x: 0.2, y: 0.5 }} end={{ x: 1, y: 1.3 }} style={styles.gradientbtn} >
                        <View key={index}>
                            <Text style={{ ...customstyles.w100, ...customstyles.textCenter, color: "#20004A", ...customstyles.textmd}}>{item.folder_name} </Text>
                        </View>
                    </LinearGradient>
                    {renderDocs(item, index)}
                </View>
            }
            </View> :
            <View>
            </View>
    )



    const [userId, setUserId] = useState('');
    const [folderName, setFolderName] = useState('');
    const [generalFolder, setGeneralFolder] = useState([]);
    const [userFolder, setUserFolder] = useState([]);
    const [DataisLoaded, setDataisLoaded] = useState(false);
    const [foldervisiable, setfoldervisiable] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [flag, setFlag] = useState('');
    const [listCategories, setListCategories] = useState('');
    const [displayNames, setDisplayNames] = useState('');

    useEffect(() => {
       
            let data = {
                id: route.params.user_id,
                api_url: 'getFolderName'
            }
            const newResponse = commonPost(data)
            .then(resp => {
                console.log("resp.data");
                console.log(resp.data);
                if(resp.data != null){
                    setDisplayFolders(resp.data);
                    setAllFolders(resp.data);
                    var currNames = [];
                    var currListTags = [];
                    for(let i = 0; i<resp.data.length; i++){
                        currListTags.push(i == 0);
                        currNames.push({label: resp.data[i].folder_name, value: i});
                    }
                    setAllFoldersNames(currNames);
                    console.log("All Folders ", currNames)
                    setListCategories(resp.data);
                    setTimeout(() => {
                        setListTags(currListTags);
                    }, 200)
                }
            
             
            }).catch((error) => {
                throw error;
            })
            setUserId(route.params.user_id);
            getListCategories();
    }, [])
    // Dialog Box
    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setError('');
        setFolderName('');
        setMessage('');
        setVisible(false);
    };
    const handleDelete = () => {
        setVisible(false);
    };
    // Close

    /*let onPressTouch = (folderId, folderName) => {
        return(
            <ShowDocs user_id={19} folder_id={folderId} folder_name={folderName} />
        );
    }*/
    // Folder's 

    let getUserFolder = async (userId) => {
        let newData = {
            id: userId,
            api_url: 'getFolderName'
        }
        let current = await commonPost(newData)
        .then(resp => {
            //console.log(resp.data);
            if(resp.data != null){
                setUserFolder(resp.data);
            }
        }).catch((error) => {
            throw error;
        })
        return userFolder;
    }

    let getGeneralFolder = async () => {
        let data = {
            id: '0',
            api_url: 'getCommonFolder'
        }

        let current = await commonGet(data)
        .then(resp => {
           // console.log(resp.data);
            if(resp.data != null){
                setGeneralFolder(resp.data);
                setDisplayFolders(generalFolder.concat(userFolder));
               // setAllFolders(generalFolder.concat(userFolder));
               // console.log(allFolders);
                setDataisLoaded(true);
            }
          //  console.log("generalFolder---------------------------");
           // console.log(generalFolder);
        })

    }

    // Close

    // Adding Folder

    let validateInput = () => {
        if ((folderName.length == null) || (folderName.length == 0)) {
            setError('Please enter folder name');
            return;
        } else {
            setError('');
            handleSubmit();
        }
    }

    let onPressTags = (indexKey) =>{
        console.log("Called" + indexKey);
        var currListTags = [];
        for(let i = 0; i< listCategories.length; i++){
            currListTags.push(i == indexKey);
        }
        console.log(currListTags)
        setTimeout(() => {
            setListTags(currListTags);
        }, 1000);
        var listFolders = [];
        for(let i = 0; i<allFolders.length; i++){
            if(i == indexKey){
                listFolders.push(allFolders[i])
            }
        }
        setTimeout(() => {
            setActiveIndex(0);
            setDisplayFolders(listFolders);

        }, 1000)
    }


    let handleSubmit = () => {
        let data = {
            id: userId,
            folder_name: folderName,
            api_url: 'insertFolder'
        }
        setfoldervisiable(true)
        console.log(data);
        var resp = commonPostText(data)
            .then(resp => {
                console.log(resp);
                setfoldervisiable(false)
                setVisible(false);
                let result = resp;
                if ((result.status == 2)) {
                    setFlag('2');
                    setFolderName('');
                    setTimeout(() => {
                        setMessage('');
                        setFlag('');
                    }, 5000);
                }
                else {
                    setTimeout(() => {
                        setDataisLoaded(false);
                    }, 1000)
                    setMessage(result.message);
                    let newData = {
                        id: userId,
                        api_url: 'getFolderName'
                    }
                    const newResponse = commonPost(newData)
                    .then(resp => {
                        console.log(resp.data);
                        if(resp.data != null){
                            setTimeout(() =>{
                                setDisplayFolders(resp.data);
                                setAllFolders(resp.data);
                                setDataisLoaded(true);
                                setActiveIndex(resp.data.length - 1);
                            }, 1000)
                        }
                    })
                    getListCategories();
                    /*
                    setFlag('1');
                    getGeneralFolder();
                    setFolderName('');
                    setTimeout(() => {
                        setMessage('');
                        setFlag('');
                        setVisible(false);
                        getUserFolder(userId);
                    }, 5000);*/
                }
            }).catch((error) => {
                throw error;
            })
    }
    // Close

    let getDocs = async (userId, folderId) => {
        let data = {
            user_id: userId,
            folder_id: folderId,
            api_url: 'getFileList'
        }
        //console.log('data', data);
        try{
            const result = await commonPost(data)
            console.log(result.data);
            setTimeout(() => {
                if (result.status == 0 || result.data == null) {
                    setDocuments([]);
                } else {
                    setDocuments(result.data);
                }
                console.log("Documents");
                console.log(result)
            }, 2000)

        }
        catch(error){
            console.log(error);
        }
    }


    let getListCategories = () => {
        console.log("NityaArora:", route.params.user_id);
        getFolderPercent(route.params.user_id).then((folderPercents) => {
            var currListCategories = [];
            var totalInsert = 0;
            var totalCount = 0;
            for(let i = 0; i<folderPercents.data.length; i++){
                currListCategories.push(folderPercents.data[i]);
                totalInsert += folderPercents.data[i].insertedcount;
                totalCount += folderPercents.data[i].totalcount;
                console.log("full percents: " + folderPercents.data[i].insertedCount);
            }
            console.log("Percentage: " + totalInsert/totalCount);
            console.log(totalInsert);
            console.log(totalCount);
            console.log("List Categories: ", listCategories);
            console.log("List Tags: ", listTags);
            setTimeout(() => {
                setProgressAmount(totalInsert/totalCount);
                setDataisLoaded(true);
            }, 500)
        }).catch((error) => {
            throw error;
        })
  
    } 


 

    // Delete Folder
    let deleteFolder = () => {
        console.log(userId);
        console.log(displayFolders[activeIndex].id);
        //console.log(folderId);
        Alert.alert(
            'Delete Folder',
            'Are you sure you want to delete this folder?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => confirmDel() },
            ]
        );

        let confirmDel = () => {
            
            let data = {
                user_id: userId,
                folder_id: displayFolders[activeIndex].id,
                api_url: 'deleteFolder'
            }
            console.log(data);
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    console.log(result);
                    getUserFolder(userId);
                    setFlag('2');
                    setMessage(result.message);
                    setTimeout(() => {
                        setMessage('');
                        setFlag('');
                    }, 2000);
                    if(result.status === 1){
                        let newData = {
                            id: userId,
                            api_url: 'getFolderName'
                        }
                        const newResponse = commonPost(newData)
                        .then(resp => {
                            console.log("resp.data");
                            if(resp.data != null){
                                setDisplayFolders(resp.data);
                                setActiveIndex(0);
                                setAllFolders(resp.data);
                            }
                        })
                        getListCategories();
                    }
                }).catch((error) => {
                    throw error;
                })
        }

    }
    // Close

    // if (!DataisLoaded) {
    //     return <Loader />;
    // }
    return (
        <SafeAreaView style={{backgroundColor: "white"}}>
            {/* <Background /> */}
            <View style={{ ...customstyles.header, paddingHorizontal: 15, display: "flex", flexDirection: "row"}}>
                <Text style={{...customstyles.titleText, fontSize: 35, color: "#20004A", fontWeight: 'bold', flex: 1, marginLeft: 15, justifyContent: "space-between"}}>My Info</Text>
                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{...customstyles.titleText, color: "#20004A", fontWeight: 'bold', marginLeft: 15, alignSelf: "flex-end"}}>{Math.round(progressAmount*100)}%</Text>
                    <Progress.Bar progress={progressAmount} width={100} animationType= "spring" color="#00ADF0" unfilledColor="cbb8d9" borderColor="#20004A" borderWidth={3} alignSelf="center" />
                </View>
            </View>
            <ScrollView style={styles.innerView}>
                <View style={styles.container}>
                    {
                        flag == '2' ?
                            <Text style={{ color: 'red', fontWeight: '700', fontSize: 14, margin: 10}}>{message}</Text> :
                            <Text></Text>
                    }
                    <View>
                        <Dialog.Container visible={visible}>
                        {
                            foldervisiable && 
                            <ActivityIndicator size="large" color="#663792" />
                               }
                            <Dialog.Title style={[{}]}>Add Folder</Dialog.Title>
                            <Dialog.Description>
                                To create a new folder, please enter a name for it here.
                            </Dialog.Description>
                            <TextInput autoCapitalize='none'
                                placeholder={'Name of Folder'}
                                onChangeText={folderName => setFolderName(folderName)}
                                maxLength={30} style={{alignSelf: "center"}}
                            />
                            {
                                error.length > 0 &&
                                <Text style={{ color: 'red', fontWeight: '700', fontSize: 14 }}>{error}</Text>
                            }
                            {
                                flag == '1' ?
                                    <Text style={{ color: 'green', fontWeight: '700', fontSize: 14 }}>{message}</Text> :
                                    <Text style={{ color: 'red', fontWeight: '700', fontSize: 14 }}>{message}</Text>
                            }
                            
                            <Dialog.Button label="Cancel" onPress={handleCancel} />
                            <Dialog.Button label="Submit" onPress={validateInput} />
                        </Dialog.Container>
                    </View>

                </View>

                <View style={{display: "flex"}}>
                    <View>
                        <Dropdown
                        style={[styles.dropdown, {borderColor: '#20004A', borderWidth: 2 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={allFoldersNames}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select Folder': ''}
                        searchPlaceholder="Search..."
                        value={allFoldersNames[activeIndex]}
                        onFocus={() => setIsFocus(false)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => {
                            //(item)
                        handleOnChangeText(item)}}
                        renderLeftIcon={() => (
                            <AntDesign
                            style={styles.icon}
                            color={isFocus ? '#20004A' : '#20004A'}
                            name="Safety"
                            size={20}
                            />
                        )}
                        />
                    </View>
                
                    <View style={{justifyContent: "center", alignItems: "center", margin: 10, paddingBottom: windowHeight*0.15}}>
                    {
                        displayFolders.length > 0 &&
                        <View style={[customstyles.row, customstyles.mt10, { justifyContent: "space-between" }]}>
                                <TouchableOpacity onPress={showDialog} style={[customstyles.btnThemexs, {borderColor: "#20004A"}]}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "center", borderColor: "#20004A"}}>
                                        <Ionicons name="add-outline" size={20} color="#20004A" />
                                        <Text style={{color: "#20004A"}}> Add Folder</Text>
                                    </View>
                                </TouchableOpacity>
                                {/*<View style={{paddingTop: 10}}>
                                    <PaginationDot
                                        activeDotColor={'#fff'}
                                        curPage={activeIndex}
                                        sizeRatio={0.5}
                                        maxPage={100}
                                        style={{margin: 10}}
                                    />
                    </View>*/}
                                <TouchableOpacity onPress={() => deleteFolder()} style={[customstyles.btnThemexs, {borderColor: "#20004A"}]}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Ionicons name="remove" size={20} color="#20004A" />
                                        <Text style={{color: "#20004A"}}> Delete Folder</Text>
                                    </View>
                                </TouchableOpacity>
                            
                        </View>
                    }
                    {displayFolders.length > 0 && renderItem(displayFolders[activeIndex], activeIndex )}
                    {
                        /*displayFolders.length > 0 &&
                        <Carousel
                        layout={'default'}
                        layoutCardOffset={`18`}
                        ref={ref}
                        data={displayFolders}
                        sliderWidth={SLIDER_WIDTH}
                        style={{alignSelf: "center", justifyContent: "center"}}
                        itemWidth={ITEM_WIDTH}
                        renderItem={renderItem}
                        onSnapToItem={(index) => setActiveIndex(index)}
                        />*/
                    }
                    </View>
                    {/*}
                    <ScrollView persistentScrollbar horizontal style={{display: "flex", flexDirection: "row", backgroundColor: "transparent", height: 100}}>
                        <View style={{flexDirection: "row", justifyContent: "center", padding: 20, alignSelf: "center"}}>
                            {
                                listCategories.length > 0 && listTags.length > 0 && listCategories.map((object, i, array) => (
                                    <View style={{display: "flex"}}>
                                        <TouchableOpacity style={ listTags[i] ? customstyles.tagStyle4 : customstyles.tagStyle3} key={i} onPress={() => onPressTags(i)}>
                                            <Text style={ listTags[i] ? customstyles.tagText4: customstyles.tagText3}>{object.folder_name}</Text>
                                        </TouchableOpacity> 
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                        */}
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    scrollArea: {
        flex: 1,
        width: "100%",
        backgroundColor: "#20004A",
        // paddingTop: StatusBar.currentHeight,
    },
    header: {
        paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 15,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    col2: {
        flex: 2,
        justifyContent: 'center',
        marginBottom: 30,
    },
    gradientbtn: {
        height:  60,
        borderRadius: 16,
        // overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderColor: "#20004A", 
        borderWidth: 4
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 28,
        paddingHorizontal: 8,
        margin: 10
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: '#20004A',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
        color: "#20004A",
      },
      selectedTextStyle: {
        fontSize: 16,
        color: "#20004A",
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
export default Info;