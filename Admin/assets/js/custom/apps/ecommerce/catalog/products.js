"use strict";

var KTAppEcommerceProducts = (function () {
    var t, e;

    // Delete Row Logic
    var handleDeleteRows = () => {
        t.querySelectorAll('[data-kt-ecommerce-product-filter="delete_row"]').forEach((btn) => {
            btn.addEventListener("click", function (event) {
                event.preventDefault();

                const row = event.target.closest("tr");
                let productNameElement = row.querySelector('[data-kt-ecommerce-product-filter="product_name"]');
                let productName = productNameElement ? productNameElement.innerText : "this product";

                Swal.fire({
                    text: "Are you sure you want to delete " + productName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted " + productName + "!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn fw-bold btn-primary" }
                        }).then(function () {
                            e.row($(row)).remove().draw();
                        });
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: productName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn fw-bold btn-primary" }
                        });
                    }
                });
            });
        });
    };

    return {
        init: function () {
            t = document.querySelector("#kt_ecommerce_products_table");
            if (t) {
                // Initialize DataTable
                e = $(t).DataTable({
                    info: false,
                    order: [],
                    pageLength: 10,
                    columnDefs: [
                        { orderable: false, targets: [0, 4] } // 0 = checkbox, 4 = actions
                    ]
                }).on("draw", function () {
                    handleDeleteRows(); // re-bind after table redraw
                });

                // Search Filter (Optional)
                const searchInput = document.querySelector('[data-kt-ecommerce-product-filter="search"]');
                if (searchInput) {
                    searchInput.addEventListener("keyup", function (event) {
                        e.search(event.target.value).draw();
                    });
                }

                // Category Filter (Optional)
                const categoryFilter = document.querySelector('[data-kt-ecommerce-product-filter=""]');
                if (categoryFilter) {
                    $(categoryFilter).on("change", function (event) {
                        let value = event.target.value;
                        if (value === "all") value = "";
                        e.column(3).search(value).draw(); // assuming category is column 3
                    });
                }

                // Bind delete row logic initially
                handleDeleteRows();
            }
        }
    };
})();

// Run after DOM is loaded
KTUtil.onDOMContentLoaded(function () {
    KTAppEcommerceProducts.init();
});
