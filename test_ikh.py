import unittest
from ikh_logic import IKH

class TestIKH(unittest.TestCase):
    def setUp(self):
        self.ikh = IKH()

    def test_consistency(self):
        text = "MARMARA"
        h1 = self.ikh.hash(text)
        h2 = self.ikh.hash(text)
        self.assertEqual(h1, h2, "Hash should be deterministic")

    def test_different_inputs(self):
        h1 = self.ikh.hash("MARMARA")
        h2 = self.ikh.hash("MERMARA")
        self.assertNotEqual(h1, h2, "Different inputs should have different hashes")

    def test_avalanche_effect(self):
        h1 = self.ikh.hash("MARMARA")
        h2 = self.ikh.hash("MERMARA")
        
        # Convert hex to bits
        b1 = bin(int(h1, 16))[2:].zfill(256)
        b2 = bin(int(h2, 16))[2:].zfill(256)
        
        # Compute Hamming distance
        distance = sum(c1 != c2 for c1, c2 in zip(b1, b2))
        percentage = (distance / 256) * 100
        
        print(f"\nHamming Distance ('MARMARA' vs 'MERMARA'): {distance} bits ({percentage:.2f}%)")
        self.assertGreater(distance, 50, "Avalanche effect should be significant (at least 50 bits changed)")

    def test_empty_input(self):
        h = self.ikh.hash("")
        self.assertEqual(h, "0" * 64)

if __name__ == "__main__":
    unittest.main()
