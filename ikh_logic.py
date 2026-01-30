import hashlib

class IKH:
    def __init__(self):
        # Pre-calculated digits for pi, e, and phi (simplified for educational use)
        # In a real scenario, these could be longer or calculated on the fly.
        self.pi_digits = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5]
        self.e_digits = [2, 7, 1, 8, 2, 8, 1, 8, 2, 8, 4, 5, 9, 0, 4, 5, 2, 3, 5, 3, 6, 0, 2, 8, 7, 4, 7, 1, 3, 5, 2, 6]
        self.phi_digits = [1, 6, 1, 8, 0, 3, 3, 9, 8, 8, 7, 4, 9, 8, 9, 4, 8, 4, 8, 2, 0, 4, 5, 8, 6, 8, 3, 4, 3, 6, 5, 6]
        
        # Extend to 1000 digits if needed, but for now we'll repeat or use a generator
        # Let's use a simple repeating pattern for demonstration if input is long
        
    def get_digit(self, array, index):
        return array[index % len(array)]

    def compute_step(self, char, index):
        """
        Calculates (Code * pi) + (Index * e) + phi mod 257
        """
        i = index + 1
        code = ord(char.upper()) - ord('A') + 1
        pi_d = self.get_digit(self.pi_digits, index)
        e_d = self.get_digit(self.e_digits, index)
        phi_d = self.get_digit(self.phi_digits, index)
        
        raw_val = (code * pi_d) + (i * e_d) + phi_d
        mod_val = raw_val % 257
        
        return {
            "char": char,
            "code": code,
            "pi_digit": pi_d,
            "e_digit": e_d,
            "phi_digit": phi_d,
            "calculation": f"({code} * {pi_d}) + ({i} * {e_d}) + {phi_d}",
            "result": raw_val,
            "mod_257": mod_val,
            "index": i
        }

    def hash(self, text):
        """
        Generates a 64-character hex string based on IKH logic.
        To ensure a 256-bit output and avalanche effect, we use the IKH steps
        to seed a mixing process.
        """
        if not text:
            return "0" * 64
        
        # Educational implementation:
        # We start with a 32-byte state
        state = bytearray([0] * 32)
        
        for i, char in enumerate(text):
            step = self.compute_step(char, i)
            val = step["mod_257"] % 256
            
            # Mix the value into the state
            for j in range(32):
                # Spread the influence of val
                # val affects all bytes through different rotations
                mix_val = (val << (j % 8)) & 0xFF | (val >> (8 - (j % 8)))
                state[j] = (state[j] ^ mix_val)
            
            # Diffusion pass: each byte affects the next
            for _ in range(2): # Two passes for better spreading
                for j in range(32):
                    next_j = (j + 1) % 32
                    prev_j = (j - 1) % 32
                    # Mix current with neighbors
                    state[j] = (state[j] + state[prev_j]) % 256
                    state[j] = (state[j] ^ state[next_j])
                    # Bit-level diffusion
                    state[j] = ((state[j] << 3) & 0xFF) | (state[j] >> 5)
            
        # Convert to hex string
        return state.hex()

    def get_all_steps(self, text):
        return [self.compute_step(c, i) for i, c in enumerate(text)]

if __name__ == "__main__":
    ikh = IKH()
    print(f"Hash of 'ABC': {ikh.hash('ABC')}")
    print(f"Hash of 'ABD': {ikh.hash('ABD')}")
