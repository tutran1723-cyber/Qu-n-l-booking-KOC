/* global XLSX */
(() => {
    "use strict";

    const BRIEF_TEXT_FIELDS = [
        "brief_shop_info",
        "brief_core_msg",
        "brief_target_audience",
        "brief_booking_criteria",
        "brief_dos_donts",
        "brief_timeline",
        "brief_rights"
    ];

    const BRIEF_DEFAULTS = {
        chosync: {
            brief_shop_info: "Tên shop: Chosync Studio\nTikTok Shop: @chosync.studio",
            brief_core_msg: "Thời trang tối giản, năng động",
            brief_target_audience: "Giới trẻ, genZ thích basic",
            brief_booking_criteria: "18-28 tuổi",
            brief_dos_donts: "- BẮT BUỘC: Mặc áo rõ form, có ánh sáng ngoài trời hoặc studio sáng sủa.\n- CẤM KỴ: Không mặc áo lót khác màu lộ ra ngoài (đối với áo trắng), không quay dính logo local brand khác.",
            brief_timeline: "- Trả video draft sau 4 ngày kể từ khi nhận sản phẩm.\n- Đăng bài vào 19h tối Thứ 6 hoặc Thứ 7.",
            brief_rights: "Cấp mã Spark Ads 30 ngày. Brand được phép sử dụng hình ảnh KOC để đăng lại trên Fanpage Chosync.",
            products: [{
                name: "Áo Baby Tee Tôn Dáng",
                id: "CS-002",
                price_org: "220000",
                price_daily: "149000",
                usp: "Form ôm chuẩn",
                pain: "Áo ngắn dễ lộ",
                cms: "15",
                content: "Mix match đồ đi chơi",
                ref_link: ""
            }]
        },
        mot_chut_dua: {
            brief_shop_info: "Tên shop: Một Chút Dừa\nTikTok Shop: @motchutdua.decor",
            brief_core_msg: "Đồ thủ công tái chế từ gáo dừa",
            brief_target_audience: "Thích sống xanh, yêu môi trường",
            brief_booking_criteria: "Review decor, lifestyle mộc mạc",
            brief_dos_donts: "- BẮT BUỘC: Quay rõ vân gỗ/dừa, nhấn mạnh yếu tố bảo vệ sức khỏe.\n- CẤM KỴ: Không dùng chung với đồ nhựa dùng 1 lần trong video.",
            brief_timeline: "- Gửi kịch bản duyệt trước khi quay.\n- Đăng video sau khi duyệt draft tối đa 2 ngày.",
            brief_rights: "Cấp mã Spark Ads 60 ngày. Cam kết KOC không xóa video trong vòng 6 tháng.",
            products: [{
                name: "Bộ Ấm Trà Gáo Dừa",
                id: "MCD-01",
                price_org: "350000",
                price_daily: "269000",
                usp: "Chế tác thủ công",
                pain: "Sợ hóa chất chống mốc",
                cms: "10",
                content: "Góc chill pha trà chiều",
                ref_link: ""
            }]
        }
    };

    /**
     * View HTML của trang Brief. Router sẽ gọi hàm này trước khi chạy initViewBrief().
     * Chỉ giữ phần .content-wrapper của brief.html cũ; không lặp Sidebar, Header hay Sync Badge.
     */
    function getBriefTemplate() {
        return `
            <div class="content-wrapper" id="brief-view">
                <div class="card" style="padding-bottom:30px">
                    <div class="section-title">
                        <i class="fa-solid fa-bullseye" style="color:var(--primary-red)"></i>
                        Brief Booking — Thông tin chung
                    </div>
                    <div class="section-subtitle" id="brief-subtitle">
                        Mẫu brief gửi KOC. Sửa trực tiếp, hệ thống tự động lưu trữ độc lập theo brand.
                    </div>

                    <div class="info-grid">
                        <div class="info-box">
                            <label><i class="fa-solid fa-store"></i> Thông tin shop &amp; hashtag</label>
                            <textarea id="brief_shop_info" placeholder="Nhập tên shop, tài khoản và hashtag yêu cầu..."></textarea>
                        </div>
                        <div class="info-box">
                            <label><i class="fa-solid fa-crosshairs"></i> Định vị &amp; thông điệp chính</label>
                            <textarea id="brief_core_msg" placeholder="Nhập định vị thương hiệu và thông điệp truyền thông cốt lõi..."></textarea>
                        </div>
                        <div class="info-box">
                            <label><i class="fa-solid fa-users"></i> Đối tượng khách hàng mục tiêu</label>
                            <textarea id="brief_target_audience" placeholder="Mô tả tệp khách hàng, hành vi và nỗi đau tiêu dùng chung..."></textarea>
                        </div>
                        <div class="info-box">
                            <label><i class="fa-solid fa-filter"></i> Tiêu chí booking (tệp fan, view, nội dung)</label>
                            <textarea id="brief_booking_criteria" placeholder="Các điều kiện về kênh KOC (Hạng mục, độ tuổi fan, chỉ số tương tác)..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="section-title">
                        <i class="fa-solid fa-shield-halved" style="color:#38a169"></i>
                        Quy định &amp; Cam kết chiến dịch
                    </div>
                    <div class="section-subtitle">
                        Các điều khoản bắt buộc, tiến độ timeline và thỏa thuận bản quyền hình ảnh với KOC.
                    </div>

                    <div class="info-grid">
                        <div class="info-box">
                            <label><i class="fa-solid fa-list-check"></i> Do's &amp; Don'ts (Bắt buộc &amp; Cấm kỵ)</label>
                            <textarea id="brief_dos_donts" placeholder="- Bắt buộc: Ghim comment giỏ hàng, cầm sản phẩm trong 3s đầu...&#10;- Cấm kỵ: Nhắc đến thương hiệu đối thủ, dùng từ vi phạm chính sách (nhất, trị dứt điểm)..."></textarea>
                        </div>
                        <div class="info-box">
                            <label><i class="fa-regular fa-clock"></i> Timeline &amp; Deadline</label>
                            <textarea id="brief_timeline" placeholder="- Ngày KOC nhận được hàng: ...&#10;- Ngày KOC cần gửi video Draft để duyệt: ...&#10;- Ngày Publish lên kênh KOC: ..."></textarea>
                        </div>
                        <div class="info-box" style="grid-column:span 2">
                            <label><i class="fa-solid fa-copyright"></i> Quyền Tài Nguyên &amp; Chạy Ads</label>
                            <textarea id="brief_rights" placeholder="- Thời hạn cấp mã Spark Ads (Authorization Code): 30 ngày / 60 ngày / 90 ngày.&#10;- Thỏa thuận bản quyền: Nhãn hàng được phép re-up, cắt ghép video để đăng tải trên hệ thống Owned Media (Fanpage, Website, Instagram) của thương hiệu."></textarea>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="section-title">
                        <i class="fa-solid fa-box-open" style="color:#d2691e"></i>
                        Sản phẩm hợp tác chiến dịch
                    </div>
                    <div class="section-subtitle">
                        Danh mục hàng hóa bàn giao cho KOC review — đi kèm giá bán, USP, nỗi đau khách hàng và định hướng kịch bản.
                    </div>

                    <div class="toolbar">
                        <button class="btn-add" id="btn-add-row" type="button">
                            <i class="fa-solid fa-plus"></i> Thêm sản phẩm
                        </button>
                        <button class="btn-outline" id="btn-reset-table" type="button">
                            -- Đặt lại mặc định Brand này
                        </button>
                        <span class="hint-text">Dữ liệu tự động lưu khi chỉnh sửa ô nhập liệu.</span>
                    </div>

                    <div class="table-container">
                        <table id="product-table">
                            <thead>
                                <tr>
                                    <th class="col-name">TÊN SẢN PHẨM</th>
                                    <th class="col-id">ID SP</th>
                                    <th class="col-price">NIÊM YẾT</th>
                                    <th class="col-price">GIÁ DAILY</th>
                                    <th class="col-usp">USP / ĐẶC ĐIỂM NỔI BẬT</th>
                                    <th class="col-pain">NỖI ĐAU KHÁCH</th>
                                    <th class="col-cms">CMS %</th>
                                    <th class="col-content">ĐỊNH HƯỚNG CONTENT</th>
                                    <th class="col-ref">LINK ẢNH / REF</th>
                                    <th><i class="fa-solid fa-gear"></i></th>
                                </tr>
                            </thead>
                            <tbody id="table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function readJSON(key, fallback) {
        try {
            const savedValue = localStorage.getItem(key);
            return savedValue ? JSON.parse(savedValue) : fallback;
        } catch (error) {
            console.warn(`Không thể đọc LocalStorage: ${key}`, error);
            return fallback;
        }
    }

    function formatCurrency(value) {
        const numericValue = parseCurrency(value);
        if (!numericValue) return "";
        return String(numericValue).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function parseCurrency(value) {
        const digits = String(value ?? "").replace(/[^\d]/g, "");
        return digits ? Number(digits) : 0;
    }

    /**
     * Hàm được Router gọi SAU KHI template đã được đưa vào #app-content.
     * Hàm trả về cleanup để app.js tự động hủy listener/timer khi đổi route.
     */
    function initViewBrief(appRoot = document) {
        const root = appRoot.querySelector("#brief-view");
        if (!root) return () => {};

        const tableBody = root.querySelector("#table-body");
        const syncBadge = document.getElementById("sync-badge");
        const printButton = document.getElementById("btn-print");
        const exportButton = document.getElementById("btn-export");
        const cleanups = [];
        let activeBrandId = "";
        let badgeTimerId = null;

        const on = (target, type, handler, options) => {
            if (!target) return;
            target.addEventListener(type, handler, options);
            cleanups.push(() => target.removeEventListener(type, handler, options));
        };

        const getCurrentBrandId = () => window.KOCApp?.brand?.getCurrent()?.id || "";

        function resetBadge() {
            if (!syncBadge) return;
            syncBadge.classList.remove("show");
            syncBadge.style.backgroundColor = "";
            syncBadge.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Đã đồng bộ dữ liệu hệ thống';
        }

        function showSyncBadge(message = "Đã đồng bộ dữ liệu hệ thống", color = "#38A169", duration = 1500) {
            if (!syncBadge) return;

            window.clearTimeout(badgeTimerId);
            syncBadge.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${message}`;
            syncBadge.style.backgroundColor = color;
            syncBadge.classList.add("show");

            badgeTimerId = window.setTimeout(resetBadge, duration);
        }

        function resizeTextarea(textarea) {
            if (!(textarea instanceof HTMLTextAreaElement)) return;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }

        function getProductFromRow(row) {
            const getValue = (field) => row.querySelector(`[data-field="${field}"]`)?.value || "";

            return {
                name: getValue("name"),
                id: getValue("id"),
                price_org: parseCurrency(getValue("price_org")),
                price_daily: parseCurrency(getValue("price_daily")),
                usp: getValue("usp"),
                pain: getValue("pain"),
                cms: getValue("cms"),
                content: getValue("content"),
                ref_link: getValue("ref_link")
            };
        }

        function saveProducts() {
            if (!activeBrandId) return;

            const products = [...tableBody.querySelectorAll("tr")].map(getProductFromRow);
            localStorage.setItem(`${activeBrandId}_products_table`, JSON.stringify(products));
            showSyncBadge();
        }

        function createProductRow(product = {}) {
            const row = document.createElement("tr");

            // Giá trị do người dùng nhập được gán qua .value để tránh chèn HTML từ LocalStorage vào DOM.
            row.innerHTML = `
                <td><textarea class="auto-resize" data-field="name" placeholder="Tên SP..." rows="1"></textarea></td>
                <td><input type="text" data-field="id" placeholder="ID..."></td>
                <td><input type="text" class="num-format" data-field="price_org" placeholder="Giá..."></td>
                <td><input type="text" class="num-format" data-field="price_daily" placeholder="Giá sale..."></td>
                <td><textarea class="auto-resize" data-field="usp" placeholder="Điểm nổi bật..." rows="1"></textarea></td>
                <td><textarea class="auto-resize" data-field="pain" placeholder="Nỗi đau..." rows="1"></textarea></td>
                <td><input type="number" data-field="cms" placeholder="%" style="text-align:center;"></td>
                <td><textarea class="auto-resize" data-field="content" placeholder="Kịch bản..." rows="1"></textarea></td>
                <td><textarea class="auto-resize" data-field="ref_link" placeholder="Link Drive/TikTok..." rows="1"></textarea></td>
                <td style="white-space:nowrap;">
                    <button class="btn-duplicate" type="button" title="Nhân bản dòng này" aria-label="Nhân bản dòng này">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                    <button class="btn-delete" type="button" title="Xóa dòng này" aria-label="Xóa dòng này">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            `;

            row.querySelector('[data-field="name"]').value = product.name || "";
            row.querySelector('[data-field="id"]').value = product.id || "";
            row.querySelector('[data-field="price_org"]').value = formatCurrency(product.price_org);
            row.querySelector('[data-field="price_daily"]').value = formatCurrency(product.price_daily);
            row.querySelector('[data-field="usp"]').value = product.usp || "";
            row.querySelector('[data-field="pain"]').value = product.pain || "";
            row.querySelector('[data-field="cms"]').value = product.cms || "";
            row.querySelector('[data-field="content"]').value = product.content || "";
            row.querySelector('[data-field="ref_link"]').value = product.ref_link || "";

            row.querySelectorAll("textarea.auto-resize").forEach(resizeTextarea);
            return row;
        }

        function renderProducts(brandId) {
            tableBody.innerHTML = "";
            if (!brandId) return;

            let products = readJSON(`${brandId}_products_table`, null);
            if (!Array.isArray(products)) {
                products = BRIEF_DEFAULTS[brandId]?.products || [];
                localStorage.setItem(`${brandId}_products_table`, JSON.stringify(products));
            }

            products.forEach((product) => tableBody.appendChild(createProductRow(product)));
        }

        function renderTextFields(brandId) {
            BRIEF_TEXT_FIELDS.forEach((fieldId) => {
                const field = root.querySelector(`#${fieldId}`);
                if (!field) return;

                field.disabled = !brandId;
                if (!brandId) {
                    field.value = "";
                    return;
                }

                const storageKey = `${brandId}_${fieldId}`;
                const storedValue = localStorage.getItem(storageKey);
                if (storedValue !== null) {
                    field.value = storedValue;
                    return;
                }

                const defaultValue = BRIEF_DEFAULTS[brandId]?.[fieldId] || "";
                field.value = defaultValue;
                if (defaultValue) localStorage.setItem(storageKey, defaultValue);
            });
        }

        function renderForCurrentBrand() {
            activeBrandId = getCurrentBrandId();
            renderTextFields(activeBrandId);
            renderProducts(activeBrandId);
        }

        function handleRootInput(event) {
            const target = event.target;
            if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

            if (target.matches("textarea.auto-resize")) resizeTextarea(target);

            if (target.matches(".num-format")) {
                target.value = formatCurrency(target.value);
            }

            if (BRIEF_TEXT_FIELDS.includes(target.id)) {
                if (activeBrandId) {
                    localStorage.setItem(`${activeBrandId}_${target.id}`, target.value);
                    showSyncBadge();
                }
                return;
            }

            if (target.closest("#product-table")) saveProducts();
        }

        function handleRootClick(event) {
            const button = event.target.closest("button");
            if (!button) return;

            if (button.id === "btn-add-row") {
                if (!activeBrandId) {
                    window.alert("Vui lòng chọn thương hiệu trước khi thêm sản phẩm.");
                    return;
                }

                tableBody.appendChild(createProductRow());
                saveProducts();
                return;
            }

            if (button.id === "btn-reset-table") {
                if (!activeBrandId) {
                    window.alert("Vui lòng chọn thương hiệu trước khi đặt lại dữ liệu.");
                    return;
                }

                const accepted = window.confirm(
                    "Xác nhận: Đặt lại bảng sản phẩm về dữ liệu mặc định của Brand này? Dữ liệu bạn vừa nhập sẽ mất."
                );
                if (!accepted) return;

                localStorage.removeItem(`${activeBrandId}_products_table`);
                renderProducts(activeBrandId);
                showSyncBadge("Đã đặt lại dữ liệu mặc định");
                return;
            }

            const row = button.closest("tr");
            if (!row) return;

            if (button.classList.contains("btn-duplicate")) {
                const copy = getProductFromRow(row);
                copy.id = copy.id ? `${copy.id} (Copy)` : "";
                tableBody.appendChild(createProductRow(copy));
                saveProducts();
            }

            if (button.classList.contains("btn-delete")) {
                row.remove();
                saveProducts();
            }
        }

        function handleBrandChanged() {
            renderForCurrentBrand();
        }

        function handleStorage(event) {
            if (event.key !== `${activeBrandId}_products_table` || !activeBrandId) return;
            renderProducts(activeBrandId);
            showSyncBadge("Đã cập nhật giá từ Tab Tính Giá", "#2B6CB0", 3000);
        }

        function handleBeforePrint() {
            root.querySelectorAll("textarea").forEach((textarea) => {
                textarea.dataset.briefOriginalHeight = textarea.style.height || "";
                textarea.style.height = `${textarea.scrollHeight + 5}px`;
            });
        }

        function handleAfterPrint() {
            root.querySelectorAll("textarea").forEach((textarea) => {
                textarea.style.height = textarea.dataset.briefOriginalHeight || "";
                delete textarea.dataset.briefOriginalHeight;
            });
        }

        function handlePrintClick() {
            window.print();
        }

        function exportBrief() {
            if (!activeBrandId) {
                window.alert("Vui lòng chọn thương hiệu để xuất!");
                return;
            }

            if (!window.XLSX) {
                window.alert("Không tìm thấy thư viện XLSX. Hãy kiểm tra kết nối thư viện xuất Excel trong index.html.");
                return;
            }

            const workbook = XLSX.utils.book_new();
            const informationRows = [
                { "Hạng Mục": "Thông tin shop & hashtag", "Nội Dung": root.querySelector("#brief_shop_info").value },
                { "Hạng Mục": "Định vị & thông điệp", "Nội Dung": root.querySelector("#brief_core_msg").value },
                { "Hạng Mục": "Khách hàng mục tiêu", "Nội Dung": root.querySelector("#brief_target_audience").value },
                { "Hạng Mục": "Tiêu chí booking", "Nội Dung": root.querySelector("#brief_booking_criteria").value },
                { "Hạng Mục": "Do's & Don'ts", "Nội Dung": root.querySelector("#brief_dos_donts").value },
                { "Hạng Mục": "Timeline & Deadline", "Nội Dung": root.querySelector("#brief_timeline").value },
                { "Hạng Mục": "Bản quyền & Ads", "Nội Dung": root.querySelector("#brief_rights").value }
            ];

            const briefSheet = XLSX.utils.json_to_sheet(informationRows);
            briefSheet["!cols"] = [{ wch: 25 }, { wch: 100 }];
            XLSX.utils.book_append_sheet(workbook, briefSheet, "Thong_Tin_Brief");

            const products = readJSON(`${activeBrandId}_products_table`, []);
            if (products.length) {
                const productRows = products.map((product) => ({
                    "Tên Sản Phẩm": product.name || "",
                    "ID SP": product.id || "",
                    "Giá Niêm Yết": product.price_org || "",
                    "Giá Bán (Daily)": product.price_daily || "",
                    "USP/Đặc điểm": product.usp || "",
                    "Nỗi đau KH": product.pain || "",
                    "CMS (%)": product.cms || "",
                    "Định hướng Content": product.content || "",
                    "Link Tham Khảo": product.ref_link || ""
                }));
                XLSX.utils.book_append_sheet(
                    workbook,
                    XLSX.utils.json_to_sheet(productRows),
                    "Danh_Sach_San_Pham"
                );
            }

            const brandName = window.KOCApp?.brand?.getCurrent()?.name || "Brand";
            const safeFileName = brandName.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_");
            XLSX.writeFile(workbook, `Brief_KOC_${safeFileName}.xlsx`);
        }

        on(root, "input", handleRootInput);
        on(root, "click", handleRootClick);
        on(document, "brand:changed", handleBrandChanged);
        on(window, "storage", handleStorage);
        on(window, "beforeprint", handleBeforePrint);
        on(window, "afterprint", handleAfterPrint);
        on(printButton, "click", handlePrintClick);
        on(exportButton, "click", exportBrief);

        renderForCurrentBrand();

        // Router gọi hàm trả về này trước khi thay view mới vào #app-content.
        return () => {
            cleanups.forEach((cleanup) => cleanup());
            cleanups.length = 0;
            window.clearTimeout(badgeTimerId);
            resetBadge();
        };
    }

    window.KOCViewTemplates = window.KOCViewTemplates || {};
    window.KOCViewTemplates.brief = getBriefTemplate;
    window.initViewBrief = initViewBrief;
})();
