import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
const image_logo = require('../assets/Images/logo_old+found.png');
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from "rn-fetch-blob";
import { commonPost } from "./functions.js";
// 23.09.2020
function HomeScreen({ navigation }) {

  const [userInfo, setUserInfo] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState([]);
  const [listDocs, setListDocs] = React.useState([]);
  const [displayFolders, setDisplayFolders] = React.useState([]);


  useEffect(() => {
    checkLogin();
  }, []);


  const getFolders = (user_id) => {
      let data = {
          id: user_id,
          api_url: 'getFolderName'
      }
      const newResponse = commonPost(data)
      .then(resp => {
          console.log("resp.data");
          console.log(resp.data);
          if(resp.data != null){
            for(let i = 0; i< resp.data.length; i++){
              var currId = resp.data[i].id;
              getDocs(user_id, currId);
            }
          }
    
      }).catch((error) => {
          throw error;
      })
  }

  let getDocs = async (userId, folderId) => {
    let data = {
        user_id: userId,
        folder_id: folderId,
        api_url: 'getFileList'
    }
    try{
        const result = await commonPost(data)
        if ((result.status != 0)) {
            console.log("DocumentsStatus", result);
            for(let i = 0; i<result.data.length; i++){
              var currDoc = result.data[i]
              var currList = listDocs
              currList.push(currDoc)
              setListDocs(currList)
              console.log("Current ID", folderId)
              var fileName = result.data[i].document_title;
              var fileEnding = result.data[i].path.split(".")[result.data[i].path.split(".").length - 1]
              fileName += "" + result.data[i].id;
              if(fileEnding != "pdf" && fileEnding != "jpeg" && fileEnding != "jpg" && fileEnding != "png"){
                fileName += ".png";
              }
              let task = RNBackgroundDownloader.download({
                id: fileName,
                url: result.data[i].path,
                destination: `${RNBackgroundDownloader.directories.documents}/${fileName}`
              }).begin((expectedBytes) => {
                console.log(`Going to download ${expectedBytes} bytes!`);
              }).progress((percent) => {
                console.log(`Downloaded: ${percent * 100}%`);
              }).done(() => {
                console.log('Download is done!');
              }).error((error) => {
                console.log('Download canceled due to error: ', error);
              });
            }
        }
    }
    catch(error){
        setTimeout(() => {
            setFieldErr("Could not load documents, please try again later.")
        }, 1000)
        throw error;
        //(error)
    }
}


  /*let startDownloads = async (userId) => {

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
              for(let i = 0; i< result.data.length; i++){
                  trueDict[result.data[i].path] = true;
                  fileDict[result.data[i].path] = getfile(result.data[i].path, false);
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


    let task = RNBackgroundDownloader.download({
      id: 'file123',
      url: 'https://link-to-very.large/file.zip',
      destination: `${RNBackgroundDownloader.directories.documents}/file.zip`
    }).begin((expectedBytes) => {
      console.log(`Going to download ${expectedBytes} bytes!`);
    }).progress((percent) => {
      console.log(`Downloaded: ${percent * 100}%`);
    }).done(() => {
      console.log('Download is done!');
    }).error((error) => {
      console.log('Download canceled due to error: ', error);
    });
  }
  */

  let checkLogin = async () => {
    const login = await AsyncStorage.getItem('userInfo');
    if (login !== null) {
      setUserInfo(JSON.parse(login));
      getFolders(JSON.parse(login).id);
      setTimeout(() => {
        AsyncStorage.setItem('allDocs', JSON.stringify({listDocs}));
      }, 1000)
      navigation.navigate('MyTabs', {
        userDetails: userInfo
      });
    }
    /*else {
      navigation.navigate('HomeScreen');
    }*/
  }

  let loginNavigation = () => {
    navigation.navigate('LoginScreen');
  }
  let signupNavigation = () => {
    navigation.navigate('Signup');
  }


  return (
    <View style={styles.screenContainer}>

      <LinearGradient colors={['#20004A', '#20004A', '#20004A']} start={{ x: 0, y: .5 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}
      >
        <View style={customstyles.logincontainer}>
          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{...customstyles.whiteCircle, backgroundColor: "transparentw"}}>
              <Image
                source={image_logo}
                style={styles.image} />
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={loginNavigation}
              style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowverticalcenter}>
            <Text style={styles.lineseprator}></Text>
            <Text style={styles.orseprator}>OR</Text>
            <Text style={styles.lineseprator}></Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={signupNavigation}
              style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 10,
    // paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },
  appButtonText: {
    fontSize: 20,
    color: "#28445c",
    fontWeight: "700",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  image: {
    width: 100,
    height: 100,
    //top: "50%",
    //left: "50%",
    //transform: translate
    //transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    //position: 'relative',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  title: {
    //position: "fixed",
    top: "25%",
    left: "50%",
    //transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  rowverticalcenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lineseprator: {
    height: 2,
    backgroundColor: "#fff",
    width: "40%"
  },
  orseprator: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
    marginVertical: 5,
    width: "20%"
  },
});

export default HomeScreen;
