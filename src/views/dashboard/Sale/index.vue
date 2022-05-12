<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
                    <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                    <el-tab-pane label="访问量" name="visit"></el-tab-pane>
                </el-tabs>
                <div class="date">
                    <span @click="setDay">今日</span>
                    <span @click="setWeek">本周</span>
                    <span @click="setMonth">本月</span>
                    <span @click="setYear">本年</span>
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        class="datepinker">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <el-row :gutter="10">
                    <el-col :span="18">
                        <div class="charts" ref="charts"></div>
                    </el-col>
                    <el-col :span="6">
                        <div class="rank">
                            <span style="display:inline-block;font-size:18px;font-weight:bold">门店{{title}}排行榜</span>
                            <ul>
                                <li>
                                    <span class="rindex">0</span>
                                    <span>肯德基</span>
                                    <span>7777</span>
                                </li>
                                <li>
                                    <span class="rindex">1</span>
                                    <span>麦当劳</span>
                                    <span>7777</span>
                                </li>
                                <li>
                                    <span class="rindex">2</span>
                                    <span>汉堡王</span>
                                    <span>7777</span>
                                </li>
                                <li>
                                    <span>3</span>
                                    <span>华莱士</span>
                                    <span>7777</span>
                                </li>
                                <li>
                                    <span>4</span>
                                    <span>德克士</span>
                                    <span>7777</span>
                                </li>
                                <li>
                                    <span>5</span>
                                    <span>瑞幸</span>
                                    <span>7777</span>
                                </li>
                                <li>
                                    <span>6</span>
                                    <span>星巴克</span>
                                    <span>7777</span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'Sale',
    data(){
        return{
            activeName:'sale',
            //收集日历数据
            date:[],
            charts:null,
        }
    },
    computed:{
        // 图表标题
        title(){
            return this.activeName=='sale'?'销售额':'访问量';
        },
    },
    watch:{
        title(){
            this.charts.setOption({
                title:{text:this.title+"趋势"},
            });
        },
    },
    mounted(){
        this.charts=echarts.init(this.$refs.charts);
        this.charts.setOption({
            title:{
                text:this.title+"趋势",
            },
            tooltip:{
                trigger:"axis",
                axisPointer:{
                    type:"shadow",
                }
            },
            grid:{
                left:'3%',
                right:'4%',
                bottom:'3%',
                containLabel:true,
            },
            xAxis:[{
                type:"category",
                axisLabel:{interval:0},
                data:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
            }],
            yAxis:[
                {type:"value"},
            ],
            series:[{name:"Direct",type:"bar",barWidth:"60%",data:[10,20,30,40,30,20,60,90,20,10,40,80]}]
        });
        window.addEventListener('resize',()=>{
            this.charts.resize();
        });
    },
    methods:{
        handleClick(tab, event) {

        },
        // 今日回调
        setDay(){
            const day=dayjs().format('YYYY-MM-DD');
            this.date=[day,day];
        },
        // 本周回调
        setWeek(){
            const start=dayjs().day(1).format('YYYY-MM-DD');
            const end=dayjs().day(7).format('YYYY-MM-DD');
            this.date=[start,end];
        },
        // 本月回调
        setMonth(){
            const start=dayjs().startOf('month').format('YYYY-MM-DD');
            const end=dayjs().endOf('month').format('YYYY-MM-DD');
            this.date=[start,end];
        },
        setYear(){
            const start=dayjs().startOf('year').format('YYYY-MM-DD');
            const end=dayjs().endOf('year').format('YYYY-MM-DD');
            this.date=[start,end];
        }
    },
}
</script>

<style scoped>
    .box-card{
        margin-top:10px;
    }
    .box-card >>> .el-card__header{
        border-bottom:none;
    }
    .clearfix{
        display:flex;
        justify-content:space-between;
        position:relative;
    }
    .tab{
        width:100%;
    }
    .date{
        position:absolute;
        right:0px;
    }
    .date>span{
        margin:0px 10px;
    }
    .datepinker{
        width:220px;
        margin:0 10px;
    }
    .charts{
        width:92%;
        height:300px;
    }
    .rank ul{
        list-style:none;
        width:100%;
        height:250px;
        padding-left:10px;
        display:flex;
        flex-direction:column;
        justify-content:space-around;
    }
    .rank ul li{
        height:8%;
        margin-right:10px;
    }
    .rank ul li>span:nth-child(1){
        float:left;
        width:20px;
        height:20px;
        border-radius:50%;
        color:black;
        text-align:center;
        line-height:20px;
        margin-right:10px;
    }
    .rank ul li span.rindex{
        background:sienna;
        color:white;
    }
    .rank ul li>span:nth-last-child(1){
        float:right;
    }
</style>