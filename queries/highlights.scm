(keycode) @character.special

; avoids highlighting "<" within ERROR nodes (corner cases)
(keycode
  [
    "<"
    ">"
  ] @punctuation.bracket)

; highlighting for <cmd> and : rhs. avoids ERROR nodes (corner cases)
(map_side
  [
    "<"
    ">"
  ] @punctuation.bracket)

"\\|" @string.escape
