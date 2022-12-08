lines = (@line "\n")*
line = number+
number = n:[0-9] { return parseInt(n, 10); }
