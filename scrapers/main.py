from rapidTargetAPI import search_by_keywords, get_nearby_stores, get_product_details

if __name__ == "__main__":
    #products = search_by_keywords("paper towels", 1839)
    #stores = get_nearby_stores("01002")
    product_info = get_product_details("83935763", 1839)

    #print(f"Found {len(products)} products")
    #print(f"Nearby stores: {len(stores)} stores")
    print("Product details:", product_info)