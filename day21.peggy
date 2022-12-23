lines = (@line "\n")*

line = @name _ ":" _ @job

job
  = num
  / @name _ @op _ @name

name = $[^ \t\n=*/:+-]+
op
  = "+"
  / "-"
  / "*"
  / "/"

num = n:$[0-9]+ { return parseInt(n, 10) }
_ = [ \t]*
