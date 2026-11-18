/* global XLSX */
(() => {
    "use strict";

    window.KOCViewTemplates = window.KOCViewTemplates || {};

    window.KOCViewTemplates.scoring = () => `
        <div class="content-wrapper scoring-view">
            <div class="card">
                <div class="scoring-header">
                    <h2><i class="fa-solid fa-ruler-combined"></i> Bộ tiêu chí chấm điểm KOC</h2>
                    <p>"Không phải cứ KOC lớn là ra đơn." Nhập chỉ số 1 KOC → công cụ chấm điểm &amp; gợi ý nên book hay bỏ qua.</p>
                </div>

                <div class="scoring-layout">
                    <div class="form-area">
                        <div class="form-group">
                            <label class="form-label" for="inp-name">Tên / ID KOC (tham khảo)</label>
                            <input type="text" class="form-input" id="inp-name" placeholder="VD: kien, duckieud...">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="inp-view">View trung bình</label>
                                <input type="number" class="form-input" id="inp-view" placeholder="0" min="0">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="inp-eng">Tương tác (%)</label>
                                <input type="number" class="form-input" id="inp-eng" placeholder="0" min="0" step="0.1">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="inp-follow">Follow</label>
                                <input type="number" class="form-input" id="inp-follow" placeholder="0" min="0">
                            </div>
                        </div>

                        <div class="form-row-2">
                            <div class="form-group">
                                <label class="form-label" for="inp-sold">Đã bán SP tương tự?</label>
                                <select class="form-input" id="inp-sold">
                                    <option value="Chưa">Chưa</option>
                                    <option value="Rồi">Rồi</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="inp-rel">Nội dung liên quan ngành?</label>
                                <select class="form-input" id="inp-rel">
                                    <option value="Không">Không</option>
                                    <option value="Có">Có</option>
                                </select>
                            </div>
                        </div>

                        <button class="btn-submit" id="btn-add-pipeline" type="button">
                            <i class="fa-solid fa-plus"></i> Đưa KOC này vào Pipeline
                        </button>
                    </div>

                    <div class="result-area">
                        <div class="score-display">
                            <span>ĐIỂM PHÙ HỢP</span>
                            <h1 id="res-total">0</h1>
                            <div class="badge-status bs-red" id="res-badge">
                                <i class="fa-solid fa-circle-xmark"></i> BỎ QUA — tối ưu chi phí
                            </div>
                        </div>

                        <div class="breakdown-list">
                            <div class="breakdown-item">
                                <span>View TB (<span id="txt-view">0</span>)</span>
                                <span id="pt-view">0/30</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Tương tác (<span id="txt-eng">0</span>%)</span>
                                <span id="pt-eng">0/25</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Follow (<span id="txt-follow">0</span>)</span>
                                <span id="pt-follow">0/15</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Đã bán SP tương tự</span>
                                <span id="pt-sold">0/15</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Nội dung liên quan</span>
                                <span id="pt-rel">0/15</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="rubric-header">THANG ĐIỂM (TỔNG 100)</div>
                <div class="scoring-rubric-table">
                    <table>
                        <thead>
                            <tr>
                                <th>TIÊU CHÍ</th>
                                <th>CÁCH TÍNH ĐIỂM</th>
                                <th style="width:80px">TỐI ĐA</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>View trung bình / video</td>
                                <td>&gt;100k = 30 · &gt;40k = 24 · &gt;10k = 15 · còn lại = 6</td>
                                <td>30</td>
                            </tr>
                            <tr>
                                <td>Tỷ lệ tương tác</td>
                                <td>≥5% = 25 · ≥3% = 20 · ≥2% = 14 · còn lại = 6</td>
                                <td>25</td>
                            </tr>
                            <tr>
                                <td>Tệp follow phù hợp</td>
                                <td>2k-50k (sweet spot) = 15 · &gt;50k = 12 · &lt;2k = 6</td>
                                <td>15</td>
                            </tr>
                            <tr>
                                <td>Đã bán SP tương tự</td>
                                <td>Rồi = 15 · Chưa = 0</td>
                                <td>15</td>
                            </tr>
                            <tr>
                                <td>Nội dung liên quan ngành</td>
                                <td>Có = 15 · Không = 0</td>
                                <td>15</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="rubric-footer">
                    <i class="fa-solid fa-bullseye"></i>
                    <strong>≥ 75:</strong> Nên book (ưu tiên) ·
                    <strong>55-74:</strong> Cân nhắc / thương lượng cast thấp ·
                    <strong>&lt; 55:</strong> Bỏ qua, tối ưu từng đồng chi phí.
                </div>
            </div>
        </div>`;

    function initViewScoring(root) {
        const $ = (selector) => root.querySelector(selector);
        const disposers = [];
        let badgeTimer = null;
        let currentScore = 0;
        let evaluationResultText = "Bỏ qua";

        const inputs = {
            name: $("#inp-name"),
            view: $("#inp-view"),
            eng: $("#inp-eng"),
            follow: $("#inp-follow"),
            sold: $("#inp-sold"),
            rel: $("#inp-rel")
        };

        const output = {
            total: $("#res-total"),
            badge: $("#res-badge"),
            textView: $("#txt-view"),
            textEng: $("#txt-eng"),
            textFollow: $("#txt-follow"),
            pointView: $("#pt-view"),
            pointEng: $("#pt-eng"),
            pointFollow: $("#pt-follow"),
            pointSold: $("#pt-sold"),
            pointRel: $("#pt-rel")
        };

        const addPipelineButton = $("#btn-add-pipeline");
        const exportButton = document.getElementById("btn-export");
        const printButton = document.getElementById("btn-print");
        const syncBadge = document.getElementById("sync-badge");

        function on(element, eventName, handler, options) {
            if (!element) return;
            element.addEventListener(eventName, handler, options);
            disposers.push(() => element.removeEventListener(eventName, handler, options));
        }

        function toNonNegativeNumber(value) {
            const number = Number.parseFloat(value);
            return Number.isFinite(number) && number > 0 ? number : 0;
        }

        function formatNumber(number) {
            return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(number);
        }

        function calculateScore() {
            const view = toNonNegativeNumber(inputs.view.value);
            const eng = toNonNegativeNumber(inputs.eng.value);
            const follow = toNonNegativeNumber(inputs.follow.value);

            let scoreView = 6;
            if (view > 100000) scoreView = 30;
            else if (view > 40000) scoreView = 24;
            else if (view > 10000) scoreView = 15;

            let scoreEng = 6;
            if (eng >= 5) scoreEng = 25;
            else if (eng >= 3) scoreEng = 20;
            else if (eng >= 2) scoreEng = 14;

            let scoreFollow = 6;
            if (follow >= 2000 && follow <= 50000) scoreFollow = 15;
            else if (follow > 50000) scoreFollow = 12;

            const scoreSold = inputs.sold.value === "Rồi" ? 15 : 0;
            const scoreRel = inputs.rel.value === "Có" ? 15 : 0;

            currentScore = scoreView + scoreEng + scoreFollow + scoreSold + scoreRel;

            output.textView.textContent = formatNumber(view);
            output.textEng.textContent = formatNumber(eng);
            output.textFollow.textContent = formatNumber(follow);

            output.pointView.textContent = `${scoreView}/30`;
            output.pointEng.textContent = `${scoreEng}/25`;
            output.pointFollow.textContent = `${scoreFollow}/15`;
            output.pointSold.textContent = `${scoreSold}/15`;
            output.pointRel.textContent = `${scoreRel}/15`;
            output.total.textContent = currentScore;

            if (currentScore >= 75) {
                output.badge.className = "badge-status bs-green";
                output.badge.innerHTML = '<i class="fa-solid fa-check-circle"></i> NÊN BOOK — Ưu tiên';
                evaluationResultText = "Nên book";
            } else if (currentScore >= 55) {
                output.badge.className = "badge-status bs-yellow";
                output.badge.innerHTML = '<i class="fa-solid fa-scale-balanced"></i> CÂN NHẮC — thương lượng cast thấp';
                evaluationResultText = "Cân nhắc";
            } else {
                output.badge.className = "badge-status bs-red";
                output.badge.innerHTML = '<i class="fa-solid fa-ban"></i> BỎ QUA — tối ưu chi phí';
                evaluationResultText = "Bỏ qua";
            }
        }

        function readPipeline(brandId) {
            try {
                const stored = JSON.parse(localStorage.getItem(`${brandId}_koc_pipeline`) || "[]");
                return Array.isArray(stored) ? stored : [];
            } catch (error) {
                console.warn("Không thể đọc Pipeline từ LocalStorage.", error);
                return [];
            }
        }

        function showSyncMessage(message) {
            if (!syncBadge) return;

            window.clearTimeout(badgeTimer);
            syncBadge.innerHTML = `<i class="fa-solid fa-check" style="margin-right:6px"></i> ${message}`;
            syncBadge.classList.add("show");

            badgeTimer = window.setTimeout(() => {
                syncBadge.classList.remove("show");
            }, 2000);
        }

        function resetForm() {
            inputs.name.value = "";
            inputs.view.value = "";
            inputs.eng.value = "";
            inputs.follow.value = "";
            inputs.sold.value = "Chưa";
            inputs.rel.value = "Không";
            calculateScore();
        }

        function addToPipeline() {
            const activeBrand = window.KOCApp?.brand?.getCurrent();

            if (!activeBrand) {
                window.alert("Vui lòng chọn nhãn hàng ở menu trái trước khi thêm KOC vào Pipeline!");
                return;
            }

            const name = inputs.name.value.trim();
            if (!name) {
                window.alert("Vui lòng nhập Tên / ID KOC!");
                inputs.name.focus();
                return;
            }

            const pipelineData = readPipeline(activeBrand.id);
            const newKoc = {
                id: `koc_${Date.now()}`,
                name,
                industry: "",
                content_type: "",
                age: "",
                follow: toNonNegativeNumber(inputs.follow.value),
                view: toNonNegativeNumber(inputs.view.value),
                tt: inputs.eng.value,
                sim_prod: inputs.sold.value === "Rồi",
                rel_content: inputs.rel.value === "Có",
                score: currentScore,
                product: "",
                cast: "",
                cms: "",
                stage: "Tìm kiếm"
            };

            pipelineData.unshift(newKoc);
            localStorage.setItem(`${activeBrand.id}_koc_pipeline`, JSON.stringify(pipelineData));

            showSyncMessage("Đã thêm vào Pipeline");
            resetForm();
        }

        function exportCurrentResult() {
            const xlsx = window.XLSX;
            if (!xlsx) {
                window.alert("Không tìm thấy thư viện xuất Excel (SheetJS).");
                return;
            }

            const activeBrand = window.KOCApp?.brand?.getCurrent();
            const name = inputs.name.value.trim() || "Chưa nhập tên";
            const exportData = [{
                "Tên/ID KOC": name,
                "View TB": toNonNegativeNumber(inputs.view.value),
                "Follow": toNonNegativeNumber(inputs.follow.value),
                "Tương tác (%)": toNonNegativeNumber(inputs.eng.value),
                "Bán SP tương tự": inputs.sold.value,
                "ND liên quan": inputs.rel.value,
                "Tổng Điểm": currentScore,
                "Đánh Giá": evaluationResultText
            }];

            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Cham_Diem");
            xlsx.writeFile(
                workbook,
                `Danh_Gia_KOC_${name}_${activeBrand?.id || "Data"}.xlsx`
            );
        }

        [inputs.view, inputs.eng, inputs.follow].forEach((element) => {
            on(element, "input", calculateScore);
            on(element, "change", calculateScore);
        });
        [inputs.sold, inputs.rel].forEach((element) => on(element, "change", calculateScore));

        on(addPipelineButton, "click", addToPipeline);
        on(printButton, "click", () => window.print());
        on(exportButton, "click", exportCurrentResult);

        calculateScore();

        // Router gọi hàm này trước khi render view kế tiếp hoặc khi đóng tab.
        return () => {
            disposers.splice(0).forEach((dispose) => dispose());
            window.clearTimeout(badgeTimer);
            if (syncBadge) syncBadge.classList.remove("show");
        };
    }

    window.initViewScoring = initViewScoring;
    // Alias theo cách đặt tên controller mà bạn yêu cầu.
    window.initScoringController = initViewScoring;
})();
