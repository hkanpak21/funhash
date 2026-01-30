class IKH {
    constructor() {
        this.piDigits = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5];
        this.eDigits = [2, 7, 1, 8, 2, 8, 1, 8, 2, 8, 4, 5, 9, 0, 4, 5, 2, 3, 5, 3, 6, 0, 2, 8, 7, 4, 7, 1, 3, 5, 2, 6];
        this.phiDigits = [1, 6, 1, 8, 0, 3, 3, 9, 8, 8, 7, 4, 9, 8, 9, 4, 8, 4, 8, 2, 0, 4, 5, 8, 6, 8, 3, 4, 3, 6, 5, 6];
    }

    getDigit(array, index) {
        return array[index % array.length];
    }

    computeStep(char, index) {
        const code = char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        const piD = this.getDigit(this.piDigits, index);
        const eD = this.getDigit(this.eDigits, index);
        const phiD = this.getDigit(this.phiDigits, index);

        const rawVal = (code * piD) + (index * eD) + phiD;
        const modVal = rawVal % 257;

        return {
            char: char,
            code: code,
            piDigit: piD,
            eDigit: eD,
            phiDigit: phiD,
            calculation: `(${code} * ${piD}) + (${index} * ${eD}) + ${phiD}`,
            result: rawVal,
            mod257: modVal
        };
    }

    hash(text) {
        if (!text) return "0".repeat(64);

        let state = new Uint8Array(32);

        for (let i = 0; i < text.length; i++) {
            const step = this.computeStep(text[i], i);
            const val = step.mod257 % 256;

            for (let j = 0; j < 32; j++) {
                const mixVal = ((val << (j % 8)) | (val >>> (8 - (j % 8)))) & 0xFF;
                state[j] ^= mixVal;
            }

            for (let pass = 0; pass < 2; pass++) {
                for (let j = 0; j < 32; j++) {
                    const nextJ = (j + 1) % 32;
                    const prevJ = (j + 31) % 32;
                    state[j] = (state[j] + state[prevJ]) & 0xFF;
                    state[j] ^= state[nextJ];
                    state[j] = ((state[j] << 3) | (state[j] >>> 5)) & 0xFF;
                }
            }
        }

        return Array.from(state).map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// App Instance
const ikh = new IKH();
let blockchain = [
    { index: 0, data: "Genesis Block", prevHash: "0".repeat(64) }
];
blockchain[0].hash = ikh.hash(blockchain[0].data + blockchain[0].prevHash);

// UI Logic
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navItems = document.querySelectorAll('.nav-links li');
    const modules = document.querySelectorAll('.module');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const moduleId = item.getAttribute('data-module');
            navItems.forEach(n => n.classList.remove('active'));
            modules.forEach(m => m.classList.remove('active'));

            item.classList.add('active');
            document.getElementById(`${moduleId}-module`).classList.add('active');
            if (moduleId === 'blockchain') renderBlockchain();
        });
    });

    // Module 1: Hashing Simulator
    const hashInput = document.getElementById('hash-input');
    const updateHashing = () => {
        const text = hashInput.value;
        const steps = [];
        for (let i = 0; i < text.length; i++) {
            steps.push(ikh.computeStep(text[i], i));
        }

        const tbody = document.querySelector('#steps-table tbody');
        tbody.innerHTML = steps.map(s => `
            <tr>
                <td>${s.char}</td>
                <td>${s.code}</td>
                <td>${s.piDigit}</td>
                <td>${s.eDigit}</td>
                <td>${s.phiDigit}</td>
                <td>${s.calculation}</td>
                <td>${s.mod257}</td>
            </tr>
        `).join('');

        document.getElementById('final-hash').textContent = ikh.hash(text);
    };
    hashInput.addEventListener('input', updateHashing);
    updateHashing();

    // Module 2: Avalanche Effect
    const avaInputA = document.getElementById('ava-input-a');
    const avaInputB = document.getElementById('ava-input-b');

    const hexToBin = (hex) => {
        return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    };

    const updateAvalanche = () => {
        const hashA = ikh.hash(avaInputA.value);
        const hashB = ikh.hash(avaInputB.value);
        const binA = hexToBin(hashA);
        const binB = hexToBin(hashB);

        document.getElementById('ava-hash-a').textContent = hashA;
        document.getElementById('ava-hash-b').textContent = hashB;

        let distance = 0;
        let diffHtml = '';
        for (let i = 0; i < 256; i++) {
            if (binA[i] !== binB[i]) {
                distance++;
                diffHtml += `<span class="diff">${binB[i]}</span>`;
            } else {
                diffHtml += `<span>${binB[i]}</span>`;
            }
        }

        const percent = ((distance / 256) * 100).toFixed(2);
        document.getElementById('metric-distance').textContent = `${distance} bits`;
        document.getElementById('metric-percent').textContent = `${percent}%`;

        document.getElementById('bar-changed').style.width = `${percent}%`;
        document.getElementById('bar-same').style.width = `${100 - percent}%`;

        document.getElementById('bit-diff').innerHTML = diffHtml;
    };
    avaInputA.addEventListener('input', updateAvalanche);
    avaInputB.addEventListener('input', updateAvalanche);
    updateAvalanche();

    // Module 3: Blockchain
    const renderBlockchain = () => {
        const container = document.getElementById('blockchain-container');
        container.innerHTML = blockchain.map((block, i) => {
            const recalcHash = ikh.hash(block.data + block.prevHash);
            const isTampered = block.hash !== recalcHash;
            let isBroken = false;
            if (i > 0) isBroken = block.prevHash !== blockchain[i - 1].hash;

            const isValid = !isTampered && !isBroken;

            return `
                <div class="block-card ${isValid ? 'valid' : 'invalid'}">
                    <div class="block-header">
                        <h4>Block #${block.index} ${isValid ? '✅' : '❌'}</h4>
                        <button class="secondary mini" onclick="toggleEdit(${i})">✏️ Edit</button>
                    </div>
                    <div class="block-content">
                        <p><strong>Data:</strong> ${block.data}</p>
                        <p class="hash-link ${isBroken ? 'alert' : ''}"><strong>Prev Hash:</strong><br>${block.prevHash}</p>
                        <p class="hash-link ${isTampered ? 'alert' : ''}"><strong>Hash:</strong><br>${block.hash}</p>
                    </div>
                    <div id="edit-ui-${i}" class="edit-ui" style="display: none;">
                        <input type="text" id="edit-input-${i}" value="${block.data}">
                        <button onclick="saveEdit(${i})">Update Data</button>
                    </div>
                </div>
            `;
        }).join('');
    };

    window.toggleEdit = (i) => {
        const ui = document.getElementById(`edit-ui-${i}`);
        ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
    };

    window.saveEdit = (i) => {
        const val = document.getElementById(`edit-input-${i}`).value;
        blockchain[i].data = val;
        // deliberate: we DON'T update the hash to show tampering
        renderBlockchain();
    };

    document.getElementById('add-block-btn').addEventListener('click', () => {
        const data = document.getElementById('new-block-data').value || "New Data";
        const prevHash = blockchain[blockchain.length - 1].hash;
        const newBlock = {
            index: blockchain.length,
            data: data,
            prevHash: prevHash,
            hash: ikh.hash(data + prevHash)
        };
        blockchain.push(newBlock);
        document.getElementById('new-block-data').value = '';
        renderBlockchain();
    });

    document.getElementById('reset-chain-btn').addEventListener('click', () => {
        blockchain = [{ index: 0, data: "Genesis Block", prevHash: "0".repeat(64) }];
        blockchain[0].hash = ikh.hash(blockchain[0].data + blockchain[0].prevHash);
        renderBlockchain();
    });
});
