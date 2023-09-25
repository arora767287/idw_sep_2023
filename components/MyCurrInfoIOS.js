import React, { useEffect, useState } from 'react';
import { Alert, Button, TextInput, Dimensions, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
import Dialog from "react-native-dialog";
import Carousel, {Pagination} from "react-native-snap-carousel";
import SearchBar from "react-native-dynamic-search-bar";
import { commonPost, commonGet, getAllFiles} from "../components/functions.js";
import ShowDocs from "./ShowDocs";
import * as Progress from 'react-native-progress';

const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 30;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)
function Info({ navigation, route }) {

    const handleOnChangeText = (text) => {
        console.log(text == "");
        if(text == ""){
            setDisplayFolders(generalFolder.concat(userFolder))
        }
        else{
            var listFolders = [];
            for(let i = 0; i<displayFolders.length; i++){
                if(displayFolders[i].folder_name.indexOf(text) == 0){
                    listFolders.push(displayFolders[i])
                }
            }
            setDisplayFolders(listFolders);
        }

      };
    const [activeIndex, setActiveIndex] = useState(0);
    const [allFolders, setAllFolders] = useState([]);
    const [displayFolders, setDisplayFolders] = useState([]);
    const ref = React.useRef(null);
  
    const renderItem = ({item, index}) => (
        <View style={{backgroundColor: "white", display: "flex", borderRadius: 5, borderWidth: 10, borderColor: "#663297"}}>
            {
                <View>
                    <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} start={{ x: 0.2, y: 0.5 }} end={{ x: 1, y: 1.3 }} style={styles.gradientbtn} >
                        <View key={index}>
                            <Text style={{ ...customstyles.w100, ...customstyles.textCenter, ...customstyles.textwhite, ...customstyles.textmd, fontFamily: "Thonburi"}}>{item.folder_name} </Text>
                        </View>
                    </LinearGradient>
                     <ShowDocs key={index} user_id={userId} folder_id={item.id} folder_name={item.folder_name} /> 
                </View>
            }


        </View>
      )

    const [userId, setUserId] = useState('');
    const [folderName, setFolderName] = useState('');
    const [generalFolder, setGeneralFolder] = useState([]);
    const [userFolder, setUserFolder] = useState([]);
    const [DataisLoaded, setDataisLoaded] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [flag, setFlag] = useState('');

    useEffect(() => {
        let getNew = async () => {
            let data = {
                id: '0',
                api_url: 'getCommonFolder'
            }
            const newResponse = await commonGet(data)
            setTimeout(() => {
                setGeneralFolder(newResponse.data)
            }, 1000)
        }
        getNew();

    }, [generalFolder])

    useEffect(() => {
        
        let getAll = async () => {
            let currId = route.params.user_id;
            console.log(currId + 'INFO');
            setUserId(currId);
            let newData = {
                id: userId,
                api_url: 'getFolderName'
            }
            try{
                const response = await commonPost(newData)
                setTimeout(() => {
                    if(response.data != null){
                        setUserFolder(response.data);
                    }
                }, 1000)        
                    setAllFolders(generalFolder.concat(userFolder));
                    setDisplayFolders(allFolders);
                setTimeout(() => {
                    setDataisLoaded(true);
                }, 1000)
            }
            catch(error){
                console.log(error);
            }
            /*
            setTimeout(() => {
                getUserFolder(userId).then( resp => { 
                    getGeneralFolder().catch((error) => {
                        console.log(error);
                    })
                })
            }, 1500)
            */
        }
        getAll();
        /*
        getUserFolder(userId)
        setAllFolders(generalFolder.concat(userFolder));
        */
    }, [userFolder, allFolders]);


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
            console.log(resp.data);
            if(resp.data != null){
                setUserFolder(resp.data);
            }
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
            console.log(resp.data);
            if(resp.data != null){
                setGeneralFolder(resp.data);
                setDisplayFolders(generalFolder.concat(userFolder));
                setAllFolders(generalFolder.concat(userFolder));
                console.log(allFolders);
                setDataisLoaded(true);
            }
            console.log(generalFolder);
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
        var resp = commonPost(data)
            .then(resp => {
                //console.log(resp);
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
                    getGeneralFolder();
                    setFolderName('');
                    setTimeout(() => {
                        setMessage('');
                        setFlag('');
                        setVisible(false);
                        getUserFolder(userId);
                    }, 5000);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

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
                    }, 5000);
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
    // Close

    if (!DataisLoaded) {
        return <Loader />;
    }
    return (
        <SafeAreaView style={styles.scrollArea}>
            {/* <Background /> */}
            <View style={{ ...customstyles.header, paddingHorizontal: 15, display: "flex", flexDirection: "row"}}>
                <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15, justifyContent: "space-between"}}>My Info</Text>
                <View style={{display: "flex", flexDirection: "column"}}>
                    <Text style={{...customstyles.titleText, color: "#663297", fontWeight: 'bold', marginLeft: 15, alignSelf: "flex-end"}}>30%</Text>
                    <Progress.Bar progress={0.3} width={100} animationType= "spring" color="#662397" unfilledColor="cbb8d9" borderColor="black" borderWidth={3} alignSelf="center" />
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
                                maxLength={30} style={{ ...customstyles.inputtheme, }}
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
                            <Dialog.Button label="Cancel" onPress={handleCancel} style={customstyles.btnRedxs} />
                            <Dialog.Button label="Submit" onPress={validateInput} style={{ ...customstyles.btnThemexs, ...customstyles.ml5 }} />
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
                
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                        {
                            displayFolders.length > 0 &&
                            <Pagination
                            dotsLength={displayFolders.length}
                            activeDotIndex={activeIndex}
                            containerStyle={{ borderColor: "#663297", alignSelf: "center", justifyContent: "center", backgroundColor: "transparent"}}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 2,
                                backgroundColor: '#663297'
                            }}
                            inactiveDotStyle={{
                                // Define styles for inactive dots here
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            >
                            </Pagination>
                        }
                    {
                        displayFolders.length > 0 &&
                        <View style={[customstyles.row, customstyles.mt10, { justifyContent: "space-between" }]}>
                                <TouchableOpacity onPress={showDialog} style={customstyles.btnThemexs}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Ionicons name="add-outline" size={20} color="#662397" />
                                        <Text style={{color: "#662397"}}> Add Folder</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteFolder()} style={customstyles.btnThemexs}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Ionicons name="remove" size={20} color="#662397" />
                                        <Text style={{color: "#662397"}}> Delete Folder</Text>
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