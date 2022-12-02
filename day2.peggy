list = game+

game = @ABC " " @XYZ "\n"

ABC
  = "A" { return 1 }
  / "B" { return 2 }
  / "C" { return 3 }

XYZ
  = "X" { return 1 }
  / "Y" { return 2 }
  / "Z" { return 3 }
