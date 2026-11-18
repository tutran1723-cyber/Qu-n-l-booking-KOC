/* global KOCApp */
(() => {
    "use strict";

    function getContractsViewHTML() {
        return `
<div class="content-wrapper contracts-view">

<!-- FORM NHẬP LIỆU -->
<div class="card">
<div class="section-title"><i class="fa-solid fa-file-signature"></i> Lập hợp đồng KOC (có cast)</div>
<div class="section-subtitle">Chọn KOC đã có cast trong Pipeline → điền thông tin CCCD, ngân hàng → lưu &amp; xuất hợp đồng để in/ký.</div>
<input id="edit-id" type="hidden" value=""/>
<div class="form-grid-2">
<div class="form-group">
<label class="form-label">KOC (đã có cast trong Pipeline)</label>
<select class="form-input" id="inp-koc">
<option value="">— Chọn KOC có cast —</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Cast (đ)</label>
<input class="form-input" disabled="" id="inp-cast" type="text" value="0"/>
</div>
</div>
<div class="sub-section-title">THÔNG TIN CĂN CƯỚC &amp; LIÊN HỆ (BÊN B — KOC)</div>
<div class="form-grid-2">
<div class="form-group">
<label class="form-label">Họ và tên (theo CCCD)</label>
<input class="form-input" id="inp-fullname" placeholder="VD: Nguyễn Thị A" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Số CCCD</label>
<input class="form-input" id="inp-cccd" placeholder="12 số" type="text"/>
</div>
</div>
<div class="form-grid-2">
<div class="form-group">
<label class="form-label">Ngày cấp CCCD</label>
<input class="form-input" id="inp-cccd-date" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Nơi cấp</label>
<input class="form-input" id="inp-cccd-place" placeholder="VD: Cục CSQLHC về TTXH" type="text"/>
</div>
</div>
<div class="form-group">
<label class="form-label">Địa chỉ thường trú</label>
<input class="form-input" id="inp-address" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP" type="text"/>
</div>
<div class="form-grid-2">
<div class="form-group">
<label class="form-label">Số điện thoại</label>
<input class="form-input" id="inp-phone" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Email (tuỳ chọn)</label>
<input class="form-input" id="inp-email" type="text"/>
</div>
</div>
<div class="sub-section-title">TÀI KHOẢN NGÂN HÀNG NHẬN CAST</div>
<div class="form-grid-3">
<div class="form-group">
<label class="form-label">Ngân hàng</label>
<input class="form-input" id="inp-bank" placeholder="VD: Vietcombank" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Số tài khoản</label>
<input class="form-input" id="inp-bank-acc" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Chủ tài khoản</label>
<input class="form-input" id="inp-bank-owner" placeholder="VIẾT HOA không dấu" type="text"/>
</div>
</div>
<div class="sub-section-title">NỘI DUNG CÔNG VIỆC &amp; HỢP ĐỒNG</div>
<div class="form-grid-2">
<div class="form-group">
<label class="form-label">Sản phẩm review</label>
<input class="form-input" id="inp-product" placeholder="VD: Kính cận 7125" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Tài khoản TikTok</label>
<input class="form-input" id="inp-tiktok-acc" placeholder="VD: Thảo đeng" type="text"/>
</div>
</div>
<div class="form-group">
<label class="form-label">Đường dẫn kênh TikTok</label>
<input class="form-input" id="inp-tiktok-link" placeholder="https://www.tiktok.com/@..." type="text"/>
</div>
<div class="form-grid-2">
<div class="form-group">
<label class="form-label">Ngày ký hợp đồng</label>
<input class="form-input" id="inp-sign-date" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Số hợp đồng (để trống = tự sinh)</label>
<input class="form-input" id="inp-contract-no" placeholder="tự sinh: DDMMYYYY/tiktok-NVH" type="text"/>
</div>
</div>
<div class="form-group">
<label class="form-label"><i class="fa-solid fa-link"></i> Link bài TikTok (cho Biên bản nghiệm thu)</label>
<input class="form-input" id="inp-air-link" placeholder="https://vt.tiktok.com/... — điền khi đã đăng bài" type="text"/>
</div>
<div class="form-group">
<label class="form-label"><i class="fa-regular fa-image"></i> Link Ảnh nghiệm thu (Google Drive / Imgur)</label>
<input class="form-input" id="inp-air-img" placeholder="Dán link ảnh chụp màn hình bài đăng vào đây..." type="text"/>
<p style="font-size: 12px; color: #A0AEC0; margin-top: 4px;">Việc dùng link thay vì tải trực tiếp giúp trình duyệt không bị tràn bộ nhớ.</p>
</div>
<div class="form-group">
<label class="form-label">Nội dung công việc (ghi chú nội bộ)</label>
<textarea class="form-input" id="inp-notes" placeholder="Ghi chú thêm nếu cần..." rows="3"></textarea>
</div>
<div class="action-buttons">
<button class="btn-primary" id="btn-save"><i class="fa-solid fa-save"></i> Lưu hợp đồng</button>
<button class="btn-secondary" id="btn-reset">+ Tạo mới (xoá ô)</button>
</div>
</div>
<!-- DANH SÁCH & THANH TOÁN -->
<div class="card">
<div class="section-title"><i class="fa-solid fa-clipboard-list"></i> Danh sách hợp đồng &amp; thanh toán</div>
<div class="summary-grid">
<div class="summary-card sc-count">
<h2 id="sum-count">0</h2>
<p>Hợp đồng</p>
</div>
<div class="summary-card sc-total">
<h2 id="sum-total">0đ</h2>
<p>Tổng cast</p>
</div>
<div class="summary-card sc-paid">
<h2 id="sum-paid">0đ</h2>
<p>Đã thanh toán</p>
</div>
<div class="summary-card sc-debt">
<h2 id="sum-debt">0đ</h2>
<p>Còn phải trả</p>
</div>
</div>
<div class="table-container">
<table>
<thead>
<tr>
<th>KOC</th>
<th>HỌ TÊN (CCCD)</th>
<th>CAST</th>
<th>NGÂN HÀNG / STK</th>
<th>THANH TOÁN</th>
<th>THAO TÁC</th>
</tr>
</thead>
<tbody id="contract-table-body">
<!-- JS Render -->
</tbody>
</table>
</div>
<!-- Alerts -->
<div class="alert-box alert-warning">
<i class="fa-solid fa-lightbulb"></i> <strong>Mỗi hợp đồng có 2 nút tải Word (.doc):</strong> <span class="btn-hd" style="display:inline-block; margin: 0 4px;">HĐ</span> và <span class="btn-bbnt" style="display:inline-block; margin: 0 4px;">BBNT</span>. <br/>
<span style="color: #C53030; font-size: 13px; font-weight: 600; display: block; margin-top: 8px;"><i class="fa-solid fa-triangle-exclamation"></i> Lưu ý: Khi mở file, nếu MS Word hiện cảnh báo định dạng (khung màu vàng), cứ bấm "Yes" để mở bình thường. File đã được căn lề chuẩn văn bản A4.</span>
</div>
<div class="alert-box alert-info">
<i class="fa-solid fa-thumbtack"></i> Mẫu đã dựng theo đúng HĐ + BBNT của KOC: Bên A = KOC, Bên B = Thương Hiệu. Các từ khóa tự thay theo từng KOC.<br/><br/>
<strong>Từ khóa:</strong> <code>{{HD_TEN}}</code> <code>{{KOC}}</code> <code>{{CCCD}}</code> <code>{{DIA_CHI}}</code> <code>{{NGAN_HANG}}</code> <code>{{STK}}</code> <code>{{CHU_TK}}</code> <code>{{CAST}}</code> <code>{{CAST_CHU}}</code> <code>{{SAN_PHAM}}</code> <code>{{TIKTOK}}</code> <code>{{LINK_AIR}}</code> <code>{{HINH_ANH}}</code>
</div>
<!-- Template Editors -->
<details>
<summary><i class="fa-solid fa-caret-right"></i> MẪU HỢP ĐỒNG (chỉnh sửa)</summary>
<textarea class="template-textarea" id="tpl-hd-content">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---
HỢP ĐỒNG DỊCH VỤ QUẢNG CÁO
Số: {{SO_HD}}

Hôm nay, ngày {{NGAY}} tháng {{THANG}} năm {{NAM}}, tại TP.HCM, chúng tôi gồm:

BÊN A (BÊN CUNG CẤP DỊCH VỤ):
Ông/Bà: {{HD_TEN}}
CCCD số: {{CCCD}} cấp ngày {{NGAY_CAP}} tại {{NOI_CAP}}
Địa chỉ: {{DIA_CHI}}
Điện thoại: {{SDT}}

BÊN B (BÊN THUÊ DỊCH VỤ):
Đại diện: Thương Hiệu (Ban Quản Lý)

ĐIỀU 1: NỘI DUNG CÔNG VIỆC
Bên A đồng ý thực hiện quảng bá sản phẩm "{{SAN_PHAM}}" của Bên B trên kênh TikTok: {{TIKTOK_LINK}}

ĐIỀU 2: PHÍ DỊCH VỤ VÀ THANH TOÁN
Tổng phí: {{CAST}} VNĐ (Bằng chữ: {{CAST_CHU}})
Chuyển khoản vào STK: {{STK}} - Ngân hàng: {{NGAN_HANG}} - Chủ TK: {{CHU_TK}}</textarea>
</details>
<details>
<summary><i class="fa-solid fa-caret-right"></i> MẪU BIÊN BẢN NGHIỆM THU (chỉnh sửa)</summary>
<textarea class="template-textarea" id="tpl-bbnt-content">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---
BIÊN BẢN NGHIỆM THU VÀ THANH LÝ HỢP ĐỒNG
(Kèm theo HĐ số: {{SO_HD}})

Hai bên xác nhận Bên A ({{HD_TEN}}) đã hoàn thành công việc đăng tải video review sản phẩm "{{SAN_PHAM}}" lên kênh TikTok "{{KOC}}".
Link nghiệm thu: {{LINK_AIR}}
Hình ảnh đối chứng: {{HINH_ANH}}

Hai bên đồng ý thanh lý hợp đồng và Bên B tiến hành thanh toán số tiền {{CAST}} VNĐ cho Bên A.</textarea>
</details>
</div>

</div>`;
    }

    function initViewContracts(root) {
        if (!root) return () => {};

        const $ = (selector, scope = root) => scope.querySelector(selector);
        const syncBadge = document.getElementById("sync-badge");
        const tableBody = $("#contract-table-body");
        const btnSave = $("#btn-save");
        const btnReset = $("#btn-reset");
        const selKOC = $("#inp-koc");
        const inpCast = $("#inp-cast");
        const inpFullName = $("#inp-fullname");
        const inpCCCD = $("#inp-cccd");
        const inpDateCCCD = $("#inp-cccd-date");
        const inpPlaceCCCD = $("#inp-cccd-place");
        const inpAddress = $("#inp-address");
        const inpPhone = $("#inp-phone");
        const inpEmail = $("#inp-email");
        const inpBank = $("#inp-bank");
        const inpBankAcc = $("#inp-bank-acc");
        const inpBankOwner = $("#inp-bank-owner");
        const inpProduct = $("#inp-product");
        const inpTiktokAcc = $("#inp-tiktok-acc");
        const inpTiktokLink = $("#inp-tiktok-link");
        const inpSignDate = $("#inp-sign-date");
        const inpContractNo = $("#inp-contract-no");
        const inpAirLink = $("#inp-air-link");
        const inpAirImg = $("#inp-air-img");
        const inpNotes = $("#inp-notes");
        const editIdField = $("#edit-id");
        const tplHd = $("#tpl-hd-content");
        const tplBbnt = $("#tpl-bbnt-content");

        if (!tableBody || !btnSave || !btnReset || !selKOC || !tplHd || !tplBbnt) {
            console.warn("Contracts view is missing required elements.");
            return () => {};
        }

        const formInputs = root.querySelectorAll(".form-input");
        const defaultTemplates = { hd: tplHd.value, bbnt: tplBbnt.value };
        const listeners = [];
        const timers = new Set();
        const objectUrls = new Set();

        let currentBrand = getCurrentBrandId();
        let pipelineData = [];
        let contractsData = [];
        let syncTimer = null;
        let draftTimer = null;
        let templateTimer = null;
        let destroyed = false;

        function on(target, type, handler, options) {
            target.addEventListener(type, handler, options);
            listeners.push(() => target.removeEventListener(type, handler, options));
        }

        function schedule(callback, delay, kind) {
            if (kind === "draft" && draftTimer) {
                window.clearTimeout(draftTimer);
                timers.delete(draftTimer);
            }
            if (kind === "template" && templateTimer) {
                window.clearTimeout(templateTimer);
                timers.delete(templateTimer);
            }

            const id = window.setTimeout(() => {
                timers.delete(id);
                if (kind === "draft") draftTimer = null;
                if (kind === "template") templateTimer = null;
                if (!destroyed) callback();
            }, delay);

            timers.add(id);
            if (kind === "draft") draftTimer = id;
            if (kind === "template") templateTimer = id;
            return id;
        }

        function safeJSONParse(key, fallback) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : fallback;
            } catch (error) {
                console.warn(`Không thể đọc LocalStorage: ${key}`, error);
                return fallback;
            }
        }

        function getArray(key) {
            const data = safeJSONParse(key, []);
            return Array.isArray(data) ? data : [];
        }

        function getCurrentBrandId() {
            return window.KOCApp?.brand?.currentId || localStorage.getItem("sys_current_brand") || "";
        }

        function parseLocalFloat(value) {
            if (value === null || value === undefined || value === "") return 0;
            if (typeof value === "number") return Number.isFinite(value) ? value : 0;

            const normalized = String(value)
                .replace(/[^\d,.\-]/g, "")
                .replace(/\.(?=\d{3}(\D|$))/g, "")
                .replace(/,(?=\d{3}(\D|$))/g, "")
                .replace(",", ".");

            const result = Number.parseFloat(normalized);
            return Number.isFinite(result) ? result : 0;
        }

        function formatMoney(value) {
            return parseLocalFloat(value).toLocaleString("vi-VN", {
                maximumFractionDigits: 0
            });
        }

        function parseDateLocal(dateValue) {
            if (!dateValue) return null;
            const pieces = String(dateValue).split("-").map(Number);
            if (pieces.length === 3 && pieces.every(Number.isFinite)) {
                return new Date(pieces[0], pieces[1] - 1, pieces[2], 12, 0, 0);
            }
            const fallback = new Date(dateValue);
            return Number.isNaN(fallback.getTime()) ? null : fallback;
        }

        function formatDateVN(dateValue) {
            if (!dateValue) return "";
            const date = parseDateLocal(dateValue);
            if (!date || Number.isNaN(date.getTime())) return String(dateValue);
            return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
        }

        function showSync(message = "Dữ liệu đã lưu") {
            if (!syncBadge) return;
            syncBadge.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${message}`;
            syncBadge.classList.add("show");

            if (syncTimer) {
                window.clearTimeout(syncTimer);
                timers.delete(syncTimer);
            }
            syncTimer = window.setTimeout(() => {
                timers.delete(syncTimer);
                syncTimer = null;
                syncBadge.classList.remove("show");
            }, 1600);
            timers.add(syncTimer);
        }

        function escapeHtml(value) {
            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function sanitizeFilename(value) {
            return String(value || "KOC")
                .replace(/[\\/:*?"<>|]/g, "-")
                .replace(/\s+/g, "_")
                .slice(0, 80);
        }

        function numberToWords(input) {
            const number = Math.round(parseLocalFloat(input));
            if (number === 0) return "Không đồng";
            if (number < 0) return `Âm ${numberToWords(Math.abs(number)).toLowerCase()}`;

            const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
            const scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

            function readThreeDigits(group, fullRead) {
                const hundreds = Math.floor(group / 100);
                const tens = Math.floor((group % 100) / 10);
                const units = group % 10;
                const words = [];

                if (fullRead || hundreds > 0) words.push(`${digits[hundreds]} trăm`);

                if (tens > 1) {
                    words.push(`${digits[tens]} mươi`);
                    if (units === 1) words.push("mốt");
                    else if (units === 4) words.push("tư");
                    else if (units === 5) words.push("lăm");
                    else if (units > 0) words.push(digits[units]);
                } else if (tens === 1) {
                    words.push("mười");
                    if (units === 5) words.push("lăm");
                    else if (units > 0) words.push(digits[units]);
                } else if (units > 0) {
                    if (hundreds > 0 || fullRead) words.push("lẻ");
                    words.push(digits[units]);
                }

                return words.join(" ").trim();
            }

            const groups = [];
            let remaining = number;
            while (remaining > 0) {
                groups.unshift(remaining % 1000);
                remaining = Math.floor(remaining / 1000);
            }

            const result = [];
            groups.forEach((group, index) => {
                if (group === 0) return;
                const scaleIndex = groups.length - index - 1;
                const hasPreviousNonZero = groups.slice(0, index).some((value) => value > 0);
                const phrase = readThreeDigits(group, hasPreviousNonZero && group < 100);
                result.push(`${phrase}${scales[scaleIndex] ? ` ${scales[scaleIndex]}` : ""}`.trim());
            });

            const text = result.join(" ").replace(/\s+/g, " ").trim();
            return `${text.charAt(0).toUpperCase()}${text.slice(1)} đồng chẵn`;
        }

        function normalizeContract(record, index = 0) {
            const contract = record && typeof record === "object" ? record : {};
            return {
                ...contract,
                id: contract.id || `hd_legacy_${Date.now()}_${index}`,
                kocId: contract.kocId || contract.pipeline_id || "",
                kocName: contract.kocName || contract.name || "",
                cast: parseLocalFloat(contract.cast),
                fullName: contract.fullName || "",
                cccd: contract.cccd || "",
                cccdDate: contract.cccdDate || "",
                cccdPlace: contract.cccdPlace || "",
                address: contract.address || "",
                phone: contract.phone || "",
                email: contract.email || "",
                bank: contract.bank || "",
                bankAcc: contract.bankAcc || "",
                bankOwner: contract.bankOwner || "",
                product: contract.product || "",
                tiktokAcc: contract.tiktokAcc || "",
                tiktokLink: contract.tiktokLink || "",
                signDate: contract.signDate || "",
                contractNo: contract.contractNo || "",
                airLink: contract.airLink || "",
                airImg: contract.airImg || "",
                notes: contract.notes || "",
                isPaid: Boolean(contract.isPaid),
                createdAt: contract.createdAt || Date.now(),
                updatedAt: contract.updatedAt || Date.now(),
                paidAt: contract.isPaid ? (contract.paidAt || null) : null
            };
        }

        function createOption(value, label, selected = false) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            option.selected = selected;
            return option;
        }

        function setFormEnabled(enabled) {
            formInputs.forEach((input) => {
                input.disabled = !enabled;
            });
            inpCast.disabled = true; // Cast luôn lấy từ Pipeline.
            btnSave.disabled = !enabled;
            btnReset.disabled = !enabled;
            tplHd.disabled = !enabled;
            tplBbnt.disabled = !enabled;
        }

        function populateKocSelect(selectedKocId = "", fallbackContract = null) {
            selKOC.innerHTML = "";
            selKOC.appendChild(createOption("", "— Chọn KOC có cast —", !selectedKocId));

            let selectionExists = false;
            pipelineData
                .filter((koc) => parseLocalFloat(koc.cast) > 0)
                .forEach((koc) => {
                    const isSelected = koc.id === selectedKocId;
                    if (isSelected) selectionExists = true;
                    selKOC.appendChild(
                        createOption(
                            koc.id,
                            `${koc.name || "KOC chưa đặt tên"} (Cast: ${formatMoney(koc.cast)})`,
                            isSelected
                        )
                    );
                });

            // Giữ khả năng chỉnh sửa hợp đồng cũ khi KOC đã bị xoá/đổi cast ở Pipeline.
            if (selectedKocId && !selectionExists && fallbackContract) {
                selKOC.appendChild(
                    createOption(
                        selectedKocId,
                        `${fallbackContract.kocName || "KOC đã lưu"} (Dữ liệu hợp đồng cũ)`,
                        true
                    )
                );
            }
        }

        function selectedPipelineKoc() {
            return pipelineData.find((koc) => koc.id === selKOC.value) || null;
        }

        function getFormPayload() {
            return {
                editId: editIdField.value,
                kocId: selKOC.value,
                fullName: inpFullName.value,
                cccd: inpCCCD.value,
                cccdDate: inpDateCCCD.value,
                cccdPlace: inpPlaceCCCD.value,
                address: inpAddress.value,
                phone: inpPhone.value,
                email: inpEmail.value,
                bank: inpBank.value,
                bankAcc: inpBankAcc.value,
                bankOwner: inpBankOwner.value,
                product: inpProduct.value,
                tiktokAcc: inpTiktokAcc.value,
                tiktokLink: inpTiktokLink.value,
                signDate: inpSignDate.value,
                contractNo: inpContractNo.value,
                airLink: inpAirLink.value,
                airImg: inpAirImg.value,
                notes: inpNotes.value
            };
        }

        function saveDraft() {
            if (!currentBrand) return;
            localStorage.setItem(
                `${currentBrand}_koc_contract_draft`,
                JSON.stringify({ ...getFormPayload(), updatedAt: Date.now() })
            );
        }

        function saveDraftDebounced() {
            schedule(saveDraft, 350, "draft");
        }

        function restoreDraft() {
            if (!currentBrand || editIdField.value) return;
            const draft = safeJSONParse(`${currentBrand}_koc_contract_draft`, null);
            if (!draft || typeof draft !== "object") return;

            const draftContract = draft.editId
                ? contractsData.find((contract) => contract.id === draft.editId)
                : null;
            if (draftContract) editIdField.value = draftContract.id;

            if (draft.kocId) {
                const linkedContract = draftContract
                    || contractsData.find((contract) => contract.kocId === draft.kocId)
                    || { kocId: draft.kocId, kocName: "" };
                populateKocSelect(draft.kocId, linkedContract);
            }

            inpFullName.value = draft.fullName || "";
            inpCCCD.value = draft.cccd || "";
            inpDateCCCD.value = draft.cccdDate || "";
            inpPlaceCCCD.value = draft.cccdPlace || "";
            inpAddress.value = draft.address || "";
            inpPhone.value = draft.phone || "";
            inpEmail.value = draft.email || "";
            inpBank.value = draft.bank || "";
            inpBankAcc.value = draft.bankAcc || "";
            inpBankOwner.value = draft.bankOwner || "";
            inpProduct.value = draft.product || "";
            inpTiktokAcc.value = draft.tiktokAcc || "";
            inpTiktokLink.value = draft.tiktokLink || "";
            inpSignDate.value = draft.signDate || "";
            inpContractNo.value = draft.contractNo || "";
            inpAirLink.value = draft.airLink || "";
            inpAirImg.value = draft.airImg || "";
            inpNotes.value = draft.notes || "";

            const koc = selectedPipelineKoc();
            inpCast.value = koc ? formatMoney(koc.cast) : "0";
        }

        function loadTemplates() {
            if (!currentBrand) {
                tplHd.value = defaultTemplates.hd;
                tplBbnt.value = defaultTemplates.bbnt;
                return;
            }

            const templates = safeJSONParse(`${currentBrand}_koc_contract_templates`, {});
            tplHd.value = typeof templates.hd === "string" ? templates.hd : defaultTemplates.hd;
            tplBbnt.value = typeof templates.bbnt === "string" ? templates.bbnt : defaultTemplates.bbnt;
        }

        function persistTemplates(showFeedback = true) {
            if (!currentBrand) return;
            localStorage.setItem(
                `${currentBrand}_koc_contract_templates`,
                JSON.stringify({
                    hd: tplHd.value,
                    bbnt: tplBbnt.value,
                    updatedAt: Date.now()
                })
            );
            if (showFeedback) showSync("Đã lưu mẫu văn bản");
        }

        function saveTemplatesDebounced() {
            schedule(() => persistTemplates(true), 500, "template");
        }

        function resetForm({ clearDraft = true, silent = false } = {}) {
            editIdField.value = "";
            populateKocSelect();
            inpCast.value = "0";

            [
                inpFullName, inpCCCD, inpDateCCCD, inpPlaceCCCD, inpAddress, inpPhone,
                inpEmail, inpBank, inpBankAcc, inpBankOwner, inpProduct, inpTiktokAcc,
                inpTiktokLink, inpSignDate, inpContractNo, inpAirLink, inpAirImg, inpNotes
            ].forEach((input) => {
                input.value = "";
            });

            const today = new Date();
            inpSignDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

            if (clearDraft && currentBrand) {
                localStorage.removeItem(`${currentBrand}_koc_contract_draft`);
            }
            if (!silent && currentBrand) showSync("Đã tạo biểu mẫu mới");
        }

        function validateContractData(payload) {
            if (!payload.kocId) return "Vui lòng chọn KOC có cast.";
            if (payload.cast <= 0) return "Cast của KOC phải lớn hơn 0.";
            if (payload.cccd && !/^\d{12}$/.test(payload.cccd.replace(/\s/g, ""))) {
                return "Số CCCD cần gồm đúng 12 chữ số.";
            }
            if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
                return "Email chưa đúng định dạng.";
            }
            return "";
        }

        function generateContractNumber(signDate, tiktokAcc) {
            const date = parseDateLocal(signDate) || new Date();
            const dd = String(date.getDate()).padStart(2, "0");
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const yyyy = date.getFullYear();
            const prefix = `${dd}${mm}${yyyy}/tiktok-${(tiktokAcc || "KOC").replace(/\s+/g, "").substring(0, 3).toUpperCase() || "KOC"}`;

            let contractNo = prefix;
            let sequence = 2;
            const usedNumbers = new Set(
                contractsData
                    .filter((contract) => contract.id !== editIdField.value)
                    .map((contract) => String(contract.contractNo || "").trim().toLowerCase())
            );

            while (usedNumbers.has(contractNo.toLowerCase())) {
                contractNo = `${prefix}-${sequence}`;
                sequence += 1;
            }
            return contractNo;
        }

        function saveContracts(message = "Dữ liệu đã lưu") {
            if (!currentBrand) return;
            localStorage.setItem(`${currentBrand}_koc_contracts`, JSON.stringify(contractsData));
            showSync(message);
        }

        function renderTable() {
            tableBody.innerHTML = "";

            let totalCast = 0;
            let paidAmount = 0;

            contractsData.forEach((contract, index) => {
                const c = normalizeContract(contract, index);
                totalCast += c.cast;
                if (c.isPaid) paidAmount += c.cast;

                const tr = document.createElement("tr");
                const paidClass = c.isPaid ? "status-paid" : "status-unpaid";
                const paidText = c.isPaid ? "Đã TT" : "Chưa TT";

                tr.innerHTML = `
                    <td><div class="koc-info cell-koc"></div></td>
                    <td>
                        <div class="koc-info cell-fullname"></div>
                        <div class="koc-sub cell-cccd"></div>
                    </td>
                    <td><div class="koc-info cell-cast"></div></td>
                    <td>
                        <div class="koc-info cell-bank"></div>
                        <div class="koc-sub cell-bank-acc"></div>
                    </td>
                    <td>
                        <label class="checkbox-container ${paidClass}">
                            <input type="checkbox" class="chk-paid" data-id="${escapeHtml(c.id)}">
                            <span class="lbl-paid">${paidText}</span>
                        </label>
                    </td>
                    <td>
                        <div class="action-btns">
                            <button type="button" class="btn-hd" data-action="hd" data-id="${escapeHtml(c.id)}">HĐ</button>
                            <button type="button" class="btn-bbnt" data-action="bbnt" data-id="${escapeHtml(c.id)}">BBNT</button>
                            <button type="button" class="btn-icon btn-icon-edit" aria-label="Sửa hợp đồng" data-action="edit" data-id="${escapeHtml(c.id)}"><i class="fa-solid fa-pen"></i></button>
                            <button type="button" class="btn-icon" aria-label="Xóa hợp đồng" data-action="delete" data-id="${escapeHtml(c.id)}"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </td>`;

                $(".cell-koc", tr).textContent = c.kocName || "---";
                $(".cell-fullname", tr).textContent = c.fullName || "---";
                $(".cell-cccd", tr).textContent = `CCCD: ${c.cccd || "---"}`;
                $(".cell-cast", tr).textContent = `${formatMoney(c.cast)}đ`;
                $(".cell-bank", tr).textContent = c.bank || "---";
                $(".cell-bank-acc", tr).textContent = `${c.bankAcc || "---"}${c.bankOwner ? ` · ${c.bankOwner}` : ""}`;
                $(".chk-paid", tr).checked = c.isPaid;
                tableBody.appendChild(tr);
            });

            $("#sum-count").textContent = contractsData.length;
            $("#sum-total").textContent = `${formatMoney(totalCast)}đ`;
            $("#sum-paid").textContent = `${formatMoney(paidAmount)}đ`;
            $("#sum-debt").textContent = `${formatMoney(totalCast - paidAmount)}đ`;
        }

        function fillForm(contract) {
            editIdField.value = contract.id;
            populateKocSelect(contract.kocId, contract);

            selKOC.value = contract.kocId || "";
            inpCast.value = formatMoney(contract.cast);
            inpFullName.value = contract.fullName || "";
            inpCCCD.value = contract.cccd || "";
            inpDateCCCD.value = contract.cccdDate || "";
            inpPlaceCCCD.value = contract.cccdPlace || "";
            inpAddress.value = contract.address || "";
            inpPhone.value = contract.phone || "";
            inpEmail.value = contract.email || "";
            inpBank.value = contract.bank || "";
            inpBankAcc.value = contract.bankAcc || "";
            inpBankOwner.value = contract.bankOwner || "";
            inpProduct.value = contract.product || "";
            inpTiktokAcc.value = contract.tiktokAcc || "";
            inpTiktokLink.value = contract.tiktokLink || "";
            inpSignDate.value = contract.signDate || "";
            inpContractNo.value = contract.contractNo || "";
            inpAirLink.value = contract.airLink || "";
            inpAirImg.value = contract.airImg || "";
            inpNotes.value = contract.notes || "";

            const scroller = root.closest(".main-content");
            if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
        }

        function buildDocumentHtml(content) {
            return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Multi-Brand HQ">
<style>
@page { size: A4; margin: 2cm 2cm 2cm 3cm; }
body { font-family: "Times New Roman", serif; font-size: 13pt; line-height: 1.5; }
p { margin: 0 0 8pt; }
</style>
</head>
<body>${content}</body>
</html>`;
        }

        function resolveTemplate(template, contract) {
            const signDate = parseDateLocal(contract.signDate) || new Date();
            const replacements = {
                "{{HD_TEN}}": contract.fullName || "...",
                "{{KOC}}": contract.kocName || "...",
                "{{CCCD}}": contract.cccd || "...",
                "{{DIA_CHI}}": contract.address || "...",
                "{{NGAN_HANG}}": contract.bank || "...",
                "{{STK}}": contract.bankAcc || "...",
                "{{CHU_TK}}": contract.bankOwner || "...",
                "{{CAST}}": formatMoney(contract.cast),
                "{{CAST_CHU}}": numberToWords(contract.cast),
                "{{SAN_PHAM}}": contract.product || "...",
                "{{TIKTOK}}": contract.tiktokAcc || "...",
                "{{TIKTOK_LINK}}": contract.tiktokLink || "...",
                "{{LINK_AIR}}": contract.airLink || "...",
                "{{HINH_ANH}}": contract.airImg || "...",
                "{{SO_HD}}": contract.contractNo || "...",
                "{{NGAY}}": String(signDate.getDate()).padStart(2, "0"),
                "{{THANG}}": String(signDate.getMonth() + 1).padStart(2, "0"),
                "{{NAM}}": String(signDate.getFullYear()),
                "{{NGAY_CAP}}": formatDateVN(contract.cccdDate) || "...",
                "{{NOI_CAP}}": contract.cccdPlace || "...",
                "{{SDT}}": contract.phone || "...",
                "{{EMAIL}}": contract.email || "...",
                "{{CONG_VIEC}}": contract.notes || "..."
            };

            let escapedTemplate = escapeHtml(template);
            Object.entries(replacements).forEach(([key, value]) => {
                escapedTemplate = escapedTemplate.split(key).join(escapeHtml(value));
            });
            return escapedTemplate.replace(/\r?\n/g, "<br>");
        }

        function downloadWordDocument(type, contract) {
            const template = type === "HD" ? tplHd.value : tplBbnt.value;
            const blob = new Blob(
                ["\ufeff", buildDocumentHtml(resolveTemplate(template, contract))],
                { type: "application/msword" }
            );
            const url = URL.createObjectURL(blob);
            objectUrls.add(url);

            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${type}_${sanitizeFilename(contract.kocName)}_${sanitizeFilename(contract.contractNo || "Hop_dong")}.doc`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            const revokeTimer = window.setTimeout(() => {
                timers.delete(revokeTimer);
                URL.revokeObjectURL(url);
                objectUrls.delete(url);
            }, 1000);
            timers.add(revokeTimer);
        }

        function loadData() {
            if (!currentBrand) {
                pipelineData = [];
                contractsData = [];
                selKOC.innerHTML = '<option value="">— Chọn KOC có cast —</option>';
                renderTable();
                return;
            }

            pipelineData = getArray(`${currentBrand}_koc_pipeline`);
            contractsData = getArray(`${currentBrand}_koc_contracts`).map(normalizeContract);
            const editingContract = contractsData.find((contract) => contract.id === editIdField.value) || null;
            populateKocSelect(editingContract ? editingContract.kocId : selKOC.value, editingContract);
            renderTable();
        }

        function refreshForBrand() {
            currentBrand = getCurrentBrandId();
            if (!currentBrand) {
                setFormEnabled(false);
                resetForm({ clearDraft: false, silent: true });
                loadData();
                loadTemplates();
                return;
            }

            setFormEnabled(true);
            resetForm({ clearDraft: false, silent: true });
            loadData();
            loadTemplates();
            restoreDraft();
        }

        function onBrandChanged() {
            refreshForBrand();
        }

        function onStorage(event) {
            if (!event.key) return;

            if (event.key === "sys_current_brand" || event.key === "sys_brands_list") {
                const nextBrand = getCurrentBrandId();
                if (nextBrand !== currentBrand) refreshForBrand();
                return;
            }
            if (!currentBrand) return;

            if (event.key === `${currentBrand}_koc_pipeline`) {
                const selectedId = selKOC.value;
                pipelineData = getArray(`${currentBrand}_koc_pipeline`);
                const editingContract = contractsData.find((contract) => contract.id === editIdField.value) || null;
                populateKocSelect(selectedId, editingContract);
                const linkedKoc = selectedPipelineKoc();
                if (linkedKoc && !editIdField.value) inpCast.value = formatMoney(linkedKoc.cast);
                showSync("Đã đồng bộ Pipeline");
            }

            if (event.key === `${currentBrand}_koc_contracts`) {
                contractsData = getArray(`${currentBrand}_koc_contracts`).map(normalizeContract);
                renderTable();
                showSync("Đã cập nhật từ tab khác");
            }

            if (event.key === `${currentBrand}_koc_contract_templates`) {
                loadTemplates();
                showSync("Đã cập nhật mẫu văn bản");
            }
        }

        on(selKOC, "change", () => {
            const koc = selectedPipelineKoc();
            if (!koc) {
                inpCast.value = "0";
                return;
            }
            inpCast.value = formatMoney(koc.cast);
            inpProduct.value = koc.product || inpProduct.value;
            inpTiktokAcc.value = koc.name || inpTiktokAcc.value;
            if (koc.contact && !inpPhone.value) inpPhone.value = koc.contact;
            saveDraftDebounced();
        });

        on(btnReset, "click", () => {
            if (currentBrand) resetForm();
        });

        on(btnSave, "click", () => {
            if (!currentBrand) {
                window.alert("Vui lòng chọn nhãn hàng!");
                return;
            }

            const linkedKoc = selectedPipelineKoc();
            const existingContract = contractsData.find((contract) => contract.id === editIdField.value) || null;
            const payload = {
                ...getFormPayload(),
                cast: linkedKoc ? parseLocalFloat(linkedKoc.cast) : parseLocalFloat(inpCast.value),
                kocName: linkedKoc ? (linkedKoc.name || "") : (existingContract?.kocName || "")
            };

            const validationError = validateContractData(payload);
            if (validationError) {
                window.alert(validationError);
                return;
            }

            const contractNo = payload.contractNo.trim()
                || generateContractNumber(payload.signDate, payload.tiktokAcc);

            const duplicateNo = contractsData.find((contract) =>
                contract.id !== editIdField.value
                && String(contract.contractNo || "").trim().toLowerCase() === contractNo.toLowerCase()
            );
            if (duplicateNo) {
                window.alert("Số hợp đồng đã tồn tại. Hãy dùng số khác hoặc để trống để hệ thống tự sinh.");
                return;
            }

            const now = Date.now();
            const contractObj = normalizeContract({
                ...(existingContract || {}),
                id: editIdField.value || `hd_${now}`,
                kocId: payload.kocId,
                kocName: payload.kocName,
                cast: payload.cast,
                fullName: payload.fullName.trim(),
                cccd: payload.cccd.replace(/\s/g, ""),
                cccdDate: payload.cccdDate,
                cccdPlace: payload.cccdPlace.trim(),
                address: payload.address.trim(),
                phone: payload.phone.trim(),
                email: payload.email.trim(),
                bank: payload.bank.trim(),
                bankAcc: payload.bankAcc.replace(/\s/g, ""),
                bankOwner: payload.bankOwner.trim(),
                product: payload.product.trim(),
                tiktokAcc: payload.tiktokAcc.trim(),
                tiktokLink: payload.tiktokLink.trim(),
                signDate: payload.signDate,
                contractNo,
                airLink: payload.airLink.trim(),
                airImg: payload.airImg.trim(),
                notes: payload.notes.trim(),
                createdAt: existingContract ? existingContract.createdAt : now,
                updatedAt: now,
                isPaid: existingContract ? Boolean(existingContract.isPaid) : false,
                paidAt: existingContract?.isPaid ? existingContract.paidAt : null
            });

            const index = contractsData.findIndex((contract) => contract.id === contractObj.id);
            if (index >= 0) contractsData[index] = contractObj;
            else contractsData.unshift(contractObj);

            saveContracts(existingContract ? "Đã cập nhật hợp đồng" : "Đã lưu hợp đồng");
            resetForm({ clearDraft: true, silent: true });
            renderTable();
        });

        on(tableBody, "change", (event) => {
            const checkbox = event.target.closest(".chk-paid");
            if (!checkbox) return;

            const contract = contractsData.find((item) => item.id === checkbox.dataset.id);
            if (!contract) return;

            if (checkbox.checked) {
                const confirmed = window.confirm(
                    `Xác nhận đã thanh toán ${formatMoney(contract.cast)}đ cho ${contract.kocName || "KOC này"}?`
                );
                if (!confirmed) {
                    checkbox.checked = false;
                    return;
                }
                contract.isPaid = true;
                contract.paidAt = Date.now();
                saveContracts("Đã xác nhận thanh toán");
            } else {
                contract.isPaid = false;
                contract.paidAt = null;
                saveContracts("Đã HỦY trạng thái thanh toán");
            }

            contract.updatedAt = Date.now();
            renderTable();
        });

        on(tableBody, "click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;

            const contract = contractsData.find((item) => item.id === button.dataset.id);
            if (!contract) return;

            if (button.dataset.action === "edit") {
                fillForm(contract);
                return;
            }

            if (button.dataset.action === "delete") {
                if (!window.confirm(`Xóa hợp đồng của ${contract.kocName || "KOC này"}?`)) return;
                contractsData = contractsData.filter((item) => item.id !== contract.id);
                saveContracts("Đã xóa hợp đồng");
                if (editIdField.value === contract.id) resetForm({ clearDraft: true, silent: true });
                renderTable();
                return;
            }

            if (button.dataset.action === "hd" || button.dataset.action === "bbnt") {
                downloadWordDocument(button.dataset.action.toUpperCase(), contract);
            }
        });

        [tplHd, tplBbnt].forEach((input) => on(input, "input", saveTemplatesDebounced));
        [
            inpFullName, inpCCCD, inpDateCCCD, inpPlaceCCCD, inpAddress, inpPhone,
            inpEmail, inpBank, inpBankAcc, inpBankOwner, inpProduct, inpTiktokAcc,
            inpTiktokLink, inpSignDate, inpContractNo, inpAirLink, inpAirImg, inpNotes
        ].forEach((input) => on(input, "input", saveDraftDebounced));

        on(document, "brand:changed", onBrandChanged);
        on(window, "storage", onStorage);
        on(window, "beforeunload", () => {
            saveDraft();
            persistTemplates(false);
        });

        refreshForBrand();

        return () => {
            if (destroyed) return;
            destroyed = true;

            // Lưu phần người dùng đang nhập trước khi DOM bị Router thay thế.
            saveDraft();
            persistTemplates(false);

            listeners.splice(0).forEach((off) => off());
            timers.forEach((id) => window.clearTimeout(id));
            timers.clear();

            objectUrls.forEach((url) => URL.revokeObjectURL(url));
            objectUrls.clear();

            if (syncBadge) syncBadge.classList.remove("show");
        };
    }

    window.KOCViewTemplates = window.KOCViewTemplates || {};
    window.KOCViewTemplates.contracts = getContractsViewHTML;
    window.initViewContracts = initViewContracts;
})();
