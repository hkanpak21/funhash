import streamlit as st
import pandas as pd
from ikh_logic import IKH
import time

# Page Config
st.set_page_config(page_title="IKH Explorer", layout="wide")

# Initialize IKH
ikh = IKH()

# Title and Description
st.title("🛡️ IKH Explorer: Educational Blockchain Simulator")
st.markdown("""
Welcome to the **IKH Explorer**! This tool visualizes how irrational numbers ($\pi, e, \phi$) create secure cryptographic hashes.
Explore the **Avalanche Effect** and **Immutability** foundations of blockchain.
""")

# Sidebar Navigation
module = st.sidebar.selectbox("Choose a Module", ["1. Hashing Simulator", "2. Avalanche Effect", "3. Visual Blockchain"])

if module == "1. Hashing Simulator":
    st.header("🔍 Module 1: Step-by-Step Hashing")
    st.write("Turn the 'black box' of hashing into a transparent process.")
    
    input_text = st.text_input("Enter text (A-Z):", "MARMARA").upper()
    
    if input_text:
        steps = ikh.get_all_steps(input_text)
        df_steps = pd.DataFrame(steps)
        
        # Rename columns for clarity
        df_steps.columns = [
            "Char", "Code (A=1)", "π Digit", "e Digit", "φ Digit", 
            "Calculation formula", "Raw Result", "Mod 257"
        ]
        
        st.subheader("Interactive Hashing Table")
        st.table(df_steps)
        
        if st.checkbox("Show XOR Mixing Process"):
            st.subheader("XOR Mixing Visualization")
            current_state = 0
            for i, row in df_steps.iterrows():
                val = row["Mod 257"]
                prev_state = current_state
                current_state = current_state ^ val
                st.markdown(f"""
                **Step {i+1}** (Char: `{row['Char']}`):  
                `State ({prev_state})` ⊕ `Step Result ({val})` → **`New State ({current_state})`**
                """)
                st.progress((i + 1) / len(df_steps))
                time.sleep(0.1)
        
        final_hash = ikh.hash(input_text)
        st.subheader("Final Digest (256-bit)")
        st.code(final_hash, language="text")
        
        st.info("💡 Each character is processed using irrational number digits corresponding to its position.")

elif module == "2. Avalanche Effect":
    st.header("⚡ Module 2: Avalanche Effect Analysis")
    st.write("See how a tiny change in input results in a massive change in the hash.")
    
    col1, col2 = st.columns(2)
    
    with col1:
        input1 = st.text_input("Input A:", "MARMARA").upper()
        hash1 = ikh.hash(input1)
        st.code(hash1, language="text")
        
    with col2:
        input2 = st.text_input("Input B:", "MERMARA").upper()
        hash2 = ikh.hash(input2)
        st.code(hash2, language="text")
        
    # Bit-level comparison
    b1 = bin(int(hash1, 16))[2:].zfill(256)
    b2 = bin(int(hash2, 16))[2:].zfill(256)
    
    diff_bits = [i for i, (bit1, bit2) in enumerate(zip(b1, b2)) if bit1 != bit2]
    distance = len(diff_bits)
    percentage = (distance / 256) * 100
    
    st.subheader("Metrics")
    m_col1, m_col2 = st.columns(2)
    m_col1.metric("Hamming Distance", f"{distance} bits")
    m_col2.metric("Change Percentage", f"{percentage:.2f}%")
    
    # Bar Chart for Avalanche
    st.subheader("Avalanche Comparison")
    chart_data = pd.DataFrame({
        "Metric": ["Same Bits", "Changed Bits"],
        "Count": [256 - distance, distance]
    })
    st.bar_chart(chart_data.set_index("Metric"))
    
    st.tooltip = f"Even though only one letter changed, {percentage:.2f}% of the hash is different. This is the Avalanche Effect!"
    st.info(f"💡 **Explanation:** {st.tooltip}")
    diff_html = ""
    for i, (bit1, bit2) in enumerate(zip(b1, b2)):
        if bit1 != bit2:
            diff_html += f'<span style="color:red; font-weight:bold;">{bit2}</span>'
        else:
            diff_html += f'<span>{bit2}</span>'
        if (i+1) % 64 == 0:
            diff_html += "<br>"
            
    st.markdown(f'<div style="font-family:monospace; word-break:break-all; background-color:#f0f2f6; padding:10px; border-radius:5px;">{diff_html}</div>', unsafe_allow_html=True)
    st.caption("Red bits represent changes from Input A's hash.")

