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

"""
    Fetch nearby stores from Target API by zip_code.
    Only returns the stores within a 10 mile radius.

    Parameters:
        zip_code (int): zip code
        count_limit (int): Limit the number of store results, hardcoded
        radius_miles (int): stores within a radius, hardcoded
        output_file (str): JSON file to save the products

    Returns:
        list: List of stores (dicts)
"""
def get_nearby_stores(zip_code, count_limit=20, radius_miles=10, output_file="nearby_stores.json"):
    url = "https://target13.p.rapidapi.com/nearbyStores"
    querystring = {
        "zip_code": str(zip_code),
        "count_limit": str(count_limit),
        "radius_miles": str(radius_miles)
    }

    response = requests.get(url, headers=HEADERS, params=querystring)
    print(f"Nearby Stores STATUS: {response.status_code}")

    isJSON = 0

    try:
        data = response.json()
        isJSON = 1
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        data = {"raw_text": response.text}

    try:
        data = response.json()
        isJSON = 1
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        data = {"raw_text": response.text}

    # Extract the correct fields from JSON response
    extracted_stores = []
    if (isJSON == 1):
        search = data.get("nearby_stores", {})
        stores = search.get("stores", [])
    

        for store in stores:
            status = store.get("status", "")
            store_id = store.get("store_id", "")
            mailing_address = store.get("mailing_address", {})
            address_line = mailing_address.get("address_line1", "")
            city = mailing_address.get("city", "")
            state = mailing_address.get("state", "")
            postal_code = mailing_address.get("postal_code","")
            address = address_line + ", " + city + ", " + state + ", " + postal_code
            
        
            extracted_stores.append({
                "status": status,
                "store_id": store_id,
                "address": address,
            })
    else:
        extracted_stores = data
    
    # Optionally, save to an output file
    if output_file:
        with open(output_file, "w") as file:
            import json
            json.dump(extracted_stores, file, indent=4)
    
    return extracted_stores



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

    isJSON = 0

    try:
        data = response.json()
        isJSON = 1
    except ValueError:
        print("⚠️ Response is not valid JSON, saving raw text instead")
        data = {"raw_text": response.text}

    # Extract the correct fields from JSON response
    extracted_products = []
    if (isJSON == 1):
        search = data.get("search", {})
        products = search.get("products", [])
    

        for product in products:
            tcin = product.get("tcin", "")
            item = product.get("item", {})
            buy_url = item.get("enrichment", {}).get("buy_url", "")
            title = item.get("product_description", {}).get("title", "")
            formatted_current_price = product.get("price", {}).get("formatted_current_price", "")
        
            extracted_products.append({
                "tcin": tcin,
                "buy_url": buy_url,
                "title": title,
                "formatted_current_price": formatted_current_price
            })
    else:
        extracted_products = data
    
    # Optionally, save to an output file
    if output_file:
        with open(output_file, "w") as file:
            import json
            json.dump(extracted_products, file, indent=4)

    return extracted_products



"""
    Fetch product details from Target API and extract only product & price.

    Parameters:
        tcin (str or int): Target product identifier
        store_id (str or int): Target store ID

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
    except ValueError:
        return {"error": "Response not valid JSON", "raw": response.text}

    # Extract correct fields
    product = data.get("product", {})
    price = product.get("price", {})
    filtered_product = {"tcin": product.get("tcin")} if "tcin" in product else {}


    return {
        "product": filtered_product,
        "price": price
    }
