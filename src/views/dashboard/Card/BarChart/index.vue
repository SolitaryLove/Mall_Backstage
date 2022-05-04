<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
export default {
  name: "BarChart",
  mounted() {
    //初始化echarts实例
    const barChart=echarts.init(this.$refs.charts);
    //配置数据
    barChart.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //均分
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          //图标形式-柱状图
          type: "bar",
          data: [10, 7, 33, 12, 48, 9,29,10,44,33,22,8],
          color:'#2376b7'
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip:{}
    });
    window.addEventListener('resize',()=>{
      barChart.resize();
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>