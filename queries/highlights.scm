(keycode) @character.special

; avoids highlighting "<" within ERROR nodes (corner cases)
(keycode
  [
    "<"
    ">"
  ] @punctuation.bracket)

[
  "|"
  (bar)
] @operator

"\\|" @string.escape

"printf" @function.call

[
  ")"
  "("
] @punctuation.bracket

"," @punctuation.delimiter

(scoped_identifier
  (scope) @module)

(scoped_identifier
  (identifier) @variable)

(string) @string

(comment) @comment
