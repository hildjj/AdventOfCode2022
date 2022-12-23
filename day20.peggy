lines = (@line "\n")*

line = n:$("-"? [0-9]+) { return parseInt(n, 10) }
