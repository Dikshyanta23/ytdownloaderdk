document
  .getElementById("youtubeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var youtubeLink = document.getElementById("youtubeLink").value;
    if (isValidYoutubeLink(youtubeLink)) {
      // Disable the download button
      document.getElementById("downloadBtn").disabled = true;
      // Display downloading message
      document.getElementById("downloadingMessage").textContent =
        "Your video is downloading...";

      // Make a GET request to the server with the YouTube link
      fetch(`/download?youtubeLink=${encodeURIComponent(youtubeLink)}`)
        .then((response) => {
          if (response.ok) {
            return response.blob(); // Convert response to blob
          } else {
            throw new Error("Network response was not ok.");
          }
        })
        .then((blob) => {
          // Create a temporary link element to trigger the download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "video.mp4"; // Set the filename
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url); // Release the object URL

          // Re-enable the download button
          document.getElementById("downloadBtn").disabled = false;
          // Clear downloading message
          document.getElementById("downloadingMessage").textContent = "";
          // Clear input field
          document.getElementById("youtubeLink").value = "";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          displayErrorMessage(
            "Error downloading video. Please try again later."
          );
          // Re-enable the download button on error
          document.getElementById("downloadBtn").disabled = false;
          // Clear downloading message on error
          document.getElementById("downloadingMessage").textContent = "";
        });
    } else {
      displayErrorMessage("Invalid YouTube link!");
    }
  });

function isValidYoutubeLink(link) {
  // Basic validation to check if the link contains "youtube.com" or "youtu.be"
  return link.includes("youtube.com") || link.includes("youtu.be");
}

function displayErrorMessage(message) {
  document.getElementById("errorMessage").textContent = message;
}
