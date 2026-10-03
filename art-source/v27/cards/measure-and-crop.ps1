param([Parameter(Mandatory=$true)][string]$SourcePath,[Parameter(Mandatory=$true)][string]$Hero,[Parameter(Mandatory=$true)][string]$RegionsPath,[string]$OpeningsPath)
$ErrorActionPreference = 'Stop'
# Extract complete pieces without resizing, recolouring or modifying source alpha.
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Drawing;
public static class CardAlphaScan {
 public static int[] Opening(Bitmap image, Rectangle box, int seedX, int seedY, bool dark) {
  int[] queue=new int[image.Width*image.Height];bool[] seen=new bool[queue.Length];int head=0,tail=0;
  queue[tail++]=seedY*image.Width+seedX;seen[queue[0]]=true;
  int minX=box.Right,minY=box.Bottom,maxX=box.X-1,maxY=box.Y-1,count=0;
  while(head<tail){int index=queue[head++],x=index%image.Width,y=index/image.Width;Color color=image.GetPixel(x,y);
   bool inside=dark ? color.A>230&&color.R<45&&color.G<65&&color.B<85 : color.A<9;
   if(!inside)continue;count++;minX=Math.Min(minX,x);minY=Math.Min(minY,y);maxX=Math.Max(maxX,x);maxY=Math.Max(maxY,y);
   int[] offsets={-1,1,-image.Width,image.Width};foreach(int offset in offsets){int n=index+offset,nx=n%image.Width,ny=n/image.Width;
    if(nx<box.X||nx>=box.Right||ny<box.Y||ny>=box.Bottom||Math.Abs(nx-x)+Math.Abs(ny-y)!=1||seen[n])continue;seen[n]=true;queue[tail++]=n;
   }
  }return new int[]{minX,minY,maxX+1,maxY+1,count};
 }
 public static int[] Scan(Bitmap image, Rectangle box) {
  int minX=box.Right,minY=box.Bottom,maxX=box.X-1,maxY=box.Y-1,zero=0,minimum=255,maximum=0,edge=0;
  for(int y=box.Y;y<box.Bottom;y++) for(int x=box.X;x<box.Right;x++) {
   int a=image.GetPixel(x,y).A; minimum=Math.Min(minimum,a);maximum=Math.Max(maximum,a);if(a==0)zero++;
   if(a>20){minX=Math.Min(minX,x);minY=Math.Min(minY,y);maxX=Math.Max(maxX,x);maxY=Math.Max(maxY,y);if(x==box.X||y==box.Y||x==box.Right-1||y==box.Bottom-1)edge++;}
  }
  return new int[]{minX,minY,maxX+1,maxY+1,zero,minimum,maximum,edge};
 }
}
'@ -ReferencedAssemblies @([System.Drawing.Bitmap].Assembly.Location,[System.Drawing.Rectangle].Assembly.Location)
$projectRoot = (Resolve-Path -LiteralPath "$PSScriptRoot/../../..").Path
if($projectRoot -ne 'C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo'){throw 'Unexpected project root'}
$sourceDir = Join-Path $PSScriptRoot $Hero
$runtimeDir = Join-Path $projectRoot "public/assets/v27/cards/$Hero"
New-Item -ItemType Directory -Force -Path $sourceDir,$runtimeDir | Out-Null
$atlasPath=Join-Path $sourceDir 'selected-atlas.png'
if((Resolve-Path -LiteralPath $SourcePath).Path -ne $atlasPath){Copy-Item -LiteralPath $SourcePath -Destination $atlasPath}
$bitmap=[System.Drawing.Bitmap]::new($atlasPath)
$regions=Get-Content -LiteralPath $RegionsPath -Raw | ConvertFrom-Json
$openings=if($OpeningsPath){Get-Content -LiteralPath $OpeningsPath -Raw | ConvertFrom-Json}else{$null}
$measurements=@{}
foreach($property in $regions.psobject.Properties){
 $region=$property.Value
 $rect=[System.Drawing.Rectangle]::new($region[0],$region[1],$region[2]-$region[0],$region[3]-$region[1])
 $scan=[CardAlphaScan]::Scan($bitmap,$rect)
 if($scan[7] -gt 0){throw "Nonempty crop window border: $($property.Name); scan=$($scan -join ',')"}
 $box=[System.Drawing.Rectangle]::FromLTRB([Math]::Max($rect.Left,$scan[0]-8),[Math]::Max($rect.Top,$scan[1]-8),[Math]::Min($rect.Right,$scan[2]+8),[Math]::Min($rect.Bottom,$scan[3]+8))
 $crop=$bitmap.Clone($box,$bitmap.PixelFormat)
 $crop.Save((Join-Path $runtimeDir "$($property.Name).png"),[System.Drawing.Imaging.ImageFormat]::Png)
 $measurements[$property.Name]=@{sourceBox=@($box.X,$box.Y,$box.Right,$box.Bottom);size=@($box.Width,$box.Height);alpha=@($scan[5],$scan[6]);transparentPixels=$scan[4];windowEdgeAbove20=$scan[7]}
 if($openings -and $openings.psobject.Properties[$property.Name]){
  $seed=$openings.psobject.Properties[$property.Name].Value
  $opening=[CardAlphaScan]::Opening($bitmap,$box,$seed[0],$seed[1],($seed[2] -eq 'dark'))
  $measurements[$property.Name].opening=@{x=$opening[0]-$box.X;y=$opening[1]-$box.Y;width=$opening[2]-$opening[0];height=$opening[3]-$opening[1];pixels=$opening[4];centerAlpha=$bitmap.GetPixel($seed[0],$seed[1]).A;mode=$seed[2]}
 }
 $crop.Dispose()
}
$bitmap.Dispose()
$metadata=@{mode='Built-in imagegen';source='selected-atlas.png';sourceSha256=(Get-FileHash -LiteralPath $atlasPath -Algorithm SHA256).Hash;crops=$measurements;operation='Native crop only; no resize or alpha editing'}
$metadata | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $sourceDir 'crops.json') -Encoding utf8
$metadata | ConvertTo-Json -Depth 6
