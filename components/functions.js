

//const url = "http://dev.identity-wallet.com/api/";
import React, { useEffect, useState } from 'react';
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  S3Client,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { addListener } from 'expo-media-library';

const region = "ap-southeast-1";
/*
const client = new S3Client({
  region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    identityPoolId: "IDENTITY_POOL_ID",
  }),
});
*/
const client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId:'AKIAXOZ2WMZ4M5J5FDB7',
    secretAccessKey:'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'
  }});

const url = "https://identity-wallet.com/api/v1/";
//let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZGV2aWRlbnRpdHl3YWxsZXQubml0eW8uaW5cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNjY4ODQxODcwLCJleHAiOjE3MDAzNzc4NzAsIm5iZiI6MTY2ODg0MTg3MCwianRpIjoiR3pNMUdBd2UwUTk3NVdwaCIsInN1YiI6NCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.Ygj2_CBBwBJvXfBLa7EIOBi50IV81pp1_-vrRTKACZI';
let token = ""
const getAuthState = async () => {
 
  const value = AsyncStorage.getItem('userInfo')
    .then((value) => {
      let userData = JSON.parse(value);
      
      token = userData.remember_token;
      console.log("equal: ", userData.remember_token == token);
      console.log("User Data Token: ", userData.remember_token)
      return userData;
    });
}
getAuthState();


