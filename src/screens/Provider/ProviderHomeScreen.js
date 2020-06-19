import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SearchBox from '../../components/SearchBox'
import JobCell from '../../components/Provider/JobCell'
import EditZipcodeDialog from '../../components/EditZipcodeDialog'
import Colors from '../../theme/Colors'
import LoadingOverlay from '../../components/LoadingOverlay'
import EmptyView from '../../components/EmptyView'
import TopTabBar from '../../components/TopTabBar'
import Swiper from 'react-native-swiper'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import Messages from '../../theme/Messages';

class ProviderHomeScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      keyword: '',
      zipCode: '',
      zipCodeError: null,
      showEditZipDialog: false,
      isLoading: false,

      jobList: [],
      originalJobList: [],

      proposalJobList: [],
      originalProposalList: [],

      offerList: [],
      originalOfferList: [],

      currentPage: 0,
    }
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initData();      
    }, 100);
  }

  onSelectPage=(page)=> {
    const change = page - this.state.currentPage;
    if (change) return this.refs.swiper.scrollBy(change, true);
  }

  onSwipeIndexChanged=(index)=> {
    this.setState({currentPage: index});
  }
  
  initData() {
    const { currentUser } = this.props;
    var zipCode = this.props.currentZipcode;
    if (!zipCode || zipCode.length == 0) {
      zipCode = this.props.currentUser.zipcode;

      // Set Zipcode for user.
      this.props.dispatch({
        type: actionTypes.SET_ZIPCODE,
        zipcode: zipCode
      });
    }

    this.setState({zipCode: zipCode}, () => { 
      this.searchJobsByZipcode();
    });

    // Get Proposal Jobs.
    this.props.dispatch({
      type: actionTypes.GET_PROPOSED_JOBS,
      user_id: currentUser._id
    });

  }  

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;
    if (prevProps.getJobsByZipcodeStatus != this.props.getJobsByZipcodeStatus) {
      if (this.props.getJobsByZipcodeStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.getJobsByZipcode();
      } else if (this.props.getJobsByZipcodeStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    if (prevProps.searchJobs != this.props.searchJobs) {
      this.getJobsByZipcode();
    }

    if (prevProps.proposalJobs != this.props.proposalJobs) {
      const { proposalJobs } = this.props;
      const offers = [];
      const proposals = [];

      proposalJobs.forEach(element => {
        if (element.offer && element.offer.user) {
          if (typeof element.offer.user === 'string' || element.offer.user instanceof String) {
            if (element.offer.user == currentUser._id) {
              offers.push(element);
            }
          } else if (element.offer.user._id == currentUser._id) {
            offers.push(element);
          }          
        } else {
          proposals.push(element);
        }
      });

      // Sort Proposal Jobs.
      proposals.sort((a, b) => {
        var aProposalAt = 0;
        var bProposalAt = 0;
        if (a.proposals && a.proposals.length) {
          a.proposals.forEach(item => {
            if (item.user == currentUser._id) {
              aProposalAt = item.createdAt;
              return;
            }
          });
        }

        if (b.proposals && b.proposals.length) {
          b.proposals.forEach(item => {
            if (item.user == currentUser._id) {
              bProposalAt = item.createdAt;
              return;
            }
          });
        }

        return (aProposalAt > bProposalAt) ? -1 : 1;
      });

      // Sort Offer Jobs.
      offers.sort((a, b) => {
        return (a.offer.createdAt > b.offer.createdAt) ? -1 : 1;
      });

      this.setState({
        isLoading: false, 
        proposalJobList: proposals,
        originalProposalList: proposals,
        offerList: offers,
        originalOfferList: offers
      });
    }

    // Move Active Page for notification.
    if (this.props.route.params && this.props.route.params.activePage) {
      const { activePage } = this.props.route.params;
      if (activePage != this.state.currentPage) {
        this.setState({currentPage: activePage});
        this.onSelectPage(activePage);
        this.props.navigation.setParams({activePage: null});
      }
    }
  }

  searchJobsByZipcode() {
    if (this.state.zipCode && this.state.zipCode.length > 0) {
      let user_id = this.props.currentUser._id;
      this.setState({isLoading: true});

      // Search Jobs by Zipcode.
      this.props.dispatch({
        type: actionTypes.GET_JOBS_BY_ZIPCODE,
        user_id: user_id,
        zipcode: this.state.zipCode
      });
    }    
  }

  onSearch(text) {
    if (text && text.length > 0) {
      const keyword = text.toLowerCase();
      
      const jobList = [];
      const proposalList = [];
      const offerList = [];

      this.state.originalJobList.forEach(element => {
        if (element.title.toLowerCase().indexOf(keyword) >= 0 || element.description.toLowerCase().indexOf(keyword) >= 0) {
          jobList.push(element);
        }
      });

      this.state.originalProposalList.forEach(element => {
        if (element.title.toLowerCase().indexOf(keyword) >= 0 || element.description.toLowerCase().indexOf(keyword) >= 0) {
          proposalList.push(element);
        }
      });

      this.state.originalOfferList.forEach(element => {
        if (element.title.toLowerCase().indexOf(keyword) >= 0 || element.description.toLowerCase().indexOf(keyword) >= 0) {
          offerList.push(element);
        }
      });

      this.setState({
        keyword: text,
        jobList: jobList,
        proposalJobList: proposalList,
        offerList: offerList
      });      
    } else {
      this.setState({
        keyword: text,
        jobList: this.state.originalJobList,
        proposalJobList: this.state.originalProposalList,
        offerList: this.state.originalOfferList
      });
    }
  }

  resetData(jobs) {
    const { zipCode } = this.state;

    // Filter Jobs for current zip code.
    var list = [];
    jobs.forEach(item => {
      if (item.zipcode === zipCode) {
        list.push(item);
      }
    });

    this.setState({
      isLoading: false,  
      jobList: list, 
      originalJobList: list,
    });
  }
 
  onChoose(data) {
    this.props.navigation.navigate('ProviderJobDetail', {job: data});
  } 

  onEditZipCode() {
    this.setState({showEditZipDialog: true, zipCodeError: null});
  }

  onChangeZipCode(code) {
    if (code == null || code.length == 0) {
      this.setState({zipCode: code, zipCodeError: Messages.InvalidZipCode});  
      return;
    }
    this.setState({zipCode: code, zipCodeError: null});

    // Set Zipcode for user.
    this.props.dispatch({
      type: actionTypes.SET_ZIPCODE,
      zipcode: code
    });
  }

  onApplyCode() {
    const { zipCode } = this.state;
    if (zipCode && zipCode.trim().length > 0) {
      this.setState({showEditZipDialog: false});
      this.searchJobsByZipcode();
    } else {
      this.setState({zipCodeError: Messages.InvalidZipCode});
    }    
  }

  onCloseZipDialog() {
    this.setState({showEditZipDialog: false}); 
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

  getJobsByZipcode() {
    this.setState({isLoading: false});
    this.resetData(this.props.searchJobs);
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  _renderItem = ({item, index}) => (
    <JobCell
      key={item.id}
      data={item}
      onChoose={(data) => this.onChoose(data)}
    />
  );

  render() {
    const { unreadNumber, unreadMessages } = this.props;
    const { zipCode, keyword, currentPage, jobList, proposalJobList, offerList } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="HOME" 
            user={this.props.currentUser} 
            unReadMessageCount={unreadMessages}
            unReadNotificationCount={unreadNumber}
            onNotification={() => this.onNotification()}
            onProfile={() => this.onProfile()}
            onChat={() => this.onChat()}
          />
          <SearchBox 
            value={keyword} 
            style={{marginTop: -8}}
            placeholder="Search..." 
            onChangeText={(text) => this.onSearch(text)}
          />

          <TopTabBar 
              titles={["FOR YOU", "APPLICATIONS", "OFFER"]} 
              currentPage={currentPage} 
              onSelectPage={(index) => this.onSelectPage(index)} 
            />          
          <View style={styles.contentView}>
          <Swiper 
            style={styles.wrapper} 
            ref='swiper'
            showsPagination={false} 
            loop={false}
            onIndexChanged={this.onSwipeIndexChanged}
          >
            {/* For You Search Page */}
            <View style={styles.slide}>
              <View style={styles.oneRow}>
                <Text style={styles.zipCodeText}>Zip Code: {zipCode}</Text>
                <TouchableOpacity onPress={() => this.onEditZipCode()}>
                  <Text style={styles.blueText}>Edit Zip Code</Text>
                </TouchableOpacity>
              </View>
              {
                jobList.length > 0
                ? <FlatList
                    style={styles.listView}
                    data={jobList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                  />
                : <EmptyView title="No jobs found"/>
              }
            </View>

            {/* Proposals */}
            <View style={styles.slide}>
              {
                proposalJobList.length > 0
                ? <FlatList
                    style={styles.listView}
                    data={proposalJobList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                  />
                : <EmptyView title="No applicants yet"/>
              }
            </View>

            {/* Offer */}
            <View style={styles.slide}>
              {
                offerList.length > 0
                ? <FlatList
                    style={styles.listView}
                    data={offerList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                  />
                : <EmptyView title="No offers yet"/>
              }
            </View>

          </Swiper>
          </View>
        </View>
        {
          this.state.showEditZipDialog
          ? <EditZipcodeDialog 
            zipcode={this.state.zipCode} 
            error={this.state.zipCodeError}
            onApply={() => this.onApplyCode()} 
            onClose={() => this.onCloseZipDialog()}
            onChange={(text) => this.onChangeZipCode(text)}/>
          : null
        }

        <Toast ref="toast"/>
        {
          this.state.isLoading
          ? <LoadingOverlay />
          : null
        }        
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
  },

  oneRow: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 15,
    paddingRight: 15,
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
    color: Colors.appColor,
    fontSize: 16,
  },

  listView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
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
    currentZipcode: state.user.currentZipcode,
    unreadMessages: state.user.unreadMessages,
    unreadNumber: state.notifications.unreadNumber,
    searchJobs: state.jobs.searchJobs,
    proposalJobs: state.jobs.proposalJobs,
    getJobsByZipcodeStatus: state.jobs.getJobsByZipcodeStatus,
    errorMessage: state.jobs.errorMessage
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderHomeScreen);