# 基础算法


### 首先来了解下时空间复杂度
![img](/sortPerformance.png)


## 插入排序
```
function insertSort(array){
for(let i = 0; i < array.length; i++){
 let preIndex = i - 1, cur = array[i];
 while(preIndex >= 0 && array[preIndex] > cur){
   array[preIndex + 1] = array[preIndex];
   preIndex--;
 }
 array[preIndex + 1] = cur;
}
return array;
}

```



## 希尔排序
```
function shellSort(arr){
let len = arr.length, gap, temp;
// 缩小增量gap
for(gap = len >> 1; gap >= 1; gap>>=1){
 for(let i = gap; i < len; i++){
   let preIndex = i - gap;// 插入排序是从后往前的，preIndex代表当前元素的上一个元素
   if(arr[i] < arr[preIndex]){
     temp = arr[i];
     while(preIndex >= 0 && arr[preIndex] > temp){
       arr[preIndex + gap] = arr[preIndex];
       preIndex -= gap;
     }
     arr[preIndex + gap] = temp;
   }
 }
}
return arr;
}
// shellSort([8, 9, 1, 7, 2, 3, 5, 4, 6, 0]);
```


## 选择排序

```function selectionSort(array, flag = false) { // flag用于选择顺序 
for(let i = 0; i < array.length - 1; i++){
 let minIndex = i;
 for(let j = i + 1; j < array.length; j++){
     if(array[j] < array[minIndex]){
       minIndex = j;
     }
 }
 [array[minIndex], array[i]] = [array[i], array[minIndex]];
}
return flag ? arr.reverse() : arr;
}
```


## 堆排序

```
/*
* 维护堆的性质
* @param arr 存储堆的数组
* @param n 数组长度
* @param i 待维护节点的下标
*/
function heapify(arr,n,i){
let largest = i;
let lson = i * 2 + 1;
let rson = i * 2 + 2;
// 找出父结点、左孩子、右孩子中最大的下标
if(lson < n && arr[largest] < arr[lson]){
 largest = lson;
}
if(rson < n && arr[largest] < arr[rson]){
 largest = rson;
}
if(largest !== i){ 
 // 将最大的值赋值给父节点
 [arr[largest],arr[i]] = [arr[i],arr[largest]];
 // 因为一个堆被改变了，会影响到子孩子的堆，所以需要进行递归
 heapify(arr, n, largest);
}
}
​
// 堆排序入口
function heap_sort(arr, n){
let i;
// 建堆 [(n/2)-1] ---> [((n-1)-1)/2]，从后往前建堆
for(i = (n / 2) - 1; i >= 0; i--){
 heapify(arr, n, i);
}

// 排序 大顶堆堆顶元素与最后一个元素交换
for(i = n - 1; i >= 0; i--){
 [arr[i], arr[0]] = [arr[0], arr[i]];
 heapify(arr, i, 0);// 维护堆顶的元素
}
return arr;
}
// let arr = [2,3,8,1,4,9,10,7,16,14];
// let n = 10;
// heap_sort(arr, n);

```



## 归并排序
```
// 分割数组时直接将数组分割为两个数组，合并时直接合并数组
function mergeSort(array){
if(array.length < 2){
 return array;
}
const mid = Math.floor(array.length / 2);
const left = array.slice(0, mid);
const right = array.slice(mid);
return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
const result = [];
while(left.length && right.length){
 if(left[0] < right[0]){
   result.push(left.shift());
 } else {
   result.push(right.shift());
 }
}

while(left.length){
 result.push(left.shift());
}
while(right.length){
 result.push(right.shift());
}
return result;
}

```



## 基数排序
```
function radixSort(arr) {
let maxLen = 0;
// 算出最大值的位数
for(let val of arr){
 let len = String(val).length;
 if(len > maxLen){
   maxLen = len;
 }
}
// 遍历各个位数并进行排序
for(let i = 1; i <= maxLen; i++){
 arr = sort(arr, i, maxLen);
}
return arr;
}
// 对位数的排序
function sort(arr, index, maxLen){
let buckets = [];
for(let i = 0; i < 10; i++){
// 创建十个桶
 buckets.push([]);
}
for(let val of arr){
 // str.padStart(targetLength,string)：
 // 使用指定字符串填充到目标字符串前面，使其达到目标长度；
 // 位数不够则进行补0
 let str = String(val).padStart(maxLen, '0');
 // 将对应数值的存入对应的桶
 let num = str[maxLen - index];
 buckets[num].push(val);
}
let result = [];
for(let bucket of buckets){
 result.push(...bucket);
}
return result;
}

```



