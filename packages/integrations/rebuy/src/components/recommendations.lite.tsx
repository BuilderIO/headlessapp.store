import { useState, For, Show, useMetadata, onMount } from "@jsx-lite/core";

useMetadata({
  propTypes: [
    {
      name: "productId",
      required: true,
      type: "text",
      helperText:
        "Since we're using the recommended product API, we need to pass in a product on which to base the recommendations. You can find the Product Id in your Shopify Admin.",
    },
    {
      name: "apiKey",
      required: true,
      type: "text",
      helperText:
        "Your Rebuy API key, you can find it here: https://rebuyengine.com/api/v1/docs/keys",
    },
    {
      name: "limit",
      required: false,
      type: "number",
      helperText: "Number of products to display, the default is 10.",
    },
  ],
});

type RecommendedProductsProps = {
  productId: string;
  apiKey: string;
  limit: number;
};

export default function RecommendedProducts(props: RecommendedProductsProps) {
  const state = useState({
    loading: true,
    recommendedProducts: [] as any[],
    onClickAddToCart(variantId: string) {
      const formData = {
        items: [
          {
            id: variantId,
            quantity: 1,
          },
        ],
      };

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.items) {
            window.location.href = "/cart";
          }
          // add error handling
        });
    },

    getRebuyData() {
      const root = "https://rebuyengine.com/api/v1/products/recommended";
      const key = encodeURIComponent(
        props.apiKey ||
          "7MtCfkc53m2WYUmYjFHKT/uUCOTiPVTj99Mlrkvdx87gG1YpjirEoFQ9125Z8Oatfdim++nWgn85Qb5+uAqBOQ=="
      );
      const product = props.productId || "6100035469478";
      const limit = props.limit || 10;
      const rebuyUrl = `${root}?key=${key}&limit=${limit}&shopify_product_ids=${product}&metafields=yes`;

      fetch(rebuyUrl)
        .then((res) => res.json())
        .then((data) => {
          state.loading = false;
          const recommendedProducts = data?.data?.map((product: any) => {
            let reviewsAverage, reviewsCount;

            return {
              ...product,
              price: product.variants[0].price,
              reviewsAverage,
              reviewsCount,
            };
          });

          state.recommendedProducts = recommendedProducts || [];
        });
    },
  });

  onMount(() => {
    state.getRebuyData();
  });

  return (
    <div
      $name="rebuy-slider-container"
      css={{ margin: "10px", display: "flex", flexDirection: "column" }}
    >
      <div
        $name="slider-title"
        css={{
          textAlign: "center",
          color: "#535353",
          fontWeight: "bold",
          margin: "5px",
        }}
      >
        RECOMMENDED
      </div>
      <h3
        $name="slider-subtitle"
        css={{ textAlign: "center", fontSize: "24px" }}
      >
        Customers who bought this item also bought
      </h3>

      <div
        $name="slider-contents"
        css={{
          display: "flex",
          flexDirection: "row",
          position: "relative",
          scrollBehavior: "smooth",
          overflowY: "hidden",
          overflowX: "auto",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Show when={!state.loading && !state.recommendedProducts?.length}>
          <div
            $name="no-products-message"
            css={{ textAlign: "center", margin: "60px 0", width: "100%" }}
          >
            No products found
          </div>
        </Show>

        <For each={state.recommendedProducts}>
          {(product) => (
            <div
              $name="product-container"
              css={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                marginTop: "20px",
                width: "270px",
                alignItems: "stretch",
                marginRight: "15px",
                borderStyle: "solid",
                borderColor: "rgba(127, 127, 127, 0.16)",
                borderWidth: "1px",
                boxShadow: "0 1px 4px rgba(127, 127, 127, 0.11)",
                background: "#fff",
              }}
            >
              <img
                $name="product-image"
                css={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  position: "relative",
                  marginTop: "10px",
                  height: "180px",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                src={product.image.src}
              />
              <div
                $name="product-info"
                css={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  position: "relative",
                  marginTop: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <span
                  $name="product-price"
                  css={{
                    marginTop: "20px",
                    lineHeight: "normal",
                    height: "auto",
                    textAlign: "left",
                    color: "#365c42",
                    fontSize: "22px",
                  }}
                >
                  ${product.price}
                </span>
                <span
                  $name="product-title"
                  css={{
                    marginTop: "20px",
                    marginBottom: "15px",
                    lineHeight: "normal",
                    height: "auto",
                    textAlign: "left",
                    color: "rgba(76, 81, 84, 1)",
                    fontFamily: "Lato, sans-serif",
                    fontWeight: "400",
                  }}
                >
                  {product.title}
                </span>
              </div>
              <button
                $name="product-add-to-cart"
                css={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  paddingLeft: "25px",
                  paddingRight: "25px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "16px",
                  background: "#365c42",
                  margin: "10px",
                }}
                onClick={() => state.onClickAddToCart(product.variants[0].id)}
              >
                Add to Cart
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
