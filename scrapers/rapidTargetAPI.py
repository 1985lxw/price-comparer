import json
import requests
import os
from dotenv import load_dotenv


load_dotenv(dotenv_path="./.env")  

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST")

if not RAPIDAPI_KEY or not RAPIDAPI_HOST:
    raise ValueError("⚠️ RAPIDAPI_KEY or RAPIDAPI_HOST not found in .env!")

HEADERS = {
	"x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
	"x-rapidapi-host": os.getenv("RAPIDAPI_HOST"),
}

def get_nearby_stores(zip_code, count_limit=20, radius_miles=10, output_file="nearby_stores.json"):
    url = "https://target13.p.rapidapi.com/nearbyStores"
    querystring = {
        "zip_code": str(zip_code),
        "count_limit": str(count_limit),
        "radius_miles": str(radius_miles)
    }

    response = requests.get(url, headers=HEADERS, params=querystring)
    print(f"Nearby Stores STATUS: {response.status_code}")

    try:
        data = response.json()
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        data = {"raw_text": response.text}

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"✅ Nearby stores saved to {output_file}")
    return data



"""
    Fetch products from Target API by keywords and store_id.
    Only returns the products inside data->search->products.

    Parameters:
        keywords (str): Search keywords
        store_id (str or int): Target store ID
        output_file (str): JSON file to save the products

    Returns:
        list: List of products (dicts)
"""
def search_by_keywords(keywords, store_id, output_file="products_only.json"):
    url = "https://target13.p.rapidapi.com/searchByKeywords"
    querystring = {
        "keywords": keywords,
        "store_id": str(store_id),
        "sort_by": "relevance",
        "include_sponsored": "false"
    }

    response = requests.get(url, headers=HEADERS, params=querystring)
    print(f"Search STATUS: {response.status_code}")

    try:
        data = response.json()
        products = data.get("data", {}).get("search", {}).get("products", [])
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        products = [{"raw_text": response.text}]

    # Save extracted products only
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=4, ensure_ascii=False)

    print(f"✅ Products saved to {output_file} (total: {len(products)})")
    return products



"""
    Fetch product details from Target API and extract only product & price.

    Parameters:
        tcin (str or int): Target product identifier
        store_id (str or int): Target store ID
        output_file (str): Optional filename to save JSON output

    Returns:
        dict: Extracted product and price info
"""
def get_product_details(tcin, store_id, output_file=None):
    url = "https://target13.p.rapidapi.com/productDetails"
    querystring = {
        "TCIN": str(tcin),
        "store_id": str(store_id)
    }

    response = requests.get(url, headers=HEADERS, params=querystring)
    print(f"Product Details STATUS: {response.status_code}")

    try:
        data = response.json()
        # Extract only data -> product -> product & data -> product -> price
        product_data = data.get("data", {}).get("product", {})
        extracted = {
            "product": product_data.get("product", {}),
            "price": product_data.get("price", {})
        }
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        extracted = {"raw_text": response.text}

    if output_file:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(extracted, f, indent=4, ensure_ascii=False)
        print(f"✅ Product details saved to {output_file}")

    return extracted

# if __name__ == "__main__":
#     tcin_example = "83935763"
#     store_id_example = "1839"
#     product_info = get_product_details(tcin_example, store_id_example, "product_83935763.json")
#     print(product_info)