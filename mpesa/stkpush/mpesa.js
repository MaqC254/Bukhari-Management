const axios = require('axios');
const moment = require('moment');
const base64 = require('base-64');

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const callbackUrl = process.env.MPESA_CALLBACK_URL;

const getAccessToken = async () => {
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth = 'Basic ' + base64.encode(consumerKey + ':' + consumerSecret);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: auth,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
    }
};

const initiateSTKPush = async (phone, amount) => {
    const accessToken = await getAccessToken();
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = base64.encode(shortCode + passkey + timestamp);

    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const auth = 'Bearer ' + accessToken;

    const data = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: 'Bukhari',
        TransactionDesc: 'Payment for order',
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: auth,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error);
    }
};

module.exports = { initiateSTKPush };
