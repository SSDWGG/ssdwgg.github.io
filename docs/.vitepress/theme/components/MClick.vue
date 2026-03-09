<script setup>
import { inBrowser } from 'vitepress';

if (inBrowser) {

  function bg3() {
    var rs = Math.floor(Math.random() * (170 - 100) + 100);
    var gs = Math.floor(Math.random() * (170 - 100) + 100);
    var bs = Math.floor(Math.random() * (100 - 90) + 90);
    return "rgb(" + rs + ',' + gs + ',' + bs + ")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
  }

  var as = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法制", "爱国", "敬业", "诚信", "友善"]
  document.onclick = function (e) {
    var spans = document.createElement("h6")
    spans.innerHTML = as[Math.floor(Math.random() * as.length)]
    spans.style.position = "absolute"
    spans.style.color = bg3()
    spans.style.transition = ".5s"
    spans.style.left = e.pageX - 10 + "px"
    spans.style.top = e.pageY - 27 + "px"
    setTimeout(function () {
      spans.style.opacity = "1"
      spans.style.transform = "translateY(-50px) scale(1.5)"
    }, 100)
    setTimeout(function () {
      spans.style.opacity = "0"
      spans.style.transform = "translateY(-200px) scale(0)"
    }, 500)
    setTimeout(function () {
      // 动画结束后移除元素
      if (spans.parentNode) {
        spans.parentNode.removeChild(spans)
      }
    }, 600)
    document.body.appendChild(spans)
  }

}
</script>
<template>
  <div></div>
</template>