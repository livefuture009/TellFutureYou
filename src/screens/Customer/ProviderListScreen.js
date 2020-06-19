import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Swiper from 'react-native-swiper'
import TopNavBar from '../../components/TopNavBar'
import ProviderCell from '../../components/Customer/ProviderCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import EmptyView from '../../components/EmptyView'
import TopTabBar from '../../components/TopTabBar'
import Toast from 'react-native-easy-toast'
import Colors from '../../theme/Colors'
import ProviderPin from '../../components/Map/ProviderPin'
import ProviderCallout from '../../components/Map/ProviderCallout'

import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class ProviderListScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      currentPage: 0,
      selectedJob: null,
      providerList: [],
      invitedList: [],
    }
  }

  componentDidMount() {
    this.setState({isLoading: true}, () => { 
      const { job } = this.props.route.params;  
      this.setState({selectedJob: job});
      const service_id = job.service._id;

      // Get Nearby Providers      
      this.props.dispatch({
        type: actionTypes.GET_NEARBY_PROVIDERS,
        lat: job.lat,
        lng: job.lng,
        service_id: service_id
      })
    });      
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getNearbyProvidersStatus != this.props.getNearbyProvidersStatus) {
      if (this.props.getNearbyProvidersStatus == Status.SUCCESS) {
        this.setState({isLoading: false, providerList: this.props.providers});  
      } else if (this.props.getNearbyProvidersStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    if (this.props.route.params && this.props.route.params.onSelectedProviders) {
      const {invitedList} = this.state;
      this.props.route.params.params.onSelectedProviders(invitedList);
    }
    this.props.navigation.goBack();
  }

  onInviteProvider(provider) {
    const {invitedList} = this.state;
    invitedList.push(provider);    
    this.setState({invitedList});
  }

  onChoose(data) {
    if (!this.isInvited(data, this.state.invitedList)) {
      const { job } = this.props.route.params;  
      const {invitedList} = this.state;

      this.props.navigation.navigate('ProviderProfile', {
        provider: data,
        job: job,
        invitedList: invitedList,
        isShowInvite: true,
        onInviteProvider: () => {
          this.onInviteProvider(data)
        }
      });
    }    
  } 

  onSelectPage=(page)=> {
    const change = page - this.state.currentPage;
    if (change) return this.refs.swiper.scrollBy(change, true);;
  }

  onSwipeIndexChanged=(index)=> {
    this.setState({currentPage: index});
  }

  isInvited(provider, invitedList) {
    // Check invited.
    if (invitedList && invitedList.length > 0) {
        for (var i = 0; i < invitedList.length; i++) {
            if (invitedList[i]._id === provider._id) {
                return true;
            }
        }            
    }
    return false;
  }

  render() {
    const { selectedJob, providerList, invitedList, currentPage } = this.state;
    const services = this.props.services;
    const currentLat = (selectedJob && selectedJob.lat) ? selectedJob.lat : this.props.lat;
    const currentLng = (selectedJob && selectedJob.lng) ? selectedJob.lng : this.props.lng;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="NEARBY PROVIDERS" align="left" onBack={() => this.onBack()}/>
          <TopTabBar titles={["Nearby Providers", "View Map"]} currentPage={currentPage} onSelectPage={this.onSelectPage}/>
          <Swiper 
            style={styles.wrapper} 
            ref='swiper'
            showsPagination={false} 
            loop={false}
            onIndexChanged={this.onSwipeIndexChanged}
          >
            <View style={styles.slide}>
              {
                (providerList && providerList.length > 0)
                ? <FlatList
                    style={styles.listView}
                    data={providerList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, i}) => (
                      <View style={styles.itemContainer}>
                        <ProviderCell 
                          data={item} 
                          services={services}
                          job={selectedJob}
                          isInvited={this.isInvited(item, invitedList)}
                          key={i} 
                          onChoose={(data) => this.onChoose(data)} 
                        />
                      </View>
                    )}
                  />
                : <EmptyView title="No nearby providers."/>
              }
            </View>
            <View style={styles.slide}>
              <MapView
               provider={PROVIDER_GOOGLE}
               style={styles.map}
               initialRegion={{
                 latitude: currentLat,
                 longitude: currentLng,
                 latitudeDelta: 0.015,
                 longitudeDelta: 0.0121,
               }}
             >
              <Marker
                coordinate={{
                  latitude: currentLat,
                  longitude: currentLng,
                }}
              /> 
              {
                providerList.map((item, index) => {
                  return (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: item.geolocation.coordinates[1],
                        longitude: item.geolocation.coordinates[0],
                      }}
                    > 
                      <ProviderPin avatar={item.avatar}/>
                      <Callout>
                        <ProviderCallout 
                          provider={item} 
                          currentLat={currentLat} 
                          currentLng={currentLng} 
                        />
                      </Callout>
                    </Marker>
                  )
                })
              }

             </MapView>
            </View>
          </Swiper>

          <Toast ref="toast"/>
          {
            this.state.isLoading
            ? <LoadingOverlay />
            : null
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
  },

  slide: {
    flex: 1,
    backgroundColor: 'red',
  },

  oneRow: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  zipCodeText: {
    fontFamily: 'OpenSans',
    color: '#8d8d8d',
    fontSize: 16,
  },

  blueText: {
    fontFamily: 'OpenSans',
    color: '#3766fb',
    fontSize: 16,
  },

  listView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  wrapper: {},
  slide: {
    flex: 1,
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    lat: state.user.lat,
    lng: state.user.lng,
    services: state.globals.services,
    providers: state.user.providers,
    errorMessage: state.user.errorMessage,
    getNearbyProvidersStatus: state.user.getNearbyProvidersStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderListScreen);
