/**
 * Page Mock Data — HTML content for Page-type documents
 *
 * ToB: 华中区-星巴克加盟商订货看板 (Stripe design system)
 * ToC: 财富视图 (Revolut design system)
 */

// ─── ToB: Client Portal Page HTML (Stripe-inspired) ───────────────────────
export const tobClientPortalHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>华中区-星巴克加盟商订货看板</title>
<style>
  /* ── Stripe Design System Tokens ── */
  :root {
    --stripe-purple: #533afd;
    --stripe-purple-hover: #4434d4;
    --stripe-navy: #061b31;
    --stripe-body: #64748d;
    --stripe-label: #273951;
    --stripe-white: #ffffff;
    --stripe-border: #e5edf5;
    --stripe-brand-dark: #1c1e54;
    --stripe-success: #15be53;
    --stripe-success-text: #108c3d;
    --stripe-ruby: #ea2261;
    --stripe-shadow-blue: rgba(50,50,93,0.25);
    --stripe-shadow-black: rgba(0,0,0,0.1);
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
    background: #f6f9fc;
    color: var(--stripe-navy);
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Top Navigation ── */
  .nav {
    background: var(--stripe-brand-dark);
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .nav-brand .logo {
    width: 32px; height: 32px;
    background: var(--stripe-purple);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 600; font-size: 14px;
  }
  .nav-brand h1 {
    color: var(--stripe-white);
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.16px;
  }
  .nav-brand h1 span { opacity: 0.5; margin: 0 8px; }
  .nav-meta {
    display: flex; align-items: center; gap: 16px;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
  }
  .nav-meta .live-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(21,190,83,0.15);
    color: var(--stripe-success);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 400;
    border: 1px solid rgba(21,190,83,0.3);
  }
  .nav-meta .live-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--stripe-success);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ── Container ── */
  .container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  /* ── Dealer Info Bar ── */
  .dealer-bar {
    background: var(--stripe-white);
    border: 1px solid var(--stripe-border);
    border-radius: var(--radius-md);
    padding: 20px 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--stripe-shadow-blue) 0px 30px 45px -30px, var(--stripe-shadow-black) 0px 18px 36px -18px;
  }
  .dealer-info { display: flex; align-items: center; gap: 16px; }
  .dealer-avatar {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, var(--stripe-purple), var(--stripe-ruby));
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 18px; font-weight: 500;
  }
  .dealer-name { font-size: 16px; font-weight: 400; color: var(--stripe-navy); }
  .dealer-detail { font-size: 13px; color: var(--stripe-body); margin-top: 2px; }
  .dealer-tags { display: flex; gap: 8px; }
  .tag {
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 400;
  }
  .tag-s { background: rgba(106,27,154,0.1); color: #6A1B9A; border: 1px solid rgba(106,27,154,0.2); }
  .tag-discount { background: rgba(83,58,253,0.08); color: var(--stripe-purple); border: 1px solid rgba(83,58,253,0.15); }

  /* ── Section ── */
  .section { margin-bottom: 24px; }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .section-title {
    font-size: 22px;
    font-weight: 300;
    letter-spacing: -0.22px;
    color: var(--stripe-navy);
  }
  .section-subtitle {
    font-size: 13px;
    color: var(--stripe-body);
    display: flex; align-items: center; gap: 6px;
  }
  .section-subtitle .db-tag {
    background: rgba(83,58,253,0.08);
    color: var(--stripe-purple);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-family: 'SF Mono', 'SFMono-Regular', monospace;
  }

  /* ── Table ── */
  .card {
    background: var(--stripe-white);
    border: 1px solid var(--stripe-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: rgba(23,23,23,0.08) 0px 15px 35px 0px;
  }
  table { width: 100%; border-collapse: collapse; }
  thead { background: #f8fafc; }
  th {
    padding: 10px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 400;
    color: var(--stripe-body);
    border-bottom: 1px solid var(--stripe-border);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  td {
    padding: 14px 16px;
    font-size: 14px;
    color: var(--stripe-navy);
    border-bottom: 1px solid var(--stripe-border);
  }
  tr:last-child td { border-bottom: none; }
  tr:hover { background: rgba(83,58,253,0.02); }
  .sku-code { font-family: 'SF Mono', 'SFMono-Regular', monospace; font-size: 12px; color: var(--stripe-body); }
  .price { font-variant-numeric: tabular-nums; }
  .price-original { text-decoration: line-through; color: #c0c8d2; font-size: 12px; margin-right: 6px; }
  .price-discount { color: var(--stripe-purple); font-weight: 400; }
  .stock-ok { color: var(--stripe-success-text); }
  .stock-low { color: var(--stripe-ruby); font-weight: 400; }
  .sync-indicator {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; color: var(--stripe-success-text);
    background: rgba(21,190,83,0.1);
    padding: 2px 6px;
    border-radius: 2px;
  }
  .sync-indicator::before {
    content: '';
    width: 4px; height: 4px;
    background: var(--stripe-success);
    border-radius: 50%;
  }

  /* ── Order Tracking ── */
  .order-row { display: flex; align-items: center; gap: 16px; padding: 16px; border-bottom: 1px solid var(--stripe-border); }
  .order-row:last-child { border-bottom: none; }
  .order-id { font-family: 'SF Mono', 'SFMono-Regular', monospace; font-size: 13px; color: var(--stripe-label); min-width: 170px; }
  .order-detail { flex: 1; }
  .order-product { font-size: 14px; color: var(--stripe-navy); }
  .order-qty { font-size: 12px; color: var(--stripe-body); margin-top: 2px; }
  .order-status {
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 400;
    min-width: 72px;
    text-align: center;
  }
  .status-pending { background: rgba(230,81,0,0.1); color: #E65100; border: 1px solid rgba(230,81,0,0.2); }
  .status-production { background: rgba(40,53,147,0.1); color: #283593; border: 1px solid rgba(40,53,147,0.2); }
  .status-shipped { background: rgba(46,125,50,0.1); color: #2E7D32; border: 1px solid rgba(46,125,50,0.2); }
  .status-received { background: rgba(51,105,30,0.1); color: #33691E; border: 1px solid rgba(51,105,30,0.2); }
  .order-date { font-size: 12px; color: var(--stripe-body); min-width: 100px; text-align: right; }

  /* ── CTA Button ── */
  .cta-section {
    background: var(--stripe-white);
    border: 1px solid var(--stripe-border);
    border-radius: var(--radius-md);
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: rgba(23,23,23,0.06) 0px 3px 6px;
  }
  .cta-text h3 {
    font-size: 16px;
    font-weight: 400;
    color: var(--stripe-navy);
    margin-bottom: 4px;
  }
  .cta-text p { font-size: 13px; color: var(--stripe-body); }
  .btn-restock {
    background: var(--stripe-purple);
    color: var(--stripe-white);
    border: none;
    padding: 10px 24px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .btn-restock:hover { background: var(--stripe-purple-hover); }

  /* ── Footer ── */
  .footer {
    text-align: center;
    padding: 32px 0 16px;
    font-size: 12px;
    color: var(--stripe-body);
  }
  .footer a { color: var(--stripe-purple); text-decoration: none; }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--stripe-brand-dark);
    color: var(--stripe-white);
    padding: 12px 24px;
    border-radius: var(--radius-md);
    font-size: 14px;
    box-shadow: var(--stripe-shadow-blue) 0px 30px 45px -30px;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 999;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .nav { padding: 12px 16px; }
    .nav-brand h1 { font-size: 14px; }
    .container { padding: 16px 12px; }
    .dealer-bar { flex-direction: column; gap: 12px; align-items: flex-start; }
    table { font-size: 13px; }
    th, td { padding: 10px 12px; }
    .order-row { flex-wrap: wrap; gap: 8px; }
    .order-date { text-align: left; }
    .cta-section { flex-direction: column; gap: 16px; text-align: center; }
  }
</style>
</head>
<body>

<!-- ── Navigation ── -->
<nav class="nav">
  <div class="nav-brand">
    <div class="logo">M</div>
    <h1>MindX<span>×</span>星巴克华中区</h1>
  </div>
  <div class="nav-meta">
    <div class="live-badge">Live · 实时同步</div>
    <span>经销商专属门户</span>
  </div>
</nav>

<!-- ── Main Content ── -->
<div class="container">

  <!-- Dealer Info -->
  <div class="dealer-bar">
    <div class="dealer-info">
      <div class="dealer-avatar">王</div>
      <div>
        <div class="dealer-name">华中区-星巴克加盟商-老王</div>
        <div class="dealer-detail">账期：月结 30 天 · 合作始于 2024 年</div>
      </div>
    </div>
    <div class="dealer-tags">
      <span class="tag tag-s">S 级客户</span>
      <span class="tag tag-discount">专属折扣 9 折</span>
    </div>
  </div>

  <!-- ── Live Catalog ── -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">动态商品视图 · Live Catalog</h2>
      <div class="section-subtitle">
        <span class="db-tag">sheet-inventory</span>
        <span class="db-tag">sheet-crm</span>
        <span class="sync-indicator">实时同步</span>
      </div>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>品名</th>
            <th>SKU</th>
            <th>规格</th>
            <th>可用库存</th>
            <th>专属指导价</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>经典款陶瓷马克杯</td>
            <td><span class="sku-code">SKU-2026-MUG-01</span></td>
            <td>350ml / 白瓷</td>
            <td><span class="stock-low">200 只</span> <span class="sync-indicator">Live</span></td>
            <td class="price"><span class="price-original">¥15.00</span><span class="price-discount">¥13.50</span></td>
          </tr>
          <tr>
            <td>简约白瓷餐盘</td>
            <td><span class="sku-code">SKU-2026-PLT-01</span></td>
            <td>10寸 / 纯白</td>
            <td><span class="stock-ok">800 只</span> <span class="sync-indicator">Live</span></td>
            <td class="price"><span class="price-original">¥22.00</span><span class="price-discount">¥19.80</span></td>
          </tr>
          <tr>
            <td>双层隔热玻璃杯</td>
            <td><span class="sku-code">SKU-2026-CUP-01</span></td>
            <td>300ml / 高硼硅</td>
            <td><span class="stock-ok">450 只</span> <span class="sync-indicator">Live</span></td>
            <td class="price"><span class="price-original">¥45.00</span><span class="price-discount">¥40.50</span></td>
          </tr>
          <tr>
            <td>手冲咖啡壶套装</td>
            <td><span class="sku-code">SKU-2026-KTL-01</span></td>
            <td>600ml / 含滤杯</td>
            <td><span class="stock-ok">150 套</span> <span class="sync-indicator">Live</span></td>
            <td class="price"><span class="price-original">¥68.00</span><span class="price-discount">¥61.20</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Order Tracking ── -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">履约进度视图 · Order Tracking</h2>
      <div class="section-subtitle">
        <span class="db-tag">sheet-orders</span>
        <span class="sync-indicator">实时同步</span>
      </div>
    </div>
    <div class="card">
      <div class="order-row">
        <span class="order-id">ORD-20260408-001</span>
        <div class="order-detail">
          <div class="order-product">经典款陶瓷马克杯</div>
          <div class="order-qty">需求 500 只 · 下单 2026-04-08</div>
        </div>
        <span class="order-status status-pending">待审核</span>
        <span class="order-date">截止 04-10</span>
      </div>
      <div class="order-row">
        <span class="order-id">ORD-20260403-002</span>
        <div class="order-detail">
          <div class="order-product">简约白瓷餐盘</div>
          <div class="order-qty">需求 150 只 · 下单 2026-04-03</div>
        </div>
        <span class="order-status status-received">已签收</span>
        <span class="order-date">截止 04-06</span>
      </div>
    </div>
  </div>

  <!-- ── Restock CTA ── -->
  <div class="cta-section">
    <div class="cta-text">
      <h3>需要补货？一键提交补货请求</h3>
      <p>点击后将在 Order_DB 中自动生成待审核订单记录，内部团队将即时收到通知</p>
    </div>
    <button class="btn-restock" onclick="handleRestock()">⚡ 一键补货</button>
  </div>

  <!-- Footer -->
  <div class="footer">
    Powered by <a href="#">MindX</a> · 数据来源：Smart Sheet · CRDT 实时同步协议
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
function handleRestock() {
  showToast('✅ 补货请求已提交，订单将在 Order_DB 中生成待审核记录');
}
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}
</script>
</body>
</html>`;

// ─── ToC: Wealth Dashboard Page HTML (Revolut-inspired) ───────────────────
export const tocWealthDashboardHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>财富视图</title>
<style>
  /* ── Revolut Design System Tokens ── */
  :root {
    --rev-dark: #191c1f;
    --rev-white: #ffffff;
    --rev-surface: #f4f4f4;
    --rev-blue: #494fdf;
    --rev-teal: #00a87e;
    --rev-danger: #e23b4a;
    --rev-warning: #ec7e00;
    --rev-mid-slate: #505a63;
    --rev-cool-gray: #8d969e;
    --rev-gray-tone: #c9c9cd;
    --rev-pink: #e61e49;
    /* Pie chart colors */
    --pie-equity: #494fdf;
    --pie-crypto: #ec7e00;
    --pie-cash: #00a87e;
    --pie-fund: #e61e49;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--rev-dark);
    color: var(--rev-white);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  /* ── Header ── */
  .header {
    padding: 24px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .avatar {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, var(--rev-blue), var(--rev-pink));
    border-radius: 9999px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 500; color: white;
  }
  .header-title {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.2px;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sync-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(0,168,126,0.12);
    color: var(--rev-teal);
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.16px;
  }
  .sync-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--rev-teal);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .last-update {
    font-size: 12px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.16px;
  }

  /* ── Container ── */
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
  }

  /* ── NAV Hero ── */
  .nav-hero {
    text-align: center;
    padding: 32px 0 8px;
  }
  .nav-label {
    font-size: 13px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.24px;
    margin-bottom: 8px;
    text-transform: uppercase;
  }
  .nav-value {
    font-size: 48px;
    font-weight: 500;
    letter-spacing: -0.96px;
    line-height: 1.0;
    margin-bottom: 6px;
  }
  .nav-change {
    font-size: 14px;
    color: var(--rev-teal);
    letter-spacing: 0.16px;
  }

  /* ── Pie Chart (SVG) ── */
  .chart-section {
    padding: 24px 0;
  }
  .chart-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
  }
  .pie-container {
    position: relative;
    width: 180px; height: 180px;
  }
  .pie-center {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .pie-center-label {
    font-size: 11px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.16px;
  }
  .pie-center-value {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.18px;
  }
  .legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .legend-dot {
    width: 10px; height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .legend-label {
    font-size: 13px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.16px;
    min-width: 60px;
  }
  .legend-value {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.16px;
    min-width: 80px;
  }
  .legend-pct {
    font-size: 12px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.16px;
  }

  /* ── Section ── */
  .section {
    margin-top: 32px;
  }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .section-title {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.09px;
  }
  .section-badge {
    background: rgba(73,79,223,0.12);
    color: var(--rev-blue);
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 400;
    font-family: 'SF Mono', 'SFMono-Regular', monospace;
    letter-spacing: 0.16px;
  }

  /* ── Subscription Cards ── */
  .sub-card {
    background: rgba(244,244,244,0.06);
    border-radius: 20px;
    padding: 18px 20px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sub-left { display: flex; flex-direction: column; gap: 4px; }
  .sub-name {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.16px;
  }
  .sub-value-tag {
    font-size: 12px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.16px;
  }
  .sub-right { text-align: right; }
  .sub-price {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.16px;
  }
  .sub-date {
    font-size: 12px;
    letter-spacing: 0.16px;
  }
  .sub-date-soon { color: var(--rev-warning); }
  .sub-date-ok { color: var(--rev-cool-gray); }

  /* ── Data Source Tag ── */
  .data-source {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.16px;
  }
  .data-source .db-tag {
    background: rgba(73,79,223,0.1);
    color: var(--rev-blue);
    padding: 2px 8px;
    border-radius: 9999px;
    font-family: 'SF Mono', 'SFMono-Regular', monospace;
    font-size: 10px;
  }

  /* ── Footer ── */
  .footer {
    text-align: center;
    padding: 40px 0 20px;
    font-size: 11px;
    color: var(--rev-cool-gray);
    letter-spacing: 0.16px;
  }

  /* ── Responsive (Widget compact) ── */
  @media (max-width: 480px) {
    .container { padding: 16px; }
    .nav-value { font-size: 36px; letter-spacing: -0.72px; }
    .chart-wrapper { flex-direction: column; gap: 20px; }
    .pie-container { width: 150px; height: 150px; }
    .sub-card { padding: 14px 16px; border-radius: 12px; }
  }
</style>
</head>
<body>

<!-- ── Header ── -->
<div class="header">
  <div class="header-left">
    <div class="avatar">H</div>
    <span class="header-title">财富视图</span>
  </div>
  <div class="header-right">
    <div class="sync-badge">CRDT 实时同步</div>
    <span class="last-update">更新于 刚刚</span>
  </div>
</div>

<!-- ── Main Content ── -->
<div class="container">

  <!-- NAV Hero -->
  <div class="nav-hero">
    <div class="nav-label">Total Net Asset Value</div>
    <div class="nav-value">$599,000</div>
    <div class="nav-change">+$56,200 (+10.4%) 本月</div>
  </div>

  <!-- Pie Chart + Legend -->
  <div class="chart-section">
    <div class="chart-wrapper">
      <!-- SVG Donut Chart -->
      <div class="pie-container">
        <svg viewBox="0 0 36 36" width="180" height="180">
          <!-- Crypto 41.5% -->
          <circle cx="18" cy="18" r="14" fill="none"
            stroke="#ec7e00" stroke-width="4"
            stroke-dasharray="41.5 58.5"
            stroke-dashoffset="25"
            stroke-linecap="round"/>
          <!-- Equity 33.2% -->
          <circle cx="18" cy="18" r="14" fill="none"
            stroke="#494fdf" stroke-width="4"
            stroke-dasharray="33.2 66.8"
            stroke-dashoffset="83.5"
            stroke-linecap="round"/>
          <!-- Cash 16.1% -->
          <circle cx="18" cy="18" r="14" fill="none"
            stroke="#00a87e" stroke-width="4"
            stroke-dasharray="16.1 83.9"
            stroke-dashoffset="50.3"
            stroke-linecap="round"/>
          <!-- Fund 9.2% -->
          <circle cx="18" cy="18" r="14" fill="none"
            stroke="#e61e49" stroke-width="4"
            stroke-dasharray="9.2 90.8"
            stroke-dashoffset="34.2"
            stroke-linecap="round"/>
        </svg>
        <div class="pie-center">
          <div class="pie-center-label">流动资产</div>
          <div class="pie-center-value">$599K</div>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <span class="legend-dot" style="background: var(--pie-crypto)"></span>
          <span class="legend-label">Crypto</span>
          <span class="legend-value">$248,500</span>
          <span class="legend-pct">41.5%</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: var(--pie-equity)"></span>
          <span class="legend-label">Equity</span>
          <span class="legend-value">$198,700</span>
          <span class="legend-pct">33.2%</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: var(--pie-cash)"></span>
          <span class="legend-label">Cash</span>
          <span class="legend-value">$96,500</span>
          <span class="legend-pct">16.1%</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: var(--pie-fund)"></span>
          <span class="legend-label">Fund</span>
          <span class="legend-value">$55,300</span>
          <span class="legend-pct">9.2%</span>
        </div>
      </div>
    </div>
    <div class="data-source">
      数据绑定 <span class="db-tag">toc-sheet-asset-nav</span> 全球资产配置总表
    </div>
  </div>

  <!-- ── Renewal Reminders ── -->
  <div class="section">
    <div class="section-header">
      <span class="section-title">下周续费提醒</span>
      <span class="section-badge">toc-sheet-alpha-sub</span>
    </div>

    <div class="sub-card">
      <div class="sub-left">
        <span class="sub-name">The Block Research</span>
        <span class="sub-value-tag">DeFi 协议分析 / 融资动态 / 监管追踪</span>
      </div>
      <div class="sub-right">
        <div class="sub-price">$29/月</div>
        <div class="sub-date sub-date-soon">4月15日到期</div>
      </div>
    </div>

    <div class="sub-card">
      <div class="sub-left">
        <span class="sub-name">Messari Pro</span>
        <span class="sub-value-tag">Crypto 基本面研究 / 链上数据 / 赛道报告</span>
      </div>
      <div class="sub-right">
        <div class="sub-price">$49/月</div>
        <div class="sub-date sub-date-soon">4月12日到期</div>
      </div>
    </div>

    <div class="sub-card" style="opacity: 0.5;">
      <div class="sub-left">
        <span class="sub-name">MacroVoices Premium</span>
        <span class="sub-value-tag">全球宏观策略 / 利率周期 / 大宗商品</span>
      </div>
      <div class="sub-right">
        <div class="sub-price">$199/季</div>
        <div class="sub-date sub-date-ok">7月1日到期</div>
      </div>
    </div>

    <div class="data-source">
      数据绑定 <span class="db-tag">toc-sheet-alpha-sub</span> 高价值信息订阅账簿 · 筛选未来 7 天内到期
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    Powered by MindX · 数据来源：Smart Sheet · CRDT 实时同步协议
  </div>
</div>

</body>
</html>`;
