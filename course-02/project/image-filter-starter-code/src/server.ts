import express from "express";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Image filtering endpoint
  app.get("/filteredimage", async (req: Request, res: Response) => {
      const image_url: string = req.query.image_url;

      if (!image_url) {
        return res.status(422).send({
          success: false,
          message: "missing image_url parameter",
        });
      }

      let filteredpath: string = await filterImageFromURL(image_url);
      return res.sendFile(filteredpath, (err) => {
        deleteLocalFiles([filteredpath]);
      });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
