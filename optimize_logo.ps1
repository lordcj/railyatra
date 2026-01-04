
$sourcePath = "c:\Users\A.B.Joshi\.gemini\antigravity\scratch\rail-travel-app\public\logo.png"
$destPath = "c:\Users\A.B.Joshi\.gemini\antigravity\scratch\rail-travel-app\public\logo_optimized.png"
$targetWidth = 128
$targetHeight = 128

Add-Type -AssemblyName System.Drawing

$image = [System.Drawing.Image]::FromFile($sourcePath)
$resized = new-object System.Drawing.Bitmap($targetWidth, $targetHeight)
$graph = [System.Drawing.Graphics]::FromImage($resized)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.DrawImage($image, 0, 0, $targetWidth, $targetHeight)
$resized.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$image.Dispose()
$resized.Dispose()
$graph.Dispose()

Write-Host "Image resized to 128x128 and saved to $destPath"
