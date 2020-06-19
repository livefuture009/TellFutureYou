import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

export default class HeaderInfoBar extends React.Component {
  render() {
    return (
	    <View style={styles.container}>
	    	<TouchableOpacity style={styles.closeButton} onPress={() => this.props.onBack()}>
				<Image
		          style={styles.closeButtonIcon}
		          source={Images.back_arrow}
			    />
			</TouchableOpacity>	    	
	    	<Text style={styles.titleText}>{this.props.title}</Text>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 60,
		paddingBottom: 20,
	},

	titleText: {
		textAlign: 'left',
		fontFamily: Fonts.bold,
		fontSize: 26,
	},

	closeButton: {
		position: 'absolute',
		width: 30,
		height: 30,
		left: 15,
		zIndex: 2
	},

	closeButtonIcon: {
		width: '100%',
		height: '100%',
	}
});