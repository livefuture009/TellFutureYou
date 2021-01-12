import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image, Platform, Dimensions, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

const win = Dimensions.get('window');

class LabelFormIDropdown extends Component {
    render() {
        return (
            <View style={[this.props.style, styles.container]}>
                <Text style={styles.labelText}>{this.props.label}</Text>
                <View style={styles.boxContainer}>
                    <RNPickerSelect
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 21,
                                right: 5,
                            },
                        }}
                        items={this.props.data}
                        Icon={() => {
                        return <Image
                                style={styles.dropdownIcon}
                                source={Images.dropdown_icon}
                                />;
                        }}
                        value={this.props.value}
                        ref={this.props.onRefInput}
                        onValueChange={(value) => this.props.onChangeText(value)}
                    />
                </View>
                {
                    this.props.errorMessage
                    ? <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
                    : null
                }            
            </View>
        );
    }
}

export default LabelFormIDropdown;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },

    containerError: {
        borderBottomColor: '#ed0a3f',
    },

    labelText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: '#7a79b5',
        marginBottom: 10,
        marginLeft: 10,
    },
    
    textInput: {
        fontSize: 16,
        fontFamily: Fonts.regular, 
        height: '100%',
        color: 'white',
    },

    dropdownIcon: {
        width: 17,
        height: 10,
    },
    errorMessage: {
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        color: '#ff0000',
        fontSize: 11,
        marginLeft: 20,
        marginTop: 5,
    },
    boxContainer: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 30,
        paddingLeft: 15,
        paddingRight: 10,
    }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    paddingVertical: 12,
    color: 'white',
    paddingRight: 20,
  },
  inputAndroid: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    paddingVertical: 12,
    color: 'white',
  },
});