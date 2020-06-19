import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SearchBox from '../../components/SearchBox'
import ServiceCell from '../../components/Customer/ServiceCell'
import EmptyView from '../../components/EmptyView'
import Colors from '../../theme/Colors'

const numColumns = 3;
const size = (Dimensions.get('window').width - 16)/numColumns;

class CustomerHomeScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      serviceList: [],
      keyword: '',
      isSearch: false,
    }
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.setState({serviceList: _SELF.props.services});
    }, 100)
  }

  onChoose(data) {
    if (data.subCategories.length > 0) {
      this.props.navigation.navigate('SubService', {service: data});  
    } else {
      this.props.navigation.navigate('JobPost', {service: data, subCategories: [], backLevel: 1});  
    }    
  } 

  onSearch() {
    this.setState({isSearch: !this.state.isSearch});
  }

  searchService(keyword) {
    let list = [];

    if (keyword && keyword.length > 0) {
      for (var i = 0; i < this.props.services.length; i++) {
        let service = this.props.services[i];
        let name = service.name.toLowerCase();
        if (name.indexOf(keyword.toLowerCase()) >= 0) {
          list.push(service);
        }
      }  
    } else {
      list = this.props.services;
    }
    
    this.setState({keyword: keyword, serviceList: list});
  }

  onNotification() {
    this.props.navigation.navigate('Notification');  
  }

  onProfile() {
    this.props.navigation.navigate('EditProfile');  
  }

  onChat() {
    this.props.navigation.navigate('ChatList');  
  }

  render() {
    const { currentUser, unreadNumber, unreadMessages} = this.props;
    const { keyword, serviceList } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="HOME" 
            user={currentUser} 
            isSearch={true} 
            onSearch={() => this.onSearch()}
            unReadMessageCount={unreadMessages}
            unReadNotificationCount={unreadNumber}
            onNotification={() => this.onNotification()}
            onChat={() => this.onChat()}
            onProfile={() => this.onProfile()} />
          {
            this.state.isSearch 
            ? <SearchBox 
                style={{marginTop: 10, marginBottom: 10}} 
                value={keyword} 
                placeholder="Search ..." 
                onChangeText={(text) => this.searchService(text)}
                />
            : null
          }        

          <View style={styles.contentView}>
            {
              (serviceList && serviceList.length > 0) 
              ? <FlatList
                  data={serviceList}
                  ListHeaderComponent={() => <View style={{height: 8}}/>}
                  ListFooterComponent={() => <View style={{height: 70}}/>}
                  renderItem={({item, index}) => (
                    <View style={styles.itemContainer}>
                      <ServiceCell data={item} key={index} onChoose={(data) => this.onChoose(data)} />
                    </View>
                  )}
                  keyExtractor={(item, index) => item._id}
                  numColumns={numColumns}
                  style={{paddingLeft: 8, paddingRight: 8}}
                />
              : <EmptyView title="No services." />
            }
            
          </View>
        </View>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },

  itemContainer: {
    width: size,
    height: size,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    services: state.globals.services,
    unreadNumber: state.notifications.unreadNumber,
    unreadMessages: state.user.unreadMessages,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerHomeScreen);