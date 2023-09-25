import React, { useEffect, useState} from 'react';
import { Alert, Button, TextInput, Dimensions, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
import Dialog from "react-native-dialog";
import Carousel, {Pagination} from "react-native-snap-carousel";
import SearchBar from "react-native-dynamic-search-bar";
import { commonPost, commonGet, getFolderPercent } from "../components/functions.js";
import ShowDocs from "./ShowDocs";
import * as Progress from 'react-native-progress';
//import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 30;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)
import PaginationDot from "react-native-animated-pagination-dot";
import { SourceSelectionCriteria } from '@aws-sdk/client-s3';


function Info({ navigation, route }) {

    const handleOnChangeText = (text) => {
        if(text == ""){
            setDisplayFolders(allFolders)
        }
        else{
            var listFolders = [];
            for(let i = 0; i<allFolders.length; i++){
                if(allFolders[i].folder_name.indexOf(text) == 0){
                    listFolders.push(allFolders[i])
                }
            }
            setDisplayFolders(listFolders);
        }

      };
    const [activeIndex, setActiveIndex] = useState(0);
    const [Index, setindex] = useState(0);
    const [allFolders, setAllFolders] = useState([]);
    const [displayFolders, setDisplayFolders] = useState([]);
    const ref = React.useRef(null);
    const [progressAmount, setProgressAmount] = useState(1);
  
    const renderItem = ({item, index}) => (
      
        <View style={{backgroundColor: "white", display: "flex", borderRadius: 5, borderWidth: 10, borderColor: "#663297"}}>
        {
            <View>
                <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} start={{ x: 0.2, y: 0.5 }} end={{ x: 1, y: 1.3 }} style={styles.gradientbtn} >
                    <View key={index}>
                        <Text style={{ ...customstyles.w100, ...customstyles.textCenter, ...customstyles.textwhite, ...customstyles.textmd, fontFamily: "Thonburi"}}>{item.folder_name} </Text>
                    </View>
                </LinearGradient>
                 <ShowDocs KEY={index} user_id={userId} folder_id={item.id} folder_name={item.folder_name} /> 
            </View>
        }
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

    useEffect(() => {
       
            let data = {
                id: route.params.user_id,
                api_url: 'getFolderName'
            }
            const newResponse = commonPost(data)
            .then(resp => {
                console.log("resp.data-------------");
                console.log(resp.data);
                if(resp.data != null){
                    setDisplayFolders(resp.data);
                    setAllFolders(resp.data);
                }
            
             
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
        })
        return userFolder;
    }

    let getGeneralFolder = async () => {
        let data = {
            id: route.params.user_id,
            api_url: 'getFolderName'
        }

        let current = await commonPost(data)
        .then(resp => {
           // console.log(resp.data);
            if(resp.data != null){
                setDisplayFolders(resp.data);
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

    let handleSubmit = () => {
       
        let data = {
            id: userId,
            folder_name: folderName,
            api_url: 'insertFolder'
        }
        setfoldervisiable(true)
        console.log(data);
        var resp = commonPost(data)
            .then(resp => {
                console.log(resp);
                setfoldervisiable(false)
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
                    setFlag('1');
                    setMessage(result.message);
                    
                    setFolderName('');
                    setDisplayFolders([]);
                    setTimeout(() => {
                        setMessage('');
                        getGeneralFolder();
                        setFlag('');
                        setVisible(false);
                        getUserFolder(userId);
                    }, 2000);
                }
            })
            .catch((error) => {
                console.log(error)
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
                if ((result.status ==  0 || result.data == null)) {
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
            var totalInsert = 0;
            var totalCount = 0;
            for(let i = 0; i<folderPercents.data.length; i++){
                totalInsert += folderPercents.data[i].insertedcount;
                totalCount += folderPercents.data[i].totalcount;
                console.log("full percents: " + folderPercents.data[i].insertedCount);
            }
            console.log("Percentage: " + totalInsert/totalCount);
            console.log(totalInsert);
            console.log(totalCount);
            setTimeout(() => {
                setProgressAmount(totalInsert/totalCount);
                setDataisLoaded(true);
            }, 5000)
        });
  
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
                        setDisplayFolders([]);
                        setTimeout(() => {
                            getGeneralFolder();
                        }, 1000);
                     
                        getListCategories();
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
    // Close

    // if (!DataisLoaded) {
    //     return <Loader />;
    // }
    return (
        <SafeAreaView style={styles.scrollArea}>
            {/* <Background /> */}
            <View style={{ ...customstyles.header, paddingHorizontal: 15, display: "flex", flexDirection: "row"}}>
                <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15, justifyContent: "space-between"}}>My Info</Text>
                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{...customstyles.titleText, color: "#663297", fontWeight: 'bold', marginLeft: 15, alignSelf: "flex-end"}}>{progressAmount*100}%</Text>
                    <Progress.Bar progress={progressAmount} width={100} animationType= "spring" color="#662397" unfilledColor="cbb8d9" borderColor="black" borderWidth={3} alignSelf="center" />
                </View>
            </View>
            <ScrollView style={styles.innerView}>
                <View style={styles.container}>
                    {
                        flag == '2' ?
                            <Text style={{ color: 'red', fontWeight: '700', fontSize: 14 }}>{message}</Text> :
                            <Text></Text>
                    }
                    <View>
                        <Dialog.Container visible={visible}>
                        {
                            foldervisiable && 
                            <ActivityIndicator size="large" color="#663792" />
                               }
                            <Dialog.Title style={customstyles.h4}>Add Folder</Dialog.Title>
                            <Dialog.Description>
                                To create a new folder, please enter a name for it here.
                            </Dialog.Description>
                            {/* <Dialog.Input autoCapitalize='none'
                                label={'Name of Folder'}
                                onChangeText={folderName => setFolderName(folderName)}
                                maxLength={30} /> */}
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
                        <SearchBar
                        height={50}
                        style={{marginRight: 10, padding: 5,borderWidth:1,borderColor:"#cdd1ce"}}
                        fontSize={15}
                        fontColor="#fdfdfd"
                        iconColor="#fdfdfd"
                        cancelIconColor="#fdfdfd"
                        placeholder="Enter search"
                        onChangeText={(text) => handleOnChangeText(text)}
                        />
                    </View>
                
                    <View style={{justifyContent: "center", alignItems: "center", margin: 10}}>
                    {
                        displayFolders.length > 0 &&
                        <View style={[customstyles.row, customstyles.mt10, { justifyContent: "space-between" }]}>
                                <TouchableOpacity onPress={showDialog} style={customstyles.btnThemexs}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "center"}}>
                                        <Ionicons name="add-outline" size={20} color="#fff" />
                                        <Text style={{color: "#fff"}}> Add Folder</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{paddingTop: 10}}>
                                    <PaginationDot
                                        activeDotColor={'#662397'}
                                        curPage={activeIndex}
                                        sizeRatio={0.5}
                                        maxPage={100}
                                        style={{margin: 10}}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => deleteFolder()} style={customstyles.btnThemexs}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Ionicons name="remove" size={20} color="#fff" />
                                        <Text style={{color: "#fff"}}> Delete Folder</Text>
                                    </View>
                                </TouchableOpacity>
                            
                        </View>
                    }
                    {
                        displayFolders.length > 0 &&
                        <Carousel
                        layout="default"
                        ref={ref}
                        data={displayFolders}
                        sliderWidth={SLIDER_WIDTH}
                        style={{alignSelf: "center", justifyContent: "center"}}
                        itemWidth={ITEM_WIDTH}
                        renderItem={renderItem}
                        onSnapToItem={(index) => setActiveIndex(index)}
                        />
                    }
                    </View>
                    
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    scrollArea: {
        flex: 1,
        width: "100%",
        backgroundColor: "white",
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
        borderRadius: 5,
        // overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderColor: "white", 
        borderWidth: 4
    }
});
export default Info;