elif module == "3. Visual Blockchain":
    st.header("⛓️ Module 3: Visual Blockchain")
    st.write("Understand how hashing secures a chain of blocks.")
    
    if 'chain' not in st.session_state:
        st.session_state.chain = [
            {"index": 0, "data": "Genesis Block", "prev_hash": "0"*64, "hash": ikh.hash("Genesis Block")},
            {"index": 1, "data": "Alice paid 10", "prev_hash": ikh.hash("Genesis Block"), "hash": ikh.hash("Alice paid 10" + ikh.hash("Genesis Block"))}
        ]

    def add_block(data):
        prev_block = st.session_state.chain[-1]
        prev_hash = prev_block["hash"]
        new_hash = ikh.hash(data + prev_hash)
        st.session_state.chain.append({
            "index": len(st.session_state.chain),
            "data": data,
            "prev_hash": prev_hash,
            "hash": new_hash
        })

    with st.form("add_block_form"):
        new_data = st.text_input("New Block Data:")
        submit = st.form_submit_button("Add Block")
        if submit:
            add_block(new_data)
            st.rerun()

    # Blockchain visualization
    for i, block in enumerate(st.session_state.chain):
        # Calculate current valid hash for comparison
        recalc_hash = ikh.hash(block["data"] + block["prev_hash"])
        
        # A block is invalid if its stored hash doesn't match its data + prev_hash
        # OR if its prev_hash doesn't match the actual hash of the previous block
        is_tampered = block["hash"] != recalc_hash
        is_broken = False
        if i > 0:
            is_broken = block["prev_hash"] != st.session_state.chain[i-1]["hash"]
        
        is_valid = not is_tampered and not is_broken
        
        status_color = "#d4edda" if is_valid else "#f8d7da"
        border_color = "#28a745" if is_valid else "#dc3545"
        
        with st.container():
            st.markdown(f"""
            <div style="border: 2px solid {border_color}; border-radius: 10px; padding: 15px; background-color: {status_color}; margin-bottom: 10px;">
                <h4 style="margin:0;">Block #{block['index']} {"✅" if is_valid else "❌"}</h4>
                <hr style="margin:10px 0;">
                <p><b>Data:</b> {block['data']}</p>
                <p style="font-size: 0.8em; word-break: break-all; margin:0;"><b>Previous Hash:</b> <span style="color:{'red' if is_broken else 'inherit'}">{block['prev_hash']}</span></p>
                <p style="font-size: 0.8em; word-break: break-all; margin:0;"><b>Current Hash:</b> <span style="color:{'red' if is_tampered else 'inherit'}">{block['hash']}</span></p>
            </div>
            """, unsafe_allow_html=True)
            
            # Edit Feature
            if st.button(f"✏️ Edit Block {i}", key=f"edit_{i}"):
                st.session_state[f"editing_{i}"] = True
            
            if st.session_state.get(f"editing_{i}"):
                new_val = st.text_input("Modify Data:", value=block["data"], key=f"input_{i}")
                if st.button("Save Change", key=f"save_{i}"):
                    # Update data without updating hash to simulate tampering
                    block["data"] = new_val
                    st.session_state[f"editing_{i}"] = False
                    st.rerun()
            
            if not is_valid:
                if is_tampered:
                    st.error(f"⚠️ Block #{i} Tampered! Hash shown does not match data.")
                elif is_broken:
                    st.error(f"⚠️ Chain Broken! Previous Hash reference is invalid.")

    if st.button("Reset Blockchain"):
        del st.session_state.chain
        st.rerun()
