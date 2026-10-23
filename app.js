
"use strict";

// ==========================================
// 1. DỮ LIỆU PHIM VIỆT NAM
// ==========================================
const moviesData = [
    {
        id: 1,
        title: "Mai",
        year: 2024,
        genres: ["Tâm lý", "Tình cảm"],
        director: "Trấn Thành",
        cast: ["Phương Anh Đào", "Tuấn Trần"],
        description: "Câu chuyện về Mai, một người phụ nữ trải qua nhiều biến cố trong cuộc sống và tình yêu.",
        poster: "Images/mai.jpg.jpg"
    },
    {
        id: 2,
        title: "Nhà Bà Nữ",
        year: 2023,
        genres: ["Gia đình", "Tâm lý"],
        director: "Trấn Thành",
        cast: ["Lê Giang", "Uyển Ân", "Song Luân"],
        description: "Bộ phim kể về những mâu thuẫn, tình cảm và sự thấu hiểu giữa các thành viên trong một gia đình.",
        poster: "Images/nhabanu (1).jpg"
    },
    {
        id: 3,
        title: "Bố Già",
        year: 2021,
        genres: ["Gia đình", "Tâm lý"],
        director: "Trấn Thành",
        cast: ["Trấn Thành", "Tuấn Trần"],
        description: "Câu chuyện cảm động về tình cha con, sự khác biệt thế hệ và những khó khăn trong cuộc sống.",
        poster: "Images/bogia.jpg"
    },
    {
        id: 4,
        title: "Lật Mặt 7: Một Điều Ước",
        year: 2024,
        genres: ["Gia đình", "Tâm lý"],
        director: "Lý Hải",
        cast: ["Thanh Hiền", "Trương Minh Cường"],
        description: "Bộ phim xoay quanh tình thân và sự gắn kết giữa người mẹ cùng các con.",
        poster: "Images/latmat7.jpg"
    },
    {
        id: 5,
        title: "Mắt Biếc",
        year: 2019,
        genres: ["Tình cảm", "Lãng mạn"],
        director: "Victor Vũ",
        cast: ["Trần Nghĩa", "Trúc Anh"],
        description: "Câu chuyện tình yêu đơn phương của Ngạn dành cho Hà Lan qua nhiều năm tháng.",
        poster: "Images/matbiec.jpg"
    },
    {
        id: 6,
        title: "Em Chưa 18",
        year: 2017,
        genres: ["Hài", "Tình cảm"],
        director: "Lê Thanh Sơn",
        cast: ["Kaity Nguyễn", "Kiều Minh Tuấn"],
        description: "Một câu chuyện hài hước về tình yêu tuổi trẻ và những tình huống bất ngờ.",
        poster: "Images/emchua18.jpg"
    },
    {
        id: 7,
        title: "Tiệc Trăng Máu",
        year: 2020,
        genres: ["Hài", "Tâm lý"],
        director: "Nguyễn Quang Dũng",
        cast: ["Thái Hòa", "Hồng Ánh", "Thu Trang"],
        description: "Một buổi gặp mặt bạn bè trở nên căng thẳng khi những bí mật cá nhân dần bị tiết lộ.",
        poster: "Images/tiectrangmau.jpg"
    },
    {
        id: 8,
        title: "Cua Lại Vợ Bầu",
        year: 2019,
        genres: ["Hài", "Tình cảm"],
        director: "Nhất Trung",
        cast: ["Trấn Thành", "Ninh Dương Lan Ngọc"],
        description: "Câu chuyện tình yêu với những lựa chọn khó khăn, hiểu lầm và cơ hội hàn gắn.",
        poster: "Images/cualaivobau.jpg"
    }
];

// ==========================================
// 2. TRẠNG THÁI ỨNG DỤNG
// ==========================================
let selectedGenres = [];
let searchQuery = "";

