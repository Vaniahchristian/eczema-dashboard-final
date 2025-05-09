Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )
    
    $img = [System.Drawing.Image]::FromFile($InputPath)
    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, $Width, $Height)
    $bitmap.Save($OutputPath, $img.RawFormat)
    $graphics.Dispose()
    $bitmap.Dispose()
    $img.Dispose()
}

$sourcePath = "public\icons\logo.png"
$sizes = @(
    @{width=192; height=192},
    @{width=512; height=512}
)

foreach ($size in $sizes) {
    $outputPath = "public\icons\icon-$($size.width)x$($size.height).png"
    Resize-Image -InputPath $sourcePath -OutputPath $outputPath -Width $size.width -Height $size.height
    Write-Host "Created $outputPath"
}
