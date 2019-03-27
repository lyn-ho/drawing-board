<template lang="pug">
  div#app
    canvas#canvas(
      @touchstart='handleTouchStart' 
      @touchmove='handleTouchMove' 
      @touchend='handleTouchEnd'
      @mousedown='handleMouseDown'
      @mousemove='handleMouseMove'
      @mouseup='handleMouseUp')
    .tools
      .container
        font-awesome-icon.tool-item.save(@click='handleSave' title='Save' icon='download')
        font-awesome-icon.tool-item.brush(@click='handleBrush' title='Brush' icon='paint-brush')
        font-awesome-icon.tool-item.eraser(@click='handleEraser' title='Eraser' icon='eraser')
        font-awesome-icon.tool-item.clear(@click='handleClear' title='Clear' icon='trash')
        font-awesome-icon.tool-item.undo(@click='handleUndo' title='Undo' icon='undo')
        font-awesome-icon.tool-item.redo(@click='handleRedo' title='Redo' icon='redo')
    .pen-detail
      i.closeBtn
      p Brush Size
      span.circle-box
        i#thickness
      input(type='range' min='1' max='10' value='1')
      p Brush Color
      ul.pen-color.clearfix
        li.color-item.color-000.active
        li.color-item.color-f33
        li.color-item.color-9c0
        li.color-item.color-06f
        li.color-item.color-ff3
        li.color-item.color-3c6
      p Opacity
      i.showOpacity
      input(type='range' min='1' max='10' value='1')
</template>

