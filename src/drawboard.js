import UndoStack from './undostack'
class DrawBoard {
  constructor(canvas, ctx, initData) {
    this.canvas = canvas
    this.ctx = ctx
    this.initData = initData

    this.undoStack = new UndoStack(canvas, ctx)
  }

  setRadius(radius) {
    this.radius = radius
  }

  setStrokeWidth(strokeWidth) {
    this.strokeWidth = strokeWidth
  }

  setStrokeOpacity(strokeOpacity) {
    this.strokeOpacity = strokeOpacity
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath()

    this.ctx.lineWidth = this.strokeWidth
    this.ctx.globalAlpha = this.strokeOpacity

    this.ctx.lineCap = 'round'

    this.ctx.lineJoin = 'round'

    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
    this.ctx.closePath()
  }

  eraser(x1, y1, x2, y2) {
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

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.globalCompositeOperation = 'destination-out'
    this.radius = Math.max(this.strokeWidth / 2, 5)
    this.ctx.arc(x2, y2, this.radius, 0, 2 * Math.PI)
    this.ctx.clip()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.globalCompositeOperation = 'destination-out'
    this.ctx.moveTo(x3, y3)
    this.ctx.lineTo(x5, y5)
    this.ctx.lineTo(x6, y6)
    this.ctx.lineTo(x4, y4)
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.push()
  }

  save() {
    const image = canvas
      .toDataURL('img/png')
      .replace('image/png', 'image/octet-stream')

    const link = document.createElement('a')
    document.body.appendChild(link)

    link.href = image
    link.download = `pic-${Date.now()}.png`
    link.target = '_blank'
    link.click()

    document.body.removeChild(link)
  }

  push() {
    this.undoStack.push(this.canvas)
  }

  undo() {
    this.undoStack.undo(this.canvas, this.ctx, this.initData)
  }

  redo() {
    this.undoStack.redo(this.canvas, this.ctx)
  }
}

export default DrawBoard
