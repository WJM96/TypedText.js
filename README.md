# TypedText.js
---
TypedText.js is a JavaScript library to create dynamic text with a typing effect.

Animated text elements will transition from the inner content to the content defined in a custom attribute. Animation delay and keystroke interval are customizable via attributes as well.

It uses plain ES.

---

## Usage:
  1: Link the script anywhere in your page.
  ```html
  <script type="text/javascript" src="TypedText.js"></script>
  ```
  2: Mark the elements you want to animate with the `TT` class, and the `TT-to` attribute.
  ```html
  <p
    class='TT'
    TT-to="This is some awesome text.">
    This is some boring text.
  </p>
  ```

  3: Call `runTT()` to animate! _Put this after the elements you wish to animate._
  ```html
  <script type="text/javascript">
    runTT()
  </script>
  ```
## Features:
  __Delay__: By default, TypedText.js executes animations immediately. You can add the `TT-delay-ms` attribute to force the script to wait a set number of milliseconds before running on that particular element. Ex:
  ```html
  <p
    class='TT'
    TT-to="Oh boy that took a while"
    TT-delay-ms="3000">
    I'll start animating in 3 seconds!
  </p>
  ```

  __Interval__: The interval between "keystrokes" is set with `TT-interval-ms` like so (in milliseconds):
  ```html
  <p
    class='TT'
    TT-to="I'm the fastest text in the west"
    TT-interval-ms="30">
    I'm the...
  </p>
  ```
  _Interval defaults to 60ms_

  __Typos__ (not yet accessible): TypedText can simulate stray keypresses and misclicks. The final text will be the same, but mistakes will appear in the typing process (an be corrected).

## Other:
TypedText can also be applied more specifically by passing a selector to `runTT()`. This function uses `querySelectorAll()` to find the desired elements, so be sure to prepend your class and id names with the appropriate prefix ('.class', '#id'). Additionally, you may choose to use the TypedText class directly. Check out [the source code](./script.js) for more information.

Clone the repository and open index.html for a quick demo.
