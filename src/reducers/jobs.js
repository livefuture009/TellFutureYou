import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  searchJobs: [],
  proposalJobs: [],

  myJobs: [],
  selectedJob: {},
  currentBalance: 0,

  getJobStatus: Status.NONE,
  getJobsByZipcodeStatus: Status.NONE,
  getMyJobsStatus: Status.NONE,
  getProposalJobsStatus: Status.NONE,
  createJobStatus: Status.NONE, 
  updateJobStatus: Status.None,
  payJobStatus: Status.NONE,
  writeReviewStatus: Status.NONE,
  applyJobStatus: Status.NONE,
  withdrawJobStatus: Status.NONE,
  hireStatus: Status.NONE,
  acceptOfferStatus: Status.NONE,
  declineOfferStatus: Status.NONE,  
  cancelOfferStatus: Status.NONE,
  cancelJobStatus: Status.NONE,  
};

/*****************************************
**************** Get Job. ****************
******************************************/

const getJobRequest = (state) => ({
  ...state,
  getJobStatus: Status.REQUEST,
});

const getJobSuccess = (state, action) => ({
  ...state,
  selectedJob: action.payload,
  getJobStatus: Status.SUCCESS,
});

const getJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getJobStatus: Status.FAILURE,
});

/*****************************************
**************** Get Job. ****************
******************************************/

const getJobsByZipcodeRequest = (state) => ({
  ...state,
  getJobsByZipcodeStatus: Status.REQUEST,
});

const getJobsByZipcodeSuccess = (state, action) => ({
  ...state,
  searchJobs: action.payload,
  getJobsByZipcodeStatus: Status.SUCCESS,
});

const getJobsByZipcodeFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getJobsByZipcodeStatus: Status.FAILURE,
});

/*****************************************
**************** Get Job. ****************
******************************************/

const getMyJobsRequest = (state) => ({
  ...state,
  getMyJobsStatus: Status.REQUEST,
});

const getMyJobsSuccess = (state, action) => ({
  ...state,
  myJobs: action.payload.jobs,
});

const getMyJobsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  getMyJobsStatus: Status.FAILURE,
});

/*****************************************
************ Create New Job. *************
******************************************/

const createNewJobRequest = (state) => ({
  ...state,
  createJobStatus: Status.REQUEST,
});

const createNewJobSuccess = (state, action) => {
  state.createJobStatus = Status.SUCCESS;
  const job = action.payload;
  var myJobs = [...state.myJobs];
  myJobs.unshift(job);
  state.myJobs = myJobs;
  state.selectedJob = job;
  return {
    ...state,
  };
};

const createNewJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  createJobStatus: Status.FAILURE,
});

/*****************************************
*************** Hire Job. ****************
******************************************/

const hireRequest = (state) => ({
  ...state,
  hireStatus: Status.REQUEST,
});

const hireSuccess = (state, action) => {
  state.hireStatus = Status.SUCCESS;
  const job = action.payload;
  var myJobs = [...state.myJobs];

  // Remove job from proposal list.
  for(var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id === job._id) {
      myJobs[i] = job;
      break;
    }
  }

  state.myJobs = myJobs;
  state.selectedJob = job;

  return {
    ...state,
  };
};

const hireFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  hireStatus: Status.FAILURE,
});

/*****************************************
************* Cancel Offer. **************
******************************************/

const cancelOfferRequest = (state) => ({
  ...state,
  cancelOfferStatus: Status.REQUEST,
});

const cancelOfferSuccess = (state, action) => {
  state.cancelOfferStatus = Status.SUCCESS;
  const job = action.payload;
  var myJobs = [...state.myJobs];

  // Remove job from proposal list.
  for(var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id === job._id) {
      myJobs[i] = job;
      break;
    }
  }

  state.myJobs = myJobs;
  state.selectedJob = job;

  return {
    ...state,
  };
};

const cancelOfferFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  cancelOfferStatus: Status.FAILURE,
});

/*****************************************
************* Cancel Job. **************
******************************************/

const cancelJobRequest = (state) => ({
  ...state,
  cancelJobStatus: Status.REQUEST,
});

const cancelJobSuccess = (state, action) => {
  state.cancelJobStatus = Status.SUCCESS;
  const job = action.payload;
  var myJobs = [...state.myJobs];

  // Remove job from proposal list.
  for(var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id === job._id) {
      myJobs[i] = job;
      break;
    }
  }

  state.myJobs = myJobs;
  state.selectedJob = job;

  return {
    ...state,
  };
};

const cancelJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  cancelJobStatus: Status.FAILURE,
});

/*****************************************
************* Accept Offer Job. **********
******************************************/

const acceptOfferRequest = (state) => ({
  ...state,
  acceptOfferStatus: Status.REQUEST,
});

