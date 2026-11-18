/* global XLSX */
(() => {
    "use strict";

    const pricingTemplate = () => `<section class="pricing-view" aria-label="Tính giá và lợi nhuận">
<div class="content-wrapper">
<div class="layout-grid">
<!-- BÊN TRÁI: NHẬP CHI PHÍ -->
<div class="card" style="padding-bottom: 10px;">
<div class="section-title"><i class="fa-solid fa-sliders" style="color: var(--primary-red);"></i> Cấu trúc Chi phí &amp; Rủi ro</div>
<div class="form-section">
<h3>1. Chi phí Vận hành &amp; Quảng cáo</h3>
<div class="form-row">
<div class="form-group">
<label class="form-label">Giá vốn nhập hàng (COGS)</label>
<div class="input-with-addon">
<input class="num-format input-field" id="inp-cogs" placeholder="0" type="text"/>
<span class="addon">đ</span>
</div>
</div>
<div class="form-group">
<label class="form-label">Phí đóng gói</label>
<div class="input-with-addon">
<input class="num-format input-field" id="inp-pack" placeholder="0" type="text"/>
<span class="addon">đ</span>
</div>
</div>
</div>
<div class="form-row">
<div class="form-group">
<label class="form-label">Chi phí Ads / 1 Đơn (CPA)</label>
<div class="input-with-addon">
<input class="num-format input-field" id="inp-ads" placeholder="0" type="text"/>
<span class="addon">đ</span>
</div>
</div>
<div class="form-group">
<label class="form-label">Voucher Shop tự trợ giá</label>
<div class="input-with-addon">
<input class="num-format input-field" id="inp-voucher" placeholder="0" type="text"/>
<span class="addon">đ</span>
</div>
</div>
</div>
<!-- RỦI RO HOÀN HÀNG -->
<div class="form-row" style="margin-top: 15px; border-top: 1px dashed var(--border-color); padding-top: 15px;">
<div class="form-group">
<label class="form-label">Tỷ lệ Hoàn/Boom hàng (%)</label>
<div class="input-with-addon">
<input class="input-field" id="inp-return-rate" step="1" type="number" value="5"/>
<span class="addon">%</span>
</div>
</div>
<div class="form-group">
<label class="form-label">Phí ship mất khi Hoàn</label>
<div class="input-with-addon">
<input class="num-format input-field" id="inp-return-fee" type="text" value="25000"/>
<span class="addon">đ</span>
</div>
</div>
</div>
</div>
<div class="form-section">
<h3>2. Tỷ lệ Phí Sàn &amp; Hoa Hồng</h3>
<!-- PRESET SÀN -->
<select class="preset-select input-field" id="sel-platform-preset">
<option value="custom">-- Nhập tay tùy chỉnh phí sàn --</option>
<option value="tts_normal">Tự động điền: TikTok Shop (Shop Thường)</option>
<option value="tts_mall">Tự động điền: TikTok Shop (Mall)</option>
<option value="spe_normal">Tự động điền: Shopee (Shop Thường)</option>
</select>
<div class="form-row">
<div class="form-group">
<label class="form-label">Phí thanh toán sàn</label>
<div class="input-with-addon">
<input class="input-field" id="inp-fee-pay" step="0.1" type="number" value="4"/>
<span class="addon">%</span>
</div>
</div>
<div class="form-group">
<label class="form-label">Phí cố định sàn</label>
<div class="input-with-addon">
<input class="input-field" id="inp-fee-fix" step="0.1" type="number" value="5"/>
<span class="addon">%</span>
</div>
</div>
</div>
<div class="form-row">
<div class="form-group">
<label class="form-label">Phí Xtra (Freeship/Voucher)</label>
<div class="input-with-addon">
<input class="input-field" id="inp-fee-xtra" step="0.1" type="number" value="4.5"/>
<span class="addon">%</span>
</div>
</div>
<div class="form-group">
<label class="form-label">Thuế</label>
<div class="input-with-addon">
<input class="input-field" id="inp-fee-tax" step="0.1" type="number" value="1.5"/>
<span class="addon">%</span>
</div>
</div>
</div>
<div class="form-row">
<div class="form-group">
<label class="form-label">Hoa hồng KOC (CMS)</label>
<div class="input-with-addon">
<input class="input-field" id="inp-fee-aff" step="0.1" type="number" value="10"/>
<span class="addon">%</span>
</div>
</div>
</div>
</div>
</div>
<!-- BÊN PHẢI: KẾT QUẢ TÍNH TOÁN -->
<div>
<div class="card" style="margin-bottom: 20px;">
<div class="calc-tabs">
<div class="tab-btn active" data-mode="profit">1. Nhập Giá Bán ➔ Tính Lãi</div>
<div class="tab-btn" data-mode="price">2. Nhập % Lãi ➔ Tìm Giá Bán</div>
</div>
<div class="result-box">
<div class="target-input-area" id="area-mode-profit">
<label class="form-label" style="font-size: 15px;">Giá Bán Dự Kiến Niêm Yết:</label>
<div class="input-with-addon">
<input class="num-format input-field" id="inp-target-price" type="text" value="200000"/>
<span class="addon">đ</span>
</div>
</div>
<div class="target-input-area" id="area-mode-price" style="display: none;">
<label class="form-label" style="font-size: 15px;">% Lợi Nhuận Mong Muốn:</label>
<div class="input-with-addon">
<input class="input-field" id="inp-target-margin" step="1" type="number" value="25"/>
<span class="addon">%</span>
</div>
</div>
<!-- KẾT QUẢ CHÍNH -->
<div class="main-result">
<span id="txt-main-label">LỢI NHUẬN THỰC NHẬN / ĐƠN</span>
<h1 id="res-main-val">0đ</h1>
<div class="badge-container">
<div class="margin-badge" id="res-badge">Biên lợi nhuận: 0%</div>
<div class="roas-badge" id="res-roas">ROAS: 0.0x</div>
</div>
<div id="res-error" style="color: #E53E3E; font-weight: bold; font-size: 14px; display: none; margin-top: 10px;">Cấu trúc chi phí vượt quá Giá Bán. Không thể tính toán!</div>
</div>
<!-- CHI TIẾT BREAKDOWN -->
<div class="breakdown">
<div class="bd-item">
<span>Giá niêm yết</span>
<span class="val" id="bd-price">0đ</span>
</div>
<div class="bd-item" style="color: #D32F2F;">
<span>- Trừ Voucher Shop</span>
<span class="val" id="bd-voucher">0đ</span>
</div>
<div class="bd-item" style="color: #718096; border-top: 1px dashed var(--border-color); padding-top: 8px;">
<span>- Giá vốn &amp; Đóng gói</span>
<span class="val" id="bd-base-cost">0đ</span>
</div>
<div class="bd-item" style="color: #DD6B20;">
<span>- Khấu hao rủi ro Hoàn hàng (<span id="txt-return-pct">0</span>%)</span>
<span class="val" id="bd-return-loss">0đ</span>
</div>
<div class="bd-item" style="color: #718096;">
<span>- Chi phí Ads (CPA)</span>
<span class="val" id="bd-ads">0đ</span>
</div>
<div class="bd-item" style="color: #E53E3E;">
<span>- Tổng phí Sàn &amp; Thuế (<span id="txt-total-plat-pct">0</span>%)</span>
<span class="val" id="bd-plat-fee">0đ</span>
</div>
<div class="bd-item" style="color: #2B6CB0;">
<span>- Hoa hồng KOC (<span id="txt-aff-pct">0</span>%)</span>
<span class="val" id="bd-aff-fee">0đ</span>
</div>
<div class="bd-item total">
<span>Tiền về túi (Sau khi trừ mọi phí)</span>
<span class="val" id="bd-net">0đ</span>
</div>
<div class="bd-line">
<div class="line-cogs" id="bar-cogs" style="width: 30%;" title="Giá vốn"></div>
<div class="line-fees" id="bar-fees" style="width: 40%;" title="Tổng phí"></div>
<div class="line-profit" id="bar-profit" style="width: 30%;" title="Lãi"></div>
</div>
<div style="display: flex; justify-content: space-between; font-size: 11px; color: #A0AEC0; margin-top: 4px; font-weight: bold;">
<span>GIÁ VỐN</span>
<span>CHI PHÍ + RỦI RO</span>
<span>LÃI</span>
</div>
</div>
</div>
</div>
<!-- KHỐI LIÊN KẾT ĐỒNG BỘ -->
<div class="form-section" style="background: #F8F9FA;">
<h3 style="color: #333; margin-bottom: 10px;"><i class="fa-solid fa-link" style="color: var(--primary-red);"></i> Đồng bộ sang bảng Brief</h3>
<p style="font-size: 13px; color: #4A5568; margin-bottom: 15px;">Chọn sản phẩm có sẵn trong bảng Brief để ghi đè Giá Daily (Niêm yết - Voucher) và % CMS vừa tính toán vào.</p>
<div class="form-group" style="margin-bottom: 15px;">
<div class="input-with-addon">
<select class="input-field" id="inp-link-product">
<option value="">-- Chọn sản phẩm để đồng bộ --</option>
</select>
</div>
</div>
<button class="btn-primary input-field" id="btn-sync-brief">
<i class="fa-solid fa-cloud-arrow-up"></i> Lưu Giá &amp; CMS sang bảng Brief
                        </button>
</div>
</div>
</div>
</div>
</section>`;

    function initPricingController(root) {
        if (!(root instanceof Element)) return () => {};

        const view = root.querySelector(".pricing-view");
        if (!view) return () => {};

        const $ = (selector) => view.querySelector(selector);
        const $$ = (selector) => Array.from(view.querySelectorAll(selector));
        const abortController = new AbortController();
        const { signal } = abortController;
        let destroyed = false;

        const on = (target, eventName, handler, options = {}) => {
            if (!target) return;
            target.addEventListener(eventName, handler, { ...options, signal });
        };

        const syncBadge = document.getElementById("sync-badge");
        const originalSyncBadgeHTML = syncBadge ? syncBadge.innerHTML : "";
        const errorEl = $("#res-error");
        const mainResultEl = $("#res-main-val");
        const mainLabelEl = $("#txt-main-label");
        const modeProfitArea = $("#area-mode-profit");
        const modePriceArea = $("#area-mode-price");

        const inpCogs = $("#inp-cogs");
        const inpPack = $("#inp-pack");
        const inpAds = $("#inp-ads");
        const inpVoucher = $("#inp-voucher");
        const inpReturnRate = $("#inp-return-rate");
        const inpReturnFee = $("#inp-return-fee");
        const selPreset = $("#sel-platform-preset");
        const inpFeePay = $("#inp-fee-pay");
        const inpFeeFix = $("#inp-fee-fix");
        const inpFeeXtra = $("#inp-fee-xtra");
        const inpFeeTax = $("#inp-fee-tax");
        const inpFeeAff = $("#inp-fee-aff");
        const inpTargetPrice = $("#inp-target-price");
        const inpTargetMargin = $("#inp-target-margin");
        const inpLinkProduct = $("#inp-link-product");
        const btnSyncBrief = $("#btn-sync-brief");

        const tabButtons = $$(".tab-btn");
        const allInputFields = $$(".input-field");
        const moneyInputs = [inpCogs, inpPack, inpAds, inpVoucher, inpReturnFee, inpTargetPrice];
        const percentInputs = [
            inpReturnRate,
            inpFeePay,
            inpFeeFix,
            inpFeeXtra,
            inpFeeTax,
            inpFeeAff,
            inpTargetMargin
        ];
        const platformFeeInputs = [inpFeePay, inpFeeFix, inpFeeXtra, inpFeeTax];

        const platformPresets = {
            tts_normal: { pay: 4, fix: 5, xtra: 4.5, tax: 1.5 },
            tts_mall: { pay: 4, fix: 6, xtra: 4.5, tax: 1.5 },
            spe_normal: { pay: 4, fix: 4, xtra: 6, tax: 1.5 }
        };

        let currentBrand = getCurrentBrandId();
        let calcMode = "profit";
        let calculatedDailyPrice = 0;
        let syncTimerId = 0;
        let settingsSaveTimerId = 0;

        function getCurrentBrandId() {
            return window.KOCApp?.brand?.currentId || localStorage.getItem("sys_current_brand") || "";
        }

        function safeJSONParse(key, fallback) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : fallback;
            } catch (error) {
                console.warn(`Không thể đọc LocalStorage: ${key}`, error);
                return fallback;
            }
        }

        function toMoney(value) {
            if (value === null || value === undefined || value === "") return 0;
            const normalized = String(value).replace(/[^\d\-.,]/g, "").replace(/[.,]/g, "");
            const parsed = Number(normalized);
            return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
        }

        function toPercent(value) {
            const normalized = String(value ?? "").trim().replace(",", ".");
            const parsed = Number.parseFloat(normalized);
            return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
        }

        function formatNumber(value) {
            return Math.round(Number(value) || 0).toLocaleString("vi-VN");
        }

        function normalizedPercentText(value) {
            const percent = toPercent(value);
            return Number.isInteger(percent) ? String(percent) : String(percent);
        }

        function pricingKey() {
            return `${currentBrand}_pricing_settings_v2`;
        }

        function showSync(message = "Đã lưu thông số") {
            if (!syncBadge) return;

            syncBadge.innerHTML = `<i class="fa-solid fa-check-circle" style="margin-right: 6px;"></i> ${message}`;
            syncBadge.classList.add("show");
            window.clearTimeout(syncTimerId);
            syncTimerId = window.setTimeout(() => {
                syncBadge.classList.remove("show");
            }, 2000);
        }

        function setError(message = "") {
            if (!errorEl || !mainResultEl) return;

            if (!message) {
                errorEl.style.display = "none";
                errorEl.textContent = "Cấu trúc chi phí vượt quá Giá Bán. Không thể tính toán!";
                mainResultEl.style.display = "block";
                return;
            }

            errorEl.textContent = message;
            errorEl.style.display = "block";
            mainResultEl.style.display = "none";
        }

        function setFormEnabled(enabled) {
            allInputFields.forEach((field) => {
                field.disabled = !enabled;
            });

            tabButtons.forEach((button) => {
                button.style.pointerEvents = enabled ? "" : "none";
                button.style.opacity = enabled ? "" : "0.6";
            });
        }

        function getSettingsPayload() {
            return {
                cogs: toMoney(inpCogs.value),
                pack: toMoney(inpPack.value),
                ads: toMoney(inpAds.value),
                voucher: toMoney(inpVoucher.value),
                returnRate: toPercent(inpReturnRate.value),
                returnFee: toMoney(inpReturnFee.value),
                preset: selPreset.value || "custom",
                pPay: toPercent(inpFeePay.value),
                pFix: toPercent(inpFeeFix.value),
                pXtra: toPercent(inpFeeXtra.value),
                pTax: toPercent(inpFeeTax.value),
                pAff: toPercent(inpFeeAff.value),
                targetPrice: toMoney(inpTargetPrice.value),
                targetMargin: toPercent(inpTargetMargin.value),
                mode: calcMode,
                selectedProduct: inpLinkProduct.value || "",
                updatedAt: Date.now()
            };
        }

        function saveSettingsNow() {
            window.clearTimeout(settingsSaveTimerId);
            if (!currentBrand || destroyed) return;
            localStorage.setItem(pricingKey(), JSON.stringify(getSettingsPayload()));
        }

        function scheduleSaveSettings() {
            window.clearTimeout(settingsSaveTimerId);
            if (!currentBrand || destroyed) return;

            settingsSaveTimerId = window.setTimeout(saveSettingsNow, 350);
        }

        function applyMode(mode) {
            calcMode = mode === "price" ? "price" : "profit";

            tabButtons.forEach((button) => {
                button.classList.toggle("active", button.dataset.mode === calcMode);
            });

            const isProfitMode = calcMode === "profit";
            modeProfitArea.style.display = isProfitMode ? "flex" : "none";
            modePriceArea.style.display = isProfitMode ? "none" : "flex";
            mainLabelEl.textContent = isProfitMode
                ? "LỢI NHUẬN THỰC NHẬN / ĐƠN"
                : "GIÁ BÁN NIÊM YẾT CẦN CÓ";
        }

        function setDefaultSettings() {
            inpCogs.value = "";
            inpPack.value = "";
            inpAds.value = "";
            inpVoucher.value = "";
            inpReturnRate.value = "5";
            inpReturnFee.value = "25.000";

            selPreset.value = "tts_normal";
            inpFeePay.value = "4";
            inpFeeFix.value = "5";
            inpFeeXtra.value = "4.5";
            inpFeeTax.value = "1.5";
            inpFeeAff.value = "10";

            inpTargetPrice.value = "200.000";
            inpTargetMargin.value = "25";
            applyMode("profit");
        }

        function clearSettingsForNoBrand() {
            inpCogs.value = "";
            inpPack.value = "";
            inpAds.value = "";
            inpVoucher.value = "";
            inpReturnRate.value = "0";
            inpReturnFee.value = "0";
            inpFeePay.value = "0";
            inpFeeFix.value = "0";
            inpFeeXtra.value = "0";
            inpFeeTax.value = "0";
            inpFeeAff.value = "0";
            inpTargetPrice.value = "0";
            inpTargetMargin.value = "0";
            selPreset.value = "custom";
            applyMode("profit");
        }

        function loadProductsForSync(preferredValue = "") {
            const selectedValue = preferredValue !== "" ? preferredValue : inpLinkProduct.value;
            inpLinkProduct.innerHTML = '<option value="">-- Chọn sản phẩm để đồng bộ --</option>';

            if (!currentBrand) return;

            const products = safeJSONParse(`${currentBrand}_products_table`, []);
            products.forEach((product, index) => {
                const option = document.createElement("option");
                option.value = String(index);

                const currentPrice = formatNumber(toMoney(product.price_daily));
                const currentCms = normalizedPercentText(product.cms);
                option.textContent =
                    `${product.name || "Sản phẩm không tên"} ` +
                    `(Đang lưu: ${currentPrice}đ | ${currentCms}%)`;

                inpLinkProduct.appendChild(option);
            });

            if (selectedValue !== "" && products[Number(selectedValue)]) {
                inpLinkProduct.value = String(selectedValue);
            }
        }

        function loadSettings() {
            if (!currentBrand) {
                setFormEnabled(false);
                clearSettingsForNoBrand();
                loadProductsForSync();
                calculate();
                return;
            }

            setFormEnabled(true);
            const settings = safeJSONParse(pricingKey(), null);

            if (!settings) {
                setDefaultSettings();
            } else {
                inpCogs.value = formatNumber(settings.cogs);
                inpPack.value = formatNumber(settings.pack);
                inpAds.value = formatNumber(settings.ads);
                inpVoucher.value = formatNumber(settings.voucher);
                inpReturnRate.value = settings.returnRate ?? "5";
                inpReturnFee.value = formatNumber(settings.returnFee ?? 25000);

                selPreset.value = platformPresets[settings.preset] ? settings.preset : "custom";
                inpFeePay.value = settings.pPay ?? "4";
                inpFeeFix.value = settings.pFix ?? "5";
                inpFeeXtra.value = settings.pXtra ?? "4.5";
                inpFeeTax.value = settings.pTax ?? "1.5";
                inpFeeAff.value = settings.pAff ?? "10";

                inpTargetPrice.value = formatNumber(settings.targetPrice ?? 200000);
                inpTargetMargin.value = settings.targetMargin ?? "25";
                applyMode(settings.mode);
            }

            loadProductsForSync(settings?.selectedProduct || "");
            calculate();
        }

        function syncProductToBrief() {
            if (!currentBrand) {
                window.alert("Vui lòng chọn thương hiệu!");
                return;
            }

            const productIndex = Number(inpLinkProduct.value);
            if (!Number.isInteger(productIndex) || inpLinkProduct.value === "") {
                window.alert("Vui lòng chọn 1 sản phẩm từ danh sách!");
                return;
            }

            if (calculatedDailyPrice <= 0 || !Number.isFinite(calculatedDailyPrice)) {
                window.alert("Chưa tính ra Giá Daily hợp lệ để đồng bộ!");
                return;
            }

            const products = safeJSONParse(`${currentBrand}_products_table`, []);
            if (!products[productIndex]) {
                window.alert("Sản phẩm đã thay đổi. Vui lòng chọn lại trước khi đồng bộ.");
                loadProductsForSync();
                return;
            }

            products[productIndex] = {
                ...products[productIndex],
                price_daily: String(Math.round(calculatedDailyPrice)),
                cms: normalizedPercentText(inpFeeAff.value)
            };

            localStorage.setItem(`${currentBrand}_products_table`, JSON.stringify(products));
            loadProductsForSync(String(productIndex));
            scheduleSaveSettings();
            showSync("Đã cập nhật Giá Daily và CMS sang Brief!");
        }

        function updateBreakdown({
            sellingPrice = 0,
            voucher = 0,
            fixedCosts = 0,
            returnLossExpected = 0,
            ads = 0,
            platformFee = 0,
            affiliateFee = 0,
            netProfit = 0,
            actualRevenue = 0,
            platformPercent = 0,
            affiliatePercent = 0,
            returnRate = 0,
            margin = 0
        }) {
            $("#txt-total-plat-pct").textContent = platformPercent.toFixed(1);
            $("#txt-aff-pct").textContent = affiliatePercent.toFixed(1);
            $("#txt-return-pct").textContent = returnRate.toFixed(1).replace(/\.0$/, "");

            $("#bd-price").textContent = `${formatNumber(sellingPrice)}đ`;
            $("#bd-voucher").textContent = `-${formatNumber(voucher)}đ`;
            $("#bd-base-cost").textContent = `${formatNumber(fixedCosts)}đ`;
            $("#bd-return-loss").textContent = `${formatNumber(returnLossExpected)}đ`;
            $("#bd-ads").textContent = `${formatNumber(ads)}đ`;
            $("#bd-plat-fee").textContent = `${formatNumber(platformFee)}đ`;
            $("#bd-aff-fee").textContent = `${formatNumber(affiliateFee)}đ`;
            $("#bd-net").textContent = `${formatNumber(netProfit)}đ`;

            const marginBadge = $("#res-badge");
            marginBadge.textContent = `Biên lợi nhuận: ${margin.toFixed(1)}%`;
            if (margin >= 20) {
                marginBadge.style.background = "#C6F6D5";
                marginBadge.style.color = "#22543D";
            } else if (margin >= 10) {
                marginBadge.style.background = "#FEFCBF";
                marginBadge.style.color = "#744210";
            } else {
                marginBadge.style.background = "#FED7D7";
                marginBadge.style.color = "#822727";
            }

            const roasBadge = $("#res-roas");
            if (ads > 0 && actualRevenue > 0) {
                roasBadge.textContent = `ROAS: ${(actualRevenue / ads).toFixed(2)}x`;
                roasBadge.style.display = "inline-block";
            } else {
                roasBadge.style.display = "none";
            }

            let cogsPercent = 0;
            let feesPercent = 0;
            let profitPercent = 0;

            if (actualRevenue > 0) {
                cogsPercent = Math.max(0, ((fixedCosts + returnLossExpected) / actualRevenue) * 100);
                feesPercent = Math.max(0, ((ads + platformFee + affiliateFee) / actualRevenue) * 100);
                profitPercent = Math.max(0, margin);

                if (cogsPercent + feesPercent + profitPercent > 100) {
                    const total = cogsPercent + feesPercent + profitPercent;
                    cogsPercent = (cogsPercent / total) * 100;
                    feesPercent = (feesPercent / total) * 100;
                    profitPercent = (profitPercent / total) * 100;
                }
            }

            $("#bar-cogs").style.width = `${cogsPercent}%`;
            $("#bar-fees").style.width = `${feesPercent}%`;
            $("#bar-profit").style.width = `${profitPercent}%`;
        }

        function calculate() {
            const cogs = toMoney(inpCogs.value);
            const pack = toMoney(inpPack.value);
            const ads = toMoney(inpAds.value);
            const voucher = toMoney(inpVoucher.value);
            const returnRate = toPercent(inpReturnRate.value);
            const returnFee = toMoney(inpReturnFee.value);

            const feePay = toPercent(inpFeePay.value);
            const feeFix = toPercent(inpFeeFix.value);
            const feeXtra = toPercent(inpFeeXtra.value);
            const feeTax = toPercent(inpFeeTax.value);
            const feeAff = toPercent(inpFeeAff.value);

            const platformPercent = feePay + feeFix + feeXtra + feeTax;
            const totalFeeRate = (platformPercent + feeAff) / 100;
            const returnLossExpected = (returnRate / 100) * (pack + returnFee);
            const fixedCosts = cogs + pack;
            const nonPercentageCosts = fixedCosts + ads + returnLossExpected;

            let sellingPrice = 0;
            let actualRevenue = 0;
            let netProfit = 0;
            let margin = 0;
            let platformFee = 0;
            let affiliateFee = 0;

            setError("");
            calculatedDailyPrice = 0;

            if (calcMode === "profit") {
                sellingPrice = toMoney(inpTargetPrice.value);
                actualRevenue = sellingPrice - voucher;

                if (sellingPrice <= 0) {
                    setError("Vui lòng nhập Giá Bán Dự Kiến lớn hơn 0.");
                    updateBreakdown({
                        sellingPrice, voucher, fixedCosts, returnLossExpected, ads,
                        platformPercent, affiliatePercent: feeAff, returnRate
                    });
                    return;
                }

                if (actualRevenue <= 0) {
                    setError("Giá sau Voucher phải lớn hơn 0 để tính lợi nhuận.");
                    updateBreakdown({
                        sellingPrice, voucher, fixedCosts, returnLossExpected, ads,
                        platformPercent, affiliatePercent: feeAff, returnRate
                    });
                    return;
                }

                platformFee = actualRevenue * (platformPercent / 100);
                affiliateFee = actualRevenue * (feeAff / 100);
                netProfit = actualRevenue - nonPercentageCosts - platformFee - affiliateFee;
                margin = (netProfit / actualRevenue) * 100;
            } else {
                const targetMargin = toPercent(inpTargetMargin.value) / 100;
                const denominator = 1 - totalFeeRate - targetMargin;

                if (denominator <= 0) {
                    setError("Tổng phí và biên lợi nhuận mục tiêu phải nhỏ hơn 100%.");
                    updateBreakdown({
                        fixedCosts, returnLossExpected, ads,
                        platformPercent, affiliatePercent: feeAff, returnRate
                    });
                    return;
                }

                actualRevenue = nonPercentageCosts / denominator;
                sellingPrice = actualRevenue + voucher;
                platformFee = actualRevenue * (platformPercent / 100);
                affiliateFee = actualRevenue * (feeAff / 100);
                netProfit = actualRevenue - nonPercentageCosts - platformFee - affiliateFee;
                margin = actualRevenue > 0 ? (netProfit / actualRevenue) * 100 : 0;
            }

            calculatedDailyPrice = actualRevenue;
            updateBreakdown({
                sellingPrice,
                voucher,
                fixedCosts,
                returnLossExpected,
                ads,
                platformFee,
                affiliateFee,
                netProfit,
                actualRevenue,
                platformPercent,
                affiliatePercent: feeAff,
                returnRate,
                margin
            });

            if (calcMode === "profit") {
                mainResultEl.textContent = `${formatNumber(netProfit)}đ`;
                mainResultEl.style.color = netProfit >= 0 ? "#38A169" : "#E53E3E";
            } else {
                mainResultEl.textContent = `${formatNumber(sellingPrice)}đ`;
                mainResultEl.style.color = "#2B6CB0";
            }
        }

        function exportPricing() {
            if (!window.XLSX) {
                showSync("Chưa nạp thư viện Xuất Excel");
                return;
            }

            const rows = [
                ["BẢNG TÍNH GIÁ VÀ LỢI NHUẬN", ""],
                ["Thương hiệu", window.KOCApp?.brand?.getCurrent?.()?.name || currentBrand || "Chưa chọn"],
                ["Giá vốn nhập hàng (COGS)", toMoney(inpCogs.value)],
                ["Phí đóng gói", toMoney(inpPack.value)],
                ["Chi phí Ads / đơn", toMoney(inpAds.value)],
                ["Voucher Shop", toMoney(inpVoucher.value)],
                ["Tỷ lệ hoàn / boom (%)", toPercent(inpReturnRate.value)],
                ["Phí ship mất khi hoàn", toMoney(inpReturnFee.value)],
                ["Tổng phí sàn + thuế (%)",
                    toPercent(inpFeePay.value) + toPercent(inpFeeFix.value) +
                    toPercent(inpFeeXtra.value) + toPercent(inpFeeTax.value)],
                ["Hoa hồng KOC (%)", toPercent(inpFeeAff.value)],
                ["Giá niêm yết", $("#bd-price").textContent],
                ["Tiền về túi", $("#bd-net").textContent],
                ["Kết quả chính", mainResultEl.textContent]
            ];

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(rows);
            worksheet["!cols"] = [{ wch: 34 }, { wch: 24 }];
            XLSX.utils.book_append_sheet(workbook, worksheet, "Tính giá");

            const safeBrand = (window.KOCApp?.brand?.getCurrent?.()?.name || "pricing")
                .replace(/[\\/:*?"<>|]/g, "-");
            XLSX.writeFile(workbook, `Tinh-gia-${safeBrand}.xlsx`);
        }

        function handleBrandChanged(event) {
            saveSettingsNow();
            currentBrand = event.detail?.brand?.id || getCurrentBrandId();
            loadSettings();
        }

        function handleStorage(event) {
            if (event.key === "sys_current_brand") {
                saveSettingsNow();
                currentBrand = localStorage.getItem("sys_current_brand") || "";
                loadSettings();
                return;
            }

            if (!currentBrand) return;

            if (event.key === `${currentBrand}_products_table`) {
                loadProductsForSync();
                showSync("Danh sách sản phẩm đã cập nhật");
            }

            if (event.key === pricingKey()) {
                const activeTag = document.activeElement?.tagName;
                if (activeTag !== "INPUT" && activeTag !== "SELECT") {
                    loadSettings();
                    showSync("Đã cập nhật thông số từ tab khác");
                }
            }
        }

        moneyInputs.forEach((input) => {
            on(input, "input", (event) => {
                const rawValue = toMoney(event.target.value);
                event.target.value = rawValue ? formatNumber(rawValue) : "";
                calculate();
                scheduleSaveSettings();
            });

            on(input, "blur", () => {
                if (input.value) input.value = formatNumber(toMoney(input.value));
                calculate();
                saveSettingsNow();
            });
        });

        percentInputs.forEach((input) => {
            on(input, "input", () => {
                if (platformFeeInputs.includes(input)) selPreset.value = "custom";
                calculate();
                scheduleSaveSettings();
            });

            on(input, "blur", () => {
                calculate();
                saveSettingsNow();
            });
        });

        on(selPreset, "change", (event) => {
            const preset = platformPresets[event.target.value];
            if (preset) {
                inpFeePay.value = preset.pay;
                inpFeeFix.value = preset.fix;
                inpFeeXtra.value = preset.xtra;
                inpFeeTax.value = preset.tax;
            }
            calculate();
            saveSettingsNow();
        });

        tabButtons.forEach((button) => {
            on(button, "click", () => {
                applyMode(button.dataset.mode);
                calculate();
                saveSettingsNow();
            });
        });

        on(inpLinkProduct, "change", scheduleSaveSettings);
        on(btnSyncBrief, "click", syncProductToBrief);
        on(document, "brand:changed", handleBrandChanged);
        on(window, "storage", handleStorage);
        on(window, "beforeunload", saveSettingsNow);

        // Nút Header thuộc App Shell. Listener bị AbortController gỡ cùng view.
        on(document.querySelector("#btn-export"), "click", exportPricing);
        on(document.querySelector("#btn-print"), "click", () => {
            saveSettingsNow();
            window.print();
        });

        loadSettings();

        return () => {
            if (destroyed) return;
            saveSettingsNow();
            destroyed = true;

            abortController.abort();
            window.clearTimeout(syncTimerId);
            window.clearTimeout(settingsSaveTimerId);

            if (syncBadge) {
                syncBadge.classList.remove("show");
                syncBadge.innerHTML = originalSyncBadgeHTML;
            }
        };
    }

    window.KOCViewTemplates = window.KOCViewTemplates || {};
    window.KOCViewTemplates.pricing = pricingTemplate;

    // Alias để tương thích với tên hàm được yêu cầu và Router hiện tại.
    window.initPricingController = initPricingController;
    window.initpricingController = initPricingController;
    window.initViewPricing = initPricingController;
})();
