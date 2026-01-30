class IKH {
    constructor() {
        // Digits taken exactly from 'Adım 3' on page 3 of the report
        this.piDigits = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3];
        this.eDigits = [2, 7, 1, 8, 2, 8, 1, 8, 2, 8, 4, 5, 9, 0, 4, 5];
        this.phiDigits = [1, 6, 1, 8, 0, 3, 3, 9, 8, 8, 7, 4, 9, 8, 9, 4];
    }

    getDigit(array, index) {
        return array[index % array.length];
    }

    computeStep(char, index) {
        const i = index + 1;
        const code = char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        const piD = this.getDigit(this.piDigits, index);
        const eD = this.getDigit(this.eDigits, index);
        const phiD = this.getDigit(this.phiDigits, index);

        const rawVal = (code * piD) + (i * eD) + phiD;
        const modVal = rawVal % 257;

        return {
            char: char,
            code: code,
            piDigit: piD,
            eDigit: eD,
            phiDigit: phiD,
            calculation: `(${code} * ${piD}) + (${i} * ${eD}) + ${phiD}`,
            result: rawVal,
            mod257: modVal,
            index: i
        };
    }

    prepareText(text) {
        // Adım 1: Metnin Hazırlanması (Upper case, A-Z only)
        return text.toUpperCase().replace(/[^A-Z]/g, '');
    }

    async hash(text) {
        const cleanText = this.prepareText(text);
        if (!cleanText) return "0".repeat(64);

        // Adım 2 - 5: Harfleri Sayıya Çevirme, Formül ve Mod
        let values = [];
        for (let idx = 0; idx < cleanText.length; idx++) {
            const char = cleanText[idx];
            const step = this.computeStep(char, idx);
            values.push(step.mod257);
        }

        // Adım 6: XOR ile Zincirleme Karıştırma
        let finalXorSum = values[0];
        for (let i = 1; i < values.length; i++) {
            finalXorSum = finalXorSum ^ values[i];
        }

        // Adım 7: Sayıdan Hash Dizisine Geçiş (SHA-256)
        const msgBuffer = new TextEncoder().encode(finalXorSum.toString());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// App Instance
const ikh = new IKH();
let blockchain = [
    { index: 1, data: "Genesis Blok", prevHash: "0".repeat(64) }
];

// Initial hash needs to be handled
(async () => {
    blockchain[0].hash = await ikh.hash(blockchain[0].data + blockchain[0].prevHash);
})();

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
    const updateHashing = async () => {
        const text = hashInput.value;
        const cleanText = ikh.prepareText(text);
        const steps = [];
        for (let i = 0; i < cleanText.length; i++) {
            steps.push(ikh.computeStep(cleanText[i], i));
        }

        const tbody = document.querySelector('#steps-table tbody');
        tbody.innerHTML = steps.map(s => `
            <tr>
                <td>${s.index}</td>
                <td>${s.char}</td>
                <td>${s.code}</td>
                <td>${s.piDigit}</td>
                <td>${s.eDigit}</td>
                <td>${s.phiDigit}</td>
                <td>${s.calculation}</td>
                <td>${s.mod257}</td>
            </tr>
        `).join('');

        document.getElementById('final-hash').textContent = await ikh.hash(text);
    };
    hashInput.addEventListener('input', updateHashing);
    updateHashing();

    // Module 2: Avalanche Effect
    const avaInputA = document.getElementById('ava-input-a');
    const avaInputB = document.getElementById('ava-input-b');

    const hexToBin = (hex) => {
        return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    };

    const updateAvalanche = async () => {
        const hashA = await ikh.hash(avaInputA.value);
        const hashB = await ikh.hash(avaInputB.value);
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
    const renderBlockchain = async () => {
        const container = document.getElementById('blockchain-container');
        let chainIsValid = true;

        const cards = await Promise.all(blockchain.map(async (block, i) => {
            const recalcHash = await ikh.hash(block.data + block.prevHash);
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
        }));

        container.innerHTML = cards.join('');
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

    document.getElementById('add-block-btn').addEventListener('click', async () => {
        const data = document.getElementById('new-block-data').value || "Yeni Veri";
        const prevHash = blockchain[blockchain.length - 1].hash;
        const newBlock = {
            index: blockchain.length + 1,
            data: data,
            prevHash: prevHash,
            hash: await ikh.hash(data + prevHash)
        };
        blockchain.push(newBlock);
        document.getElementById('new-block-data').value = '';
        renderBlockchain();
    });

    document.getElementById('reset-chain-btn').addEventListener('click', async () => {
        blockchain = [{ index: 1, data: "Genesis Blok", prevHash: "0".repeat(64) }];
        blockchain[0].hash = await ikh.hash(blockchain[0].data + blockchain[0].prevHash);
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

    document.getElementById('start-fork-btn').addEventListener('click', async () => {
        if (forkActive) return;
        forkActive = true;
        document.getElementById('fork-explanation').style.display = 'block';

        // Initial state: both chains same for block 0
        const genesisHash = await ikh.hash("Genesis");
        honestChain = [{ hash: genesisHash, valid: true }];
        maliciousChain = [{ hash: genesisHash, valid: true }];

        let step = 0;
        const interval = setInterval(() => {
            step++;

            // Honest nodes add blocks consistently
            const hPrev = honestChain[honestChain.length - 1].hash;
            ikh.hash("Dürüst Blok " + step + hPrev).then(h => {
                honestChain.push({ hash: h, valid: true });
                renderFork();
            });

            // Malicious node tries to create a fork from block 1 by changing data
            if (step === 1) {
                // Change history at block 1
                ikh.hash("HACKED " + step).then(h => {
                    maliciousChain.push({ hash: h, valid: true });
                    renderFork();
                });
            } else if (step > 1) {
                // Malicious node tries to catch up but is slower or different
                const mPrev = maliciousChain[maliciousChain.length - 1].hash;
                ikh.hash("Saldırı Bloğu " + step + mPrev).then(h => {
                    maliciousChain.push({ hash: h, valid: true });
                    renderFork();
                });
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
