<template>
   <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡试图 -->
  <el-card>
    <div id="main" style="width: 100%; height:400px;"></div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'

export default {

  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.getElementById('main'));
    const { data: res } = await this.$axios.get('reports/type/1');
    if(res.meta.status !== 200) this.$message.error('获取报表数据失败！');
    const result =  _.merge(res.data, this.options);
  // 使用刚指定的配置项和数据显示图表。
  myChart1.setOption(result);

   var myChart2 = echarts.init(document.getElementById('main'));
   var option2 = {
      title: {
          text: '2021年08月'
      },
      tooltip: {},
      legend: {
          data:['销量']
      },
      xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
      }]
    };

  // 使用刚指定的配置项和数据显示图表。
  myChart2.setOption(option2);

  },
}
</script>


<style lang="less" scoped>

</style>

