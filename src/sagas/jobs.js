import {
  put, call, takeLatest, select, all, delay,
} from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages';

const {
  getJob,
  getJobsByZipcode,
  getMyJobs,
  createNewJob,
  updateJob,
  cancelJob,
  writeReview,
  getProposedJobs,
  applyJob,
  withdrawJob,
  payJob,
  hire,
  acceptOffer,
  cancelOffer,
} = api;

function* GetJob(action) {
  yield put({ type: Types.GET_JOB_REQUEST });
  try {
    const res = yield call(getJob, action.job_id);
    if (res.result) {
      yield put({ type: Types.GET_JOB_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.GET_JOB_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetJobsByZipcode(action) {
  yield put({ type: Types.GET_JOBS_BY_ZIPCODE_REQUEST });
  try {
    const res = yield call(getJobsByZipcode, action.user_id, action.zipcode);
    if (res.result) {
      yield put({ type: Types.GET_JOBS_BY_ZIPCODE_SUCCESS, payload: res.jobs });
    } else {
      yield put({ type: Types.GET_JOBS_BY_ZIPCODE_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_JOBS_BY_ZIPCODE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetMyJobs(action) {
  yield put({ type: Types.GET_MY_JOBS_REQUEST });
  try {
    const res = yield call(getMyJobs, action.user_id, action.user_type);
    if (res.result) {
      yield put({ type: Types.GET_MY_JOBS_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.GET_MY_JOBS_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_MY_JOBS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* CreateNewJob(action) {
  yield put({ type: Types.CREATE_NEW_JOB_REQUEST });
  try {
    const res = yield call(createNewJob, action.job);
    if (res.result) {
      yield put({ type: Types.CREATE_NEW_JOB_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.CREATE_NEW_JOB_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.CREATE_NEW_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* UpdateJob(action) {
  yield put({ type: Types.UPDATE_JOB_REQUEST });
  try {
    const res = yield call(updateJob, action.job);
    if (res.result) {
      yield put({ type: Types.UPDATE_JOB_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.UPDATE_JOB_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.UPDATE_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetProposedJobs(action) {
  yield put({ type: Types.GET_PROPOSED_JOBS_REQUEST });
  try {
    const res = yield call(getProposedJobs, action.user_id);
    if (res.result) {
      yield put({ type: Types.GET_PROPOSED_JOBS_SUCCESS, payload: res.jobs });
    } else {
      yield put({ type: Types.GET_PROPOSED_JOBS_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_PROPOSED_JOBS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ApplyJob(action) {
  yield put({ type: Types.APPLY_JOB_REQUEST });
  try {
    const res = yield call(applyJob, action.job_id, action.user_id);
    if (res.result) {
      yield put({ type: Types.APPLY_JOB_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.APPLY_JOB_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.APPLY_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* WithdrawJob(action) {
  yield put({ type: Types.WITHDRAW_JOB_REQUEST });
  try {
    const res = yield call(withdrawJob, action.job_id, action.user_id);
    if (res.result) {
      yield put({ type: Types.WITHDRAW_JOB_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.WITHDRAW_JOB_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.WITHDRAW_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* Hire(action) {
  yield put({ type: Types.HIRE_REQUEST });
  try {
    const res = yield call(hire, action.job_id, action.user_id);
    if (res.result) {
      yield put({ type: Types.HIRE_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.HIRE_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.HIRE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* CancelOffer(action) {
  yield put({ type: Types.CANCEL_OFFER_REQUEST });
  try {
    const res = yield call(cancelOffer, action.job_id);
    if (res.result) {
      yield put({ type: Types.CANCEL_OFFER_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.CANCEL_OFFER_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.CANCEL_OFFER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* CancelJob(action) {
  yield put({ type: Types.CANCEL_JOB_REQUEST });
  try {
    const res = yield call(cancelJob, action.job_id);
    if (res.result) {
      yield put({ type: Types.CANCEL_JOB_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.CANCEL_JOB_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.CANCEL_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* AcceptOffer(action) {
  yield put({ type: Types.ACCEPT_OFFER_REQUEST });
  try {
    const res = yield call(acceptOffer, action.job_id, action.user_id);
    if (res.result) {
      yield put({ type: Types.ACCEPT_OFFER_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.ACCEPT_OFFER_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.ACCEPT_OFFER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* DeclineOffer(action) {
  yield put({ type: Types.DECLINE_OFFER_REQUEST });
  try {
    const res = yield call(cancelOffer, action.job_id);
    if (res.result) {
      yield put({ type: Types.DECLINE_OFFER_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.DECLINE_OFFER_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.DECLINE_OFFER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* PayJob(action) {
  yield put({ type: Types.PAY_JOB_REQUEST });
  try {
    const res = yield call(
      payJob, 
      action.job_id, 
      action.provider_id, 
      action.customer_id,
      action.amount,
    );
    if (res.result) {
      yield put({ type: Types.PAY_JOB_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.PAY_JOB_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.PAY_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* WriteReview(action) {
  yield put({ type: Types.WRITE_REVIEW_REQUEST });
  try {
    const res = yield call(
      writeReview, 
      action.user_id,
      action.job_id,
      action.text,
      action.score,
    );
    if (res.result) {
      yield put({ type: Types.WRITE_REVIEW_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.WRITE_REVIEW_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.WRITE_REVIEW_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

export default [
  takeLatest(Types.GET_JOB, GetJob),
  takeLatest(Types.GET_JOBS_BY_ZIPCODE, GetJobsByZipcode),
  takeLatest(Types.GET_MY_JOBS, GetMyJobs),
  takeLatest(Types.CREATE_NEW_JOB, CreateNewJob),
  takeLatest(Types.UPDATE_JOB, UpdateJob),  
  takeLatest(Types.PAY_JOB, PayJob),
  takeLatest(Types.WRITE_REVIEW, WriteReview),
  takeLatest(Types.GET_PROPOSED_JOBS, GetProposedJobs),  
  takeLatest(Types.APPLY_JOB, ApplyJob),
  takeLatest(Types.WITHDRAW_JOB, WithdrawJob),
  takeLatest(Types.HIRE, Hire),
  takeLatest(Types.ACCEPT_OFFER, AcceptOffer),
  takeLatest(Types.DECLINE_OFFER, DeclineOffer),
  takeLatest(Types.CANCEL_OFFER, CancelOffer),
  takeLatest(Types.CANCEL_JOB, CancelJob),
];
