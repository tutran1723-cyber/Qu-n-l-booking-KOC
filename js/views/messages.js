(() => {
    "use strict";

    const DEFAULT_VALUES = {
        koc: "",
        pic: "",
        product: ""
    };

    const TEMPLATE_IDS = ["tpl-1", "tpl-2", "tpl-3", "tpl-4", "tpl-5"];

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getCleanBrandName() {
        const activeBrand = window.KOCApp?.brand?.getCurrent?.();
        return activeBrand?.name
            ? activeBrand.name.split("(")[0].trim()
            : "[Tên Thương Hiệu]";
    }

    async function writeClipboardText(text) {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        // Fallback cho file:// hoặc trình duyệt không cấp Clipboard API.
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        textarea.remove();

        if (!copied) {
            throw new Error("Trình duyệt không cho phép sao chép vào khay nhớ tạm.");
        }
    }

    function getMessagesTemplate() {
        return `
            <div class="content-wrapper message-view" data-view="messages">
                <section class="card-controls" aria-labelledby="messages-heading">
                    <h2 class="section-title" id="messages-heading">
                        <i class="fa-regular fa-comments"></i>
                        Bộ tin nhắn &amp; kịch bản chăm sóc
                    </h2>
                    <p class="section-subtitle">
                        Điền thông tin → mẫu tự cập nhật → bấm Copy. Tin nhắn chuyên nghiệp tăng tỷ lệ phản hồi &amp; đồng ý.
                        Có thể sửa trực tiếp vào văn bản bên dưới.
                    </p>

                    <div class="input-grid">
                        <div class="input-group">
                            <label for="inp-koc">Tên KOC</label>
                            <input type="text" id="inp-koc" placeholder="VD: Tú, duckieud..." autocomplete="off">
                        </div>
                        <div class="input-group">
                            <label for="inp-pic">Tên bạn (người phụ trách)</label>
                            <input type="text" id="inp-pic" placeholder="VD: Kiên, Hưng..." autocomplete="off">
                        </div>
                        <div class="input-group">
                            <label for="inp-prod">Sản phẩm</label>
                            <input type="text" id="inp-prod" placeholder="VD: Kính Cận GM 2505..." autocomplete="off">
                        </div>
                    </div>
                </section>

                <section class="template-card">
                    <div class="template-header">
                        <h3 class="template-title">1. Liên hệ — Tin nhắn mở đầu (chuyên nghiệp)</h3>
                        <button class="btn-copy" type="button" data-copy-template="tpl-1">
                            <i class="fa-regular fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="template-body" id="tpl-1" contenteditable="true" spellcheck="true"></div>
                </section>

                <section class="template-card">
                    <div class="template-header">
                        <h3 class="template-title">2. Đàm phán — Sau khi KOC quan tâm</h3>
                        <button class="btn-copy" type="button" data-copy-template="tpl-2">
                            <i class="fa-regular fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="template-body" id="tpl-2" contenteditable="true" spellcheck="true"></div>
                </section>

                <section class="template-card">
                    <div class="template-header">
                        <h3 class="template-title">3. Chốt deal — Xác nhận thông tin cuối</h3>
                        <button class="btn-copy" type="button" data-copy-template="tpl-3">
                            <i class="fa-regular fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="template-body" id="tpl-3" contenteditable="true" spellcheck="true"></div>
                </section>

                <section class="template-card">
                    <div class="template-header">
                        <h3 class="template-title">4. Cảm ơn — Sau khi lên bài (0–3 ngày)</h3>
                        <button class="btn-copy" type="button" data-copy-template="tpl-4">
                            <i class="fa-regular fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="template-body" id="tpl-4" contenteditable="true" spellcheck="true"></div>
                </section>

                <section class="template-card">
                    <div class="template-header">
                        <h3 class="template-title">5. Tái hợp tác — Cho KOC Tier A/B (tuần 4+)</h3>
                        <button class="btn-copy" type="button" data-copy-template="tpl-5">
                            <i class="fa-regular fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="template-body" id="tpl-5" contenteditable="true" spellcheck="true"></div>
                </section>
            </div>`;
    }

    function initMessageController(root) {
        if (!(root instanceof Element)) return () => {};

        const view = root.querySelector('[data-view="messages"]');
        if (!view) return () => {};

        const inputKoc = view.querySelector("#inp-koc");
        const inputPic = view.querySelector("#inp-pic");
        const inputProduct = view.querySelector("#inp-prod");
        const syncBadge = document.querySelector("#sync-badge");
        const badgeOriginalHTML = syncBadge?.innerHTML || "";
        const copyTimers = new Map();
        let badgeTimerId = null;
        let isDestroyed = false;

        function placeholder(className, value) {
            return `<span class="ph ${className}">${escapeHTML(value)}</span>`;
        }

        function getValues() {
            return {
                koc: inputKoc.value.trim() || "[Tên KOC]",
                pic: inputPic.value.trim() || "[Tên bạn]",
                product: inputProduct.value.trim() || "[Sản phẩm]",
                brand: getCleanBrandName()
            };
        }

        function renderTemplates() {
            if (isDestroyed) return;

            const values = getValues();
            const koc = placeholder("ph-koc", values.koc);
            const pic = placeholder("ph-pic", values.pic);
            const product = placeholder("ph-prod", values.product);
            const brand = placeholder("ph-brand", values.brand);

            const templates = {
                "tpl-1": `Kính chào ${koc},\n\nEm là ${pic} – phụ trách hợp tác KOC/KOL của ${brand}.\n\nChúng em rất ấn tượng với phong cách review chân thật & tỉ mỉ của anh/chị trên kênh. Hiện ${brand} đang triển khai chiến dịch cho ${product} – sản phẩm bán chạy nhất, rất hợp tệp follow của mình.\n\nEm xin phép gửi anh/chị thông tin sản phẩm & chính sách hợp tác để mình cùng trao đổi nhé ạ. Em cảm ơn anh/chị!`,
                "tpl-2": `Dạ em gửi anh/chị thông tin nhé ạ:\n• Sản phẩm: ${product}\n• USP: [Điền USP điểm mạnh của sản phẩm vào đây...]\n• Hình thức: KOC nhận sản phẩm + quay 1 video review theo brief định hướng.\n• Hoa hồng: % trên đơn ra từ link giỏ hàng (+ cast nếu có).\n\nAnh/chị cho em xin báo giá (cast + % hoa hồng) và doanh số/view trung bình gần đây để mình chốt phương án phù hợp nhất ạ. Em cảm ơn!`,
                "tpl-3": `Em xin chốt lại thông tin nhé ạ:\n1. KOC: ${koc}\n2. SĐT: ...\n3. Địa chỉ nhận hàng: ...\n4. Link TikTok: ...\n5. Review: ${product}\n6. Link sản phẩm: ...\n7. Số lượng video: 1\n✅ Cast: ... (...% cms + ...% ads)\n\nEm gửi brief kịch bản kèm theo. Mong anh/chị lên bài đúng lịch đã hẹn, em sẽ nhắc lịch demo trước nhé ạ!`,
                "tpl-4": `Cảm ơn ${koc} đã hợp tác cùng ${brand}! Video của anh/chị thật sự giúp thương hiệu kết nối với nhiều khách hàng hơn. Mong là video sẽ chuyển đổi hiệu quả và ra nhiều đơn ạ.\n\nEm sẽ tổng hợp & gửi anh/chị báo cáo hiệu quả (view, tỷ lệ chuyển đổi, doanh thu) sau ít ngày. Có gì cần hỗ trợ anh/chị nhắn em bất cứ lúc nào nhé!`,
                "tpl-5": `Chào ${koc}, video vừa rồi cho ${product} ra kết quả rất tốt, ${brand} rất vui khi được đồng hành cùng anh/chị 🎉\n\nEm muốn mời anh/chị thành "Brand Partner" của ${brand}: được cập nhật trước sản phẩm mới, ưu đãi riêng và chủ động lên concept. Sắp tới bên em ra mắt mẫu mới rất hợp tệp khách của anh/chị – mình hợp tác tiếp nhé ạ?\n\nEm cũng xin phép mời anh/chị vào nhóm cộng đồng KOC của ${brand} ạ!`
            };

            TEMPLATE_IDS.forEach((id) => {
                const element = view.querySelector(`#${id}`);
                if (element) element.innerHTML = templates[id];
            });
        }

        function resetCopyButton(button) {
            const originalHTML = button.dataset.originalHtml;
            if (originalHTML) button.innerHTML = originalHTML;
            button.classList.remove("copied");
            copyTimers.delete(button);
        }

        function showCopyFeedback(button) {
            if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
            if (copyTimers.has(button)) window.clearTimeout(copyTimers.get(button));

            button.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
            button.classList.add("copied");
            copyTimers.set(button, window.setTimeout(() => resetCopyButton(button), 2000));

            if (!syncBadge) return;
            if (badgeTimerId) window.clearTimeout(badgeTimerId);

            syncBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Đã copy vào khay nhớ tạm!';
            syncBadge.classList.add("show");
            badgeTimerId = window.setTimeout(() => {
                if (!isDestroyed) {
                    syncBadge.classList.remove("show");
                    syncBadge.innerHTML = badgeOriginalHTML;
                }
                badgeTimerId = null;
            }, 2000);
        }

        async function handleCopyClick(event) {
            const button = event.target.closest("[data-copy-template]");
            if (!button || !view.contains(button)) return;

            const template = view.querySelector(`#${button.dataset.copyTemplate}`);
            if (!template) return;

            try {
                await writeClipboardText(template.innerText);
                if (!isDestroyed) showCopyFeedback(button);
            } catch (error) {
                console.error("Không thể sao chép tin nhắn.", error);
                window.alert("Không thể copy tự động. Hãy bôi đen nội dung mẫu và sao chép thủ công.");
            }
        }

        function handleBrandChanged() {
            renderTemplates();
        }

        function handleInput() {
            renderTemplates();
        }

        [inputKoc, inputPic, inputProduct].forEach((input) => {
            input.value = DEFAULT_VALUES[input === inputKoc ? "koc" : input === inputPic ? "pic" : "product"];
            input.addEventListener("input", handleInput);
        });
        view.addEventListener("click", handleCopyClick);
        document.addEventListener("brand:changed", handleBrandChanged);

        // Chạy sau khi Router đã gắn template vào #app-content.
        renderTemplates();

        return () => {
            isDestroyed = true;

            [inputKoc, inputPic, inputProduct].forEach((input) => {
                input.removeEventListener("input", handleInput);
            });
            view.removeEventListener("click", handleCopyClick);
            document.removeEventListener("brand:changed", handleBrandChanged);

            [...copyTimers.entries()].forEach(([button, timerId]) => {
                window.clearTimeout(timerId);
                resetCopyButton(button);
            });
            if (badgeTimerId) window.clearTimeout(badgeTimerId);
            if (syncBadge) {
                syncBadge.classList.remove("show");
                syncBadge.innerHTML = badgeOriginalHTML;
            }
        };
    }

    window.KOCViewTemplates = window.KOCViewTemplates || {};
    window.KOCViewTemplates.messages = getMessagesTemplate;
    window.initMessageController = initMessageController;
    window.initViewMessages = initMessageController;
})();
