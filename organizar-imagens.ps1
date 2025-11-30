# Script para mover imagens para a pasta images
Write-Host "Organizando imagens..." -ForegroundColor Green

# Lista de imagens na raiz
$imagensRaiz = @(
    "7d9a32_16acb458dc6d4521a7d70faa34d330d9~mv2.jpg",
    "7d9a32_600d0def76834ec890588f16e061b676~mv2.jpg",
    "7d9a32_bd370f82bf1544cca98b74fad698dc8d~mv2.jpg"
)

# Mover para pasta temporária com nomes mais fáceis
$i = 1
foreach ($img in $imagensRaiz) {
    if (Test-Path $img) {
        $novoNome = "imagem-$i.jpg"
        Move-Item -Path $img -Destination "images\$novoNome" -Force -ErrorAction SilentlyContinue
        Write-Host "Movi: $img -> images\$novoNome" -ForegroundColor Yellow
        $i++
    }
}

Write-Host "`nImagens movidas para a pasta images!" -ForegroundColor Green
Write-Host "Agora você precisa me dizer qual imagem é qual para eu renomear corretamente." -ForegroundColor Cyan

