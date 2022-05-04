<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
                <el-card>
                    <Detail title="总销售额" count="￥12650">
                        <template v-slot:charts>
                            <span>周同比 56.67% <i class="el-icon-caret-top" style="color:red"></i></span>
                            <span style="margin-left:10px">日同比 19.16% <i class="el-icon-caret-bottom" style="color:blue"></i></span>
                        </template>
                        <template v-slot:footer>
                            <span>日销售额 ￥12345</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="访问量" count="88460">
                        <template v-slot:charts>
                            <LineChart/>
                        </template>
                        <template v-slot:footer>
                            <span>日访问量 7777</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="支付笔数" count="88460">
                        <template v-slot:charts>
                            <BarChart/>
                        </template>
                        <template v-slot:footer>
                            <span>转化率 66%</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="运营活动效果" count="78%">
                        <template v-slot:charts>
                            <ProgressChart></ProgressChart>
                        </template>
                        <template v-slot:footer>
                            <span>周同比 12% <i class="el-icon-caret-top" style="color:red"></i></span>
                            <span style="margin-left:10px">日同比 11% <i class="el-icon-caret-bottom" style="color:blue"></i></span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Detail from '@/views/dashboard/Card/Detail';
import LineChart from '@/views/dashboard/Card/LineChart';
import BarChart from '@/views/dashboard/Card/BarChart';
import ProgressChart from '@/views/dashboard/Card/ProgressChart';

export default {
    name:'Card',
    components:{Detail,LineChart,BarChart,ProgressChart},
}
</script>

<style lang="scss" scoped>
    
</style>