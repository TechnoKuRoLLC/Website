document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded")
  
    // jQueryの読み込みを確認
    if (typeof jQuery === "undefined") {
      console.error("jQuery is not loaded. Please ensure jQuery is included in your HTML.")
      return // jQueryが読み込まれていない場合は処理を中断
    }
  
    // jQueryを$で使用できるようにする
    const $ = jQuery
  
    // ヘッダー要素の取得
    const desktopHeader = document.querySelector(".desktop-header")
    const mobileHeader = document.querySelector(".mobile-header")
    const hamburgerMenu = document.getElementById("hamburgerMenu")
  
    // ハンバーガーメニューのボタン要素の取得
    const menuBtn = document.getElementById("openMenu")
    const closeBtn = document.getElementById("closeMenu")

    
  
    // モバイルナビゲーション
    const mobileNavItems = document.querySelectorAll(".mobile-nav-item")
  
    console.log("Desktop header:", desktopHeader)
    console.log("Mobile header:", mobileHeader)
    console.log("Hamburger menu:", hamburgerMenu)
    console.log("Menu button:", menuBtn)
    console.log("Close button:", closeBtn)
  
    // レスポンシブ対応のための変数
    let isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 993
    const isDesktop = window.innerWidth >= 993
  
    // fullPage.jsの変数
    let fullpage_api
    let lenis
  
    // Swiperの初期化
    function initSwiper() {
      // ブログセクションのSwiper
      if (document.querySelector(".blog-swiper")) {
        const blogSwiper = new Swiper(".blog-swiper", {
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
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          },
        })
      }
    }
  
    // ヘッダーの表示/非表示を切り替える関数
    function toggleHeaderVisibility(sectionIndex) {
      console.log("Toggling header visibility for section:", sectionIndex)
  
      // 両方のヘッダーを一旦非表示にする
      if (desktopHeader) desktopHeader.style.display = "none"
      if (mobileHeader) mobileHeader.style.display = "none"
  
      if (sectionIndex === 0) {
        // ヒーローセクションではデスクトップヘッダーのみを表示
        if (desktopHeader && isDesktop) {
          desktopHeader.style.display = "block"
          console.log("Desktop header displayed for hero section")
        } else if (mobileHeader) {
          mobileHeader.style.display = "flex"
          console.log("Mobile header displayed for hero section")
        }
      } else {
        // About以降のセクションではモバイルヘッダーのみを表示
        if (mobileHeader) {
          mobileHeader.style.display = "flex"
          console.log("Mobile header displayed for section:", sectionIndex)
        }
      }
  
      // モバイルナビゲーションのアクティブ状態を更新
      updateMobileNavActive(sectionIndex)
    }
  
    // モバイルナビゲーションのアクティブ状態を更新
    function updateMobileNavActive(sectionIndex) {
      if (!mobileNavItems.length) return
  
      mobileNavItems.forEach((item, index) => {
        if (index === sectionIndex) {
          item.classList.add("active")
        } else {
          item.classList.remove("active")
        }
      })
    }
  
    // ハンバーガーメニューの制御
    function setupHamburgerMenu() {
      if (!menuBtn || !closeBtn || !hamburgerMenu) {
        console.error("Hamburger menu elements not found")
        return
      }
  
      console.log("Setting up hamburger menu event listeners")
  
      // ハンバーガーメニューの開閉処理
      function setupHamburgerMenu() {
        const menuBtn = document.getElementById("openMenu");
        const closeBtn = document.getElementById("closeMenu");
        const hamburgerMenu = document.getElementById("hamburgerMenu");

        if (!menuBtn || !closeBtn || !hamburgerMenu) return;

      // メニューを開く
      menuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hamburgerMenu.style.display = "flex";
        document.body.style.overflow = "hidden";
        menuBtn.classList.add("active"); // × に変形
        toggleScrolling(false); // スクロールを止める
      });

        // メニューを閉じる
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hamburgerMenu.style.display = "none";
        document.body.style.overflow = "auto";
        menuBtn.classList.remove("active"); // ハンバーガーに戻す
        toggleScrolling(true); // スクロール再開
      });

      // ナビゲーションが重ならないように調整（レスポンシブ対応）
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      hamburgerMenu.style.display = "none";
      document.body.style.overflow = "auto";
      menuBtn.classList.remove("active");
      toggleScrolling(true);
    }
  });
    }

    // スクロールのON/OFF制御
    function toggleScrolling(allow) {
      if (window.fullpage_api && typeof fullpage_api.setAllowScrolling === "function") {
        fullpage_api.setAllowScrolling(allow);
      }
     }

     // DOM読み込み後に実行
        window.addEventListener("DOMContentLoaded", setupHamburgerMenu);
  



        // fullPage.jsのスクロールを無効化
        if (fullpage_api) {
          fullpage_api.setAllowScrolling(false)
        }
  
        // Lenisが有効な場合は一時停止
        if (lenis && typeof lenis.stop === "function") {
          lenis.stop()
        }
  
      // メニューを閉じる
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("Close button clicked")
        hamburgerMenu.style.display = "none"
        document.body.style.overflow = ""
        menuBtn.classList.remove("active")
  
        // fullPage.jsのスクロールを有効化
        if (fullpage_api) {
          fullpage_api.setAllowScrolling(true)
        }
  
        // Lenisが有効な場合は再開
        if (lenis && typeof lenis.start === "function") {
          lenis.start()
        }
      })
  
      // ハンバーガーメニュー内のリンクをクリックした時にメニューを閉じる
      const menuLinks = hamburgerMenu.querySelectorAll("a")
      menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
          console.log("Menu link clicked")
          hamburgerMenu.style.display = "none"
          document.body.style.overflow = ""
  
          // fullPage.jsのスクロールを有効化
          if (fullpage_api) {
            fullpage_api.setAllowScrolling(true)
          }
  
          // Lenisが有効な場合は再開
          if (lenis && typeof lenis.start === "function") {
            lenis.start()
          }
        })
      })
    }
  
    // fullPage.jsの初期化関数
    function initFullPage() {
      if (document.getElementById("fullpage") && isDesktop) {
        console.log("Initializing fullPage.js")
  
        // fullPage.jsが既に初期化されているか確認
        if (fullpage_api) {
          fullpage_api.destroy("all")
        }
  
        // Lenisが有効な場合は無効化
        if (lenis && typeof lenis.destroy === "function") {
          lenis.destroy()
          lenis = null
        }
  
        // fullPage.jsの初期化
        fullpage_api = new fullpage("#fullpage", {
          licenseKey: "", // MITライセンス版では空文字列
          autoScrolling: true,
          scrollHorizontally: false,
          navigation: false,
          navigationPosition: "right",
          showActiveTooltip: false,
          slidesNavigation: true,
          controlArrows: true,
          anchors: ["about", "service", "activity", "blog", "news", "contact", "footer"],
          menu: "#menu",
          scrollOverflow: true,
          scrollOverflowReset: false,
          scrollOverflowOptions: {
            scrollbars: true, // スクロールバーを表示
            fadeScrollbars: true,
            disableMouse: false,
            click: true,
          },
          normalScrollElements: ".hamburger-menu, .news-list, .swiper",
          css3: true,
          verticalCentered: true,
          sectionsColor: [],
          paddingTop: "0px",
          paddingBottom: "0px",
          fixedElements: ".desktop-header, .mobile-header, .hamburger-menu, .mobile-nav",
          responsiveWidth: 993,
          responsiveHeight: 600,
          animateAnchor: true,
          recordHistory: true,
  
          // イベントコールバック
          afterLoad: (origin, destination, direction) => {
            console.log("Section loaded:", destination.index + 1)
            updateSectionStyles(destination.index)
            toggleHeaderVisibility(destination.index)
          },
  
          onLeave: (origin, destination, direction) => {
            console.log("Leaving section:", origin.index + 1, "to", destination.index + 1)
            toggleHeaderVisibility(destination.index)
            return true // 移動を許可
          },
        })
  
        // スクロールが機能しているか確認するためのログ
        console.log("fullPage.js initialized successfully")
  
        // 全てのセクションでスクロールを有効にする
        document.querySelectorAll(".fp-section").forEach((section) => {
          section.style.overflowY = "auto"
        })
      }
    }
  
    // Lenisの初期化関数
    function initLenis() {
      if (typeof Lenis !== "undefined" && (isMobile || isTablet)) {
        console.log("Initializing Lenis")
  
        // fullPage.jsが有効な場合は無効化
        if (fullpage_api) {
          fullpage_api.destroy("all")
          fullpage_api = null
        }
  
        // 既存のLenisインスタンスがあれば破棄
        if (lenis && typeof lenis.destroy === "function") {
          lenis.destroy()
          lenis = null
        }
  
        // 新しいLenisインスタンスを作成
        lenis = new Lenis({
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          gestureDirection: "vertical",
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        })
  
        // Lenisのスクロールイベントを処理するRAF
        function updateRaf(time) {
          if (lenis) {
            lenis.raf(time)
            requestAnimationFrame(updateRaf)
          }
        }
  
        requestAnimationFrame(updateRaf)
  
        // スクロールイベントでモバイルナビゲーションのアクティブ状態を更新
        window.addEventListener("scroll", () => {
          const sections = document.querySelectorAll(".section")
          const scrollPosition = window.scrollY
  
          sections.forEach((section, index) => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.offsetHeight
  
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
              updateMobileNavActive(index)
            }
          })
        })
  
        // スクロールが機能しているか確認するためのログ
        console.log("Lenis initialized successfully")
  
        // 全てのセクションでスクロールを有効にする
        document.querySelectorAll(".section").forEach((section) => {
          section.style.overflowY = "auto"
        })
      }
    }
  
    // セクションスタイルの更新
    function updateSectionStyles(index) {
      // 現在のセクションに基づいてスタイルを更新
      const sections = document.querySelectorAll(".section")
      if (index >= 0 && index < sections.length) {
        const currentSection = sections[index]
  
        // ヘッダーの色を更新
        const header = document.querySelector(".desktop-header")
        if (header) {
          if (
            currentSection.classList.contains("service-section") ||
            currentSection.classList.contains("activity-section")
          ) {
            // 白背景セクションの場合、ヘッダーテキストを黒に
            header.style.color = "#000"
          } else {
            // 黒背景セクションの場合、ヘッダーテキストを白に
            header.style.color = "#fff"
          }
        }
      }
    }
  
    // カスタムカーソルの初期化
    function initCustomCursor() {
      if (isMobile || isTablet) return
  
      const cursor = document.getElementById("cursor")
      if (!cursor) return
  
      console.log("Initializing custom cursor")
  
      // マウスの動きに合わせてカーソルを移動
      document.addEventListener("mousemove", (e) => {
        requestAnimationFrame(() => {
          cursor.style.left = e.clientX + "px"
          cursor.style.top = e.clientY + "px"
        })
      })
  
      // リンクやボタンにホバーした時の処理
      const interactiveElements = document.querySelectorAll(
        "a, button, .cta-button, .blog-card, .news-item, .swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet, .c-carousel__btn-next, .c-carousel__btn-prev, .c-carousel__pagination-item",
      )
  
      interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
          cursor.classList.add("cursor--hover")
        })
  
        element.addEventListener("mouseleave", () => {
          cursor.classList.remove("cursor--hover")
        })
      })
  
      // セクションによってカーソルの色を変更
      const sections = document.querySelectorAll(".section")
      sections.forEach((section) => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // 全てのカーソルクラスをリセット
                cursor.classList.remove("cursor-light", "cursor-dark")
  
                // セクションに応じてクラスを追加
                if (section.classList.contains("service-section") || section.classList.contains("activity-section")) {
                  cursor.classList.add("cursor-dark")
                } else {
                  cursor.classList.add("cursor-light")
                }
              }
            })
          },
          { threshold: 0.5 },
        )
  
        observer.observe(section)
      })
  
      // カーソルを初期表示
      cursor.style.opacity = "1"
    }
  
    // モバイルナビゲーションの設定
    function setupMobileNav() {
      if (!mobileNavItems.length) return
  
      mobileNavItems.forEach((item) => {
        item.addEventListener("click", function (e) {
          const href = this.getAttribute("href")
  
          // fullPage.jsが有効な場合はmoveTo関数を使用
          if (fullpage_api && href) {
            e.preventDefault()
            const sectionIndex = Array.from(mobileNavItems).findIndex((navItem) => navItem === this)
            fullpage_api.moveTo(href.replace("#", ""))
            updateMobileNavActive(sectionIndex)
          }
        })
      })
    }
  
    // ウィンドウのリサイズ時の処理
    window.addEventListener("resize", () => {
      const newIsMobile = window.innerWidth < 768
      const newIsTablet = window.innerWidth >= 768 && window.innerWidth < 993
      const newIsDesktop = window.innerWidth >= 993
  
      // 画面サイズが変わった場合のみ再初期化
      if (newIsMobile !== isMobile || newIsTablet !== isTablet || newIsDesktop !== isDesktop) {
        console.log("Window resized, reinitializing")
        isMobile = newIsMobile
  
        if (newIsDesktop) {
          initFullPage()
        } else {
          initLenis()
        }
  
        // 現在のセクションに基づいてヘッダーを更新
        const currentSectionIndex = fullpage_api
          ? fullpage_api.getActiveSection().index
          : document.querySelector(".section.active")
            ? Array.from(document.querySelectorAll(".section")).indexOf(document.querySelector(".section.active"))
            : 0
  
        toggleHeaderVisibility(currentSectionIndex)
      }
    })
  
    // エラーハンドリングを追加
    window.addEventListener("error", (e) => {
      console.error("JavaScript error:", e.message)
      // エラーが発生した場合にスクロールを復旧
      if (lenis && typeof lenis.start === "function") {
        lenis.start()
      }
      if (fullpage_api) {
        fullpage_api.setAllowScrolling(true)
      }
    })
  
    // 初期化処理
    function init() {
      console.log("Initializing app")
  
      // ハンバーガーメニューのセットアップ
      setupHamburgerMenu()
  
      // モバイルナビゲーションのセットアップ
      setupMobileNav()
  
      // Swiperの初期化
      initSwiper()
  
      // スクロールシステムの初期化
      if (isDesktop) {
        // デスクトップではfullPage.jsを使用
        initFullPage()
        // モバイルナビゲーションを非表示
        const mobileNav = document.querySelector(".mobile-nav")
        if (mobileNav) mobileNav.style.display = "none"
      } else {
        // モバイル/タブレットではLenisを使用
        initLenis()
        // モバイルナビゲーションを表示
        const mobileNav = document.querySelector(".mobile-nav")
        if (mobileNav) mobileNav.style.display = "flex"
      }
  
      // カスタムカーソルの初期化
      initCustomCursor()
  
      // 初期状態でのヘッダー表示/非表示の設定
      toggleHeaderVisibility(0)
  
      // スクロールを有効にするための追加処理
      document.body.style.overflow = isDesktop ? "hidden" : "auto"
      document.documentElement.style.overflow = isDesktop ? "hidden" : "auto"
    }
  
    // アプリケーションの初期化
    init()
  })
  
      // セクションインデックス取得時の null チェック付き安全取得
    function getCurrentSectionIndex() {
      const activeSection = window.fullpage_api?.getActiveSection();
      return activeSection ? activeSection.index : null;
    }

    // 初期化イベント
    window.addEventListener("DOMContentLoaded", () => {
      setupHamburgerMenu();
      moveSidebarOutsideOverflow();
    });
  