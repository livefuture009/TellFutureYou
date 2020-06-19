import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import Images from '../theme/Images';
import Colors from '../theme/Colors';

class LabelFormInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
    }

    render() {
        return (
            <View style={[this.props.style, styles.container]}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.searchButton}>
                        <Image
                          style={styles.searchIcon}
                          source={Images.search_icon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        placeholderTextColor="#acacac"
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                    />
                </View>
            </View>
        );
    }
}

export default LabelFormInput;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.navColor,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },

    content: {
        backgroundColor: '#1f1e60',        
        height: 42,
        borderRadius: 21,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'OpenSans', 
        color: 'white',
    },

    searchButton: {
        width: 20,
        height: 20,
        marginRight: 10,
    },

    searchIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});