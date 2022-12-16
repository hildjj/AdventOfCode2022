lines = (@line "\n")*

line = "Sensor at x=" @num", y=" @num ": closest beacon is at x=" @num ", y=" @num

num = n:$("-"? [0-9]+) { return parseInt(n, 10) }
