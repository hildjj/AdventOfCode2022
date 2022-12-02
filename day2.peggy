list = game+

game = @ABC " " @XYZ "\n"

ABC
  = "A" { return 0 }
  / "B" { return 1 }
  / "C" { return 2 }

XYZ
  = "X" { return 0 }
  / "Y" { return 1 }
  / "Z" { return 2 }
