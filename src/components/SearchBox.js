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
                    <TextInput
                        style={styles.textInput}
                        placeholderTextColor="#acacac"
                        underlineColorAndroid='transparent'
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                    />
                    <TouchableOpacity style={styles.searchButton}>
                        <Image
                          style={styles.searchIcon}
                          source={Images.search_icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default LabelFormInput;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
        paddingHorizontal: 10,
    },

    content: {
        backgroundColor: 'white',        
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
        marginLeft: 10,
    },

    searchIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});