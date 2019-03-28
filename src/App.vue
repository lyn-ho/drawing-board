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
        font-awesome-icon.tool-item(@click='handleSave' title='Save' icon='download')
        font-awesome-icon.tool-item(@click='activeBrush' :class='{ "tool-active": !eraserEnable }' title='Brush' icon='paint-brush')
        font-awesome-icon.tool-item(@click='activeEraser' :class='{ "tool-active": eraserEnable }' title='Eraser' icon='eraser')
        font-awesome-icon.tool-item(@click='handleClear' title='Clear' icon='trash')
        font-awesome-icon.tool-item(@click='handleUndo' title='Undo' icon='undo')
        font-awesome-icon.tool-item(@click='handleRedo' title='Redo' icon='redo')
    .pen-detail(v-show='showPenDetail')
      font-awesome-icon.closeBtn(icon='times-circle' @click='showPenDetail = false')
      p Brush Size
      span.circle-box
        i#thickness(:style='[{ transform: `scale(${halfWidth})` }, { backgroundColor: activeColor }]')
      input(type='range' min='1' max='10' value='1' v-model='halfWidth')
      p Brush Color
      ul.pen-color.clearfix
        li.color-item(v-for='penColor of penColors' 
          :class='{ "color-active": penColor === activeColor }' 
          :style='{ backgroundColor: penColor }'
          @click='changePenColor(penColor)')
      p Opacity
      i.showOpacity(:style='{ opacity: strokeOpacity }')
      input(type='range' min='1' max='10' value='1' v-model='rawOpacity')
</template>

<script>
import _ from 'lodash'

import DrawBoard from './drawboard'

let drawboard

export default {
  data() {
    return {
      showPenDetail: false,

      penColors: ['#000000', '#FF3333', '#99CC00', '#0066FF', '#FFFF33', '#33CC66'],

      halfWidth: 1,
      rawOpacity: 1,

      eraserEnable: false,
      painting: false,
      activeColor: '#000000',

      activeBgColor: '#fff',

      lastPoint: {}
    };
  },

  computed: {
    strokeOpacity() {
      return (11 - this.rawOpacity) / 10
    }
  },

  watch: {
    halfWidth(val) {
      let radius = Math.max(this.halfWidth, 5)
      drawboard && drawboard.setStrokeWidth(val * 2)
    },

    rawOpacity(val) {
      let opacity = (11 - this.rawOpacity) / 10
      drawboard && drawboard.setStrokeOpacity(opacity)
    }
  },

  methods: {
    handleTouchStart(e) {
      this.start(e.touches[0].clientX, e.touches[0].clientY)
    },

    handleTouchMove(e) {
      this.move(e.touches[0].clientX, e.touches[0].clientY)
    },

    handleTouchEnd() {
      this.end()
    },

    handleMouseDown(e) {
      this.start(e.clientX, e.clientY)
    },

    handleMouseMove(e) {
      this.move(e.clientX, e.clientY)
    },

    handleMouseUp() {
      this.end()
    },

    start(x, y) {
      this.painting = true

      if(this.eraserEnable) {
        drawboard && drawboard.eraserStart(x, y)
      }

      this.lastPoint = {x, y}
    },

    move(x2, y2) {
      if(!this.painting) return

      let x1 = this.lastPoint.x
      let y1 = this.lastPoint.y

      if(this.eraserEnable) {
        drawboard && drawboard.eraser(x1, y1, x2, y2)
      } else {
        drawboard && drawboard.drawLine(x1, y1, x2, y2)
      }


      this.lastPoint = {x: x2, y: y2}
    },

    end() {
      this.painting = false
      drawboard && drawboard.push()
    },

    changePenColor(color) {
      this.activeColor = color

      this.showPenDetail = false

      const context = this.getCanvasContext()
      if(context) {
        context.fillStyle = color
        context.strokeStyle = color
      }
    },

    handleSave() {
      drawboard && drawboard.save()
    },

    activeBrush() {
      this.eraserEnable = false

      this.showPenDetail = true
    },

    activeEraser() {
      this.eraserEnable = true
    },

    handleClear() {
      drawboard && drawboard.clear()
    },

    handleUndo() {
      drawboard && drawboard.undo()
    },

    handleRedo() {
      drawboard && drawboard.redo()
    },

    getCanvas() {
      return document.getElementById("canvas")
    },

    getCanvasContext() {
      return this.getCanvas() && this.getCanvas().getContext("2d")
    },

  },

  mounted() {
    let canvas = document.getElementById('canvas')
    if(!canvas) return
    let ctx = canvas.getContext('2d')

    drawboard = new DrawBoard(canvas, ctx, canvas.toDataURL())



    drawboard.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight)
    window.addEventListener("resize", _.debounce(() => {
      drawboard.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight)
    }, 1000))
  },

  beforeDestroy() {
    window.removeEventListener("resize")
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@media screen and (max-width: 768px) {
  .tools{
    bottom: 15px;
  }
  .pen-detail{
    bottom: 80px;
  }
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

        &.active {
          border-radius: 5px;
          border-color: #1398e6;
        }
      }
    }
  }

  .pen-detail {
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
        border-radius: 50%;
        background-color: #ff4081;
        cursor: pointer;
        margin-top: -4px;
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
        position: relative;
        float: left;
        list-style: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 4px;
        cursor: pointer;

        &.color-active::before {
          position: absolute;
          left: 3px;
          top: 3px;
          content: '';
          display: block;
          width: 24px;
          height: 24px;
          background: transparent;
          border: 2px solid #fff;
          border-radius: 50%;
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