## 计数排序
```
function countingSort(arr, flag = 0){
let min = arr[0], max = arr[0], len = arr.length;
// 求最大最小值
for(let i = 0; i < len; i++){
max = Math.max(arr[i], max);
min = Math.min(arr[i], min);
}
// 计算差值
let s = max - min;
console.log(s)
// 创建数组用于统计元素个数
let count = new Array(s).fill(0);
for(let i = 0; i < len; i++){
let index = arr[i] - min;// 创建下标
count[index] += 1;
}
console.log(count)
// 遍历统计数组，按照统计数组中每个元素的个数和顺序将原数组元素加入结果数组
let res = [];
for(let i = 0; i < s + 1; i++){
if(count[i] === 0) continue;
res.push(arr[arr.indexOf(i + min)]);
--count[i];
}
return flag ? res.reverse() : res;
}
​
// let arr = [2, 9, 6, 7, 4, 3, 1, 7, 0, -1, -2]
// console.log(countingSort(arr))

```



## 快速排序
```
/*
* 法一：开辟left和right两个空间来存储
* 每次递归返回left、target、right拼接后的数组
*/
function quickSort(array){
if(array.length < 2) return array;
const target = array[0];
const left = [], right = [];
for(let i = 1; i < array.length; i++){
 if(array[i] < target) {
   left.push(array[i]);
 }else{
   right.push(array[i]);
 }
}
return quickSort(left).concat([target],quickSort(right));
}
​
/*
* 法二：双下标法
* 声明l和r分别为首尾两个下标
* 在 l < r 条件下，找到 array[r] < target的值赋给array[l]
* 在 l < r 条件下，找到 array[r] >= target的值赋给array[r]
* 当 l = r 时，左侧的值全部小于 target，右侧的值全部大于target，将target放到此位置
* 相对于上一种方法，节省了空间
*/
function quickSort(arr,start,end){
if(end - start < 1) {
 return; 
}
const target = array[start];
let l = start, r = end;
while(l < r){
 while(l < r && array[r] >= target){
   r--;
 }
 array[l] = array[r];
 while(l < r && array[l] < target){
   l++;
 }
 array[r] = array[l];
}
array[l] = target;
quickSort(array, start, l - 1);
quickSort(array, l + 1, end);
return array;
}

```


## 冒泡排序
```
function bubbleSort(array){
 for(let i = 0; i < array.length; i++){
 let flag = true;
 for(let j = 0; j < array.length - 1 - i; j++){
   if(array[j] > array[j + 1]){
     [array[j],array[j + 1]] = [array[j + 1],arr[j]];
     flag = false;
   }
 }
 if(flag){// 没有冒泡，则停止循环
   break;
 }
}
return array;
}

```


## 动态规划

- 问：
一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 20 级的台阶总共有多少种跳法。

- 解：
要想跳到第10级台阶，要么是先跳到第9级，然后再跳1级台阶上去;要么是先跳到第8级，然后一次迈2级台阶上去。即通用公式为: f(n) = f(n-1) + f(n-2)

动态规划有几个典型特征，最优子结构、状态转移方程、边界、重叠子问题。
- f(n-1)和f(n-2) 称为 f(n) 的最优子结构
- f(n)= f（n-1）+f（n-2）就称为状态转移方程
- f(1) = 1, f(2) = 2 就是边界啦
- 比如f(10)= f(9)+f(8),f(9) = f(8) + f(7) ,f(8)就是重叠子问题。

```
const numWays = (n) => {
  if (n <= 1) {
    return 1;
  }
  if (n == 2) {
    return 2;
  }
  let a = 1;
  let b = 2;
  let temp = 0;
  for (let i = 3; i <= n; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  return temp;
};
console.log(numWays(20));  //10946
```

## 最长递增子序列

vue3的diff采用的是对比最长递增子序列，接下来了解一下动态规划的思路解法

```
const lengthOfLIS = (nums)=>{
  if (nums.length == 0) {
    return 0;
  }
  const dp = new Array(nums.length)
  //初始化就是边界情况
  dp[0] = 1;
  let maxans = 1;
  //自底向上遍历
  for (let i = 1; i < nums.length; i++) {
      dp[i] = 1;
      //从下标0到i遍历
      for (let j = 0; j < i; j++) {
          //找到前面比nums[i]小的数nums[j],即有dp[i]= dp[j]+1
          if (nums[j] < nums[i]) {
              //因为会有多个小于nums[i]的数，也就是会存在多种组合了嘛，我们就取最大放到dp[i]
              dp[i] = Math.max(dp[i], dp[j] + 1);
          }
      }
      //求出dp[i]后，dp最大那个就是nums的最长递增子序列啦
      maxans = Math.max(maxans, dp[i]);
  }

  return maxans;
}

console.log(lengthOfLIS([8,4,66,5,7,8,965,4,3,2,134,35])); //5
```