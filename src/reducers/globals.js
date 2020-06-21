import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  fee: 0,  
  nearbyRadius: 0,  
	geoData: {},
	uploadedUrl: '',
  uploadedMediaType: '',

  errorMessage: "",
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
  
  [Types.GET_GEODATA_REQUEST]: getGeoDataRequest,
  [Types.GET_GEODATA_SUCCESS]: getGeoDataSuccess,
  [Types.GET_GEODATA_FAILURE]: getGeoDataFailure,

  [Types.UPLOAD_ATTACH_FILE_REQUEST]: uploadFileRequest,
  [Types.UPLOAD_ATTACH_FILE_SUCCESS]: uploadFileSuccess,
  [Types.UPLOAD_ATTACH_FILE_FAILURE]: uploadFileFailure,

  [Types.LOG_OUT]: logout,
};

export default createReducer(initialState, actionHandlers);
