<template>
    <div class="userList">
        <div class="pic flex flex-v flex-align-center">
            <span>{{topMsg}}</span>
        </div>
        <div class="collect flex flex-r">
            <h1>汇总</h1>
            <div class="flex flex-v flex-pack-center">
                <span class="flex flex-r">
                    <span>收入小于8000</span>
                    <i :style="{ width:2*collect01+ 'rem' }">{{collect01*100+"%"}}</i>
                </span>
                <span class="flex flex-r">
                    <span>收入大于等于8000</span>
                    <i :style="{ width:2*collect02+ 'rem' }">{{collect02*100+"%"}}</i>
                </span>
            </div>
        </div>
        <div class="list">
            <pull-to :bottom-load-method="refresh" :is-bottom-bounce="true" :is-top-bounce="false" wrapper-height="500">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column fixed prop="id" label="序号">
                    </el-table-column>
                    <el-table-column prop="username" label="用户名">
                    </el-table-column>
                    <el-table-column prop="imgurl" label="头像">
                    </el-table-column>
                    <el-table-column prop="salary" label="收入">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="currentLogin == scope.row.id" type="text" @click="handleEdit(scope.row)" size="small">修改</el-button>
                            <el-button type="text" @click="handleCheck(scope.row)" size="small">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </pull-to>
        </div>
        <div class="dialog">
            <el-dialog :title="'你点击了第'+selectTable.id+'条数据'" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="用户名" label-width="100px">
                        <el-input placeholder="用户名" v-model="selectTable.username" auto-complete="off"></el-input>
                        <span v-if="usernameWarm" class="warm">{{usernameWarmMsg}}</span>
                    </el-form-item>
                    <el-form-item label="性别" label-width="100px">
                        <!-- <el-input placeholder="性别不能为空" v-model="selectTable.gender"></el-input> -->
                        <el-radio v-model="radio" label="1">男</el-radio>
                        <el-radio v-model="radio" label="2">女</el-radio>
                    </el-form-item>
                    <el-form-item label="手机号" label-width="100px">
                        <el-input placeholder="手机号" v-model="selectTable.phone"></el-input>
                        <span v-if="phoneWarm" class="warm">{{phoneWarmMsg}}</span>
                    </el-form-item>
                    <el-form-item label="收入" label-width="100px">
                        <el-input placeholder="收入" v-model="selectTable.salary"></el-input>
                        <span v-if="salaryWarm" class="warm">{{salaryWarmMsg}}</span>
                    </el-form-item>
                    <el-form-item label="头像Url" label-width="100px">
                        <!-- <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/food'" :show-file-list="false" :on-success="handleServiceAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload> -->
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="primaryFromData">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="'你点击了第'+checkTable.id+'条数据'" v-model="dialogCheckFormVisible">
                <el-form :model="checkTable">
                    <el-form-item label="用户名" label-width="100px">
                        <span class="el-span__inner">{{checkTable.username}}</span>
                    </el-form-item>
                    <el-form-item label="性别" label-width="100px">
                        <span class="el-span__inner">{{checkTable.gender}}</span>
                    </el-form-item>
                    <el-form-item label="手机号" label-width="100px">
                        <span class="el-span__inner">{{checkTable.phone}}</span>
                    </el-form-item>
                    <el-form-item label="收入" label-width="100px">
                        <span class="el-span__inner">￥{{checkTable.salary}}</span>
                    </el-form-item>
                    <el-form-item label="头像Url" label-width="100px">
                        <!-- <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/food'" :show-file-list="false" :on-success="handleServiceAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload> -->
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogCheckFormVisible = false">返回</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Api from '../api/getData';
    import PullTo from 'vue-pull-to';
    export default {
        data() {
            return {
                topMsg: "",
                tableData: [],
                collect01: 0,
                collect02: 0,
                currentLogin: 1,
                dialogFormVisible: false,
                dialogCheckFormVisible: false,
                selectTable: {},
                checkTable:{},
                phoneWarm: false,
                usernameWarm: false,
                salaryWarm: false,
                usernameWarmMsg: "",
                phoneWarmMsg: "",
                salaryWarmMsg: "",
                radio: '1',
                reqTime: 0
            }
        },
        methods: {
            handleEdit(row) {
                // 初始化弹窗
                this.phoneWarm = false;
                this.usernameWarm = false;
                this.salaryWarm = false;
                this.dialogFormVisible = true;
                // 深克隆selectData
                const selectData = Object.assign({}, Object.create(Object.getPrototypeOf(row)), row);
                this.selectTable = selectData;
                this.radio = this.selectTable.gender == "男" ? "1" : "2";
            },
            handleCheck(row) {
                this.dialogCheckFormVisible = true;
                // 深克隆checkTable
                this.checkTable = Object.assign({}, Object.create(Object.getPrototypeOf(row)), row);
                const arr = (this.checkTable.phone + "").split("");
                arr.splice(3,4,"****")
                this.checkTable.phone = arr.join("");
            },
            async primaryFromData() {
                const phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                // 用户名为空
                if (!Boolean(this.selectTable.username)) {
                    this.usernameWarm = true;
                    this.usernameWarmMsg = "用户名不能为空"
                    return
                }
                // 收入为空
                else if (!Boolean(this.selectTable.salary)) {
                    this.salaryWarm = true;
                    this.salaryWarmMsg = "收入不能为空"
                    return
                }
                // 手机号为空
                else if (!Boolean(this.selectTable.phone)) {
                    this.phoneWarm = true;
                    this.phoneWarmMsg = "手机号不能为空"
                }
                // 手机号输入不正确
                else if (!phoneReg.test(this.selectTable.phone)) {
                    this.phoneWarm = true;
                    this.phoneWarmMsg = "请输入有效的手机号"
                    return
                }
                // 表单正确
                else {
                    this.selectTable.gender = this.radio == "1" ? "男" : "女"
                    const res = await Api.updateUserInfo(this.selectTable);
                    if (res.data.code == 1) {
                        (async () => {
                            this.tableData.forEach((val, index) => {
                                if (val.id == this.selectTable.id) {
                                    this.$set(this.tableData, index, this.selectTable)
                                    return;
                                }
                            })
                        })();
                        this.dialogFormVisible = false;
                    }
                }
            },
            refresh(loaded) {
                console.log('下拉刷新');
                (async () => {
                    const res = await Api.getUserList({
                        time: this.reqTime
                    });
                    this.reqTime++;
                    this.tableData = this.tableData.concat(res.data.data);
                    loaded('done')
                })();
            }
        },
        created() {
            (async () => {
                const res = await Api.getUserList({
                    time: this.reqTime
                });
                this.reqTime++;
                this.tableData = res.data.data;
            })();
        },
        computed: {　　
            phone() {　　　　
                return this.selectTable.phone
            },
            username() {
                return this.selectTable.username
            },
            salary() {
                return this.selectTable.salary
            }

        },
        watch: {
            phone(newValue, oldValue) {
                this.phoneWarm = false
            },
            username() {
                this.usernameWarm = false;
            },
            salary() {
                this.salaryWarm = false;
            },
            tableData() {
                var time = 0;
                this.tableData.forEach(element => {
                    if (element.salary > 8000) {
                        time++;
                    }
                });
                if (this.tableData[0].salary >= 8000) {
                    this.topMsg = "你已中奖苹果6！"
                } else {
                    this.topMsg = "赶紧参加活动，您有机会赢取苹果6"
                }
                this.collect01 = (time / this.tableData.length).toFixed(2);
                this.collect02 = (1 - this.collect01).toFixed(2);
            }
        },
        components: {
            PullTo
        }
    }

