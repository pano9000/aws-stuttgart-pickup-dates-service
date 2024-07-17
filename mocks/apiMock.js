import { createServer } from "@mocks-server/main";
import awsAPIPickup from "./routes/awsAPIpickup.js"
import collections from "./collections.js";
const server = createServer();

await server.start()
const { loadRoutes, loadCollections } = server.mock.createLoaders();
loadRoutes(awsAPIPickup);
loadCollections(collections)

await server.mock.collections.select("ok");
