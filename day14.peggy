lines = (@line "\n")*

line = head:pair tail:(_ "->" _ @pair)* { return [head, ...tail] }
pair = x:num "," y:num { return { x, y} }
num = n:$[0-9]+ { return parseInt(n, 10) }
_ = [ \t]*
