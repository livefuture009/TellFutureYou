import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList
} from 'react-native';

import {connect} from 'react-redux';
import TopNavBar from '../../components/TopNavBar'
import CategoryCell from '../../components/CategoryCell'
import Colors from '../../theme/Colors'

class SubServiceScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      selectedList: [],
    }    
  }

  componentDidMount() {
    const { service } = this.props.route.params;
    const subCategories = service.subCategories;
    for (var i = 0; i < subCategories.length; i++) {
      var item = subCategories[i];
      item.isSelected = false;
    }
    this.setState({list: subCategories});
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onNext() {
    const { service } = this.props.route.params;
    this.props.navigation.navigate('JobPost', {service: service, subCategories: this.state.selectedList, backLevel: 2});  
  }

  onChooseService(data) {
    var isExisting = false;
    var selectedList = this.state.selectedList;

    for (var i = 0; i < selectedList.length; i++) {
      let item = this.state.selectedList[i];
      if (item == data.name) {
        isExisting = true;
        selectedList.splice(i, 1);
        break;
      }
    }

    if (!isExisting) {
      selectedList.push(data.name);
    }
    this.setState({list: this.state.list, selectedList: selectedList});
  }

  checkSelected(data) {
    var isExisting = false;
    var selectedList = this.state.selectedList;

    for (var i = 0; i < selectedList.length; i++) {
      let item = this.state.selectedList[i];
      if (item == data.name) {
        isExisting = true;
        break;
      }
    }
    return isExisting;
  }

  _renderItem = ({item, index}) => (
    <CategoryCell
      key={item.id}
      data={item}
      isSelected={this.checkSelected(item)}
      onChoose={(data) => this.onChooseService(data)}
    />
  );

  render() {
    const { service } = this.props.route.params;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar 
            title={service.name} 
            rightButton="Next"
            align="left" 
            onBack={() => this.onBack()} 
            onRight={() => this.onNext()}
          />
          <FlatList
            style={styles.listView}
            data={this.state.list}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
  },

  contentView: {
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  }
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SubServiceScreen);