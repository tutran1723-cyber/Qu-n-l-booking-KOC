/* global XLSX */
(() => {
    "use strict";

    const ROUTES = {
        dashboard:   { view: "dashboard",   title: "Quy trình 8 bước",          init: "initViewDashboard" },
        brief:       { view: "brief",       title: "Brief & Sản phẩm",          init: "initViewBrief" },
        pricing:     { view: "pricing",     title: "Tính giá & Lợi nhuận",     init: "initViewPricing" },
        pipeline:    { view: "pipeline",    title: "Pipeline KOC",              init: "initViewPipeline" },
        scoring:     { view: "scoring",     title: "Chấm điểm KOC",             init: "initViewScoring" },
        measurement: { view: "measurement", title: "Đo lường & ROI",            init: "initViewMeasurement" },
        calendar:    { view: "calendar",    title: "Lịch lên bài",              init: "initViewCalendar" },
        messages:    { view: "messages",    title: "Tin nhắn & CSKH",           init: "initViewMessages" },
        contracts:   { view: "contracts",   title: "Hợp đồng & Thanh toán",     init: "initViewContracts" },
        commissions: { view: "commissions", title: "Hoa hồng quyết toán",       init: "initViewCommissions" }
    };

    const DEFAULT_BRANDS = [
        { id: "chosync", name: "Chosync (Thời trang)" },
        { id: "mot_chut_dua", name: "Một Chút Dừa (Gia dụng)" }
    ];

    const $ = (selector, root = document) => root.querySelector(selector);
    const appContent = $("#app-content");
    const headerTitle = $("#header-title");
    const brandAvatar = $("#brand-avatar-icon");
    const brandSelect = $("#brand-switcher");
    const deleteBrandButton = $("#btn-delete-brand");

    let currentViewCleanup = () => {};
    let renderSequence = 0;

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn(`Không thể đọc LocalStorage: ${key}`, error);
            return fallback;
        }
    }

    const BrandStore = {
        currentId: "",

        getBrands() {
            const brands = readJSON("sys_brands_list", DEFAULT_BRANDS);
            if (!Array.isArray(brands)) return [...DEFAULT_BRANDS];
            return brands;
        },

        saveBrands(brands) {
            localStorage.setItem("sys_brands_list", JSON.stringify(brands));
        },

        getCurrent() {
            const brand = this.getBrands().find((item) => item.id === this.currentId);
            return brand || null;
        },

        renderOptions() {
            const brands = this.getBrands();
            this.saveBrands(brands);

            brandSelect.innerHTML = "";
            brandSelect.add(new Option("-- Chọn thương hiệu --", ""));
            brands.forEach((brand) => brandSelect.add(new Option(brand.name, brand.id)));
            brandSelect.add(new Option("+ Thêm Brand mới...", "__ADD_NEW_BRAND__"));

            if (this.currentId && !brands.some((brand) => brand.id === this.currentId)) {
                this.currentId = "";
                localStorage.setItem("sys_current_brand", "");
            }

            brandSelect.value = this.currentId;
            deleteBrandButton.style.display = this.currentId ? "block" : "none";
        },

        setCurrent(id) {
            if (id === "__ADD_NEW_BRAND__") {
                const name = window.prompt("Nhập tên thương hiệu / dự án mới:");
                if (!name || !name.trim()) {
                    brandSelect.value = this.currentId;
                    return;
                }

                id = `brand_${Date.now()}`;
                const brands = this.getBrands();
                brands.push({ id, name: name.trim() });
                this.saveBrands(brands);
            }

            const isValid = this.getBrands().some((brand) => brand.id === id);
            this.currentId = isValid ? id : "";
            localStorage.setItem("sys_current_brand", this.currentId);
            this.renderOptions();

            document.dispatchEvent(new CustomEvent("brand:changed", {
                detail: { brand: this.getCurrent() }
            }));
        },

        deleteCurrent() {
            const activeBrand = this.getCurrent();
            if (!activeBrand) return;

            const confirmed = window.confirm(
                `CẢNH BÁO: Bạn có chắc chắn muốn xóa thương hiệu "${activeBrand.name}" ` +
                "và TOÀN BỘ dữ liệu liên quan không?\n\nHành động này không thể hoàn tác!"
            );
            if (!confirmed) return;

            const remainingBrands = this.getBrands().filter((brand) => brand.id !== activeBrand.id);
            this.saveBrands(remainingBrands);

            // Xóa toàn bộ LocalStorage có tiền tố id của brand này.
            const keysToRemove = [];
            for (let index = 0; index < localStorage.length; index += 1) {
                const key = localStorage.key(index);
                if (key && key.startsWith(`${activeBrand.id}_`)) keysToRemove.push(key);
            }
            keysToRemove.forEach((key) => localStorage.removeItem(key));

            this.currentId = "";
            localStorage.setItem("sys_current_brand", "");
            this.renderOptions();

            document.dispatchEvent(new CustomEvent("brand:changed", {
                detail: { brand: null }
            }));
            window.alert(`Đã xóa thương hiệu "${activeBrand.name}" thành công.`);
        },

        init() {
            this.currentId = localStorage.getItem("sys_current_brand") || "";
            this.renderOptions();

            brandSelect.addEventListener("change", (event) => this.setCurrent(event.target.value));
            deleteBrandButton.addEventListener("click", () => this.deleteCurrent());
        }
    };

    function getRouteName() {
        const hash = window.location.hash.replace(/^#\/?/, "").trim();
        return hash || "dashboard";
    }

    function updateShell(routeName) {
        const route = ROUTES[routeName];
        const activeBrand = BrandStore.getCurrent();

        document.querySelectorAll(".menu-item[data-route]").forEach((item) => {
            const isActive = item.dataset.route === routeName;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-current", isActive ? "page" : "false");
        });

        headerTitle.textContent = activeBrand
            ? `${route.title} — ${activeBrand.name}`
            : route.title;

        brandAvatar.textContent = activeBrand
            ? activeBrand.name.slice(0, 2).toUpperCase()
            : "MB";

        document.title = `${route.title} | Multi-Brand HQ`;
    }

    function renderLoading() {
        appContent.innerHTML = `
            <div class="view-status">
                <div class="card">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <p>Đang tải nội dung...</p>
                </div>
            </div>`;
    }

    function renderError(viewName, error) {
        console.error(error);
        appContent.innerHTML = `
            <div class="view-status">
                <div class="card view-error">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <h2>Không thể tải view “${viewName}”</h2>
                    <p>Kiểm tra lại file <code>views/${viewName}.html</code> và chạy dự án bằng local server.</p>
                </div>
            </div>`;
    }

    // Ưu tiên template đã được đăng ký từ js/views/*.js.
    // Nhờ đó view Brief không cần fetch views/brief.html và có thể dùng được khi đóng gói offline.
    async function loadView(viewName) {
        const registeredTemplate = window.KOCViewTemplates?.[viewName];
        if (typeof registeredTemplate === "function") {
            return registeredTemplate();
        }
        if (typeof registeredTemplate === "string") {
            return registeredTemplate;
        }

        const embeddedTemplate = document.getElementById(`view-${viewName}`);
        if (embeddedTemplate instanceof HTMLTemplateElement) {
            return embeddedTemplate.innerHTML;
        }

        const response = await fetch(`views/${viewName}.html`, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: views/${viewName}.html`);
        }
        return response.text();
    }

    async function renderRoute() {
        let routeName = getRouteName();

        if (!ROUTES[routeName]) {
            window.location.hash = "#/dashboard";
            return;
        }

        const route = ROUTES[routeName];
        const requestId = ++renderSequence;

        currentViewCleanup();
        currentViewCleanup = () => {};
        updateShell(routeName);
        renderLoading();

        try {
            const viewHTML = await loadView(route.view);
            if (requestId !== renderSequence) return; // Tránh race condition khi click liên tục.

            appContent.innerHTML = viewHTML;
            appContent.scrollTop = 0;

            const initView = window[route.init];
            const cleanup = typeof initView === "function"
                ? initView(appContent)
                : undefined;

            currentViewCleanup = typeof cleanup === "function" ? cleanup : () => {};
        } catch (error) {
            if (requestId === renderSequence) renderError(route.view, error);
        }
    }

    function startRouter() {
        if (!window.location.hash) {
            window.location.hash = "#/dashboard";
        } else {
            renderRoute();
        }

        window.addEventListener("hashchange", renderRoute);

        // Router đã cleanup khi đổi route; bổ sung pagehide để giải phóng
        // listener/timer nếu người dùng đóng tab hoặc rời khỏi ứng dụng.
        window.addEventListener("pagehide", () => {
            currentViewCleanup();
            currentViewCleanup = () => {};
        }, { once: true });

        document.addEventListener("brand:changed", () => {
            const routeName = getRouteName();
            if (ROUTES[routeName]) updateShell(routeName);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        BrandStore.init();
        startRouter();
    });

    // API dùng chung cho các file js/views/*.js
    window.KOCApp = {
        routes: ROUTES,
        loadView,
        navigate: (routeName) => {
            window.location.hash = `#/${routeName}`;
        },
        brand: BrandStore,
        getCurrentRoute: getRouteName
    };
})();
