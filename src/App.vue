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
      console.log('mouse down')
      this.painting = true

      let x1 = e.clientX
      let y1 = e.clientY

      if(this.eraserEnable) {
        let context = this.getCanvasContext()
        if(context) {
          context.save()
          // TODO
        }
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
        // TODO
      } else {
        this.drawLine(x1, y1, x2, y2)
        this.lastPoint = {x: x2, y: y2}
      }
    },

    handleMouseUp() {
      console.log('mouse up')
      this.painting = false
    },

    moveHandler(x1, y1, x2, y2) {

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

    handleBrush() {},

    handleEraser() {},

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
