class TypedText {

  /**
   * constructor - constructs a new TypedText object for a given element.
   *
   * @param  {string\|object} elem DOM element to apply the effect to.
   * @return {void}
   */
  constructor(elem) {
    if (typeof elem === 'string') {
      elem = document.querySelector(elem)
    }

    if (elem === null) {
      throw 'TypedText has recieved a null element!'
    }

    this.elem = elem
    this.loadSettings()
    this.changeMap = TypedText.generateChangeMap(this.elem.textContent, this.settings.to)
  }

  /**
   * loadSettings - Loads the various element attributes into this.settings
   *
   * @return {void}
   */
  loadSettings() {
    this.settings = {
      // Text that it's being changed into.
      to: this.elem.getAttribute('data-tt-to') || null,
      // Time before beginning the animation
      delay: parseInt(this.elem.getAttribute('data-tt-delay-ms')) || 0,
      // Time between "keystrokes"
      interval: parseInt(this.elem.getAttribute('data-tt-interval-ms'))
        || 60,
    }

    if (this.settings.to === null){
      throw "All TypedText elements require a data-tt-to attribute to work"
    }
  }

  /**
   * @static addTypo - Adds a typo to a changeMap
   *
   * @param  {string[]} changeMap the changemap doomed to recieve typos
   * @return {void}
   */
  static addTypo(changeMap) {
    let typoLength = Math.floor(Math.random() * 2) + 1
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    for (let i = 0; i < typoLength; i++) {
      let rand = Math.floor(Math.random() * letters.length)

      changeMap.push(letters[rand])
    }

    // Typos should always be erased.
    for (let i = 0; i < typoLength; i++) {
      changeMap.push('\b')
    }
  }


  /**
   * @static Generates a list of actions (changeMap) needed to transform from one string to another.
   *  a changeMap is essentially just a character array with backspaces (\b)
   *
   * @param {string} from The starting string
   * @param {string} to The starting string
   * @return {string[]} List of "actions" (characters/backspaces)
   *
   */
  static generateChangeMap(from, to, useTypos = false) {
    let changeMap = []

    from = from.trimStart()
    to = to.trimStart()

    // How many characters can be left alone at the start of the 'from' string
    const maxSharedLength = Math.min(from.length, to.length)
    let sharedLength = 0
    for (; sharedLength <= maxSharedLength; sharedLength++) {
      if (from[sharedLength] != to[sharedLength]) {
        break
      }
    }

    // Parts of the 'from' string may need to be erased.
    let chopLength = Math.max(from.length - sharedLength, 0);

    for (let i = 0; i < chopLength; i++) {
      changeMap.push('\b')
    }

    // Push the things that need to be appended to the changemap
    for (let i = sharedLength; i < to.length; i++) {
      changeMap.push(to[i])
      if (useTypos === true && Math.random() > 0.95) {
        TypedText.addTypo(changeMap)
      }
    }

    // It's better to reverse here, so we can just use pop() in TypedText.run()
    changeMap.reverse()

    return changeMap
  }


  /**
   * @static sleep - Utility function to wait for a given time in an async function.
   *
   * @param  {number} ms time in milliseconds to wait before continuing execution
   * @return {void}
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


  /**
   * @async run - Play the TypedText animation on this element.
   *
   * @return {void}
   */
  async run() {
    await TypedText.sleep(this.settings.delay)

    while (this.changeMap.length > 0) {
      let action = this.changeMap.pop()

      if (action == '\b') {
        this.elem.textContent = this.elem.textContent.slice(0, -1)
      } else {
        this.elem.textContent += action
      }

      await TypedText.sleep(this.settings.interval)
    }
  }
}


/**
 * runTT - run
 *
 * @param  {string} selector = '.TT' selector for all TypedText elements
 * @return {void}
 */
function runTT(selector = '.TT') {
  const ttxts = document.querySelectorAll(selector)
  var typedTexts = []
  for (ttxt of ttxts) {
    typedTexts.push( new TypedText(ttxt) )
  }
  for (tt of typedTexts) {
    tt.run()
  }

}
