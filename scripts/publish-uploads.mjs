/**
 * Stage uploaded catalog data + product photos so they can be committed
 * and pushed to the hosted website.
 *
 * Usage:
 *   npm run publish-uploads
 *   git commit -m "Add uploaded products"
 *   git push
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const root = process.cwd();
const localCatalog = path.join(root, "data/products.local.json");
const productsDir = path.join(root, "public/images/products");

if (!fs.existsSync(localCatalog)) {
  fs.mkdirSync(path.dirname(localCatalog), { recursive: true });
  fs.writeFileSync(
    localCatalog,
    JSON.stringify({ products: [], deletedSlugs: [] }, null, 2) + "\n"
  );
}

const local = JSON.parse(fs.readFileSync(localCatalog, "utf8"));
const uploadCount = Array.isArray(local.products) ? local.products.length : 0;

execSync("git add data/products.local.json", { stdio: "inherit", cwd: root });

if (fs.existsSync(productsDir)) {
  execSync("git add public/images/products", { stdio: "inherit", cwd: root });
}

console.log("");
console.log(`Prepared ${uploadCount} uploaded product(s) for publishing.`);
console.log("");
console.log("Next steps (keeps uploads forever on the hosted site):");
console.log('  1. git commit -m "Add uploaded products"');
console.log("  2. git push");
console.log("  3. Redeploy / restart your hosted website");
console.log("");
console.log("Until you push, uploads stay on this computer only.");
console.log("Deleting a product in Admin removes it after you publish again.");
