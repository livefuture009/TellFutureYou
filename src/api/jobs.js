import { url } from '../constants';
import { makeRandomText, filterFileUri } from '../functions';

export const getJob = (job_id) => {
  const method = 'POST';
  const request_url = `${url}/job/get_job`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getJobsByZipcode = (user_id, zipcode) => {
  const method = 'POST';
  const request_url = `${url}/job/get_jobs_by_zipcode`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
    zipcode
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getMyJobs = (user_id, user_type) => {
  const method = 'POST';
  const request_url = `${url}/job/get_my_jobs`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
    user_type
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const createNewJob = (job) => {
  const formData = new FormData();
  for (var i = 0; i < job.photos.length; i++) {
      var photo = job.photos[i];
      const type = photo.type;
      const filename = photo.filename ? photo.filename : makeRandomText(20) + ".jpeg";
      const fileUri = filterFileUri(photo.uri, Platform.OS);
  
      formData.append("photo_" + i, {
          name: filename,
          type: type,
          uri: fileUri
      });    
  }
  

  formData.append("title", job.title);
  formData.append("description", job.description);
  formData.append("location", job.location);
  formData.append("zipcode", job.zipcode);
  formData.append("rate", parseFloat(job.rate));
  formData.append("service", job.service.name);
  formData.append("user_id", job.user_id);
  formData.append("duration", parseFloat(job.duration));
  formData.append("lat", job.lat);
  formData.append("lng", job.lng);

  if (job.subCategories && job.subCategories.length > 0) {
      formData.append("sub_categories", job.subCategories.join(','));    
  }
  
  const invites = [];
  if (job.invites && job.invites.length > 0) {
    for (var i = 0; i < job.invites.length; i++) {
      invites.push(job.invites[i]._id);                
    }
  }

  if (invites.length > 0) {
      formData.append("invites", invites.join(','));    
  }

  const request_url = `${url}/job/create`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

export const updateJob = (job) => {
  const method = 'POST';
  const request_url = `${url}/job/update_job`
  const headers = {
    'Content-Type': 'application/json',
  }
  var params = {
      job: job,
  };

  const body = JSON.stringify(params);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const payJob = (job_id, provider_id, customer_id, amount) => {
  const method = 'POST';
  const request_url = `${url}/job/pay_job`
  const headers = {
    'Content-Type': 'application/json',
  }
  var params = {
      job_id: job_id,
      customer_id, customer_id,
      provider_id: provider_id,
      amount: amount,
  };

  const body = JSON.stringify(params);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const writeReview = (user_id, job_id, text, score) => {
  const method = 'POST';
  const request_url = `${url}/job/write_review`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id: job_id,
    text: text,
    score: score,
    creator: user_id
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getProposedJobs = (user_id) => {
  const method = 'POST';
  const request_url = `${url}/job/get_proposal_jobs`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const applyJob = (job_id, user_id) => {
  const method = 'POST';
  const request_url = `${url}/job/apply_job`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id: job_id,
    user_id: user_id
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const withdrawJob = (job_id, user_id) => {
  const method = 'POST';
  const request_url = `${url}/job/withdraw_job`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id: job_id,
    user_id: user_id
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const hire = (job_id, user_id) => {
  const method = 'POST';
  const request_url = `${url}/job/hire`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id: job_id,
    user_id: user_id
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const acceptOffer = (job_id, user_id) => {
  const method = 'POST';
  const request_url = `${url}/job/accept_offer`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id: job_id,
    user_id: user_id
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const cancelOffer = (job_id) => {
  const method = 'POST';
  const request_url = `${url}/job/cancel_offer`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id: job_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const cancelJob = (job_id) => {
  const method = 'POST';
  const request_url = `${url}/job/cancel_job`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    job_id: job_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};