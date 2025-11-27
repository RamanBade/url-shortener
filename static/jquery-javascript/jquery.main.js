// jquery.main.js
$(document).ready(function () {

    // ==========================
    // 1) Create Short URL (AJAX)
    // ==========================
    $("#shorten-form").on("submit", function (e) {
        e.preventDefault();

        const originalURL = $("input[name='original_url']").val().trim();
        if (!originalURL) {
            alert("Please enter a valid URL.");
            return;
        }

        $.ajax({
            url: "/api/shorten",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ original_url: originalURL }),
            success: function (response) {
                if (response.short_url) {
                    const shortURL = window.location.origin + "/" + response.short_url;
                    alert("Short URL created:\n" + shortURL);
                    loadAnalytics(); // refresh table
                } else {
                    alert("Error: Could not create short URL.");
                }
            },
            error: function () {
                alert("Server error.");
            }
        });
    });

    // ==========================
    // 2) Build / Render Analytics Table
    // ==========================
    function buildRow(link) {
        const shortFullURL = window.location.origin + "/" + link.short_url;

        // create table row HTML with data-code on TR, click-count span and bar
        return `
            <tr data-code="${link.short_url}">
                <td>
                    <a href="${shortFullURL}" target="_blank" class="short-link">${link.short_url}</a>
                </td>
                <td>${escapeHtml(link.original_url)}</td>
                <td>
                    <div class="bar" style="width: ${Math.min(link.clicks * 10, 200)}px; background-color: #4CAF50; height: 20px;"></div>
                    <span class="click-count" style="margin-left:8px;">${link.clicks}</span>
                </td>
                <td>
                    <button class="copy-btn" data-url="${shortFullURL}">Copy</button>
                </td>
            </tr>
        `;
    }

    // small helper to escape HTML when injecting original_url
    function escapeHtml(text) {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Load entire analytics table from backend
    function loadAnalytics() {
        $.getJSON("/api/analytics", function (data) {
            const tbody = $("#analytics-table tbody");
            tbody.empty();

            data.forEach(link => {
                tbody.append(buildRow(link));
            });
            // No need to bind copy/click handlers here because we use delegation below
        });
    }

    // ==========================
    // 3) Copy-to-clipboard (delegated)
    // - This never touches backend or increments clicks
    // ==========================
    $("#analytics-table").on("click", ".copy-btn", function (e) {
        e.preventDefault();
        const url = $(this).data("url");
        // Use clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                // simple feedback; you can replace with nicer toast/modal
                alert("Copied to clipboard:\n" + url);
            }).catch(err => {
                console.error("Clipboard write failed:", err);
                // fallback: try execCommand (older browsers)
                const $temp = $("<input>");
                $("body").append($temp);
                $temp.val(url).select();
                try {
                    document.execCommand("copy");
                    alert("Copied to clipboard (fallback):\n" + url);
                } catch (ex) {
                    alert("Copy failed - please copy manually:\n" + url);
                }
                $temp.remove();
            });
        } else {
            // fallback for very old browsers
            const $temp = $("<input>");
            $("body").append($temp);
            $temp.val(url).select();
            try {
                document.execCommand("copy");
                alert("Copied to clipboard (fallback):\n" + url);
            } catch (ex) {
                alert("Copy failed - please copy manually:\n" + url);
            }
            $temp.remove();
        }
    });


    // ==========================
    // 4) Click handling (same-tab quick feedback)
    // - IMPORTANT: Do NOT send POST to backend here.
    // - Backend will increment when the browser actually follows the short URL (redirect route).
    // - We only optimistically update the UI here to give instant feedback.
    // ==========================
    $("#analytics-table").on("click", ".short-link", function (e) {
        // We DO NOT preventDefault. Let browser navigate.
        // But provide instant visual feedback in current page (if user stays).
        const $tr = $(this).closest("tr");
        const $count = $tr.find(".click-count");
        const $bar = $tr.find(".bar");

        // Parse current value safely
        let current = parseInt($count.text(), 10);
        if (isNaN(current)) current = 0;

        // Optimistically increment UI by 1 (no POST)
        const newVal = current + 1;
        $count.text(newVal);
        $bar.css("width", Math.min(newVal * 10, 200) + "px");

        // Do NOT send any AJAX POST here. The backend will record the click via redirect.
        // Polling (below) will fetch the authoritative value within 1 second and sync UI.
        // We intentionally don't use e.preventDefault(); allow navigation.
    });


    // ==========================
    // 5) Polling for real-time updates (1 second)
    // - This only fetches analytics and updates rows.
    // - It DOES NOT POST clicks, so it cannot double-count.
    // ==========================
    setInterval(function () {
        $.getJSON("/api/analytics", function (data) {
            data.forEach(link => {
                const tr = $(`#analytics-table tbody tr[data-code='${link.short_url}']`);
                if (tr.length) {
                    // Update only the row's UI to match backend canonical value
                    const $count = tr.find(".click-count");
                    const $bar = tr.find(".bar");

                    // If displayed value differs from backend, sync it (this prevents double-visual counts)
                    const displayed = parseInt($count.text(), 10);
                    if (isNaN(displayed) || displayed !== link.clicks) {
                        $count.text(link.clicks);
                        $bar.css("width", Math.min(link.clicks * 10, 200) + "px");
                    }
                } else {
                    // If row not found (new short url created elsewhere), append it
                    const tbody = $("#analytics-table tbody");
                    tbody.append(buildRow(link));
                }
            });
        });
    }, 1000); // 1000 ms = 1 second

    // Initial load
    loadAnalytics();
});
