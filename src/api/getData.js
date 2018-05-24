import request from '../common/request';
const onlineApi = "http://182.61.23.35:8001";
const testApi = "http://192.168.43.158";
// 获取用户信息列表
const getUserList = async (data) => {
    const res = await request("GET", testApi + "/user/list", data);
    return res;
}
// 修改用户信息
const updateUserInfo = async (data) => {
    const res = await request("POST", testApi + "/user/update", data);
    return res;
}
export default {
    getUserList,
    updateUserInfo
}
