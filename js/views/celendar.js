/* global XLSX */
(() => {
    "use strict";

    const STATUS_OPTIONS = [
        "Chờ quay",
        "Chờ duyệt",
        "Phải sửa",
        "Đã duyệt",
        "Đã lên bài",
        "Hủy"
    ];

    const IMPORTABLE_PIPELINE_STAGES = new Set(["Đã chốt", "Đã lên bài", "Đo lường"]);

    function getCalendarTemplate() {
        return `
            <section class="calendar-view" data-view="calendar">
                <datalist id="calendar-platform-list">
                    <option value="TikTok"></option>
                    <option value="Facebook Reels"></option>
                    <option value="Youtube Shorts"></option>
                    <option value="Instagram Reels"></option>
                </datalist>

                <div class="content-wrapper">
                    <div class="controls-area">
                        <button class="btn-red" id="calendar-btn-add-task" type="button">
                            <i class="fa-solid fa-plus"></i> Thêm lịch mới
                        </button>
                        <button class="btn-teal" id="calendar-btn-import-pipeline" type="button">
                            <i class="fa-solid fa-cloud-arrow-down"></i> Lấy KOC từ Pipeline
                        </button>

                        <div class="filter-group calendar-filter-group">
                            <label for="calendar-filter-status">Trạng thái:</label>
                            <select class="filter-select" id="calendar-filter-status">
                                <option value="ALL">— Tất cả tiến độ —</option>
                                <option value="Chờ quay">Chờ quay</option>
                                <option value="Chờ duyệt">Chờ duyệt</option>
                                <option value="Phải sửa">Phải sửa</option>
                                <option value="Đã duyệt">Đã duyệt (Chờ lên)</option>
                                <option value="Đã lên bài">Đã lên bài</option>
                            </select>
                        </div>

                        <label class="search-box" for="calendar-search-input">
                            <i class="fa-solid fa-search"></i>
                            <input type="search" id="calendar-search-input" placeholder="Tìm tên KOC / SP...">
                        </label>
                    </div>

                    <div class="summary-grid">
                        <div class="summary-card sc-total">
                            <h2 id="calendar-sum-total">0</h2>
                            <p>Tổng Booking</p>
                        </div>
                        <div class="summary-card sc-pending">
                            <h2 id="calendar-sum-pending">0</h2>
                            <p>Đang sản xuất</p>
                        </div>
                        <div class="summary-card sc-late">
                            <h2 id="calendar-sum-late">0</h2>
                            <p>Trễ hạn (Overdue)</p>
                        </div>
                        <div class="summary-card sc-done">
                            <h2 id="calendar-sum-done">0</h2>
                            <p>Đã lên bài</p>
                        </div>
                    </div>

                    <div class="table-card">
                        <table>
                            <thead>
                                <tr>
                                    <th class="sortable" data-sort="name" style="width:150px">KOC (ID/TÊN)</th>
                                    <th class="sortable" data-sort="product" style="width:160px">SẢN PHẨM</th>
                                    <th style="width:110px">NỀN TẢNG</th>
                                    <th class="sortable" data-sort="date_draft" style="width:120px">HẠN GỬI NHÁP</th>
                                    <th class="sortable" data-sort="date_publish" style="width:120px">HẠN LÊN BÀI</th>
                                    <th class="sortable" data-sort="status" style="width:140px">TRẠNG THÁI</th>
                                    <th style="width:180px">LINK VIDEO (Nháp/Chính)</th>
                                    <th style="width:150px">GHI CHÚ</th>
                                    <th aria-label="Thao tác" style="width:40px"></th>
                                </tr>
                            </thead>
                            <tbody id="calendar-schedule-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </section>`;
    }

    function initViewCalendar(appContent) {
        const root = appContent.querySelector(".calendar-view");
        if (!root) return () => {};

        const abortController = new AbortController();
        const { signal } = abortController;
        const cleanups = [];

        const $ = (selector, container = root) => container.querySelector(selector);
        const tableBody = $("#calendar-schedule-table-body");
        const filterStatusEl = $("#calendar-filter-status");
        const searchInputEl = $("#calendar-search-input");
        const addButton = $("#calendar-btn-add-task");
        const importButton = $("#calendar-btn-import-pipeline");
        const exportButton = document.getElementById("btn-export");
        const printButton = document.getElementById("btn-print");
        const shellBadge = document.getElementById("sync-badge");
        const shellBadgeHTML = shellBadge ? shellBadge.innerHTML : "";

        let currentBrandId = getCurrentBrandId();
        let scheduleData = [];
        let currentSort = { col: null, asc: true };
        let saveTimeoutId = 0;
        let autosaveTimerId = 0;
        let searchTimerId = 0;

        function on(target, type, handler, options = {}) {
            if (!target) return;
            target.addEventListener(type, handler, { ...options, signal });
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
            const appBrand = window.KOCApp?.brand?.getCurrent?.();
            return appBrand?.id || "";
        }

        function getCurrentBrandName() {
            return window.KOCApp?.brand?.getCurrent?.()?.name || "Data";
        }

        function normalizeText(value) {
            return String(value || "").trim().toLocaleLowerCase("vi-VN");
        }

        function createScheduleId() {
            return `sch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        }

        function normalizeScheduleRow(row = {}) {
            return {
                ...row,
                id: row.id || createScheduleId(),
                from_pipeline: Boolean(row.from_pipeline),
                pipeline_id: row.pipeline_id || null,
                name: row.name || "",
                product: row.product || "",
                platform: row.platform || "TikTok",
                date_draft: row.date_draft || "",
                date_publish: row.date_publish || "",
                status: STATUS_OPTIONS.includes(row.status) ? row.status : "Chờ quay",
                link: row.link || "",
                note: row.note || "",
                last_updated: Number(row.last_updated) || Date.now()
            };
        }

        function getStatusClass(status) {
            const classes = {
                "Chờ quay": "st-cho-quay",
                "Chờ duyệt": "st-cho-duyet",
                "Phải sửa": "st-phai-sua",
                "Đã duyệt": "st-da-duyet",
                "Đã lên bài": "st-da-len-bai",
                "Hủy": "st-huy"
            };
            return classes[status] || "st-cho-quay";
        }

        function dateToNumber(dateStr) {
            if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 0;
            const [year, month, day] = dateStr.split("-").map(Number);
            return new Date(year, month - 1, day).getTime();
        }

        function isOverdue(dateStr, status) {
            if (!dateStr || status === "Đã lên bài" || status === "Hủy") return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return dateToNumber(dateStr) < today.getTime();
        }

        function setBadgeMessage(message) {
            if (!shellBadge) return;
            shellBadge.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span class="calendar-sync-label"></span>`;
            $(".calendar-sync-label", shellBadge).textContent = message;
        }

        function showSync(message = "Đã lưu tiến độ") {
            if (!shellBadge) return;
            setBadgeMessage(message);
            shellBadge.classList.add("show");
            window.clearTimeout(saveTimeoutId);
            saveTimeoutId = window.setTimeout(() => shellBadge.classList.remove("show"), 2000);
        }

        function persistSchedule(showMessage = true, message = "Đã lưu tiến độ") {
            if (!currentBrandId) return;
            window.clearTimeout(autosaveTimerId);
            autosaveTimerId = 0;
            scheduleData = scheduleData.map(normalizeScheduleRow);
            localStorage.setItem(`${currentBrandId}_koc_schedule`, JSON.stringify(scheduleData));
            if (showMessage) showSync(message);
        }

        function queuePersist() {
            if (!currentBrandId) return;
            window.clearTimeout(autosaveTimerId);
            autosaveTimerId = window.setTimeout(() => persistSchedule(true), 450);
        }

        function flushPendingSave() {
            if (!autosaveTimerId) return;
            window.clearTimeout(autosaveTimerId);
            autosaveTimerId = 0;
            persistSchedule(false);
        }

        function getRowById(id) {
            return scheduleData.find((row) => row.id === id) || null;
        }

        function updateSummaryCards() {
            let pending = 0;
            let late = 0;
            let done = 0;

            scheduleData.forEach((row) => {
                if (row.status === "Đã lên bài") {
                    done += 1;
                    return;
                }
                if (row.status !== "Hủy") {
                    pending += 1;
                    const draftLate = row.status === "Chờ quay" && isOverdue(row.date_draft, row.status);
                    const publishLate = isOverdue(row.date_publish, row.status);
                    if (draftLate || publishLate) late += 1;
                }
            });

            $("#calendar-sum-total").textContent = String(scheduleData.length);
            $("#calendar-sum-pending").textContent = String(pending);
            $("#calendar-sum-late").textContent = String(late);
            $("#calendar-sum-done").textContent = String(done);
        }

        function renderTable() {
            tableBody.replaceChildren();

            if (!currentBrandId) {
                updateSummaryCards();
                return;
            }

            const selectedStatus = filterStatusEl.value;
            const searchText = normalizeText(searchInputEl.value);

            let displayedRows = scheduleData.filter((row) => {
                const matchesStatus = selectedStatus === "ALL" || row.status === selectedStatus;
                const matchesSearch = !searchText
                    || normalizeText(row.name).includes(searchText)
                    || normalizeText(row.product).includes(searchText)
                    || normalizeText(row.platform).includes(searchText)
                    || normalizeText(row.note).includes(searchText);
                return matchesStatus && matchesSearch;
            });

            if (currentSort.col) {
                displayedRows = [...displayedRows].sort((a, b) => {
                    let aValue = a[currentSort.col] || "";
                    let bValue = b[currentSort.col] || "";

                    if (["date_draft", "date_publish"].includes(currentSort.col)) {
                        aValue = dateToNumber(aValue);
                        bValue = dateToNumber(bValue);
                    } else {
                        aValue = normalizeText(aValue);
                        bValue = normalizeText(bValue);
                    }

                    if (aValue < bValue) return currentSort.asc ? -1 : 1;
                    if (aValue > bValue) return currentSort.asc ? 1 : -1;
                    return 0;
                });
            }

            const fragment = document.createDocumentFragment();

            displayedRows.forEach((row) => {
                const tr = document.createElement("tr");
                tr.dataset.id = row.id;

                const overdueDraft = isOverdue(row.date_draft, row.status) && row.status === "Chờ quay";
                const overduePublish = isOverdue(row.date_publish, row.status);

                tr.innerHTML = `
                    <td><input class="t-input t-input-left v-name" type="text" placeholder="Tên KOC..."></td>
                    <td><input class="t-input t-input-left v-product" type="text" placeholder="SP review..."></td>
                    <td><input class="t-input v-platform" type="text" list="calendar-platform-list" placeholder="Nền tảng..."></td>
                    <td class="td-draft">
                        <input class="t-input v-date-draft" type="date">
                        ${overdueDraft ? '<span class="date-alert"><i class="fa-solid fa-circle-exclamation"></i> Trễ nháp</span>' : ""}
                    </td>
                    <td class="td-publish">
                        <input class="t-input v-date-publish" type="date">
                        ${overduePublish ? '<span class="date-alert"><i class="fa-solid fa-circle-exclamation"></i> Trễ bài</span>' : ""}
                    </td>
                    <td>
                        <select class="t-input status-select ${getStatusClass(row.status)}">
                            ${STATUS_OPTIONS.map((status) => `<option value="${status}">${status}</option>`).join("")}
                        </select>
                    </td>
                    <td><input class="t-input v-link" type="text" placeholder="Dán link (Drive/Tiktok)..."></td>
                    <td><input class="t-input v-note" type="text" placeholder="Ghi chú..."></td>
                    <td>
                        <button class="row-delete-btn" type="button" title="Xóa lịch này" aria-label="Xóa lịch này">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>`;

                $(".v-name", tr).value = row.name;
                $(".v-product", tr).value = row.product;
                $(".v-platform", tr).value = row.platform;
                $(".v-date-draft", tr).value = row.date_draft;
                $(".v-date-publish", tr).value = row.date_publish;
                $(".v-date-publish", tr).min = row.date_draft || "";
                $(".status-select", tr).value = row.status;
                $(".v-link", tr).value = row.link;
                $(".v-note", tr).value = row.note;
                fragment.appendChild(tr);
            });

            tableBody.appendChild(fragment);
            updateSummaryCards();
        }

        function loadScheduleData() {
            if (!currentBrandId) {
                scheduleData = [];
                renderTable();
                return;
            }

            const storedRows = readJSON(`${currentBrandId}_koc_schedule`, []);
            scheduleData = Array.isArray(storedRows) ? storedRows.map(normalizeScheduleRow) : [];
            localStorage.setItem(`${currentBrandId}_koc_schedule`, JSON.stringify(scheduleData));
            renderTable();
        }

        function isSameIdentity(scheduleRow, pipelineRow) {
            if (scheduleRow.pipeline_id && pipelineRow.id) {
                return String(scheduleRow.pipeline_id) === String(pipelineRow.id);
            }

            return normalizeText(scheduleRow.name) === normalizeText(pipelineRow.name)
                && normalizeText(scheduleRow.product) === normalizeText(pipelineRow.product);
        }

        function buildScheduleFromPipeline(pipelineRow) {
            const complete = pipelineRow.stage === "Đã lên bài" || pipelineRow.stage === "Đo lường";

            return normalizeScheduleRow({
                id: createScheduleId(),
                pipeline_id: pipelineRow.id || null,
                from_pipeline: true,
                name: pipelineRow.name || "",
                product: pipelineRow.product || "",
                platform: "TikTok",
                date_draft: "",
                date_publish: "",
                status: complete ? "Đã lên bài" : "Chờ quay",
                link: "",
                note: ""
            });
        }

        function mergePipelineIntoSchedule(pipelineRows, { createMissing = false } = {}) {
            let added = 0;
            let updated = 0;
            const eligibleRows = pipelineRows.filter((row) => IMPORTABLE_PIPELINE_STAGES.has(row.stage));

            eligibleRows.forEach((pipelineRow) => {
                let scheduleRow = scheduleData.find((row) => isSameIdentity(row, pipelineRow));

                if (!scheduleRow && createMissing) {
                    scheduleData.unshift(buildScheduleFromPipeline(pipelineRow));
                    added += 1;
                    return;
                }

                if (!scheduleRow) return;

                let changed = false;
                ["name", "product"].forEach((field) => {
                    const incoming = pipelineRow[field] || "";
                    if (scheduleRow[field] !== incoming) {
                        scheduleRow[field] = incoming;
                        changed = true;
                    }
                });

                if (pipelineRow.id && String(scheduleRow.pipeline_id || "") !== String(pipelineRow.id)) {
                    scheduleRow.pipeline_id = pipelineRow.id;
                    changed = true;
                }

                if (!scheduleRow.from_pipeline) {
                    scheduleRow.from_pipeline = true;
                    changed = true;
                }

                if (
                    ["Đã lên bài", "Đo lường"].includes(pipelineRow.stage)
                    && !["Đã lên bài", "Hủy"].includes(scheduleRow.status)
                ) {
                    scheduleRow.status = "Đã lên bài";
                    changed = true;
                }

                if (changed) {
                    scheduleRow.last_updated = Date.now();
                    updated += 1;
                }
            });

            return { added, updated, eligibleCount: eligibleRows.length };
        }

        function exportCalendar() {
            if (!scheduleData.length) {
                window.alert("Không có dữ liệu để xuất!");
                return;
            }

            if (!window.XLSX) {
                window.alert("Chưa tải được thư viện Excel (XLSX).");
                return;
            }

            const rows = scheduleData.map((row) => ({
                "KOC (Tên/ID)": row.name || "",
                "Sản phẩm": row.product || "",
                "Nền tảng": row.platform || "",
                "Hạn gửi nháp": row.date_draft || "",
                "Hạn lên bài": row.date_publish || "",
                "Trạng thái": row.status || "",
                "Link Video/Nháp": row.link || "",
                "Ghi chú": row.note || "",
                "Cập nhật gần nhất": row.last_updated
                    ? new Date(row.last_updated).toLocaleString("vi-VN")
                    : ""
            }));

            const worksheet = XLSX.utils.json_to_sheet(rows);
            worksheet["!cols"] = [
                { wch: 24 }, { wch: 24 }, { wch: 18 }, { wch: 15 }, { wch: 15 },
                { wch: 16 }, { wch: 45 }, { wch: 35 }, { wch: 22 }
            ];
            worksheet["!autofilter"] = { ref: `A1:I${rows.length + 1}` };

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lich_Len_Bai");

            const safeBrandName = getCurrentBrandName()
                .replace(/[\\/:*?"<>|]+/g, "_")
                .replace(/\s+/g, "_");

            XLSX.writeFile(workbook, `Lich_Len_Bai_${safeBrandName}.xlsx`);
        }

        function handleRootClick(event) {
            const deleteButton = event.target.closest(".row-delete-btn");
            if (deleteButton) {
                const tr = deleteButton.closest("tr");
                const row = tr ? getRowById(tr.dataset.id) : null;
                if (!row || !window.confirm("Xóa lịch trình của KOC này?")) return;

                flushPendingSave();
                scheduleData = scheduleData.filter((item) => item.id !== row.id);
                persistSchedule(false);
                renderTable();
                showSync("Đã xóa lịch");
                return;
            }

            const sortableHeader = event.target.closest("th.sortable");
            if (!sortableHeader) return;

            const column = sortableHeader.dataset.sort;
            currentSort = currentSort.col === column
                ? { col: column, asc: !currentSort.asc }
                : { col: column, asc: true };

            root.querySelectorAll("th.sortable").forEach((header) => {
                header.classList.toggle("asc", header === sortableHeader && currentSort.asc);
                header.classList.toggle("desc", header === sortableHeader && !currentSort.asc);
            });

            renderTable();
        }

        function handleTextUpdate(input) {
            const tr = input.closest("tr");
            const row = tr ? getRowById(tr.dataset.id) : null;
            if (!row) return;

            if (input.classList.contains("v-name")) row.name = input.value;
            if (input.classList.contains("v-product")) row.product = input.value;
            if (input.classList.contains("v-platform")) row.platform = input.value;
            if (input.classList.contains("v-link")) row.link = input.value;
            if (input.classList.contains("v-note")) row.note = input.value;

            row.last_updated = Date.now();
            queuePersist();
        }

        function handleRootInput(event) {
            if (event.target === searchInputEl) {
                window.clearTimeout(searchTimerId);
                searchTimerId = window.setTimeout(renderTable, 300);
                return;
            }

            if (event.target.matches("input[type='text'].t-input")) {
                handleTextUpdate(event.target);
            }
        }

        function handleRootChange(event) {
            if (event.target === filterStatusEl) {
                renderTable();
                return;
            }

            if (event.target.matches("input[type='text'].t-input")) {
                const input = event.target;
                const tr = input.closest("tr");
                const row = tr ? getRowById(tr.dataset.id) : null;
                if (!row) return;

                handleTextUpdate(input);

                if (input.classList.contains("v-link") && row.link.trim() && row.status === "Chờ quay") {
                    row.status = "Chờ duyệt";
                    row.last_updated = Date.now();
                    persistSchedule(false);
                    renderTable();
                    return;
                }

                persistSchedule(true);
                return;
            }

            const tr = event.target.closest("tr");
            const row = tr ? getRowById(tr.dataset.id) : null;
            if (!row) return;

            if (event.target.matches(".v-date-draft")) {
                row.date_draft = event.target.value;
                const publishInput = $(".v-date-publish", tr);
                publishInput.min = row.date_draft || "";

                if (row.date_publish && dateToNumber(row.date_publish) < dateToNumber(row.date_draft)) {
                    row.date_publish = "";
                    showSync("Đã xóa hạn lên bài vì sớm hơn hạn gửi nháp");
                }

                row.last_updated = Date.now();
                persistSchedule(false);
                renderTable();
                return;
            }

            if (event.target.matches(".v-date-publish")) {
                if (
                    event.target.value
                    && row.date_draft
                    && dateToNumber(event.target.value) < dateToNumber(row.date_draft)
                ) {
                    window.alert("Hạn lên bài không thể sớm hơn hạn gửi nháp. Vui lòng chọn lại ngày.");
                    event.target.value = row.date_publish || "";
                    return;
                }

                row.date_publish = event.target.value;
                row.last_updated = Date.now();
                persistSchedule(false);
                renderTable();
                return;
            }

            if (event.target.matches(".status-select")) {
                row.status = event.target.value;
                row.last_updated = Date.now();
                persistSchedule(false);
                renderTable();
            }
        }

        function handleAddTask() {
            if (!currentBrandId) {
                window.alert("Vui lòng chọn hoặc tạo thương hiệu trước!");
                return;
            }

            flushPendingSave();
            scheduleData.unshift(normalizeScheduleRow({
                id: createScheduleId(),
                from_pipeline: false,
                name: "",
                product: "",
                platform: "TikTok",
                date_draft: "",
                date_publish: "",
                status: "Chờ quay",
                link: "",
                note: ""
            }));
            persistSchedule(false);
            renderTable();
            showSync("Đã tạo lịch mới");
        }

        function handleImportPipeline() {
            if (!currentBrandId) {
                window.alert("Vui lòng chọn thương hiệu trước!");
                return;
            }

            flushPendingSave();
            const pipeline = readJSON(`${currentBrandId}_koc_pipeline`, []);
            const result = mergePipelineIntoSchedule(Array.isArray(pipeline) ? pipeline : [], { createMissing: true });

            if (result.eligibleCount === 0) {
                window.alert("Không có KOC nào trong Pipeline ở trạng thái 'Đã chốt', 'Đã lên bài' hoặc 'Đo lường' để nạp.");
                return;
            }

            persistSchedule(false);
            renderTable();

            if (result.added || result.updated) {
                window.alert(`Đã đồng bộ Pipeline: thêm ${result.added} lịch mới, cập nhật ${result.updated} lịch có sẵn.`);
                showSync("Đã đồng bộ từ Pipeline");
            } else {
                window.alert("Các KOC hợp lệ trong Pipeline đều đã có mặt và đã đồng bộ trong Lịch.");
            }
        }

        function handleBrandChanged(event) {
            flushPendingSave();
            currentBrandId = event.detail?.brand?.id || getCurrentBrandId();
            currentSort = { col: null, asc: true };
            loadScheduleData();
        }

        function handleStorage(event) {
            if (!currentBrandId) return;

            if (event.key === `${currentBrandId}_koc_pipeline`) {
                const pipeline = readJSON(`${currentBrandId}_koc_pipeline`, []);
                const result = mergePipelineIntoSchedule(Array.isArray(pipeline) ? pipeline : [], { createMissing: false });

                if (result.updated) {
                    persistSchedule(false);
                    renderTable();
                    showSync(`Đã đồng bộ ${result.updated} lịch từ Pipeline`);
                }
                return;
            }

            if (event.key === `${currentBrandId}_koc_schedule`) {
                window.clearTimeout(autosaveTimerId);
                autosaveTimerId = 0;
                loadScheduleData();
                showSync("Đã cập nhật từ tab khác");
            }
        }

        on(root, "click", handleRootClick);
        on(root, "input", handleRootInput);
        on(root, "change", handleRootChange);
        on(addButton, "click", handleAddTask);
        on(importButton, "click", handleImportPipeline);
        on(exportButton, "click", exportCalendar);
        on(printButton, "click", () => {
            flushPendingSave();
            window.print();
        });
        on(document, "brand:changed", handleBrandChanged);
        on(window, "storage", handleStorage);
        on(window, "beforeunload", flushPendingSave);

        loadScheduleData();

        return () => {
            flushPendingSave();
            abortController.abort();
            window.clearTimeout(saveTimeoutId);
            window.clearTimeout(autosaveTimerId);
            window.clearTimeout(searchTimerId);

            if (shellBadge) {
                shellBadge.classList.remove("show");
                shellBadge.innerHTML = shellBadgeHTML;
            }

            cleanups.forEach((cleanup) => cleanup());
        };
    }

    window.KOCViewTemplates = window.KOCViewTemplates || {};
    window.KOCViewTemplates.calendar = getCalendarTemplate;
    window.initViewCalendar = initViewCalendar;
})();
