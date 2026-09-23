Add-Type -AssemblyName System.Drawing

$OutputDir = Join-Path $PSScriptRoot "..\src\world\tile_sprites"
if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

function New-Bitmap {
  param([int]$Width, [int]$Height)
  return New-Object System.Drawing.Bitmap($Width, $Height)
}

function Fill {
  param([System.Drawing.Bitmap]$Bitmap, [System.Drawing.Color]$Color)
  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      $Bitmap.SetPixel($x, $y, $Color)
    }
  }
}

function Set-PixelSafe {
  param([System.Drawing.Bitmap]$Bitmap, [int]$X, [int]$Y, [System.Drawing.Color]$Color)
  if ($X -ge 0 -and $Y -ge 0 -and $X -lt $Bitmap.Width -and $Y -lt $Bitmap.Height) {
    $Bitmap.SetPixel($X, $Y, $Color)
  }
}

function DrawRect {
  param([System.Drawing.Bitmap]$Bitmap, [int]$X, [int]$Y, [int]$W, [int]$H, [System.Drawing.Color]$Color)
  for ($yy = $Y; $yy -lt ($Y + $H); $yy++) {
    for ($xx = $X; $xx -lt ($X + $W); $xx++) {
      Set-PixelSafe -Bitmap $Bitmap -X $xx -Y $yy -Color $Color
    }
  }
}

function Save-Png {
  param([System.Drawing.Bitmap]$Bitmap, [string]$Name)
  $path = Join-Path $OutputDir $Name
  $Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Bitmap.Dispose()
}

function DrawPlayerBase {
  param([System.Drawing.Bitmap]$Bmp, [int]$BobOffset)

  Fill $Bmp ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

  # Shirt
  DrawRect $Bmp 3 (13 + $BobOffset) 10 8 ([System.Drawing.Color]::FromArgb(204, 154, 68))
  DrawRect $Bmp 2 (14 + $BobOffset) 2 5 ([System.Drawing.Color]::FromArgb(190, 139, 57))
  DrawRect $Bmp 12 (14 + $BobOffset) 2 5 ([System.Drawing.Color]::FromArgb(190, 139, 57))

  # Pants
  DrawRect $Bmp 4 (20 + $BobOffset) 8 7 ([System.Drawing.Color]::FromArgb(74, 95, 141))

  # Head and hair
  DrawRect $Bmp 4 (4 + $BobOffset) 8 9 ([System.Drawing.Color]::FromArgb(225, 188, 146))
  DrawRect $Bmp 3 (2 + $BobOffset) 10 4 ([System.Drawing.Color]::FromArgb(92, 62, 44))
  DrawRect $Bmp 3 (4 + $BobOffset) 2 3 ([System.Drawing.Color]::FromArgb(92, 62, 44))
  DrawRect $Bmp 11 (4 + $BobOffset) 2 3 ([System.Drawing.Color]::FromArgb(92, 62, 44))

  # Face details
  Set-PixelSafe -Bitmap $Bmp -X 6 -Y (8 + $BobOffset) -Color ([System.Drawing.Color]::FromArgb(48, 41, 36))
  Set-PixelSafe -Bitmap $Bmp -X 9 -Y (8 + $BobOffset) -Color ([System.Drawing.Color]::FromArgb(48, 41, 36))
}

function DrawBoots {
  param([System.Drawing.Bitmap]$Bmp, [int]$LeftYOffset, [int]$RightYOffset)
  DrawRect $Bmp 4 (27 + $LeftYOffset) 3 4 ([System.Drawing.Color]::FromArgb(74, 52, 37))
  DrawRect $Bmp 9 (27 + $RightYOffset) 3 4 ([System.Drawing.Color]::FromArgb(74, 52, 37))
}

for ($i = 0; $i -lt 4; $i++) {
  $bmp = New-Bitmap -Width 16 -Height 32
  $bob = if (($i % 2) -eq 0) { 0 } else { 1 }
  DrawPlayerBase -Bmp $bmp -BobOffset $bob
  DrawBoots -Bmp $bmp -LeftYOffset 0 -RightYOffset 0
  Save-Png -Bitmap $bmp -Name "player_idle_$i.png"
}

$walkOffsets = @(
  @{ L = 0; R = 2; B = 0 },
  @{ L = 1; R = 1; B = 1 },
  @{ L = 2; R = 0; B = 0 },
  @{ L = 1; R = 1; B = 1 },
  @{ L = 0; R = 2; B = 0 },
  @{ L = 1; R = 1; B = 1 }
)

for ($i = 0; $i -lt $walkOffsets.Count; $i++) {
  $bmp = New-Bitmap -Width 16 -Height 32
  DrawPlayerBase -Bmp $bmp -BobOffset $walkOffsets[$i].B
  DrawBoots -Bmp $bmp -LeftYOffset $walkOffsets[$i].L -RightYOffset $walkOffsets[$i].R
  Save-Png -Bitmap $bmp -Name "player_walk_$i.png"
}

Write-Host "Player animation frames generated in $OutputDir"
