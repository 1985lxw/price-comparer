import unittest
import os
import requests

import sys
import os

# Add the parent directory (price-comparer) to sys.path so that Python can find the scrapers module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now you can import your modules
from scrapers.rapidTargetAPI import get_nearby_stores, search_by_keywords, get_product_details


from dotenv import load_dotenv
# Load environment variables (e.g., RAPIDAPI_KEY, RAPIDAPI_HOST)
load_dotenv(dotenv_path="./.env")  # Ensure the .env file is set correctly

class TestScraper(unittest.TestCase):

    # Test for get_nearby_stores (real API call)
    def test_get_nearby_stores(self):
        zip_code = '01002'  # Example zip code
        stores = get_nearby_stores(zip_code)

        # Assertions to check if we got the expected structure
        self.assertIsInstance(stores, list)
        if stores:
            self.assertIn('status', stores[0])
            self.assertIn('store_id', stores[0])
            self.assertIn('address', stores[0])
            
        self.assertEqual(len(stores), 1)
        self.assertEqual(stores[0]['status'], 'Open')
        self.assertEqual(stores[0]['store_id'], '1839')
        self.assertEqual(stores[0]['address'], '367 Russell St, Hadley, Massachusetts, 01035-9456')

    # Test for search_by_keywords (real API call)
    def test_search_by_keywords(self):
        keywords = 'paper towels'  # Example search keyword
        store_id = '1839'  # Example store ID
        products = search_by_keywords(keywords, store_id)

        # Assertions to check if we got the expected structure
        self.assertIsInstance(products, list)
        if products:
            self.assertIn('tcin', products[0])
            self.assertIn('title', products[0])
            self.assertIn('buy_url', products[0])
            self.assertIn('formatted_current_price', products[0])

        self.assertEqual(len(products), 24)

    # Test for get_product_details (real API call)
    def test_get_product_details(self):
        tcin = '83935763'  # Example product TCIN
        store_id = '1839'  # Example store ID
        product_details = get_product_details(tcin, store_id)

        # Assertions to check if we got the expected structure
        self.assertIn('product', product_details)
        self.assertIn('price', product_details)
        self.assertIn('formatted_current_price', product_details['price'])

        self.assertEqual(len(product_details), 2)

    # Test if environment variables are correctly loaded
    def test_api_keys(self):
        # Check if RAPIDAPI_KEY and RAPIDAPI_HOST are available in the environment
        self.assertIsNotNone(os.getenv("RAPIDAPI_KEY"), "RAPIDAPI_KEY is missing in .env")
        self.assertIsNotNone(os.getenv("RAPIDAPI_HOST"), "RAPIDAPI_HOST is missing in .env")

if __name__ == '__main__':
    unittest.main()
