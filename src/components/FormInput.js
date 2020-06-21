import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from './LocationItem';
import { GOOGLE_API_KEY } from '../constants.js'
import Images from '../theme/Images'
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'

class FormInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
          displayPassword: false,
        }
    }

    render() {
        const {style, label, type, errorMessage, editable} = this.props;
        return (
            <View style={
                [
                    style, 
                    styles.container
                ]
            }>

                <View>
                    {label && <Text style={styles.labelText}>{label}</Text>}
                    {
                        (type === "text")
                        ? <TextInput
                            style={styles.textInput}
                            editable={editable}                            
                            placeholderTextColor="#c9c9c9"
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
                        (type === "email")
                        ? <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            editable={editable}                            
                            keyboardType="email-address"
                            style={styles.textInput}
                            placeholderTextColor="#c9c9c9"
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
                        (type === "phone")
                        ? <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            editable={editable}
                            style={styles.textInput}
                            keyboardType="phone-pad"
                            placeholderTextColor="#c9c9c9"
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
                        (type === "password")
                        ? <View>
                            <TextInput
                                secureTextEntry={!this.state.displayPassword}
                                autoCapitalize='none'
                                autoCorrect={false}
                                editable={editable}
                                style={[styles.textInput, this.props.showPassword ? {paddingRight: 40} : {}]}
                                placeholderTextColor="#c9c9c9"
                                underlineColorAndroid='transparent'
                                onChangeText={this.props.onChangeText}
                                value={this.props.value}
                                placeholder={this.props.placeholder}
                                ref={this.props.onRefInput}
                                returnKeyType={this.props.returnKeyType}
                                onSubmitEditing={this.props.onSubmitEditing}
                            />

                            {
                                this.props.showPassword 
                                ? <TouchableOpacity style={styles.showPasswordButton} onPress={() => this.setState({displayPassword: !this.state.displayPassword})}>
                                    <Image 
                                        style={styles.eye_icon}
                                        source={this.state.displayPassword ? Images.eye_hide_icon : Images.eye_icon}
                                    />
                                </TouchableOpacity>

                                
                                : null
                            }
                        </View>                    
                        : null
                    }

                    {
                        (type === "forgot_password")
                        ? <View style={styles.formField}>
                            <TextInput
                                secureTextEntry={true}
                                autoCapitalize='none' 
                                autoCorrect={false}
                                editable={editable}
                                placeholderTextColor="#c9c9c9"
                                style={styles.textInput}
                                underlineColorAndroid='transparent'
                                onChangeText={this.props.onChangeText}
                                value={this.props.value}
                                placeholder={this.props.placeholder}
                                ref={this.props.onRefInput}
                                returnKeyType={this.props.returnKeyType}
                                onSubmitEditing={this.props.onSubmitEditing}
                            />
                            <TouchableOpacity style={styles.forgotButton} onPress={() => this.props.onForgotPassword()}>
                                <Text style={styles.forgotButtonText}>Forgot</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }  

                    {
                    (this.props.type === "address")
                    ? 
                        <GoogleAutoComplete apiKey={GOOGLE_API_KEY} debounce={300} queryTypes="address">
                            {({ inputValue, handleTextChange, locationResults, fetchDetails }) => (
                                <React.Fragment>
                                <TextInput
                                    value={this.props.value}
                                    onChangeText={(text) => {
                                        handleTextChange(text);
                                        this.props.onChangeText(text);
                                    }}
                                    placeholder={this.props.placeholder}
                                    placeholderTextColor="#c9c9c9"
                                    returnKeyType={this.props.returnKeyType}
                                    onSubmitEditing={this.props.onSubmitEditing}
                                    onFocus={ () => this.setState({showAddressList: true}) }
                                    ref={this.props.onRefInput}
                                    style={styles.addressInput}
                                />
                                {
                                    this.state.showAddressList && this.props.value.length > 0
                                    ? <ScrollView style={{ maxHeight: 150 }}>
                                        {locationResults.map((el, i) => (
                                        <LocationItem
                                            {...el}
                                            fetchDetails={fetchDetails}
                                            key={String(i)}
                                            theme="black"
                                            onSelectAddress={(address) => {
                                                this.setState({showAddressList: false});
                                                this.props.onChangeText(address)
                                            }}
                                        />
                                        ))}
                                    </ScrollView>  
                                    : null
                                }
                                
                                </React.Fragment>
                            )}
                            </GoogleAutoComplete>
                    : null
                }
                    </View>              
                    {
                        errorMessage
                        ? <Text style={styles.errorMessage}>{errorMessage}</Text>
                        : null
                    }
            </View>
        );
    }
}

export default FormInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },

    containerGray: {
        backgroundColor: '#E7E7E7',
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 21,
        paddingLeft: 20,
        paddingRight: 20,
        height: 42,
    },

    labelText: {
        fontFamily: Fonts.regular,
        fontWeight: '700',
        fontSize: 18,
        marginBottom: 10,
        color: '#222',
    },

    textInput: {
        paddingHorizontal: 20,
        borderRadius: 25,
        fontFamily: Fonts.bold,        
        backgroundColor: '#e7ebed',
        fontSize: 16,
        height: '100%',
        height: 50,
        color: 'black',
    },

    hasShowButtonTextInput: {
        fontSize: 16,
        height: '100%',
        marginRight: 30,
        height: 42,
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
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        color: 'red',
        fontSize: 11,
        marginTop: 3,
        marginLeft: 15,
    },

    centerText: {
        textAlign: 'center'
    },

    eye_icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        position: 'absolute',
        top: 0,
        right: 17,
    },

    textViewWithIcon: {
        marginLeft: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#e7e7e7',
    },

    addressInput: {
        paddingHorizontal: 20,
        borderRadius: 25,
        fontFamily: Fonts.bold,        
        backgroundColor: '#e7ebed',
        fontSize: 16,
        height: '100%',
        height: 50,
        color: 'black',
    }
});