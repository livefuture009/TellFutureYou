import { url } from '../constants';
import { makeRandomText } from '../functions';
import { Platform } from 'react-native';
import { filterFileUri, filterFileName } from '../functions';

////////////////////////////////////////////////////////////////////////////
//////////////////////////// Login User ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const loginUser = (email, password, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email, 
    password, 
    device_token: player_id, 
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const loginWithSocial = (user, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login_with_social`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user: user,
    device_token: player_id,
    os: Platform.OS,
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then(res => res.json())
    .then(res => {
        if (res.needToSignUp) {
          res.result = true;
          res.user = user;
        }
        return res;
      }
    );
};

export const registerCustomer = (user, player_id) => {
  const method = 'POST';
  const request_url = `${url}/user/register_customer`
  const headers = {
    'Content-Type': 'application/json',
  }

  var socialId = '';
  var socialType = '';
  var avatar = '';

  if (user.socialId) {
      socialId = user.socialId; 
  }

  if (user.socialType) {
      socialType = user.socialType; 
  }

  if (user.avatar) {
      avatar = user.avatar; 
  }

  const body = JSON.stringify({ 
    firstName: user.firstName,
    lastName: user.lastName,                
    email: user.email,
    password: user.password,
    phone: user.phone,
    location: user.location,
    socialId: socialId,
    socialType: socialType,
    avatar: avatar,
    device_token: player_id,
    lat: user.currentLat,
    lng: user.currentLng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const registerProvider = (user, player_id) => {
  const formData = new FormData();
  // ID Card Images.
  for (var i = 0; i < user.idCards.length; i++) {
    var card = user.idCards[i];

    var filename = filterFileName(card, Platform.OS);
    var filetype = card.type ? card.type : 'image/jpeg';
    const fileUri = filterFileUri(card.uri, Platform.OS);
    
    formData.append("id_card_" + i, {
        name: filename,
        type: filetype,
        uri: fileUri
    });    
  }

  var socialId = '';
  var socialType = '';
  var avatar = '';

  if (user.socialId) {
      socialId = user.socialId; 
  }

  if (user.socialType) {
      socialType = user.socialType; 
  }

  if (user.avatar) {
      avatar = user.avatar; 
  }

  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);
  formData.append("socialId", socialId);
  formData.append("socialType", socialType);
  formData.append("avatar", avatar);
  formData.append("password", user.password);
  formData.append("availabilityFrom", user.availabilityFrom);
  formData.append("availabilityTo", user.availabilityTo);
  formData.append("rate", user.rate);
  formData.append("services", user.services.join());  
  formData.append("idType", user.idType);
  formData.append("idNumber", user.idNumber);
  formData.append("idOtherInformation", user.idOtherInformation);
  formData.append("device_token", player_id);
  formData.append("os", Platform.OS);
  formData.append("lat", user.currentLat);
  formData.append("lng", user.currentLng);

  const request_url = `${url}/user/register_provider`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

export const createUser = (user, player_id) => {
  const method = 'POST';
  const request_url = `${url}/user/create_account`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    accessCode: user.accessCode,
    email: user.email,
    password: user.password,
    player_id: player_id,
    os: Platform.OS,
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const forgotPassword = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/forgot_password`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const verifyCodePassword = (email, code) => {
  const method = 'POST';
  const request_url = `${url}/user/verify_resetcode`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    code: code,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const resetPassword = (email, password) => {
  const method = 'POST';
  const request_url = `${url}/user/reset_newpassword`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    password: password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const changePassword = (user_id, old_password, new_password) => {
  const method = 'POST';
  const request_url = `${url}/user/change_password`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    id: user_id,
    old_password: old_password,
    new_password: new_password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getUser = (user_id, is_update) => {
  const method = 'POST';
  const request_url = `${url}/user/get_user`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,                
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getTransactions = (user_id) => {
  const method = 'POST';
  const request_url = `${url}/payment/get_transactions`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const withdrawWithPaypal = (user_id, paypal, amount) => {
  const method = 'POST';
  const request_url = `${url}/withdraw/request_withdraw`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,
    amount: amount,
    payment_type: 'paypal',
    paypal: paypal
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const withdrawWithBank = (user_id, routing_number, account_number, card_number, expire_date, cvc, amount) => {
  const method = 'POST';
  const request_url = `${url}/withdraw/request_withdraw`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id: user_id,
    amount: amount,
    payment_type: 'bank',
    routing_number: routing_number,
    account_number: account_number,
    card_number: card_number,
    expire_date: expire_date,
    cvc: cvc,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getNearbyProviders = (lat, lng, service_id) => {
  const method = 'POST';
  const request_url = `${url}/user/get_nearby_providers`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    lat: lat,
    lng: lng,
    service_id: service_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const deposit = (data) => {
  const method = 'POST';
  const request_url = `${url}/deposit/create_deposit`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const getPaypalClientToken = (data) => {
  const method = 'POST';
  const request_url = `${url}/deposit/get_paypal_client_token`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.text());
};

export const processPaypalDeposit = (data) => {
  const method = 'POST';
  const request_url = `${url}/deposit/paypal_deposit`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

export const updateCustomer = (user) => {
  const formData = new FormData();
  if (user.avatarFile) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.typeㅁ ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  formData.append("id", user.id);
  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);
  formData.append("lat", user.currentLat);
  formData.append("lng", user.currentLng);

  const request_url = `${url}/user/update_customer`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

export const updateProvider = (user) => {
  const formData = new FormData();
  if (user.avatarFile && user.avatarFile.uri) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.type ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    formData.append("avatar", {
        name: filename,
        type: filetype,
        uri: fileUri
    });        
  }

  formData.append("id", user.id);
  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);
  formData.append("zipcode", user.zipcode);
  formData.append("availabilityFrom", user.availabilityFrom);
  formData.append("availabilityTo", user.availabilityTo);
  formData.append("rate", user.rate);
  formData.append("services", user.services.join());
  formData.append("aboutService", user.aboutService ? user.aboutService : '');
  formData.append("lat", user.currentLat);
  formData.append("lng", user.currentLng);

  const request_url = `${url}/user/update_provider`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

export const checkEmail = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/check_email`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
  });

  return fetch(request_url, { method, body, headers})
    .then(res => res.json())
    .then(res => {
        return res;
      }
    );
};