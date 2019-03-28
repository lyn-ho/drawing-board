class UndoStack {

  constructor() {
    this.undoStack = []
    this.redoStack = []
  }

  push(canvas) {
    this.undoStack.push(canvas.toDataURL())
    this.redoStack = []
  }

  undo(canvas, ctx, initData) {
    if(this.undoStack.length) {
      this.redoStack.push(this.undoStack.pop())
      let dataUrl = this.undoStack.length ? this.undoStack[this.undoStack.length - 1] : initData

      let pic = new Image()
      
      pic.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(pic, 0, 0)
      }
      pic.src = dataUrl
    }
  }

  redo(canvas, ctx) {
    if(this.redoStack.length) {
      let dataUrl = this.redoStack.pop()
      this.undoStack.push(dataUrl)

      let pic = new Image()
      pic.src = dataUrl

      pic.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(pic, 0, 0)
      }
    }
  }
}

export default UndoStack

