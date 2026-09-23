Add-Type -AssemblyName System.Drawing

$OutputDir = Join-Path $PSScriptRoot "..\Src\world\tile_sprites"
if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

function New-Bitmap {
  param(
    [int]$Width,
    [int]$Height
  )
  return New-Object System.Drawing.Bitmap($Width, $Height)
}

function Set-PixelSafe {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [int]$X,
    [int]$Y,
    [System.Drawing.Color]$Color
  )
  if ($X -ge 0 -and $Y -ge 0 -and $X -lt $Bitmap.Width -and $Y -lt $Bitmap.Height) {
    $Bitmap.SetPixel($X, $Y, $Color)
  }
}

function Fill {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [System.Drawing.Color]$Color
  )
  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      $Bitmap.SetPixel($x, $y, $Color)
    }
  }
}

function DrawRect {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [int]$X,
    [int]$Y,
    [int]$W,
    [int]$H,
    [System.Drawing.Color]$Color
  )
  for ($yy = $Y; $yy -lt ($Y + $H); $yy++) {
    for ($xx = $X; $xx -lt ($X + $W); $xx++) {
      Set-PixelSafe -Bitmap $Bitmap -X $xx -Y $yy -Color $Color
    }
  }
}

function DrawChecker {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [System.Drawing.Color]$A,
    [System.Drawing.Color]$B,
    [int]$CellSize
  )
  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      $cx = [Math]::Floor($x / $CellSize)
      $cy = [Math]::Floor($y / $CellSize)
      if ((($cx + $cy) % 2) -eq 0) {
        $Bitmap.SetPixel($x, $y, $A)
      } else {
        $Bitmap.SetPixel($x, $y, $B)
      }
    }
  }
}

function Save-Png {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Name
  )
  $path = Join-Path $OutputDir $Name
  $Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Bitmap.Dispose()
}

$tiles = @(
  @{ Name = 'grass.png'; Build = {
      param($bmp)
      DrawChecker $bmp ([System.Drawing.Color]::FromArgb(120, 171, 104)) ([System.Drawing.Color]::FromArgb(107, 157, 93)) 2
      DrawRect $bmp 2 3 2 2 ([System.Drawing.Color]::FromArgb(85, 130, 73))
      DrawRect $bmp 11 10 2 2 ([System.Drawing.Color]::FromArgb(85, 130, 73))
      DrawRect $bmp 6 7 1 1 ([System.Drawing.Color]::FromArgb(160, 203, 126))
    }
  },
  @{ Name = 'dry_dirt.png'; Build = {
      param($bmp)
      DrawChecker $bmp ([System.Drawing.Color]::FromArgb(168, 126, 80)) ([System.Drawing.Color]::FromArgb(153, 113, 72)) 2
      DrawRect $bmp 3 5 3 1 ([System.Drawing.Color]::FromArgb(127, 91, 55))
      DrawRect $bmp 9 11 2 2 ([System.Drawing.Color]::FromArgb(127, 91, 55))
    }
  },
  @{ Name = 'path.png'; Build = {
      param($bmp)
      Fill $bmp ([System.Drawing.Color]::FromArgb(155, 132, 96))
      DrawRect $bmp 0 5 16 6 ([System.Drawing.Color]::FromArgb(183, 157, 118))
      DrawRect $bmp 4 7 2 2 ([System.Drawing.Color]::FromArgb(205, 178, 136))
      DrawRect $bmp 10 8 2 2 ([System.Drawing.Color]::FromArgb(205, 178, 136))
    }
  },
  @{ Name = 'water.png'; Build = {
      param($bmp)
      DrawChecker $bmp ([System.Drawing.Color]::FromArgb(72, 143, 204)) ([System.Drawing.Color]::FromArgb(62, 127, 186)) 2
      DrawRect $bmp 2 4 3 1 ([System.Drawing.Color]::FromArgb(135, 196, 235))
      DrawRect $bmp 9 9 4 1 ([System.Drawing.Color]::FromArgb(135, 196, 235))
      DrawRect $bmp 4 12 2 1 ([System.Drawing.Color]::FromArgb(135, 196, 235))
    }
  },
  @{ Name = 'stone.png'; Build = {
      param($bmp)
      Fill $bmp ([System.Drawing.Color]::FromArgb(124, 125, 129))
      DrawRect $bmp 1 1 6 5 ([System.Drawing.Color]::FromArgb(144, 146, 151))
      DrawRect $bmp 8 2 7 4 ([System.Drawing.Color]::FromArgb(108, 110, 114))
      DrawRect $bmp 3 8 5 6 ([System.Drawing.Color]::FromArgb(138, 139, 144))
      DrawRect $bmp 10 9 5 5 ([System.Drawing.Color]::FromArgb(102, 104, 109))
    }
  },
  @{ Name = 'shrub.png'; Build = {
      param($bmp)
      Fill $bmp ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      DrawRect $bmp 3 5 10 9 ([System.Drawing.Color]::FromArgb(62, 128, 61))
      DrawRect $bmp 5 3 6 3 ([System.Drawing.Color]::FromArgb(78, 150, 75))
      DrawRect $bmp 4 7 2 2 ([System.Drawing.Color]::FromArgb(108, 176, 93))
      DrawRect $bmp 10 9 2 2 ([System.Drawing.Color]::FromArgb(108, 176, 93))
      DrawRect $bmp 7 12 2 2 ([System.Drawing.Color]::FromArgb(50, 104, 50))
    }
  },
  @{ Name = 'flowers.png'; Build = {
      param($bmp)
      Fill $bmp ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      DrawRect $bmp 2 9 2 5 ([System.Drawing.Color]::FromArgb(74, 128, 59))
      DrawRect $bmp 7 8 2 6 ([System.Drawing.Color]::FromArgb(74, 128, 59))
      DrawRect $bmp 12 9 2 5 ([System.Drawing.Color]::FromArgb(74, 128, 59))
      DrawRect $bmp 1 7 4 3 ([System.Drawing.Color]::FromArgb(215, 82, 115))
      DrawRect $bmp 6 6 4 3 ([System.Drawing.Color]::FromArgb(238, 168, 74))
      DrawRect $bmp 11 7 4 3 ([System.Drawing.Color]::FromArgb(110, 161, 232))
    }
  },
  @{ Name = 'signpost.png'; Build = {
      param($bmp)
      Fill $bmp ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      DrawRect $bmp 6 4 4 10 ([System.Drawing.Color]::FromArgb(111, 78, 49))
      DrawRect $bmp 2 2 12 5 ([System.Drawing.Color]::FromArgb(161, 120, 78))
      DrawRect $bmp 3 3 10 3 ([System.Drawing.Color]::FromArgb(190, 148, 101))
    }
  },
  @{ Name = 'ripple_marker.png'; Build = {
      param($bmp)
      Fill $bmp ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      DrawRect $bmp 3 7 10 2 ([System.Drawing.Color]::FromArgb(138, 210, 240))
      DrawRect $bmp 5 10 6 2 ([System.Drawing.Color]::FromArgb(138, 210, 240))
      DrawRect $bmp 7 13 2 1 ([System.Drawing.Color]::FromArgb(138, 210, 240))
    }
  }
)

