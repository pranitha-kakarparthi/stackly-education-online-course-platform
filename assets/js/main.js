/**
 * Stackly Education & Online Course Platform
 * Main Application Logic (assets/js/main.js)
 *
 * Production-ready vanilla JavaScript module providing:
 * 1. Pure CSS Loader Dismissal & interactive guarantee
 * 2. Sticky Navbar, Mobile Navigation & Scroll-lock
 * 3. Time-of-Day Greeting Logic
 * 4. Mock Authentication, LocalStorage Seed & Route Guard
 * 5. Form Validation (Contact, Register, Login) & UX (Strength Meter, Eye Toggle, Live Counter)
 * 6. Dynamic Role-based Dashboard adaptation (Student, Instructor, Mentor, Admin) & Sidebar Toggle
 * 7. Global Link Interception (404 redirects, Logo to home)
 * 8. Toast Notification System
 */

(function (window, document) {
  "use strict";

  // Location-aware Path Resolution Helper
  const isInPages =
    window.location.pathname.includes("/pages/") ||
    window.location.pathname.includes("\\pages\\");
  const getPageUrl = (page) => (isInPages ? page : "pages/" + page);
  const getHomeUrl = () => (isInPages ? "../index.html" : "index.html");
  const getAssetUrl = (path) => {
    if (!path) return "";
    if (isInPages && !path.startsWith("../") && !path.startsWith("http") && !path.startsWith("/")) {
      return "../" + path;
    }
    return path;
  };

  // =========================================================================
  // CONSTANTS & CONFIGURATION
  // =========================================================================
  const CONFIG = {
    STORAGE_KEYS: {
      USERS: "stackly_users",
      CURRENT_USER: "stackly_currentUser",
      ROLE: "stackly_role",
      PREFERENCES: "stackly_preferences",
      THEME_SETTINGS: "stackly_themeSettings",
      NOTIFICATIONS: "stackly_notifications",
      SAVED_FORMS: "stackly_savedForms",
    },
    LOADER_FALLBACK_MS: 1500,
    SCROLL_THRESHOLD: 20,
    TOAST_DURATION: 3500,
  };

  // Seed data for demo purposes
  const DEFAULT_USERS = [
    {
      id: "usr_001",
      name: "Amara Okafor",
      email: "student@stackly.edu",
      password: "Password@123",
      phone: "9876543210",
      role: "student",
      avatar: "assets/images/student-amara-okafor.webp",
      headline: "Full-Stack Software Engineering Fellow",
      stats: {
        enrolledCourses: 4,
        completedCourses: 2,
        hoursLearned: 38,
        certificates: 2,
      },
      courses: [
        {
          id: "c1",
          title: "Full-Stack Web Development Bootcamp",
          progress: 75,
          instructor: "Sarah Jenkins",
          image: "assets/images/course-fullstack-dev.webp",
        },
        {
          id: "c2",
          title: "UI/UX Design Masterclass & Prototyping",
          progress: 40,
          instructor: "Alex Chen",
          image: "assets/images/course-ui-ux-design.webp",
        },
        {
          id: "c3",
          title: "Cloud Computing & DevOps Essentials",
          progress: 90,
          instructor: "Marcus Vance",
          image: "assets/images/course-cloud-devops.webp",
        },
        {
          id: "c4",
          title: "Applied Artificial Intelligence & Data Science",
          progress: 15,
          instructor: "Priya Sharma",
          image: "assets/images/course-ai-data-science.webp",
        },
      ],
      activities: [
        {
          title: "Completed Quiz: Docker Containerization",
          time: "2 hours ago",
          type: "success",
        },
        {
          title: "Submitted Assignment: Responsive Dashboard",
          time: "Yesterday",
          type: "info",
        },
        {
          title: "Booked 1-on-1 Mentorship Session with Alex Chen",
          time: "3 days ago",
          type: "primary",
        },
      ],
    },
    {
      id: "usr_002",
      name: "Sarah Jenkins",
      email: "instructor@stackly.edu",
      password: "Password@123",
      phone: "9876543211",
      role: "instructor",
      avatar: "assets/images/mentor-sarah-jenkins.webp",
      headline: "Principal Engineer & Lead Technical Instructor",
      stats: {
        activeStudents: 1420,
        totalCourses: 6,
        rating: 4.9,
        revenue: "$18,450",
      },
      courses: [
        {
          id: "c1",
          title: "Full-Stack Web Development Bootcamp",
          enrolled: 680,
          rating: 4.9,
          revenue: "$9,200",
          image: "assets/images/course-fullstack-dev.webp",
        },
        {
          id: "c5",
          title: "Modern JavaScript & TypeScript Architecture",
          enrolled: 450,
          rating: 4.8,
          revenue: "$6,150",
          image: "assets/images/course-brand-identity.webp",
        },
        {
          id: "c6",
          title: "REST & GraphQL API Engineering",
          enrolled: 290,
          rating: 4.9,
          revenue: "$3,100",
          image: "assets/images/course-digital-marketing.webp",
        },
      ],
      activities: [
        {
          title: "Published new module: State Machines with XState",
          time: "4 hours ago",
          type: "success",
        },
        {
          title: "Graded 18 student capstone submissions",
          time: "Yesterday",
          type: "info",
        },
        {
          title: "Live webinar: Preparing for Technical Interviews",
          time: "2 days ago",
          type: "primary",
        },
      ],
    },
    {
      id: "usr_003",
      name: "Alex Chen",
      email: "alex.instructor@stackly.edu",
      password: "Password@123",
      phone: "9876543212",
      role: "instructor",
      avatar: "assets/images/mentor-alex-chen.webp",
      headline: "Senior Cloud Architect & Faculty Instructor",
      stats: {
        sessionsCompleted: 142,
        upcomingSessions: 8,
        rating: 5.0,
        menteesCount: 56,
      },
      courses: [
        {
          id: "c2",
          title: "UI/UX Design Masterclass & Prototyping",
          mentees: 24,
          rating: 5.0,
          image: "assets/images/course-ui-ux-design.webp",
        },
        {
          id: "c7",
          title: "Design Systems & Token Architecture",
          mentees: 18,
          rating: 4.9,
          image: "assets/images/course-brand-identity.webp",
        },
      ],
      activities: [
        {
          title: "Conducted 60-min portfolio review with David Kim",
          time: "1 hour ago",
          type: "success",
        },
        {
          title: "Accepted mentorship request from Elena Rostova",
          time: "5 hours ago",
          type: "info",
        },
        {
          title: "Updated office hours availability for next week",
          time: "1 day ago",
          type: "primary",
        },
      ],
    },
    {
      id: "usr_004",
      name: "Marcus Vance",
      email: "admin@stackly.edu",
      password: "Password@123",
      phone: "9876543213",
      role: "admin",
      avatar: "assets/images/mentor-marcus-vance.webp",
      headline: "System Administrator & Academic Director",
      stats: {
        totalUsers: 8420,
        platformRevenue: "$148,200",
        activeCourses: 28,
        pendingApprovals: 9,
      },
      courses: [
        {
          id: "c1",
          title: "Full-Stack Web Development Bootcamp",
          status: "Active",
          instructor: "Sarah Jenkins",
          image: "assets/images/course-fullstack-dev.webp",
        },
        {
          id: "c3",
          title: "Cloud Computing & DevOps Essentials",
          status: "Active",
          instructor: "Marcus Vance",
          image: "assets/images/course-cloud-devops.webp",
        },
        {
          id: "c4",
          title: "Applied Artificial Intelligence & Data Science",
          status: "Under Review",
          instructor: "Priya Sharma",
          image: "assets/images/course-ai-data-science.webp",
        },
      ],
      activities: [
        {
          title: "Approved course syllabus: Applied AI & Data Science",
          time: "30 mins ago",
          type: "success",
        },
        {
          title: "Automated platform database backup successfully completed",
          time: "3 hours ago",
          type: "info",
        },
        {
          title: "Processed 14 instructor payouts",
          time: "Yesterday",
          type: "primary",
        },
      ],
    },
  ];

  // =========================================================================
  // UTILITY HELPERS
  // =========================================================================
  const Utils = {
    // Normalize relative asset paths across root vs /pages/ subdirectories
    normalizeUserAssets(user) {
      if (!user) return user;
      const copy = Object.assign({}, user);
      if (copy.avatar) copy.avatar = getAssetUrl(copy.avatar);
      if (Array.isArray(copy.courses)) {
        copy.courses = copy.courses.map((c) => {
          const cCopy = Object.assign({}, c);
          if (cCopy.image) cCopy.image = getAssetUrl(cCopy.image);
          return cCopy;
        });
      }
      return copy;
    },

    // Escape HTML to prevent injection
    escapeHtml(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    // Check if current page matches target
    isCurrentPage(filename) {
      const path = window.location.pathname.toLowerCase();
      const target = filename.toLowerCase();
      if (path.endsWith("/" + target) || path.endsWith(target)) return true;
      if (
        target === "index.html" &&
        (path === "" || path === "/" || path.endsWith("/index.html"))
      )
        return true;
      return false;
    },

    // Time of day greeting
    getGreeting() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return "Good morning";
      } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
      } else {
        return "Good evening";
      }
    },

    // Smooth debounce
    debounce(fn, delay = 150) {
      let timer = null;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },
  };

  // =========================================================================
  // TOAST NOTIFICATION SYSTEM
  // =========================================================================
  const Toast = {
    container: null,

    init() {
      if (!this.container) {
        let existing = document.getElementById("stackly-toast-container");
        if (!existing) {
          existing = document.createElement("div");
          existing.id = "stackly-toast-container";
          existing.setAttribute("aria-live", "polite");
          existing.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 380px;
            width: calc(100vw - 32px);
            pointer-events: none;
          `;
          document.body.appendChild(existing);
        }
        this.container = existing;
      }
    },

    show(message, type = "info", duration = CONFIG.TOAST_DURATION) {
      this.init();

      const toast = document.createElement("div");
      toast.className = `stackly-toast stackly-toast-${type}`;
      toast.style.cssText = `
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 12px;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.5;
        color: #0f172a;
        background: #ffffff;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
        border-left: 4px solid #2563eb;
        opacity: 0;
        transform: translateY(-10px) scale(0.96);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
      `;

      let iconColor = "#2563eb";
      let iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

      if (type === "success") {
        iconColor = "#10b981";
        toast.style.borderLeftColor = "#10b981";
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      } else if (type === "error") {
        iconColor = "#ef4444";
        toast.style.borderLeftColor = "#ef4444";
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      } else if (type === "warning") {
        iconColor = "#f59e0b";
        toast.style.borderLeftColor = "#f59e0b";
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
      }

      toast.innerHTML = `
        <span style="color: ${iconColor}; flex-shrink: 0; margin-top: 2px;">${iconSvg}</span>
        <div style="flex: 1; word-break: break-word;">${Utils.escapeHtml(message)}</div>
        <button type="button" aria-label="Close" style="background: none; border: none; padding: 0; margin-left: 8px; cursor: pointer; color: #94a3b8; font-size: 16px; line-height: 1;">&times;</button>
      `;

      // Auto close and manual close
      const dismiss = () => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px) scale(0.96)";
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      };

      toast.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        dismiss();
      });

      toast.addEventListener("click", dismiss);

      this.container.appendChild(toast);

      // Force reflow and animate in
      requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0) scale(1)";
      });

      if (duration > 0) {
        setTimeout(dismiss, duration);
      }
    },
  };

  // =========================================================================
  // STORAGE & AUTHENTICATION MODULE
  // =========================================================================
  const Auth = {
    init() {
      // Seed default users if storage is empty
      const existing = localStorage.getItem(CONFIG.STORAGE_KEYS.USERS);
      if (!existing) {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.USERS,
          JSON.stringify(DEFAULT_USERS)
        );
      }

      // Check default role
      if (!localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE, "student");
      }

      // Initialize mandatory global storage modules
      if (!localStorage.getItem(CONFIG.STORAGE_KEYS.PREFERENCES)) {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.PREFERENCES,
          JSON.stringify({
            emailAlerts: true,
            weeklyDigest: true,
            language: "en",
          })
        );
      }
      if (!localStorage.getItem(CONFIG.STORAGE_KEYS.THEME_SETTINGS)) {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.THEME_SETTINGS,
          JSON.stringify({
            theme: "light",
            fontSize: "default",
            highContrast: false,
          })
        );
      }
      if (!localStorage.getItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.NOTIFICATIONS,
          JSON.stringify([
            {
              id: 1,
              title: "Welcome to Stackly Learn!",
              message: "Your learning workspace is active and accredited.",
              timestamp: new Date().toISOString(),
              read: false,
            },
          ])
        );
      }
      if (!localStorage.getItem(CONFIG.STORAGE_KEYS.SAVED_FORMS)) {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.SAVED_FORMS,
          JSON.stringify({})
        );
      }
    },

    getAllUsers() {
      try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEYS.USERS);
        const users = data ? JSON.parse(data) : DEFAULT_USERS;
        return Array.isArray(users) ? users.map((u) => Utils.normalizeUserAssets(u)) : users;
      } catch (e) {
        console.error("Stackly Auth: Failed to parse users storage", e);
        return DEFAULT_USERS.map((u) => Utils.normalizeUserAssets(u));
      }
    },

    getCurrentUser() {
      try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
        if (!data) return null;
        return Utils.normalizeUserAssets(JSON.parse(data));
      } catch (e) {
        console.error("Stackly Auth: Failed to parse current user", e);
        return null;
      }
    },

    setCurrentUser(user) {
      if (!user) {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
      } else {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(user)
        );
        localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE, user.role || "student");
      }
    },

    getCurrentRole() {
      return localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE) || "student";
    },

    setRole(role) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE, role);
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        currentUser.role = role;
        this.setCurrentUser(currentUser);
      }
    },

    login(email, password) {
      const users = this.getAllUsers();
      const normalizedEmail = (email || "").trim().toLowerCase();
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      if (user) {
        this.setCurrentUser(user);
        return { success: true, user };
      }

      // Check if user exists with wrong password
      const userExists = users.some(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (userExists) {
        return {
          success: false,
          message: "Invalid password. Please check and try again.",
        };
      }

      return {
        success: false,
        message: "No account registered with this email address.",
      };
    },

    register(newUser) {
      const users = this.getAllUsers();
      const normalizedEmail = (newUser.email || "").trim().toLowerCase();

      // Check duplicate
      if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }

      const userObject = {
        id: "usr_" + Date.now(),
        name: newUser.name.trim(),
        email: normalizedEmail,
        password: newUser.password,
        phone: newUser.phone.trim(),
        role: newUser.role || "student",
        avatar: "assets/images/student-lucas-silva.webp",
        headline: newUser.headline || "Lifelong Learner & Platform Member",
        stats: {
          enrolledCourses: 0,
          completedCourses: 0,
          hoursLearned: 0,
          certificates: 0,
        },
        courses: [],
        activities: [
          {
            title: "Account registered successfully",
            time: "Just now",
            type: "success",
          },
        ],
      };

      users.push(userObject);
      localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
      return { success: true, user: userObject };
    },

    logout() {
      try {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.ROLE);
        localStorage.removeItem("stackly_isLoggedIn");
        localStorage.removeItem("stackly_currentUser");
        localStorage.removeItem("stackly_role");
        localStorage.removeItem("stackly_user");
        localStorage.removeItem("stackly_user_role");
        localStorage.removeItem("stackly_authToken");
        localStorage.removeItem("stackly_session");
        sessionStorage.clear();
      } catch (e) {
        console.warn("Storage logout error:", e);
      }
      Toast.show("You have been signed out safely.", "info");
      setTimeout(() => {
        window.location.replace(getPageUrl("sign-in.html"));
      }, 250);
    },
  };

  // =========================================================================
  // UI LOADER CONTROLLER
  // =========================================================================
  const Loader = {
    dismissed: false,

    init() {
      const dismissLoader = () => {
        if (this.dismissed) return;
        this.dismissed = true;

        const loaders = document.querySelectorAll(
          '#app-loader, #page-loader, #pure-css-loader, .page-loader, #preloader, .preloader, .loader-wrapper, [role="status"][id*="loader"]'
        );
        loaders.forEach((loader) => {
          loader.classList.add("loaded", "is-hidden");
          loader.style.transition = "opacity 0.35s ease, visibility 0.35s ease";
          loader.style.opacity = "0";
          loader.style.visibility = "hidden";
          loader.style.pointerEvents = "none";
          setTimeout(() => {
            if (loader.parentNode) {
              loader.style.display = "none";
            }
          }, 400);
        });

        document.body.classList.add("page-loaded");
      };

      // Immediate on DOMContentLoaded or load
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        dismissLoader();
      } else {
        document.addEventListener("DOMContentLoaded", dismissLoader);
        window.addEventListener("load", dismissLoader);
      }

      // Fallback timeout to guarantee interactive content
      setTimeout(dismissLoader, 800);
    },
  };

  // =========================================================================
  // NAVBAR & MOBILE NAVIGATION CONTROLLER
  // =========================================================================
  const Navigation = {
    init() {
      this.handleStickyNavbar();
      this.handleMobileMenu();
      this.highlightActiveLinks();
      this.updateGreetings();
      this.updateAuthNavUI();
    },

    handleStickyNavbar() {
      const header = document.querySelector(
        "header, .navbar, .header, #header, #navbar"
      );
      if (!header) return;

      const onScroll = () => {
        if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
          header.classList.add("navbar-scrolled", "scrolled", "is-sticky");
        } else {
          header.classList.remove("navbar-scrolled", "scrolled", "is-sticky");
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    },

    handleMobileMenu() {
      if (this._mobileMenuInitialized) return;
      this._mobileMenuInitialized = true;

      const isDashboard = window.location.pathname.includes("dashboard");

      const toggleButtons = document.querySelectorAll(
        "#mobileMenuToggle, .hamburger-btn, .mobile-toggle, #mobile-toggle, #mobile-toggle-btn, #mobile-menu-toggle, [data-nav-toggle], .hamburger, #hamburger-btn, .mobile-menu-toggle"
      );
      const closeButtons = document.querySelectorAll(
        "#mobileNavClose, .mobile-nav-close, .mobile-close, #mobile-close, .mobile-close-btn, #mobileSidebarCloseBtn, #sidebarCollapseBtn"
      );
      const overlays = document.querySelectorAll(
        "#mobileNavOverlay, .mobile-nav-overlay, #mobile-nav, #mobile-menu, #mobile-nav-overlay, #mobileNavMenu, #sidebarBackdrop, .sidebar-backdrop"
      );
      const drawers = document.querySelectorAll(
        ".mobile-nav-drawer, #dashboardSidebar, .dashboard-sidebar, #mobileNavMenu, .mobile-menu"
      );

      const closeAll = () => {
        document.body.classList.remove(
          "mobile-nav-open",
          "mobile-menu-open",
          "sidebar-open"
        );
        document.documentElement.classList.remove(
          "mobile-nav-open",
          "mobile-menu-open",
          "sidebar-open"
        );
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        toggleButtons.forEach((btn) => {
          btn.classList.remove("active", "open");
          btn.setAttribute("aria-expanded", "false");
        });

        overlays.forEach((ov) => {
          ov.classList.remove("is-active", "open", "show", "active");
          ov.setAttribute("aria-hidden", "true");
        });

        drawers.forEach((dr) => {
          dr.classList.remove(
            "is-active",
            "open",
            "show",
            "sidebar-mobile-open"
          );
        });
      };

      const openDrawer = () => {
        document.body.classList.add("mobile-nav-open", "mobile-menu-open");
        document.documentElement.classList.add(
          "mobile-nav-open",
          "mobile-menu-open"
        );
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        toggleButtons.forEach((btn) => {
          btn.classList.add("active", "open");
          btn.setAttribute("aria-expanded", "true");
        });

        overlays.forEach((ov) => {
          ov.classList.add("is-active", "open", "show", "active");
          ov.setAttribute("aria-hidden", "false");
        });

        drawers.forEach((dr) => {
          dr.classList.add("is-active", "open", "show", "sidebar-mobile-open");
        });
      };

      const toggleDrawer = () => {
        const isOpen =
          document.body.classList.contains("mobile-nav-open") ||
          document.body.classList.contains("mobile-menu-open") ||
          (!isDashboard &&
            Array.from(overlays).some(
              (ov) =>
                ov.classList.contains("is-active") ||
                ov.classList.contains("open") ||
                ov.getAttribute("aria-hidden") === "false"
            )) ||
          (isDashboard &&
            (document.body.classList.contains("sidebar-open") ||
              Array.from(drawers).some((dr) =>
                dr.classList.contains("sidebar-mobile-open")
              )));

        if (isOpen) {
          closeAll();
        } else {
          openDrawer();
        }
      };

      toggleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleDrawer();
        });
      });

      closeButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeAll();
        });
      });

      overlays.forEach((ov) => {
        ov.addEventListener("click", (e) => {
          if (
            e.target === ov ||
            e.target.classList.contains("sidebar-backdrop") ||
            e.target.classList.contains("mobile-nav-overlay")
          ) {
            e.preventDefault();
            closeAll();
          }
        });
      });

      document
        .querySelectorAll(
          ".mobile-nav-link, .mobile-nav-links a, #mobileNavMenu a, .sidebar-link, .mobile-nav-drawer a"
        )
        .forEach((link) => {
          link.addEventListener("click", () => {
            closeAll();
          });
        });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAll();
      });
    },

    highlightActiveLinks() {
      const currentPath = window.location.pathname.toLowerCase();
      let currentFile =
        currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

      const navLinks = document.querySelectorAll(
        ".nav-link, .nav-menu a, .navbar-nav a, .sidebar-nav a, nav a"
      );
      navLinks.forEach((link) => {
        const href = (link.getAttribute("href") || "").toLowerCase();
        if (!href || href.startsWith("#") || href.startsWith("javascript:"))
          return;

        const hrefFile = href.substring(href.lastIndexOf("/") + 1);

        if (
          hrefFile === currentFile ||
          (currentFile === "" && hrefFile === "index.html")
        ) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        }
      });
    },

    updateGreetings() {
      const greeting = Utils.getGreeting();
      const greetingElements = document.querySelectorAll(
        "[data-greeting], .greeting-text, #greetingText, #userGreeting, .time-greeting"
      );
      const currentUser = Auth.getCurrentUser();
      const userName = currentUser ? currentUser.name.split(" ")[0] : "Learner";

      greetingElements.forEach((el) => {
        const showName = el.getAttribute("data-include-name") !== "false";
        el.textContent = showName ? `${greeting}, ${userName}!` : greeting;
      });
    },

    updateAuthNavUI() {
      const currentUser = Auth.getCurrentUser();
      const guestElements = document.querySelectorAll(
        '.auth-guest-only, [data-auth-state="guest"]'
      );
      const userElements = document.querySelectorAll(
        '.auth-user-only, [data-auth-state="authenticated"]'
      );
      const userAvatarElements = document.querySelectorAll(
        "[data-user-avatar], .user-nav-avatar"
      );
      const userNameElements = document.querySelectorAll(
        "[data-user-name], .user-nav-name"
      );

      if (currentUser) {
        guestElements.forEach((el) => (el.style.display = "none"));
        userElements.forEach((el) => (el.style.display = ""));

        userAvatarElements.forEach((el) => {
          if (el.tagName === "IMG") {
            el.src =
              getAssetUrl(currentUser.avatar || "assets/images/student-amara-okafor.webp");
            el.alt = currentUser.name;
          }
        });

        userNameElements.forEach((el) => {
          el.textContent = currentUser.name;
        });
      } else {
        guestElements.forEach((el) => (el.style.display = ""));
        userElements.forEach((el) => (el.style.display = "none"));
      }
    },
  };

  // =========================================================================
  // PASSWORD STRENGTH & VISIBILITY TOGGLE UX
  // =========================================================================
  const PasswordUX = {
    init() {
      this.initStrengthMeter();
      this.initVisibilityToggles();
    },

    calculateStrength(password) {
      if (!password || password.length === 0) {
        return { score: 0, label: "", color: "#e2e8f0", width: "0%" };
      }

      let score = 0;
      const length = password.length;

      if (length >= 8) score++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

      switch (score) {
        case 1:
          return { score: 1, label: "Weak", color: "#ef4444", width: "25%" };
        case 2:
          return { score: 2, label: "Fair", color: "#f59e0b", width: "50%" };
        case 3:
          return { score: 3, label: "Good", color: "#3b82f6", width: "75%" };
        case 4:
          return { score: 4, label: "Strong", color: "#10b981", width: "100%" };
        default:
          return {
            score: 0,
            label: "Too short",
            color: "#ef4444",
            width: "15%",
          };
      }
    },

    initStrengthMeter() {
      const passwordInputs = document.querySelectorAll(
        'input[data-strength-target], #registerPassword, #password, input[name="password"].with-strength'
      );

      passwordInputs.forEach((input) => {
        // Find or create strength indicator
        let bar = document.querySelector(
          "[data-strength-bar], .password-strength-bar, #strengthBar"
        );
        let text = document.querySelector(
          "[data-strength-text], .password-strength-text, #strengthText"
        );

        input.addEventListener("input", () => {
          const result = this.calculateStrength(input.value);

          if (bar) {
            bar.style.width = result.width;
            bar.style.backgroundColor = result.color;
            bar.style.transition =
              "width 0.3s ease, background-color 0.3s ease";
          }

          if (text) {
            text.textContent = result.label ? `Strength: ${result.label}` : "";
            text.style.color = result.color;
          }
        });
      });
    },

    initVisibilityToggles() {
      const toggleBtns = document.querySelectorAll(
        '[data-toggle="password"], .toggle-password, .password-toggle-btn'
      );

      toggleBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const targetSelector = btn.getAttribute("data-target");
          let input = targetSelector
            ? document.querySelector(targetSelector)
            : null;

          if (!input) {
            // Check previous sibling or parent container
            input = btn
              .closest(
                ".input-group, .form-group, .form-floating, .password-wrapper"
              )
              ?.querySelector('input[type="password"], input[type="text"]');
          }

          if (!input) return;

          const isPassword = input.type === "password";
          input.type = isPassword ? "text" : "password";

          // Update toggle button icon/text
          btn.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
          );
          btn.classList.toggle("is-visible", isPassword);

          const icon = btn.querySelector("i, svg");
          if (icon) {
            if (
              icon.classList.contains("fa-eye") ||
              icon.classList.contains("fa-eye-slash")
            ) {
              icon.classList.toggle("fa-eye", !isPassword);
              icon.classList.toggle("fa-eye-slash", isPassword);
            }
          }
        });
      });
    },
  };

  // =========================================================================
  // FORM VALIDATION & INTERACTION CONTROLLER
  // =========================================================================
  const Forms = {
    init() {
      this.initLoginForm();
      this.initRegistrationForm();
      this.initContactForm();
      this.initCharacterCounters();
      this.initLogoutButtons();
    },

    // Inline field error display
    showFieldError(input, message) {
      this.clearFieldError(input);
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");

      const errorEl = document.createElement("div");
      errorEl.className = "invalid-feedback stackly-field-error";
      errorEl.style.cssText =
        "color: #ef4444; font-size: 13px; margin-top: 4px; display: block;";
      errorEl.textContent = message;

      const parent =
        input.closest(".input-group, .form-floating, .form-group") ||
        input.parentNode;
      parent.appendChild(errorEl);
    },

    clearFieldError(input) {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      const parent =
        input.closest(".input-group, .form-floating, .form-group") ||
        input.parentNode;
      const existing = parent.querySelectorAll(
        ".stackly-field-error, .invalid-feedback"
      );
      existing.forEach((el) => el.remove());
    },

    clearAllErrors(form) {
      form
        .querySelectorAll(".is-invalid")
        .forEach((el) => el.classList.remove("is-invalid"));
      form
        .querySelectorAll(".stackly-field-error, .invalid-feedback")
        .forEach((el) => el.remove());
    },

    initLoginForm() {
      const form = document.querySelector(
        '#loginForm, form[data-auth="login"], .login-form'
      );
      if (!form) return;

      form.setAttribute("novalidate", "true");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.clearAllErrors(form);

        const emailInput = form.querySelector(
          'input[type="email"], input[name="email"], #email'
        );
        const passwordInput = form.querySelector(
          'input[type="password"], input[name="password"], #password'
        );
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        let hasError = false;
        let firstInvalid = null;

        // Email validation
        if (!email) {
          this.showFieldError(emailInput, "Please enter your email address.");
          hasError = true;
          firstInvalid = firstInvalid || emailInput;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          this.showFieldError(
            emailInput,
            "Please enter a valid email address."
          );
          hasError = true;
          firstInvalid = firstInvalid || emailInput;
        }

        // Password validation
        if (!password) {
          this.showFieldError(passwordInput, "Please enter your password.");
          hasError = true;
          firstInvalid = firstInvalid || passwordInput;
        }

        if (hasError) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        // Attempt login
        const result = Auth.login(email, password);

        if (result.success) {
          Toast.show(
            `Welcome back, ${result.user.name}! Redirecting to dashboard...`,
            "success"
          );
          setTimeout(() => {
            window.location.href = getPageUrl("dashboard.html");
          }, 800);
        } else {
          Toast.show(result.message, "error");
          if (passwordInput) {
            this.showFieldError(passwordInput, result.message);
            passwordInput.focus();
          }
        }
      });
    },

    initRegistrationForm() {
      const form = document.querySelector(
        '#registerForm, form[data-auth="register"], .register-form'
      );
      if (!form) return;

      form.setAttribute("novalidate", "true");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.clearAllErrors(form);

        const nameInput = form.querySelector(
          'input[name="name"], input[name="fullName"], #fullName, #name'
        );
        const emailInput = form.querySelector(
          'input[type="email"], input[name="email"], #email, #regEmail'
        );
        const phoneInput = form.querySelector(
          'input[type="tel"], input[name="phone"], #phone, #mobile'
        );
        const passwordInput = form.querySelector(
          'input[name="password"], #registerPassword, #password'
        );
        const confirmInput = form.querySelector(
          'input[name="confirmPassword"], #confirmPassword, #passwordConfirm'
        );
        const termsInput = form.querySelector(
          'input[name="terms"], #termsCheck, #agreeTerms, input[type="checkbox"][required]'
        );
        const roleSelect = form.querySelector(
          'select[name="role"], #roleSelect'
        );

        let hasError = false;
        let firstInvalid = null;

        // Full Name: letters and spaces only, min 2 chars
        const nameVal = nameInput ? nameInput.value.trim() : "";
        if (!nameVal) {
          this.showFieldError(nameInput, "Full name is required.");
          hasError = true;
          firstInvalid = firstInvalid || nameInput;
        } else if (!/^[A-Za-z\s]{2,50}$/.test(nameVal)) {
          this.showFieldError(
            nameInput,
            "Name should contain alphabets and spaces only (2-50 characters)."
          );
          hasError = true;
          firstInvalid = firstInvalid || nameInput;
        }

        // Mobile: exactly 10 digits
        const phoneVal = phoneInput ? phoneInput.value.trim() : "";
        if (!phoneVal) {
          this.showFieldError(phoneInput, "Mobile number is required.");
          hasError = true;
          firstInvalid = firstInvalid || phoneInput;
        } else if (!/^\d{10}$/.test(phoneVal.replace(/\D/g, ""))) {
          this.showFieldError(
            phoneInput,
            "Please enter a valid 10-digit mobile number."
          );
          hasError = true;
          firstInvalid = firstInvalid || phoneInput;
        }

        // Email: standard format
        const emailVal = emailInput ? emailInput.value.trim() : "";
        if (!emailVal) {
          this.showFieldError(emailInput, "Email address is required.");
          hasError = true;
          firstInvalid = firstInvalid || emailInput;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          this.showFieldError(
            emailInput,
            "Please provide a valid email address."
          );
          hasError = true;
          firstInvalid = firstInvalid || emailInput;
        }

        // Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
        const passVal = passwordInput ? passwordInput.value : "";
        const strongPassRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passVal) {
          this.showFieldError(passwordInput, "Password is required.");
          hasError = true;
          firstInvalid = firstInvalid || passwordInput;
        } else if (!strongPassRegex.test(passVal)) {
          this.showFieldError(
            passwordInput,
            "Must be at least 8 chars with uppercase, lowercase, number & special character."
          );
          hasError = true;
          firstInvalid = firstInvalid || passwordInput;
        }

        // Confirm Password
        const confirmVal = confirmInput ? confirmInput.value : "";
        if (!confirmVal) {
          this.showFieldError(confirmInput, "Please confirm your password.");
          hasError = true;
          firstInvalid = firstInvalid || confirmInput;
        } else if (confirmVal !== passVal) {
          this.showFieldError(confirmInput, "Passwords do not match.");
          hasError = true;
          firstInvalid = firstInvalid || confirmInput;
        }

        // Terms & Conditions Checkbox
        if (termsInput && !termsInput.checked) {
          this.showFieldError(
            termsInput,
            "You must accept the terms & conditions to proceed."
          );
          hasError = true;
          firstInvalid = firstInvalid || termsInput;
        }

        if (hasError) {
          if (firstInvalid) firstInvalid.focus();
          Toast.show(
            "Please review the highlighted fields and fix the errors.",
            "error"
          );
          return;
        }

        // Register user
        const result = Auth.register({
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          password: passVal,
          role: roleSelect ? roleSelect.value : "student",
        });

        if (result.success) {
          Toast.show(
            "Registration successful! Redirecting to sign in...",
            "success"
          );
          form.reset();
          setTimeout(() => {
            window.location.href = getPageUrl("sign-in.html");
          }, 1200);
        } else {
          Toast.show(result.message, "error");
          if (emailInput) {
            this.showFieldError(emailInput, result.message);
            emailInput.focus();
          }
        }
      });
    },

    initContactForm() {
      const form = document.querySelector(
        '#contactForm, form[data-form="contact"], .contact-form'
      );
      if (!form) return;

      form.setAttribute("novalidate", "true");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.clearAllErrors(form);

        const nameInput = form.querySelector(
          'input[name="name"], #contactName, #name'
        );
        const emailInput = form.querySelector(
          'input[name="email"], #contactEmail, #email'
        );
        const phoneInput = form.querySelector(
          'input[name="phone"], #contactPhone, #phone'
        );
        const subjectInput = form.querySelector(
          'input[name="subject"], #contactSubject, #subject'
        );
        const messageInput = form.querySelector(
          'textarea[name="message"], #contactMessage, #message'
        );

        let hasError = false;
        let firstInvalid = null;

        // Name: letters and spaces only (Strictly required)
        const nameVal = nameInput ? nameInput.value.trim() : "";
        if (!nameVal) {
          this.showFieldError(nameInput, "Full name is required.");
          hasError = true;
          firstInvalid = firstInvalid || nameInput;
        } else if (!/^[A-Za-z\s]{2,50}$/.test(nameVal)) {
          this.showFieldError(
            nameInput,
            "Name should contain alphabets and spaces only."
          );
          hasError = true;
          firstInvalid = firstInvalid || nameInput;
        }

        // Email (Required)
        const emailVal = emailInput ? emailInput.value.trim() : "";
        if (!emailVal) {
          this.showFieldError(emailInput, "Email address is required.");
          hasError = true;
          firstInvalid = firstInvalid || emailInput;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          this.showFieldError(
            emailInput,
            "Please enter a valid email address."
          );
          hasError = true;
          firstInvalid = firstInvalid || emailInput;
        }

        // Phone: Strictly required, exactly 10 digits
        if (phoneInput) {
          const phoneVal = phoneInput.value.trim().replace(/\D/g, "");
          if (!phoneVal) {
            this.showFieldError(phoneInput, "Mobile number is required.");
            hasError = true;
            firstInvalid = firstInvalid || phoneInput;
          } else if (phoneVal.length !== 10) {
            this.showFieldError(
              phoneInput,
              "Mobile number must be exactly 10 digits."
            );
            hasError = true;
            firstInvalid = firstInvalid || phoneInput;
          }
        }

        // Subject (Required)
        if (subjectInput) {
          const subjectVal = subjectInput.value.trim();
          if (!subjectVal) {
            this.showFieldError(
              subjectInput,
              "Please select or enter a subject."
            );
            hasError = true;
            firstInvalid = firstInvalid || subjectInput;
          }
        }

        // Message: Optional, but if provided must be at least 10 chars
        if (messageInput) {
          const msgVal = messageInput.value.trim();
          if (msgVal && msgVal.length < 10) {
            this.showFieldError(
              messageInput,
              "Message should be at least 10 characters long if provided."
            );
            hasError = true;
            firstInvalid = firstInvalid || messageInput;
          }
        }

        if (hasError) {
          if (firstInvalid) firstInvalid.focus();
          Toast.show(
            "Please fix the errors in the form before submitting.",
            "error"
          );
          return;
        }

        // Submission success feedback
        Toast.show(
          "Thank you! Your message has been received. Our team will contact you shortly.",
          "success"
        );
        form.reset();

        // Reset any character counters
        const counter = form.querySelector("[data-char-count]");
        if (counter) counter.textContent = "0 / 500";
      });
    },

    initCharacterCounters() {
      const textareas = document.querySelectorAll(
        "textarea[data-maxlength], textarea[maxlength]"
      );

      textareas.forEach((textarea) => {
        const max = parseInt(
          textarea.getAttribute("maxlength") ||
            textarea.getAttribute("data-maxlength") ||
            "500",
          10
        );
        let counter = textarea.parentNode.querySelector(
          "[data-char-count], .char-counter"
        );

        if (!counter) {
          counter = document.createElement("div");
          counter.className = "char-counter";
          counter.style.cssText =
            "font-size: 12px; color: #64748b; text-align: right; margin-top: 4px;";
          textarea.parentNode.appendChild(counter);
        }

        const updateCount = () => {
          const current = textarea.value.length;
          counter.textContent = `${current} / ${max}`;
          if (current >= max) {
            counter.style.color = "#ef4444";
          } else {
            counter.style.color = "#64748b";
          }
        };

        textarea.addEventListener("input", updateCount);
        updateCount();
      });
    },

    initLogoutButtons() {
      const logoutBtns = document.querySelectorAll(
        '[data-action="logout"], .logout-btn, #logoutBtn, a[href*="logout"], #signOutBtn, .signout-action-btn, #sidebarSignOutBtn'
      );
      logoutBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          Auth.logout();
        });
      });
    },
  };

  // =========================================================================
  // DASHBOARD CONTROLLER & ROLE ADAPTATION
  // =========================================================================
  const Dashboard = {
    init() {
      if (!Utils.isCurrentPage("dashboard.html")) return;

      this.guardRoute();
      this.initRoleSwitcher();
      this.initSidebarToggle();
      this.renderDashboard();
    },

    guardRoute() {
      const currentUser = Auth.getCurrentUser();
      if (!currentUser) {
        Toast.show(
          "Authentication required. Redirecting to sign in...",
          "warning"
        );
        setTimeout(() => {
          window.location.href = getPageUrl("sign-in.html");
        }, 700);
      }
    },

    initRoleSwitcher() {
      const roleSelects = document.querySelectorAll(
        "#roleSwitcher, [data-role-switcher], .role-switcher-select"
      );
      const roleButtons = document.querySelectorAll("[data-switch-role]");

      roleSelects.forEach((select) => {
        select.value = Auth.getCurrentRole();
        select.addEventListener("change", (e) => {
          this.switchRole(e.target.value);
        });
      });

      roleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const targetRole = btn.getAttribute("data-switch-role");
          if (targetRole) {
            this.switchRole(targetRole);
          }
        });
      });
    },

    switchRole(newRole) {
      const users = Auth.getAllUsers();
      // Find default user of this role or adapt current user
      let matchedUser = users.find((u) => u.role === newRole);

      if (!matchedUser) {
        matchedUser = Auth.getCurrentUser() || users[0];
        matchedUser.role = newRole;
      }

      Auth.setCurrentUser(matchedUser);
      Auth.setRole(newRole);

      Toast.show(
        `Role switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} view.`,
        "info"
      );
      Navigation.updateGreetings();
      this.renderDashboard();
    },

    initSidebarToggle() {
      const toggles = document.querySelectorAll(
        "#sidebarToggle, .sidebar-toggle, [data-sidebar-toggle]"
      );
      const sidebar = document.querySelector(
        "#sidebar, .dashboard-sidebar, .sidebar"
      );

      if (!toggles.length || !sidebar) return;

      toggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          sidebar.classList.toggle("collapsed");
          sidebar.classList.toggle("active");
          document.body.classList.toggle("sidebar-collapsed");
        });
      });
    },

    renderDashboard() {
      const currentUser = Auth.getCurrentUser();
      if (!currentUser) return;

      const role = currentUser.role || "student";

      // Update text details
      document
        .querySelectorAll("[data-user-name], .user-name")
        .forEach((el) => (el.textContent = currentUser.name));
      document
        .querySelectorAll("[data-user-email], .user-email")
        .forEach((el) => (el.textContent = currentUser.email));
      document
        .querySelectorAll("[data-user-headline], .user-headline")
        .forEach((el) => (el.textContent = currentUser.headline || ""));
      document
        .querySelectorAll("[data-user-role], .user-role-badge")
        .forEach((el) => {
          el.textContent = role.toUpperCase();
          el.className = `user-role-badge badge role-badge-${role}`;
        });

      // Update avatars
      document
        .querySelectorAll("[data-user-avatar], .dashboard-user-avatar")
        .forEach((img) => {
          if (img.tagName === "IMG") {
            img.src =
              getAssetUrl(currentUser.avatar || "assets/images/student-amara-okafor.webp");
            img.alt = currentUser.name;
          }
        });

      // Render role-specific stats
      this.renderStats(role, currentUser);

      // Render courses / activities
      this.renderCourses(role, currentUser);
      this.renderActivities(currentUser);
    },

    renderStats(role, user) {
      const statsContainer = document.querySelector(
        "#dashboardStatsContainer, [data-dashboard-stats]"
      );
      if (!statsContainer) return;

      let cardsHtml = "";

      if (role === "student") {
        cardsHtml = `
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-primary-subtle text-primary p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span>
                <span class="badge bg-success-subtle text-success font-monospace">+1 this month</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.enrolledCourses || 4}</h3>
              <p class="text-muted small mb-0">Enrolled Courses</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-success-subtle text-success p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
                <span class="badge bg-primary-subtle text-primary font-monospace">Active</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.hoursLearned || 38}h</h3>
              <p class="text-muted small mb-0">Hours Learned</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-warning-subtle text-warning p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                <span class="badge bg-warning-subtle text-warning font-monospace">Top 5%</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.completedCourses || 2}</h3>
              <p class="text-muted small mb-0">Completed Courses</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-info-subtle text-info p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15l-2 5l9-11h-7l2-5l-9 11h7z"></path></svg></span>
                <span class="badge bg-info-subtle text-info font-monospace">Verified</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.certificates || 2}</h3>
              <p class="text-muted small mb-0">Earned Certificates</p>
            </div>
          </div>
        `;
      } else if (role === "instructor") {
        cardsHtml = `
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-primary-subtle text-primary p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span>
                <span class="badge bg-success-subtle text-success font-monospace">+12%</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.activeStudents || "1,420"}</h3>
              <p class="text-muted small mb-0">Active Students</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-success-subtle text-success p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></span>
                <span class="badge bg-success-subtle text-success font-monospace">Payout Ready</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.revenue || "$18,450"}</h3>
              <p class="text-muted small mb-0">Total Earnings</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-warning-subtle text-warning p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span>
                <span class="badge bg-primary-subtle text-primary font-monospace">Published</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.totalCourses || 6}</h3>
              <p class="text-muted small mb-0">Active Courses</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-info-subtle text-info p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                <span class="badge bg-warning-subtle text-warning font-monospace">Excellent</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.rating || "4.9"} / 5.0</h3>
              <p class="text-muted small mb-0">Instructor Rating</p>
            </div>
          </div>
        `;
      } else if (role === "mentor") {
        cardsHtml = `
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-primary-subtle text-primary p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></span>
                <span class="badge bg-success-subtle text-success font-monospace">Completed</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.sessionsCompleted || 142}</h3>
              <p class="text-muted small mb-0">1-on-1 Sessions</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-success-subtle text-success p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
                <span class="badge bg-primary-subtle text-primary font-monospace">This Week</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.upcomingSessions || 8}</h3>
              <p class="text-muted small mb-0">Upcoming Bookings</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-warning-subtle text-warning p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg></span>
                <span class="badge bg-info-subtle text-info font-monospace">Active</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.menteesCount || 56}</h3>
              <p class="text-muted small mb-0">Active Mentees</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-info-subtle text-info p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                <span class="badge bg-warning-subtle text-warning font-monospace">Perfect</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.rating || "5.0"}</h3>
              <p class="text-muted small mb-0">Mentorship Score</p>
            </div>
          </div>
        `;
      } else {
        // Admin
        cardsHtml = `
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-primary-subtle text-primary p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span>
                <span class="badge bg-success-subtle text-success font-monospace">System Wide</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.totalUsers || "8,420"}</h3>
              <p class="text-muted small mb-0">Registered Users</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-success-subtle text-success p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></span>
                <span class="badge bg-success-subtle text-success font-monospace">+18.4%</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.platformRevenue || "$148,200"}</h3>
              <p class="text-muted small mb-0">Platform Gross Volume</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-warning-subtle text-warning p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span>
                <span class="badge bg-primary-subtle text-primary font-monospace">Catalog</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.activeCourses || 28}</h3>
              <p class="text-muted small mb-0">Published Courses</p>
            </div>
          </div>
          <div class="col-sm-6 col-xl-3">
            <div class="card stat-card shadow-sm border-0 p-4 rounded-4 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="stat-icon bg-danger-subtle text-danger p-3 rounded-3"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                <span class="badge bg-danger-subtle text-danger font-monospace">Pending</span>
              </div>
              <h3 class="fw-bold mb-1">${user.stats?.pendingApprovals || 9}</h3>
              <p class="text-muted small mb-0">Course Approvals</p>
            </div>
          </div>
        `;
      }

      statsContainer.innerHTML = cardsHtml;
    },

    renderCourses(role, user) {
      const container = document.querySelector(
        "#dashboardCoursesList, [data-dashboard-courses]"
      );
      if (!container) return;

      const courses = user.courses || [];
      if (!courses.length) {
        container.innerHTML = `
          <div class="p-4 text-center text-muted">
            <p class="mb-0">No active items recorded for this profile.</p>
          </div>
        `;
        return;
      }

      let html = "";
      courses.forEach((c) => {
        let metaHtml = "";
        if (role === "student") {
          metaHtml = `
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="small text-muted">Progress</span>
              <span class="small fw-semibold text-primary">${c.progress}%</span>
            </div>
            <div class="progress mt-2" style="height: 6px;">
              <div class="progress-bar bg-primary" role="progressbar" style="width: ${c.progress}%" aria-valuenow="${c.progress}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          `;
        } else if (role === "instructor") {
          metaHtml = `
            <div class="d-flex align-items-center justify-content-between mt-3 text-muted small">
              <span><strong>${c.enrolled}</strong> students</span>
              <span>⭐ <strong>${c.rating}</strong></span>
              <span class="text-success fw-bold">${c.revenue}</span>
            </div>
          `;
        } else if (role === "mentor") {
          metaHtml = `
            <div class="d-flex align-items-center justify-content-between mt-3 text-muted small">
              <span><strong>${c.mentees}</strong> assigned mentees</span>
              <span>⭐ <strong>${c.rating}</strong></span>
            </div>
          `;
        } else {
          metaHtml = `
            <div class="d-flex align-items-center justify-content-between mt-3 text-muted small">
              <span>Instructor: <strong>${c.instructor}</strong></span>
              <span class="badge bg-success-subtle text-success">${c.status}</span>
            </div>
          `;
        }

        html += `
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden course-dashboard-card bg-white">
              <div class="position-relative">
                <img src="${getAssetUrl(c.image || "assets/images/course-fullstack-dev.webp")}" class="card-img-top" alt="${Utils.escapeHtml(c.title)}" style="height: 180px; object-fit: cover;">
              </div>
              <div class="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <h6 class="fw-bold mb-2">${Utils.escapeHtml(c.title)}</h6>
                  ${metaHtml}
                </div>
                <div class="mt-4 pt-2">
                  <a href="404.html" class="btn btn-outline-primary btn-sm w-100 rounded-pill" data-404="true">
                    ${role === "student" ? "Continue Lesson" : role === "instructor" ? "Manage Curriculum" : "View Details"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    },

    renderActivities(user) {
      const container = document.querySelector(
        "#dashboardActivitiesList, [data-dashboard-activities]"
      );
      if (!container) return;

      const activities = user.activities || [];
      if (!activities.length) {
        container.innerHTML = `<li class="list-group-item border-0 text-muted small py-3">No recent activities found.</li>`;
        return;
      }

      let html = "";
      activities.forEach((a) => {
        html += `
          <li class="list-group-item border-0 px-0 py-3 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <span class="badge rounded-circle p-2 bg-${a.type || "primary"}-subtle text-${a.type || "primary"}">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              </span>
              <div>
                <p class="mb-0 fw-medium small text-dark">${Utils.escapeHtml(a.title)}</p>
                <span class="text-muted" style="font-size: 11px;">${Utils.escapeHtml(a.time)}</span>
              </div>
            </div>
            <a href="404.html" class="btn btn-light btn-sm rounded-pill text-muted small" data-404="true" style="font-size: 12px;">View</a>
          </li>
        `;
      });

      container.innerHTML = html;
    },
  };

  // =========================================================================
  // GLOBAL LINK & BUTTON INTERCEPTOR
  // =========================================================================
  const GlobalInterceptors = {
    init() {
      const isDashboard = window.location.pathname.includes("dashboard");
      const isAuthPage =
        window.location.pathname.includes("sign-in") ||
        window.location.pathname.includes("sign-up");
      const is404Page = window.location.pathname.includes("404");

      document.addEventListener("click", (e) => {
        // 1. Logo clicks always redirect strictly to index.html
        const logoTarget = e.target.closest(
          'img[src*="logoStackly"], [data-home-link], .brand-logo, .brand-logo-link, .auth-header-brand, .auth-banner-brand-logo'
        );
        if (logoTarget) {
          const anchor = logoTarget.closest("a");
          if (
            anchor &&
            (anchor.getAttribute("href") === "index.html" ||
              anchor.getAttribute("href") === "../index.html")
          ) {
            return; // allow normal navigation
          }
          e.preventDefault();
          window.location.href = getHomeUrl();
          return;
        }

        // 1b. Allow core authentication and home navigation controls to navigate normally
        const backHomeTarget = e.target.closest(
          ".btn-back-home, [data-back-home], a[href$='index.html'], a[href*='index.html']"
        );
        if (backHomeTarget) {
          return; // Allow normal navigation to index.html
        }

        const authNavTarget = e.target.closest(
          "#createAccountLink, .link-create-account, #linkToSignIn, .link-to-signin, a[href*='sign-in.html'], a[href*='sign-up.html']"
        );
        if (authNavTarget) {
          return; // Allow normal navigation to sign-in / sign-up
        }

        // 1c. Allow Back to Top, billing switch, and non-intercept elements without 404 redirection
        const backToTopTarget = e.target.closest(
          "#back-to-top, .back-to-top-btn, [data-back-to-top], [data-no-intercept='true'], #billing-toggle, .toggle-switch-btn, .billing-toggle-wrap, [role='switch']"
        );
        if (backToTopTarget) {
          return; // Never intercept back-to-top or non-intercept switch controls
        }

        // 1d. In dashboard pages content, redirect every button to 404 page
        if (isDashboard && !is404Page) {
          const dashContent = e.target.closest(
            "#dashboardContent, .dashboard-content"
          );
          if (dashContent) {
            const clickable = e.target.closest(
              "button, a, .btn, [role='button']"
            );
            if (clickable) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              window.location.href = getPageUrl("404.html");
              return;
            }
          }
        }

        // 2. In non-dashboard and non-auth pages (except 404 page itself), all action buttons & links outside navbar and footer redirect to 404
        if (!isDashboard && !is404Page && !isAuthPage) {
          const clickable = e.target.closest("a, button");
          if (clickable) {
            // Keep Back to Top button working without 404 redirection
            if (
              clickable.id === "back-to-top" ||
              clickable.classList.contains("back-to-top-btn") ||
              clickable.closest(
                "#back-to-top, .back-to-top-btn, [data-back-to-top]"
              ) ||
              clickable.getAttribute("data-no-intercept") === "true" ||
              clickable.closest("[data-no-intercept='true']")
            ) {
              return;
            }

            // Keep navbar & mobile drawer navigation working
            if (
              clickable.closest(
                "header, nav, #mobile-nav, .mobile-nav-overlay, #mobileNavOverlay, .mobile-nav-drawer, .nav-desktop, .site-header, .header-sticky, .mobile-toggle, .mobile-close, .mobile-nav-close, #mobileNavClose, #mobileMenuToggle, .hamburger-btn, .mobile-close-btn, #mobileSidebarCloseBtn, #sidebarCollapseBtn, .sidebar-toggle-btn, #mobileNavMenu, .mobile-menu"
              )
            ) {
              return;
            }
            // Keep footer navigation working
            if (clickable.closest("footer, .site-footer, .footer")) {
              return;
            }
            // Allow form submission on contact form or auth forms
            if (clickable.type === "submit" && clickable.closest("form")) {
              return;
            }
            // Allow interactive UI controls (tabs, accordions, details, password eye toggles, back button, switches/billing toggle, FAQ)
            if (
              clickable.classList.contains("toggle-password") ||
              clickable.closest(".toggle-password") ||
              clickable.classList.contains("filter-btn") ||
              clickable.hasAttribute("data-filter") ||
              clickable.closest("details") ||
              clickable.classList.contains("accordion-header") ||
              clickable.closest(".accordion-header") ||
              clickable.id === "billing-toggle" ||
              clickable.classList.contains("toggle-switch-btn") ||
              clickable.closest(".billing-toggle-wrap, .toggle-switch-btn") ||
              clickable.getAttribute("role") === "switch" ||
              clickable.closest("[role='switch']") ||
              clickable.classList.contains("faq-question-btn") ||
              clickable.closest(".faq-question-btn, .faq-item") ||
              (clickable.getAttribute("onclick") &&
                clickable.getAttribute("onclick").includes("history.back"))
            ) {
              return;
            }

            // Redirect all other in-body action buttons & links to 404
            e.preventDefault();
            window.location.href = getPageUrl("404.html");
            return;
          }
        }

        // 3. Handle explicit 404 targets & dummy action buttons
        const actionTarget = e.target.closest(
          'a[data-404="true"], button[data-404="true"], a[href="#"], [data-action="dummy"]'
        );
        if (actionTarget) {
          if (
            actionTarget.id === "back-to-top" ||
            actionTarget.classList.contains("back-to-top-btn") ||
            actionTarget.closest(
              "#back-to-top, .back-to-top-btn, [data-back-to-top]"
            ) ||
            actionTarget.getAttribute("data-no-intercept") === "true" ||
            actionTarget.hasAttribute("data-bs-toggle") ||
            actionTarget.hasAttribute("data-bs-target") ||
            actionTarget.classList.contains("dropdown-toggle") ||
            actionTarget.closest(".dropdown-menu")
          ) {
            return;
          }

          e.preventDefault();
          window.location.href = getPageUrl("404.html");
        }
      });

      // Synchronize all buttons & links redirecting to 404 to consistently display the exact 404 anchor link
      const sync404AnchorLinks = () => {
        const target404 = getPageUrl("404.html");

        if (isDashboard && !is404Page) {
          const dashContent =
            document.getElementById("dashboardContent") ||
            document.querySelector(".dashboard-content");
          if (dashContent) {
            dashContent.querySelectorAll("a").forEach((a) => {
              if (a.getAttribute("href") !== target404) {
                a.setAttribute("href", target404);
              }
            });
            dashContent.querySelectorAll("button").forEach((btn) => {
              if (
                btn.id === "back-to-top" ||
                btn.classList.contains("back-to-top-btn") ||
                btn.hasAttribute("data-no-intercept")
              ) {
                return;
              }
              const a = document.createElement("a");
              a.href = target404;
              a.className = btn.className;
              if (btn.id) a.id = btn.id;
              if (btn.getAttribute("style"))
                a.setAttribute("style", btn.getAttribute("style"));
              if (btn.getAttribute("title"))
                a.setAttribute("title", btn.getAttribute("title"));
              if (btn.getAttribute("aria-label"))
                a.setAttribute("aria-label", btn.getAttribute("aria-label"));
              a.innerHTML = btn.innerHTML;
              btn.parentNode.replaceChild(a, btn);
            });
          }
        }

        if (!isDashboard && !is404Page && !isAuthPage) {
          const bodyLinks = document.querySelectorAll(
            "main a, #main-content a, [data-404='true']"
          );
          bodyLinks.forEach((a) => {
            if (
              a.closest(
                "header, nav, #mobile-nav, .mobile-nav-overlay, footer, .site-footer"
              ) ||
              a.id === "back-to-top" ||
              a.classList.contains("back-to-top-btn") ||
              a.hasAttribute("data-no-intercept") ||
              a.getAttribute("href")?.endsWith("sign-in.html") ||
              a.getAttribute("href")?.endsWith("sign-up.html") ||
              a.getAttribute("href")?.endsWith("index.html")
            ) {
              return;
            }
            if (a.getAttribute("href") !== target404) {
              a.setAttribute("href", target404);
            }
          });
        }
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", sync404AnchorLinks);
      } else {
        sync404AnchorLinks();
      }

      window.addEventListener("pageshow", sync404AnchorLinks);
    },
  };

  // =========================================================================
  // APPLICATION BOOTSTRAPPER
  // =========================================================================
  const App = {
    init() {
      // 1. Dismiss CSS Loader
      Loader.init();

      // 2. Initialize Seed Data & Mock Auth
      Auth.init();

      // 3. Setup Navigation, Mobile Menu & Sticky Navbar
      Navigation.init();

      // 4. Initialize Password UX (Strength Meter & Eye Toggle)
      PasswordUX.init();

      // 5. Initialize Forms & UX Validations
      Forms.init();

      // 6. Initialize Dashboard & Dynamic Roles
      Dashboard.init();

      // 7. Setup Global Interceptors (404 and Logo redirects)
      GlobalInterceptors.init();
    },

    // Public API for programmatic interactions
    showToast(msg, type, duration) {
      Toast.show(msg, type, duration);
    },
    auth: Auth,
    utils: Utils,
  };

  // Expose global namespace
  window.StacklyApp = App;

  // Initialize immediately or wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => App.init());
  } else {
    App.init();
  }

  // =========================================================================
  // GLOBAL FORM INITIALIZER: Ensure all forms across the website are empty by default
  // =========================================================================
  function resetAllFormsToEmpty() {
    document.querySelectorAll("form").forEach((form) => {
      try {
        form.reset();
        const fields = form.querySelectorAll(
          'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea'
        );
        fields.forEach((field) => {
          if (field.type === "checkbox" || field.type === "radio") {
            field.checked = false;
          } else if (field.tagName === "SELECT") {
            if (
              field.id !== "signupPhoneCode" &&
              field.id !== "countryCodeSelect"
            ) {
              field.selectedIndex = 0;
            }
          } else {
            field.value = "";
          }
        });
      } catch (e) {
        // Safe fallback
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", resetAllFormsToEmpty);
  } else {
    resetAllFormsToEmpty();
  }

  window.addEventListener("pageshow", resetAllFormsToEmpty);
})(window, document);
