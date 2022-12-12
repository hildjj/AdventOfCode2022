lines = (@line "\n")*

line = char+

char
  = c:[a-z] { return c.codePointAt(0) - 'a'.codePointAt(0); }
  / "S" { return -1 }
  / "E" { return Infinity }
