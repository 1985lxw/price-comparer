import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_prices(query):
    # Replace with a real store search URL pattern
    url = f"https://examplegrocerystore.com/search?q={query}"
    headers = {"User-Agent": "Mozilla/5.0"}  # helps avoid blocking
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch {url}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    products = []
    
    for item in soup.select(".product-tile"):  # adjust selector
        name = item.select_one(".product-title").get_text(strip=True)
        price = item.select_one(".price").get_text(strip=True)
        size = item.select_one(".size").get_text(strip=True) if item.select_one(".size") else "N/A"
        
        products.append({"name": name, "price": price, "size": size})
    
    return products

if __name__ == "__main__":
    data = scrape_prices("eggs")
    df = pd.DataFrame(data)
    print(df)
    df.to_csv("grocery_prices.csv", index=False)
    time.sleep(2)  # polite delay between requests
