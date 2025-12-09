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



def search_by_keywords(keywords, store_id, output_file="search_results.json"):
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
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        data = {"raw_text": response.text}

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"✅ Search results saved to {output_file}")
    return data



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
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        data = {"raw_text": response.text}

    if output_file:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"✅ Product details saved to {output_file}")

    return data

# if __name__ == "__main__":
#     # Search for paper towels in store 1839
#     search_results = search_by_keywords("paper towels", 1839, "paper_towels.json")

#     # Get nearby stores in ZIP 01002
#     nearby_stores = get_nearby_stores("01002", output_file="amherst_stores.json")
    # tcin_example = "83935763"
    # store_id_example = "3207"

    # product_data = get_product_details(tcin_example, store_id_example, "product_83935763.json")