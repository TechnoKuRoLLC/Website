document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // DOM要素の取得
    const desktopHeader = document.querySelector(".desktop-header");
    const mobileHeader = document.querySelector(".mobile-header");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const menuBtn = document.getElementById("openMenu");
    const closeBtn = document.getElementById("closeMenu");
    const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

    console.log("Elements found:", {
        desktopHeader: !!desktopHeader,
        mobileHeader: !!mobileHeader,
        hamburgerMenu: !!hamburgerMenu,
        menuBtn: !!menuBtn,
        closeBtn: !!closeBtn,
        mobileNavItems: mobileNavItems.length
    });

    // レスポンシブ対応のための変数
    let isMobile = window.innerWidth < 768;
    let isTablet = window.innerWidth >= 768 && window.innerWidth < 993;
    let isDesktop = window.innerWidth >= 993;

    // fullPage.jsとLenisの変数
    let fullpage_api;
    let lenis;

    // ページ全体のスクロールを制御する関数
    function togglePageScroll(allow) {
        const currentIsDesktop = window.innerWidth >= 993;

        if (allow) {
            // スクロールを有効にする
            document.body.style.overflow = currentIsDesktop ? "hidden" : "auto";
            document.documentElement.style.overflow = currentIsDesktop ? "hidden" : "auto";

            if (fullpage_api && typeof fullpage_api.setAllowScrolling === "function") {
                fullpage_api.setAllowScrolling(true);
                console.log("FullPage scrolling enabled");
            }
            if (lenis && typeof lenis.start === "function") {
                lenis.start();
                console.log("Lenis scrolling started");
            }
        } else {
            // スクロールを無効にする
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";

            if (fullpage_api && typeof fullpage_api.setAllowScrolling === "function") {
                fullpage_api.setAllowScrolling(false);
                console.log("FullPage scrolling disabled");
            }
            if (lenis && typeof lenis.stop === "function") {
                lenis.stop();
                console.log("Lenis scrolling stopped");
            }
        }
    }

    // Swiperの初期化
    function initSwiper() {
        const swiperElement = document.querySelector(".blog-swiper");
        if (swiperElement && typeof Swiper !== "undefined") {
            try {
                new Swiper(".blog-swiper", {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    loop: true,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                    breakpoints: {
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 30 },
                    },
                });
                console.log("Swiper initialized successfully");
            } catch (error) {
                console.error("Error initializing Swiper:", error);
            }
        }
    }

    // ヘッダーの表示/非表示を切り替える関数
    function toggleHeaderVisibility(sectionIndex) {
        console.log("Toggling header visibility for section:", sectionIndex);

        // 全てのヘッダーを非表示
        if (desktopHeader) desktopHeader.style.display = "none";
        if (mobileHeader) mobileHeader.style.display = "none";

        // セクションに応じてヘッダーを表示
        if (sectionIndex === 0) {
            if (desktopHeader && isDesktop) {
                desktopHeader.style.display = "block";
                console.log("Desktop header displayed for hero section");
            } else if (mobileHeader) {
                mobileHeader.style.display = "flex";
                console.log("Mobile header displayed for hero section");
            }
        } else {
            if (mobileHeader) {
                mobileHeader.style.display = "flex";
                console.log("Mobile header displayed for section:", sectionIndex);
            }
        }
        updateMobileNavActive(sectionIndex);
    }

    // モバイルナビゲーションのアクティブ状態を更新
    function updateMobileNavActive(sectionIndex) {
        if (!mobileNavItems.length) return;
        mobileNavItems.forEach((item, index) => {
            item.classList.toggle("active", index === sectionIndex);
        });
    }

    // ハンバーガーメニューの制御
    function setupHamburgerMenu() {
        if (!menuBtn || !closeBtn || !hamburgerMenu) {
            console.warn("Hamburger menu elements not found");
            return;
        }
        
        console.log("Setting up hamburger menu event listeners");

        // メニューを開く
        menuBtn.addEventListener("click", (e) => {
            e.preventDefault();
            hamburgerMenu.style.display = "flex";
            menuBtn.classList.add("active");
            togglePageScroll(false);
        });

        // メニューを閉じる
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            hamburgerMenu.style.display = "none";
            menuBtn.classList.remove("active");
            togglePageScroll(true);
        });

        // メニューリンクのクリック処理
        const menuLinks = hamburgerMenu.querySelectorAll("a");
        menuLinks.forEach((link) => {
            link.addEventListener("click", () => {
                console.log("Menu link clicked");
                hamburgerMenu.style.display = "none";
                menuBtn.classList.remove("active");
                togglePageScroll(true);
            });
        });
    }

    // fullPage.jsの初期化関数
    function initFullPage() {
        const fullpageElement = document.getElementById("fullpage");
        if (!fullpageElement || !isDesktop || typeof fullpage === "undefined") {
            console.log("FullPage.js not initialized - missing element or not desktop");
            return;
        }

        console.log("Initializing fullPage.js");

        // 既存のインスタンスをクリーンアップ
        if (fullpage_api) {
            try {
                fullpage_api.destroy("all");
            } catch (error) {
                console.warn("Error destroying fullPage.js:", error);
            }
            fullpage_api = null;
        }

        if (lenis) {
            try {
                if (typeof lenis.destroy === "function") {
                    lenis.destroy();
                }
            } catch (error) {
                console.warn("Error destroying Lenis:", error);
            }
            lenis = null;
        }

        try {
            fullpage_api = new fullpage("#fullpage", {
                licenseKey: "",
                autoScrolling: true,
                scrollHorizontally: false,
                navigation: false,
                anchors: ["hero","philosophy","about", "service", "activity", "blog", "news", "contact", "footer"],
                menu: "#menu",
                scrollOverflow: true,
                normalScrollElements: ".hamburger-menu, .news-list, .swiper",
                fixedElements: ".desktop-header, .mobile-header, .hamburger-menu, .mobile-nav",
                responsiveWidth: 993,
                afterLoad: (origin, destination, direction) => {
                    console.log("Section loaded:", destination.index + 1);
                    updateSectionStyles(destination.index);
                    toggleHeaderVisibility(destination.index);
                },
                onLeave: (origin, destination, direction) => {
                    console.log("Leaving section:", origin.index + 1, "to", destination.index + 1);
                    toggleHeaderVisibility(destination.index);
                    return true;
                },
            });

            // セクションのオーバーフローを設定
            document.querySelectorAll(".fp-section").forEach(section => {
                section.style.overflowY = "auto";
            });

            console.log("fullPage.js initialized successfully");
        } catch (error) {
            console.error("Error initializing fullPage.js:", error);
        }
    }

    // Lenisの初期化関数
    function initLenis() {
        if (typeof Lenis === "undefined" || (!isMobile && !isTablet)) {
            console.log("Lenis not initialized - library missing or not mobile/tablet");
            return;
        }

        console.log("Initializing Lenis");

        // 既存のインスタンスをクリーンアップ
        if (fullpage_api) {
            try {
                fullpage_api.destroy("all");
            } catch (error) {
                console.warn("Error destroying fullPage.js:", error);
            }
            fullpage_api = null;
        }

        if (lenis) {
            try {
                if (typeof lenis.destroy === "function") {
                    lenis.destroy();
                }
            } catch (error) {
                console.warn("Error destroying Lenis:", error);
            }
            lenis = null;
        }

        try {
            lenis = new Lenis({
                duration: 1.0,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            function updateRaf(time) {
                if (lenis) {
                    lenis.raf(time);
                    requestAnimationFrame(updateRaf);
                }
            }
            requestAnimationFrame(updateRaf);

            // スクロールイベントの処理
            let ticking = false;
            window.addEventListener("scroll", () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const sections = document.querySelectorAll(".section");
                        const scrollPosition = window.scrollY;
                        
                        sections.forEach((section, index) => {
                            const sectionTop = section.offsetTop;
                            const sectionHeight = section.offsetHeight;
                            if (scrollPosition >= sectionTop - 100 && 
                                scrollPosition < sectionTop + sectionHeight - 100) {
                                updateMobileNavActive(index);
                            }
                        });
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // セクションのオーバーフローを設定
            document.querySelectorAll(".section").forEach(section => {
                section.style.overflowY = "auto";
            });

            console.log("Lenis initialized successfully");
        } catch (error) {
            console.error("Error initializing Lenis:", error);
        }
    }

    // セクションスタイルの更新
    function updateSectionStyles(index) {
        const sections = document.querySelectorAll(".section");
        if (index >= 0 && index < sections.length) {
            const currentSection = sections[index];
            const header = document.querySelector(".desktop-header");
            if (header) {
                if (currentSection.classList.contains("service-section") || 
                    currentSection.classList.contains("activity-section")) {
                    header.style.color = "#000";
                } else {
                    header.style.color = "#fff";
                }
            }
        }
    }

    // カスタムカーソルの初期化
    function initCustomCursor() {
        if (isMobile || isTablet) return;
        
        const cursor = document.getElementById("cursor");
        if (!cursor) return;
        
        console.log("Initializing custom cursor");

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        // マウス座標の更新
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // カーソルの滑らかな動き
        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + "px";
            cursor.style.top = cursorY + "px";
            
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // インタラクティブ要素のホバー効果
        const interactiveElements = document.querySelectorAll(
            "a, button, .cta-button, .blog-card, .news-item, .swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet, .c-carousel__btn-next, .c-carousel__btn-prev, .c-carousel__pagination-item"
        );

        interactiveElements.forEach((element) => {
            element.addEventListener("mouseenter", () => {
                cursor.classList.add("cursor--hover");
            });
            element.addEventListener("mouseleave", () => {
                cursor.classList.remove("cursor--hover");
            });
        });

        // セクションごとのカーソルスタイル
        const sections = document.querySelectorAll(".section");
        sections.forEach((section) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            cursor.classList.remove("cursor-light", "cursor-dark");
                            if (section.classList.contains("service-section") || 
                                section.classList.contains("activity-section")) {
                                cursor.classList.add("cursor-dark");
                            } else {
                                cursor.classList.add("cursor-light");
                            }
                        }
                    });
                },
                { threshold: 0.5 }
            );
            observer.observe(section);
        });

        cursor.style.opacity = "1";
    }

    // モバイルナビゲーションの設定
    function setupMobileNav() {
        if (!mobileNavItems.length) return;
        
        mobileNavItems.forEach((item) => {
            item.addEventListener("click", function (e) {
                const href = this.getAttribute("href");
                if (fullpage_api && href) {
                    e.preventDefault();
                    const sectionIndex = Array.from(mobileNavItems).findIndex(navItem => navItem === this);
                    fullpage_api.moveTo(href.replace("#", ""));
                    updateMobileNavActive(sectionIndex);
                }
                // Lenisの場合は通常のアンカーリンクとして動作
            });
        });
    }

    // タイトルアニメーションの初期化
    function initTitleAnimations() {
        const targets = document.querySelectorAll(
            ".section-title, .about-title, .service-title, .news-title, .contact-title"
        );
        if (!targets.length) return;

        const observerOptions = { 
            root: null, 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        targets.forEach((target) => observer.observe(target));
        console.log("Title animations observer initialized");
    }

    // サービスタイトル画像の表示アニメーション
    function initServiceTitleImageAnimation() {
        const serviceTitleImg = document.querySelector('.service-title img');
        if (serviceTitleImg) {
            console.log("Service title image found, adding 'show' class.");
            serviceTitleImg.classList.add('show');
        } else {
            console.warn("Service title image (.service-title img) not found.");
        }
    }

    // レスポンシブ変数の更新
    function updateResponsiveVariables() {
        isMobile = window.innerWidth < 768;
        isTablet = window.innerWidth >= 768 && window.innerWidth < 993;
        isDesktop = window.innerWidth >= 993;
    }

    // 現在のセクションインデックスの取得
    function getCurrentSectionIndex() {
        if (fullpage_api && fullpage_api.getActiveSection) {
            const activeSection = fullpage_api.getActiveSection();
            return activeSection ? activeSection.index : 0;
        }
        
        // Lenisの場合やフォールバック
        const sections = document.querySelectorAll(".section");
        const scrollPosition = window.scrollY;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && 
                scrollPosition < sectionTop + sectionHeight - 100) {
                return i;
            }
        }
        return 0;
    }

    // ウィンドウのリサイズ時の処理
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const oldIsMobile = isMobile;
            const oldIsTablet = isTablet;
            const oldIsDesktop = isDesktop;

            updateResponsiveVariables();

            if (oldIsMobile !== isMobile || oldIsTablet !== isTablet || oldIsDesktop !== isDesktop) {
                console.log("Window resized, reinitializing based on new dimensions");

                if (isDesktop) {
                    initFullPage();
                } else {
                    initLenis();
                }

                // ヘッダー表示を更新
                const currentSectionIndex = getCurrentSectionIndex();
                toggleHeaderVisibility(currentSectionIndex);

                // モバイルナビゲーションの表示/非表示
                const mobileNav = document.querySelector(".mobile-nav");
                if (mobileNav) {
                    mobileNav.style.display = isDesktop ? "none" : "flex";
                }
            }

            // ハンバーガーメニューを閉じる（デスクトップ表示時）
            if (window.innerWidth > 1024 && hamburgerMenu) {
                if (hamburgerMenu.style.display === "flex") {
                    hamburgerMenu.style.display = "none";
                    if (menuBtn) menuBtn.classList.remove("active");
                    togglePageScroll(true);
                }
            }
        }, 250);
    });

    // エラーハンドリング
    window.addEventListener("error", (e) => {
        console.error("JavaScript error:", e.message, "at", e.filename, ":", e.lineno);
        // エラー発生時にスクロールを復旧
        try {
            togglePageScroll(true);
        } catch (recoveryError) {
            console.error("Error during scroll recovery:", recoveryError);
        }
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (e) => {
        console.error("Unhandled promise rejection:", e.reason);
    });

    // 初期化処理
    function init() {
        console.log("Initializing app");

        try {
            setupHamburgerMenu();
            setupMobileNav();
            initSwiper();
            initTitleAnimations();

            if (isDesktop) {
                initFullPage();
                const mobileNav = document.querySelector(".mobile-nav");
                if (mobileNav) mobileNav.style.display = "none";
            } else {
                initLenis();
                const mobileNav = document.querySelector(".mobile-nav");
                if (mobileNav) mobileNav.style.display = "flex";
            }

            initCustomCursor();
            toggleHeaderVisibility(0);

            // bodyとhtmlのoverflow初期設定
            document.body.style.overflow = isDesktop ? "hidden" : "auto";
            document.documentElement.style.overflow = isDesktop ? "hidden" : "auto";

            initServiceTitleImageAnimation();

            console.log("App initialization completed");
        } catch (error) {
            console.error("Error during initialization:", error);
        }
    }

    // アプリケーションの初期化実行
    init();
});