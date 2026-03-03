document.addEventListener('DOMContentLoaded', () => {
    const multiplierInput = document.getElementById('multiplier');
    const rowContainer = document.getElementById('row-container');
    const addRowBtn = document.getElementById('add-row-btn');
    const rowTemplate = document.getElementById('row-template');

    // 初期行を1つ追加
    addNewRow();

    // 掛け率が変更されたら全行を再計算
    multiplierInput.addEventListener('input', calculateAll);

    // 行追加ボタンの処理
    addRowBtn.addEventListener('click', () => {
        addNewRow(true); // 自動フォーカスありで追加
    });

    function addNewRow(focus = false) {
        // テンプレートから新しい行を複製
        const clone = rowTemplate.content.cloneNode(true);
        const newRow = clone.querySelector('.calc-row');
        
        const inputB = newRow.querySelector('.input-b');
        const btnDelete = newRow.querySelector('.btn-delete');

        // B入力欄の変更イベントでリアルタイム計算
        inputB.addEventListener('input', () => calculateRow(newRow));

        // Enterキーで次の行を追加するショートカット
        inputB.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // デフォルトの送信を防ぐ
                addNewRow(true);
            }
        });

        // 削除ボタンのイベント
        btnDelete.addEventListener('click', () => {
            newRow.remove();
            // 行がすべて消えた場合は新しい行を追加しておく
            if (rowContainer.children.length === 0) {
                addNewRow();
            }
        });

        rowContainer.appendChild(newRow);
        
        // 既存の掛け率があれば、追加時に即座に計算（空なら0など）
        calculateRow(newRow);
        
        // 新しい入力欄にフォーカスを当てる（スマホ等で連続入力しやすくする）
        if (focus) {
            inputB.focus();
        }
    }

    function calculateRow(row) {
        const inputB = row.querySelector('.input-b');
        const outputResult = row.querySelector('.output-result');
        
        const a = parseFloat(multiplierInput.value) || 0;
        const b = parseFloat(inputB.value);
        
        // 入力が空、または数値として不正な場合は出力欄を空にする
        if (isNaN(b) || inputB.value.trim() === '') {
            outputResult.value = '';
            return;
        }

        const result = a * b;
        // 浮動小数点計算の誤差を防ぎつつ表示（最大小数点第4位）
        outputResult.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
    }

    function calculateAll() {
        const rows = rowContainer.querySelectorAll('.calc-row');
        rows.forEach(row => calculateRow(row));
    }
});

// Service Workerの登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 同じディレクトリにあるsw.jsを登録する
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
