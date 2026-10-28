import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { DropBanner } from "../components/drop/DropBanner";
import { ProductGrid } from "../components/product/ProductGrid";
import { PairOffer } from "../components/home/PairOffer";
import { getDrops } from "../lib/api";
import type { Drop } from "../lib/api";

export default function Home() {
  const { t } = useTranslation();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const drops = await getDrops();
        setDrops(drops);
      } catch (err) {
        console.error("Failed to fetch drops", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latestDrop = drops[0] ?? null;
  const catalog = drops.flatMap((drop) => drop.products ?? []);
  const products = latestDrop?.products || [];
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar overlay />

      {/* Coming soon hero */}
      <section className="relative h-svh min-h-140 w-full overflow-hidden">
        <img
          src="/images/hero1.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-8 md:px-8 md:pb-10 lg:px-[27px] lg:pb-12">
          <div className="max-w-xl space-y-3">
            <h1 className="whitespace-pre-line font-brand text-[clamp(1.75rem,4vw,2.45rem)] leading-[1.25] tracking-normal text-white select-none">
              {t("hero.title")}
            </h1>
            <p className="whitespace-pre-line font-body text-[15px] leading-snug tracking-[-0.07em] text-white md:text-[18px]">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      <DropBanner />

      {!loading && <PairOffer products={catalog} />}

      {/* Product section */}
      <section className="w-full bg-cream px-6 py-16 md:px-8 md:py-20 lg:px-[27px] lg:py-24">
        {loading ? (
          <div className="py-24 text-center">
            <span className="font-body text-sm tracking-[-0.04em] text-charcoal/50 animate-pulse">
              {t("home.loading")}
            </span>
          </div>
        ) : latestDrop && latestDrop.products ? (
          <div className="mx-auto flex w-full max-w-7xl flex-col">
            <header className="mb-10 border-b border-charcoal/15 pb-6 md:mb-12">
              <p className="mb-2 font-body text-[12px] lowercase tracking-[-0.04em] text-charcoal/50">
                {t("home.section_label")}
              </p>
              <h2 className="font-display text-2xl font-bold lowercase leading-none tracking-[-0.07em] text-charcoal md:text-[28px] lg:text-[32px]">
                {latestDrop.name}
              </h2>
              <p className="mt-3 max-w-md font-body text-[14px] leading-snug tracking-[-0.04em] text-charcoal/70">
                {t("home.section_sub")}
              </p>
            </header>

            <ProductGrid products={paginatedProducts} />

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-8 font-body text-[13px] tracking-[-0.04em] text-charcoal select-none md:mt-16">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="cursor-pointer lowercase text-charcoal/70 transition-opacity hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← {t("pagination.prev")}
                </button>
                <span className="text-charcoal/50 lowercase">
                  {t("pagination.page")} {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="cursor-pointer lowercase text-charcoal/70 transition-opacity hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {t("pagination.next")} →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-body text-sm tracking-[-0.04em] text-charcoal/60">
              {t("something.coming")}
            </p>
          </div>
        )}
      </section>

      {/* Quiet closer */}
      <section className="w-full bg-cream px-6 pb-20 pt-4 md:px-8 md:pb-24 lg:px-[27px]">
        <div className="mx-auto max-w-7xl border-t border-charcoal/15 pt-10">
          <p className="max-w-lg font-body text-[15px] leading-snug tracking-[-0.04em] text-charcoal/70 md:text-base">
            {t("home.closer")}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
