lines = (@line "\n")*

line = @range "," @range

range = @number "-" @number

number = n:$[0-9]+ { return parseInt(n, 10); }
