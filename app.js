const express = require("express");
const path = require("path");
const ytdl = require("ytdl-core");
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Handle GET request for video download
app.get("/download", async (req, res) => {
  const youtubeLink = req.query.youtubeLink;
  try {
    if (!ytdl.validateURL(youtubeLink)) {
      throw new Error("Invalid YouTube link");
    }

    // Get video info
    const info = await ytdl.getInfo(youtubeLink);
    let videoTitle = "video"; // Default name if title is unavailable
    if (info.videoDetails && info.videoDetails.title) {
      videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, ""); // Remove special characters
    }

    // Set response headers for video download
    res.header(
      "Content-Disposition",
      `attachment; filename="${videoTitle}.mp4"`
    );
    res.header("Content-Type", "video/mp4");

    // Pipe video stream with both video and audio formats to response
    ytdl(youtubeLink, { filter: "audioandvideo", quality: "highest" }).pipe(
      res
    );
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video. Please try again later.");
  }
});

// Handle non-existent routes
app.use((req, res) => {
  res.status(404).send('Route does not exist. <a href="/">Go back to home</a>');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
