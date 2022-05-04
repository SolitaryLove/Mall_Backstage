<template>
  <div>
    <div class="wrapper">
      <Card/>
      <Sale/>
      <Observe/>
    </div>
  </div>
</template>

<script>
import Card from '@/views/dashboard/Card';
import Sale from '@/views/dashboard/Sale';
import Observe from '@/views/dashboard/Observe';

export default {
  name: 'Dashboard',
  components:{Card,Sale,Observe},
}
</script>

<style scoped>
  .wrapper{
    display:flex;
    flex-direction:column;
    justify-content:space-between;
  }
</style>
