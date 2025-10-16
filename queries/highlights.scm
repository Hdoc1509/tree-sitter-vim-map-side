(keycode) @character.special

; avoids highlighting "<" within ERROR nodes. corner cases
(keycode
  [
    "<"
    ">"
  ] @punctuation.bracket)
