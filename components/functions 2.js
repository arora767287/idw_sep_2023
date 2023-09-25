//const url = "http://dev.identity-wallet.com/api/";
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
const url = "https://devidentitywallet.nityo.in/api/v1/";
const url1 = "https://devidentitywalletml.nityo.in/regression_agg_output/";


//const url = "https://identity-wallet.com/api/v1/";
let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZGV2aWRlbnRpdHl3YWxsZXQubml0eW8uaW5cL2FwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNjc0ODI3MjQwLCJleHAiOjE3MDYzNjMyNDAsIm5iZiI6MTY3NDgyNzI0MCwianRpIjoiRG5hMGRkczdQRGN1UjFWcSIsInN1YiI6NCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.bwJtiRopA9KSivAYCLWmRw0g5eVucbHmIGh17szrqxY';
//let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvaWRlbnRpdHktd2FsbGV0LmNvbVwvYXBpXC92MVwvbG9naW4iLCJpYXQiOjE2NzQ1NTY5MTksImV4cCI6MTcwNjA5MjkxOSwibmJmIjoxNjc0NTU2OTE5LCJqdGkiOiIwTEhFREcxYmNvMkVLdlBEIiwic3ViIjo0LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.7yVOjc2wjJJ7QJO7Zse3uj8671jmntgqZvwlN6pVI0w';

const getAuthState = async () => {
  const value = AsyncStorage.getItem('userInfo')
    .then((value) => {
      let userData = JSON.parse(value);
      return userData;
      //token = userData.remember_token;
      //console.log(userData.remember_token);
    });
}

const setAuthState = async () => {
  const value = AsyncStorage.getItem('userInfo')
    .then((value) => {
      let userData = JSON.parse(value);
      token = userData.remember_token;
     // console.log(userData.remember_token);
    }).catch((error) => {
      console.log(error);
    })
}

// Reg,Forgot,Login:
async function LoginAPI(data) {
  console.log(url + data.api_url)
  try {
    const response = await fetch(url + data.api_url, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE',
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
    console.log(token);
    return response.json();
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
    console.log(url + data.api_url);
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
    getAuthState();
    setAuthState();
    console.log(url + data.api_url)
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
    return response.text()
  }
  catch (e) {
    console.log(e);
  }
}
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

let updatelocatoinstatus = async (data) => {
 console.log(data)
  try {
    const response = await fetch(url + `updateLocationstatus?id=${data.id}`, {
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
let insertlocation = async (data) => {
 
  try {
    const response = await fetch(url + `insertGeoLoction?user_id=${data.userid}&latitude=${data.latitude}&longitude=${data.longitude}`, {
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

let getFolderPercent = async (user_id) => {
  try{
    getAuthState();
    setAuthState();
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
// Question Bank Listing
let getQuestionListing = async (user_id) => {
  setAuthState();
  try {
    const response = await fetch(url +`getQuestionListing`, {
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

// Offer Detail 
let offerDetails = async (offer_id) => {
  setAuthState();
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
// Close
// Retrive User Wallet  
let retriveWallet = async (user_id) => {
  try {
    getAuthState();
    setAuthState();
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

// Retrive Transaction list   
let transactionlist = async (user_id,id,card) => {
  console.log("id++++++"+id)
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
    return response.json()
  }
  catch (e) {
    console.log(e);
  }
}
// Close

// Retrive card Transaction list   
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
// Close


// Activate Card
let activateCard = async (data) => {
  try {
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
  console.log(data);
  try {
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
// get Card Details By Id
let eKYCVerification = async (data) => {
  console.log(data);
  try {
    const response = await fetch(url + `eKYCVerification?id=${data.id}`, {
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

// Get Enumerations::
let getEnumerations = async (data) => {
  try {
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
let getValuation = async(data) => {

  try {
    const response = await fetch(url1, {
      method: 'POST',
      //mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk5NjA2NzYwLCJpYXQiOjE2NjgwNzA3NjAsImp0aSI6IjA1ZjY2NTEwNzMxZjQwZjU4MjlkNDM2NGZhNzE5ODUwIiwidXNlcl9pZCI6MX0.CVaZYagwpa-EGOMVzvNKhUwAAShoZOwBNqu46z7Qcfk`
      },
      body: JSON.stringify(data),
      redirect: "manual"
    })
    return response.json();
  }
  catch (e) {
    console.log("//////////////");
    console.log(e);
  }
 } 
// Close
export { LoginAPI, userDetailById, getCategories, getUserPrefrence, getSelectedPref, getQuestionListing, getRandomQuestion, offerDetails, companyFilter, priceFilter, retriveWallet,transactionlist, activateCard, getCardById, getUserAddress, getEnumerations, commonPost, commonGet,commonGetwihoutktoken,commonGetwithkey, getQuestionsAnswered, getQuestionInfo, getCategoryKeycode, ViewCards, commonGetWithoutToken,insertlocation,updatelocatoinstatus,uploaddoc,transactioncardlist,getValuation,getFolderPercent,eKYCVerification,couponlist};