<template>
  <div :style="{
    display: 'flex',
    flexWrap: 'wrap',
  }">
    <div v-for="item in listData">
      <SvgaPlayer :svgaUrl="item" />
      <!-- {{ item }} -->
    </div>
  </div>
</template>

<script setup lang="ts">
const listData = [
  '/svga/liliSvga/2022110422344569.svga',
  '/svga/liliSvga/2022110422395120.svga',
  '/svga/liliSvga/2022110422405254.svga',
  '/svga/liliSvga/2022110422420815.svga',
  '/svga/liliSvga/2022110422433573.svga',
  '/svga/liliSvga/2022110422450167.svga',
  '/svga/liliSvga/2022110622314192.svga',
  '/svga/liliSvga/2022110622330817.svga',
  '/svga/liliSvga/2022110622354389.svga',
  '/svga/liliSvga/2022110622365540.svga',
  '/svga/liliSvga/2022110622383932.svga',
  '/svga/liliSvga/2022110622402597.svga',
  '/svga/liliSvga/2022110622414965.svga',
  '/svga/liliSvga/2022110622454731.svga',
  '/svga/liliSvga/2022110622470250.svga',
  '/svga/liliSvga/2022110622480018.svga',
  '/svga/liliSvga/2022110622501824.svga',
  '/svga/liliSvga/2022110622511918.svga',
  '/svga/liliSvga/2022110622521142.svga',
  '/svga/liliSvga/2022110622531448.svga',
  '/svga/liliSvga/2022110622541440.svga',
  '/svga/liliSvga/2022110622580595.svga',
  '/svga/liliSvga/2022110623020080.svga',
  '/svga/liliSvga/2022110623032034.svga',
  '/svga/liliSvga/2022110623041923.svga',
  '/svga/liliSvga/2022110623053168.svga',
  '/svga/liliSvga/2022110623062257.svga',
  '/svga/liliSvga/2022110623073233.svga',
  '/svga/liliSvga/2022110623082817.svga',
  '/svga/liliSvga/2022110623135353.svga',
  '/svga/liliSvga/2022110623145092.svga',
  '/svga/liliSvga/2022110623160156.svga',
  '/svga/liliSvga/2022110623254198.svga',
  '/svga/liliSvga/2022110623275326.svga',
  '/svga/liliSvga/2022110623291327.svga',
  '/svga/liliSvga/2023021413571375.svga',
  '/svga/liliSvga/2023021415055742.svga',
  '/svga/liliSvga/2023021415055742.svga',
  '/svga/liliSvga/2024031318511419.svga',
]

</script>
