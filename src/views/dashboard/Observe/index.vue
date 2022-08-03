<template>
    <div style="margin-top:10px;">
        <el-row :gutter="30">
            <el-col :span="12">
                <!-- <el-card> -->
                <Search/>
                <!-- </el-card> -->
            </el-col>
            <el-col :span="12">
                <Category/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Search from '@/views/dashboard/Observe/Search';
import Category from '@/views/dashboard/Observe/Category';
export default {
    name:'Observe',
    components:{Search,Category},
}
</script>

<style scoped>

</style>