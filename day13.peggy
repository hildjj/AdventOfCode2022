pairs = head:pair tail:("\n" @pair)* { return [head, ...tail] }
pair = @line "\n" @line "\n"

line = n:$[^\n]* { return JSON.parse(n) }
