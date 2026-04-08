<!--
  REGO / SIZE SEARCH WIDGET
  =========================
  BRICKS BUILDER 2.3 — HOW TO USE
  --------------------------------
  Option A (recommended — Bricks 2.3 HTML paste):
    1. Copy ALL of the HTML below (Ctrl+A, Ctrl+C)
    2. Open your Home page in Bricks Builder
    3. Click on the hero section's right column
    4. Press Ctrl+V — Bricks 2.3 auto-detects HTML in your
       clipboard and converts it to native Bricks elements,
       classes, and CSS variables
    5. Review the generated elements; the <script> block will
       land in a "Code" element — leave it as-is

  Option B (manual):
    1. Add a "Code" element to the hero's right column in Bricks
    2. Paste the HTML+JS below into the Code element's HTML field

  How it works:
  - "Search by Rego" tab: user enters their NZ plate, redirects to
    /shop/?rego=ABC123  (can be intercepted by a fitment plugin later)
  - "Search by Size" tab: 3 dropdowns (width / profile / rim),
    redirects to /shop/?tyre_size=205-55-R16

  No PHP needed — pure HTML + inline JS.
-->

<div class="nm-search-widget">

  <!-- Tab switcher -->
  <div class="nm-tabs">
    <button class="nm-tab-btn active" onclick="nmSwitchTab('rego', this)">Search by Rego</button>
    <button class="nm-tab-btn" onclick="nmSwitchTab('size', this)">Search by Size</button>
  </div>

  <!-- Rego tab -->
  <div id="nm-tab-rego">
    <input
      type="text"
      id="nm-rego-input"
      placeholder="Enter plate e.g. ABC123"
      style="text-transform:uppercase"
      maxlength="7"
      onkeydown="if(event.key==='Enter') nmRegoSearch()"
    >
    <p style="font-size:12px;color:#6B7280;margin:8px 0 0">
      We'll find compatible tyres &amp; wheels for your vehicle.
    </p>
    <button class="nm-search-btn" onclick="nmRegoSearch()">
      Find Tyres for My Car
    </button>
  </div>

  <!-- Size tab -->
  <div id="nm-tab-size" style="display:none">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">

      <select id="nm-width">
        <option value="">Width</option>
        <option>155</option><option>165</option><option>175</option>
        <option>185</option><option>195</option><option>205</option>
        <option>215</option><option>225</option><option>235</option>
        <option>245</option><option>255</option><option>265</option>
        <option>275</option><option>285</option><option>295</option>
        <option>305</option>
      </select>

      <select id="nm-profile">
        <option value="">Profile</option>
        <option>25</option><option>30</option><option>35</option>
        <option>40</option><option>45</option><option>50</option>
        <option>55</option><option>60</option><option>65</option>
        <option>70</option><option>75</option><option>80</option>
      </select>

      <select id="nm-rim">
        <option value="">Rim (R)</option>
        <option>13</option><option>14</option><option>15</option>
        <option>16</option><option>17</option><option>18</option>
        <option>19</option><option>20</option><option>21</option>
        <option>22</option><option>23</option>
      </select>

    </div>
    <button class="nm-search-btn" onclick="nmSizeSearch()">
      Search Tyres by Size
    </button>
  </div>

</div>

<script>
// Shop page URL — update if your WooCommerce shop lives at a different path
const NM_SHOP_URL = '/shop/';

function nmSwitchTab(tab, btn) {
  document.querySelectorAll('.nm-tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  document.getElementById('nm-tab-rego').style.display = (tab === 'rego') ? 'block' : 'none';
  document.getElementById('nm-tab-size').style.display = (tab === 'size') ? 'block' : 'none';
}

function nmRegoSearch() {
  var rego = document.getElementById('nm-rego-input').value.trim().toUpperCase();
  if (!rego) {
    alert('Please enter your registration plate number.');
    return;
  }
  window.location.href = NM_SHOP_URL + '?rego=' + encodeURIComponent(rego);
}

function nmSizeSearch() {
  var w = document.getElementById('nm-width').value;
  var p = document.getElementById('nm-profile').value;
  var r = document.getElementById('nm-rim').value;
  if (!w || !p || !r) {
    alert('Please select tyre width, profile, and rim size.');
    return;
  }
  window.location.href = NM_SHOP_URL + '?tyre_size=' + w + '-' + p + '-R' + r;
}
</script>
