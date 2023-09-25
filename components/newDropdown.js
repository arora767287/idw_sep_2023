import React, { Component, useEffect   } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image, Pressable, ImageBackground } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

function newDropdown({dropdownList, value, isFocus}) {
    const [dropdownData, setDropdownData] = useState([]);
    renderAnsOptions = (option_list) =>{
        const newData = []
        option_list.map((currOption, j) => {
            newData.push({label: currOption.option, value: j})
        })
        setDropdownData(newData);
        return newData;
    }

    renderDropdown = () => {
        renderAnsOptions();
        return(
            <View style={styles.container}>
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
                placeholder={!isFocus ? 'Select option': ''}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(item) => {
                    console.log(item)
                    setValue(item.value);
                    setLabel(item.label);
                    setFocus(false);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                    style={styles.icon}
                    color={this.state.isFocus ? 'white' : 'white'}
                    name="Safety"
                    size={20}
                    />
                )}
                />
            </View>
        )
    }

    return (
        renderDropdown()
    );
}
export default newDropdown;