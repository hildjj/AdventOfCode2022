pairs = head:pair tail:("\n" @pair)* { return [head, ...tail] }
pair = @list "\n" @list "\n"

entry
  = number
  / list

// This originally just used JSON.parse, but it wasn't hard to do it correctly.
list
  = "[]" { return [] }
  / "[" head:entry tail:("," @entry)* "]" { return [head, ...tail] }

number = n:$[0-9]+ { return parseInt(n, 10) }
