document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const desktopHeader = document.querySelector('.desktop-header');
    const mobileHeader = document.querySelector('.mobile-header');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuBtn = document.getElementById('openMenu');
    const closeBtn = document.getElementById('closeMenu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    // レスポンシブ対応のための変数
    let isMobile = window.innerWidth < 768;
    let isTablet = window.innerWidth >= 768 && window.innerWidth < 993;
    let isDesktop = window.innerWidth >= 993;

    // fullPage.jsとLenisの変数
    let fullpageApi;
    let lenis;

    // ページ全体のスクロールを制御する関数
    function togglePageScroll(allow) {
        const currentIsDesktop = window.innerWidth >= 993;

        if (allow) {
            // スクロールを有効にする
            document.body.style.overflow = currentIsDesktop ? 'hidden' : 'auto';
            document.documentElement.style.overflow = currentIsDesktop ? 'hidden' : 'auto';

            if (fullpageApi && typeof fullpageApi.setAllowScrolling === 'function') {
                fullpageApi.setAllowScrolling(true);
            }
            if (lenis && typeof lenis.start === 'function') {
                lenis.start();
            }
        } else {
            // スクロールを無効にする
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            if (fullpageApi && typeof fullpageApi.setAllowScrolling === 'function') {
                fullpageApi.setAllowScrolling(false);
            }
            if (lenis && typeof lenis.stop === 'function') {
                lenis.stop();
            }
        }
    }

    // Swiperの初期化
    function initSwiper() {
        const swiperElement = document.querySelector('.blog-swiper');
        if (swiperElement && typeof Swiper !== 'undefined') {
            try {
                new Swiper('.blog-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 30 },
                    },
                });
            } catch (error) {
                console.error('Error initializing Swiper:', error);
            }
        }
    }

    // ヘッダーの表示/非表示を切り替える関数
    function toggleHeaderVisibility(sectionIndex) {
        // 全てのヘッダーを非表示
        if (desktopHeader) desktopHeader.style.display = 'none';
        if (mobileHeader) mobileHeader.style.display = 'none';

        // セクションに応じてヘッダーを表示
        if (sectionIndex === 0) {
            if (desktopHeader && isDesktop) {
                desktopHeader.style.display = 'block';
            } else if (mobileHeader) {
                mobileHeader.style.display = 'flex';
            }
        } else {
            if (mobileHeader) {
                mobileHeader.style.display = 'flex';
            }
        }
        updateMobileNavActive(sectionIndex);
    }

    // モバイルナビゲーションのアクティブ状態を更新
    function updateMobileNavActive(sectionIndex) {
        if (!mobileNavItems.length) return;
        mobileNavItems.forEach((item, index) => {
            item.classList.toggle('active', index === sectionIndex);
        });
    }

    // ハンバーガーメニューの制御
    function setupHamburgerMenu() {
        if (!menuBtn || !closeBtn || !hamburgerMenu) {
            return;
        }

        // メニューを開く
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hamburgerMenu.style.display = 'flex';
            menuBtn.classList.add('active');
            togglePageScroll(false);
        });

        // メニューを閉じる
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hamburgerMenu.style.display = 'none';
            menuBtn.classList.remove('active');
            togglePageScroll(true);
        });

        // メニューリンクのクリック処理
        const menuLinks = hamburgerMenu.querySelectorAll('a');
        menuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                hamburgerMenu.style.display = 'none';
                menuBtn.classList.remove('active');
                togglePageScroll(true);
            });
        });
    }

    // fullPage.jsの初期化関数
    function initFullPage() {
        const fullpageElement = document.getElementById('fullpage');
        if (!fullpageElement || !isDesktop || typeof fullpage === 'undefined') {
            return;
        }

        // 既存のインスタンスをクリーンアップ
        if (fullpageApi) {
            try {
                fullpageApi.destroy('all');
            } catch (error) {
                console.warn('Error destroying fullPage.js:', error);
            }
            fullpageApi = null;
        }

        if (lenis) {
            try {
                if (typeof lenis.destroy === 'function') {
                    lenis.destroy();
                }
            } catch (error) {
                console.warn('Error destroying Lenis:', error);
            }
            lenis = null;
        }

        try {
            fullpageApi = new fullpage('#fullpage', {
                licenseKey: '',
                autoScrolling: true,
                scrollHorizontally: false,
                navigation: false,
                anchors: ['hero','philosophy','about', 'service', 'activity', 'blog', 'news', 'contact', 'footer'],
                menu: '#menu',
                scrollOverflow: true,
                normalScrollElements: '.hamburger-menu, .news-list, .swiper',
                fixedElements: '.desktop-header, .mobile-header, .hamburger-menu, .mobile-nav',
                responsiveWidth: 993,
                afterLoad: (origin, destination, direction) => {
                    updateSectionStyles(destination.index);
                    toggleHeaderVisibility(destination.index);
                },
                onLeave: (origin, destination, direction) => {
                    toggleHeaderVisibility(destination.index);
                    return true;
                },
            });

            // セクションのオーバーフローを設定
            document.querySelectorAll('.fp-section').forEach(section => {
                section.style.overflowY = 'auto';
            });
        } catch (error) {
            console.error('Error initializing fullPage.js:', error);
        }
    }

    // Lenisの初期化関数
    function initLenis() {
        if (typeof Lenis === 'undefined' || (!isMobile && !isTablet)) {
            return;
        }

        // 既存のインスタンスをクリーンアップ
        if (fullpageApi) {
            try {
                fullpageApi.destroy('all');
            } catch (error) {
                console.warn('Error destroying fullPage.js:', error);
            }
            fullpageApi = null;
        }

        if (lenis) {
            try {
                if (typeof lenis.destroy === 'function') {
                    lenis.destroy();
                }
            } catch (error) {
                console.warn('Error destroying Lenis:', error);
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
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const sections = document.querySelectorAll('.section');
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
            document.querySelectorAll('.section').forEach(section => {
                section.style.overflowY = 'auto';
            });
        } catch (error) {
            console.error('Error initializing Lenis:', error);
        }
    }

    // セクションスタイルの更新
    function updateSectionStyles(index) {
        const sections = document.querySelectorAll('.section');
        if (index >= 0 && index < sections.length) {
            const currentSection = sections[index];
            const header = document.querySelector('.desktop-header');
            if (header) {
                if (currentSection.classList.contains('service-section') || 
                    currentSection.classList.contains('activity-section')) {
                    header.style.color = '#000';
                } else {
                    header.style.color = '#fff';
                }
            }
        }
    }

    // カスタムカーソルの初期化
    function initCustomCursor() {
        if (isMobile || isTablet) return;
        
        const cursor = document.getElementById('cursor');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        // マウス座標の更新
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // カーソルの滑らかな動き
        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // インタラクティブ要素のホバー効果
        const interactiveElements = document.querySelectorAll(
            'a, button, .cta-button, .blog-card, .news-item, .swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet, .c-carousel__btn-next, .c-carousel__btn-prev, .c-carousel__pagination-item'
        );

        interactiveElements.forEach((element) => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--hover');
            });
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--hover');
            });
        });

        // セクションごとのカーソルスタイル
        const sections = document.querySelectorAll('.section');
        sections.forEach((section) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            cursor.classList.remove('cursor-light', 'cursor-dark');
                            if (section.classList.contains('service-section') || 
                                section.classList.contains('activity-section')) {
                                cursor.classList.add('cursor-dark');
                            } else {
                                cursor.classList.add('cursor-light');
                            }
                        }
                    });
                },
                { threshold: 0.5 }
            );
            observer.observe(section);
        });

        cursor.style.opacity = '1';
    }

    // モバイルナビゲーションの設定
    function setupMobileNav() {
        if (!mobileNavItems.length) return;
        
        mobileNavItems.forEach((item) => {
            item.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (fullpageApi && href) {
                    e.preventDefault();
                    const sectionIndex = Array.from(mobileNavItems).findIndex(navItem => navItem === this);
                    fullpageApi.moveTo(href.replace('#', ''));
                    updateMobileNavActive(sectionIndex);
                }
                // Lenisの場合は通常のアンカーリンクとして動作
            });
        });
    }

    // タイトルアニメーションの初期化
    function initTitleAnimations() {
        const targets = document.querySelectorAll(
            '.section-title, .about-title, .service-title, .news-title, .contact-title'
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
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        targets.forEach((target) => observer.observe(target));
    }

    // サービスタイトル画像の表示アニメーション
    function initServiceTitleImageAnimation() {
        const serviceTitleImg = document.querySelector('.service-title img');
        if (serviceTitleImg) {
            serviceTitleImg.classList.add('show');
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
        if (fullpageApi && fullpageApi.getActiveSection) {
            const activeSection = fullpageApi.getActiveSection();
            return activeSection ? activeSection.index : 0;
        }
        
        // Lenisの場合やフォールバック
        const sections = document.querySelectorAll('.section');
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
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const oldIsMobile = isMobile;
            const oldIsTablet = isTablet;
            const oldIsDesktop = isDesktop;

            updateResponsiveVariables();

            if (oldIsMobile !== isMobile || oldIsTablet !== isTablet || oldIsDesktop !== isDesktop) {
                if (isDesktop) {
                    initFullPage();
                } else {
                    initLenis();
                }

                // ヘッダー表示を更新
                const currentSectionIndex = getCurrentSectionIndex();
                toggleHeaderVisibility(currentSectionIndex);

                // モバイルナビゲーションの表示/非表示
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav) {
                    mobileNav.style.display = isDesktop ? 'none' : 'flex';
                }
            }

            // ハンバーガーメニューを閉じる（デスクトップ表示時）
            if (window.innerWidth > 1024 && hamburgerMenu) {
                if (hamburgerMenu.style.display === 'flex') {
                    hamburgerMenu.style.display = 'none';
                    if (menuBtn) menuBtn.classList.remove('active');
                    togglePageScroll(true);
                }
            }
        }, 250);
    });

    // エラーハンドリング
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.message, 'at', e.filename, ':', e.lineno);
        // エラー発生時にスクロールを復旧
        try {
            togglePageScroll(true);
        } catch (recoveryError) {
            console.error('Error during scroll recovery:', recoveryError);
        }
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });

    // 初期化処理
    function init() {
        try {
            setupHamburgerMenu();
            setupMobileNav();
            initSwiper();
            initTitleAnimations();

            if (isDesktop) {
                initFullPage();
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav) mobileNav.style.display = 'none';
            } else {
                initLenis();
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav) mobileNav.style.display = 'flex';
            }

            initCustomCursor();
            toggleHeaderVisibility(0);

            // bodyとhtmlのoverflow初期設定
            document.body.style.overflow = isDesktop ? 'hidden' : 'auto';
            document.documentElement.style.overflow = isDesktop ? 'hidden' : 'auto';

            initServiceTitleImageAnimation();
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // アプリケーションの初期化実行
    init();
});
