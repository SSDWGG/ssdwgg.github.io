<script>
export default {
  mounted() {
    const canvas = document.getElementById('BzdCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.lineWidth = 0.3
    ctx.strokeStyle = (new Color(150)).style

    // var mousePosition = {
    // x: 30 * canvas.width / 100,
    // y: 30 * canvas.height / 100
    // };
    const mousePosition = {
      x: canvas.width - 100,
      y: canvas.height - 60,
    }

    const dots = {
      nb: 200,
      distance: 100,
      d_radius: 150,
      array: [],
    }

    function colorValue(min) {
      return Math.floor(Math.random() * 255 + min)
    }

    function createColorStyle(r, g, b) {
      return `rgba(${r},${g},${b}, 0.8)`
    }

    function Color(min) {
      min = min || 0
      this.r = colorValue(min)
      this.g = colorValue(min)
      this.b = colorValue(min)
      this.style = createColorStyle(this.r, this.g, this.b)
    }

    function Dot() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height

      this.vx = -0.5 + Math.random()
      this.vy = -0.5 + Math.random()

      this.radius = Math.random() * 2

      this.color = new Color()
    }

    Dot.prototype = {
      draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color.style
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
      },
    }

    function createDots() {
      for (let i = 0; i < dots.nb; i++) {
        dots.array.push(new Dot())
      }
    }

    function moveDots() {
      for (let i = 0; i < dots.nb; i++) {
        const dot = dots.array[i]

        if (dot.y < 0 || dot.y > canvas.height) {
          // dot.vx = dot.vx;
          dot.vy = -dot.vy
        }
        else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx
          // dot.vy = dot.vy;
        }
        dot.x += dot.vx
        dot.y += dot.vy
      }
    }

    function drawDots() {
      for (let i = 0; i < dots.nb; i++) {
        const dot = dots.array[i]
        dot.draw()
      }
    }

    function animateDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      moveDots()
      // connectDots();
      drawDots()

      requestAnimationFrame(animateDots)
    }

    document.getElementById('BzdCanvasDiv').addEventListener('mousemove', (e) => {
      mousePosition.x = e.pageX
      mousePosition.y = e.pageY
    })

    document.getElementById('BzdCanvasDiv').addEventListener('mouseleave', () => {
      mousePosition.x = canvas.width / 2
      mousePosition.y = canvas.height / 2
    })
    createDots()
    requestAnimationFrame(animateDots)
  },
}
</script>

<template>
  <div id="BzdCanvasDiv">
    <canvas id="BzdCanvas" class="BzdCanvas" />
  </div>
</template>

<style>
#BzdCanvasDiv{
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  /* box-sizing: border-box; */
  overflow-x: hidden;
  background: transparent;
}
.BzdCanvas {
    position: fixed;
    /* z-index: 1; */
    z-index: 9999;
  opacity: .7;
  pointer-events: none;
}
</style>
