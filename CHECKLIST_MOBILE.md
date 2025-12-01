# 📱 Checklist de Responsividade Mobile

## ✅ Sempre verificar ao fazer atualizações:

### 1. **Área de Toque**
- [ ] Botões têm mínimo de 44x44px
- [ ] Links têm área de toque adequada
- [ ] Espaçamento entre elementos clicáveis suficiente

### 2. **Eventos Touch**
- [ ] Eventos `touchend` implementados além de `click`
- [ ] `-webkit-tap-highlight-color: transparent` nos botões
- [ ] `touch-action: manipulation` para melhor performance

### 3. **Menu de Acessibilidade**
- [ ] Abre/fecha com toque
- [ ] Botões de tamanho de fonte funcionam
- [ ] Toggle de tema funciona
- [ ] Menu posicionado corretamente (não cortado)
- [ ] Z-index alto o suficiente (10000+)

### 4. **Layout e Visual**
- [ ] Texto legível (tamanho mínimo 14px)
- [ ] Imagens responsivas
- [ ] Sem scroll horizontal indesejado
- [ ] Padding/margin adequados

### 5. **Formulários**
- [ ] Inputs têm tamanho adequado para toque
- [ ] Labels clicáveis
- [ ] Botões de submit funcionam
- [ ] Validação visível

### 6. **Navegação**
- [ ] Menu hamburger funciona (se houver)
- [ ] Links do header funcionam
- [ ] Dropdowns abrem/fecham corretamente

### 7. **Modais/Popups**
- [ ] Abrem/fecham com toque
- [ ] Botão de fechar visível e clicável
- [ ] Não cortados nas bordas
- [ ] Fecham ao tocar fora

### 8. **Performance**
- [ ] Carregamento rápido
- [ ] Animações suaves
- [ ] Sem travamentos

---

## 🧪 Testar em:
- [ ] Chrome Mobile (DevTools)
- [ ] Safari iOS (se possível)
- [ ] Dispositivo real (recomendado)

---

## 📝 Notas:
- Sempre adicionar `touch-action: manipulation` em elementos interativos
- Usar `min-height: 44px` ou `48px` para botões
- Testar em diferentes tamanhos de tela (320px, 375px, 414px, 768px)

