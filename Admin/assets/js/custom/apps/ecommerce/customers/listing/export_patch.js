// Patch for working CSV export for customers table


(function() {
    function getTableData() {
        var table = document.getElementById("kt_customers_table");
        if (!table) {
            alert("Customer table not found!");
            return [];
        }
        var data = [];
        var rows = table.querySelectorAll("tr");
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            for (var j = 0; j < cols.length; j++) {
                row.push(cols[j].innerText.trim());
            }
            if (row.length > 0) data.push(row);
        }
        return data;
    }

    function downloadCSV(data, filename) {
        if (!data || data.length === 0) {
            alert("No customer data to export!");
            return;
        }
        var csv = data.map(row => row.map(cell => '"' + cell.replace(/"/g, '""') + '"').join(",")).join("\n");
        var csvFile = new Blob([csv], {type: "text/csv"});
        var downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function downloadExcel(data, filename) {
        if (!data || data.length === 0) {
            alert("No customer data to export!");
            return;
        }
        var XLSX = window.XLSX;
        if (XLSX && XLSX.utils && XLSX.writeFile) {
            var ws = XLSX.utils.aoa_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Customers");
            XLSX.writeFile(wb, filename);
        } else {
            alert("Excel export requires XLSX library.");
        }
    }

    function downloadPDF(data, filename) {
        if (!data || data.length === 0) {
            alert("No customer data to export!");
            return;
        }
        var jsPDF = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : (window.jspdf ? window.jspdf : (window.jsPDF ? window.jsPDF : null));
        var autoTable = (window.jspdf && window.jspdf.autoTable) || (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API && window.jspdf.jsPDF.API.autoTable) || window.autoTable;
        if (jsPDF && autoTable) {
            var doc = new jsPDF();
            if (typeof doc.autoTable === 'function') {
                doc.autoTable({ head: [data[0]], body: data.slice(1) });
            } else if (typeof autoTable === 'function') {
                autoTable(doc, { head: [data[0]], body: data.slice(1) });
            }
            doc.save(filename);
        } else {
            alert("PDF export requires jsPDF and jsPDF-AutoTable libraries.");
        }
    }

    function doExportFromModal() {
        var formatSelect = document.querySelector('#kt_customers_export_modal select[name="format"]');
        var format = formatSelect ? formatSelect.value : 'csv';
        var data = getTableData();
        if (!data || data.length === 0) {
            alert("No customer data to export!");
            return;
        }
        if (format === 'csv') {
            downloadCSV(data, 'customers.csv');
        } else if (format === 'excel') {
            downloadExcel(data, 'customers.xlsx');
        } else if (format === 'pdf') {
            downloadPDF(data, 'customers.pdf');
        } else {
            alert('Unsupported export format!');
            return;
        }
        // Hide the modal after export
        var modalEl = document.getElementById('kt_customers_export_modal');
        if (modalEl && window.bootstrap && window.bootstrap.Modal) {
            var modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
            modal.hide();
        } else {
            // fallback for older Bootstrap
            $(modalEl).modal('hide');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // legacy: still support direct click for fallback
        var exportBtn = document.getElementById('kt_customers_export_submit');
        if (exportBtn) {
            exportBtn.addEventListener('click', function(e) {
                // fallback, do nothing (handled by event below)
            });
        }
    });

    // Listen for custom event from export.js
    window.addEventListener('export_customers_modal', function() {
        doExportFromModal();
    });
})();
