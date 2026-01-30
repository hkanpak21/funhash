This **Product Requirements Document (PRD)** outlines the development of an educational software tool based on your "İrrasyonel Konumsal Hash (İKH)" project. The goal is to transform the mathematical model into an interactive, visual platform for high school students to explore cryptography and blockchain.

---

# PRD: "IKH Explorer" - An Educational Blockchain Simulator

## 1. Project Overview
**IKH Explorer** is an interactive web-based application designed to visualize how irrational numbers ($\pi, e, \phi$) can be used to create a hash function and how those hashes secure a blockchain. The tool emphasizes the **"Avalanche Effect"** and **"Immutability."**

## 2. Target Audience
*   **High School Students:** Learning modular arithmetic, functions, and basic programming.
*   **Educators:** Looking for a visual aid to teach data security and blockchain logic.

---

## 3. Functional Requirements

### 3.1. Module 1: The Interactive Hashing Simulator
Users should be able to see the "black box" of hashing turned into a transparent process.
*   **Input:** Text field (A-Z characters).
*   **Real-time Table Generation:** As the user types, a table updates showing:
    *   Character $\rightarrow$ Numeric Code (A=1, B=2...).
    *   Corresponding digits of $\pi, e, \phi$ for that position.
    *   The calculation result: $(Code \times \pi) + (Index \times e) + \phi$.
    *   The Modulo result ($mod 257$).
*   **XOR Visualization:** An animation showing how the $Value_i$ is XORed with the previous hash to create the final digest.
*   **Final Output:** A 64-character Hexadecimal string.

### 3.2. Module 2: Avalanche Effect Analysis
*   **Side-by-Side Comparison:** Two input fields (e.g., "MARMARA" vs "MERMARA").
*   **Diff Highlighter:** Highlights which bits in the 256-bit string changed.
*   **Metrics Display:** Shows the "Hamming Distance" (number of changed bits) and the percentage of change (aiming for ~50%).

### 3.3. Module 3: Visual Blockchain Explorer
*   **Block Creation:** Users can add blocks to a chain by entering data (e.g., "Student Grade: 90").
*   **Chain Linking:** Each block displays:
    *   Index & Timestamp.
    *   Data.
    *   `Previous Hash` (linked visually with an arrow to the previous block).
    *   `Current Hash`.
*   **The "Tamper" Feature:** An "Edit" button on any block. 
    *   *Effect:* If a user changes data in Block 0, the Current Hash of Block 0 turns **RED**. 
    *   *Propagation:* Because Block 1 relies on Block 0’s hash, Block 1 also turns red, showing the "broken" chain.

---

## 4. Visual Layout & UI Requirements

### 4.1. The Hashing Workflow (Visualization)
To visualize the İKH math, the UI will use a **Flow Diagram**:
1.  **Input Node:** User types "ABC".
2.  **Transformation Node:** Three vertical tracks representing $\pi, e, \phi$.
3.  **Combiner Node:** A "Math Engine" animation showing the formula $(C \cdot \pi) + (I \cdot e) + \phi$.
4.  **The XOR Chain:** A horizontal zig-zag line showing the result of Block 1 mixing into Block 2, then Block 3.
5.  **Output Node:** The final Hex string appears with a "glow" effect.

### 4.2. The Blockchain Interface
*   **Visual Representation:** Rectangular "cards" for each block.
*   **Valid State:** Green border, connecting lines are solid.
*   **Invalid State:** Red border, connecting lines are "broken" or dashed.
*   **Detail View:** Clicking a block expands it to show the İKH table used to generate its specific hash.

---

## 5. Technical Specifications (Based on Project Document)

*   **Language:** Python (Backend Logic), React or Streamlit (Frontend).
*   **Constants:**
    *   Character Set: A-Z (Upper).
    *   Irrational Lists: Pre-loaded arrays for $\pi, e, \phi$ (up to 1000 digits).
    *   Modulo: 257.
    *   Output Format: SHA-256 style (64 hex characters).
*   **Deterministic Rule:** Ensure `Seed` remains constant so the same input always yields the same output.

---

## 6. User Experience (UX) Scenarios

### Scenario A: Observing the Avalanche Effect
1.  User enters "MARMARA" in Input A.
2.  User enters "MERMARA" in Input B.
3.  The system displays a **Bar Chart** showing that 126 bits out of 256 are different.
4.  **Tooltip explains:** "Even though only one letter changed, 49.2% of the hash is different. This is the Avalanche Effect!"

### Scenario B: Testing Immutability
1.  User creates a chain of 3 blocks: "Alice paid 10", "Bob paid 5", "Charlie paid 2".
2.  User clicks "Edit" on the first block and changes "10" to "100".
3.  **Visual Feedback:** An animation shows a "crack" appearing in the links between Block 1 $\rightarrow$ 2 and 2 $\rightarrow$ 3. The hashes update to show they no longer match the `Previous Hash` fields.

---

## 7. Success Metrics
*   **Educational Impact:** Users can correctly identify why a blockchain breaks after a manual edit.
*   **Performance:** Hash generation and table visualization should happen in < 200ms for inputs under 50 characters.
*   **Clarity:** 80% of test students should be able to explain that "Irrational numbers provide the 'random' but 'predictable' sequence needed for the hash."

---

## 8. Development Roadmap
1.  **Phase 1:** Build the İKH Python class (Logic).
2.  **Phase 2:** Create the "Step-by-Step" Hashing Table UI.
3.  **Phase 3:** Implement the Blockchain "Chain" logic and the visual "Tamper" alerts.
4.  **Phase 4:** Add the Avalanche Effect comparison dashboard.This **Product Requirements Document (PRD)** outlines the development of an educational software tool based on your "İrrasyonel Konumsal Hash (İKH)" project. The goal is to transform the mathematical model into an interactive, visual platform for high school students to explore cryptography and blockchain.

