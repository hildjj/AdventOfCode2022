lines = @dir+ "\n"

dir
  = "<" { return -1; }
  / ">" { return 1; }
