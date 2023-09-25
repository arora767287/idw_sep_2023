import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import * as ImagePicker from 'expo-image-picker';
import { commonPost, getImages, getOneImage, getRecList, commonFilePost, uploaddoc, commonPostText} from "../components/functions.js";
import Carousel , {Pagination} from "react-native-snap-carousel";
import Background from './Background';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import * as FileSystem from 'expo-file-system';
import * as Linking from "expo-linking";
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";
import DocumentScanner from 'react-native-document-scanner-plugin'
import { SYSTEM_BRIGHTNESS } from 'expo-permissions';
import { ListObjectsRequest } from '@aws-sdk/client-s3';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";
import { offerDetails } from './functions 2';
import * as Progress from 'react-native-progress';
import mergeImages from 'merge-images'

const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT);
function ShowDocs({ user_id, folder_id, folder_name, navigation, route, active, parentCall }){
    const [activeIndex, setActiveIndex] = useState(0);
    const [change, setChange] = useState(false);
    const [allDocs, setListAllDocs] = useState([]);
    const [thisURI, setThisURI] = useState("");
    const [scannedImage, setScannedImage] = useState();
    const [progArr, setProgArr] = useState([]);
    let scanner = useRef(null);
    const ref = React.useRef(null);
    const renderItem = React.useCallback(({ item, index }) => (
        index == activeIndex + 1 || index == activeIndex || index == activeIndex - 1 ?
            <TouchableOpacity key={index} style={{...customstyles.checkboxlist, ...customstyles.mb5}} onPress={() => getfile(item.path, true)}>
                <Text style={{...customstyles.mr10,}}>{item.document_title}</Text>
                <View key={item.id} style={{...customstyles.upright,...customstyles.mr5, ...{marginTop: 8,}}}>
                    <TouchableOpacity style={{ ...customstyles.uprightDelete }} onPress={() => deleteUserFile(item.id, userId, folder_id)} >
                        <Ionicons name="close-outline" size={24} color="#20004A" />
                    </TouchableOpacity>
                </View>
                <Progress.Bar progress={progArr[index]} width={100} animationType= "spring" color="#00ADF0" unfilledColor="cbb8d9" borderColor="white" borderWidth={3} alignSelf="center" />
            </TouchableOpacity> :
            <View>
            </View>
      ), []);

    const [userId, setUserId] = React.useState('');
    const [folderId, setFolderId] = React.useState('');
    const [folderName, setFolderName] = React.useState('');
    const [image_base64, setImageBase] = React.useState([]);
    const [base64image, setbase64image] = React.useState('');
    const [documents, setDocuments] = React.useState('');
    const [DataisLoaded, setDataisLoaded] = useState(false);
    const [docTitle, setDocTitle] = useState('');
    const [fieldErr, setFieldErr] = useState('');
    const [successResp, setResponse] = useState('');
    const [docCategory, setDocCategory] = useState('');
    const [docCategoryValue, setDocCategoryValue] = useState(0);
    const [dropdownData, setDropdownData] = React.useState([]);
    const [isFocus, setFocus] = useState(dropdownData.length == 0);
    const [isCropping, setisCropping] = useState(true);
    const [visible, setvisible] = useState(false);
    const [visible1, setvisible1] = useState(false);
    const [downloaded, setDownloaded] = useState([]);
        const [checkdelstatus, setcheckdelstatus] = useState(false);
    const [checkcatstatus, setcheckcatstatus] = useState(false);
    const [filename, setFilename] = useState('');
    const [reload, setReload] = useState(false);
    var fileDict = {};
    var trueDict = {};

    const currImage = require("../assets/Images/new_background.jpg");

    React.useEffect(() => {

        const curr = AsyncStorage.getItem('userInfo')
        .then((value) => {
            let userData = JSON.parse(value);
            let currUser = userData.id;
            let folderId = folder_id;
            let folderName = folder_name ? folder_name : '';

            if(active){
                setTimeout(() => {
                    setDataisLoaded(false);
                    setReload(false);
                }, 250);
                setTimeout(() => {
                setUserId(currUser);
                setFolderId(folderId);
                setFolderName(folderName);
                getDocs(currUser, folderId);
                getDocNames();
                allDocIds();
                }, 500);
            }
        }).catch((error) => {
            throw error;
        })
    }, []); //reload every time the documents array changes?? Needed or not?


    let renderDropdown = () => {
            return(
                <View>
                    <Text style={{ ...customstyles.h5, ...customstyles.mb5, color: "#20004A"}}>Category</Text>
                    <View style={[styles.container, {borderColor: "grey", borderWidth: 2, marginBottom: 10, borderRadius: 10}]}>
                        <Dropdown
                        style={[styles.dropdown, {borderColor: 'white', borderWidth: 2 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={{...styles.inputSearchStyle}}
                        iconStyle={styles.iconStyle}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Document Category': ''}
                        searchPlaceholder="Search..."
                        value={docCategoryValue}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        onChange={(item) => {
                            //(item)
                            setDocCategory(item.label);
                            setDocCategoryValue(item.value);
                            setFocus(false);
                            //(docCategoryValue);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                            style={styles.icon}
                            color={isFocus ? 'white' : 'white'}
                            name="Safety"
                            size={20}
                            />
                        )}
                        />
                    </View>
                </View>
            )
    }

    // Docs Listng Api
    let viewDocument = async (folder_id, user_id, document_location, document_title) => {
        try{
            var imageShow = getOneImage(folder_id, user_id, document_location);
            //(imageShow)
            //navigation.navigate("ViewDocument", {imageShow: imageShow, docTitle: docTitle})

        }
        catch(error){
            //(error);
        }
    }
    let getDocs = async (userId, folderId) => {
        let data = {
            user_id: userId,
            folder_id: folder_id,
            api_url: 'getFileList'
        }
        try{
            const result = await commonPost(data)
            if ((result.status == 0)) {
                setDocuments([]);
                setReload(false)
            } else {
                console.log("DocumentsStatus", result);
                setDocuments(result.data);

                let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
                allTaskIds = [] 
                for(let task of lostTasks){
                    allTaskIds.push(task.id);
                }
                for(let i = 0; i< result.data.length; i++){
                    const f2 = result.data[i].path.split("/");
                    const dotSplit = f2[f2.length-1].split(".");
                    const fileEnding = dotSplit[dotSplit.length - 1];
                    var fileName = f2[f2.length - 1]
                    fileName += "." + fileEnding;
                    console.log("Downloading file to: ",  `${RNBackgroundDownloader.directories.documents}/${fileName}`)
                    if(!allTaskIds.includes(`${RNBackgroundDownloader.directories.documents}/${fileName}`)){
                        let task = RNBackgroundDownloader.download({
                            id: base64image.name + "." + fileEnding,
                            url: result.data[i].path,
                            destination: `${RNBackgroundDownloader.directories.documents}/${fileName}`
                          }).begin((expectedBytes) => {
                            console.log(`Going to download ${expectedBytes} bytes!`);
                          }).progress((percent) => {
                            console.log(`Downloaded: ${percent * 100}%`);
                          }).done(() => {
                            downloaded.push(result.data[i].fileName);
                            console.log('Download is done!');

                          }).error((error) => {
                            console.log('Download canceled due to error: ', error);
                        });
                        console.log("DocumentsStatusNew", result.data);
                    } else {
                        result.data[i].prog = 100;
                        console.log("DocumentsStatusNew", result.data);
                    }

                    //trueDict[result.data[i].path] = true;
                    //fileDict[result.data[i].path] = getfile(result.data[i].path, false);
                }
                setReload(true)
            }
            console.log("AllDocuments: ", result.data)
            //("documents"+documents)
        }
        catch(error){
            setTimeout(() => {
                setFieldErr("Could not load documents, please try again later.")
            }, 1000)
            throw error;
            //(error)
        }
    }

    let doc_cat_search = (doc_catId) => {
        try{
            var listAll = [];
            for(let i = 1; i < 8; i++) {
                getRecList(i).then((listOptions) => {
                    listOptions.data.map((dataOption) => {
                        if(dataOption.value == doc_catId){
                            return dataOption.doc_name;
                        }
                    });
                })
            }
        }
        catch(error){
            console.log(error);
        }
    }

    let allDocIds = () => {
        try{
            setTimeout(() => {
                var listAll = [];
                //DANGER, HARDCODED VALUES
                for(let i = 1; i < 8; i++) {
                    getRecList(i).then((listOptions) => {
                        console.log("List Options: ", listOptions);
                        listOptions.data.map((dataOption) => {
                            listAll.push({label: dataOption.doc_name, value: dataOption.id})
                        });
                    }).catch((error) => {
                        throw error;
                    })
                }
                setDataisLoaded(true);
            }, 500);
        }
        catch(error){
            //(error);
        }
    }


    let getDocNames = () => {
        console.log("All Names:")
        try{
            var listAll = [];
            getRecList(folder_id).then((listOptions) => {
                console.log("FirstOne");
                console.log(listOptions);
                ("List Options: ", listOptions.data);
                listOptions.data.map((dataOption) => {
                    listAll.push({label: dataOption.doc_name, value: dataOption.id})
                });
                setDropdownData(listAll);
            }).catch((error) => {
                console.log("New Error: ");
                console.log(error);
            })
            //("Dropdown Data: ", dropdownData);
        }
        catch(error){
            //("Getting dropdown");
            //(error.stack);
            console.log(error.stack);
        }
    }
    // Close

    // Image Picker
    let scanfun = async () => {
        //("Scanning");
        setvisible(true)
        setImageBase('');
        const { scannedImages } = await DocumentScanner.scanDocument()
  
        // get back an array with scanned image file paths
        if(scannedImages.length > 0){

            setScannedImage(scannedImages[scannedImages.length - 1])
            console.log("Scanned ", scannedImages[scannedImages.length - 1])
            FileSystem.readAsStringAsync(scannedImages[scannedImages.length - 1], {"encoding": 'base64'})
            .then(res =>{
              var newName = res.substring(0, 10);
              console.log("Current Name", newName)
              var fullJSON = {}
              fullJSON["uri"] = `data:image/jpg;base64,${res}`
              fullJSON["type"] = "image/png"
              fullJSON["name"] = "Scanned Image Input"
              setbase64image(fullJSON);
              setResponse("Document Scanned");
            }).catch((error) => {
                throw error;
            })
        }
    }
    let pickImage = async () => {
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
                //("URI Found");
                setTimeout(() => {
                    setbase64image(res);
                    setFilename(res.name)
                    setResponse("Document Selected");
                    console.log("Res Name: ", res.name)
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
    // Close 

    // Upload Docs
    let submitDocument = () => {
        let user_id = userId;
        let doc_title = docTitle + " (" + docCategory + ")";
        let folder_id = folderId;
        let base_64 = '';
        base_64 = base64image;
        if(base_64.name == "Scanned Image Input"){
            base_64.name = doc_title + ".png";
        }
        if ((base_64 == '')) {
            setFieldErr('Please Upload a Document');
            setTimeout(() => {
                setFieldErr('');
            }, 1000);
            return;
        }
        if ((doc_title == '')) {
            setFieldErr('Document title is required to upload a Document');
            setTimeout(() => {
                setFieldErr('');
            }, 1000);
            return;
        }
        if ((doc_title != '') && (base_64 != '')) {
            setcheckcatstatus(true);
        let data = {
            user_id: userId,
            folder_id: folder_id,
            doc_cat_id: docCategoryValue,
            api_url: 'checkCategory'
        }
        ////(data);
        var resp = commonFilePost(data)
            .then(resp => {
                let result = resp;
                //(resp);
                
                let status = result.status;
                //("Status: " + status);
                let message = result.message;
                if ((status == 1)) {
                    setcheckcatstatus(true);
                    Alert.alert(
                        'Add file to current category',
                        'Are you sure you want to add another file to this category?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => cancelcatstatus(),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => canfirmcatstatus() },
                        ]
                    );
                } else {
                    submitform(1)
                }
            })
            .catch((error) => {
                //(error)
                setResponse("Internet issues. Please try again.");
                setTimeout(() => {
                    setResponse("");
                }, 1000)
                throw error;
            })
        }
    }
    let canfirmcatstatus = () => {
        submitform(1);
        setcheckcatstatus(false);
    }
    let cancelcatstatus = () => {
        submitform(2);
        setcheckcatstatus(false);
    }
    let submitform = (catstatus) => {
        let user_id = userId;
        let doc_title = ""
        if(docCategory != ""){
            doc_title = docTitle + " (" + docCategory + ")";
        } else {
            doc_title = docTitle;
        }
        let folder_id = folderId;

        let formData = new FormData();
        console.log("Is it base64?");
        var currDoc = {
            uri:base64image.uri,
            type:base64image.type,
            name:base64image.name
        };
        var base_64 = base64image;
        var currName = base_64.name;
        currName = currName.replace(/ /g,"_");
        console.log("Curr Final name", currName)
        base_64.name = currName;
        setFilename(base_64.name)
        setbase64image(base_64);

        formData.append('document', currDoc);
        formData.append('user_id',userId);
        formData.append('folder_id',folderId);
        formData.append('doc_title',doc_title);
        formData.append('filename',base_64.name);
        formData.append('doc_cat_id',docCategoryValue);
        formData.append('catstatus',catstatus);
        console.log("Curr FileName", base64image.name);
        setResponse("Document uploading (you don't have to wait, don't worry!)...");
        //setDataisLoaded(false);
       var resp = uploaddoc(formData)
            .then(resp => {
                let result = resp;
                console.log("Current Response: ", resp);
                let status = resp.status;
                let message = result.message;
                console.log("Result status", status);
                if ((status == 1)) {
                    console.log("User ID: ", userId);
                    console.log("Folder ID: ", folderId)
                    setDocTitle('');
                    setDocCategoryValue(0);
                    setImageBase('');
                    setResponse("Document uploaded successfully!");
                    getDocs(userId, folderId)
                    setTimeout(() => {
                        setResponse('');
                    }, 2000)
                } else {
                    setFieldErr(message);
                    setDocTitle('');
                    setTimeout(() => {
                        setFieldErr('');
                        setDataisLoaded(true);
                    }, 3000)
                }
                parentCall();
            })
            .catch((error) => {
                console.log("Current Error: ", error);
                throw error;
            })
     }
    // Close

    //View Document File
    
    let getfile = async (url, openFile) => {
        const f2 = url.split("/");
        const dotSplit = f2[f2.length-1].split(".");
        const fileEnding = dotSplit[dotSplit.length - 1];
        //(fileEnding)
        //(typeof(fileEnding));
        var fileName = f2[f2.length - 1]
        if(!downloaded.includes(fileName)){
            downloaded.push(fileName);
            Alert.alert(
                'Downloading File',
                'We have prepared this file for download. Come back in a minute or two again.',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => {} },
                ]
            );

        } 
        else {
            setTimeout(() => {
                setDataisLoaded(false);
            }, 10);
            console.log("curr File Name", fileName);
            fileName += "." + fileEnding;
    
            try{
                let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
                for(let task of lostTasks){
                    allTaskIds.push(task.id);
                }
                FileViewer.open(`${RNBackgroundDownloader.directories.documents}/${fileName}`, {showOpenWithDialog: true}).then(() => {
                    //("Opened file");
                    currDate = new Date();
                    console.log("Download opened")
                    console.log(currDate.toLocaleTimeString());
                    setDataisLoaded(true);
                })
            }
            catch(error){
                throw error;
            }
        }

        /*const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        const options = {
            fromUrl: url,
            toFile: localFile,
        };
        RNFS.downloadFile(options).promise.then(() => FileViewer.open(localFile))
            .then(() => {
                // success
            })
        .catch((error) => {
            // error
        });*/
        /*
        console.log("File Dict");
        console.log(fileDict);
        if(openFile && trueDict.has(url)){
            FileViewer.open(fileDict[url], {showOpenWithDialog: true}).then(() => {
                //("Opened file");
                currDate = new Date();
                console.log("Download opened")
                console.log(currDate.toLocaleTimeString());
                setDataisLoaded(true);
            }).catch((error) => {
                throw error;
            })
        } else {
            //const localFile = `${FileSystem.documentDirectory}${fileName}`;
            currDate = new Date();
            console.log("Download Created")
            console.log(currDate.toLocaleTimeString());
            //let dirs = RNFetchBlob.fs.dirs;
            RNFetchBlob
            .config({
                // response data will be saved to this path if it has access right.
                IOSBackgroundTask: true,
                fileCache: true,
                appendExt: fileExt
                //path : dirs.DocumentDir + `/${fileName}`
            })
            .fetch('GET', url, {
            })
            .then((res) => {
                // the path should be dirs.DocumentDir + 'path-to-file.anything'
                console.log('The file saved to ', res.path())
                currDate = new Date();
                console.log("Download downloaded")
                console.log(currDate.toLocaleTimeString());
                //('Finished downloading to ', uri);
                if(openFile && !fileDict.has(url)){
                    FileViewer.open(res.path(), {showOpenWithDialog: true}).then(() => {
                        //("Opened file");
                        currDate = new Date();
                        console.log("Download opened")
                        console.log(currDate.toLocaleTimeString());
                        setDataisLoaded(true);
                    }).catch((error) => {
                        throw error;
                    })
                } else { //Just load the file, it hasn't been clicked yet
                    //Put in a queue of files for this particular folder to retrieve
                    return res.path(); //puts the path in the JSON file 
                }
            })
        }*/


        /*
        const finalDest = `${RNBackgroundDownloader.directories.documents}/${fileName}`;
        let task = RNBackgroundDownloader.download({
            id: 'file123',
            url: url,
            destination: `${RNBackgroundDownloader.directories.documents}/${fileName}`
        }).begin((expectedBytes) => {
            console.log(`Going to download ${expectedBytes} bytes!`);
        }).progress((percent) => {
            console.log(`Downloaded: ${percent * 100}%`);
        }).done(() => {
            currDate = new Date();
            console.log("Download downloaded")
            console.log(currDate.toLocaleTimeString());
            //('Finished downloading to ', uri);
            FileViewer.open(finalDest, {showOpenWithDialog: true}).then(() => {
                //("Opened file");
                currDate = new Date();
                console.log("Download opened")
                console.log(currDate.toLocaleTimeString());
                setDataisLoaded(true);
            }).catch((error) => {
                throw error;
            })
            console.log('Download is done!');
        }).error((error) => {
            console.log('Download canceled due to error: ', error);
        });

        // Pause the task
        //task.pause();

        // Resume after pause
        //task.resume();

        // Cancel the task
        //task.stop();
        */

        /*
        const options = {
          fromUrl: url,
          toFile: localFile,
        };
     //(localFile)
     //File download snippet
        const downloadResumable = FileSystem.createDownloadResumable(
            options.fromUrl,
            options.toFile,
            {});
        
        var currDate = new Date();
        console.log("Download created")
        console.log(currDate.toLocaleTimeString());
        try{
            setTimeout(() => {
                downloadResumable.downloadAsync().then((uri) => {
                    currDate = new Date();
                    console.log("Download downloaded")
                    console.log(currDate.toLocaleTimeString());
                    //('Finished downloading to ', uri);
                    FileViewer.open(uri, {showOpenWithDialog: true}).then(() => {
                        //("Opened file");
                        currDate = new Date();
                        console.log("Download opened")
                        console.log(currDate.toLocaleTimeString());
                        setDataisLoaded(true);
                    }).catch((error) => {
                        throw error;
                    })
                });
            }, 2000)
            //const { uri } = await downloadResumable.downloadAsync();
        }
        catch(error){
            //(error);
            throw error;
        }
        */
       }
    

    // Delete User File
    let deleteUserFile = async (doc_id, userId, folder_id) => {
        //(userId, "ThisUser")

        Alert.alert(
            'Delete File',
            'Are you sure you want to delete this file?',
            [
                {
                    text: 'Cancel',
                    onPress: () => ('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => confirmDel(userId, folder_id) },
            ]
        );

        let confirmDel = async (userId, folderId) => {
            var user_id = "";
            const curr = AsyncStorage.getItem('userInfo')
            .then((value) => {
                let userData = JSON.parse(value);
                user_id = userData.id;
            let data = {
                doc_id: doc_id,
                user_id: user_id,
                folder_id: folder_id,
                api_url: 'deleteFile'
            }

            //(data);
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                        let status = result.status;
                        let message = result.message;
                        console.log("Message: ");
                        console.log(message);
                        setTimeout(() => {
    
                        }, 3000);
                        if ((status == 1)) {
                            setResponse(message);
                            setTimeout(() => {
                                setResponse('');
                            }, 3000)
                            getDocs(userId, folder_id);
                        } else {
                            setResponse("Internet issues. Please try again.");
                            setTimeout(() => {
                                setResponse('');
                            }, 3000)
                        }
                        parentCall();
                })
                .catch((error) => {
                    //(error)
                    throw error;
                })
        }).catch((error) => {
            throw error;
        })
    }
}
    // Close

    if (!DataisLoaded) {
        return <Loader />;
    }
    return (
        <View>
            <View>
                {!DataisLoaded ? 
                <Loader/> :
                <View></View>
                }
            </View>
            <SafeAreaView style={styles.scrollArea}>
                <View style={styles.innerView}>
                    <View >
                        <View style={{ ...customstyles.whitebox, ...customstyles.mx10, ...customstyles.my15, ...customstyles.p15, borderRadius: 10, borderColor: "white", borderWidth: 2}}>
                            {
                                documents.length > 0 ?
                                <View>
                                    <Text style={{alignSelf: "flex-start", color: "#662397", fontSize: 15}}>All Documents</Text>
                                </View>:
                                <View>
                                    <Text style={{...customstyles.filterContainer, padding: 20, borderRadius: 16, textAlign: "center", fontSize: 10}}>No Documents Yet</Text>
                                </View>

                            }
                            {
                                documents.length > 0 &&
                                documents.map((item, index) => (
                                    <TouchableOpacity key={index} style={{...customstyles.checkboxlist, ...customstyles.mb5, borderWidth: 2}} onPress={() => getfile(item.path)}>
                                        <Text style={{...customstyles.mr10,}}>{item.document_title}</Text>
                                        <View key={item.id} style={{...customstyles.upright,...customstyles.mr5, ...{marginTop: 8,}}}>
                                            <TouchableOpacity style={{ ...customstyles.uprightDelete }} onPress={() => deleteUserFile(item.id, userId, folder_id)} >
                                                <Ionicons name="close-outline" size={24} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity> 
                                ))
                                /*
                                <View>
                                    <Carousel
                                    layout="default"
                                    ref={ref}
                                    data={documents}
                                    sliderHeight={70}
                                    style={{alignSelf: "center", justifyContent: "center"}}
                                    itemWidth={ITEM_WIDTH}
                                    itemHeight={70}
                                    renderItem={renderItem}
                                    onSnapToItem={(index) => setActiveIndex(index)}
                                    vertical={true}
                                    />
                            </View>*/
                            }
                        </View>

                        <View style={{ ...customstyles.whitebox,...customstyles.mx10, ...customstyles.mb15, ...customstyles.p15, borderWidth: 0, backgroundColor: "transparent" }}>
                            <View>
                                {
                                    fieldErr != '' && <Text style={{ ...customstyles.mb10, ...customstyles.textred }}>{fieldErr}</Text>
                                }

                                {
                                    successResp != '' && <Text style={{ ...customstyles.mb10, ...customstyles.textgreen }}>{successResp}</Text>
                                }
                            </View>
                            <View style={{...customstyles.mb10, display: "flex", flexDirection: "row", flex: 1}}>

                                <TouchableOpacity onPress={scanfun} style={{ ...customstyles.py15, ...customstyles.bgtheme, ...customstyles.rowverticalcenter, ...customstyles.textCenter, ...customstyles.radius10, flex: 0.5, marginRight: 10}}>
                                    <Ionicons name="scan" size={20} color="#fff"></Ionicons>
                                    <Text style={{ ...customstyles.h5, ...customstyles.textwhite, ...customstyles.ml10, fontSize: 20}}>Scan</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickImage} style={{ ...customstyles.py15, ...customstyles.bgtheme, ...customstyles.rowverticalcenter, ...customstyles.textCenter, ...customstyles.radius10, flex: 0.5}}>
                                    <Ionicons name="cloud-upload-outline" size={20} color="#fff"></Ionicons>
                                    <Text style={{ ...customstyles.h5, ...customstyles.textwhite, ...customstyles.ml10, fontSize: 20}}>Upload</Text>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <Text style={{ ...customstyles.h5, ...customstyles.mb5, color:"white"}}>Title</Text>
                                <TextInput
                                    placeholder={'Document Name'}
                                    onChangeText={(docTitle) => setDocTitle(docTitle)}
                                    style={[customstyles.inputtheme, {...customstyles.filterContainer, flexDirection: "column", borderRadius: 10, borderColor: "white",  color: "white"}]}
                                />
                                {

                                }
                                {
                                    dropdownData.length > 0 &&
                                    renderDropdown()
                                }
                            </View>
                            <TouchableOpacity onPress={submitDocument} style={[customstyles.mb10, {borderColor: "white", borderRadius: 10}]}>
                                <Text style={[customstyles.btnThemexs, {color: "#20004A"}]}>SUBMIT DOCUMENT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView >
        </View>
    )
}

const styles = StyleSheet.create({
    scrollArea: {
        flex: 1,
        width: "100%",
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 10,
    },
    dropdown: {
        height: 50,
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
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
        color: "#20004A"
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
});

export default ShowDocs;


