/* global XLSX */
(() => {
    "use strict";

    window.KOCViewTemplates = window.KOCViewTemplates || {};

    window.KOCViewTemplates.measurement = function measurementTemplate() {
        return `
            <datalist id="product-list"></datalist>
            <div class="content-wrapper measurement-view">
<!-- CONTAINER ĐIỀU HƯỚNG VIEW -->
<div data-tab="booking" id="dashboard-container">
<div class="dashboard-tabs">
<button class="dash-tab active" data-target="booking"><i class="fa-solid fa-bullhorn"></i> Dành cho mảng Booking</button>
<button class="dash-tab" data-target="tmdt"><i class="fa-solid fa-shop"></i> Dành cho Thương mại điện tử</button>
</div>
<!-- Cài đặt chung -->
<div class="settings-area">
<div class="show-booking">
                        ROI Tier A ≥ <input id="set-tier-a" step="0.5" type="number" value="5"/> lần
                        <span style="margin: 0 15px;">|</span>
                        ROI Tier B ≥ <input id="set-tier-b" step="0.5" type="number" value="2"/> lần
                        <span class="settings-note">Công thức: ROI = GMV ÷ Chi phí booking. Nếu ROI &lt; 1 = Lỗ (Loại).</span>
</div>
<div class="show-tmdt">
                        Lãi gộp biên (%) <input id="set-margin" max="100" min="0" step="1" type="number" value="25"/>
<span style="margin: 0 8px;">|</span>
                        Hoàn / huỷ (%) <input id="set-return-rate" max="100" min="0" step="0.5" type="number" value="0"/>
<span style="margin: 0 8px;">|</span>
                        Phí sàn &amp; TT (%) <input id="set-platform-fee" max="100" min="0" step="0.5" type="number" value="0"/>
<span style="margin: 0 8px;">|</span>
                        Biên mục tiêu (%) <input id="set-target-margin" max="100" min="0" step="1" type="number" value="10"/>
<span class="settings-note">DT thuần = GMV sau hoàn/huỷ. Lãi đóng góp đã trừ phí sàn, CMS thực nhận và Cast.</span>
</div>
</div>
<!-- Tóm tắt Booking (GỐC) -->
<div class="summary-grid show-booking">
<div class="summary-card sc-gmv">
<h2 id="sum-gmv">0đ</h2>
<p>Tổng GMV (đ)</p>
</div>
<div class="summary-card sc-cost">
<h2 id="sum-cost">0đ</h2>
<p>Tổng chi phí booking</p>
</div>
<div class="summary-card sc-roi">
<h2 id="sum-roi">0x</h2>
<p>ROI tổng</p>
</div>
<div class="summary-card sc-keep">
<h2 id="sum-keep">0</h2>
<p>KOC giữ (Tier A+B)</p>
</div>
<div class="summary-card sc-drop">
<h2 id="sum-drop">0</h2>
<p>KOC nên loại (ROI âm)</p>
</div>
</div>
<!-- Tóm tắt TMĐT: theo lãi đóng góp sau hoàn/huỷ, phí sàn và chi phí KOC -->
<div class="summary-grid show-tmdt">
<div class="summary-card sc-gmv">
<h2 id="sum-gmv-tmdt">0đ</h2>
<p>Tổng GMV (đ)</p>
</div>
<div class="summary-card sc-cost">
<h2 id="sum-cost-tmdt">0đ</h2>
<p id="label-sum-cost-tmdt">Tổng DT thuần</p>
</div>
<div class="summary-card sc-roi">
<h2 id="sum-netprofit-tmdt">0đ</h2>
<p id="label-sum-netprofit-tmdt">Tổng lãi đóng góp</p>
</div>
<div class="summary-card sc-keep">
<h2 id="sum-keep-tmdt">0</h2>
<p id="label-sum-keep-tmdt">KOC đạt hòa vốn</p>
</div>
<div class="summary-card sc-drop">
<h2 id="sum-drop-tmdt">0</h2>
<p id="label-sum-drop-tmdt">KOC dưới hòa vốn</p>
</div>
</div>
<div class="table-card">
<table>
<thead>
<tr>
<th class="align-left sortable" data-sort="name" style="min-width: 140px;">KOC</th>
<th class="align-left" style="min-width: 160px;">SẢN PHẨM</th>
<th style="width: 100px;">GIAI ĐOẠN</th>
<th class="sortable" data-sort="gmv" style="width: 130px;">GMV (Đ)</th>
<th class="sortable" data-sort="orders" style="width: 80px;">ĐƠN</th>
<th class="sortable" data-sort="views" style="width: 100px;">VIEW THỰC</th>
<th class="sortable" data-sort="cast" style="width: 120px;">CAST (Đ)</th>
<th style="width: 110px;">CMS (Đ)</th>
<th class="sortable" data-sort="total_cost" style="width: 120px;">CHI PHÍ (Đ)</th>
<!-- Cột Booking (Gốc) -->
<th class="show-booking sortable" data-sort="roi" style="width: 80px;">ROI (LẦN)</th>
<th class="show-booking" style="width: 90px;">TIER</th>
<th class="show-booking" style="min-width: 150px;">KHUYẾN NGHỊ</th>
<!-- Cột TMĐT: dùng doanh thu thực nhận và lãi đóng góp -->
<th class="show-tmdt sortable" data-sort="net_sales" style="width: 125px; color: #2B6CB0;">DT THUẦN (Đ)</th>
<th class="show-tmdt sortable" data-sort="netprofit" style="width: 130px; color: #38A169;">LÃI ĐÓNG GÓP (Đ)</th>
<th class="show-tmdt sortable" data-sort="profit_margin" style="width: 95px; color: #38A169;">BIÊN LN</th>
<th class="show-tmdt sortable" data-sort="mer" style="width: 100px; color: #2B6CB0;">MER THUẦN</th>
<th class="show-tmdt sortable" data-sort="bep_gmv" style="width: 125px; color: #D69E2E;">GMV HÒA VỐN</th>
<th class="show-tmdt" style="width: 120px;">TIER (TMĐT)</th>
<th class="show-tmdt" style="min-width: 170px;">KHUYẾN NGHỊ</th>
</tr>
</thead>
<tbody id="roi-table-body">
</tbody>
</table>
</div>
<div class="footer-note">
<i class="fa-solid fa-clipboard-list"></i>
<span class="show-booking"><strong>Sau mỗi đợt: Tier A/B</strong> → lên kế hoạch tái booking, mời vào nhóm cộng đồng KOC. <strong>Trung bình</strong> → điều chỉnh CTA/script rồi test lại. <strong>ROI âm</strong> → loại khỏi vòng sau (phép trừ).</span>
<span class="show-tmdt"><strong>Lưu ý mảng TMĐT:</strong> DT thuần = GMV × (1 − hoàn/huỷ). <strong>Lãi đóng góp</strong> = DT thuần × (lãi gộp biên − phí sàn &amp; TT − CMS) − Cast. KOC chỉ nên scale khi đã vượt hòa vốn và đạt biên mục tiêu.</span>
</div>
</div>
</div>
        `;
    };

    window.initViewMeasurement = function initViewMeasurement(root) {
        const view = root?.querySelector(".measurement-view");
        if (!view) return () => {};

        const abortController = new AbortController();
        const { signal } = abortController;

        const tableBody = view.querySelector("#roi-table-body");
        const syncBadge = document.getElementById("sync-badge");
        const dashboardContainer = view.querySelector("#dashboard-container");
        const productList = root.querySelector("#product-list");
        const exportButton = document.getElementById("btn-export");
        const printButton = document.getElementById("btn-print");

        const defaultRoiSettings = {
            a: 5,
            b: 2,
            margin: 25,
            returnRate: 0,
            platformFee: 0,
            targetMargin: 10
        };

        let currentBrand = getCurrentBrandId();
        let pipelineData = [];
        let roiSettings = { ...defaultRoiSettings };
        let saveTimeout = null;
        let currentSort = { col: null, asc: true };

        const inpTierA = view.querySelector("#set-tier-a");
        const inpTierB = view.querySelector("#set-tier-b");
        const inpMargin = view.querySelector("#set-margin");
        const inpReturnRate = view.querySelector("#set-return-rate");
        const inpPlatformFee = view.querySelector("#set-platform-fee");
        const inpTargetMargin = view.querySelector("#set-target-margin");

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

        function formatNumber(value) {
            const number = typeof value === "string" ? unformatNumber(value) : Number(value);
            if (!Number.isFinite(number) || number === 0) return "";
            return number.toLocaleString("vi-VN");
        }

        function unformatNumber(value) {
            if (value === null || value === undefined || value === "") return 0;
            return Number.parseFloat(String(value).replace(/\./g, "").replace(/,/g, "")) || 0;
        }

        function formatMoney(value) {
            const number = Number(value);
            return Number.isFinite(number) && number !== 0
                ? number.toLocaleString("vi-VN")
                : "0";
        }

        function clampPercent(value, fallback) {
            const parsed = Number.parseFloat(value);
            if (!Number.isFinite(parsed)) return fallback;
            return Math.min(100, Math.max(0, parsed));
        }

        function getActiveRows() {
            return pipelineData.filter((row) =>
                row.stage !== "Đã loại" &&
                row.stage !== "Đang liên hệ" &&
                row.stage !== "Tìm kiếm"
            );
        }

        function showSync() {
            if (!syncBadge) return;
            syncBadge.classList.add("show");
            window.clearTimeout(saveTimeout);
            saveTimeout = window.setTimeout(() => syncBadge.classList.remove("show"), 1500);
        }

        function hydrateSettings() {
            const savedSettings = currentBrand
                ? safeJSONParse(`${currentBrand}_roi_settings`, defaultRoiSettings)
                : defaultRoiSettings;

            roiSettings = { ...defaultRoiSettings, ...savedSettings };
            inpTierA.value = roiSettings.a;
            inpTierB.value = roiSettings.b;
            inpMargin.value = roiSettings.margin;
            inpReturnRate.value = roiSettings.returnRate;
            inpPlatformFee.value = roiSettings.platformFee;
            inpTargetMargin.value = roiSettings.targetMargin;
        }

        function loadPipelineData() {
            pipelineData = currentBrand
                ? safeJSONParse(`${currentBrand}_koc_pipeline`, [])
                : [];

            if (!Array.isArray(pipelineData)) pipelineData = [];
        }

        function persistPipelineData() {
            if (!currentBrand) return;
            localStorage.setItem(`${currentBrand}_koc_pipeline`, JSON.stringify(pipelineData));
        }

        function saveSettings() {
            roiSettings.a = Math.max(0, Number.parseFloat(inpTierA.value) || defaultRoiSettings.a);
            roiSettings.b = Math.max(0, Number.parseFloat(inpTierB.value) || defaultRoiSettings.b);
            roiSettings.margin = clampPercent(inpMargin.value, defaultRoiSettings.margin);
            roiSettings.returnRate = clampPercent(inpReturnRate.value, defaultRoiSettings.returnRate);
            roiSettings.platformFee = clampPercent(inpPlatformFee.value, defaultRoiSettings.platformFee);
            roiSettings.targetMargin = clampPercent(inpTargetMargin.value, defaultRoiSettings.targetMargin);

            inpTierA.value = roiSettings.a;
            inpTierB.value = roiSettings.b;
            inpMargin.value = roiSettings.margin;
            inpReturnRate.value = roiSettings.returnRate;
            inpPlatformFee.value = roiSettings.platformFee;
            inpTargetMargin.value = roiSettings.targetMargin;

            if (currentBrand) {
                localStorage.setItem(`${currentBrand}_roi_settings`, JSON.stringify(roiSettings));
                renderTable();
                showSync();
            }
        }

        function calculateRowMetrics(row) {
            const gmv = unformatNumber(row.gmv);
            const cast = unformatNumber(row.cast);
            const cmsPercent = Math.max(0, Number.parseFloat(row.cms) || 0);

            // Booking: ROI = GMV / (Cast + CMS trên GMV).
            const cmsVND = gmv * (cmsPercent / 100);
            const totalCost = cast + cmsVND;
            const roi = totalCost > 0 ? gmv / totalCost : (gmv > 0 ? 999 : 0);

            // TMĐT: dựa trên doanh thu thuần và lãi đóng góp sau mọi chi phí KOC.
            const marginPercent = clampPercent(roiSettings.margin, defaultRoiSettings.margin);
            const returnRate = clampPercent(roiSettings.returnRate, defaultRoiSettings.returnRate);
            const platformFeePercent = clampPercent(roiSettings.platformFee, defaultRoiSettings.platformFee);
            const targetMargin = clampPercent(roiSettings.targetMargin, defaultRoiSettings.targetMargin);

            const netSales = gmv * (1 - returnRate / 100);
            const tmdtCmsVND = netSales * (cmsPercent / 100);
            const platformFeeVND = netSales * (platformFeePercent / 100);
            const grossProfit = netSales * (marginPercent / 100);
            const tmdtKocCost = cast + tmdtCmsVND;
            const netProfit = grossProfit - platformFeeVND - tmdtKocCost;
            const profitMargin = netSales > 0 ? (netProfit / netSales) * 100 : 0;
            const mer = tmdtKocCost > 0 ? netSales / tmdtKocCost : (netSales > 0 ? 999 : 0);

            const unitContributionRate = (marginPercent - platformFeePercent - cmsPercent) / 100;
            const breakEvenNetSales = unitContributionRate > 0 ? cast / unitContributionRate : Infinity;
            const breakEvenGmv = unitContributionRate > 0 && returnRate < 100
                ? breakEvenNetSales / (1 - returnRate / 100)
                : Infinity;

            return {
                gmv,
                cast,
                cmsPercent,
                cmsVND,
                totalCost,
                roi,
                marginPercent,
                returnRate,
                platformFeePercent,
                targetMargin,
                netSales,
                tmdtCmsVND,
                platformFeeVND,
                grossProfit,
                tmdtKocCost,
                netProfit,
                profitMargin,
                mer,
                unitContributionRate,
                breakEvenGmv
            };
        }

        function getBookingClassification(metrics) {
            if (metrics.gmv === 0 && metrics.totalCost === 0) {
                return {
                    tier: `<span class="tier-badge tier-avg">-</span>`,
                    recommendation: `<span class="recom-text" style="color:#a0aec0">Chưa đủ dữ liệu</span>`
                };
            }

            if (metrics.roi >= roiSettings.a) {
                return {
                    tier: `<span class="tier-badge tier-a">Tier A</span>`,
                    recommendation: `<span class="recom-text recom-keep"><i class="fa-solid fa-check-square"></i> Tái hợp tác - TOP</span>`
                };
            }

            if (metrics.roi >= roiSettings.b) {
                return {
                    tier: `<span class="tier-badge tier-b">Tier B</span>`,
                    recommendation: `<span class="recom-text recom-keep"><i class="fa-solid fa-check-square"></i> Tái hợp tác</span>`
                };
            }

            if (metrics.roi >= 1) {
                return {
                    tier: `<span class="tier-badge tier-avg">Trung bình</span>`,
                    recommendation: `<span class="recom-text recom-warn"><i class="fa-solid fa-triangle-exclamation"></i> Test lại</span>`
                };
            }

            return {
                tier: `<span class="tier-badge tier-drop">ROI Âm</span>`,
                recommendation: `<span class="recom-text recom-drop"><i class="fa-solid fa-xmark"></i> Loại</span>`
            };
        }

        function getTmdtClassification(metrics) {
            if (metrics.gmv === 0 && metrics.tmdtKocCost === 0) {
                return {
                    tier: `<span class="tier-badge tier-avg">-</span>`,
                    recommendation: `<span class="recom-text" style="color:#a0aec0">Chưa đủ dữ liệu</span>`
                };
            }

            if (metrics.unitContributionRate <= 0) {
                return {
                    tier: `<span class="tier-badge tier-drop">Cấu trúc lỗ</span>`,
                    recommendation: `<span class="recom-text recom-drop"><i class="fa-solid fa-xmark"></i> Rà giá / phí / CMS</span>`
                };
            }

            if (metrics.netProfit < 0) {
                return {
                    tier: `<span class="tier-badge tier-drop">Dưới BEP</span>`,
                    recommendation: `<span class="recom-text recom-warn"><i class="fa-solid fa-chart-line"></i> Tối ưu để vượt hòa vốn</span>`
                };
            }

            if (metrics.profitMargin >= metrics.targetMargin) {
                return {
                    tier: `<span class="tier-badge tier-a">Sinh lời tốt</span>`,
                    recommendation: `<span class="recom-text recom-keep"><i class="fa-solid fa-arrow-trend-up"></i> Có thể scale</span>`
                };
            }

            return {
                tier: `<span class="tier-badge tier-b">Có lãi mỏng</span>`,
                recommendation: `<span class="recom-text recom-warn"><i class="fa-solid fa-sliders"></i> Tối ưu trước khi scale</span>`
            };
        }

        function updateProductList() {
            if (!productList) return;
            const products = new Set();
            pipelineData.forEach((row) => {
                if (typeof row.product === "string" && row.product.trim()) products.add(row.product.trim());
            });

            productList.replaceChildren();
            [...products]
                .sort((a, b) => a.localeCompare(b, "vi"))
                .forEach((product) => {
                    const option = document.createElement("option");
                    option.value = product;
                    productList.appendChild(option);
                });
        }

        function updateSummaryCards() {
            let totalGmv = 0;
            let totalCost = 0;
            let totalNetSales = 0;
            let totalNetProfit = 0;
            let keepCountBooking = 0;
            let dropCountBooking = 0;
            let keepCountTmdt = 0;
            let dropCountTmdt = 0;

            getActiveRows().forEach((row) => {
                const metrics = calculateRowMetrics(row);
                totalGmv += metrics.gmv;
                totalCost += metrics.totalCost;
                totalNetSales += metrics.netSales;
                totalNetProfit += metrics.netProfit;

                if (metrics.gmv > 0 || metrics.totalCost > 0) {
                    if (metrics.roi >= 1) keepCountBooking += 1;
                    else dropCountBooking += 1;

                    if (metrics.netProfit >= 0) keepCountTmdt += 1;
                    else dropCountTmdt += 1;
                }
            });

            const setText = (selector, text) => {
                const element = view.querySelector(selector);
                if (element) element.textContent = text;
                return element;
            };

            const globalRoi = totalCost > 0
                ? (totalGmv / totalCost).toFixed(2)
                : (totalGmv > 0 ? "∞" : "0");

            setText("#sum-gmv", `${formatMoney(totalGmv)}đ`);
            setText("#sum-cost", `${formatMoney(totalCost)}đ`);
            setText("#sum-roi", `${globalRoi}x`);
            setText("#sum-keep", String(keepCountBooking));
            setText("#sum-drop", String(dropCountBooking));

            setText("#sum-gmv-tmdt", `${formatMoney(totalGmv)}đ`);
            setText("#sum-cost-tmdt", `${formatMoney(totalNetSales)}đ`);
            const netProfitElement = setText("#sum-netprofit-tmdt", `${formatMoney(totalNetProfit)}đ`);
            if (netProfitElement) {
                netProfitElement.style.color = totalNetProfit >= 0 ? "#38a169" : "#e53e3e";
            }
            setText("#sum-keep-tmdt", String(keepCountTmdt));
            setText("#sum-drop-tmdt", String(dropCountTmdt));
            setText("#label-sum-cost-tmdt", "Tổng DT thuần");
            setText("#label-sum-netprofit-tmdt", "Tổng lãi đóng góp");
            setText("#label-sum-keep-tmdt", "KOC đạt hòa vốn");
            setText("#label-sum-drop-tmdt", "KOC dưới hòa vốn");
            setText(".summary-grid.show-booking .sc-keep p", "KOC Giữ/Test (ROI ≥ 1)");
        }

        function updateRowCalculations(rowElement, rowData) {
            const metrics = calculateRowMetrics(rowData);
            const isTmdtView = dashboardContainer.dataset.tab === "tmdt";
            const booking = getBookingClassification(metrics);
            const tmdt = getTmdtClassification(metrics);

            const setText = (selector, text) => {
                const element = rowElement.querySelector(selector);
                if (element) element.textContent = text;
                return element;
            };

            setText(".col-cms-vnd", formatMoney(isTmdtView ? metrics.tmdtCmsVND : metrics.cmsVND));
            setText(".col-cost", formatMoney(isTmdtView ? metrics.tmdtKocCost : metrics.totalCost));
            setText(".col-roi", metrics.roi === 999 ? "∞" : metrics.roi.toFixed(1));

            const bookingTier = rowElement.querySelector(".col-tier");
            const bookingRecommendation = rowElement.querySelector(".col-rec");
            if (bookingTier) bookingTier.innerHTML = booking.tier;
            if (bookingRecommendation) bookingRecommendation.innerHTML = booking.recommendation;

            const netSalesElement = setText(".col-net-sales", formatMoney(metrics.netSales));
            const netProfitElement = setText(".col-netprofit", formatMoney(metrics.netProfit));
            const marginElement = setText(".col-profit-margin", `${metrics.profitMargin.toFixed(1)}%`);
            const merElement = setText(".col-mer", metrics.mer === 999 ? "∞" : `${metrics.mer.toFixed(2)}x`);
            const breakEvenElement = setText(
                ".col-bep-gmv",
                Number.isFinite(metrics.breakEvenGmv) ? formatMoney(metrics.breakEvenGmv) : "Không thể"
            );

            if (netSalesElement) netSalesElement.style.color = "#2b6cb0";
            if (netProfitElement) netProfitElement.style.color = metrics.netProfit >= 0 ? "#38a169" : "#e53e3e";
            if (marginElement) {
                marginElement.style.color = metrics.profitMargin >= metrics.targetMargin
                    ? "#38a169"
                    : (metrics.profitMargin >= 0 ? "#d69e2e" : "#e53e3e");
            }
            if (merElement) merElement.style.color = metrics.mer >= 1 ? "#2b6cb0" : "#e53e3e";
            if (breakEvenElement) {
                breakEvenElement.style.color = Number.isFinite(metrics.breakEvenGmv) ? "#d69e2e" : "#e53e3e";
            }

            const tmdtTier = rowElement.querySelector(".col-tier-tmdt");
            const tmdtRecommendation = rowElement.querySelector(".col-rec-tmdt");
            if (tmdtTier) tmdtTier.innerHTML = tmdt.tier;
            if (tmdtRecommendation) tmdtRecommendation.innerHTML = tmdt.recommendation;
        }

        function sortRows(rows) {
            if (!currentSort.col) return rows;

            const valueFor = (row) => {
                const metrics = calculateRowMetrics(row);
                switch (currentSort.col) {
                    case "name": return row.name || "";
                    case "gmv": return metrics.gmv;
                    case "orders": return unformatNumber(row.orders);
                    case "views": return unformatNumber(row.real_views);
                    case "cast": return metrics.cast;
                    case "total_cost":
                        return dashboardContainer.dataset.tab === "tmdt"
                            ? metrics.tmdtKocCost
                            : metrics.totalCost;
                    case "roi": return metrics.roi;
                    case "net_sales": return metrics.netSales;
                    case "netprofit": return metrics.netProfit;
                    case "profit_margin": return metrics.profitMargin;
                    case "mer": return metrics.mer;
                    case "bep_gmv":
                        return Number.isFinite(metrics.breakEvenGmv)
                            ? metrics.breakEvenGmv
                            : Number.MAX_SAFE_INTEGER;
                    default: return 0;
                }
            };

            return rows.sort((left, right) => {
                let valueLeft = valueFor(left);
                let valueRight = valueFor(right);

                if (typeof valueLeft === "string") {
                    valueLeft = valueLeft.toLocaleLowerCase("vi");
                    valueRight = String(valueRight).toLocaleLowerCase("vi");
                }

                if (valueLeft < valueRight) return currentSort.asc ? -1 : 1;
                if (valueLeft > valueRight) return currentSort.asc ? 1 : -1;
                return 0;
            });
        }

        function createRow(row) {
            const tr = document.createElement("tr");
            tr.dataset.id = String(row.id ?? "");

            tr.innerHTML = `
                <td class="align-left"><div class="t-text cell-name"></div></td>
                <td class="align-left"><input type="text" list="product-list" class="t-input v-product" style="text-align:left" placeholder="Tên SP..."></td>
                <td><span class="stage-badge cell-stage"></span></td>
                <td><input type="text" class="t-input v-gmv number-format" placeholder="0"></td>
                <td><input type="text" class="t-input v-orders number-format" placeholder="0"></td>
                <td><input type="text" class="t-input v-views number-format" placeholder="0"></td>
                <td><input type="text" class="t-input v-cast number-format" placeholder="0"></td>
                <td><div class="t-text t-text-bold col-cms-vnd">0</div></td>
                <td><div class="t-text t-text-bold col-cost" style="color:#e53e3e">0</div></td>
                <td class="show-booking"><div class="t-text t-text-bold col-roi" style="color:#38a169">0</div></td>
                <td class="show-booking col-tier"></td>
                <td class="show-booking col-rec"></td>
                <td class="show-tmdt"><div class="t-text t-text-bold col-net-sales">0</div></td>
                <td class="show-tmdt"><div class="t-text t-text-bold col-netprofit">0</div></td>
                <td class="show-tmdt"><div class="t-text t-text-bold col-profit-margin">0%</div></td>
                <td class="show-tmdt"><div class="t-text t-text-bold col-mer">0x</div></td>
                <td class="show-tmdt"><div class="t-text t-text-bold col-bep-gmv">0</div></td>
                <td class="show-tmdt col-tier-tmdt"></td>
                <td class="show-tmdt col-rec-tmdt"></td>
            `;

            tr.querySelector(".cell-name").textContent = row.name || "---";
            tr.querySelector(".v-product").value = row.product || "";
            tr.querySelector(".cell-stage").textContent = row.stage || "---";
            tr.querySelector(".v-gmv").value = formatNumber(row.gmv);
            tr.querySelector(".v-orders").value = formatNumber(row.orders);
            tr.querySelector(".v-views").value = formatNumber(row.real_views);
            tr.querySelector(".v-cast").value = formatNumber(row.cast);

            updateRowCalculations(tr, row);
            return tr;
        }

        function renderTable() {
            tableBody.innerHTML = "";

            const activeRows = sortRows(getActiveRows());
            if (!currentBrand || pipelineData.length === 0) {
                updateProductList();
                updateSummaryCards();
                return;
            }

            if (activeRows.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="19" style="padding:30px;color:#a0aec0">
                            Chưa có KOC nào chuyển sang giai đoạn thực thi để đo lường. Vui lòng cập nhật ở tab Pipeline.
                        </td>
                    </tr>
                `;
                updateProductList();
                updateSummaryCards();
                return;
            }

            const fragment = document.createDocumentFragment();
            activeRows.forEach((row) => fragment.appendChild(createRow(row)));
            tableBody.appendChild(fragment);

            updateProductList();
            updateSummaryCards();
        }

        function updateSortState(header) {
            const column = header.dataset.sort;
            if (!column) return;

            if (currentSort.col === column) currentSort.asc = !currentSort.asc;
            else currentSort = { col: column, asc: true };

            view.querySelectorAll("th.sortable").forEach((item) => item.classList.remove("asc", "desc"));
            header.classList.add(currentSort.asc ? "asc" : "desc");
            renderTable();
        }

        function updatePipelineField(input) {
            const rowElement = input.closest("tr[data-id]");
            if (!rowElement || !currentBrand) return;

            const rowData = pipelineData.find((row) => String(row.id ?? "") === rowElement.dataset.id);
            if (!rowData) return;

            if (input.classList.contains("v-product")) {
                rowData.product = input.value.trim();
            } else if (input.classList.contains("v-gmv")) {
                rowData.gmv = unformatNumber(input.value);
                input.value = formatNumber(rowData.gmv);
            } else if (input.classList.contains("v-orders")) {
                rowData.orders = unformatNumber(input.value);
                input.value = formatNumber(rowData.orders);
            } else if (input.classList.contains("v-views")) {
                rowData.real_views = unformatNumber(input.value);
                input.value = formatNumber(rowData.real_views);
            } else if (input.classList.contains("v-cast")) {
                rowData.cast = unformatNumber(input.value);
                input.value = formatNumber(rowData.cast);
            } else {
                return;
            }

            persistPipelineData();
            updateRowCalculations(rowElement, rowData);
            updateProductList();
            updateSummaryCards();
            showSync();
        }

        function exportExcel() {
            const activeRows = getActiveRows();
            if (activeRows.length === 0) {
                window.alert("Không có dữ liệu để xuất!");
                return;
            }

            if (!window.XLSX) {
                window.alert("Không thể xuất Excel vì thư viện XLSX chưa được nạp.");
                return;
            }

            const currentTab = dashboardContainer.dataset.tab;
            const exportData = activeRows.map((row) => {
                const metrics = calculateRowMetrics(row);
                const baseData = {
                    "KOC": row.name || "",
                    "Sản phẩm": row.product || "",
                    "Giai đoạn": row.stage || "",
                    "GMV (VNĐ)": metrics.gmv,
                    "Đơn hàng": unformatNumber(row.orders),
                    "View thực tế": unformatNumber(row.real_views),
                    "Cast (VNĐ)": metrics.cast,
                    "CMS (VNĐ)": metrics.cmsVND,
                    "Tổng chi phí (VNĐ)": metrics.totalCost
                };

                if (currentTab === "booking") {
                    const classification = getBookingClassification(metrics);
                    const tier = classification.tier.replace(/<[^>]*>/g, "");
                    return {
                        ...baseData,
                        "ROI (lần)": metrics.roi === 999 ? "Vô cực" : Number(metrics.roi.toFixed(2)),
                        "Phân loại Tier": tier
                    };
                }

                const classification = getTmdtClassification(metrics);
                const tier = classification.tier.replace(/<[^>]*>/g, "");
                return {
                    "KOC": row.name || "",
                    "Sản phẩm": row.product || "",
                    "Giai đoạn": row.stage || "",
                    "GMV (VNĐ)": metrics.gmv,
                    "Đơn hàng": unformatNumber(row.orders),
                    "View thực tế": unformatNumber(row.real_views),
                    "Cast (VNĐ)": metrics.cast,
                    "Tỷ lệ CMS (%)": metrics.cmsPercent,
                    "CMS thực nhận (VNĐ)": metrics.tmdtCmsVND,
                    "Hoàn / huỷ (%)": metrics.returnRate,
                    "Doanh thu thuần (VNĐ)": metrics.netSales,
                    "Lãi gộp biên (%)": metrics.marginPercent,
                    "Phí sàn & thanh toán (%)": metrics.platformFeePercent,
                    "Phí sàn & thanh toán (VNĐ)": metrics.platformFeeVND,
                    "Tổng chi phí KOC (VNĐ)": metrics.tmdtKocCost,
                    "Lãi đóng góp (VNĐ)": metrics.netProfit,
                    "Biên lãi đóng góp (%)": Number(metrics.profitMargin.toFixed(2)),
                    "MER thuần (lần)": metrics.mer === 999 ? "Vô cực" : Number(metrics.mer.toFixed(2)),
                    "GMV hòa vốn (VNĐ)": Number.isFinite(metrics.breakEvenGmv) ? metrics.breakEvenGmv : "Không thể",
                    "Phân loại TMĐT": tier
                };
            });

            const worksheet = window.XLSX.utils.json_to_sheet(exportData);
            const workbook = window.XLSX.utils.book_new();
            const sheetName = currentTab === "booking" ? "Do_Luong_Booking" : "Do_Luong_TMDT";
            window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            window.XLSX.writeFile(workbook, `${sheetName}_${currentBrand || "Data"}.xlsx`);
        }

        function refreshFromBrand() {
            currentBrand = getCurrentBrandId();
            currentSort = { col: null, asc: true };
            hydrateSettings();
            loadPipelineData();
            renderTable();
        }

        view.addEventListener("click", (event) => {
            const tab = event.target.closest(".dash-tab");
            if (tab && view.contains(tab)) {
                view.querySelectorAll(".dash-tab").forEach((item) => item.classList.remove("active"));
                tab.classList.add("active");
                dashboardContainer.dataset.tab = tab.dataset.target || "booking";
                renderTable();
                return;
            }

            const sortableHeader = event.target.closest("th.sortable");
            if (sortableHeader && view.contains(sortableHeader)) {
                updateSortState(sortableHeader);
            }
        }, { signal });

        view.addEventListener("change", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;

            if (target.matches("#set-tier-a, #set-tier-b, #set-margin, #set-return-rate, #set-platform-fee, #set-target-margin")) {
                saveSettings();
                return;
            }

            if (target.closest("#roi-table-body")) updatePipelineField(target);
        }, { signal });

        document.addEventListener("brand:changed", refreshFromBrand, { signal });
        exportButton?.addEventListener("click", exportExcel, { signal });
        printButton?.addEventListener("click", () => window.print(), { signal });

        refreshFromBrand();

        return () => {
            abortController.abort();
            window.clearTimeout(saveTimeout);
            syncBadge?.classList.remove("show");
        };
    };
})();
