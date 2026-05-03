export type Destination = {
  slug: string;
  region: "north" | "south" | "east" | "west" | "himalaya";
  heroImage: string;
};

export const destinations: Destination[] = [
  { slug: "delhi", region: "north", heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600" },
  { slug: "agra", region: "north", heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600" },
  { slug: "jaipur", region: "north", heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600" },
  { slug: "udaipur", region: "west", heroImage: "https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=1600" },
  { slug: "jaisalmer", region: "west", heroImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600" },
  { slug: "varanasi", region: "north", heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600" },
  { slug: "kerala", region: "south", heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600" },
  { slug: "ladakh", region: "himalaya", heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600" },
  { slug: "goa", region: "west", heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600" },
];