<script>
export default {
  data() {
    return {
      eraserEnable: false,

      painting: false,

      radius: 5,

      lWidth: 2,

      activeBgColor: '#fff',

      lastPoint: {}
    };
  },

  methods: {
    handleTouchStart() {

    },

    handleTouchMove() {

    },

    handleTouchEnd() {

    },

    handleMouseDown(e) {
      let context = this.getCanvasContext()

      if(!context) return

      let canvas = this.getCanvas()
      this.painting = true

      let x1 = e.clientX
      let y1 = e.clientY

      if(this.eraserEnable) {
        context.save()
        
        context.globalCompositeOperation = 'destination-out'
        context.beginPath()

        this.radius = Math.max(this.lWidth / 2, 5)
        
        context.arc(x1, y1, this.radius, 0, 2 * Math.PI)
        context.clip()
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.restore()
      }

      this.lastPoint = {x: x1, y: y1}
    },


    handleMouseMove(e) {
      if(!this.painting) return

      let x1 = this.lastPoint.x
      let y1 = this.lastPoint.y
      let x2 = e.clientX
      let y2 = e.clientY

      if(this.eraserEnable) {
        this.doEraser(x1, y1, x2, y2)
      } else {
        this.drawLine(x1, y1, x2, y2)
      }

      this.lastPoint = {x: x2, y: y2}
    },

    handleMouseUp() {
      this.painting = false
    },

    doEraser(x1, y1, x2, y2) {
      let context = this.getCanvasContext()
      if(!context) return

      let canvas = this.getCanvas()

      let asin = this.radius * Math.sin(Math.atan((y2 - y1) / (x2 - x1)))
      let acos = this.radius * Math.cos(Math.atan((y2 - y1) / (x2 - x1)))

      let x3 = x1 + asin
      let y3 = y1 - acos

      let x4 = x1 - asin
      let y4 = y1 + acos

      let x5 = x2 + asin
      let y5 = y2 - acos

      let x6 = x2 - asin
      let y6 = y2 + acos

      context.save()
      context.beginPath()
      context.globalCompositeOperation = 'destination-out'
      this.radius = Math.max(this.lWidth / 2, 5)
      context.arc(x2, y2, this.radius, 0, 2 * Math.PI)
      context.clip()
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.restore()

      context.save()
      context.beginPath()
      context.globalCompositeOperation = 'destination-out'
      context.moveTo(x3, y3)
      context.lineTo(x5, y5)
      context.lineTo(x6, y6)
      context.lineTo(x4, y4)
      context.closePath()
      context.clip()
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.restore()
    },

    drawLine(x1, y1, x2, y2) {
      let context = this.getCanvasContext()
      if(!context) return

      context.beginPath()

      context.lineWidth = 2

      context.lineCap = 'round'

      context.lineJoin = 'round'

      context.moveTo(x1, y1)
      context.lineTo(x2, y2)
      context.stroke()
      context.closePath()
    },

    handleSave() {},

    handleBrush() {
      this.eraserEnable = false
    },

    handleEraser() {
      this.eraserEnable = true
    },

    handleClear() {
      let canvas = this.getCanvas()
      let context = this.getCanvasContext()
      if(!context) return

      context.clearRect(0, 0, canvas.width, canvas.height)
    },

    handleUndo() {},

    handleRedo() {},

    getCanvas() {
      return document.getElementById("canvas");
    },

    getCanvasContext() {
      return this.getCanvas() && this.getCanvas().getContext("2d");
    },

    setCanvasSize() {
      let canvas = this.getCanvas();
      let context = this.getCanvasContext();
      if (!context) return;

      let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      let pageWidth = document.documentElement.clientWidth;
      let pageHeight = document.documentElement.clientHeight;

      canvas.width = pageWidth;
      canvas.height = pageHeight;
      context.putImageData(imgData, 0, 0);
    }
  },

  mounted() {
    window.addEventListener("resize", this.setCanvasSize());
  },

  beforeDestroy() {
    window.removeEventListener("resize");
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*::before {
  box-sizing: border-box;
}

*::after {
  box-sizing: border-box;
}

ul {
  padding: 0;
}

li {
  list-style: none;
}

#app {
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  color: blue;

  canvas {
    display: block;
    background-color: #fff;
  }

  .tools {
    position: fixed;
    left: 0;
    bottom: 30px;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    text-align: center;

    .container {
      padding: 8px 20px;
      border-radius: 40px;
      box-shadow: 0 1px 2px 0 rgba(32, 33, 36, 0.28);
      background-color: #fff;

      .tool-item {
        color: #999;
        width: 30px;
        height: 30px;
        border: none;
        outline: none;
        background-size: 20px 20px;
        background-position: center center;
        background-repeat: no-repeat;
        background-color: #fff;
        margin: 0 6px;
        transition: 0.3px;
        cursor: pointer;
        border: 2px solid transparent;

        &.save {
        }

        &.brush {
        }

        &.eraser {
        }

        &.clear {
        }

        &.undo {
        }

        &.redo {
        }

        &.active {
          border-radius: 5px;
          border-color: #1398e6;
        }
      }
    }
  }

  .pen-detail {
    display: none;
    position: fixed;
    left: 50%;
    margin-left: -140px;
    bottom: 90px;
    width: 280px;
    height: 210px;
    padding: 20px 24px;
    border: 1px solid #81a4bd;
    border-radius: 5px;
    color: #808fa2;
    background-color: #fff;
    font-size: 14px;

    p {
      margin-top: 2px;
      margin-bottom: 4px;
    }

    input[type="range"] {
      -webkit-appearance: none;
      width: 180px;
      height: 20px;
      outline: none;

      &::-webkit-slider-runnable-track {
        background-color: #dbdbdb;
        height: 4px;
        border-radius: 5px;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: #ff4081;
        cursor: pointer;
        margin-top: 4px;
      }
    }

    .closeBtn {
      position: absolute;
      top: 6px;
      right: 8px;
      width: 32px;
      height: 32px;

      cursor: pointer;
    }

    .circle-box {
      line-height: 24px;
      position: relative;
      width: 24px;
      height: 24px;
      display: inline-block;
      text-align: center;
      margin-right: 8px;

      #thickness {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1px;
        margin-top: -1px;
        background-color: #000;
        border-radius: 50%;
        transform-origin: center;
        width: 2px;
        height: 2px;
      }
    }

    .pen-color {
      .color-item {
        &.color-000 {
          background-color: #000;
        }

        &.color-f33 {
          background-color: #f33;
        }

        &.color-9c0 {
          background-color: #9c0;
        }

        &.color-06f {
          background-color: #06f;
        }

        &.color-ff3 {
          background-color: #ff3;
        }

        &.color-3c6 {
          background-color: #3c6;
        }
      }
    }

    .showOpacity {
      display: inline-block;
      width: 26px;
      height: 26px;
      background-color: #000;
      border-radius: 50%;
      margin-right: 4px;
      margin-left: 4px;
    }

    .clearfix {
      &::after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
}
</style>
