lines = (@line "\n")*

line = @num "," @num "," @num
num = n:$[0-9]+ { return parseInt(n, 10) }
