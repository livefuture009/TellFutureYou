import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import FastImage from 'react-native-fast-image'

export default class HeaderInfoBar extends React.Component {
  render() {
	const { 
		title, 
		user, 
		unReadMessageCount, 
		unReadNotificationCount, 
		onChat, 
		onNotification, 
		onProfile
	} = this.props;

    return (
	    <View style={styles.container}>
	    	<Text style={styles.titleText}>{title}</Text>
	    	<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TouchableOpacity style={styles.notificationButton} onPress={() => onChat()}>
	    			<Image
			          style={styles.notificationImage}
			          source={Images.chat_icon}
				    />
					{
				    	unReadMessageCount
				    	? <View style={styles.badgeView}>
						  	<Text style={styles.badgeText}>{unReadMessageCount}</Text>
						  </View>				    
				    	: null				    	
				    }	
	    		</TouchableOpacity>

	    		<TouchableOpacity style={styles.notificationButton} onPress={() => onNotification()}>
	    			<Image
			          style={styles.notificationImage}
			          source={Images.notification_icon}
				    />
				    {
				    	unReadNotificationCount
				    	? <View style={styles.badgeView}>
						  	<Text style={styles.badgeText}>{unReadNotificationCount}</Text>
						  </View>				    
				    	: null				    	
				    }				    
	    		</TouchableOpacity>

	    		<TouchableOpacity style={styles.avatar} onPress={() => onProfile()}>
	    			<FastImage
			          style={styles.image}
			          source={user && user.avatar ? {uri: user.avatar} : Images.account_icon}
				    />
	    		</TouchableOpacity>
	    	</View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: Colors.navColor,
	},

	titleText: {
		textAlign: 'left',
		fontFamily: Fonts.bold,
		fontSize: 26,
		color: 'white',
	},

	badgeView: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: '#f12105',
		justifyContent: 'center',
		alignItems: 'center',		
		position: 'absolute',
		right: -5,
		top: -3,
	},

	badgeText: {
		fontSize: 10,
		fontFamily: Fonts.bold,
		textAlign: 'center',
		color: 'white',
	},

	notificationButton: {
		width: 24,
		height: 24,
		marginLeft: 15,
	},

	notificationImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},

	avatar: {
		marginLeft: 15,
		width: 30,
		height: 30,
		borderRadius: 15,
		overflow: 'hidden',
		backgroundColor: 'lightgray',
	},

	image: {
		width: 30,
		height: 30,
		borderRadius: 15,
		resizeMode: 'cover',
	},
});