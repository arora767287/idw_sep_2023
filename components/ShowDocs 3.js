import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text,Image, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import * as ImagePicker from 'expo-image-picker';
import DocumentPicker from "react-native-document-picker";
import { commonPost, getCategories } from "../components/functions.js";
import  ModelAlert  from './ModelAlert';
import FileViewer from "react-native-file-viewer";
import RNDocumentScanner from "react-native-document-scanner";
import RNFS from 'react-native-fs';
import Dialog from "react-native-dialog";
import { Picker } from "@react-native-picker/picker";
const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT);
import AsyncStorage from '@react-native-async-storage/async-storage';
function ShowDocs({ user_id, folder_id, folder_name, navigation, route }) {

    const [activeIndex, setActiveIndex] = useState(0);
    const ref = React.useRef(null); 
      let scanner = useRef(null);
    const [userId, setUserId] = React.useState('');
    const [folderId, setFolderId] = React.useState('');
    const [folderName, setFolderName] = React.useState('');
    const [image_base64, setImageBase] = React.useState([]);
    const [doccategory, setDoccategory] = React.useState([]);
    const [base64image, setbase64image] = React.useState('');
    const [documents, setDocuments] = React.useState('');
    const [DataisLoaded, setDataisLoaded] = useState(false);
    const [docTitle, setDocTitle] = useState('');
    const [fieldErr, setFieldErr] = useState('');
    const [successResp, setResponse] = useState('');
    const [isCropping, setisCropping] = useState(false);
    const [visible, setvisible] = useState(false);
    const [visible1, setvisible1] = useState(false);
    const [checkdelstatus, setcheckdelstatus] = useState(false);
    const [checkcatstatus, setcheckcatstatus] = useState(false);
    const [docId, setDocId] = useState('');
    const [doccat, setDoccat] = useState(0);
    const [filename, setFilename] = useState('');
    const [categorylist, setCategorylist] = useState('');
    const [categorystatus, setCategorystatus] = useState(1);
    let timeout;
    React.useEffect(() => {
        const value = AsyncStorage.getItem('userInfo')
        .then((value) => {
            let userData = JSON.parse(value);
            setUserId(userData.id);
        });
        clearTimeout(timeout);
      timeout = setTimeout(() => {
       // console.log("folder_id000000000000"+folder_id)
        setFolderId(folder_id);
        setFolderName(folder_name);
        getDocs(userId, folder_id);
        getCategories(userId,folder_id);
       }, 1000);
       
    }, [documents]);
    // Docs Listng Api
    let getCategories = async (userId, folderId) => {
        let data = {
            user_id: userId,
            folder_id: folderId,
            api_url: 'getSingleDocs'
        }
        try{
            const result = await commonPost(data)
            setTimeout(() => {
                if ((result.status == 0)) {
                    setCategorylist([]);
                } else {
                    setCategorylist(result.data);
                }
                console.log(result.data)
                console.log("categorylist"+categorylist)
            }, 2000)
            setTimeout(() => {
                setDataisLoaded(true);
            }, 1000)
        }
        catch(error){
            console.log(error);
        }
    }
    // Close
    // Docs Listng Api
    let getDocs = async (userId, folderId) => {
        let data = {
            user_id: userId,
            folder_id: folderId,
            api_url: 'getFileList'
        }
        try{
            const result = await commonPost(data)
            setTimeout(() => {
                if ((result.status == 0)) {
                    setDocuments([]);
                } else {
                    setDocuments(result.data);
                }
                console.log(result.data)
                console.log("documents"+documents)
            }, 2000)
            setTimeout(() => {
                setDataisLoaded(true);
            }, 1000)
        }
        catch(error){
            console.log(error);
        }
    }
    // Close

    // Image Picker
    let scanfun = async () => {
       
      setvisible(true)
       setImageBase('');
   
    }
    let pickImage = async () => {
        setbase64image('');
        setImageBase('');
        setvisible1(false)
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        } else {
            try {
                const res = await DocumentPicker.pick({
                   type: [DocumentPicker.types.allFiles],
                });
                console.log(
                  res[0].uri
                );
                console.log(
                    res
                  );
                  setFilename(res[0].name)
                  RNFS.readFile(res[0].uri, 'base64')
                  .then(res =>{
                 // console.log(res);
                  setImageBase(`data:image/jpg;base64,${res}`)
                  });
               // this.uploadAPICall(res);//here you can call your API and send the data to that API
              } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                  console.log("error -----", err);
                } else {
                  throw err;
                }
              }
            // let result = await ImagePicker.launchImageLibraryAsync({
            //     mediaTypes: ImagePicker.MediaTypeOptions.All,
            //     allowsEditing: true,
            //     aspect: [4, 3],
            //     quality: 1,
            //     base64: true,
            // });
            // let imageUri = result ? `data:image/jpg;base64,${result.base64}` : null;
            // setImageBase(imageUri);

        }

    };
    // Close 
   let setCatfun = (value) => {
        console.log(value);
        setDoccat(value)
    }
    // Upload Docs
    let submitDocument = () => {
        let user_id = userId;
        let doc_title = docTitle;
        let folder_id = folderId;
        let base_64 = '';
        if(isCropping){
             base_64 = base64image;
        }else{
          base_64 = image_base64;
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
            user_id: user_id,
            folder_id: folder_id,
            doc_cat_id: doccat,
            api_url: 'checkCategory'
        }
        console.log(data);
        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                console.log(result);
                let status = result.status;
                let message = result.message;
                if ((status === 1)) {
                    setcheckcatstatus(true);
                } else {
                    submitform(1)
                }
            })
            .catch((error) => {
                console.log(error)
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
        let doc_title = docTitle;
        let folder_id = folderId;
        let base_64 = '';
        if(isCropping){
             base_64 = base64image;
        }else{
          base_64 = image_base64;
        }
        let data = {
            user_id: user_id,
            folder_id: folder_id,
            document: base_64,
            doc_title: doc_title,
            filename: filename,
            doc_cat_id: doccat,
            catstatus: catstatus,
            api_url: 'uploadDoc'
        }
        console.log(data);
       var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                console.log(result);
                let status = result.status;
                let message = result.message;
                if ((status === 1)) {
                    setResponse(message);
                    setDocTitle('');
                    setDoccat(0);
                    setImageBase('');
                    getDocs(user_id, folder_id);
                    setTimeout(() => {
                        setResponse('');
                    }, 3000)
                } else {
                    setFieldErr(message);
                    setDocTitle('');
                    setTimeout(() => {
                        setFieldErr('');
                    }, 3000)
                }
            })
            .catch((error) => {
                console.log(error)
            })
     }

    function closepopup() {
        setvisible(false)
    }
    function _handlePressCrop() {
        if(isCropping){
      _startImageCropping()
    }else{
        alert("Capture Image first");
    }
    }
    let _startImageCropping = () => {
       
        scanner.cropImage().then(({ image }) => {
        RNFS.readFile(image, 'base64')
        .then(res =>{
        console.log(res);
        setbase64image(`data:image/jpg;base64,${res}`)
        });
        setvisible(false)
        setvisible1(true)
      });
    
    }
    
    // Close
 // View document file
 let getfile = (url) => {
      const f2 = url.split("/");
      const fileName = f2[f2.length - 1];
        const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: url,
        toFile: localFile,
      };
   console.log(localFile)
      RNFS.downloadFile(options)
        .promise.then(() => FileViewer.open(localFile))
        .then(() => {
        console.log("sucess")
        })
        .catch((error) => {
          console.log(error)
        });
     }
    // Delete User File
    let deleteUserFile = (doc_id) => {
        setDocId(doc_id)
        setcheckdelstatus(true)
         }
       
         let confirmDelfile = () => {
            setcheckdelstatus(false)
            let data = {
                doc_id: docId,
                user_id: userId,
                folder_id: folderId,
                api_url: 'deleteFile'
            }
            console.log(data);
            var resp = commonPost(data)
                .then(resp => {
                    setDocId('')
                    let result = resp;
                    let status = result.status;
                    let message = result.message;
                    //console.log(result);
                    if ((status == 1)) {
                        setResponse(message);
                        setTimeout(() => {
                            setResponse('');
                        }, 3000)
                        getDocs(userId, folderId);
                    } else {
                        setResponse(message);
                        setTimeout(() => {
                            setResponse('');
                        }, 3000)
                    }
                })
                .catch((error) => {
                    setDocId('')
                    console.log(error)
                })
        }


    
    let cancelDelfile = () => {
        setcheckdelstatus(false)
    }

    // Close

    if (!DataisLoaded) {
        return <Loader />;
    }
    return (
        
        <SafeAreaView style={styles.scrollArea}>
           
            <View style={styles.innerView}>
            <ModelAlert
         Alert_Visibility={checkdelstatus}
         cancelAlertBox={cancelDelfile}
         title={"Delete File"}
         body={"Are you sure you want to delete this file?"}
         confirmalert={confirmDelfile}
         />

        <ModelAlert
         Alert_Visibility={checkcatstatus}
         cancelAlertBox={cancelcatstatus}
         title={"Document Category"}
         body={"This category already exists. Do you update?"}
         confirmalert={canfirmcatstatus}
         />
                <View >
                    <View style={{ ...customstyles.whitebox, ...customstyles.mx10, ...customstyles.my15, ...customstyles.p15 }}>
                    <Dialog.Container visible={visible}>
                              <RNDocumentScanner
                              ref={(ref) => (scanner = ref)}
                               onStartCapture={() => {}}
                               onEndCapture={() =>{ setisCropping(true)}
                               }
                               androidCameraPermissionOptions={{
                                 title: "Permission to use camera",
                                 message: "We need your permission to use your camera",
                                 buttonPositive: "Ok",
                                 buttonNegative: "Cancel",
                               }}
                             />
                                <Dialog.Button label="Cancel" onPress={closepopup} style={{...customstyles.btnRedxs,...{marginRight:35}}} />
                             <Dialog.Button  label="Validate" onPress={_handlePressCrop} style={{  ...customstyles.btnThemexs, ...{marginRight:25} }} />
                        </Dialog.Container>
                        {
            visible1 && <Image style={{width: 250, height: 250}} source={{uri: base64image}}/> 
                    }
                        {
             image_base64 != '' && <Image style={{width: 250, height: 250}} source={{uri: image_base64}}/> 
                    }
                        {
                            documents.length > 0 ?
                            <View>
                                <Text style={{alignSelf: "flex-start", color: "grey", fontSize: 15}}>All Documents</Text>
                            </View>:
                            <View>
                                <Text style={{textAlign: "center", color: "grey", fontSize: 10}}>No Documents Yet</Text>
                            </View>

                        }
                        {
                            documents.length > 0 &&
                           
                            <View>
                              { 
                               documents.map((item, index) => (
                                <View key={index} style={{...customstyles.checkboxlist, ...customstyles.mb5}}>
                <TouchableOpacity onPress={() => getfile(item.path)} >
                <Text style={{...customstyles.mr10,}}>{item.document_title}</Text></TouchableOpacity>
                <View key={item.id} style={{...customstyles.upright,...customstyles.mr5, ...{marginTop: 8,}}}>
                    <TouchableOpacity style={{ ...customstyles.uprightDelete }} onPress={() => deleteUserFile(item.id)} >
                        <Ionicons name="close-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View> 
                               ))
                              }
                               
                            </View>
                        }

                    </View>
                  
                    <View style={{ ...customstyles.whitebox,...customstyles.mx10, ...customstyles.mb15, ...customstyles.p15 }}>
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
                            <Text style={{ ...customstyles.h5, ...customstyles.mb5 }}>Title</Text>
                            <TextInput
                                placeholder={'Document Name'}
                                onChangeText={(docTitle) => setDocTitle(docTitle)}
                                style={customstyles.inputtheme}
                            />
                        </View>
                        <View>
                            <Text style={{ ...customstyles.h5, ...customstyles.mb5 }}>Category</Text>
                            <View style={customstyles.dropdownBoxTheme}>
                             <Picker
                                selectedValue={doccat}
                                onValueChange={(value, index) => setCatfun(value)}
                                mode="dropdown" // Android only
                                style={customstyles.dropdowntheme} dropdownIconColor='#663792'
                            >
                                <Picker.Item label="Select Category" value="" color='black' />
                                {
                                   categorylist ?
                                   categorylist.map((item, i) => (
                                            <Picker.Item key={i} label={item.doc_name} selectedValue={doccat == item.id ? true : false} value={item.id} color='black' />
                                        ))
                                        : <Picker.Item label='No Data' value='0' color='black' />
                                }
                            </Picker> 
                        </View>
                        </View>
                        <TouchableOpacity onPress={submitDocument} style={customstyles.mb10}>
                            <Text style={customstyles.btnThemexs}>SUBMIT DOCUMENT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    innerView: {
        height: "100%",
        paddingHorizontal: 10,
    }, container: {
        flex: 1,
      },
});

export default ShowDocs;


