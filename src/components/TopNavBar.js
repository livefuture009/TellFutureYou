import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import { ifIphoneX } from 'react-native-iphone-x-helper'

const screenWidth = Dimensions.get('window').width;

export default class TopNavBar extends React.Component {
  render() {
	const { shadow, rightLabel, rightValue, rightButton, onBack, rightIcon} = this.props;
    return (
	    <View 
	    	style={[
	    		shadow ? styles.containerWithShadow : styles.container, 
	    		(rightLabel || rightButton || rightIcon) ? styles.containerWithRight : null
	    	]}
	    >
			<TouchableOpacity style={styles.closeButton} onPress={() => onBack()}>
				<Image
					style={styles.closeButtonIcon}
					source={Images.back_arrow}
				/>
			</TouchableOpacity>	    	
			<Text numberOfLines={1} style={styles.titleText}>{this.props.title}</Text>	    	
			{
				rightButton === "schedule"
				? <TouchableOpacity style={styles.rightButton} onPress={() => this.props.onRight()}>
					<Image source={Images.icon_calendar} style={styles.rightIcon}/>
				  </TouchableOpacity>	    	
				: null
			}
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		zIndex: 3,
	},

	containerWithShadow: {
		paddingTop: 20,
		paddingBottom: 20,
		backgroundColor: 'white',
		zIndex: 3,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
	},

	containerWithRight: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	titleText: {
		width: '100%',
		textAlign: 'center',
		fontFamily: Fonts.bold,
		fontSize: 20,
		color: 'black',
		paddingHorizontal: 50,
		paddingVertical: 10,
	},

	closeButton: {
		position: 'absolute',
		width: 30,
		height: 30,
		left: 15,
		top: 7, 
		zIndex: 2
	},

	closeButtonIcon: {
		width: '100%',
		height: '100%',
	},

	rightButton: {
		position: 'absolute',
		right: 15,
	},

	rightButtonText: {
		color: 'white',
		fontFamily: Fonts.bold,
		fontSize: 16,
		textAlign: 'center',
	},

	rightIcon: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
	},
});