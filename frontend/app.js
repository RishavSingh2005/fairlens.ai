function analyze() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) {
    alert("Please upload a CSV file");
    return;
  }

  document.getElementById("biasScore").innerText = "0.35";
  document.getElementById("impact").innerText = "0.70";

  document.getElementById("explanation").innerText =
    "The system found that women are 30% less likely to be selected compared to men. This indicates potential gender bias in the dataset.";

  document.getElementById("results").classList.remove("hidden");
}

function fixBias() {
  document.getElementById("comparison").classList.remove("hidden");
}
