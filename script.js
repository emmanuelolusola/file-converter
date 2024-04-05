document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const output = document.getElementById("output");

    const file = fileInput.files[0];
    if (!file) {
      output.innerHTML = "<p>Please select a file.</p>";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(worksheet);
      output.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;

      // Store the JSON data for later use
      window.fileData = json;

      // Hide documentation
      document.getElementById("documentation").style.display = "none";
      // Show JSON output
      output.style.display = "block";
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });

document
  .getElementById("getRequestButton")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    const output = document.getElementById("output");
    const documentationDiv = document.getElementById("documentation");

    if (!window.fileData) {
      output.innerHTML = "<p>Please upload a file first.</p>";
      return;
    }

    // Generate documentation
    const documentation = generateDocumentation(window.fileData);
    documentationDiv.innerHTML = `<pre>${JSON.stringify(
      documentation,
      null,
      2
    )}</pre>`;

    // Hide JSON output
    output.style.display = "none";
    // Show documentation
    documentationDiv.style.display = "block";
  });

function generateDocumentation(data) {
  const documentation = {};

  for (let key in data[0]) {
    const type = typeof data[0][key];
    documentation[key] = type;
  }

  return documentation;
}
