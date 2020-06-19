import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
	availabilities: [],
	rates: [],
  services: [],
  fee: 0,  
  nearbyRadius: 0,  
	geoData: {},
	uploadedUrl: '',
  uploadedMediaType: '',

  errorMessage: "",
  getGlobalInfo: Status.NONE,
	getAvailabilitiesStatus: Status.NONE,
  getRatesStatus: Status.NONE,
  getServicesStatus: Status.NONE,
  getGeoDataStatus: Status.NONE,
  uploadFileStatus: Status.NONE,
};

/*****************************************
********** Get Global Info. ***********
******************************************/

const getGlobalInfoRequest = (state) => ({
  ...state,
  getGlobalInfo: Status.REQUEST,
});

const getGlobalInfoSuccess = (state, action) => ({
  ...state,
  fee: action.payload.fee,
  nearbyRadius: action.payload.nearbyRadius,
  getGlobalInfo: Status.SUCCESS,
});

const getGlobalInfoFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getGlobalInfo: Status.FAILURE,
});

/* 
***** Get Availability *****
*/
const getAvailabilitiesRequest = (state) => ({
  ...state,
  getAvailabilitiesStatus: Status.REQUEST,
});

const getAvailabilitySuccess = (state, action) => ({
  ...state,
  availabilities: action.payload,
  getAvailabilitiesStatus: Status.SUCCESS,
});

const getAvailabilityFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 getAvailabilitiesStatus: Status.FAILURE,
});


/* 
***** Get Rate *****
*/
const getRatesRequest = (state) => ({
  ...state,
  getRatesStatus: Status.REQUEST,
});

const getRatesSuccess = (state, action) => ({
  ...state,
  rates: action.payload,
  getRatesStatus: Status.SUCCESS,
});

const getRatesFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getRatesStatus: Status.FAILURE,
});

/* 
***** Get Service *****
*/
const getServicesRequest = (state) => ({
  ...state,
  getServicesStatus: Status.REQUEST,
});

const getServicesSuccess = (state, action) => ({
  ...state,
  services: action.payload,
  getServicesStatus: Status.SUCCESS,
});

const getServicesFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 getServicesStatus: Status.FAILURE,
});

/* 
***** Get GeoData *****
*/
const getGeoDataRequest = (state) => ({
  ...state,
  getGeoDataStatus: Status.REQUEST,
});

const getGeoDataSuccess = (state, action) => ({
  ...state,
  geoData: action.payload,
  getGeoDataStatus: Status.SUCCESS,
});

const getGeoDataFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getGeoDataStatus: Status.FAILURE,
});

/*****************************************
************ Upload File. ****************
******************************************/

const uploadFileRequest = (state) => ({
  ...state,
  uploadFileStatus: Status.REQUEST,
});

const uploadFileSuccess = (state, action) => ({
  ...state,
  uploadedUrl: action.payload.url,
  uploadedMediaType: action.payload.type,
  uploadFileStatus: Status.SUCCESS,
});

const uploadFileFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  uploadFileStatus: Status.FAILURE,
});

const logout = (state) => state;

const actionHandlers = {
  [Types.GET_GLOBAL_INFO_REQUEST]: getGlobalInfoRequest,
  [Types.GET_GLOBAL_INFO_SUCCESS]: getGlobalInfoSuccess,
  [Types.GET_GLOBAL_INFO_FAILURE]: getGlobalInfoFailure,
  
  [Types.GET_AVAILABILITIES_REQUEST]: getAvailabilitiesRequest,
  [Types.GET_AVAILABILITIES_SUCCESS]: getAvailabilitySuccess,
  [Types.GET_AVAILABILITIES_FAILURE]: getAvailabilityFailure,

  [Types.GET_RATES_REQUEST]: getRatesRequest,
  [Types.GET_RATES_SUCCESS]: getRatesSuccess,
  [Types.GET_RATES_FAILURE]: getRatesFailure,

  [Types.GET_SERVICES_REQUEST]: getServicesRequest,
  [Types.GET_SERVICES_SUCCESS]: getServicesSuccess,
  [Types.GET_SERVICES_FAILURE]: getServicesFailure,

  [Types.GET_GEODATA_REQUEST]: getGeoDataRequest,
  [Types.GET_GEODATA_SUCCESS]: getGeoDataSuccess,
  [Types.GET_GEODATA_FAILURE]: getGeoDataFailure,

  [Types.UPLOAD_ATTACH_FILE_REQUEST]: uploadFileRequest,
  [Types.UPLOAD_ATTACH_FILE_SUCCESS]: uploadFileSuccess,
  [Types.UPLOAD_ATTACH_FILE_FAILURE]: uploadFileFailure,

  [Types.LOG_OUT]: logout,
};

export default createReducer(initialState, actionHandlers);
