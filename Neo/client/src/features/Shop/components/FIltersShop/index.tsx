"use client";
import { QueryKeys } from "@/constants/QueryKeys";
import { getAPi } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ShopCard } from "../../common/ShopCard";
import { useCart } from "@/Providers/CartProvider";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const FiltersShop = () => {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const [selectProductCategory, setSelectProductCategory] = useState("");
  const [selectProductColor, setSelectProductColor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectProductSize, setSelectProductSize] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 6;

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.products.All,
      selectProductCategory,
      selectProductColor,
      selectProductSize,
    ],
    queryFn: () =>
      getAPi(
        `/products?category=${selectProductCategory}&color=${selectProductColor}&size=${selectProductSize}`
      ),
  });

  const { data: ProductCatagories } = useQuery({
    queryKey: QueryKeys.products.categories,
    queryFn: () => getAPi("/products/categories"),
  });

  const { data: ProductColor } = useQuery({
    queryKey: QueryKeys.products.colors,
    queryFn: async () => getAPi("/products/colors"),
  });

  const { data: productSizes } = useQuery({
    queryKey: QueryKeys.products.sizes,
    queryFn: async () => getAPi("/products/sizes"),
  });

  const allProducts = data?.data || [];

  let filteredProducts = allProducts;

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const productsToShow = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const { addToCart } = useCart();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          className="w-20 h-10"
          src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"
          alt="Loading..."
        />
      </div>
    );

  return (
    <div className="container mx-auto mt-20 mb-20 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-3 col-span-12">
          <div className="flex flex-col gap-10">
            {/* Categories */}
            <div>
              <h4 className="text-[17px] font-semibold uppercase tracking-[0.34px] mb-5">
                Product categories
              </h4>
              <div className="flex flex-col gap-2 text-[16px] text-[#868686]">
                {ProductCatagories?.data?.map((item: any) => (
                  <button
                    onClick={() => {
                      setSelectProductCategory(item._id);
                      setPage(1);
                    }}
                    key={item._id}
                    className="text-start hover:text-black"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4 className="text-[17px] font-semibold uppercase tracking-[0.34px] mb-5">
                Filter by color
              </h4>
              <div className="flex flex-col gap-2 text-[16px] text-[#868686]">
                {ProductColor?.data?.map((item: any) => (
                  <button
                    onClick={() => {
                      setSelectProductColor(item._id);
                      setPage(1);
                    }}
                    key={item._id}
                    className="text-start hover:text-black"
                  >
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-[17px] font-semibold uppercase tracking-[0.34px] mb-5">
                Filter by size
              </h4>
              <div className="flex flex-col gap-2 text-[16px] text-[#868686]">
                {productSizes?.data?.map((item: any) => (
                  <button
                    onClick={() => {
                      setSelectProductSize(item._id);
                      setPage(1);
                    }}
                    key={item._id}
                    className="text-start hover:text-black"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner */}
            <div className="w-[338px] md:w-full lg:w-full">
              <img
                className="object-cover w-full"
                src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/08/shop-banner-1024x690.jpg"
                alt=""
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-9 col-span-12">
          <p className="text-[16px] font-semibold uppercase tracking-[0.34px] mb-6">
            Showing 1 – {perPage} of {filteredProducts.length} results
          </p>

          {/* Search */}
          <div className="border flex items-center justify-between border-gray-300 overflow-hidden mb-8 w-[340px] md:w-full">
            <input
              type="text"
              id="search"
              placeholder="Search products..."
              className="w-full text-sm py-3 px-3 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              onClick={() => setSearchTerm(searchInput)}
              className="px-4 py-2.5 bg-black flex justify-center items-center text-white"
            >
              <Search />
            </button>
          </div>

          {/* Product Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[340px] md:w-full">
            {productsToShow.length > 0 ? (
              productsToShow.map((item: any) => (
                <ShopCard
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  catgerires={item.categories}
                  img={item.imageUrl}
                  addToCart={() => {
                    if (!user?.name) {
                      toast.error("Please login to add items to the cart");
                      return;
                    }
                    addToCart(item);
                    toast.success("Product added to cart");
                  }}
                />
              ))
            ) : (
              <div className="col-span-3 text-center">No products found</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="disabled:opacity-50"
              >
                <ChevronLeft size={20} strokeWidth={1.25} />
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="disabled:opacity-50"
              >
                <ChevronRight size={20} strokeWidth={1.25} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersShop;