foreach ($tile in $tiles) {
  $bmp = New-Bitmap -Width 16 -Height 16
  & $tile.Build $bmp
  Save-Png -Bitmap $bmp -Name $tile.Name
}

$player = New-Bitmap -Width 16 -Height 32
Fill $player ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

# Boots
DrawRect $player 4 27 3 4 ([System.Drawing.Color]::FromArgb(74, 52, 37))
DrawRect $player 9 27 3 4 ([System.Drawing.Color]::FromArgb(74, 52, 37))

# Pants
DrawRect $player 4 20 8 7 ([System.Drawing.Color]::FromArgb(74, 95, 141))
DrawRect $player 5 23 2 3 ([System.Drawing.Color]::FromArgb(58, 78, 119))
DrawRect $player 9 23 2 3 ([System.Drawing.Color]::FromArgb(58, 78, 119))

# Shirt
DrawRect $player 3 13 10 8 ([System.Drawing.Color]::FromArgb(204, 154, 68))
DrawRect $player 2 14 2 5 ([System.Drawing.Color]::FromArgb(190, 139, 57))
DrawRect $player 12 14 2 5 ([System.Drawing.Color]::FromArgb(190, 139, 57))

# Head and hair
DrawRect $player 4 4 8 9 ([System.Drawing.Color]::FromArgb(225, 188, 146))
DrawRect $player 3 2 10 4 ([System.Drawing.Color]::FromArgb(92, 62, 44))
DrawRect $player 3 4 2 3 ([System.Drawing.Color]::FromArgb(92, 62, 44))
DrawRect $player 11 4 2 3 ([System.Drawing.Color]::FromArgb(92, 62, 44))

# Face details
Set-PixelSafe -Bitmap $player -X 6 -Y 8 -Color ([System.Drawing.Color]::FromArgb(48, 41, 36))
Set-PixelSafe -Bitmap $player -X 9 -Y 8 -Color ([System.Drawing.Color]::FromArgb(48, 41, 36))
Set-PixelSafe -Bitmap $player -X 7 -Y 10 -Color ([System.Drawing.Color]::FromArgb(181, 126, 99))
Set-PixelSafe -Bitmap $player -X 8 -Y 10 -Color ([System.Drawing.Color]::FromArgb(181, 126, 99))

Save-Png -Bitmap $player -Name 'player.png'

Write-Host "Placeholder sprites generated in $OutputDir"