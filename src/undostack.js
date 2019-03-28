class UndoStack {

  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context

    this.undoStack = []
    this.redoStack = []
  }

  push() {
    if(!canvas) return
    this.undoStack.push(canvas.toDataURL())
    this.redoStack = []
  }

  undo() {
    if(this.context && this.undoStack.length) {
      let dataUrl = this.undoStack.pop()
      this.redoStack.push(dataUrl)

      let pic = new Image()
      pic.src = dataUrl

      pic.onload = () => {
        this.context.drawImage(pic, 0, 0)
      }
    }
  }

  redo() {
    if(this.context && this.redoStack.length) {
      let dataUrl = this.redoStack.pop()
      this.undoStack.push(dataUrl)

      let pic = new Image()
      pic.src = dataUrl

      pic.onload = () => {
        this.context.drawImage(pic, 0, 0)
      }
    }
  }
}

export default UndoStack

