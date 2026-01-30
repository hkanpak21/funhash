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
    { index: 1, data: "Genesis Blok", prevHash: "0".repeat(64) }
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
        document.getElementById('metric-distance').textContent = `${distance} bit`;
        document.getElementById('metric-percent').textContent = `%${percent}`;

        document.getElementById('bar-changed').style.width = `${percent}%`;
        document.getElementById('bar-same').style.width = `${100 - percent}%`;

        document.getElementById('bar-changed').querySelector('span').textContent = 'Değişen Bitler';
        document.getElementById('bar-same').querySelector('span').textContent = 'Aynı Bitler';

        document.getElementById('bit-diff').innerHTML = diffHtml;
    };
    avaInputA.addEventListener('input', updateAvalanche);
    avaInputB.addEventListener('input', updateAvalanche);
    updateAvalanche();

    // Module 3: Blockchain
    const renderBlockchain = () => {
        const container = document.getElementById('blockchain-container');
        let chainIsValid = true;

        container.innerHTML = blockchain.map((block, i) => {
            const recalcHash = ikh.hash(block.data + block.prevHash);
            const isSelfInvalid = block.hash !== recalcHash;

            // Propagation: if any previous block was invalid, this one is too
            let prevHashMatches = true;
            if (i > 0) {
                prevHashMatches = block.prevHash === blockchain[i - 1].hash;
            }

            if (isSelfInvalid || !prevHashMatches || !chainIsValid) {
                chainIsValid = false;
            }

            const displayValid = chainIsValid;

            return `
                <div class="block-card ${displayValid ? 'valid' : 'invalid'}">
                    <div class="block-header">
                        <h4>Blok #${block.index} ${displayValid ? '✅' : '❌'}</h4>
                        <button class="secondary mini" onclick="toggleEdit(${i})">✏️ Düzenle</button>
                    </div>
                    <div class="block-content">
                        <p><strong>Veri:</strong> ${block.data}</p>
                        <p class="hash-link ${!prevHashMatches ? 'alert' : ''}"><strong>Önceki Özet:</strong><br>${block.prevHash}</p>
                        <p class="hash-link ${isSelfInvalid ? 'alert' : ''}"><strong>Özet:</strong><br>${block.hash}</p>
                    </div>
                    <div id="edit-ui-${i}" class="edit-ui" style="display: none;">
                        <input type="text" id="edit-input-${i}" value="${block.data}">
                        <button onclick="saveEdit(${i})">Veriyi Güncelle</button>
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
        // In this simulation, we don't automatically fix the hash when "editing"
        // to show how it breaks the chain validation.
        renderBlockchain();
    };

    document.getElementById('add-block-btn').addEventListener('click', () => {
        const data = document.getElementById('new-block-data').value || "Yeni Veri";
        const prevHash = blockchain[blockchain.length - 1].hash;
        const newBlock = {
            index: blockchain.length + 1,
            data: data,
            prevHash: prevHash,
            hash: ikh.hash(data + prevHash)
        };
        blockchain.push(newBlock);
        document.getElementById('new-block-data').value = '';
        renderBlockchain();
    });

    document.getElementById('reset-chain-btn').addEventListener('click', () => {
        blockchain = [{ index: 1, data: "Genesis Blok", prevHash: "0".repeat(64) }];
        blockchain[0].hash = ikh.hash(blockchain[0].data + blockchain[0].prevHash);
        renderBlockchain();
    });

    // Module 4: Forking Attack Simulation
    let forkActive = false;
    let honestChain = [];
    let maliciousChain = [];

    const renderFork = () => {
        const visualizer = document.getElementById('fork-visualizer');

        const renderPath = (chain, label, type) => {
            return `
                <div class="fork-path ${type}">
                    <div class="fork-label">${label}</div>
                    ${chain.map((b, i) => `
                        <div class="fork-block ${b.valid ? 'valid' : 'invalid'}">
                            <b>Blok ${i + 1}</b><br>
                            <small>${b.hash.substring(0, 10)}...</small>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        visualizer.innerHTML = `
            ${renderPath(honestChain, "Dürüst Ağ (Mavi)", "honest")}
            ${renderPath(maliciousChain, "Saldırgan (Kırmızı)", "malicious")}
        `;
    };

    document.getElementById('start-fork-btn').addEventListener('click', () => {
        if (forkActive) return;
        forkActive = true;
        document.getElementById('fork-explanation').style.display = 'block';

        // Initial state: both chains same for block 0
        const genesisHash = ikh.hash("Genesis");
        honestChain = [{ hash: genesisHash, valid: true }];
        maliciousChain = [{ hash: genesisHash, valid: true }];

        let step = 0;
        const interval = setInterval(() => {
            step++;

            // Honest nodes add blocks consistently
            const hPrev = honestChain[honestChain.length - 1].hash;
            honestChain.push({ hash: ikh.hash("Dürüst Blok " + step + hPrev), valid: true });

            // Malicious node tries to create a fork from block 1 by changing data
            if (step === 1) {
                // Change history at block 1
                maliciousChain.push({ hash: ikh.hash("HACKED " + step), valid: true });
            } else if (step > 1) {
                // Malicious node tries to catch up but is slower or different
                const mPrev = maliciousChain[maliciousChain.length - 1].hash;
                maliciousChain.push({ hash: ikh.hash("Saldırı Bloğu " + step + mPrev), valid: true });
            }

            renderFork();

            if (step >= 6) {
                clearInterval(interval);
                forkActive = false;
            }
        }, 1000);
    });

    document.getElementById('reset-fork-btn').addEventListener('click', () => {
        honestChain = [];
        maliciousChain = [];
        document.getElementById('fork-visualizer').innerHTML = '';
        document.getElementById('fork-explanation').style.display = 'none';
        forkActive = false;
    });

    // Initial renders
    renderBlockchain();
    renderFork();
});
