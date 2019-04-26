class TypedText {
  constructor(elem) {
    this.elem = elem
    this.loadSettings()
    if(this.settings.to === null){
      throw "All TypedText element require a TT-to attribute!"
    }
    this.generateChangeMap()
    this.update = this.update.bind(this)

    //time between keystrokes
    this.interval = this.settings.duration / this.changeMap.length

    setTimeout(this.update, this.settings.delay);
  }

  loadSettings() {
    this.settings = {
      // The text that it's being changed into.
      to: this.elem.getAttribute('TT-to') || null,
      // How long to wait to begin the animation
      delay: parseInt(this.elem.getAttribute('TT-delay-ms')) || 0,
      // How long the typing animation lasts
      duration: parseInt(this.elem.getAttribute('TT-duration-ms'))
        || 1000,
    }
  }

  addTypo() {
    let typoLength = Math.floor(Math.random() * 2) + 1
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    // const letters = '***'
    for (let i = 0; i < typoLength; i++) {
      let rand = Math.floor(Math.random() * letters.length)

      this.changeMap.push(letters[rand])
    }
    for (let i = 0; i < typoLength; i++) {
      this.changeMap.push('\b')
    }
  }

  generateChangeMap() {
    this.changeMap = []

    let from = this.elem.textContent.trimStart()
    let to = this.settings.to.trimStart()

    // How many characters can be left alone at the start of the string
    const maxSharedLength = Math.min(from.length, to.length)
    let sharedLength = 0
    for (; sharedLength <= maxSharedLength; sharedLength++) {
      if(from[sharedLength] != to[sharedLength]) {
        break
      }
    }

    // the string needs to be erased, start by adding the required number of backspaces.
    let chopLength = Math.max(from.length - sharedLength, 0);

    for (let i = 0; i < chopLength; i++) {
      this.changeMap.push('\b')
    }

    // push the things that need to be appended to the changemap
    for (let i = sharedLength; i < to.length; i++) {
      this.changeMap.push(to[i])
      if(Math.random() > 0.95) {
        this.addTypo()
      }
    }
    this.changeMap.reverse()
  }

  update() {
    let action = this.changeMap.pop()
    if(action == '\b') {
      this.elem.textContent = this.elem.textContent.slice(0, -1)
    } else {
      this.elem.textContent += (action)
    }
    if(this.changeMap.length > 0) {
      setTimeout(this.update, this.interval);
    }
  }

}

const ttxts = document.querySelectorAll('.TT')
var TypedTexts = []
for (ttxt of ttxts) {
  TypedTexts.push( new TypedText(ttxt) )
}