let uploaddoc = async (formdata) => {
  try {
    const response = await fetch(url + `uploadDoc`, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": `Bearer ${token}`
      },
      body:formdata,
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

const getOneImage = async (folderID, userID, docPath) => {
    try{
      const response = await client.send(new GetObjectCommand({Bucket: "identity-wallet.com", Key: "Document/"}));
      return streamString(response.Body);
    }
    catch(error){
      console.log("This", error)
    }
}

const getAllFiles = async(folder_id, user_id) => {
  try{
    const response = await fetch(url + `getFileList?folder_id=${folder_id}&?id=${user_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    console.log(response);
  }
  catch(error){
    console.log(error);
  }
}

const streamString = (stream) => new Promise((resolve, reject) => {
  const pieces = [];
  stream.on('data', (chunk) => pieces.push(chunk));
  stream.on('error', reject);
  stream.on('end', () => resolve(Buffer.concat(pieces).toString('utf8')));
})

const getImages = async (folderID, userID, docPath) => {
  var myHeaders = new Headers();
  myHeaders.append("correctClockSkew", "true");
  myHeaders.append("X-Amz-Content-Sha256", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  myHeaders.append("X-Amz-Date", "20220718T120951Z");
  myHeaders.append("Authorization", "AWS4-HMAC-SHA256 Credential=AKIAXOZ2WMZ4M5J5FDB7/20220718/ap-southeast-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=4ec55cf09956eeac0aeebe71c22dc0efc7a75208dffd4589fa30e227b0f62040");
  //myHeaders.append('Content-Type', 'image/jpeg')
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch('GET', "http://identity-wallet.com.s3.amazonaws.com/Document/" + folderID + "/" + userID + "/" + docPath, requestOptions)
      .then(response => {
        //response.text()
        const fileRead = new FileReader();
        response.blob().then(myBlob => {
          var objectURL = URL.createObjectURL(myBlob);
          console.log(objectURL);

        })
        //return response.json();
      })
      .catch(error => console.log('error', error))
  }

const setAuthState = async () => {
  const value = AsyncStorage.getItem('userInfo')
    .then((value) => {
      let userData = JSON.parse(value);
    }).catch((error) => {
      console.log(error);
    })
}

// Reg,Forgot,Login:
async function LoginAPI(data) {
  try {
    const response = await fetch(url + data.api_url, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    return response.json();
  }
  catch (e) {
    console.log(e);
  }
}
// Close


// Common Post API
async function commonPost(data) {
  try {
    getAuthState();
    console.log("Remember New Token: ", token);
    setAuthState();
    const response = await fetch(url + data.api_url, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    //console.log(response.text());
    return response.json();
  }
  catch (e) {
      console.log(e);
  }
}

async function commonPostText(data) {
  try {
    getAuthState();
    setAuthState();
    const response = await fetch(url + data.api_url, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    //console.log(response.text());
    return response.text();
  }
  catch (e) {
    console.log(e);
  }
}

async function commonFilePost(data) {
  try {
    getAuthState();
    setAuthState();
    const response = await fetch(url + data.api_url, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
      //redirect: "manual"
    })
    return response.text()
    //console.log(response.text());
    //return response.json();
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}

// Close
// Common Post API
async function commonPostWithoutToken(data) {
  try {
    const response = await fetch(url + data.api_url, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    return response.json();
  }
  catch (e) {
    console.log(e);
  }
}

async function commonGetFace(data){
  try {
    const response = await fetch(url + data.api_url + "?username=" + data.username, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close
// Common GET API
async function commonGetWithoutToken(data){
  try {
    const response = await fetch(url + data.api_url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
async function commonGet(data) {
 
  try {
    getAuthState();
    setAuthState();
    const response = await fetch(url + data.api_url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close
// Common GET API
async function commonGetwithkey(data) {
 
  try {
    getAuthState();
    setAuthState();
   
    const response = await fetch(url + data.api_url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${data.keytoken}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let ViewCardsText = async (user_id) => {
  try {
    const response = await fetch(url + `getUserWalletCard?id=${user_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.text()
  }
  catch (e) {
    console.log(e);
  }
}

let ViewCards = async (user_id) => {
  try {
    const response = await fetch(url + `getUserWalletCard?id=${user_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close
// Common GET API
async function commonGetwihoutktoken(data) {
  try {
    //getAuthState();
    //setAuthState();
    const response = await fetch(url + data.api_url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

let getCategoryKeycode = async (user_id) => {
  try {
    const response = await fetch(url + `getCategoryDetailList`, {
      method: 'GET',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

// Get user detail by id
let userDetailById = async (user_id) => {
  try {
    const response = await fetch(url + `userDetailById?id=${user_id}`, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close
// Get All Categories ::
let getCategories = async (user_id) => {
  try {
    const response = await fetch(url + `getActiveCategories?id=${user_id}`, {
      method: 'GET',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

// Show User Prefrence
let getUserPrefrence = async (user_id) => {
  try {
    const response = await fetch(url + `get-user-preference?user_id=${user_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

// Show Selected Category 
let getSelectedPref = async (user_id) => {
  try {
    const response = await fetch(url + `getSelectedPref?user_id=${user_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

let getTitles = async () => {
  try {
    const response = await fetch(url + 'mmTitles', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}


// Question Bank Listing
let getQuestionListing = async (user_id) => {
  setAuthState();
  try {
    const response = await fetch(url +`getQuestionListing?user_id=0`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

let getRandomQuestion = async (user_id) => {
  try {
    getAuthState();
    const response = await fetch(url + `getRandomQuestion?user_id=${user_id}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close
// Company Filter Listing
let companyFilter = async (currentCompany) => {
  try {
    const response = await fetch(url + `userOffer?company_id=${currentCompany}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

// Price Range Filter 
let priceFilter = async (data) => {
  try {
    getAuthState();
    const response = await fetch(url + `userOffer?min_price=${data.min_price}&max_price=${data.max_price}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

let getAllQuestionInfo = async (user_id) => {
  getAuthState();
  setAuthState();
  try {
    const response = await fetch(url + `getQuestionCounts?id=${user_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let eKYCStart = async (id) => {
  try {
    getAuthState();
    setAuthState();
    const response = await fetch(url + data.api_url + "?id=" + id, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    //console.log(response.text());
    return response.json();
  }
  catch (e) {
      console.log(e);
  }
}

let eKYCVerify = async (id) => {
  try {
    getAuthState();
    setAuthState();
    const response = await fetch(url + data.api_url + "?id=" + id, {
      method: 'PUT',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    //console.log(response.text());
    return response.json();
  }
  catch (e) {
      console.log(e);
  }
}

// Offer Detail 
let offerDetails = async (offer_id) => {
  getAuthState();
  setAuthState();
  console.log("Offer ID ", offer_id)
  try {
    const response = await fetch(url + `offerDetails?id=${offer_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let transactioncardlist = async (user_id,id,card) => {
  console.log("id++++++"+id)
  try {
    const response = await fetch(url + `getBankTransactions?id=${user_id}&page=${id}&transtype=card&card=${card}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let transactionlist = async (user_id,id) => {
  try {
    const response = await fetch(url + `getBankTransactions?id=${user_id}&page=${id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close
// Retrive coupon list   
let couponlist = async (data) => {
  try {
    const response = await fetch(url + `getcompanycoupan`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    return response.json();
  }
  catch (e) {
    console.log(e);
  }
}


// Close
// Retrive User Wallet  
let retriveWallet = async (user_id) => {
  try {
    getAuthState();
    //setAuthState();
    console.log("User ID" + " " + user_id)
    const response = await fetch(url + `getuserwallet?id=${user_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close


// Activate Card
let activateCard = async (data) => {
  try {
    getAuthState();
    const response = await fetch(url + 'activatedCard', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  catch (e) {
    console.log(e);
  }
}
// Close

// get Card Details By Id
let getCardById = async (data) => {
  try {
    getAuthState();
    setAuthState();
    const response = await fetch(url + `getCardDetail?id=${data.id}&card_id=${data.cardno}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

// get Card Details By Id
let getUserAddress = async (data) => {
  try {
    getAuthState();
    const response = await fetch(url + `getUserAddress?id=${data.id}&type=${data.type}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

// Get Enumerations::
let getEnumerations = async (data) => {
  try {
    getAuthState();
    const response = await fetch(url + `getEnumerationsData?type=${data.type}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let getQuestionInfo = (user_id) => {

  //Find the categories and the questions for which each of them
}
  
let getQuestionsAnswered = async (user_id) => {
  getAuthState();
  setAuthState();
  console.log("User ID " + user_id);
  try {
    const response = await fetch(url + `getAllQuestAnswer?id=${user_id}` , {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let linkTokenCreation = async() => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "client_id": "6486ced0ab8edd001b9f0a55",
    "secret": "6c49289ee059d4aac73a7f3d2865a1",
    "client_name": "IdentityWallet",
    "user": {
      "client_user_id": "user-id"
    },
    "products": [
      "auth"
    ],
    "country_codes": [
      "US"
    ],
    "redirect_uri": "https://localhost:19006",
    "language": "en"
    //"webhook": "https://webhook.example.com"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://development.plaid.com/link/token/create", requestOptions);
    const result = await response.text();
    return result; // Return the result here
  } catch (error) {
    console.error(error);
    throw error;
  }
    
  }

let setAccessToken = async (public_token) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "client_id": "6486ced0ab8edd001b9f0a55",
    "secret": "6c49289ee059d4aac73a7f3d2865a1",
    "public_token": public_token
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };


  fetch("https://development.plaid.com/item/public_token/exchange", requestOptions)
    .then(response => {
      return response.json()
  });
}

let getValuation = async(user_id) => {
  try{
    //getAuthState();
    var formdata = new FormData();
    formdata.append("user_id", user_id);
    const response = await fetch("https://devidentitywalletml.nityo.in/custom_valuation/",{
      method: 'POST',
      body: formdata,
      redirect: "follow",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk5NjA2NzYwLCJpYXQiOjE2NjgwNzA3NjAsImp0aSI6IjA1ZjY2NTEwNzMxZjQwZjU4MjlkNDM2NGZhNzE5ODUwIiwidXNlcl9pZCI6MX0.CVaZYagwpa-EGOMVzvNKhUwAAShoZOwBNqu46z7Qcfk`
      },
    })
    return response.json();
  }
  catch(e) {
    console.log(e);
  }
 } 

let getNationalities = async () => {
  try {
    getAuthState();
    const response = await fetch(url + 'mmNationalities', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let getIdTypes = async () => {
  try {
    getAuthState();
    const response = await fetch(url + 'mmIdTypes', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let getMobileCountry = async () => {
  try {
    getAuthState();
    const response = await fetch(url + 'mmMobileCountryCodes', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}

let getBalance = async (user_id ) => {
  try{
    getAuthState();
    setAuthState();
    const response = await fetch(url + `getuserwallet?id=${user_id}`,{
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json();
  }
  catch(e) {
    console.log(e);
  }
}

let getFolderPercent = async (user_id) => {
  try{
    console.log("Token Used: ", token)
    getAuthState();
    const response = await fetch(url + `getFolderPercent?user_id=${user_id}`,{
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json();
  }
  catch(e) {
    console.log(e);
  }
}

 let getRecList = async (folder_id) => {
  try{
    getAuthState();
    setAuthState();
    const response = await fetch(url + `getSingleDocs?folder_id=${folder_id}`,{
      method: 'POST',
      mode: 'cors',
      headers:  {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      redirect: "manual"
    })
    return response.json();
  }
  catch(e) {
    console.log(e);
  }
 }

 /*let numQuestionsPerDay = async (user_id, question_set) => {
  try{
    getAuthState();
    setAuthState();
    for(let i = )
  }
 }*/

/*let getDayQuestionCount = async (user_id) => {
  try{
    getAuthState();
    setAuthState();
    //Check if number of questions reaches 10 for the day by looking at time answered in list
    
  }
}*/
  
// Close
export { LoginAPI, userDetailById, getCategories, getUserPrefrence, getSelectedPref, getQuestionListing, getRandomQuestion, offerDetails, companyFilter, priceFilter, retriveWallet,transactionlist, activateCard, getCardById, getUserAddress, getEnumerations, commonPost, commonGet,commonGetwihoutktoken,commonGetwithkey, getQuestionsAnswered, getQuestionInfo, getCategoryKeycode, ViewCards, commonGetWithoutToken, getImages, getOneImage, getTitles, getIdTypes, getMobileCountry, getNationalities, getAllFiles, getFolderPercent, getRecList, getValuation, getBalance, commonPostWithoutToken, commonFilePost, uploaddoc, commonPostText, ViewCardsText, eKYCVerify, eKYCStart, couponlist, transactioncardlist, commonGetFace, linkTokenCreation, setAccessToken};
