# Como Acessar o Site Corretamente

## ⚠️ Importante

Após a reorganização MVC, os arquivos HTML estão organizados em pastas. Para acessar o site corretamente:

### ✅ Forma Correta

1. **Sempre comece pelo `index.html` na raiz do projeto:**
   ```
   http://127.0.0.1:5500/index.html
   ```
   ou simplesmente:
   ```
   http://127.0.0.1:5500/
   ```

2. **Navegue pelo site usando os links do menu** - todos os links já estão configurados corretamente!

### ❌ Forma Incorreta

**NÃO** tente acessar diretamente:
```
❌ http://127.0.0.1:5500/grupos.html
❌ http://127.0.0.1:5500/membros.html
```

Use sempre:
```
✅ http://127.0.0.1:5500/pages/grupos.html
✅ http://127.0.0.1:5500/pages/membros.html
```

## 🔧 Solução Rápida

Se você está vendo erro 404:

1. Pare o servidor (Live Server)
2. Certifique-se de que está servindo a partir da **raiz** do projeto (`C:\PROJETOS\ZooMonitorPE`)
3. Reinicie o servidor
4. Acesse: `http://127.0.0.1:5500/index.html` ou `http://127.0.0.1:5500/`

## 📁 Estrutura de Arquivos

```
ZooMonitorPE/
├── index.html          ← Acesse por aqui!
├── pages/
│   ├── grupos.html
│   ├── membros.html
│   └── ...
└── ...
```

## 💡 Dica

Se você clicar com o botão direito no `index.html` no VS Code e selecionar "Open with Live Server", ele abrirá corretamente na raiz e todos os links funcionarão!

