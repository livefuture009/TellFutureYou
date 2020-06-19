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
	    	<View style={{ position: 'relative', width: (rightLabel || rightButton || rightIcon) ? screenWidth - 90 : screenWidth }}>
				<TouchableOpacity style={styles.closeButton} onPress={() => onBack()}>
					<Image
			          style={styles.closeButtonIcon}
			          source={Images.back_arrow}
				    />
				</TouchableOpacity>	    	
				<Text numberOfLines={1} style={this.props.align == "left" ? styles.leftTitleText : styles.titleText}>{this.props.title}</Text>	    	
	    	</View>

	    	{
	    		rightLabel
	    		? <View style={{paddingRight: 15}}>
	    			<Text style={styles.rightValueText}>{rightValue}</Text>
	    			<Text style={styles.rightLabelText}>{rightLabel}</Text>
	    		  </View>
	    		: null
	    	}
			
			{
				rightButton
				? <TouchableOpacity style={styles.rightButton} onPress={() => this.props.onRight()}>
					 <Text style={styles.rightButtonText}>{this.props.rightButton}</Text>	
				  </TouchableOpacity>	    	
				: null
			}

			{
				rightIcon == 'walkie_talkie'
				? <TouchableOpacity onPress={() => this.props.onRight()}>
					<Image source={Images.walkie_talkie_icon} style={styles.rightIcon}/>
				  </TouchableOpacity>	    	
				: null
			}	    	
	    </View>
    );
  }
}

const styles = StyleSheet.create({

	container: {
		backgroundColor: Colors.navColor,
		zIndex: 3,
		...ifIphoneX({
			paddingVertical: 20
		 }, {
			paddingVertical: 10
		})
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
		textAlign: 'center',
		fontFamily: Fonts.regular,
		fontSize: 20,
		color: 'white',
	},

	leftTitleText: {
		textAlign: 'left',
		fontFamily: Fonts.bold,
		fontSize: 24,
		marginLeft: 60,
		paddingRight: 20,
		color: 'white',
	},

	rightValueText: {
		fontFamily: Fonts.bold,
		fontSize: 18,
		textAlign: 'right',
		color: 'white',
	},

	rightLabelText: {
		fontFamily: Fonts.regular,
		fontSize: 14,
		textAlign: 'right',
		marginTop: -3,
		color: 'white',
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
	},

	rightButton: {
		borderWidth: 1,
		borderColor: Colors.appColor,
		paddingLeft: 14,		
		paddingRight: 14,
		paddingTop: 7,
		paddingBottom: 7,
		marginRight: 8,
		borderRadius: 5,
	},

	rightButtonText: {
		color: 'white',
		fontFamily: Fonts.bold,
		fontSize: 16,
		textAlign: 'center',
	},

	rightIcon: {
		width: 35,
		height: 35,
		resizeMode: 'contain',
		marginRight: 15,
	},
});