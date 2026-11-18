/* global XLSX */
(() => {
    "use strict";

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn(`Không thể đọc LocalStorage: ${key}`, error);
            return fallback;
        }
    }

    function getDashboardTemplate() {
        return `
<section id="dashboard-view" class="content-wrapper dashboard-view">
<div class="card">
<div class="strategy-title"><i class="fa-regular fa-clipboard"></i> Chiến lược Booking 3 tầng</div>
<div class="strategy-subtitle">Chọn đúng tầng theo mục tiêu &amp; ngân sách. Trọng tâm chiến lược nằm ở tầng KOC.</div>
<div class="pyramid">
<div class="tier tier-1">
<h3>KOL — Nâng tầm thương hiệu</h3>
<p>Rất khó mời - chi phí cực cao - chuyển đổi cực tốt - &gt;300k view, &gt;1tr follow</p>
</div>
<div class="tier tier-2">
<h3>KOC — Bùng nổ doanh số</h3>
<p>Phải trả cast - chuyển đổi tốt nếu chọn đúng tệp - &gt;40k view, 2k-500k follow</p>
</div>
<div class="tier tier-3">
<h3>AFFILIATE — Tiết kiệm chi phí</h3>
<p>Chỉ cần gửi sản phẩm - chuyển đổi thấp - để test thị trường &amp; content</p>
</div>
</div>
<div class="criteria-note">
<i class="fa-regular fa-lightbulb"></i>
<span><strong>Tiêu chí sản phẩm dễ phủ KOC:</strong> giá &lt; 200k, trải nghiệm rõ ràng dễ test, bao bì đẹp, nguồn hàng ổn định để scale. Mỗi SP cần 1 USP rõ (vd: form tôn dáng, chất liệu thân thiện môi trường...).</span>
</div>
</div>
<div class="card" style="margin-bottom: 15px;">
<div class="strategy-title" style="color: #38A169;"><i class="fa-solid fa-check-square"></i> Checklist quy trình 8 bước</div>
<div class="strategy-subtitle" style="margin-bottom: 15px;">Bấm vào từng bước để mở danh sách việc cần làm. Tiến độ sẽ được lưu độc lập theo từng thương hiệu.</div>
<div class="progress-header-row">
<div class="progress-text" id="global-progress-text">Hoàn thành 0/33 đầu việc (0%)</div>
<button class="btn-reset" id="reset-btn">
<i class="fa-solid fa-rotate-left"></i> Làm mới lại
                    </button>
</div>
<div class="progress-bar-container">
<div class="progress-bar-fill" id="global-progress-bar"></div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">1</div>
<div class="step-title">
<h2>Sản phẩm — đòn bẩy số 1</h2>
<p>Chọn SP &amp; chốt USP</p>
</div>
</div>
<div class="task-counter">0/4</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t1-1" type="checkbox"/>
<label for="t1-1">Chọn SP dễ phủ KOC: giá &lt; 200k, trải nghiệm rõ, bao bì đẹp, nguồn hàng ổn định</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t1-2" type="checkbox"/>
<label for="t1-2">Xác định 1 USP rõ ràng của sản phẩm</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t1-3" type="checkbox"/>
<label for="t1-3">Nêu được sự khác biệt so với đối thủ (thiết kế độc quyền, quà tặng, giá tốt)</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t1-4" type="checkbox"/>
<label for="t1-4">SP tầm trung (&gt;300–500k): chuẩn bị quy trình riêng (KOC lớn/KOL + kịch bản sâu)</label>
</div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">2</div>
<div class="step-title">
<h2>Phân tích đối thủ</h2>
<p>Điểm mạnh / điểm yếu</p>
</div>
</div>
<div class="task-counter">0/3</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t2-1" type="checkbox"/>
<label for="t2-1">Soi đối thủ ở: Booking, Nội sàn (hình ảnh SP, CSKH, Ads)</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t2-2" type="checkbox"/>
<label for="t2-2">Liệt kê điểm mạnh đối thủ để né, điểm yếu để đánh vào</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t2-3" type="checkbox"/>
<label for="t2-3">Tải list KOC của đối thủ (Kalodata) về phân tích</label>
</div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">3</div>
<div class="step-title">
<h2>Bộ tiêu chí chọn lọc KOC</h2>
<p>Lọc đúng tệp</p>
</div>
</div>
<div class="task-counter">0/5</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t3-1" type="checkbox"/>
<label for="t3-1">Xác định tệp khách trên kênh KOC là ai</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t3-2" type="checkbox"/>
<label for="t3-2">Phong cách nội dung của KOC</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t3-3" type="checkbox"/>
<label for="t3-3">Follow / view TB / tương tác trung bình</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t3-4" type="checkbox"/>
<label for="t3-4">Đã từng bán SP tương tự chưa? Doanh số/tháng?</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t3-5" type="checkbox"/>
<label for="t3-5">Chấm điểm KOC ở tab "Chấm điểm" trước khi liên hệ</label>
</div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">4</div>
<div class="step-title">
<h2>Định hướng nội dung cho KOC</h2>
<p>File brief video</p>
</div>
</div>
<div class="task-counter">0/3</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t4-1" type="checkbox"/>
<label for="t4-1">Soạn file brief: nội dung cần truyền tải, thông điệp chính</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t4-2" type="checkbox"/>
<label for="t4-2">Style/quay dựng mong muốn, có CTA không</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t4-3" type="checkbox"/>
<label for="t4-3">Gửi brief TRƯỚC khi KOC quay (tránh sai insight, thiếu sáng, không CTA)</label>
</div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">5</div>
<div class="step-title">
<h2>Triển khai booking</h2>
<p>Tìm - Liên hệ - Đàm phán</p>
</div>
</div>
<div class="task-counter">0/6</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t5-1" type="checkbox"/>
<label for="t5-1">Tìm KOC trên Kalodata/TikTok: view &gt; 40k, tương tác ≥ 2%, nội dung liên quan</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t5-2" type="checkbox"/>
<label for="t5-2">Liên hệ bằng tin nhắn chuyên nghiệp (xem tab Tin nhắn)</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t5-3" type="checkbox"/>
<label for="t5-3">Đàm phán dựa trên báo giá (doanh số/view/tương tác)</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t5-4" type="checkbox"/>
<label for="t5-4">Xử lý tình huống KOC không phản hồi: kiểm tra lại tệp + mẫu tin nhắn, ưu tiên gọi điện</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t5-5" type="checkbox"/>
<label for="t5-5">Chốt deal: KOC, SĐT, địa chỉ, link tiktok, SP review, link SP, số video, cast (%cms + %ads)</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t5-6" type="checkbox"/>
<label for="t5-6">Đặt lịch nhắc hẹn demo &amp; lên bài (Zalo group / nhắc "Chỉ mình tôi")</label>
</div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">6</div>
<div class="step-title">
<h2>Test nhiều dạng content</h2>
<p>Tìm format chuyển đổi</p>
</div>
</div>
<div class="task-counter">0/4</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t6-1" type="checkbox"/>
<label for="t6-1">Phân nhóm KOC: Lifestyle / Chuyên môn / Bán hàng / Cảm xúc</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t6-2" type="checkbox"/>
<label for="t6-2">Chia nhóm test nhỏ 3-5 KOC mỗi format</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t6-3" type="checkbox"/>
<label for="t6-3">Theo dõi KPI riêng: View rate, CTR, CVR, số đơn, comment tích cực</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t6-4" type="checkbox"/>
<label for="t6-4">Dạng ra đơn cao nhất → scale; view cao nhưng CVR thấp → chỉnh CTA/script</label>
</div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">7</div>
<div class="step-title">
<h2>Đo lường hiệu quả</h2>
<p>Đừng booking "mù"</p>
</div>
</div>
<div class="task-counter">0/4</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t7-1" type="checkbox"/>
<label for="t7-1">Nắm bắt video theo tuần (3-4 ngày sau khi lên bài số lượng nhiều)</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t7-2" type="checkbox"/>
<label for="t7-2">Tổng hợp GMV theo tháng ở tab "Đo lường &amp; ROI"</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t7-3" type="checkbox"/>
<label for="t7-3">Đánh giá định hướng nội dung có hiệu quả không, tỷ lệ video lên xu hướng</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t7-4" type="checkbox"/>
<label for="t7-4">Đổi hướng nội dung nếu không ra số / hiệu quả kém</label>
</div>
</div>
</div>
<div class="task-card">
<div class="task-header">
<div class="task-header-left">
<div class="step-number">8</div>
<div class="step-title">
<h2>Chăm sóc KOC sau booking</h2>
<p>Biến KOC thành Brand Partner</p>
</div>
</div>
<div class="task-counter">0/4</div>
</div>
<div class="task-list">
<div class="task-item">
<input class="task-checkbox" id="t8-1" type="checkbox"/>
<label for="t8-1">GĐ1 (0-3 ngày): gửi lời cảm ơn cá nhân hóa + báo cáo tóm tắt hiệu quả</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t8-2" type="checkbox"/>
<label for="t8-2">GĐ2 (tuần 1-3): cập nhật comment/doanh thu, thả tim, đăng lại clip</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t8-3" type="checkbox"/>
<label for="t8-3">GĐ3 (tuần 4+): gắn tag Tier A/B, đề xuất tái hợp tác SP mới</label>
</div>
<div class="task-item">
<input class="task-checkbox" id="t8-4" type="checkbox"/>
<label for="t8-4">Mời top KOC vào nhóm cộng đồng (Zalo), update trước SP mới &amp; ưu đãi</label>
</div>
</div>
</div>
<div class="card formula-card">
<div class="formula-title"><i class="fa-solid fa-star"></i> CÔNG THỨC TỔNG — KOC BOOKING MAX FORMULA</div>
<div class="formula-content">
                    [USP mạnh × Chọn đúng tệp × Định hướng content rõ × Giao tiếp chuyên nghiệp × Chăm sóc hậu booking kỹ] × (Liên tục đo lường – Test format – Lọc &amp; tái hợp tác)
                </div>
<div class="formula-warning">
<strong>⚠️ "Tái hợp tác" = phép TRỪ, không phải cộng.</strong> Sau 3-4 chiến dịch, loại bỏ KOC ROI âm, chỉ tái đầu tư cho nhóm View cao – CTR tốt – ROI dương → hiệu suất tăng theo cấp số nhân.<br/>
<i>(Ví dụ: 20 KOC → giữ 6 người tốt → hiệu suất ×3.)</i>
</div>
</div>
<div class="footer-text">
                Công cụ Quản lý Booking KOC · Dữ liệu lưu cục bộ trên trình duyệt của bạn
            </div>
</section>
        `;
    }

    /**
     * Router chỉ gọi hàm này sau khi Dashboard đã được render vào #app-content.
     * Hàm trả về cleanup để hủy toàn bộ listener, timer, FileReader và header action.
     */
    function initViewDashboard(appRoot = document) {
        const root = appRoot.querySelector("#dashboard-view");
        if (!root) return () => {};

        const checkboxes = Array.from(root.querySelectorAll(".task-checkbox"));
        const totalCheckboxes = checkboxes.length;
        const globalProgressText = root.querySelector("#global-progress-text");
        const globalProgressBar = root.querySelector("#global-progress-bar");
        const resetButton = root.querySelector("#reset-btn");
        const syncBadge = document.getElementById("sync-badge");
        const exportButton = document.getElementById("btn-export");
        const printButton = document.getElementById("btn-print");
        const headerActions = document.querySelector(".top-header-right");
        const cleanupTasks = [];
        const systemKeys = new Set(["sys_brands_list", "sys_current_brand"]);

        let syncTimerId = null;
        let activeFileReader = null;
        let disposed = false;

        const on = (target, eventName, handler, options) => {
            if (!target) return;
            target.addEventListener(eventName, handler, options);
            cleanupTasks.push(() => target.removeEventListener(eventName, handler, options));
        };

        const getCurrentBrand = () => window.KOCApp?.brand?.getCurrent?.() || null;
        const getCurrentBrandId = () => getCurrentBrand()?.id || "";
        const getChecklistKey = (brandId, checkboxId) => `${brandId}_checkbox_${checkboxId}`;

        function resetSyncBadge() {
            if (!syncBadge) return;
            syncBadge.classList.remove("show");
            syncBadge.style.backgroundColor = "";
            syncBadge.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Đã đồng bộ dữ liệu hệ thống';
        }

        function showSync(message = "Đã đồng bộ", type = "success") {
            if (disposed || !syncBadge) return;

            const icon = type === "warning"
                ? "fa-triangle-exclamation"
                : type === "info"
                    ? "fa-circle-info"
                    : "fa-cloud-arrow-up";

            syncBadge.innerHTML = `<i class="fa-solid ${icon}"></i> <span></span>`;
            const messageNode = syncBadge.querySelector("span");
            if (messageNode) messageNode.textContent = message;
            syncBadge.style.backgroundColor = type === "warning"
                ? "#D69E2E"
                : type === "info"
                    ? "#2B6CB0"
                    : "#38A169";
            syncBadge.classList.add("show");

            window.clearTimeout(syncTimerId);
            syncTimerId = window.setTimeout(() => {
                if (disposed || !syncBadge) return;
                syncBadge.classList.remove("show");
                syncBadge.style.backgroundColor = "";
            }, 1800);
        }

        function updateProgress() {
            let globalChecked = 0;

            root.querySelectorAll(".task-card").forEach((card) => {
                const cardCheckboxes = Array.from(card.querySelectorAll(".task-checkbox"));
                const cardChecked = cardCheckboxes.filter((checkbox) => checkbox.checked).length;
                const counter = card.querySelector(".task-counter");
                if (counter) counter.textContent = `${cardChecked}/${cardCheckboxes.length}`;
                globalChecked += cardChecked;
            });

            const percent = totalCheckboxes
                ? Math.round((globalChecked / totalCheckboxes) * 100)
                : 0;

            if (globalProgressText) {
                globalProgressText.textContent = `Hoàn thành ${globalChecked}/${totalCheckboxes} đầu việc (${percent}%)`;
            }
            if (globalProgressBar) globalProgressBar.style.width = `${percent}%`;
            if (resetButton) {
                resetButton.style.display = getCurrentBrandId() && globalChecked > 0 ? "flex" : "none";
            }
        }

        function loadChecklists(brandId = getCurrentBrandId()) {
            checkboxes.forEach((checkbox) => {
                checkbox.disabled = !brandId;
                checkbox.checked = Boolean(
                    brandId && localStorage.getItem(getChecklistKey(brandId, checkbox.id)) === "true"
                );
            });
            updateProgress();
        }

        function handleChecklistChange(event) {
            const checkbox = event.target.closest(".task-checkbox");
            if (!checkbox || !root.contains(checkbox)) return;

            const brandId = getCurrentBrandId();
            if (!brandId) {
                checkbox.checked = false;
                return;
            }

            localStorage.setItem(getChecklistKey(brandId, checkbox.id), String(checkbox.checked));
            updateProgress();
            showSync("Đã lưu tiến độ");
        }

        function resetChecklist() {
            const brandId = getCurrentBrandId();
            if (!brandId) return;

            const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
            if (!completed) {
                showSync("Checklist hiện chưa có đầu việc đã chọn.", "info");
                return;
            }

            const confirmed = window.confirm(
                `Bạn có chắc chắn muốn làm mới ${completed} đầu việc đã hoàn thành của thương hiệu này không?`
            );
            if (!confirmed) return;

            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
                localStorage.removeItem(getChecklistKey(brandId, checkbox.id));
            });
            updateProgress();
            showSync("Đã làm mới checklist", "info");
        }

        function getChecklistRows() {
            return checkboxes.map((checkbox) => {
                const taskCard = checkbox.closest(".task-card");
                const step = taskCard?.querySelector(".step-number")?.textContent.trim() || "";
                const group = taskCard?.querySelector(".step-title h2")?.textContent.trim() || "";
                const label = root.querySelector(`label[for="${checkbox.id}"]`);

                return {
                    "Bước": step,
                    "Nhóm công việc": group,
                    "Đầu việc": label ? label.textContent.trim() : checkbox.id,
                    "Trạng thái": checkbox.checked ? "Hoàn thành" : "Chưa hoàn thành"
                };
            });
        }

        function fileSafeName(value) {
            return String(value || "Brand")
                .replace(/[\\/:*?"<>|]+/g, "_")
                .replace(/\s+/g, "_")
                .replace(/^_+|_+$/g, "")
                .slice(0, 80) || "Brand";
        }

        function exportChecklistCsv(rows, filename) {
            const headers = Object.keys(rows[0] || {});
            const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
            const csv = [
                headers.map(escapeCsv).join(","),
                ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(","))
            ].join("\uFEFF\n");

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = filename.replace(/\.xlsx$/i, ".csv");
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 0);
        }

        function exportChecklist() {
            const brand = getCurrentBrand();
            if (!brand) {
                window.alert("Vui lòng chọn thương hiệu trước khi xuất Excel.");
                return;
            }

            const rows = getChecklistRows();
            const completed = rows.filter((row) => row["Trạng thái"] === "Hoàn thành").length;
            const percentage = totalCheckboxes
                ? Math.round((completed / totalCheckboxes) * 100)
                : 0;
            const filename = `Checklist_QuyTrinh_${fileSafeName(brand.name)}.xlsx`;
            const summaryRows = [
                { "Hạng mục": "Thương hiệu", "Giá trị": brand.name },
                { "Hạng mục": "Ngày xuất", "Giá trị": new Date().toLocaleString("vi-VN") },
                { "Hạng mục": "Tổng đầu việc", "Giá trị": totalCheckboxes },
                { "Hạng mục": "Đã hoàn thành", "Giá trị": completed },
                { "Hạng mục": "Tiến độ", "Giá trị": `${percentage}%` }
            ];

            if (window.XLSX?.utils) {
                const workbook = XLSX.utils.book_new();
                const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
                const checklistSheet = XLSX.utils.json_to_sheet(rows);

                summarySheet["!cols"] = [{ wch: 22 }, { wch: 42 }];
                checklistSheet["!cols"] = [
                    { wch: 8 },
                    { wch: 30 },
                    { wch: 95 },
                    { wch: 18 }
                ];
                checklistSheet["!autofilter"] = { ref: `A1:D${rows.length + 1}` };

                XLSX.utils.book_append_sheet(workbook, summarySheet, "Tong_Quan");
                XLSX.utils.book_append_sheet(workbook, checklistSheet, "Checklist_8_Buoc");
                XLSX.writeFile(workbook, filename);
            } else {
                exportChecklistCsv(rows, filename);
            }

            showSync("Đã xuất checklist");
        }

        function getBrandsList() {
            const brands = window.KOCApp?.brand?.getBrands?.() || [];
            return Array.isArray(brands) ? brands : [];
        }

        function makeBackupData() {
            const knownBrandIds = new Set(getBrandsList().map((brand) => brand.id));
            const data = {};

            for (let index = 0; index < localStorage.length; index += 1) {
                const key = localStorage.key(index);
                if (!key) continue;

                const belongsToApp = systemKeys.has(key)
                    || Array.from(knownBrandIds).some((brandId) => key.startsWith(`${brandId}_`));
                if (belongsToApp) data[key] = localStorage.getItem(key);
            }

            return {
                app: "Multi-Brand HQ KOC",
                version: 2,
                createdAt: new Date().toISOString(),
                data
            };
        }

        function downloadBackup() {
            const backup = makeBackupData();
            if (!Object.keys(backup.data).length) {
                window.alert("Hệ thống hiện chưa có dữ liệu KOC để sao lưu.");
                return;
            }

            const date = new Date();
            const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
            const blob = new Blob([JSON.stringify(backup, null, 2)], {
                type: "application/json;charset=utf-8"
            });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `KOC_System_Backup_${stamp}.json`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 0);
            showSync("Đã tạo file sao lưu");
        }

        function normalizeBackup(parsed) {
            const rawData = parsed
                && typeof parsed === "object"
                && !Array.isArray(parsed)
                && parsed.data
                && typeof parsed.data === "object"
                ? parsed.data
                : parsed;

            if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
                throw new Error("Định dạng file sao lưu không hợp lệ.");
            }

            const rawBrands = rawData.sys_brands_list;
            let importedBrands = [];

            try {
                const parsedBrands = typeof rawBrands === "string" ? JSON.parse(rawBrands) : rawBrands;
                if (Array.isArray(parsedBrands)) {
                    importedBrands = parsedBrands
                        .filter((item) => item
                            && typeof item.id === "string"
                            && item.id.trim()
                            && typeof item.name === "string")
                        .map((item) => ({
                            id: item.id.trim(),
                            name: item.name.trim() || item.id.trim()
                        }));
                }
            } catch (error) {
                throw new Error("Danh sách thương hiệu trong file sao lưu không hợp lệ.");
            }

            if (!importedBrands.length) {
                throw new Error("File sao lưu không có danh sách thương hiệu hợp lệ.");
            }

            const allowedPrefixes = importedBrands.map((brand) => `${brand.id}_`);
            const accepted = {};
            const entries = Object.entries(rawData);

            if (entries.length > 3000) {
                throw new Error("File sao lưu có quá nhiều khóa dữ liệu.");
            }

            entries.forEach(([key, value]) => {
                const validKey = systemKeys.has(key)
                    || allowedPrefixes.some((prefix) => key.startsWith(prefix));
                if (!validKey) return;

                if (typeof value === "string") accepted[key] = value;
                else if (value !== undefined && value !== null) accepted[key] = JSON.stringify(value);
            });

            accepted.sys_brands_list = JSON.stringify(importedBrands);
            const savedCurrentBrand = accepted.sys_current_brand || "";
            if (!importedBrands.some((brand) => brand.id === savedCurrentBrand)) {
                accepted.sys_current_brand = "";
            }

            return { importedBrands, data: accepted };
        }

        function restoreBackup(file) {
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                window.alert("File sao lưu quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
                return;
            }

            if (activeFileReader?.readyState === FileReader.LOADING) activeFileReader.abort();

            const reader = new FileReader();
            activeFileReader = reader;

            reader.onload = (event) => {
                if (disposed || reader !== activeFileReader) return;

                try {
                    const parsed = JSON.parse(event.target?.result || "");
                    const normalized = normalizeBackup(parsed);
                    const totalKeys = Object.keys(normalized.data).length;

                    const confirmed = window.confirm(
                        `Khôi phục ${totalKeys} khóa dữ liệu cho ${normalized.importedBrands.length} thương hiệu?\n\n`
                        + "Hệ thống chỉ thay thế dữ liệu KOC, không xóa LocalStorage của ứng dụng khác trên cùng trình duyệt."
                    );
                    if (!confirmed) return;

                    const existingIds = getBrandsList().map((brand) => brand.id);
                    const importedIds = normalized.importedBrands.map((brand) => brand.id);
                    const cleanupIds = new Set([...existingIds, ...importedIds]);
                    const keysToRemove = [];

                    for (let index = 0; index < localStorage.length; index += 1) {
                        const key = localStorage.key(index);
                        if (!key) continue;
                        if (systemKeys.has(key)
                            || Array.from(cleanupIds).some((brandId) => key.startsWith(`${brandId}_`))) {
                            keysToRemove.push(key);
                        }
                    }

                    keysToRemove.forEach((key) => localStorage.removeItem(key));
                    Object.entries(normalized.data).forEach(([key, value]) => localStorage.setItem(key, value));

                    // Đồng bộ lại App Shell / Brand Store dùng chung, sau đó nhận brand:changed.
                    const selectedBrand = localStorage.getItem("sys_current_brand") || "";
                    if (window.KOCApp?.brand?.setCurrent) {
                        window.KOCApp.brand.setCurrent(selectedBrand);
                    } else {
                        loadChecklists(selectedBrand);
                    }
                    showSync("Đã phục hồi dữ liệu sao lưu");
                } catch (error) {
                    console.error(error);
                    window.alert(`Không thể phục hồi: ${error.message || "File sao lưu không hợp lệ."}`);
                }
            };

            reader.onerror = () => {
                if (!disposed) window.alert("Không thể đọc file sao lưu.");
            };
            reader.readAsText(file, "UTF-8");
        }

        function createBackupControls() {
            if (!headerActions) return () => {};

            const backupButton = document.createElement("button");
            backupButton.type = "button";
            backupButton.className = "btn-header dashboard-header-action";
            backupButton.innerHTML = '<i class="fa-solid fa-download"></i> Sao lưu';
            backupButton.title = "Tải dữ liệu KOC về máy (.json)";

            const restoreButton = document.createElement("button");
            restoreButton.type = "button";
            restoreButton.className = "btn-header dashboard-header-action";
            restoreButton.innerHTML = '<i class="fa-solid fa-upload"></i> Phục hồi';
            restoreButton.title = "Nạp dữ liệu từ file sao lưu";

            const restoreInput = document.createElement("input");
            restoreInput.type = "file";
            restoreInput.accept = ".json,application/json";
            restoreInput.hidden = true;
            restoreInput.className = "dashboard-restore-input";

            const insertBefore = exportButton && exportButton.parentElement === headerActions
                ? exportButton
                : null;
            headerActions.insertBefore(backupButton, insertBefore);
            headerActions.insertBefore(restoreButton, insertBefore);
            headerActions.insertBefore(restoreInput, insertBefore);

            on(backupButton, "click", downloadBackup);
            on(restoreButton, "click", () => restoreInput.click());
            on(restoreInput, "change", (event) => {
                restoreBackup(event.target.files?.[0]);
                event.target.value = "";
            });

            return () => {
                backupButton.remove();
                restoreButton.remove();
                restoreInput.remove();
            };
        }

        const originalExportMarkup = exportButton?.innerHTML || "";
        const originalExportTitle = exportButton?.getAttribute("title");
        const originalPrintMarkup = printButton?.innerHTML || "";
        const originalPrintTitle = printButton?.getAttribute("title");

        if (exportButton) {
            exportButton.innerHTML = '<i class="fa-solid fa-file-excel"></i> Xuất Excel tab này';
            exportButton.title = "Xuất checklist Dashboard";
        }
        if (printButton) {
            printButton.innerHTML = '<i class="fa-solid fa-print"></i> In / PDF';
            printButton.title = "In checklist Dashboard";
        }

        const removeBackupControls = createBackupControls();
        on(root, "change", handleChecklistChange);
        on(resetButton, "click", resetChecklist);
        on(exportButton, "click", exportChecklist);
        on(printButton, "click", () => window.print());
        on(document, "brand:changed", () => loadChecklists());
        on(window, "storage", (event) => {
            const brandId = getCurrentBrandId();
            if (brandId && event.key?.startsWith(`${brandId}_checkbox_`)) {
                loadChecklists(brandId);
                showSync("Đã cập nhật từ tab khác", "info");
            }
        });

        loadChecklists();

        return () => {
            disposed = true;
            cleanupTasks.forEach((cleanup) => cleanup());
            cleanupTasks.length = 0;

            if (activeFileReader?.readyState === FileReader.LOADING) activeFileReader.abort();
            activeFileReader = null;
            window.clearTimeout(syncTimerId);
            removeBackupControls();

            if (exportButton) {
                exportButton.innerHTML = originalExportMarkup;
                if (originalExportTitle === null) exportButton.removeAttribute("title");
                else exportButton.setAttribute("title", originalExportTitle);
            }
            if (printButton) {
                printButton.innerHTML = originalPrintMarkup;
                if (originalPrintTitle === null) printButton.removeAttribute("title");
                else printButton.setAttribute("title", originalPrintTitle);
            }
            resetSyncBadge();
        };
    }

    window.KOCViewTemplates = window.KOCViewTemplates || {};
    window.KOCViewTemplates.dashboard = getDashboardTemplate;
    window.initViewDashboard = initViewDashboard;

})();
