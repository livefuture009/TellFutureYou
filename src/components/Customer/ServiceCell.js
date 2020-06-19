import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from "prop-types";
import Colors from '../../theme/Colors'
import FastImage from 'react-native-fast-image'

export default class ServiceCell extends React.Component {
  render() {
	const { data, onChoose } = this.props;
    return (
	    <TouchableOpacity style={styles.container} onPress={() => onChoose(data)}>
	    	<FastImage 
	        	style={styles.iconImage}
	        	source={{uri: data.icon}} 
	      	/>
	      	<Text style={styles.labelText}>{data.name}</Text>
	    </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
	container: { 
		flex: 1,
		alignItems: 'center',
		margin: 5,
		padding: 5,
	},

	iconImage: {
		width: 90,
		height: 90,
		resizeMode: 'contain',
		backgroundColor: 'white',
		borderRadius: 45,
	},

  	labelText: {
  		textAlign: 'center',
  		fontFamily: 'OpenSans',
  		textTransform: 'uppercase',
  		marginTop: 5,
  	}
});