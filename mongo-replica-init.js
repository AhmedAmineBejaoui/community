// Initializes a single-node replica set for MongoDB so Prisma can use transactions
// Runs automatically on first container start via /docker-entrypoint-initdb.d

try {
  const cfg = { _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] };
  // If a replica set is already configured, this will throw — ignore it
  rs.initiate(cfg);
  print("Replica set initialized: rs0");
} catch (e) {
  print(`Replica set init skipped: ${e}`);
}

