// Export visible customer table data as CSV
document.addEventListener('DOMContentLoaded', function () {
    var exportBtn = document.getElementById('exportCustomersBtn');
    if (!exportBtn) return;
    exportBtn.addEventListener('click', function () {
        var table = document.querySelector('table.table');
        if (!table) return;
        var rows = Array.from(table.querySelectorAll('tr'));
        var csv = [];
        rows.forEach(function (row) {
            // Only export visible rows
            if (row.offsetParent === null) return;
            var cols = Array.from(row.querySelectorAll('th,td'));
            var rowData = cols.map(function (col) {
                // Remove inner button/icon text
                return '"' + (col.innerText || '').replace(/\n/g, ' ').replace(/"/g, '""').trim() + '"';
            });
            csv.push(rowData.join(','));
        });
        var csvContent = csv.join('\n');
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'customers_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
// Remove modal validation and directly call export_patch.js logic for modal export button
document.addEventListener('DOMContentLoaded', function () {
    var exportBtn = document.getElementById('kt_customers_export_submit');
    if (exportBtn) {
        exportBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Call the export logic from export_patch.js
            if (window && window.dispatchEvent) {
                var evt = new Event('export_customers_modal');
                window.dispatchEvent(evt);
            }
        });
    }
});