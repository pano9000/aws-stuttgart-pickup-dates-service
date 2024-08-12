//@ts-expect-error -- package does not provide types
import { createServer } from "@mocks-server/main";
import awsAPIRoutes from "./routes/awsAPIRoutes.js"
import collections from "./collections.js";
const server = createServer();
await server.start();
const { loadRoutes, loadCollections } = server.mock.createLoaders();

await loadRoutes(awsAPIRoutes);
await server.mock.collections.select("base");
await loadCollections(collections);





