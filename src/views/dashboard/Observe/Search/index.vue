<template>
    <el-card>
        <div slot="header">
            <div class="search_header">
                <span>线上搜索</span>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>Google</el-dropdown-item>
                        <el-dropdown-item>Baidu</el-dropdown-item>
                        <el-dropdown-item>Sogou</el-dropdown-item>
                        <el-dropdown-item disabled>Bing</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div>
            <el-row :gutter="10">
                <!-- <el-col :span="12"> -->
                    <div>
                        <div class="header">
                            <span style="margin-right:20px;">搜索用户数</span>
                            <i class="el-icon-info"></i>
                        </div>
                        <div class="main">
                            <span>12345</span>
                            <span>17.1</span>
                            <i class="el-icon-caret-top" style="color:red"></i>
                        </div>
                        <div class="footer">
                            <div class="charts" ref="charts"></div>
                        </div>
                    </div>
                <!-- </el-col> -->
                <!-- <el-col :span="12"></el-col> -->
            </el-row>
        </div>
    </el-card>
</template>

<script>
export default {
    name:'Search',
    mounted(){
        const charts=echarts.init(this.$refs.charts);
        let options={
            xAxis:{
                show:false,
                type:'category',
            },
            yAxis:{show:false},
            series:[{
                type:'line',
                data:[20,10,40,30,50,30,70],
                areaStyle:{
                    color:{
                        type:'linear',
                        x:0,
                        y:0,
                        x2:0,
                        y2:1,
                        colorStops:[
                            {offset:0,color:'skyblue'},
                            {offset:1,color:'#ffffff'}
                        ],
                        global:false,
                    }
                },
                smooth:true,
            }],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0,
            }
        };
        charts.setOption(options);
        window.addEventListener('resize',()=>{
            charts.resize();
        });
    }
}
</script>

<style scoped>
    .search_header{
        display:flex;
        justify-content:space-between;
    }
    .header{
        font-size:14px;
        color:gray;
        margin-bottom:10px;
    }
    .main span:first-child{
        font-size:24px;
        margin-right:30px;
    }
    .main span:nth-child(2){
        color:gray;
    }
    .main :last-child{
        font-size:18px;
    }
    .charts{
        width:100%;
        height:100px;
    }
</style>