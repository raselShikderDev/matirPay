import mongoose from "mongoose";
import app from "./app";
import { envVarriables } from "./app/configs/envVars.config";
import seedSuperAdmin from "./app/utils/seedSuperAdmin";

const PORT = envVarriables.PORT as string;

const startServer = async () => {
  // connecting MongoDB
  try {
    await mongoose.connect(envVarriables.MONGO_URI as string);
    if (envVarriables.NODE_ENV === "Development") {
      console.log(`Successfully connected with MongoDB`);
    }
  } catch (error) {
    if (envVarriables.NODE_ENV === "Development") {
      console.log(`Somthing wrong: ${error}`);
    }
    throw new Error("Something Wrong! Connecting with MongoDB has faild");
  }
  // Starting server
  try {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    if (envVarriables.NODE_ENV === "Development") {
      console.log(`Somthing wrong: ${error}`);
    }
    throw new Error("Something Wrong! Starting server has faild");
  }
};

(async function () {
  await startServer();
  await seedSuperAdmin();
})();
