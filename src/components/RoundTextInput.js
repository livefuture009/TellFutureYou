import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Dimensions, Text, ScrollView } from 'react-native';
import Colors from '../theme/Colors'
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import { GOOGLE_API_KEY } from '../constants.js'

const win = Dimensions.get('window');

class RoundTextInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
          displayPassword: false,
          showAddressList: false
        }
    }

    render() {
        return (
            <View style={[this.props.style, styles.container]}>
                {
                    (this.props.label && this.props.label.length > 0) 
                    ? <Text style={styles.labelText}>{this.props.label}</Text>
                    : null
                }

                <View style={styles.content}>
                {
                    (this.props.type === "text")
                    ? <TextInput
                        style={[styles.textInput, this.props.theme == "gray" ? styles.grayText : styles.whiteText, this.props.align == "center" ? styles.centerText : null]}
                        underlineColorAndroid='transparent'
                        placeholderTextColor={Colors.roundTextInputPlaceColor}
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        ref={this.props.onRefInput}
                        returnKeyType={this.props.returnKeyType}
                        onSubmitEditing={this.props.onSubmitEditing}
                    />
                    : null
                }

                {
                    (this.props.type === "phone")
                    ? <TextInput
                        style={[styles.textInput, this.props.theme == "gray" ? styles.grayText : styles.whiteText, this.props.align == "center" ? styles.centerText : null]}
                        underlineColorAndroid='transparent'
                        keyboardType='phone-pad'
                        placeholderTextColor={Colors.roundTextInputPlaceColor}
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        ref={this.props.onRefInput}
                        returnKeyType={this.props.returnKeyType}
                        onSubmitEditing={this.props.onSubmitEditing}
                    />
                    : null
                }

                {
                    (this.props.type === "email")
                    ? <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={styles.textInput}
                        placeholderTextColor={Colors.roundTextInputPlaceColor}
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        ref={this.props.onRefInput}
                        returnKeyType={this.props.returnKeyType}
                        onSubmitEditing={this.props.onSubmitEditing}
                    />
                    : null
                }

                {
                    (this.props.type === "password")
                    ? <TextInput
                        textContentType="none"
                        secureTextEntry={!this.state.displayPassword}
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={styles.textInput}
                        placeholderTextColor={Colors.roundTextInputPlaceColor}
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        ref={this.props.onRefInput}
                        returnKeyType={this.props.returnKeyType}
                        onSubmitEditing={this.props.onSubmitEditing}
                     />
                    : null
                }
                {
                    (this.props.type === "address")
                    ? <GoogleAutoComplete apiKey={GOOGLE_API_KEY} debounce={300} queryTypes="address">
                          {({ inputValue, handleTextChange, locationResults, fetchDetails }) => {
                            return (
                                <React.Fragment>
                                  <TextInput
                                    value={this.props.value}
                                    onChangeText={(text) => {
                                        handleTextChange(text);
                                        this.props.onChangeText(text);
                                    }}
                                    placeholder={this.props.placeholder}
                                    placeholderTextColor={Colors.roundTextInputPlaceColor}
                                    returnKeyType={this.props.returnKeyType}
                                    onFocus={ () => this.setState({showAddressList: true}) }
                                    ref={this.props.onRefInput}
                                    style={styles.textInput}
                                    onSubmitEditing={this.props.onSubmitEditing}
                                  />
                                  {
                                    this.state.showAddressList && this.props.value.length > 0
                                    ? <ScrollView style={{ maxHeight: 150 }}>
                                        {locationResults.map((el, i) => (
                                          <LocationItem
                                            {...el}
                                            fetchDetails={fetchDetails}
                                            key={String(i)}
                                            onSelectAddress={(address) => {
                                                this.setState({showAddressList: false});
                                                this.props.onChangeText(address)
                                                this.props.onSelectAddress(address)
                                            }}
                                          />
                                        ))}
                                      </ScrollView>  
                                    : null
                                  }
                              
                                </React.Fragment>
                            )
                          }}
                        </GoogleAutoComplete>
                    : null
                }
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

export default RoundTextInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },

    content: {
        paddingVertical: 2,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#8989a7',
        paddingHorizontal: 20,
    },

    labelText: {
        fontFamily: 'OpenSans',
        color: '#7a79b5',
        marginBottom: 10,
        marginLeft: 10,
    },
    
    textInput: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        height: '100%',
        height: 42,
        color: 'white',
    },

    hasShowButtonTextInput: {
        fontSize: 16,
        height: '100%',
        marginRight: 30,
        height: 42,
    },

    whiteText: {
        color: 'white',
        fontFamily: 'OpenSans',        
    },

    grayText: {
        color: 'black',
        fontFamily: 'OpenSans',
    },

    forgotTextInput: {
        color: '#474747',
        paddingLeft: 5,
        fontSize: 17,
        paddingRight: 70,
        position: 'relative',
    },

    forgotButton: {
        position: 'absolute',
        right: 0,
    },

    forgotButtonText: {
        fontSize: 11,
        backgroundColor: '#0d4e6c',
        textTransform: 'uppercase',
        color: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },

    formField: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    eye_icon: {
        width: 21,
        height: 15,
        resizeMode: 'cover',
    },

    textViewWithIcon: {
        marginLeft: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#e7e7e7',
    },

    textView: {
        borderBottomWidth: 1,
        borderBottomColor: '#e7e7e7',
    },

    iconView: {
        left: 0,
        top: 7,
        position: 'absolute',
    },

    iconImage: {
        width: 25,
        height: 25,
        resizeMode: 'cover',
    },

    showPasswordButton: {
        position: 'absolute',
        right: 0,
        top: 12,
    },

    errorMessage: {
        fontFamily: 'OpenSans',
        fontStyle: 'italic',
        color: '#cf0000',
        fontSize: 11,
        marginLeft: 20,
        marginTop: 5,
    },

    centerText: {
        textAlign: 'center'
    },
});