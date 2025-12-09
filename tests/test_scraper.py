import unittest
from unittest.mock import patch
import json
from scrapers.rapidTargetAPI import search_by_keywords, get_nearby_stores, get_product_details
# run with python -m unittest test_scraper.py


class TestTargetAPI(unittest.TestCase):

    @patch("main.requests.get")
    def test_search_by_keywords(self, mock_get):
        # Mock response
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "search": {
                    "products": [
                        {"name": "Paper Towels", "price": 500}
                    ]
                }
            }
        }
        mock_get.return_value = mock_response

        products = search_by_keywords("paper towels", 1839, output_file=None)
        self.assertIsInstance(products, list)
        self.assertEqual(len(products), 1)
        self.assertIn("name", products[0])
        self.assertIn("price", products[0])

    @patch("main.requests.get")
    def test_get_nearby_stores(self, mock_get):
        # Mock response
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "stores": [
                    {"store_id": 1, "name": "Target Amherst", "zipcode": "01002"}
                ]
            }
        }
        mock_get.return_value = mock_response

        stores = get_nearby_stores("01002", output_file=None)
        self.assertIsInstance(stores, dict)
        self.assertIn("stores", stores.get("data", {}))

    @patch("main.requests.get")
    def test_get_product_details(self, mock_get):
        # Mock response
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "product": {
                    "product": {"name": "Paper Towels"},
                    "price": {"current_retail": 500}
                }
            }
        }
        mock_get.return_value = mock_response

        product = get_product_details("83935763", 3207, output_file=None)
        self.assertIsInstance(product, dict)
        self.assertIn("product", product)
        self.assertIn("price", product)
        self.assertEqual(product["product"]["name"], "Paper Towels")
        self.assertEqual(product["price"]["current_retail"], 500)

if __name__ == "__main__":
    unittest.main()
