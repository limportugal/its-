<?php
// Simple test script to verify file uploads work
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<h1>Upload Test Results</h1>";

    if (isset($_FILES['test_file'])) {
        $file = $_FILES['test_file'];

        echo "<p>File uploaded:</p>";
        echo "<ul>";
        echo "<li>Name: " . htmlspecialchars($file['name']) . "</li>";
        echo "<li>Type: " . htmlspecialchars($file['type']) . "</li>";
        echo "<li>Size: " . $file['size'] . " bytes</li>";
        echo "<li>Temp file: " . htmlspecialchars($file['tmp_name']) . "</li>";
        echo "<li>Error: " . $file['error'] . "</li>";
        echo "</ul>";

        if ($file['error'] === UPLOAD_ERR_OK) {
            echo "<p style='color: green;'>✓ File upload successful!</p>";
        } else {
            echo "<p style='color: red;'>✗ File upload failed with error: " . $file['error'] . "</p>";
        }
    } else {
        echo "<p style='color: red;'>No file uploaded</p>";
    }
} else {
    echo "<h1>Test File Upload</h1>";
    echo "<form method='POST' enctype='multipart/form-data'>";
    echo "<input type='file' name='test_file' required>";
    echo "<button type='submit'>Upload</button>";
    echo "</form>";
}
?>