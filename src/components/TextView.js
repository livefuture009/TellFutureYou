import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Colors from '../theme/Colors'

class TextView extends Component {
    render() {
        return (
            <TextInput
                style={[this.props.style, styles.textView]}
                multiline={true}
                underlineColorAndroid='transparent'
                editable={this.props.isEditable} 
                onChangeText={this.props.onChangeText}
                value={this.props.value}
            />
        );
    }
}

export default TextView;

const styles = StyleSheet.create({
    textView: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: Colors.textViewColor,
        borderWidth: 1,
        borderColor: '#e8e8ea',
        height: 200,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: 'OpenSans',
        fontSize: 14,
        textAlignVertical: "top"
    }    
});
