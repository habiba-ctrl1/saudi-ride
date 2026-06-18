Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\786\Documents\WEBSITES\project\taxidriver\public\logo.png'
$outPath = 'C:\Users\786\Documents\WEBSITES\project\taxidriver\public\logo-transparent.png'
$img = [System.Drawing.Image]::FromFile($imgPath)
$bmp = New-Object System.Drawing.Bitmap($img)
$img.Dispose()
$bmp.MakeTransparent([System.Drawing.Color]::White)
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
