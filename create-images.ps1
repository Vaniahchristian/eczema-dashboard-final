Add-Type -AssemblyName System.Drawing

function Create-SolidColorImage {
    param(
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with a light blue color
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 100, 149, 237))
    $graphics.FillRectangle($brush, 0, 0, $Width, $Height)
    
    # Save the image
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
}

# Create icons
Create-SolidColorImage -OutputPath "public\icons\icon-192x192.png" -Width 192 -Height 192
Create-SolidColorImage -OutputPath "public\icons\icon-512x512.png" -Width 512 -Height 512

# Create screenshots
Create-SolidColorImage -OutputPath "public\screenshots\desktop.png" -Width 1920 -Height 1080
Create-SolidColorImage -OutputPath "public\screenshots\mobile.png" -Width 750 -Height 1334

Write-Host "Created all images with correct dimensions"
