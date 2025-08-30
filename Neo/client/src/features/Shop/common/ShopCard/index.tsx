"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import cloudinaryLoader from "@/features/common/BaseImageLoad";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductPreviewDialog } from "@/features/Home/common/ProductPreviewDialog";
import Link from "next/link";

export const ShopCard = ({
  img,
  name,
  price,
  catgerires,
  addToCart,
  id,
}: {
  img: string;
  price: number;
  name: string;
  addToCart: () => void;
  catgerires?: { name: string };
  id: any;
}) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);



  return (
    <>
      <Card
        className="cursor-pointer group w-full bg-[#f9f9f9]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardContent className="relative p-0">
          <div className="w-full h-52.5 overflow-hidden relative bg-white">
            <Image
              loader={cloudinaryLoader}
              src={img ?? ""}
              alt="Product"
              className="w-full h-full absolute inset-0 object-contain"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="pt-6 pb-10 text-center relative">
            <h3 className="text-[17px] font-semibold text-[#1c1c1c] mb-1.5 uppercase tracking-[0.34px]">
              <Link href={`/shops/${id}`}>{name}</Link>
            </h3>
            <p className="text-[16px] text-[#565656] mb-2">
              {catgerires?.name}
            </p>
            <p className={`text-[15px] font-medium text-[#1c1c1c] transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>{price}.00 $</p>
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center px-4 py-2 rounded-xl"
                >
                  <div className="px-5 py-1 border-r border-[#eee]">
                    <Heart size={17} strokeWidth={1} />
                  </div>
                  <div className="px-5 py-1 border-r border-[#eee]">
                    <ShoppingBag size={17} strokeWidth={1} onClick={addToCart} />
                  </div>
                  <div className="px-5 py-1">
                    <Eye
                      size={17}
                      strokeWidth={1}
                      onClick={() => setOpen(true)}
                      className="cursor-pointer"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      <ProductPreviewDialog
        id="product-preview-dialog"
        open={open}
        onOpenChange={setOpen}
        img={img}
        name={name}
        price={price}
        addToCart={addToCart}
      />
    </>
  );
};
