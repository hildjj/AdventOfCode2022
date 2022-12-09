lines = (@line "\n")*

line = @dir " " @num

dir = [LRUD]

num = n:$[^\n]* { return parseInt(n, 10) }
