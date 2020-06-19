import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import RoundTextInput from './../RoundTextInput'
import Colors from '../../theme/Colors'

export default class CustomerPage extends React.Component {
  render() {
	const { user, onChangeUser, onChangeLocation, onRegister } = this.props;
    return (
		<View style={styles.container}>
			<View style={styles.rowView}>
				<RoundTextInput
					placeholder="First name" 
					type="text"
					placeholderTextColor={Colors.placeholderColor}
					value={user.firstName} 
					errorMessage={user.firstNameError}		               
					style={{width: '45%'}}
					returnKeyType="next"
					onSubmitEditing={() => { this.lastNameInput.focus() }}
					onChangeText={(text) => onChangeUser("firstName", text)} />

				<RoundTextInput
					placeholder="Last name" 
					type="text"
					placeholderTextColor={Colors.placeholderColor}
					value={user.lastName} 
					errorMessage={user.lastNameError}
					style={{width: '45%'}}
					returnKeyType="next"
					onSubmitEditing={() => { this.emailInput.focus() }}
					onRefInput={(input) => { this.lastNameInput = input }}
					onChangeText={(text) => onChangeUser("lastName", text)} />
			</View>	    	

			<RoundTextInput
				placeholder="Email" 
				type="email"
				placeholderTextColor={Colors.placeholderColor}
				value={user.email} 
				errorMessage={user.emailError}
				returnKeyType="next"
				onSubmitEditing={() => { this.phoneInput.focus() }}
				onRefInput={(input) => { this.emailInput = input }}
				onChangeText={(text) => onChangeUser("email", text)} />

			<RoundTextInput
				placeholder="Phone" 
				type="phone"
				placeholderTextColor={Colors.placeholderColor}
				value={user.phone} 
				errorMessage={user.phoneError}
				returnKeyType="next"
				onSubmitEditing={() => { this.locationInput.focus() }}
				onRefInput={(input) => { this.phoneInput = input }}
				onChangeText={(text) => onChangeUser("phone", text)} />

			<RoundTextInput
				placeholder="Location" 
				type="address"
				placeholderTextColor={Colors.placeholderColor}
				value={user.locationText} 
				errorMessage={user.locationError}
				returnKeyType="next"
				onFocus={() => {this.scroll.props.scrollToPosition(0, 110)}}
				onSubmitEditing={() => { 
					if (user.socialId == null || user.socialId == "" || user.socialId == "undefined") {
						this.passwordInput.focus()
					} else {
						Keyboard.dismiss()
					}
				}}
				onRefInput={(input) => { this.locationInput = input }}
				onSelectAddress={(address) => onChangeLocation(address)}      
				onChangeText={(text) => onChangeUser("location", text)} 
			/>
			{
				user.socialId == null
				? <View>
						<RoundTextInput
							placeholder="Password" 
							type="password"
							placeholderTextColor={Colors.placeholderColor}
							value={user.password}
							errorMessage={user.passwordError} 
							returnKeyType="next"
							onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
							onRefInput={(input) => { this.passwordInput = input }}
							onChangeText={(text) => onChangeUser("password", text)} />

						<RoundTextInput
							placeholder="Confirm Password" 
							type="password"
							returnKeyType="done"
							placeholderTextColor={Colors.placeholderColor}
							value={user.confirmPassword} 
							errorMessage={user.confirmPasswordError} 
							returnKeyType="done"
							onRefInput={(input) => { this.confirmPasswordInput = input }}
							onChangeText={(text) => onChangeUser("confirmPassword", text)} 
							onSubmitEditing={() => onRegister()}
						/>
					</View>

				: null
			}
			
		</View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 35, 
		paddingRight: 35, 
		paddingTop: 20,
		paddingBottom: 20,
	},

	rowView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	}

});