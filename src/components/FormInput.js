import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
import Images from '../theme/Images'
import Fonts from '../theme/Fonts'

const win = Dimensions.get('window');

class FormInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
          displayPassword: false,
        }
    }

    render() {
        const { maxLength } = this.props;
        return (
            <View style={
                [
                    {width: 'auto'}, 
                    this.props.style, 
                    this.props.theme == "gray" ? styles.containerGray : styles.container]
            }>
                {
                    this.props.prefixIcon
                    ? <View style={styles.iconView}>
                        {
                            this.props.prefixIcon === "email"
                            ? <Image 
                                style={styles.iconImage}
                                source={Images.email_icon}
                              />
                            : null
                        }

                        {
                            this.props.prefixIcon === "password"
                            ? <Image 
                                style={styles.iconImage}
                                source={Images.password_icon}
                              />
                            : null
                        }
                      </View>    
                    : null
                }
                

                <View style={this.props.prefixIcon ? styles.textViewWithIcon : 'textView'}>
                {
                    (this.props.type === "text")
                    ? <TextInput
                        style={[styles.textInput, this.props.theme == "gray" ? styles.grayText : styles.whiteText, this.props.align == "center" ? styles.centerText : null]}
                        placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : "#fff"}
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        maxLength={maxLength}
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
                        style={[styles.textInput, this.props.theme == "gray" ? styles.grayText : styles.whiteText]}
                        placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : "#fff"}
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        maxLength={maxLength}
                        placeholder={this.props.placeholder}
                        ref={this.props.onRefInput}
                        returnKeyType={this.props.returnKeyType}
                        onSubmitEditing={this.props.onSubmitEditing}
                    />
                    : null
                }

                {
                    (this.props.type === "password")
                    ? <View>
                        <TextInput
                            secureTextEntry={!this.state.displayPassword}
                            autoCapitalize='none'
                            autoCorrect={false}
                            style={[
                                styles.textInput, 
                                this.props.showPassword ? styles.hasShowButtonTextInput : styles.textInput,
                                this.props.theme == "gray" ? styles.grayText : styles.whiteText
                                ]}
                            placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : "#fff"}
                            underlineColorAndroid='transparent'
                            onChangeText={this.props.onChangeText}
                            value={this.props.value}
                            maxLength={maxLength}
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
                                    source={Images.eye_icon}
                                />
                            </TouchableOpacity>

                            
                            : null
                        }
                      </View>                    
                    : null
                }

                {
                    (this.props.type === "forgot_password")
                    ? <View style={styles.formField}>
                        <TextInput
                            secureTextEntry={true}
                            autoCapitalize='none' 
                            autoCorrect={false}
                            placeholderTextColor={this.props.placeholderTextColor ? this.props.placeholderTextColor : "#fff"}
                            style={[styles.textInput, this.props.theme == "gray" ? styles.grayText : styles.whiteText]}
                            underlineColorAndroid='transparent'
                            onChangeText={this.props.onChangeText}
                            value={this.props.value}
                            maxLength={maxLength}
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

    textInput: {
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
        fontFamily: Fonts.regular,        
    },

    grayText: {
        color: 'black',
        fontFamily: Fonts.regular,
    },

    forgotTextInput: {
        color: '#474747',
        paddingLeft: 5,
        fontSize: 17,
        paddingRight: 70,
        position: 'relative',
        color: 'black',
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
        color: 'black',
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
        fontFamily: Fonts.italic,
        color: 'red',
        fontSize: 11,
        marginLeft: 45,
    },

    centerText: {
        textAlign: 'center'
    },
});