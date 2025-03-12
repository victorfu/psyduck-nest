const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const fs = require("fs");
const { Command } = require("commander");
const program = new Command();

const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-adminsdk.json", "utf8"),
);

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`,
  });
}

// Define CLI commands
program
  .name("firebase-cli")
  .description("CLI tool for Firebase operations")
  .version("1.0.0");

program
  .command("get-user")
  .description("Get a user by UID")
  .argument("<uid>", "UID of the user to get")
  .action(async (uid) => {
    try {
      const user = await getAuth().getUser(uid);
      console.log(user.toJSON());
    } catch (error) {
      console.error("Error getting user:", error);
    }
  });

program
  .command("set-admin")
  .description("Set a user as admin")
  .argument("<uid>", "UID of the user to set as admin")
  .action(async (uid) => {
    try {
      let user = await getAuth().getUser(uid);
      const admin = user.customClaims["admin"];
      console.log(`${uid} is ${admin ? "admin" : "not admin"}`);
      if (!user) {
        console.error("User not found");
        return;
      }
      if (admin) {
        console.error("User is already admin");
        return;
      }
      await getAuth().setCustomUserClaims(uid, {
        admin: true,
      });
      user = await getAuth().getUser(uid);
      console.log("User set as admin", user.customClaims["admin"]);
    } catch (error) {
      console.error("Error setting user as admin:", error);
    }
  });

// Add more commands as needed

program.parse(process.argv);
