# SpellForger — README de Migração e Observações

## Descrição geral do projeto e da migração
SpellForger é o frontend de uma aplicação de feitiços construída com Next.js (App Router). A migração partiu de um SPA React para o App Router do Next.js, adotando Server Components para partes pré-renderizadas e Client Components para interatividade. Principais mudanças:
- Integração do layout e Providers globais (autenticação, toasts, query client).
- Fetch de dados no servidor (SSG/SSR/ISR) onde faz sentido para SEO e performance.
- Componentes de formulário e interação mantidos como Client Components para responsividade.
Arquivos-chave: `src/app/layout.tsx`, `src/app/providers.tsx`, `src/contexts/AuthContext.tsx`, `src/services/api.ts`.

## Lista de páginas — tipo de renderização + justificativas
- / (Home)  
  - Arquivo: `src/app/page.tsx`  
  - Tipo: Static (SSG / forced static)  
  - Justificativa: Conteúdo majoritariamente estático; prioridade em SEO e tempo de primeira renderização.

- /spells (lista de feitiços)  
  - Arquivo: `src/app/spells/page.tsx` ou rota equivalente em `src/app/`  
  - Tipo: Server Component com ISR (revalidate)  
  - Justificativa: Lista pública que beneficia de render no servidor para SEO e cache controlado com revalidação.

- /login  
  - Arquivo: `src/views/Login.tsx`  
  - Tipo: Client Component (CSR)  
  - Justificativa: Formulário, validação e fluxos de autenticação exigem estado e interação imediata.

- /register  
  - Arquivo: `src/views/Register.tsx`  
  - Tipo: Client Component (CSR)  
  - Justificativa: Similar ao login — UX interativa e validação cliente.

- /submit  
  - Arquivo: `src/views/Submit.tsx`  
  - Tipo: Client Component (CSR)  
  - Justificativa: Envio de conteúdo pelo utilizador, preview, validações e toasts.

- 404 / NotFound  
  - Arquivo: `src/views/NotFound.tsx`  
  - Tipo: Client Component / Static  
  - Justificativa: Conteúdo simples; pode ser estática ou cliente conforme necessidade de UI dinâmica.

- Componentes interativos (SpellCard, SpellDetailModal, toasts)  
  - Arquivos: `src/components/SpellCard.tsx`, `src/components/SpellDetailModal.tsx`, `src/components/ui/*`  
  - Tipo: Client Components  
  - Justificativa: Modais, notificações e interações ricas exigem execução no cliente.

### Comparação Lighthouse (antes / depois) — tela HOME  (SSG)

| Métrica | Antes (SPA) | Depois (Next.js) | Comentário curto |
|---|---:|---:|---|
| LCP (s) | 0.5 | 0.7 | Leve aumento (overhead de hidratação), mas ainda excelente. |
| TBT (ms) | 0 | 20 | Custo mínimo de execução JS no lado do cliente (Hydration). |
| CLS | 0 | 0 | Estabilidade visual mantida perfeita. |
| Performance | 100 | 100 | Pontuação máxima mantida na migração. |
| SEO | 100 | 63 | Configuração do Vercel resulta em diminuição do valor, por padrão. |

---

### Comparação Lighthouse (antes / depois) — tela SPELLS (ISR)

| Métrica | Antes (SPA) | Depois (Next.js) | Comentário curto |
|---|---:|---:|---|
| LCP (s) | 1.3 | 0.7 | Melhoria: HTML pré-renderizado acelerou a exibição inicial. |
| TBT (ms) | 0 | 30 | Leve bloqueio causado pela hidratação dos componentes. |
| CLS | 0.097 | 0 | Layout Shifts eliminados (imagens/fontes otimizadas). |
| Performance | 94 | 100 | Otimização geral resultou em score perfeito. |
| SEO | 100 | 63 | Configuração do Vercel resulta em diminuição do valor, por padrão. |

---

### Análise resumida
- Performance geral: Spells beneficiou-se muito do SSR/SSG (LCP reduzido); Home manteve-se estável.  
- TBT: valores pequenos (20–30 ms) são esperados no Next.js devido à hidratação.  

Como obter as métricas:
- Chrome DevTools → Lighthouse → gerar relatório.
- Ou usar Lighthouse CLI em ambiente de build/servidor.

## Reflexão curta: frontend desacoplado
- Separação de responsabilidades: AuthContext e `src/services/api.ts` isolam lógica de autenticação e chamadas ao backend, permitindo trocar ou versionar a API sem alterar componentes de UI.
- Híbrido server/client: partes que exigem SEO/performance são pré-renderizadas no servidor; interações ricas ficam no cliente — cada camada cumpre seu papel.
- Reutilização e testes: componentes UI agnósticos (em `src/components/ui`) podem ser usados em diferentes rotas e testados isoladamente.
- Resultado: arquitetura mais modular, fácil de manter, e preparada para escalar tanto em complexidade de UI quanto em evoluções do backend.

## Como executar localmente (desenvolvimento)
No Windows (na raiz do projeto):
```powershell
# instalar dependências
npm install

# rodar em modo desenvolvimento
npm run dev

# abrir no browser
http://localhost:3000
```
