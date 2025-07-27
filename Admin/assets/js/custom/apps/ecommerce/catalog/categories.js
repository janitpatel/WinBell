"use strict";

var KTAppEcommerceCategories = (function () {
    var tableElement, dataTable;

    // Delete row handler
    const handleDelete = () => {
        tableElement.querySelectorAll('[data-kt-ecommerce-category-filter="delete_row"]').forEach((btn) => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const row = e.target.closest("tr");
                const nameElement = row.querySelector('[data-kt-ecommerce-category-filter="category_name"]');
                const categoryName = nameElement ? nameElement.innerText : "this category";

                Swal.fire({
                    text: "Are you sure you want to delete " + categoryName + "?",
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
                            text: "You have deleted " + categoryName + "!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn fw-bold btn-primary" }
                        }).then(function () {
                            dataTable.row($(row)).remove().draw();
                        });
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: categoryName + " was not deleted.",
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
            tableElement = document.querySelector("#kt_ecommerce_category_table");
            if (!tableElement) return;

            // Initialize DataTable
            dataTable = $(tableElement).DataTable({
                info: false,
                order: [],
                pageLength: 10,
                columnDefs: [
                    { orderable: false, targets: [0, 2] } // 0 = checkbox, 2 = actions column
                ]
            }).on("draw", function () {
                handleDelete(); // re-bind on redraw
            });

            // Search
            const searchInput = document.querySelector('[data-kt-ecommerce-category-filter="search"]');
            if (searchInput) {
                searchInput.addEventListener("keyup", function (e) {
                    dataTable.search(e.target.value).draw();
                });
            }

            handleDelete(); // initial bind
        }
    };
})();

KTUtil.onDOMContentLoaded(function () {
    KTAppEcommerceCategories.init();
});
