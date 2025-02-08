export interface Products {
    _id: string;
    name: string;
    product: string;
    _type: "products";
    image?: {
      asset: {
        _ref: string;
        _type: "image";
      };
    };
    price: number;
    description: string;
    colors?: string[];
    sizes?: string[];
    category?: "tshirt" | "short" | "jeans" | "hoodie" | "shirt";
    slug: { current: string };
    slugCurrent: any;
    discountPercent: number;
    quantity: number;
  }
  