// ==========================================
// 3. KHỞI TẠO WEBSITE
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử HTML
    const moviesGrid = document.getElementById("movies-grid");
    const genresContainer = document.getElementById("genres-container");
    const searchInput = document.getElementById("search-input");
    const noResults = document.getElementById("no-results");

    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeText = document.getElementById("theme-text");

    const modal = document.getElementById("movie-modal");
    const modalBody = document.getElementById("modal-body");
    const modalCloseBtn = document.getElementById("modal-close");
    const modalOverlay = document.getElementById("modal-overlay");

    // Kiểm tra HTML có đủ phần tử cần thiết không
    if (
        !moviesGrid ||
        !genresContainer ||
        !searchInput ||
        !noResults ||
        !themeToggleBtn ||
        !themeIcon ||
        !themeText ||
        !modal ||
        !modalBody ||
        !modalCloseBtn ||
        !modalOverlay
    ) {
        console.error(
            "Thiếu phần tử HTML. Hãy kiểm tra các id trong index.html."
        );
        return;
    }

    // Khởi tạo ứng dụng
    initTheme();
    generateGenreCheckboxes();
    renderMovies(moviesData);

    // Tìm kiếm phim, chờ 400ms sau khi ngừng nhập
    searchInput.addEventListener(
        "input",
        debounce(function (event) {
            searchQuery = event.target.value.trim().toLowerCase();
            applyFilters();
        }, 400)
    );

    // Chuyển giao diện sáng/tối
    themeToggleBtn.addEventListener("click", toggleTheme);

    // Đóng popup bằng nút đóng
    modalCloseBtn.addEventListener("click", closeModal);

    // Đóng popup khi bấm nền tối
    modalOverlay.addEventListener("click", closeModal);

    // Đóng popup bằng phím Esc
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    // Hàm hiển thị danh sách phim
    function renderMovies(movies) {
        moviesGrid.innerHTML = "";

        if (movies.length === 0) {
            noResults.classList.remove("hidden");
            return;
        }

        noResults.classList.add("hidden");

        movies.forEach(function (movie) {
            const card = document.createElement("div");
            card.className = "movie-card";

            const posterWrapper = document.createElement("div");
            posterWrapper.className = "poster-wrapper";

            const poster = document.createElement("img");
            poster.className = "movie-poster";
            poster.src = movie.poster;
            poster.alt = movie.title;
            poster.loading = "lazy";

            poster.onerror = function () {
                poster.onerror = null;
                poster.src =
                    "https://placehold.co/400x600?text=No+Poster";
            };

            const movieInfo = document.createElement("div");
            movieInfo.className = "movie-info";

            const title = document.createElement("div");
            title.className = "movie-title";
            title.textContent = movie.title;

            const meta = document.createElement("div");
            meta.className = "movie-meta";

            const year = document.createElement("p");
            year.textContent = "📅 " + movie.year;

            const genres = document.createElement("p");
            genres.textContent = "🏷️ " + movie.genres.join(", ");

            posterWrapper.appendChild(poster);
            movieInfo.appendChild(title);
            meta.appendChild(year);
            meta.appendChild(genres);
            movieInfo.appendChild(meta);

            card.appendChild(posterWrapper);
            card.appendChild(movieInfo);

            // Bấm thẻ phim để xem chi tiết
            card.addEventListener("click", function () {
                openModal(movie);
            });

            moviesGrid.appendChild(card);
        });
    }

    // ==========================================
    // 4. TẠO CHECKBOX THỂ LOẠI TỰ ĐỘNG
    // ==========================================
    function generateGenreCheckboxes() {
        const allGenres = new Set();

        moviesData.forEach(function (movie) {
            movie.genres.forEach(function (genre) {
                allGenres.add(genre);
            });
        });

        genresContainer.innerHTML = "";

        allGenres.forEach(function (genre) {
            const label = document.createElement("label");
            label.className = "genre-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = genre;

            const text = document.createElement("span");
            text.textContent = genre;

            checkbox.addEventListener("change", function () {
                if (checkbox.checked) {
                    selectedGenres.push(genre);
                } else {
                    selectedGenres = selectedGenres.filter(
                        function (item) {
                            return item !== genre;
                        }
                    );
                }

                applyFilters();
            });

            label.appendChild(checkbox);
            label.appendChild(text);
            genresContainer.appendChild(label);
        });
    }

    // ==========================================
    // 5. TÌM KIẾM VÀ LỌC PHIM
    // ==========================================
    function applyFilters() {
        const filteredMovies = moviesData.filter(function (movie) {
            // Kiểm tra tên phim
            const matchesSearch = movie.title
                .toLowerCase()
                .includes(searchQuery);

            // Kiểm tra thể loại
            const matchesGenre =
                selectedGenres.length === 0 ||
                selectedGenres.some(function (genre) {
                    return movie.genres.includes(genre);
                });

            // Phải thỏa mãn cả hai điều kiện
            return matchesSearch && matchesGenre;
        });

        renderMovies(filteredMovies);
    }

    // ==========================================
    // 6. DEBOUNCE TỐI ƯU TÌM KIẾM
    // ==========================================
    function debounce(func, delay) {
        let timer;

        return function (...args) {
            clearTimeout(timer);

            timer = setTimeout(function () {
                func.apply(this, args);
            }, delay);
        };
    }

    // ==========================================
    // 7. POPUP CHI TIẾT PHIM
    // ==========================================
    function openModal(movie) {
        modalBody.innerHTML = "";

        const detail = document.createElement("div");
        detail.className = "modal-detail";

        const poster = document.createElement("img");
        poster.src = movie.poster;
        poster.alt = movie.title;

        const info = document.createElement("div");
        info.className = "modal-detail-info";

        const title = document.createElement("h2");
        title.textContent = movie.title + " (" + movie.year + ")";

        const genres = document.createElement("p");
        genres.textContent = "🎭 Thể loại: " + movie.genres.join(", ");

        const director = document.createElement("p");
        director.textContent = "🎬 Đạo diễn: " + movie.director;

        const cast = document.createElement("p");
        cast.textContent = "⭐ Diễn viên: " + movie.cast.join(", ");

        const description = document.createElement("p");
        description.textContent = "📝 Nội dung: " + movie.description;

        info.appendChild(title);
        info.appendChild(genres);
        info.appendChild(director);
        info.appendChild(cast);
        info.appendChild(description);

        detail.appendChild(poster);
        detail.appendChild(info);

        modalBody.appendChild(detail);
        modal.classList.remove("hidden");
    }

    function closeModal() {
        modal.classList.add("hidden");
    }

    // ==========================================
    // 8. GIAO DIỆN SÁNG / TỐI
    // ==========================================
    function initTheme() {
        let savedTheme = "light";

        try {
            savedTheme = localStorage.getItem("app-theme") || "light";
        } catch (error) {
            console.warn("Không thể đọc tùy chọn giao diện.", error);
        }

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            themeIcon.textContent = "☀️";
            themeText.textContent = "Sáng";
        } else {
            document.body.classList.remove("dark-mode");
            themeIcon.textContent = "🌙";
            themeText.textContent = "Tối";
        }
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        if (isDark) {
            themeIcon.textContent = "☀️";
            themeText.textContent = "Sáng";
        } else {
            themeIcon.textContent = "🌙";
            themeText.textContent = "Tối";
        }

        try {
            localStorage.setItem(
                "app-theme",
                isDark ? "dark" : "light"
            );
        } catch (error) {
            console.warn("Không thể lưu tùy chọn giao diện.", error);
        }
    }
});
