import axios from 'axios';
const qs = require('qs');
const request = async (mothed, url, data) => {
    if (mothed == 'GET') {
        const res = await axios.get(url, {
                params: data,
            })
            .then((res) => {
                return res;
            })
            .catch((error) => {
                return error;
            });
        return res;
    } else if (mothed == 'POST') {
        const res = await axios.post(url, qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                return res;
            })
            .then((error) => {
                return error;
            });
        return res;
    }
};
export default request;