</script>

<style lang="less">
    .userList {
        padding: 0.20rem;
        .pic {
            width: 100%;
            height: 1rem;
            background-color: aquamarine;
            span {
                font-size: 0.4rem;
                text-align: center;
                line-height: 1rem;
            }
        }
        .collect {
            width: 100%;
            height: 1rem;
            margin-top: 0.2rem;
            h1 {
                margin: 0;
                height: 100%;
                font-size: 0.5rem;
                line-height: 1rem;
                margin-right: 0.20rem;
            }
            div {
                >span {
                    font-size: 0.30rem;
                    position: relative;
                    >span {
                        margin-right: 0.2rem;
                    }
                    i {
                        display: block;
                        margin: 0.1rem 0;
                        font-size: 0.2rem;
                        background-color: aquamarine;
                    }
                }
            }
        }
        .list {
            height: 10rem;
            overflow: hidden;
            div {
                font-size: 0.3rem;
            }
            .el-table td,
            .el-table th {
                height: 1rem;
                text-align: center;
            }
            .el-table .cell {
                line-height: 0.5rem;
            }
            .el-table th>.cell {
                line-height: 1rem;
            }
            .el-table__header,
            .el-table__body {
                // width: 10.30rem !important;
            }
            .el-button--small {
                font-size: 0.25rem;
            }
            .el-button+.el-button {
                margin-left: 0;
            }
        }
    }

    .warm {
        font-size: 0.15rem;
        color: red;
    }

</style>
