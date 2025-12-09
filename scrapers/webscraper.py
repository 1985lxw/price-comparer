<<<<<<< HEAD
# mock_web_scraper.py
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client


def get_supabase_client() -> Client:
    load_dotenv()  # load .env

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. "
            "Set them in a .env file or environment variables."
        )

    return create_client(url, key)


def load_mock_data(json_path: str) -> dict:
    path = Path(json_path)
    if not path.exists():
        raise FileNotFoundError(f"Mock data file not found: {json_path}")

    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def upsert_table(supabase: Client, table: str, rows: list[dict]) -> None:
    """
    Upsert rows into a table.
    Uses primary key as conflict target (Supabase default).
    """
    if not rows:
        print(f"[{table}] no rows to upsert, skipping.")
        return

    print(f"[{table}] upserting {len(rows)} rows...")
    response = supabase.table(table).upsert(rows).execute()

    if hasattr(response, "error") and response.error:
        raise RuntimeError(f"Error upserting into {table}: {response.error}")
    else:
        print(f"[{table}] upsert complete.")


def main():
    supabase = get_supabase_client()

    # 1. "Scrape" → read from mock_data.json
    data = load_mock_data("mock_data.json")

    # 2. Insert in a foreign-key-safe order
    # users → products & stores → shopping_lists → shopping_list_items & prices
    upsert_table(supabase, "users", data.get("users", []))
    upsert_table(supabase, "products", data.get("products", []))
    upsert_table(supabase, "stores", data.get("stores", []))
    upsert_table(supabase, "shopping_lists", data.get("shopping_lists", []))
    upsert_table(
        supabase, "shopping_list_items", data.get("shopping_list_items", [])
    )
    upsert_table(supabase, "prices", data.get("prices", []))

    print("✅ Mock data load complete.")


if __name__ == "__main__":
    main()



'''import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
=======
import json
import os
from pathlib import Path
>>>>>>> 86ca49ac10e9e7d23d0d03ec3b5a65e34e4ade2b

from dotenv import load_dotenv
from supabase import create_client, Client


def get_supabase_client() -> Client:
    load_dotenv()  # load .env

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. "
            "Set them in a .env file or environment variables."
        )

    return create_client(url, key)


def load_mock_data(json_path: str) -> dict:
    path = Path(json_path)
    if not path.exists():
        raise FileNotFoundError(f"Mock data file not found: {json_path}")

    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def upsert_table(supabase: Client, table: str, rows: list[dict]) -> None:
    """
    Upsert rows into a table.
    Uses primary key as conflict target (Supabase default).
    """
    if not rows:
        print(f"[{table}] no rows to upsert, skipping.")
        return

    print(f"[{table}] upserting {len(rows)} rows...")
    response = supabase.table(table).upsert(rows).execute()

    if hasattr(response, "error") and response.error:
        raise RuntimeError(f"Error upserting into {table}: {response.error}")
    else:
        print(f"[{table}] upsert complete.")


def main():
    supabase = get_supabase_client()

    # 1. "Scrape" → read from mock_data.json
    data = load_mock_data("mock_data.json")

    # 2. Insert in a foreign-key-safe order
    # users → products & stores → shopping_lists → shopping_list_items & prices
    upsert_table(supabase, "users", data.get("users", []))
    upsert_table(supabase, "products", data.get("products", []))
    upsert_table(supabase, "stores", data.get("stores", []))
    upsert_table(supabase, "shopping_lists", data.get("shopping_lists", []))
    upsert_table(
        supabase, "shopping_list_items", data.get("shopping_list_items", [])
    )
    upsert_table(supabase, "prices", data.get("prices", []))

    print("✅ Mock data load complete.")


if __name__ == "__main__":
<<<<<<< HEAD
    data = scrape_prices("eggs")
    df = pd.DataFrame(data)
    print(df)
    df.to_csv("grocery_prices.csv", index=False)
    time.sleep(2)  # polite delay between requests''''
=======
    main()
# import requests
# from bs4 import BeautifulSoup
# import pandas as pd
# import time

# def scrape_prices(query):
#     # Replace with a real store search URL pattern
#     url = f"https://examplegrocerystore.com/search?q={query}"
#     headers = {"User-Agent": "Mozilla/5.0"}  # helps avoid blocking
    
#     response = requests.get(url, headers=headers)
#     if response.status_code != 200:
#         print(f"Failed to fetch {url}")
#         return []

#     soup = BeautifulSoup(response.text, "html.parser")
#     products = []
    
#     for item in soup.select(".product-tile"):  # adjust selector
#         name = item.select_one(".product-title").get_text(strip=True)
#         price = item.select_one(".price").get_text(strip=True)
#         size = item.select_one(".size").get_text(strip=True) if item.select_one(".size") else "N/A"
        
#         products.append({"name": name, "price": price, "size": size})
    
#     return products

# if __name__ == "__main__":
#     data = scrape_prices("eggs")
#     df = pd.DataFrame(data)
#     print(df)
#     df.to_csv("grocery_prices.csv", index=False)
#     time.sleep(2)  # polite delay between requests

>>>>>>> 86ca49ac10e9e7d23d0d03ec3b5a65e34e4ade2b
