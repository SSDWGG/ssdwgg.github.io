<template>
     <!-- 名片分三大块 最外层的一块a、文字一大块b、平面圆柱一块c -->
     <div class="a">
        <div class="b">
          <a href="#">WGGのCRAD</a>
          <h2>WX: Sunshine-RovF</h2>
          <span>
            I'm Ren 
            <br />front-end developer 
            <br />In the days to come
            <br />Keep going!!
            <br />
          </span>
        </div>
        <div class="c">
          <!-- --i是用来计算平面圆柱的动效延迟和距离的
            --w则是用来计算平面圆柱的宽度 -->
          <div class="d" style="--i: 1; --w: 1.5"></div>
          <div class="d" style="--i: 2; --w: 1.6"></div>
          <div class="d" style="--i: 3; --w: 1.4"></div>
          <div class="d" style="--i: 4; --w: 1.7"></div>
          <div class="e" style="--i: 1"></div>
        </div>
        <!-- 设置二维码 -->
        <div class="f"></div>
      </div>
</template>


<style scoped lang="scss">

.a {
  position: relative;
  width: 300px;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.445);
  filter: drop-shadow(4px 4px 5px rgba(0, 0, 0, 0.164));
  z-index: 10;
  font-family: sans-serif;
    background-color: #e493d0;
    background-image: radial-gradient(closest-side, rgba(235, 105, 78, 1), rgba(235, 105, 78, 0)),
      radial-gradient(closest-side, rgba(243, 11, 164, 1), rgba(243, 11, 164, 0)),
      radial-gradient(closest-side, rgba(254, 234, 131, 1), rgba(254, 234, 131, 0)),
      radial-gradient(closest-side, rgba(170, 142, 245, 1), rgba(170, 142, 245, 0)),
      radial-gradient(closest-side, rgba(248, 192, 147, 1), rgba(248, 192, 147, 0));
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax, 110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax, -30vmax -10vmax, 50vmax 50vmax;
    background-repeat: no-repeat;
    animation: 10s movement linear infinite;
}

  @keyframes movement {
    0%,
    100% {
      background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax, 110vmax 110vmax, 90vmax 90vmax;
      background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax, -30vmax -10vmax, 50vmax 50vmax;
    }

    25% {
      background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax, 90vmax 90vmax, 60vmax 60vmax;
      background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax, -40vmax -20vmax, 40vmax 60vmax;
    }

    50% {
      background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax, 60vmax 60vmax, 80vmax 80vmax;
      background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax, 20vmax 10vmax, 30vmax 70vmax;
    }

    75% {
      background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax, 90vmax 90vmax, 70vmax 70vmax;
      background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax, -10vmax 10vmax, 40vmax 60vmax;
    }
  }


.b {
  position: absolute;
  width: 200px;
  height: 100%;
  left: 0;
  margin: 20px;
  transition: 1s;
  color: #3c3c3c;
}

.b a {
  text-decoration: none;
  color: #3c3c3c;
  font-size: 18px;
  font-weight: 900;
}

.b h2 {
  color: #3c3c3c;
  font-size: 14px;
  transition: 0.5s 1s;
  opacity: 0;
  color: rgb(30, 210, 200);
}

.b span {
  transition: 0.5s 1s;
  color: #3c3c3c;

  position: absolute;
  width: 100%;
  left: 0;
  top: 30px;
  font-size: 12px;
  font-weight: 500;
}

.c {
  position: absolute;
  top: -270px;
  right: -170px;
}

.d,
.e {
  position: absolute;
  right: calc(var(--i) * 40px);
  width: calc(var(--w) * 13px);
  height: 500px;
  overflow: hidden;
  border-radius: 10px;
  transform: rotateZ(220deg) translate(0, 0);
  background: rgb(240, 220, 150);
  transition: 0.5s 0.5s;
}

.d:nth-child(2) {
  background: rgb(240, 190, 230);
}

.e {
  left: -150px;
  top: -90px;
  width: 20px;
  background-color: rgb(90, 220, 150);
}

.a:hover .c div {
  /* 设置延迟动画 */
  transition: 0.5s calc(var(--i) * 0.1s);
  /* 移动的轨迹 */
  transform: rotateZ(220deg) translate(-200px, 400px);
}

.a:hover .b {
  transition: 1s 0.5s;
  left: 120px;
}

.a:hover .b span {
  transition: 1s 0.5s;
  top: 40px;
}

.a:hover .b h2 {
  transition: 1s 0.5s;
  opacity: 1;
}

.f {
  width: 120px;
  height: 120px;
  position: absolute;
  background-image: url('/wechat.png');
  background-size: cover;
  margin: 14px;
  margin-top: 30px;
  opacity: 0;
  transition: 0.5s;
}

.a:hover .f {
  transition: 1s 1.3s;
  opacity: 1;
}
</style>
