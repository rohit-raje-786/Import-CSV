import { Appwrite } from "appwrite";

const sdk = new Appwrite();

sdk
  .setEndpoint(process.env.REACT_APP_ENDPOINT) // Your Appwrite Endpoint
  .setProject(process.env.REACT_APP_PROJECT); // Your project ID

const account = sdk.account;
const database = sdk.database;

export { account, database };
