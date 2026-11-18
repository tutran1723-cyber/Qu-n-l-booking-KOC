/* global XLSX */
(() => {
    "use strict";

    window.KOCViewTemplates = window.KOCViewTemplates || {};

    window.KOCViewTemplates.commissions = () => `
        <div class="content-wrapper commissions-view">
            <section class="card">
                <div class="commission-card-header">
                    <div class="commission-title-group">
                        <h2><i class="fa-solid fa-sack-dollar"></i> Tính hoa hồng KOC theo NET GMV (quyết toán)</h2>
                        <p>Lọc đơn AFF có mã đơn nằm trong file quyết toán → gộp NET GMV theo từng KOC → hoa hồng = % × NET GMV. Mọi xử lý chạy ngay trên máy, không gửi dữ liệu đi đâu.</p>
                    </div>
                    <button class="commission-guide-button" id="commission-guide-button" type="button">
                        <i class="fa-regular fa-circle-question"></i> Hướng dẫn
                    </button>
                </div>

                <h3 class="commission-step-title"><span>1</span> TẢI 2 FILE LÊN</h3>
                <div class="commission-upload-container">
                    <button class="commission-upload-box" id="commission-box-aff" type="button">
                        <i class="fa-solid fa-file-excel fa-2x commission-icon-aff"></i>
                        <strong>List đơn AFF</strong>
                        <small>Đơn hàng liên kết — có cột nhà sáng tạo &amp; cơ sở hoa hồng</small>
                        <span class="commission-file-name" id="commission-name-aff" hidden></span>
                    </button>
                    <input id="commission-file-aff" type="file" accept=".xlsx,.xls,.csv" hidden>

                    <button class="commission-upload-box" id="commission-box-qt" type="button">
                        <i class="fa-solid fa-file-excel fa-2x commission-icon-qt"></i>
                        <strong>List đơn QUYẾT TOÁN</strong>
                        <small>Đơn hàng quyết toán trong tháng — dùng để lọc</small>
                        <span class="commission-file-name" id="commission-name-qt" hidden></span>
                    </button>
                    <input id="commission-file-qt" type="file" accept=".xlsx,.xls,.csv" hidden>
                </div>

                <hr class="commission-divider">

                <h3 class="commission-step-title"><span>2</span> TUỲ CHỌN TÍNH</h3>
                <div class="commission-options-grid">
                    <div class="commission-option-column">
                        <label class="commission-checkbox-group">
                            <input type="checkbox" id="commission-chk-agency">
                            <span>
                                <strong>Chỉ tính KOC thuộc danh sách agency (vd từ Pipeline)</strong>
                                <small>Bật nếu chỉ muốn tính KOC trong danh sách. Tắt = tính tất cả KOC tạo đơn.</small>
                            </span>
                        </label>

                        <div class="commission-koc-list-area">
                            <label for="commission-list-koc">Danh sách KOC (mỗi ID 1 dòng)</label>
                            <textarea id="commission-list-koc" class="commission-list-textarea" placeholder="vd:
quynhlivestream
luuhung365" disabled></textarea>
                            <button class="commission-load-button" id="commission-load-pipeline" type="button">
                                <i class="fa-solid fa-cloud-arrow-down"></i> Lấy danh sách KOC từ Pipeline
                            </button>
                        </div>
                    </div>

                    <div class="commission-option-column">
                        <div>
                            <label class="commission-field-label" for="commission-rate">Tỷ lệ hoa hồng chung</label>
                            <div class="commission-input-group">
                                <input type="number" id="commission-rate" value="2" step="0.1" min="0">
                                <span>% &nbsp;&nbsp;(Hoa hồng = % × NET GMV)</span>
                            </div>
                        </div>

                        <label class="commission-checkbox-group commission-top-space">
                            <input type="checkbox" id="commission-show-zero">
                            <span>
                                <strong>Hiện cả KOC chưa có đơn (NET GMV = 0)</strong>
                                <small>Chỉ áp dụng khi đã bật “Chỉ tính KOC” và có danh sách.</small>
                            </span>
                        </label>

                        <label class="commission-checkbox-group commission-top-space">
                            <input type="checkbox" id="commission-unique-orders" checked>
                            <span>
                                <strong>“Số đơn” đếm theo mã đơn duy nhất</strong>
                                <small>Không tính trùng dòng SP nếu 1 đơn mua nhiều SP.</small>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="commission-action-bar">
                    <span id="commission-status-text">Cần tải đủ 2 file để bắt đầu.</span>
                    <button class="commission-calculate-button" id="commission-calculate-button" type="button" disabled>
                        <i class="fa-solid fa-calculator"></i> Tính hoa hồng
                    </button>
                </div>
            </section>

            <section class="card" id="commission-result-section" hidden>
                <div class="commission-card-header">
                    <div class="commission-title-group">
                        <h2><i class="fa-solid fa-chart-pie commission-result-icon"></i> Kết quả đối soát</h2>
                    </div>
                    <button class="commission-export-button" id="commission-export-result" type="button">
                        <i class="fa-solid fa-file-excel"></i> Xuất file Excel
                    </button>
                </div>

                <div class="commission-result-summary">
                    <div class="commission-result-card">
                        <strong id="commission-res-koc">0</strong>
                        <span>KOC CÓ ĐƠN</span>
                    </div>
                    <div class="commission-result-card">
                        <strong id="commission-res-orders">0</strong>
                        <span>TỔNG ĐƠN (QUYẾT TOÁN)</span>
                    </div>
                    <div class="commission-result-card">
                        <strong id="commission-res-gmv">0đ</strong>
                        <span>TỔNG NET GMV</span>
                    </div>
                    <div class="commission-result-card commission-result-card-highlight">
                        <strong id="commission-res-cms">0đ</strong>
                        <span>TỔNG HOA HỒNG PHẢI TRẢ</span>
                    </div>
                </div>

                <div class="table-container">
                    <table class="commission-result-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>TÀI KHOẢN KOC</th>
                                <th class="text-right">SỐ ĐƠN THÀNH CÔNG</th>
                                <th class="text-right">NET GMV (VNĐ)</th>
                                <th class="text-right">HOA HỒNG NHẬN (VNĐ)</th>
                            </tr>
                        </thead>
                        <tbody id="commission-result-tbody"></tbody>
                    </table>
                </div>
            </section>
        </div>
    `;

    function initCommissionController(root) {
        const $ = (selector) => root.querySelector(selector);
        const abortController = new AbortController();
        const { signal } = abortController;
        const activeReaders = new Set();

        let rawAffData = null;
        let rawQtData = null;
        let finalResults = [];
        let calcTimerId = null;
        let isDisposed = false;

        const elements = {
            boxAff: $("#commission-box-aff"),
            boxQt: $("#commission-box-qt"),
            fileAff: $("#commission-file-aff"),
            fileQt: $("#commission-file-qt"),
            nameAff: $("#commission-name-aff"),
            nameQt: $("#commission-name-qt"),
            chkAgency: $("#commission-chk-agency"),
            listKoc: $("#commission-list-koc"),
            rate: $("#commission-rate"),
            chkShowZero: $("#commission-show-zero"),
            chkUniqueOrders: $("#commission-unique-orders"),
            loadPipeline: $("#commission-load-pipeline"),
            calculate: $("#commission-calculate-button"),
            status: $("#commission-status-text"),
            resultSection: $("#commission-result-section"),
            resultBody: $("#commission-result-tbody"),
            resKoc: $("#commission-res-koc"),
            resOrders: $("#commission-res-orders"),
            resGmv: $("#commission-res-gmv"),
            resCms: $("#commission-res-cms"),
            exportResult: $("#commission-export-result"),
            guide: $("#commission-guide-button")
        };

        function readJSON(key, fallback) {
            try {
                const stored = window.localStorage.getItem(key);
                return stored ? JSON.parse(stored) : fallback;
            } catch (error) {
                console.warn(`Không thể đọc dữ liệu LocalStorage: ${key}`, error);
                return fallback;
            }
        }

        function getCurrentBrandId() {
            return window.KOCApp?.brand?.currentId ||
                window.localStorage.getItem("sys_current_brand") ||
                "";
        }

        function formatMoney(value) {
            return Math.round(Number(value) || 0).toLocaleString("vi-VN");
        }

        function escapeHTML(value) {
            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function normalizeHeader(value) {
            return String(value || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/[_\-./]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();
        }

        function parseNumber(value) {
            if (typeof value === "number") return Number.isFinite(value) ? value : 0;
            if (value === null || value === undefined) return 0;

            let text = String(value)
                .replace(/[^\d,.-]/g, "")
                .trim();

            if (!text) return 0;

            const lastComma = text.lastIndexOf(",");
            const lastDot = text.lastIndexOf(".");

            if (lastComma > -1 && lastDot > -1) {
                // Dấu xuất hiện sau cùng được hiểu là thập phân.
                if (lastComma > lastDot) {
                    text = text.replace(/\./g, "").replace(",", ".");
                } else {
                    text = text.replace(/,/g, "");
                }
            } else if (lastComma > -1) {
                const decimalDigits = text.length - lastComma - 1;
                text = decimalDigits > 0 && decimalDigits <= 2
                    ? text.replace(",", ".")
                    : text.replace(/,/g, "");
            } else if (lastDot > -1) {
                const decimalDigits = text.length - lastDot - 1;
                // "1.234.567" là format VN; "1234.56" là format quốc tế.
                if (text.split(".").length > 2 || decimalDigits === 3) {
                    text = text.replace(/\./g, "");
                }
            }

            const number = Number.parseFloat(text);
            return Number.isFinite(number) ? number : 0;
        }

        function findColumn(headers, candidates, fallbackIndex = 0) {
            const matched = headers.find((header) => {
                const normalized = normalizeHeader(header);
                return candidates.some((candidate) => normalized.includes(candidate));
            });
            return matched || headers[fallbackIndex] || "";
        }

        function hasValidRows(data) {
            return Array.isArray(data) && data.length > 0;
        }

        function updateReadyState() {
            const ready = hasValidRows(rawAffData) && hasValidRows(rawQtData);
            elements.calculate.disabled = !ready;
            elements.status.textContent = ready
                ? "Dữ liệu đã sẵn sàng. Bấm nút để tính toán."
                : "Cần tải đủ 2 file để bắt đầu.";
            elements.status.classList.toggle("is-ready", ready);
        }

        function abortPendingReaders() {
            activeReaders.forEach((reader) => {
                try { reader.abort(); } catch (_) { /* Reader may already be complete. */ }
            });
            activeReaders.clear();
        }

        function resetResults() {
            finalResults = [];
            elements.resultSection.hidden = true;
            elements.resultBody.innerHTML = "";
            elements.resKoc.textContent = "0";
            elements.resOrders.textContent = "0";
            elements.resGmv.textContent = "0đ";
            elements.resCms.textContent = "0đ";
        }

        function resetFileInputs() {
            abortPendingReaders();
            rawAffData = null;
            rawQtData = null;
            elements.fileAff.value = "";
            elements.fileQt.value = "";

            [elements.boxAff, elements.boxQt].forEach((box) => box.classList.remove("has-file"));
            [elements.nameAff, elements.nameQt].forEach((name) => {
                name.textContent = "";
                name.hidden = true;
            });

            resetResults();
            updateReadyState();
        }

        function renderFileState(box, name, file) {
            box.classList.add("has-file");
            name.textContent = `Đã tải: ${file.name}`;
            name.hidden = false;
        }

        function showFileError(message) {
            window.alert(message);
            elements.status.textContent = message;
            elements.status.classList.remove("is-ready");
        }

        function handleFileUpload(fileInput, box, name, isAffFile) {
            const file = fileInput.files?.[0];
            if (!file) return;

            if (!window.XLSX) {
                showFileError("Không tìm thấy thư viện SheetJS (XLSX). Hãy kiểm tra lại thẻ script thư viện.");
                return;
            }

            if (isAffFile) rawAffData = null;
            else rawQtData = null;
            resetResults();
            updateReadyState();
            renderFileState(box, name, file);

            const reader = new FileReader();
            activeReaders.add(reader);

            reader.onerror = () => {
                activeReaders.delete(reader);
                if (!isDisposed) showFileError(`Không thể đọc file “${file.name}”.`);
            };

            reader.onload = (event) => {
                activeReaders.delete(reader);
                if (isDisposed) return;

                try {
                    const buffer = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(buffer, { type: "array" });
                    const firstSheet = workbook.SheetNames[0];

                    if (!firstSheet) {
                        throw new Error("File không có sheet dữ liệu.");
                    }

                    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {
                        defval: "",
                        raw: true
                    });

                    if (!hasValidRows(rows)) {
                        throw new Error("File không có dòng dữ liệu.");
                    }

                    if (isAffFile) rawAffData = rows;
                    else rawQtData = rows;

                    resetResults();
                    updateReadyState();
                } catch (error) {
                    console.error(error);
                    if (isAffFile) rawAffData = null;
                    else rawQtData = null;

                    box.classList.remove("has-file");
                    name.hidden = true;
                    fileInput.value = "";
                    updateReadyState();
                    showFileError(`File “${file.name}” không đúng định dạng hoặc không có dữ liệu hợp lệ.`);
                }
            };

            reader.readAsArrayBuffer(file);
        }

        function getTargetKocs() {
            if (!elements.chkAgency.checked) return null;

            const targetKocs = elements.listKoc.value
                .split(/\r?\n/)
                .map((item) => item.trim().toLowerCase())
                .filter(Boolean);

            return targetKocs.length ? new Set(targetKocs) : null;
        }

        function calculateResults() {
            if (!hasValidRows(rawAffData) || !hasValidRows(rawQtData)) {
                updateReadyState();
                return;
            }

            const qtHeaders = Object.keys(rawQtData[0] || {});
            const affHeaders = Object.keys(rawAffData[0] || {});
            const firstAffRow = rawAffData.find((row) => row && Object.keys(row).length) || {};

            const qtOrderIdColumn = findColumn(qtHeaders, ["ma don", "order id", "order code", "ma giao dich"]);
            const affOrderIdColumn = findColumn(affHeaders, ["ma don", "order id", "order code", "ma giao dich"]);
            const creatorColumn = findColumn(affHeaders, [
                "nha sang tao",
                "creator",
                "tai khoan koc",
                "tai khoan",
                "koc"
            ], 1);

            const basisColumn = affHeaders.find((header) => {
                const normalized = normalizeHeader(header);
                return [
                    "net gmv",
                    "co so hoa hong",
                    "doanh thu",
                    "gmv",
                    "commission base"
                ].some((candidate) => normalized.includes(candidate));
            });

            const resolvedBasisColumn = basisColumn ||
                affHeaders.find((header) => parseNumber(firstAffRow[header]) !== 0) ||
                affHeaders[2] ||
                "";

            if (!qtOrderIdColumn || !affOrderIdColumn || !creatorColumn || !resolvedBasisColumn) {
                showFileError("Không xác định được các cột cần thiết. File AFF cần Mã đơn, KOC/Creator và NET GMV; file Quyết toán cần Mã đơn.");
                return;
            }

            const settledOrderIds = new Set(
                rawQtData
                    .map((row) => String(row[qtOrderIdColumn] ?? "").trim())
                    .filter(Boolean)
            );

            const targetKocs = getTargetKocs();
            const kocStats = new Map();

            if (elements.chkShowZero.checked && targetKocs) {
                targetKocs.forEach((name) => {
                    kocStats.set(name, {
                        name,
                        gmv: 0,
                        rowCount: 0,
                        orderIds: new Set()
                    });
                });
            }

            rawAffData.forEach((row) => {
                const orderId = String(row[affOrderIdColumn] ?? "").trim();
                const originalName = String(row[creatorColumn] ?? "Unknown").trim() || "Unknown";
                const normalizedName = originalName.toLowerCase();

                if (!orderId || !settledOrderIds.has(orderId)) return;
                if (targetKocs && !targetKocs.has(normalizedName)) return;

                const existing = kocStats.get(normalizedName) || {
                    name: originalName,
                    gmv: 0,
                    rowCount: 0,
                    orderIds: new Set()
                };

                existing.gmv += parseNumber(row[resolvedBasisColumn]);
                existing.rowCount += 1;
                existing.orderIds.add(orderId);
                kocStats.set(normalizedName, existing);
            });

            const rate = Math.max(0, parseNumber(elements.rate.value));
            const includeZero = elements.chkShowZero.checked && Boolean(targetKocs);

            finalResults = Array.from(kocStats.values())
                .map((stat) => {
                    const orders = elements.chkUniqueOrders.checked
                        ? stat.orderIds.size
                        : stat.rowCount;

                    return {
                        name: stat.name,
                        orders,
                        gmv: stat.gmv,
                        cms: stat.gmv * (rate / 100)
                    };
                })
                .filter((result) => result.orders > 0 || includeZero)
                .sort((a, b) => b.gmv - a.gmv || a.name.localeCompare(b.name, "vi"));

            const summary = finalResults.reduce((total, result) => {
                total.gmv += result.gmv;
                total.cms += result.cms;
                total.orders += result.orders;
                if (result.orders > 0) total.kocs += 1;
                return total;
            }, { gmv: 0, cms: 0, orders: 0, kocs: 0 });

            elements.resKoc.textContent = formatMoney(summary.kocs);
            elements.resOrders.textContent = formatMoney(summary.orders);
            elements.resGmv.textContent = `${formatMoney(summary.gmv)}đ`;
            elements.resCms.textContent = `${formatMoney(summary.cms)}đ`;

            elements.resultBody.innerHTML = finalResults.length
                ? finalResults.map((result, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${escapeHTML(result.name)}</strong></td>
                        <td class="text-right">${formatMoney(result.orders)}</td>
                        <td class="text-right">${formatMoney(result.gmv)}</td>
                        <td class="text-right commission-money-red">${formatMoney(result.cms)}</td>
                    </tr>
                `).join("")
                : `<tr><td colspan="5" class="commission-empty-state">Không tìm thấy đơn hàng nào khớp điều kiện lọc.</td></tr>`;

            elements.resultSection.hidden = false;
            elements.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        function startCalculation() {
            if (calcTimerId !== null) window.clearTimeout(calcTimerId);

            elements.resultSection.hidden = false;
            elements.resultBody.innerHTML = `<tr><td colspan="5" class="commission-processing-state">Đang xử lý dữ liệu...</td></tr>`;

            // Nhường một lượt render để người dùng thấy trạng thái xử lý; cleanup sẽ hủy timer này khi đổi route.
            calcTimerId = window.setTimeout(() => {
                calcTimerId = null;
                if (!isDisposed) calculateResults();
            }, 0);
        }

        function loadPipelineKocs() {
            const brandId = getCurrentBrandId();
            if (!brandId) {
                window.alert("Vui lòng chọn nhãn hàng để lấy danh sách KOC.");
                return;
            }

            const pipelineData = readJSON(`${brandId}_koc_pipeline`, []);
            if (!Array.isArray(pipelineData) || !pipelineData.length) {
                window.alert("Pipeline của nhãn hàng này đang trống.");
                elements.listKoc.value = "";
                return;
            }

            const names = [...new Set(
                pipelineData
                    .map((koc) => String(koc?.name || koc?.id || "").trim())
                    .filter(Boolean)
            )];

            if (!names.length) {
                window.alert("Không tìm thấy tên hoặc ID KOC hợp lệ trong Pipeline.");
                elements.listKoc.value = "";
                return;
            }

            elements.chkAgency.checked = true;
            elements.listKoc.disabled = false;
            elements.listKoc.value = names.join("\n");
            resetResults();
        }

        function exportResults() {
            if (!finalResults.length) {
                window.alert("Không có dữ liệu để xuất. Vui lòng tính toán trước.");
                return;
            }

            if (!window.XLSX) {
                window.alert("Không tìm thấy thư viện SheetJS (XLSX) để xuất file.");
                return;
            }

            const data = finalResults.map((result, index) => ({
                STT: index + 1,
                "Tài khoản KOC": result.name,
                "Số đơn thành công": result.orders,
                "NET GMV (VNĐ)": Math.round(result.gmv),
                "Hoa hồng (VNĐ)": Math.round(result.cms)
            }));

            const sheet = XLSX.utils.json_to_sheet(data);
            sheet["!cols"] = [
                { wch: 8 },
                { wch: 28 },
                { wch: 22 },
                { wch: 20 },
                { wch: 22 }
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheet, "Hoa_Hong_Quyet_Toan");
            XLSX.writeFile(workbook, `Hoa_Hong_KOC_${new Date().toISOString().slice(0, 10)}.xlsx`);
        }

        function onBrandChanged() {
            resetFileInputs();
            elements.listKoc.value = "";
        }

        elements.boxAff.addEventListener("click", () => elements.fileAff.click(), { signal });
        elements.boxQt.addEventListener("click", () => elements.fileQt.click(), { signal });
        elements.fileAff.addEventListener("change", () => handleFileUpload(elements.fileAff, elements.boxAff, elements.nameAff, true), { signal });
        elements.fileQt.addEventListener("change", () => handleFileUpload(elements.fileQt, elements.boxQt, elements.nameQt, false), { signal });

        elements.chkAgency.addEventListener("change", () => {
            elements.listKoc.disabled = !elements.chkAgency.checked;
            resetResults();
        }, { signal });

        elements.loadPipeline.addEventListener("click", loadPipelineKocs, { signal });
        elements.calculate.addEventListener("click", startCalculation, { signal });
        elements.exportResult.addEventListener("click", exportResults, { signal });
        elements.guide.addEventListener("click", () => {
            window.alert(
                "1. Tải file đơn AFF và file đơn Quyết toán.\n" +
                "2. Kiểm tra tên cột: Mã đơn, KOC/Creator, NET GMV.\n" +
                "3. Chọn danh sách KOC từ Pipeline nếu cần.\n" +
                "4. Nhập tỷ lệ hoa hồng và bấm “Tính hoa hồng”."
            );
        }, { signal });

        document.addEventListener("brand:changed", onBrandChanged, { signal });

        updateReadyState();

        return () => {
            isDisposed = true;
            abortController.abort();

            if (calcTimerId !== null) {
                window.clearTimeout(calcTimerId);
                calcTimerId = null;
            }

            abortPendingReaders();

            rawAffData = null;
            rawQtData = null;
            finalResults = [];
        };
    }

    window.initViewCommissions = initCommissionController;
})();
