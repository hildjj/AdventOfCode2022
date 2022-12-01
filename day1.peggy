elves = elf*

elf = @number+ ("\n" / EOF)

number = n:$[0-9]+ "\n" { return parseInt(n, 10); }
EOF = !.
