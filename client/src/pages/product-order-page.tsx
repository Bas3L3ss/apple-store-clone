import { memo, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import Summary from "../components/product/selection-step/summary";

import { checkIsNew } from "../lib/utils";
import { useProductConfiguration } from "../hooks/use-product-configuration";
import { CartInput, useCartStore } from "../store/useCartStore";
import { useAuth } from "../contexts/AuthContext";
import ProductBuyingHeader from "../components/product/product-header";
import ProductBuyingGallery from "../components/product/product-buying-gallery";
import ProductBuyingLeftSection from "../components/product/product-buying-left-section";
import ProductBuyingRightSection from "../components/product/product-buying-right-section";
import Title from "../components/reusable/title";
import RecommendationCarousel from "../components/product/recommendation";
import { toast } from "sonner";
import { useProductGetBySlug } from "../react-query-hooks/use-get-product-by-slug";
import GlobalLoader from "../components/global-loader";
import SEO from "../components/SEO";
import { cld } from "../lib/cld";

const MemoizedProductBuyingHeader = memo(ProductBuyingHeader);
const MemoizedProductBuyingGallery = memo(ProductBuyingGallery);
const MemoizedProductBuyingLeftSection = memo(ProductBuyingLeftSection);
const MemoizedRecommendationCarousel = memo(RecommendationCarousel);

const ProductOrderPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useProductGetBySlug(slug);

  const navigate = useNavigate();

  const { account } = useAuth();

  const { addItem } = useCartStore();

  const {
    handleSelect,
    selectedOptions,
    totalPrice,
    getLastStepSelected,
    isConfigurationComplete,
  } = useProductConfiguration(product);

  const configSectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // illusion, will find workaround
    document.title = `${product?.name ?? "Loading..."} - Buy Now | Apple Store`;
  }, [product]);

  if (isLoading)
    return (
      <>
        <GlobalLoader />;
      </>
    );
  if (error || !product) return <Navigate to="/not-found" />;

  const isNew = checkIsNew(product.createdAt);

  const isDone = getLastStepSelected() && isConfigurationComplete();

  const handleAddCart = () => {
    const cartOption: string[] = [];

    for (const opt of product.productOptions) {
      for (const [key, val] of Object.entries(selectedOptions)) {
        //@ts-expect-error: no prob
        if (opt[key] == val) {
          cartOption.push(opt._id);
        }
      }
    }
    const cartItem: CartInput = {
      selectedOptions: cartOption,
      totalPrice,
      productId: product._id,
      ...(account?._id && { userId: account._id }),
    };

    addItem(cartItem);

    toast.success("Added sucessfully", {
      description: "Go to cart",
      action: { label: "Go to cart", onClick: () => navigate("/cart") },
    });
  };

  return (
    <>
      {/* TODO: more dynamic SEO */}
      <SEO
        title={`${product.name} - Buy Now | Apple Store`}
        description={product.description}
        canonical={`https://apple-store.com/shop/${product.slug}`}
        image={
          cld
            .image(product.productImages?.[0])
            .format("auto")
            .quality("auto")
            .toURL() || "https://apple-store.com/default-image.jpg"
        }
        language="en"
        type="product"
        twitterCard="summary_large_image"
        twitterSite="@apple-store"
        twitterCreator="@apple-store"
        structuredData={{
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.productImages,
          brand: {
            "@type": "Brand",
            name: "Apple",
          },
          offers: {
            "@type": "Offer",
            price: product.basePrice,
            priceCurrency: "USD",
            availability: product.stock > 0 ? "InStock" : "OutOfStock",
            url: `https://apple-store.com/shop/${product.slug}`,
          },
        }}
      />
      {product.isFeatured && <h1 className="sr-only">featured product</h1>}
      <h2 className="sr-only">{product.name}</h2>
      <h3 className="sr-only">product ordering page</h3>
      <div className="min-h-screen bg-white">
        <MemoizedProductBuyingHeader
          handleAddCart={handleAddCart}
          isDone={isDone}
          productName={product.name}
          totalPrice={totalPrice}
        />
        <MemoizedProductBuyingGallery product={product} />
        <div
          ref={configSectionRef}
          className="container mx-auto px-4 md:px-8  "
        >
          <div className="flex flex-col lg:flex-row gap-8 py-12 relative">
            {/* Left Section (Sticky Product Info) */}
            <MemoizedProductBuyingLeftSection isNew={isNew} product={product} />

            {/* Right Section (Scrollable Configuration) */}
            <div className="lg:w-1/2">
              <div
                ref={configSectionRef}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-6">
                  Customize your {product.name}
                </h2>
                <ProductBuyingRightSection
                  product={product}
                  selectedOptions={selectedOptions}
                  handleSelect={handleSelect}
                />
              </div>
            </div>
          </div>

          {/* Summary section */}
          <section className="py-12 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">
              Your {product.name} Summary
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <Summary
                selectionOption={selectedOptions}
                product={product}
                totalPrice={totalPrice}
              />
              <div className="mt-6 flex justify-end">
                <Button
                  name="add-to-bag"
                  className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
                  disabled={!isDone}
                  onClick={handleAddCart}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Bag
                </Button>
              </div>
            </div>
          </section>

          {/* Recommendations section */}
        </div>
        <section className="py-12 border-t border-gray-200">
          <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
            <Title className="text-3xl font-semibold text-gray-900 mb-8">
              You May Also Like
            </Title>
            <MemoizedRecommendationCarousel
              amount={10}
              category={product.category}
            />
          </section>
        </section>
      </div>
    </>
  );
};

export default ProductOrderPage;