---

# PRD: "IKH Explorer" - An Educational Blockchain Simulator

## 1. Project Overview
**IKH Explorer** is an interactive web-based application designed to visualize how irrational numbers ($\pi, e, \phi$) can be used to create a hash function and how those hashes secure a blockchain. The tool emphasizes the **"Avalanche Effect"** and **"Immutability."**

## 2. Target Audience
*   **High School Students:** Learning modular arithmetic, functions, and basic programming.
*   **Educators:** Looking for a visual aid to teach data security and blockchain logic.

---

## 3. Functional Requirements

### 3.1. Module 1: The Interactive Hashing Simulator
Users should be able to see the "black box" of hashing turned into a transparent process.
*   **Input:** Text field (A-Z characters).
*   **Real-time Table Generation:** As the user types, a table updates showing:
    *   Character $\rightarrow$ Numeric Code (A=1, B=2...).
    *   Corresponding digits of $\pi, e, \phi$ for that position.
    *   The calculation result: $(Code \times \pi) + (Index \times e) + \phi$.
    *   The Modulo result ($mod 257$).
*   **XOR Visualization:** An animation showing how the $Value_i$ is XORed with the previous hash to create the final digest.
*   **Final Output:** A 64-character Hexadecimal string.

### 3.2. Module 2: Avalanche Effect Analysis
*   **Side-by-Side Comparison:** Two input fields (e.g., "MARMARA" vs "MERMARA").
*   **Diff Highlighter:** Highlights which bits in the 256-bit string changed.
*   **Metrics Display:** Shows the "Hamming Distance" (number of changed bits) and the percentage of change (aiming for ~50%).

### 3.3. Module 3: Visual Blockchain Explorer
*   **Block Creation:** Users can add blocks to a chain by entering data (e.g., "Student Grade: 90").
*   **Chain Linking:** Each block displays:
    *   Index & Timestamp.
    *   Data.
    *   `Previous Hash` (linked visually with an arrow to the previous block).
    *   `Current Hash`.
*   **The "Tamper" Feature:** An "Edit" button on any block. 
    *   *Effect:* If a user changes data in Block 0, the Current Hash of Block 0 turns **RED**. 
    *   *Propagation:* Because Block 1 relies on Block 0’s hash, Block 1 also turns red, showing the "broken" chain.

---

## 4. Visual Layout & UI Requirements

### 4.1. The Hashing Workflow (Visualization)
To visualize the İKH math, the UI will use a **Flow Diagram**:
1.  **Input Node:** User types "ABC".
2.  **Transformation Node:** Three vertical tracks representing $\pi, e, \phi$.
3.  **Combiner Node:** A "Math Engine" animation showing the formula $(C \cdot \pi) + (I \cdot e) + \phi$.
4.  **The XOR Chain:** A horizontal zig-zag line showing the result of Block 1 mixing into Block 2, then Block 3.
5.  **Output Node:** The final Hex string appears with a "glow" effect.

### 4.2. The Blockchain Interface
*   **Visual Representation:** Rectangular "cards" for each block.
*   **Valid State:** Green border, connecting lines are solid.
*   **Invalid State:** Red border, connecting lines are "broken" or dashed.
*   **Detail View:** Clicking a block expands it to show the İKH table used to generate its specific hash.

---

## 5. Technical Specifications (Based on Project Document)

*   **Language:** Python (Backend Logic), React or Streamlit (Frontend).
*   **Constants:**
    *   Character Set: A-Z (Upper).
    *   Irrational Lists: Pre-loaded arrays for $\pi, e, \phi$ (up to 1000 digits).
    *   Modulo: 257.
    *   Output Format: SHA-256 style (64 hex characters).
*   **Deterministic Rule:** Ensure `Seed` remains constant so the same input always yields the same output.

---

## 6. User Experience (UX) Scenarios

### Scenario A: Observing the Avalanche Effect
1.  User enters "MARMARA" in Input A.
2.  User enters "MERMARA" in Input B.
3.  The system displays a **Bar Chart** showing that 126 bits out of 256 are different.
4.  **Tooltip explains:** "Even though only one letter changed, 49.2% of the hash is different. This is the Avalanche Effect!"

### Scenario B: Testing Immutability
1.  User creates a chain of 3 blocks: "Alice paid 10", "Bob paid 5", "Charlie paid 2".
2.  User clicks "Edit" on the first block and changes "10" to "100".
3.  **Visual Feedback:** An animation shows a "crack" appearing in the links between Block 1 $\rightarrow$ 2 and 2 $\rightarrow$ 3. The hashes update to show they no longer match the `Previous Hash` fields.

---

## 7. Success Metrics
*   **Educational Impact:** Users can correctly identify why a blockchain breaks after a manual edit.
*   **Performance:** Hash generation and table visualization should happen in < 200ms for inputs under 50 characters.
*   **Clarity:** 80% of test students should be able to explain that "Irrational numbers provide the 'random' but 'predictable' sequence needed for the hash."

---

## 8. Development Roadmap
1.  **Phase 1:** Build the İKH Python class (Logic).
2.  **Phase 2:** Create the "Step-by-Step" Hashing Table UI.
3.  **Phase 3:** Implement the Blockchain "Chain" logic and the visual "Tamper" alerts.
4.  **Phase 4:** Add the Avalanche Effect comparison dashboard.