<template>
    <div>
        <div class="card-header">
            <span>{{title}}</span>
            <i class="el-icon-info"></i>
        </div>
        <div class="card-content">{{count}}</div>
        <div class="card-charts">
            <slot name="charts"></slot>
        </div>
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name:'Detail',
    props:['title','count'],
}
</script>

<style lang="scss" scoped>
    .card-header{
        display:flex;
        justify-content:space-between;
        color:rgba(22,22,22,.5);
        font-size:14px;
    }
    .card-content{
        font-size:30px;
        padding:10px 0;
    }
    .card-charts{
        height:50px;
        font-size:14px;
    }
    .card-footer{
        border-top:1px solid #eee;
        padding-top:10px;
        font-size:14px;
    }
</style>
