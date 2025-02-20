app.get("/download", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bucket = new GridFSBucket(db, { bucketName: "fs" });
    const downloadStream = bucket.openDownloadStreamByName(fileName);
    downloadStream.on("error", (err) => {
      console.log("Error during download:", err);
      return res.status(404).send("File not found");
    });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error connecting to database or downloading file:", err);
    res.status(500).send("Internal Server Error");
  }
});
