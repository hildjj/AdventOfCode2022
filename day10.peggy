lines = (@op "\n")*

op
  = @"addx" " " @num
  / n:"noop" { return [ n ] }

num = n:$("-"? [^\n]*) { return parseInt(n, 10) }
