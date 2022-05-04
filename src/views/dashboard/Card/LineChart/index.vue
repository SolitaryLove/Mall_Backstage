<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
export default {
    name:'LineChart',
    mounted(){
        // 初始化echarts实例
        const lineChart=echarts.init(this.$refs.charts);
        // 配置项
        let options={
            xAxis:{show:false,type:'category'},
            yAxis:{show:false},
            series:[
                {
                    type:'line',
                    data:[15,12,9,33,17,44,19,35,46,32],
                    itemStyle:{opacity:0,},
                    lineStyle:{color:"purple"},
                    areaStyle:{
                        color:{
                            type:'linear',
                            x:0,
                            y:0,
                            x2:0,
                            y2:1,
                            colorStops:[
                                {offset:0,color:'#d0c3e8'},
                                {offset:1,color:'#ffffff'}
                            ],
                            global:false,
                        }
                    },
                    smooth:true,
                }
            ],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0,
            }
        }
        lineChart.setOption(options);
        window.addEventListener('resize',()=>{
            lineChart.resize();
        });
    }
}
</script>

<style lang="scss" scoped>
    .charts{
        width:100%;
        height:100%;
    }
</style>