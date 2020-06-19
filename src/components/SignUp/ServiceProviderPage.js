import React from 'react';
import { StyleSheet, View, Text, Keyboard } from 'react-native';
import LabelFormInput from './../LabelFormInput'
import MultiSelect from '../react-native-multiple-select';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'

export default class ServiceProviderPage extends React.Component {
   constructor(props) {
     super(props)
     this.state = {
	    selectedItems: []
	  };
   }
  
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.props.onChangeUser("services", selectedItems)
  };

  filterData(data) {
  	var response = [];
  	for (var i = 0; i < data.length; i++) {
  		const item = data[i];
  		response.push({
  			id: item._id, 
  			label: item.name, 
  			value: item.name
  		});
  	}

  	return response;
  }

  render() {
	const { user, onChangeUser, onChangeLocation, onRegister } = this.props;
    return (
		<View style={styles.container}>
			<View style={styles.rowView}>
				<LabelFormInput
					label="First name" 
					type="text"
					placeholderTextColor={Colors.placeholderColor}
					value={user.firstName} 
					errorMessage={user.firstNameError}
					style={{width: '45%'}}
					returnKeyType="next"
					onSubmitEditing={() => { this.lastNameInput.focus() }}
					onChangeText={(text) => onChangeUser("firstName", text)} />

				<LabelFormInput
					label="Last name" 
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

			<LabelFormInput
				label="Email" 
				type="email"
				placeholderTextColor={Colors.placeholderColor}
				value={user.email} 
				errorMessage={user.emailError}
				returnKeyType="next"
				onSubmitEditing={() => { this.phoneInput.focus() }}
				onRefInput={(input) => { this.emailInput = input }}
				onChangeText={(text) => onChangeUser("email", text)} />

			<LabelFormInput
				label="Phone" 
				type="phone"
				placeholderTextColor={Colors.placeholderColor}
				value={this.props.user.phone} 
				errorMessage={user.phoneError}
				returnKeyType="next"
				onSubmitEditing={() => { this.locationInput.focus() }}
				onRefInput={(input) => { this.phoneInput = input }}
				onChangeText={(text) => onChangeUser("phone", text)} />


			<LabelFormInput
				label="Location" 
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
					<LabelFormInput
						label="Password" 
						type="password"
						placeholderTextColor={Colors.placeholderColor}
						value={user.password} 
						errorMessage={user.passwordError}
						returnKeyType="next"
						onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
						onRefInput={(input) => { this.passwordInput = input }}
						onChangeText={(text) => onChangeUser("password", text)} />

					<LabelFormInput
						label="Confirm Password" 
						type="password"
						placeholderTextColor={Colors.placeholderColor}
						value={user.confirmPassword} 
						errorMessage={user.confirmPasswordError}						
						returnKeyType="next"
						onSubmitEditing={() => { this.availabilityFromInput.togglePicker() }}
						onRefInput={(input) => { this.confirmPasswordInput = input }}
						onChangeText={(text) => onChangeUser("confirmPassword", text)} />
					</View>
				: null
			}
			
			<View style={styles.rowView}>
				<LabelFormInput
					label="Availability from" 
					type="dropdown"
					placeholder=""
					data={this.filterData(this.props.availabilities)}
					value={user.availabilityFrom} 
					errorMessage={user.availabilityFromError}
					style={{width: '45%'}}
					onRefInput={(input) => { this.availabilityFromInput = input }}
					onChangeText={(text) => onChangeUser("availabilityFrom", text)} />

				<LabelFormInput
					label="To" 
					type="dropdown"
					placeholder=""
					data={this.filterData(this.props.availabilities)}
					value={user.availabilityTo} 
					errorMessage={user.availabilityToError}
					style={{width: '45%'}}
					onChangeText={(text) => onChangeUser("availabilityTo", text)} />
			</View>

			<LabelFormInput
				label="Rate" 
				type="dropdown"
				placeholder=""
				data={this.filterData(this.props.rates)}
				value={user.rate} 
				errorMessage={user.rateError}
				onChangeText={(text) => onChangeUser("rate", text)} />

			<MultiSelect
				hideTags
				items={this.props.services}
				uniqueKey="_id"
				ref={(component) => { this.multiSelect = component }}
				onSelectedItemsChange={this.onSelectedItemsChange}
				selectedItems={this.state.selectedItems}
				selectText="Pick Services"
				searchInputPlaceholderText="Search Services..."
				tagRemoveIconColor={Colors.appColor}
				tagBorderColor={Colors.appColor}
				tagTextColor={Colors.appColor}
				selectedItemTextColor={Colors.appColor}
				selectedItemIconColor={Colors.appColor}
				itemTextColor="#000"
				displayKey="name"
				searchInputStyle={{ fontSize: 16, padding: 5, color: '#CCC' }}
				submitButtonColor={Colors.appColor}
				submitButtonText="Select"
				itemFontSize={16}
				fontSize={16}
				hideDropdown={true}
				styleInputGroup={{ paddingVertical: 5}}
				styleItemsContainer={{paddingVertical: 10}}
				styleRowList={{paddingVertical: 5}}
			/>
			{
				this.multiSelect &&
				<View>
					{this.multiSelect.getSelectedItemsExt(this.state.selectedItems)}
				</View>	
			}
			{
				(user && user.servicesError) 
				? <Text style={styles.errorMessage}>{user.servicesError}</Text>
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
		backgroundColor: 'white',
	},

	rowView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	errorMessage: {
        fontFamily: Fonts.italic,
        color: 'red',
        fontSize: 11,
    },
});