const acceptOfferSuccess = (state, action) => {
  state.acceptOfferStatus = Status.SUCCESS;
  const job = action.payload;
  var proposalJobs = [...state.proposalJobs];
  var myJobs = [...state.myJobs];

  // Remove job from proposal list.
  for(var i = 0; i < proposalJobs.length; i++) {
    if (proposalJobs[i]._id === job._id) {
      proposalJobs.splice(i, 1);
      break;
    }
  }

  myJobs.unshift(job);

  state.myJobs = myJobs;
  state.proposalJobs = proposalJobs;
  state.selectedJob = job;

  return {
    ...state,
  };
};

const acceptOfferFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  acceptOfferStatus: Status.FAILURE,
});

/*****************************************
********** Decline Offer Job. ************
******************************************/

const declineOfferRequest = (state) => ({
  ...state,
  declineOfferStatus: Status.REQUEST,
});

const declineOfferSuccess = (state, action) => {
  state.declineOfferStatus = Status.SUCCESS;
  const job = action.payload;
  var proposalJobs = [...state.proposalJobs];

  for(var i = 0; i < proposalJobs.length; i++) {
    if (proposalJobs[i]._id === job._id) {
      proposalJobs[i] = job;
      break;
    }
  }

  state.proposalJobs = proposalJobs;
  state.selectedJob = job;

  return {
    ...state,
  };
};

const declineOfferFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  declineOfferStatus: Status.FAILURE,
});

/*
***** Update Job. *****
*/

const updateJobRequest = (state) => ({
  ...state,
  updateJobStatus: Status.REQUEST,
});

const updateJobSuccess = (state, action) => {
  state.updateJobStatus = Status.SUCCESS;
  const job = action.payload.job;
  state.job = job;
  return {
    ...state,
  };
};

const updateJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  updateJobStatus: Status.FAILURE,
});

/*****************************************
*************** Pay Job. *****************
******************************************/

const payJobRequest = (state) => ({
  ...state,
  payJobStatus: Status.REQUEST,
});

const payJobSuccess = (state, action) => {
  state.payJobStatus = Status.SUCCESS;
  const { job } = action.payload;
  var myJobs = [...state.myJobs];

  for(var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id === job._id) {
      myJobs[i] = job;
      break;
    }
  }

  state.myJobs = myJobs;
  state.currentBalance = action.payload.balance;
  state.selectedJob = job;
  return {
    ...state,
  };
};

const payJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  payJobStatus: Status.FAILURE,
});

/* 
***** Write Review. *****
*/

const writeReviewRequest = (state) => ({
  ...state,
  writeReviewStatus: Status.REQUEST,
});

const writeReviewSuccess = (state, action) => ({
  ...state,
  selectedJob: action.payload,
  writeReviewStatus: Status.SUCCESS,
});

const writeReviewFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  writeReviewStatus: Status.FAILURE,
});

/* 
***** Get Proposal Jobs. *****
*/

const getProposalJobsRequest = (state) => ({
  ...state,
  getProposalJobsStatus: Status.REQUEST,
});

const getProposalJobsSuccess = (state, action) => ({
  ...state,
  proposalJobs: action.payload,
  getProposalJobsStatus: Status.SUCCESS,
});

const getProposalJobsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getProposalJobsStatus: Status.FAILURE,
});

/* 
***** Apply Job. *****
*/

const applyJobRequest = (state) => ({
  ...state,
  applyJobStatus: Status.REQUEST,
});

const applyJobSuccess = (state, action) => {
  state.applyJobStatus = Status.SUCCESS;
  const job = action.payload;
  state.selectedJob = job;

  var searchJobs = [...state.searchJobs];
  var proposalJobs = [...state.proposalJobs];

  for (var i = 0; i < searchJobs.length; i++) {
    if (searchJobs[i]._id == job._id) {
      searchJobs.splice(i, 1);
      break;
    }
  }

  state.searchJobs = searchJobs;
  proposalJobs.unshift(job);  
  state.proposalJobs = proposalJobs;
  return {
    ...state,
  };
};

const applyJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  applyJobStatus: Status.FAILURE,
});

/* 
***** Withdraw Job. *****
*/

const withdrawJobRequest = (state) => ({
  ...state,
  withdrawJobStatus: Status.REQUEST,
});

const withdrawJobSuccess = (state, action) => {
  state.withdrawJobStatus = Status.SUCCESS;
  const job = action.payload;
  state.selectedJob = job;

  var searchJobs = [...state.searchJobs];
  var proposalJobs = [...state.proposalJobs];

  for (var i = 0; i < proposalJobs.length; i++) {
    if (proposalJobs[i]._id == job._id) {
      proposalJobs.splice(i, 1);
      break;
    }
  }

  searchJobs.unshift(job);
  state.searchJobs = searchJobs;
  state.proposalJobs = proposalJobs;
    return {
    ...state,
  };
};

const withdrawJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  withdrawJobStatus: Status.FAILURE,
});

/* 
***** Set Selected Job. *****
*/

const setSelectedJob = (state, action) => ({
  ...state,
  selectedJob: action.job,
});

/***************************************
**************** RESET *****************
***************************************/

const resetJob = (state, action) => {
  state.searchJobs = [];
  state.proposalJobs = [];
  state.myJobs = [];
  state.selectedJob = {};
  state.currentBalance = 0;

  return {
    ...state,
  };
};

const actionHandlers = {
  [Types.GET_JOB_REQUEST]: getJobRequest,
  [Types.GET_JOB_SUCCESS]: getJobSuccess,
  [Types.GET_JOB_FAILURE]: getJobFailure,

  [Types.GET_JOBS_BY_ZIPCODE_REQUEST]: getJobsByZipcodeRequest,
  [Types.GET_JOBS_BY_ZIPCODE_SUCCESS]: getJobsByZipcodeSuccess,
  [Types.GET_JOBS_BY_ZIPCODE_FAILURE]: getJobsByZipcodeFailure,

  [Types.GET_MY_JOBS_REQUEST]: getMyJobsRequest,
  [Types.GET_MY_JOBS_SUCCESS]: getMyJobsSuccess,
  [Types.GET_MY_JOBS_FAILURE]: getMyJobsFailure,

  [Types.CREATE_NEW_JOB_REQUEST]: createNewJobRequest,
  [Types.CREATE_NEW_JOB_SUCCESS]: createNewJobSuccess,
  [Types.CREATE_NEW_JOB_FAILURE]: createNewJobFailure,

  [Types.UPDATE_JOB_REQUEST]: updateJobRequest,
  [Types.UPDATE_JOB_SUCCESS]: updateJobSuccess,
  [Types.UPDATE_JOB_FAILURE]: updateJobFailure,

  [Types.PAY_JOB_REQUEST]: payJobRequest,
  [Types.PAY_JOB_SUCCESS]: payJobSuccess,
  [Types.PAY_JOB_FAILURE]: payJobFailure,

  [Types.WRITE_REVIEW_REQUEST]: writeReviewRequest,
  [Types.WRITE_REVIEW_SUCCESS]: writeReviewSuccess,
  [Types.WRITE_REVIEW_FAILURE]: writeReviewFailure,

  [Types.GET_PROPOSED_JOBS_REQUEST]: getProposalJobsRequest,
  [Types.GET_PROPOSED_JOBS_SUCCESS]: getProposalJobsSuccess,
  [Types.GET_PROPOSED_JOBS_FAILURE]: getProposalJobsFailure,

  [Types.APPLY_JOB_REQUEST]: applyJobRequest,
  [Types.APPLY_JOB_SUCCESS]: applyJobSuccess,
  [Types.APPLY_JOB_FAILURE]: applyJobFailure,

  [Types.WITHDRAW_JOB_REQUEST]: withdrawJobRequest,
  [Types.WITHDRAW_JOB_SUCCESS]: withdrawJobSuccess,
  [Types.WITHDRAW_JOB_FAILURE]: withdrawJobFailure,

  [Types.HIRE_REQUEST]: hireRequest,
  [Types.HIRE_SUCCESS]: hireSuccess,
  [Types.HIRE_FAILURE]: hireFailure,

  [Types.CANCEL_OFFER_REQUEST]: cancelOfferRequest,
  [Types.CANCEL_OFFER_SUCCESS]: cancelOfferSuccess,
  [Types.CANCEL_OFFER_FAILURE]: cancelOfferFailure,

  [Types.CANCEL_JOB_REQUEST]: cancelJobRequest,
  [Types.CANCEL_JOB_SUCCESS]: cancelJobSuccess,
  [Types.CANCEL_JOB_FAILURE]: cancelJobFailure,

  [Types.ACCEPT_OFFER_REQUEST]: acceptOfferRequest,
  [Types.ACCEPT_OFFER_SUCCESS]: acceptOfferSuccess,
  [Types.ACCEPT_OFFER_FAILURE]: acceptOfferFailure,

  [Types.DECLINE_OFFER_REQUEST]: declineOfferRequest,
  [Types.DECLINE_OFFER_SUCCESS]: declineOfferSuccess,
  [Types.DECLINE_OFFER_FAILURE]: declineOfferFailure,

  [Types.SET_SELECTED_JOB]: setSelectedJob,
  [Types.RESET_JOB]: resetJob,
};

export default createReducer(initialState, actionHandlers);
