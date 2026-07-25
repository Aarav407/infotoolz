import AdminPageClient from "@/components/AdminPageClient";
import { getEditableProducts } from "@/lib/import-product";

export const dynamic = "force-dynamic";

export default function AdminUploadPage() {
  return <AdminPageClient initialProducts={getEditableProducts()} />;
}
