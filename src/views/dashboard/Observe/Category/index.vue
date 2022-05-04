<template>
    <el-card>
        <div slot="header" class="header">
            <div class="category_header">
                <span>销售额类别占比</span>
                <el-radio-group v-model="choiceValue">
                    <el-radio-button label="全部渠道"></el-radio-button>
                    <el-radio-button label="线下"></el-radio-button>
                    <el-radio-button label="门店"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="chart" ref="chart"></div>
    </el-card>
</template>

<script>
export default {
    name:'Category',
    data(){
        return{
            choiceValue:'全部渠道',
        }
    },
    mounted(){
        const chart=echarts.init(this.$refs.chart);
        let options = {
            title:{
                text:'Video Ads',
                subtext:300,
                left:'center',
                top:'center',
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        };
        chart.setOption(options);
        window.addEventListener('resize',()=>{
           chart.resize(); 
        });
        chart.on('mouseover',params=>{
            const {name,value}=params.data;
            chart.setOption({
                title:{text:name,subtext:value},
            });
        });
    }
}
</script>

<style scoped>
     div >>> .el-card__header{
        padding:6px 16px;
    }
    .category_header{
        display:flex;
        justify-content:space-between;
        align-items:center;
    }
    .chart{
        height:155px;
    }
</style>
