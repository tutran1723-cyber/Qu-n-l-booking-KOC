/* global XLSX */
(() => {
    "use strict";

    const PIPELINE_STAGES = [
        "Tìm kiếm",
        "Đang liên hệ",
        "Đang đàm phán",
        "Đã chốt",
        "Đã lên bài",
        "Đo lường",
        "Tái hợp tác",
        "Đã loại"
    ];

    // Chỉ chuẩn hoá các giá trị legacy đã từng sinh từ Bulk Action cũ.
    const STAGE_ALIASES = {
        "Đang liên hệ/đàm phán": "Đang liên hệ",
        "Đang liên hệ / đàm phán": "Đang liên hệ",
        "Đã chốt / lên bài": "Đã chốt",
        "Đã chốt/lên bài": "Đã chốt"
    };

    function getPipelineTemplate() {
        return `
            <section class="pipeline-view" data-view="pipeline">
                <datalist id="industry-list"></datalist>
                <datalist id="content-type-list"></datalist>
                <div class="content-wrapper">
<div class="controls-area">
<button type="button" class="btn-red" id="btn-add-koc"><i class="fa-solid fa-plus"></i> Thêm KOC</button>
<button type="button" class="btn-teal" id="btn-import-koc"><i class="fa-solid fa-cloud-arrow-up"></i> Nạp từ thư viện</button>
<!-- Thanh công cụ cập nhật hàng loạt -->
<div class="bulk-actions-toolbar">
<i class="fa-solid fa-check-double" style="color: #A0AEC0;"></i>
<span>Đã chọn: <strong id="bulk-count">0</strong></span>
<select id="bulk-stage-select">
<option value="">-- Đổi giai đoạn --</option>
<option value="Tìm kiếm">Tìm kiếm</option>
<option value="Đang liên hệ">Đang liên hệ/đàm phán</option>
<option value="Đã chốt">Đã chốt / lên bài</option>
<option value="Đo lường">Đo lường</option>
<option value="Tái hợp tác">Tái hợp tác</option>
<option value="Đã loại">Đã loại</option>
</select>
<button type="button" class="btn-outline" id="btn-apply-bulk" style="padding: 5px 12px; font-size: 12px;">Áp dụng</button>
</div>
<div class="filter-group">
<label>Lọc giai đoạn:</label>
<select class="filter-select" id="filter-stage">
<option value="ALL">— Tất cả giai đoạn —</option>
<option value="Tìm kiếm">Tìm kiếm</option>
<option value="Đang liên hệ">Đang liên hệ/đàm phán</option>
<option value="Đã chốt">Đã chốt / lên bài</option>
<option value="Đo lường">Đo lường</option>
<option value="Tái hợp tác">Tái hợp tác</option>
<option value="Đã loại">Đã loại</option>
</select>
</div>
<div class="search-box">
<i class="fa-solid fa-search"></i>
<input id="search-input" placeholder="Tìm tên KOC / sản phẩm" type="text"/>
</div>
</div>
<div class="summary-grid">
<div class="summary-card sc-total">
<h2 id="sum-total">0</h2>
<p>Tổng KOC</p>
</div>
<div class="summary-card sc-contact">
<h2 id="sum-contact">0</h2>
<p>Đang liên hệ/Đàm phán</p>
</div>
<div class="summary-card sc-closed">
<h2 id="sum-closed">0</h2>
<p>Đã chốt / Lên bài</p>
</div>
<div class="summary-card sc-rebook">
<h2 id="sum-rebook">0</h2>
<p>Tái hợp tác</p>
</div>
<div class="summary-card sc-rejected">
<h2 id="sum-rejected">0</h2>
<p>Đã loại</p>
</div>
</div>
<div class="table-card">
<table>
<thead>
<tr>
<th style="width: 40px;"><input id="check-all" type="checkbox"/></th>
<th class="sortable" data-sort="name" style="width: 140px;">KOC (ID/LINK)</th>
<th style="width: 120px;">ZALO / SĐT</th>
<th style="width: 140px;">NGÀNH / LOẠI ND</th>
<th class="sortable" data-sort="follow" style="width: 80px;">FOLLOW</th>
<th class="sortable" data-sort="view" style="width: 80px;">VIEW TB</th>
<th style="width: 60px;">TT %</th>
<th style="width: 80px;">BÁN SP<br/>TƯƠNG TỰ</th>
<th style="width: 80px;">ND LIÊN<br/>QUAN</th>
<th class="sortable" data-sort="score" style="width: 60px;">ĐIỂM</th>
<th style="width: 160px;">SẢN PHẨM</th>
<th class="sortable" data-sort="cast" style="width: 90px;">CAST (Đ)</th>
<th style="width: 60px;">CMS %</th>
<th style="width: 150px;">GHI CHÚ</th>
<th class="sortable" data-sort="stage" style="width: 120px;">GIAI ĐOẠN</th>
<th style="width: 40px;"></th>
</tr>
</thead>
<tbody id="koc-table-body">
<!-- Data Render -->
</tbody>
</table>
</div>
                </div>
            </section>`;
    }

    function initPipelineController(root) {
        if (!(root instanceof Element)) return () => {};

        const view = root.querySelector('[data-view="pipeline"]');
        if (!view) return () => {};

        const abortController = new AbortController();
        const { signal } = abortController;
        const pendingInputSaves = new Map();
        const selectedRowIds = new Set();
        const syncBadge = document.querySelector("#sync-badge");
        const originalSyncHTML = syncBadge?.innerHTML || "";
        const body = document.body;

        let isDestroyed = false;
        let currentBrandId = getCurrentBrandId();
        let pipelineData = [];
        let currentSort = { col: null, asc: true };
        let searchTimerId = 0;
        let syncTimerId = 0;

        const $ = (selector, scope = view) => scope.querySelector(selector);
        const $$ = (selector, scope = view) => [...scope.querySelectorAll(selector)];
        const tableBody = $("#koc-table-body");
        const checkAll = $("#check-all");
        const bulkCountDisplay = $("#bulk-count");

        body.classList.add("pipeline-view-active");

        function on(target, eventName, listener, options = {}) {
            if (target) target.addEventListener(eventName, listener, { ...options, signal });
        }

        function readJSON(key, fallback) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : fallback;
            } catch (error) {
                console.warn(`Không thể đọc LocalStorage: ${key}`, error);
                return fallback;
            }
        }

        function getCurrentBrandId() {
            return window.KOCApp?.brand?.currentId || localStorage.getItem("sys_current_brand") || "";
        }

        function normalizeStage(stage) {
            const value = String(stage || "").trim();
            return STAGE_ALIASES[value] || value || "Tìm kiếm";
        }

        function toNumber(value) {
            if (typeof value === "number") return Number.isFinite(value) ? value : 0;
            if (value === null || value === undefined || value === "") return 0;

            let raw = String(value).trim().replace(/\s/g, "");
            if (!raw) return 0;

            const hasDot = raw.includes(".");
            const hasComma = raw.includes(",");

            if (hasDot && hasComma) {
                raw = raw.lastIndexOf(",") > raw.lastIndexOf(".")
                    ? raw.replace(/\./g, "").replace(",", ".")
                    : raw.replace(/,/g, "");
            } else if (hasComma) {
                const parts = raw.split(",");
                raw = parts.length === 2 && parts[1].length <= 2
                    ? raw.replace(",", ".")
                    : raw.replace(/,/g, "");
            } else if (hasDot) {
                // Follow, view và cast của Pipeline được hiểu là số nguyên.
                raw = raw.replace(/\./g, "");
            }

            const number = Number(raw);
            return Number.isFinite(number) ? number : 0;
        }

        function toDecimal(value) {
            if (value === null || value === undefined || String(value).trim() === "") return 0;

            const raw = String(value).trim().replace(/\s/g, "").replace("%", "");
            if (!raw) return 0;

            if (raw.includes(".") && !raw.includes(",")) {
                const parts = raw.split(".");
                if (parts.length === 2 && parts[1].length <= 2) {
                    const number = Number(raw);
                    return Number.isFinite(number) ? number : 0;
                }
            }

            if (raw.includes(",") && !raw.includes(".")) {
                const parts = raw.split(",");
                if (parts.length === 2 && parts[1].length <= 2) {
                    const number = Number(raw.replace(",", "."));
                    return Number.isFinite(number) ? number : 0;
                }
            }

            return toNumber(raw);
        }

        function formatNumber(value) {
            const number = toNumber(value);
            return number ? Math.round(number).toLocaleString("vi-VN") : "";
        }

        function normalizePercent(value) {
            if (value === null || value === undefined || String(value).trim() === "") return "";
            const number = Math.max(0, Math.min(100, toDecimal(String(value).replace("%", ""))));
            return Number.isInteger(number) ? String(number) : String(Math.round(number * 100) / 100);
        }

        function normalizeScore(value) {
            if (value === null || value === undefined || String(value).trim() === "") return "";
            const number = Math.max(0, Math.min(100, toDecimal(value)));
            return Number.isInteger(number) ? String(number) : String(Math.round(number * 100) / 100);
        }

        function formatDateTime(timestamp) {
            const number = Number(timestamp);
            return number ? new Date(number).toLocaleString("vi-VN") : "";
        }

        function calculateScoreClass(score) {
            if (score === "" || score === null || score === undefined) return "score-yellow";
            const numericScore = toNumber(score);
            if (numericScore >= 80) return "score-green";
            if (numericScore >= 60) return "score-yellow";
            return "score-red";
        }

        function createKoc(name = "", suffix = "") {
            const now = Date.now();
            return {
                id: `koc_${now}${suffix}`,
                name,
                contact: "",
                note: "",
                industry: "",
                content_type: "",
                follow: "",
                view: "",
                tt: "",
                sim_prod: false,
                rel_content: false,
                score: "",
                product: "",
                cast: "",
                cms: "",
                stage: "Tìm kiếm",
                created_at: now,
                last_updated: now,
                last_activity_at: now
            };
        }

        function migratePipelineData(rawData) {
            const sourceRows = Array.isArray(rawData) ? rawData : [];
            const now = Date.now();
            let wasChanged = !Array.isArray(rawData);

            const rows = sourceRows
                .filter((row) => row && typeof row === "object")
                .map((row, index) => {
                    const normalizedStage = normalizeStage(row.stage);
                    const id = row.id || `koc_${now}_${index}`;
                    const activityAt = Number(row.last_activity_at || row.last_updated || row.created_at || now);
                    const migrated = {
                        ...row,
                        id,
                        stage: normalizedStage,
                        created_at: Number(row.created_at || activityAt || now),
                        last_updated: Number(row.last_updated || activityAt || now),
                        last_activity_at: activityAt || now
                    };

                    if (
                        row.id !== migrated.id ||
                        row.stage !== migrated.stage ||
                        !row.created_at ||
                        !row.last_updated ||
                        !row.last_activity_at
                    ) {
                        wasChanged = true;
                    }
                    return migrated;
                });

            return { rows, wasChanged };
        }

        function touchRow(row, stageChanged = false) {
            const now = Date.now();
            row.last_activity_at = now;
            if (stageChanged) row.last_updated = now;
        }

        function savePipelineData(showMessage = true) {
            if (!currentBrandId) return;
            localStorage.setItem(`${currentBrandId}_koc_pipeline`, JSON.stringify(pipelineData));
            if (showMessage) showSync("Lưu thành công");
        }

        function showSync(message = "Lưu thành công") {
            if (!syncBadge || isDestroyed) return;

            window.clearTimeout(syncTimerId);
            syncBadge.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${message}`;
            syncBadge.classList.add("show");
            syncTimerId = window.setTimeout(() => {
                syncBadge?.classList.remove("show");
            }, 1500);
        }

        function getStaleInfo(row, now = Date.now()) {
            const stage = normalizeStage(row.stage);
            if (stage !== "Đang liên hệ" && stage !== "Đang đàm phán") {
                return { isStale: false, days: 0 };
            }

            const lastActivity = Number(row.last_activity_at || row.last_updated || row.created_at || now);
            const days = Math.max(0, Math.floor((now - lastActivity) / 86400000));
            return { isStale: days > 5, days };
        }

        function matchesSelectedStage(rowStage, filterStage) {
            if (filterStage === "ALL") return true;
            if (filterStage === "Đang liên hệ") {
                return rowStage === "Đang liên hệ" || rowStage === "Đang đàm phán";
            }
            if (filterStage === "Đã chốt") {
                return rowStage === "Đã chốt" || rowStage === "Đã lên bài";
            }
            return rowStage === filterStage;
        }

        function valueForSort(row, column) {
            if (["follow", "view", "score", "cast"].includes(column)) return toNumber(row[column]);
            return String(row[column] || "").toLocaleLowerCase("vi-VN");
        }

        function updateSummaryCards(rows) {
            let contact = 0;
            let closed = 0;
            let rebook = 0;
            let rejected = 0;

            rows.forEach((row) => {
                const stage = normalizeStage(row.stage);
                if (stage === "Đang liên hệ" || stage === "Đang đàm phán") contact += 1;
                else if (stage === "Đã chốt" || stage === "Đã lên bài") closed += 1;
                else if (stage === "Tái hợp tác") rebook += 1;
                else if (stage === "Đã loại") rejected += 1;
            });

            $("#sum-total").textContent = rows.length;
            $("#sum-contact").textContent = contact;
            $("#sum-closed").textContent = closed;
            $("#sum-rebook").textContent = rebook;
            $("#sum-rejected").textContent = rejected;
        }

        function updateDataLists() {
            const industries = new Set();
            const contentTypes = new Set();

            pipelineData.forEach((row) => {
                if (row.industry) industries.add(String(row.industry).trim());
                if (row.content_type) contentTypes.add(String(row.content_type).trim());
            });

            const industryList = $("#industry-list");
            const contentTypeList = $("#content-type-list");
            industryList.innerHTML = "";
            contentTypeList.innerHTML = "";

            [...industries].filter(Boolean).forEach((value) => {
                const option = document.createElement("option");
                option.value = value;
                industryList.appendChild(option);
            });

            [...contentTypes].filter(Boolean).forEach((value) => {
                const option = document.createElement("option");
                option.value = value;
                contentTypeList.appendChild(option);
            });
        }

        function updateBulkCount() {
            const visibleChecks = $$(".row-check");
            const visibleSelected = visibleChecks.filter((input) => input.checked).length;

            bulkCountDisplay.textContent = selectedRowIds.size;

            if (!visibleChecks.length) {
                checkAll.checked = false;
                checkAll.indeterminate = false;
                return;
            }

            checkAll.checked = visibleSelected === visibleChecks.length;
            checkAll.indeterminate = visibleSelected > 0 && visibleSelected < visibleChecks.length;
        }

        function createProductSelect(row, products) {
            const select = document.createElement("select");
            select.className = "t-input v-product";
            select.style.width = "100%";
            select.style.textAlign = "left";

            const blankOption = document.createElement("option");
            blankOption.value = "";
            blankOption.textContent = "-- Chọn SP --";
            select.appendChild(blankOption);

            let productExists = false;
            products.forEach((product) => {
                if (!product?.name) return;

                const option = document.createElement("option");
                option.value = product.name;
                option.textContent = product.name;
                if (product.cms !== undefined && product.cms !== null && product.cms !== "") {
                    option.dataset.cms = product.cms;
                }
                if (row.product === product.name) {
                    option.selected = true;
                    productExists = true;
                }
                select.appendChild(option);
            });

            if (row.product && !productExists) {
                const legacyOption = document.createElement("option");
                legacyOption.value = row.product;
                legacyOption.textContent = `${row.product} (Cũ/Tự nhập)`;
                legacyOption.selected = true;
                select.appendChild(legacyOption);
            }

            return select;
        }

        function createStageSelect(row) {
            const select = document.createElement("select");
            select.className = "t-input v-stage";
            select.style.width = "100%";

            const currentStage = normalizeStage(row.stage);
            if (!PIPELINE_STAGES.includes(currentStage)) {
                const legacyOption = document.createElement("option");
                legacyOption.value = currentStage;
                legacyOption.textContent = `${currentStage} (Giai đoạn cũ)`;
                legacyOption.selected = true;
                select.appendChild(legacyOption);
            }

            PIPELINE_STAGES.forEach((stage) => {
                const option = document.createElement("option");
                option.value = stage;
                option.textContent = stage;
                option.selected = stage === currentStage;
                select.appendChild(option);
            });

            return select;
        }

        function renderTable() {
            if (isDestroyed) return;

            tableBody.innerHTML = "";

            if (!currentBrandId) {
                updateSummaryCards([]);
                updateDataLists();
                updateBulkCount();
                return;
            }

            const products = readJSON(`${currentBrandId}_products_table`, []);
            const filterStage = $("#filter-stage").value;
            const searchText = $("#search-input").value.trim().toLocaleLowerCase("vi-VN");

            let filteredRows = pipelineData.filter((row) => {
                const combinedText = [
                    row.name,
                    row.product,
                    row.contact,
                    row.note,
                    row.industry,
                    row.content_type
                ].join(" ").toLocaleLowerCase("vi-VN");

                return matchesSelectedStage(normalizeStage(row.stage), filterStage) &&
                    combinedText.includes(searchText);
            });

            updateSummaryCards(filteredRows);

            if (currentSort.col) {
                filteredRows = [...filteredRows].sort((rowA, rowB) => {
                    const valueA = valueForSort(rowA, currentSort.col);
                    const valueB = valueForSort(rowB, currentSort.col);
                    if (valueA < valueB) return currentSort.asc ? -1 : 1;
                    if (valueA > valueB) return currentSort.asc ? 1 : -1;
                    return 0;
                });
            }

            const now = Date.now();
            const productRows = Array.isArray(products) ? products : [];

            filteredRows.forEach((row) => {
                const tr = document.createElement("tr");
                tr.dataset.id = row.id;

                const stale = getStaleInfo(row, now);
                if (stale.isStale) tr.classList.add("stale-row");

                tr.innerHTML = `
                    <td><input type="checkbox" class="row-check" aria-label="Chọn KOC"></td>
                    <td><input type="text" class="t-input t-input-left v-name" placeholder="Tên/ID..."></td>
                    <td><input type="text" class="t-input v-contact" placeholder="SĐT/Zalo..."></td>
                    <td>
                        <div class="stacked-inputs">
                            <input type="text" list="industry-list" class="t-input v-industry" placeholder="Ngành..." title="Nhập ngành">
                            <input type="text" list="content-type-list" class="t-input v-content-type" placeholder="Nội dung..." title="Nhập loại nội dung">
                        </div>
                    </td>
                    <td><input type="text" inputmode="numeric" class="t-input v-follow number-format" placeholder="..."></td>
                    <td><input type="text" inputmode="numeric" class="t-input v-view number-format" placeholder="..."></td>
                    <td><input type="text" inputmode="decimal" class="t-input v-tt" placeholder="%"></td>
                    <td><input type="checkbox" class="v-sim" aria-label="Bán sản phẩm tương tự"></td>
                    <td><input type="checkbox" class="v-rel" aria-label="Có nội dung liên quan"></td>
                    <td><div class="score-badge ${calculateScoreClass(row.score)}"><input type="text" inputmode="decimal" class="v-score" style="width:30px; background:transparent; border:none; text-align:center; font-weight:bold; color:inherit; outline:none;" aria-label="Điểm"></div></td>
                    <td class="td-product"></td>
                    <td><input type="text" inputmode="numeric" class="t-input v-cast number-format" placeholder="..."></td>
                    <td><input type="text" inputmode="decimal" class="t-input v-cms" placeholder="%"></td>
                    <td><input type="text" class="t-input t-input-left v-note" placeholder="Note..."></td>
                    <td class="td-stage">
                        ${stale.isStale
                            ? `<span class="stale-warning" title="Lần hoạt động gần nhất: ${formatDateTime(row.last_activity_at || row.last_updated)}"><i class="fa-solid fa-triangle-exclamation"></i> Ngâm ${stale.days} ngày</span>`
                            : ""}
                    </td>
                    <td><button type="button" class="row-delete-btn" title="Xóa KOC" aria-label="Xóa KOC"><i class="fa-solid fa-trash-can"></i></button></td>`;

                $(".row-check", tr).value = row.id;
                $(".row-check", tr).checked = selectedRowIds.has(row.id);
                $(".v-name", tr).value = row.name || "";
                $(".v-contact", tr).value = row.contact || "";
                $(".v-industry", tr).value = row.industry || row.tags || "";
                $(".v-content-type", tr).value = row.content_type || "";
                $(".v-follow", tr).value = formatNumber(row.follow);
                $(".v-view", tr).value = formatNumber(row.view);
                $(".v-tt", tr).value = row.tt || "";
                $(".v-sim", tr).checked = Boolean(row.sim_prod);
                $(".v-rel", tr).checked = Boolean(row.rel_content);
                $(".v-score", tr).value = row.score || "";
                $(".v-cast", tr).value = formatNumber(row.cast);
                $(".v-cms", tr).value = row.cms || "";
                $(".v-note", tr).value = row.note || "";

                $(".td-product", tr).appendChild(createProductSelect(row, productRows));
                $(".td-stage", tr).prepend(createStageSelect(row));
                tableBody.appendChild(tr);
            });

            updateDataLists();
            updateBulkCount();
        }

        function getRowContext(element) {
            const tr = element.closest("tr[data-id]");
            if (!tr) return null;
            const row = pipelineData.find((item) => item.id === tr.dataset.id);
            return row ? { tr, row } : null;
        }

        function applyFieldValue(row, tr, element, shouldFormat = false) {
            if (element.classList.contains("v-name")) row.name = element.value;
            if (element.classList.contains("v-contact")) row.contact = element.value;
            if (element.classList.contains("v-note")) row.note = element.value;
            if (element.classList.contains("v-industry")) row.industry = element.value;
            if (element.classList.contains("v-content-type")) row.content_type = element.value;

            if (element.classList.contains("v-follow")) {
                row.follow = toNumber(element.value);
                if (shouldFormat) element.value = formatNumber(row.follow);
            }

            if (element.classList.contains("v-view")) {
                row.view = toNumber(element.value);
                if (shouldFormat) element.value = formatNumber(row.view);
            }

            if (element.classList.contains("v-cast")) {
                row.cast = toNumber(element.value);
                if (shouldFormat) element.value = formatNumber(row.cast);
            }

            if (element.classList.contains("v-tt")) {
                row.tt = normalizePercent(element.value);
                if (shouldFormat) element.value = row.tt;
            }

            if (element.classList.contains("v-cms")) {
                row.cms = normalizePercent(element.value);
                if (shouldFormat) element.value = row.cms;
            }

            if (element.classList.contains("v-sim")) row.sim_prod = element.checked;
            if (element.classList.contains("v-rel")) row.rel_content = element.checked;

            if (element.classList.contains("v-score")) {
                row.score = normalizeScore(element.value);
                if (shouldFormat) element.value = row.score;
                const badge = element.closest(".score-badge");
                if (badge) badge.className = `score-badge ${calculateScoreClass(row.score)}`;
            }

            if (element.classList.contains("v-product")) {
                row.product = element.value;
                const cms = element.options[element.selectedIndex]?.dataset?.cms;
                if (cms !== undefined && cms !== "") {
                    row.cms = normalizePercent(cms);
                    $(".v-cms", tr).value = row.cms;
                }
            }

            if (element.classList.contains("v-stage")) {
                row.stage = normalizeStage(element.value);
                touchRow(row, true);
                return { requiresRender: true };
            }

            touchRow(row);
            return { requiresRender: false };
        }

        function commitPendingInput(input, shouldFormat = false) {
            const pending = pendingInputSaves.get(input);
            if (!pending) return { changed: false, requiresRender: false };

            window.clearTimeout(pending.timerId);
            pendingInputSaves.delete(input);

            const context = getRowContext(input);
            if (!context) return { changed: false, requiresRender: false };

            const result = applyFieldValue(context.row, context.tr, input, shouldFormat);
            return { changed: true, requiresRender: result.requiresRender };
        }

        function scheduleInputSave(input) {
            const existing = pendingInputSaves.get(input);
            if (existing) window.clearTimeout(existing.timerId);

            const timerId = window.setTimeout(() => {
                const result = commitPendingInput(input, false);
                if (result.changed) savePipelineData(false);
                if (result.requiresRender) renderTable();
            }, 500);

            pendingInputSaves.set(input, { timerId });
        }

        function flushPendingInputSaves() {
            let changed = false;
            let requiresRender = false;

            [...pendingInputSaves.keys()].forEach((input) => {
                const result = commitPendingInput(input, false);
                changed ||= result.changed;
                requiresRender ||= result.requiresRender;
            });

            if (changed) savePipelineData(false);
            if (requiresRender) renderTable();
        }

        function loadPipelineData() {
            if (!currentBrandId) {
                pipelineData = [];
                selectedRowIds.clear();
                renderTable();
                return;
            }

            const migrated = migratePipelineData(readJSON(`${currentBrandId}_koc_pipeline`, []));
            pipelineData = migrated.rows;
            selectedRowIds.clear();

            if (migrated.wasChanged) savePipelineData(false);
            renderTable();
        }

        function handleAddKoc() {
            if (!currentBrandId) {
                window.alert("Vui lòng chọn hoặc tạo thương hiệu trước!");
                return;
            }

            flushPendingInputSaves();
            pipelineData.unshift(createKoc());
            savePipelineData(true);
            $("#search-input").value = "";
            $("#filter-stage").value = "ALL";
            renderTable();
        }

        function handleImportKoc() {
            if (!currentBrandId) {
                window.alert("Vui lòng chọn nhãn hàng trước!");
                return;
            }

            const rawNames = window.prompt("Dán danh sách KOC ID (mỗi ID cách nhau bằng dấu phẩy hoặc xuống dòng):");
            if (!rawNames) return;

            const uniqueNames = [...new Set(
                rawNames
                    .split(/[\n,]+/)
                    .map((name) => name.trim())
                    .filter(Boolean)
            )];

            if (!uniqueNames.length) return;

            flushPendingInputSaves();

            const currentNames = new Set(
                pipelineData
                    .map((row) => String(row.name || "").trim().toLocaleLowerCase("vi-VN"))
                    .filter(Boolean)
            );

            const namesToAdd = uniqueNames.filter(
                (name) => !currentNames.has(name.toLocaleLowerCase("vi-VN"))
            );

            if (!namesToAdd.length) {
                window.alert("Các KOC này đã có trong Pipeline.");
                return;
            }

            const timestamp = Date.now();
            [...namesToAdd].reverse().forEach((name, index) => {
                pipelineData.unshift(createKoc(name, `_${timestamp}_${index}`));
            });

            savePipelineData(true);
            $("#search-input").value = "";
            $("#filter-stage").value = "ALL";
            renderTable();

            const skipped = uniqueNames.length - namesToAdd.length;
            window.alert(
                `Đã thêm thành công ${namesToAdd.length} KOC vào Pipeline.` +
                (skipped ? ` (${skipped} KOC trùng đã được bỏ qua).` : "")
            );
        }

        function handleApplyBulkStage() {
            const select = $("#bulk-stage-select");
            if (!select.value) {
                window.alert("Vui lòng chọn Giai đoạn cần cập nhật!");
                return;
            }

            if (!selectedRowIds.size) {
                window.alert("Vui lòng chọn ít nhất 1 KOC!");
                return;
            }

            const stage = normalizeStage(select.value);
            pipelineData.forEach((row) => {
                if (selectedRowIds.has(row.id)) {
                    row.stage = stage;
                    touchRow(row, true);
                }
            });

            savePipelineData(true);
            select.value = "";
            selectedRowIds.clear();
            renderTable();
        }

        function handleDeleteRow(button) {
            const context = getRowContext(button);
            if (!context) return;
            if (!window.confirm("Xóa KOC này khỏi Pipeline?")) return;

            flushPendingInputSaves();
            pipelineData = pipelineData.filter((row) => row.id !== context.row.id);
            selectedRowIds.delete(context.row.id);
            savePipelineData(true);
            renderTable();
        }

        function handleSort(header) {
            const column = header.dataset.sort;
            if (!column) return;

            if (currentSort.col === column) currentSort.asc = !currentSort.asc;
            else currentSort = { col: column, asc: true };

            $$(".sortable").forEach((item) => item.classList.remove("asc", "desc"));
            header.classList.add(currentSort.asc ? "asc" : "desc");
            renderTable();
        }

        function exportPipeline() {
            flushPendingInputSaves();

            if (!pipelineData.length) {
                window.alert("Không có dữ liệu để xuất!");
                return;
            }

            if (!window.XLSX) {
                window.alert("Không thể xuất Excel vì thư viện SheetJS (XLSX) chưa được nạp.");
                return;
            }

            const rows = pipelineData.map((row) => ({
                "Tên/ID KOC": row.name || "",
                "Zalo/SĐT": row.contact || "",
                "Ngành": row.industry || "",
                "Nội dung": row.content_type || "",
                "Follow": toNumber(row.follow),
                "View TB": toNumber(row.view),
                "TT %": row.tt || "",
                "Bán SP tương tự": row.sim_prod ? "Có" : "Không",
                "ND liên quan": row.rel_content ? "Có" : "Không",
                "Điểm": row.score || "",
                "Sản phẩm": row.product || "",
                "Cast (VNĐ)": toNumber(row.cast),
                "CMS (%)": row.cms || "",
                "Ghi chú": row.note || "",
                "Giai đoạn": normalizeStage(row.stage),
                "Cập nhật gần nhất": formatDateTime(row.last_activity_at || row.last_updated)
            }));

            const worksheet = XLSX.utils.json_to_sheet(rows);
            if (worksheet["!ref"]) {
                worksheet["!autofilter"] = {
                    ref: XLSX.utils.encode_range(XLSX.utils.decode_range(worksheet["!ref"]))
                };
            }
            worksheet["!cols"] = [
                { wch: 24 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 12 },
                { wch: 12 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 10 },
                { wch: 24 }, { wch: 16 }, { wch: 12 }, { wch: 28 }, { wch: 18 }, { wch: 22 }
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Pipeline");
            XLSX.writeFile(workbook, `Pipeline_KOC_${currentBrandId || "Data"}.xlsx`);
        }

        function handleRootClick(event) {
            const deleteButton = event.target.closest(".row-delete-btn");
            if (deleteButton && view.contains(deleteButton)) {
                handleDeleteRow(deleteButton);
                return;
            }

            const sortHeader = event.target.closest("th.sortable");
            if (sortHeader && view.contains(sortHeader)) {
                handleSort(sortHeader);
                return;
            }

            const button = event.target.closest("button");
            if (!button || !view.contains(button)) return;

            if (button.id === "btn-add-koc") handleAddKoc();
            if (button.id === "btn-import-koc") handleImportKoc();
            if (button.id === "btn-apply-bulk") handleApplyBulkStage();
        }

        function handleRootInput(event) {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;

            if (target.id === "search-input") {
                window.clearTimeout(searchTimerId);
                searchTimerId = window.setTimeout(renderTable, 300);
                return;
            }

            if (target.classList.contains("row-check")) return;
            if (!target.closest("tr[data-id]")) return;

            scheduleInputSave(target);
        }

        function handleRootChange(event) {
            const target = event.target;

            if (target === checkAll) {
                $$(".row-check").forEach((input) => {
                    input.checked = checkAll.checked;
                    if (checkAll.checked) selectedRowIds.add(input.value);
                    else selectedRowIds.delete(input.value);
                });
                updateBulkCount();
                return;
            }

            if (target instanceof HTMLInputElement && target.classList.contains("row-check")) {
                if (target.checked) selectedRowIds.add(target.value);
                else selectedRowIds.delete(target.value);
                updateBulkCount();
                return;
            }

            if (target.id === "filter-stage") {
                renderTable();
                return;
            }

            if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
            if (!target.closest("tr[data-id]")) return;

            // Tránh để bản autosave 500ms ghi đè giá trị đã chuẩn hoá khi người dùng blur.
            const pendingResult = commitPendingInput(target, true);
            if (pendingResult.changed) {
                savePipelineData(true);
                if (pendingResult.requiresRender) renderTable();
                return;
            }

            const context = getRowContext(target);
            if (!context) return;

            const result = applyFieldValue(context.row, context.tr, target, true);
            savePipelineData(true);
            if (result.requiresRender) renderTable();
        }

        function handleBrandChanged(event) {
            // Lưu phần người dùng đang gõ cho thương hiệu cũ trước khi đổi brand.
            flushPendingInputSaves();
            currentBrandId = event.detail?.brand?.id || getCurrentBrandId();
            currentSort = { col: null, asc: true };
            loadPipelineData();
        }

        function handleStorage(event) {
            if (!currentBrandId) return;

            if (event.key === `${currentBrandId}_koc_pipeline`) {
                flushPendingInputSaves();
                loadPipelineData();
                showSync("Đã cập nhật từ tab khác");
            }

            if (event.key === `${currentBrandId}_products_table`) {
                flushPendingInputSaves();
                renderTable();
                showSync("Danh sách sản phẩm đã cập nhật");
            }
        }

        on(view, "click", handleRootClick);
        on(view, "input", handleRootInput);
        on(view, "change", handleRootChange);
        on(document, "brand:changed", handleBrandChanged);
        on(window, "storage", handleStorage);
        on(window, "beforeunload", flushPendingInputSaves);

        // Header là App Shell dùng chung; các listener này bị hủy bằng AbortController khi đổi route.
        on(document.querySelector("#btn-export"), "click", exportPipeline);
        on(document.querySelector("#btn-print"), "click", () => {
            flushPendingInputSaves();
            window.print();
        });

        // Hàm này chỉ chạy sau khi Router đã gắn template vào #app-content.
        loadPipelineData();

        return () => {
            if (isDestroyed) return;
            flushPendingInputSaves();
            isDestroyed = true;

            abortController.abort();
            window.clearTimeout(searchTimerId);
            window.clearTimeout(syncTimerId);

            pendingInputSaves.forEach(({ timerId }) => window.clearTimeout(timerId));
            pendingInputSaves.clear();

            body.classList.remove("pipeline-view-active");
            if (syncBadge) {
                syncBadge.classList.remove("show");
                syncBadge.innerHTML = originalSyncHTML;
            }
        };
    }

    window.KOCViewTemplates = window.KOCViewTemplates || {};
    window.KOCViewTemplates.pipeline = getPipelineTemplate;

    // Hai alias để tương thích với Router hiện tại và cách đặt tên của các view khác.
    window.initPipelineController = initPipelineController;
    window.initpipelineController = initPipelineController;
    window.initViewPipeline = initPipelineController;
})();
