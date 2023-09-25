import reactDom from "react-dom"
// import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes"

const customstyles = {
  mt5: {
    marginTop: 5,
  },
  mt10: {
    marginTop: 10,
  },
  mt15: {
    marginTop: 15,
  },
  mt20: {
    marginTop: 20,
  },
  mt30: {
    marginTop: 30,
  },
  mb0: {
    marginBottom: 0,
  },
  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mb15: {
    marginBottom: 15,
  },
  mb20: {
    marginBottom: 20,
  },
  mb25: {
    marginBottom: 25,
  },
  mr5: {
    marginRight: 5,
  },
  mr10: {
    marginRight: 10,
  },
  mr20: {
    marginRight: 20,
  },
  ml5: {
    marginLeft: 5,
  },
  ml10: {
    marginLeft: 10,
  },
  my0: {
    marginTop: 0,
    marginBottom: 0,
  },
  my10: {
    marginTop: 10,
    marginBottom: 10,
  },
  p0: {
    padding: 0,
  },
  mx5: {
    marginLeft: 5,
    marginRight: 5,
  },
  mx10: {
    marginLeft: 10,
    marginRight: 10,
  },
  mx15: {
    marginLeft: 15,
    marginRight: 15,
  },
  my15: {
    marginTop: 15,
    marginBottom: 15,
  },
  my20: {
    marginTop: 20,
    marginBottom: 20,
  },
  pl0: {
    paddingLeft: 0,
  },
  pl10: {
    paddingLeft: 10,
  },
  pl15: {
    paddingLeft: 15,
  },
  pl20: {
    paddingLeft: 20,
  },
  pl30: {
    paddingLeft: 30,
  },
  pl40: {
    paddingLeft: 40,
  },
  pl50: {
    paddingLeft: 50,
  },
  pl60: {
    paddingLeft: 60,
  },
  px10: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  px15: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  px20: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  px30: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  py5: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  py10: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  py15: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  py20: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  py30: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  p5: {
    padding: 5,
  },
  p10: {
    padding: 10,
  },
  p15: {
    padding: 15,
  },
  p20: {
    padding: 20,
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 28,
    fontWeight: "bold",
    // lineHeight: "1.9rem",
    // color: "#000"
  },
  h3: {
    fontSize: 24,
    fontWeight: "bold",
    // lineHeight: "1.8rem",
    //color: "#000000"
  },
  h4: {
    fontSize: 22,
    fontWeight: "bold",
    // lineHeight: "1.4rem",
    color: "#000"
  },
  h5: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#662397"
    // fontWeight: 500,
    // lineHeight: "1.2rem",
    // color: "#000"
  },
  h6: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textbold: {
    fontWeight: "bold"
  },
  textxxl: {
    fontSize: 28,
  },
  textxl: {
    fontSize: 20,
  },
  textlg: {
    fontSize: 18,
  },
  textmd: {
    fontSize: 16,
  },
  textsm: {
    fontSize: 14,
  },
  textxs: {
    fontSize: 12,
  },
  w100: {
    width: "100%"
  },
  testborder: {
    borderColor: "red",
    borderWidth: 1,
  },
  dblock: {
    display: "block"
  },
  radius5: {
    borderRadius: 5,
  },
  radius10: {
    borderRadius: 10,
  },
  radius15: {
    borderRadius: 15,
  },
  radius20: {
    borderRadius: 20,
  },
  radius25: {
    borderRadius: 25,
  },
  radius30: {
    borderRadius: 30,
  },
  prelative: {
    position: "relative"
  },

  underline: {
    textDecorationLine: "underline"
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right"
  },
  textred: {
    color: "red"
  },
  textgreen: {
    color: "green"
  },
  col6: {
    width: "50%"
  },
  overflowHidden: {
    overflow: "hidden"
  },
  pagebg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  header: {
    paddingTop: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#ddd',
    //shadowOffset: { width: -2, height: 3 },
   // shadowOpacity: 1.0,
    //shadowRadius: 7,
    elevation: 8,
    backgroundColor: "transparent",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    //justifyContent: "space-between",
    // borderColor: "red",
    // borderWidth: 1,
  },
  flexgrow1: {
    flexGrow: 1,
  },
  headerHeading: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    color: "#663297",
    //////fontFamily: "Thonburi"
  },
  header80: {
    height: 80,
    justifyContent: "center"
  },
  heading: {
    textAlign: "center",
    textTransform: "uppercase",
    //////fontFamily: "Thonburi",
    fontWeight: "normal",
    fontSize: 30,
    lineHeight: 40,
    width: "100%",
    display: "flex",
    // minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  headingWhite: {
    textAlign: "center",
    textTransform: "uppercase",
    //////fontFamily: "Thonburi",
    fontWeight: "normal",
    fontSize: 30,
    lineHeight: 40,
    width: "100%",
    display: "flex",
    //minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    // borderColor: "white",
    // borderWidth: 2,
  },
  input: {
    // height: "10%",
    height: 46,
    width: "100%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    //placeholderColor: "#fff",
    //placeholderOpacity: 1,
    color: "#fff",
    fontSize: 16,
    ////fontFamily: "Thonburi",
    fontWeight: "normal",
    paddingLeft: 18,
    paddingRight: 18,
    //placeholderTextColor: "red"
  },
  inputtheme: {
    // height: "10%",
    height: 46,
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 0,
    marginBottom: 10,
    borderWidth: 2,
    //placeholderColor: "#555",
    //placeholderOpacity: .5,
    color: "white",
    fontSize: 16,
    ////fontFamily: "Thonburi",
    fontWeight: "normal",
    paddingLeft: 18,
    paddingRight: 18,
  },
  dropdownBox: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "#fff",
    paddingVertical: 0,
    height: 46,
    overflow: "hidden",
    paddingLeft: 10,
    marginBottom: 10,
  },
  dropdownBoxTheme: {
    borderWidth: 2,
    borderRadius: 30,
   // borderColor: "#663792",
    borderColor: "white",
    paddingVertical: 0,
    height: 46,
    overflow: "hidden",
    paddingLeft: 10,
    marginBottom: 10,
  },
  dropdownBoxThemesm: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#663792",
    paddingVertical: 0,
    height: 40,
    overflow: "hidden",
    paddingLeft: 8,
    marginBottom: 10,
    fontSize: 10,
  },
  dropdown: {
    height: 26,
    marginTop: -7,
    width: 100,
    height: 100,
    // borderWidth: 2,
    // borderColor: "white",
    borderRadius: 30,
    //marginBottom: 10,
    //placeholderColor: "#fff",
    //placeholderOpacity: 1,
    color: "#fff",
    fontSize: 20,
    //////fontFamily: "Thonburi",
    fontWeight: "normal",
    //paddingLeft: 18,
    //paddingRight: 18,
    //border: "solid 2px #fff",
    //backgroundColor: "cyan",
    //borderWidth: 2,
  },
  dropdowntheme: {
    height: 26,
    width: "100%",
    marginTop: -7,
    // borderWidth: 2,
    borderColor: "white",
    borderRadius: 30,
    //marginBottom: 10,
    //placeholderColor: "#555",
    //placeholderOpacity: .5,
    color: "#555",
    fontSize: 20,
    //////fontFamily: "Thonburi",
    fontWeight: "normal",
    paddingLeft: 18,
    paddingRight: 18,
    //border: "solid 2px #663792",
    backgroundColor: "transparent"
  },
  dropdownthemesm: {
    height: 20,
    width: "100%",
    marginTop: -8,
    borderRadius: 30,
    color: "#555",
    fontSize: 10,
    //////fontFamily: "Thonburi",
    fontWeight: "normal",
    paddingLeft: 0,
    paddingRight: 0,
    // backgroundColor: "transparent"
  },
  bgwhite: {
    backgroundColor: "#fff"
  },
  bgborderlight: {
    backgroundColor: "#EFF1F3",
    borderColor: "#e5e5e5",
    borderWidth: 1,
  },
  bglight: {
    backgroundColor: "#EFF1F3"
  },
  bgdanger: {
    backgroundColor: "#dc3545"
  },
  textwhite: {
    color: "#fff"
  },
  textblack: {
    color: "#000"
  },
  textpurple: {
    color: "#663792"
  },
  iconwhite: {
    stroke: "#fff"
  },
  bgpurple: {
    backgroundColor: "#663792"
  },
  bgtheme: {
    backgroundColor: "#663792"
  },
  btnPrimary: {
    backgroundColor: "#663792",
    color: "#fff"
  },
  labelwhite: {
    //////fontFamily: "Thonburi",
    color: "#fff"
  },
  labelblack: {
    //////fontFamily: "Thonburi",
    color: "#000"
  },
  btnWhite: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
    backgroundColor: "white",
    color: "#0E2C46",
    fontSize: 20,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    fontWeight: "700",
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 7,
    alignItems: "center",
    textAlign: "center",
  },
  btnWhitesmall: {
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 10,
    // width: "100%",
    backgroundColor: "white",
    color: "#0E2C46",
    fontSize: 16,
    lineHeight: 20,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    fontWeight: "700",
    shadowColor: '#555',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
  },

  progressChart:{
    display: "flex",
    backgroundColor: "white"
  },

  btnTheme: {
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#663792",
    color: "#fff",
    fontSize: 18,
    lineHeight: 22,
    //////fontFamily: "Thonburi",
    textAlign: "center",
    borderColor: "white", 
    borderWidth: 2
    // letterSpacing: 1,
    //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)",
  },
  btnThemesmall: {
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#663792",
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    textAlign: "center",
  },
  btnThemexs: {
    borderRadius: 20,
    color: "#662397",
    fontSize: 14,
    padding: 5,
    //////fontFamily: "Thonburi",
    fontWeight: "bold",
    textAlign: "center",
    borderColor: "#662397", 
    borderWidth: 2,
    marginBottom: 5
  },
  btnthemeText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    //////fontFamily: "Thonburi",
    textAlign: "center"
  },
  appButtonText: {
    fontSize: 20,
    color: "#28445c",
    fontWeight: "700",
    alignSelf: "center",
    textTransform: "uppercase",
    //////fontFamily: "Thonburi",
  },
  btnThemeblock: {
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    // marginBottom: 10,
    // marginTop: 10,
    backgroundColor: "#663792",
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
    //////fontFamily: "Thonburi",
    // borderWidth: 0,
    // fontWeight: "500",
    //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "0%",
    // maxHeight: "80px"   
  },
  h100: {
    height: 100
  },
  h90: {
    height: 90
  },
  btnRed: {
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 10,
    backgroundColor: "#e8b3b4",
    color: "#fff",
    fontSize: 18,
    lineHeight: 22,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    textAlign: "center",
    letterSpacing: 1,
    //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)",
  },
  btnRedsmall: {
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#dc3545",
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    textAlign: "center"
    // fontWeight: "700",
    //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)"
  },
  btnRedxs: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#dc3545",
    color: "#fff",
    fontSize: 14,
    lineHeight: 18,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    textAlign: "center"
    // fontWeight: "700",
    //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)"
  },
  btnThemecircle: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#663792",
    // backgroundColor: "red",
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    fontWeight: "700",
    //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  btnWhitecircle: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#fff",
    color: "#663792",
    fontSize: 16,
    lineHeight: 20,
    //////fontFamily: "Thonburi",
    borderWidth: 0,
    fontWeight: "700",
    //boxShadow: "-2px 6px 7px rgba(0, 0, 0, .4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  btnxs: {
    width: 24,
    height: 24,
    // minHeight: "inherit"
  },
  btnmd: {
    width: 32,
    height: 32,
    //minHeight: "inherit"
  },
  btnmd2: {
    width: 36,
    height: 36,
  },
  btnlg: {
    width: 40,
    height: 40,
    minHeight: "inherit"
  },
  btnxlg: {
    width: 48,
    height: 48,
    minHeight: "inherit"
  },
  upright: {
    position: "absolute",
    right: 0,
    top: 0
  },
  uprightDelete: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 24,
    height: 24,
    // minHeight: "inherit",
    borderRadius: 50,
    backgroundColor: "#dc3545",
    // alignItems: "center",
    // justifyContent: "center",
    // display: "flex",
    zIndex: 1,
  },
  listDeleteitembtn: {
    position: "absolute",
    width: 24,
    height: 24,
    minHeight: "inherit",
    borderRadius: "50%",
    backgroundColor: "#dc3545",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    display: "flex",
    right: 8,
    top: 9
  },
  btnThemecircle32: {
    width: 32,
    height: 32
  },
  logincontainer: {
    maxWidth: 500,
    width: "100%",
    alignSelf: 'center',
    padding: 15,
  },
  success: {
    color: "#03E442"
  },
  error: {
    color: "#FF2424"
  },
  
  whitebox: {
    //width: "100%",
    // height: "100%",
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "black",
    borderWidth: 4
  },
  lightbox: {
    //width: "100%",
    // height: "100%",
    padding: 10,
    backgroundColor: "transparent",
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 3 },
    borderWidth: 5,
    borderColor: "black"
  },
  shadowBlock: {
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 1.0,
    shadowRadius: 7,
    elevation: 8,
  },
  elevation: {
    elevation: 3,
    backgroundColor: "#fff",
    shadowColor: '#000',
    marginHorizontal: 3,
  },
  shadowBtn: {
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 1.0,
    shadowRadius: 7,
    elevation: 3,
  },

  alertdanger: {
    color: "#842029",
    backgroundColor: "#f8d7da",
    //border: "solid 1px #f5c2c7",
    borderRadius: 5,
    fontSize: 14,
    lineHeight: 15,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginBottom: 10,
  },
  alertsuccess: {
    color: "#0f513",
    backgroundColor: "#d1e7dd",
    //border: "solid 1px #badbcc",
    borderRadius: 5,
    fontSize: 14,
    lineHeight: 12,
    paddingHorizontal: 5,
    paddingVertical: 7,
    marginBottom: 10,
  },
  alertPrimary: {
    color: "#084298",
    backgroundColor: "#cfe2ff",
    //border: "solid 1px #b6d4fe",
    borderRadius: 5,
    fontSize: 14,
    lineHeight: 12,
    paddingHorizontal: 5,
    paddingVertical: 7,
    marginBottom: 10,
  },
  marqueSlide: {
    fontSize: 16,
  },
  whiteCircle: {
    width: 160,
    height: 160,
    marginVertical: 30,
    marginHorizontal: "auto",
    borderRadius: 160,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    //////fontFamily: "Thonburi",
    // fontWeight: "700",
    color: "#662397",
    fontSize: 24,
    fontWeight: "bold"
    // marginTop: 15
  },
  walletBalanceText:{
    //////fontFamily: "Thonburi",
    // fontWeight: "700",
    color: "white",
    fontSize: 15,
    marginLeft: 30,
    marginRight: 30,
    // marginTop: 15
  },
  walletBalanceBackground:{
    backgroundColor: "#663297",
    borderRadius: 16,
    opacity: 0.5,
    marginLeft:10,
    marginRight:30,
    marginTop:0,
    padding:10
  },
  update: {
    ////////fontFamily: "Thonburi",
    color: "white",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "bold"
  },
  subText: {
    fontSize: 32,
    ////////fontFamily: "Thonburi",
    fontWeight: "700",
    textAlign: "left",
    alignSelf: "stretch",
    color: "#000"
  },
  // textJoin: {
  //   fontSize: "100%",
  // }

  /* RADIO LIST START HERE */

  radiolist: {
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 3,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
    position: "relative",
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: "#fff"
  },
  radiolistCircle: {
    height: 24,
    width: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#663792',
    position: "absolute",
    left: 8,
    top: 8,
  },
  radiolistCircleselected: {
    width: 16,
    height: 16,
    borderRadius: 50,
    backgroundColor: '#663792',
    position: "absolute",
    left: 12,
    top: 12,
  },
  radiolistText: {
    // marginRight: 35,
    fontSize: 14,
    color: '#000',
    position: "relative",
    left: 30,
  },

  /* CHECKBOX LIST START HERE */

  checkboxlist: {
    overflow: "hidden",
    shadowColor: '#000000',
    shadowRadius: 7,
    elevation: 3,
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 5,
    position: "relative",
    marginVertical: 5,
    marginHorizontal: 5,
    borderColor: "#662397",
    borderWidth: 3,
    backgroundColor: "#cbb8d9",
    justifyContent: "center"
  },
  checkboxhidden: {
    left: 0,
    position: "absolute",
    color: "none",
    paddingHorizontal: 8,
    //paddingVertical: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  checkboxarea: {
    position: "absolute",
    left: 10,
    top: 6,
  },
  checkboxlistsquare: {
    height: 28,
    width: 28,
    position: "absolute",
    left: 0,
  },
  checkboxlistsquareselected: {
    width: 28,
    height: 28,
    borderRadius: 5,
    position: "absolute",
    left: 0,
  },
  checkboxlistText: {
    fontSize: 14,
    color: '#000',
    position: "relative",
    paddingLeft: 34,
    width: "100%",
  },

  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#663792',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: '#663792',
  },
  radioText: {
    marginRight: 35,
    fontSize: 18,
    color: '#000',
  },
  checkboxinlineblock: {
    overflow: "hidden",
    paddingTop: 4,
    paddingBottom: 6,
    position: "relative",
    borderColor: "black",
    // borderWidth: 1,
  },
  checkboxareainline: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  checkboxlistTextinline: {
    fontSize: 14,
    color: '#000',
    position: "relative",
    paddingLeft: 30,
    width: "100%",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    width: "100%",
    // alignSelf: "stretch",
    // borderWidth: 1,
    // borderColor: "black",
    display: "flex",
  },
  justifyContentBetween: {
    justifyContent: "space-between"
  },
  justifyContentcenter: {
    justifyContent: "space-between"
  },
  rowverticalcenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colgap15: {
    columnGap: 15,
  },
  col8: {
    width: "100%",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    maxWidth: "100%"
  },
  col7: {
    width: "58.33333333%",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    maxWidth: "100%"
  },
  col6: {
    width: "50%",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    maxWidth: "100%"
  },
  col5: {
    width: "41.66666667%",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    maxWidth: "100%"
  },
  col4: {
    width: "33.33333333%",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    maxWidth: "100%"
  },
  tagStyle1: {
    backgroundColor: "#cbb8d9", 
    borderRadius: 10, 
    alignSelf: 'flex-start', 
    margin: 5
  },
  tagStyle3: {
    backgroundColor: "#cbb8d9", 
    borderRadius: 10, 
    alignSelf: 'flex-start', 
    margin: 5
  },
  tagText1:{
    fontSize: 10, 
    padding: 5, 
    color: "#662397"
  },
  tagText3:{
    fontSize: 20, 
    padding: 10, 
    color: "#662397"
  },
  tagStyle2:{
    backgroundColor: "#662397", 
    borderRadius: 10, 
    alignSelf: 'flex-start', 
    margin: 5
  },
  tagStyle4:{
    backgroundColor: "#662397", 
    borderRadius: 10, 
    alignSelf: 'flex-start', 
    margin: 5
  },
  searchBarStyleIcons:{
    height: 40,
    padding: 5,
    borderRadius: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdfdfd",
    shadowColor: "#757575",
    shadowRadius: 8,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  filterContainerOutline: {
    shadowColor: "#757575", shadowRadius: 8, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 3}
  },
  filterContainer:{
    padding: 5,
    borderRadius: 12,
    flexDirection: "row",
    backgroundColor: "#fdfdfd",
    shadowColor: "#757575",
    shadowRadius: 8,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  tagText2:{
    fontSize: 10, 
    padding: 5, 
    color: "#cbb8d9"
  },
  tagText4:{
    fontSize: 20, 
    padding: 10, 
    color: "#cbb8d9"
  }
}


export { customstyles }