Add-Type -AssemblyName System.Drawing

function Create-PlaceholderImage {
    param(
        [string]$OutputPath,
        [int]$Width,
        [int]$Height,
        [string]$Text
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill background
    $graphics.FillRectangle(
        [System.Drawing.Brushes]::White,
        0, 0, $Width, $Height
    )
    
    # Add text
    $font = New-Object System.Drawing.Font("Arial", [math]::Min($Width, $Height) / 10)
    $brush = [System.Drawing.Brushes]::Black
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $graphics.DrawString(
        $Text,
        $font,
        $brush,
        [System.Drawing.RectangleF]::new(0, 0, $Width, $Height),
        $format
    )
    
    # Save the image
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Create icons
Create-PlaceholderImage -OutputPath "public\icons\icon-192x192.png" -Width 192 -Height 192 -Text "EczemaAI"
Create-PlaceholderImage -OutputPath "public\icons\icon-512x512.png" -Width 512 -Height 512 -Text "EczemaAI"

# Create screenshots
Create-PlaceholderImage -OutputPath "public\screenshots\desktop.png" -Width 1920 -Height 1080 -Text "EczemaAI Desktop View"
Create-PlaceholderImage -OutputPath "public\screenshots\mobile.png" -Width 750 -Height 1334 -Text "EczemaAI Mobile View"

Write-Host "Created all placeholder images"
