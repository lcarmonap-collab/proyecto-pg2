import { ProductoresTable } from '@/features/productores/ProductoresTable';

export default function ProductoresPage() {

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-maga-greenDark">
          Productores
        </h1>

        <p className="text-slate-500">
          Administración de agricultores registrados en SICA-MAGA.
        </p>

      </div>

      <ProductoresTable />

    </div>
  );
}
