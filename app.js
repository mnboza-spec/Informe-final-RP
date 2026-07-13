const app = {
    photoCount: 0,

    // --- INIT ---
    init() {
        this.addActivityRow();
        this.addMaterialRow();
        this.addAssetRow();
        this.addObservationRow();
        
        // Agregar las 3 fotos iniciales
        for(let i=0; i<3; i++) this.addPhotoCard();
    },

    // --- MANEJO DE TABLAS DINÁMICAS ---
    addActivityRow() {
        const tbody = document.querySelector('#activitiesTable tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td></td>
            <td><input type="text" name="act_desc[]" placeholder="Descripción de actividad"></td>
            <td><input type="text" name="act_resp[]" placeholder="Responsable"></td>
            <td><input type="time" name="act_inicio[]" onchange="app.calcRowDuration(this)"></td>
            <td><input type="time" name="act_fin[]" onchange="app.calcRowDuration(this)"></td>
            <td><input type="text" name="act_duracion[]" readonly placeholder="--:--"></td>
            <td class="no-print text-center"><button type="button" class="btn btn-danger btn-sm" onclick="app.removeRow(this)">X</button></td>
        `;
        tbody.appendChild(tr);
        this.updateRowNumbers(tbody);
    },

    addMaterialRow() {
        const tbody = document.querySelector('#materialsTable tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td></td>
            <td><input type="text" name="mat_desc[]" placeholder="Nombre material/repuesto"></td>
            <td><input type="number" name="mat_cant[]" placeholder="0" min="0" step="0.01"></td>
            <td>
                <select name="mat_und[]">
                    <option value="Und">Und</option>
                    <option value="Kg">Kg</option>
                    <option value="L">L</option>
                    <option value="Gl">Gl</option>
                    <option value="Mts">Mts</option>
                    <option value="Otro">Otro</option>
                </select>
            </td>
            <td><input type="text" name="mat_spec[]" placeholder="Especificaciones/Código"></td>
            <td class="no-print text-center"><button type="button" class="btn btn-danger btn-sm" onclick="app.removeRow(this)">X</button></td>
        `;
        tbody.appendChild(tr);
        this.updateRowNumbers(tbody);
    },

    addAssetRow() {
        const tbody = document.querySelector('#assetsTable tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td></td>
            <td><input type="text" name="ast_codigo[]" placeholder="GIM-..."></td>
            <td><input type="text" name="ast_tipo[]" placeholder="Ej. Motobomba"></td>
            <td><input type="text" name="ast_area[]" placeholder="Área"></td>
            <td><input type="text" name="ast_marca[]" placeholder="Ej. Honda"></td>
            <td><input type="text" name="ast_modelo[]" placeholder="Modelo"></td>
            <td><input type="text" name="ast_serie[]" placeholder="Serie"></td>
            <td><input type="text" name="ast_cap[]" placeholder="Potencia/Cap"></td>
            <td>
                <select name="ast_condicion[]">
                    <option value="Operativo">Operativo</option>
                    <option value="Operativo con obs.">Operativo con obs.</option>
                    <option value="Inoperativo">Inoperativo</option>
                </select>
            </td>
            <td class="no-print text-center"><button type="button" class="btn btn-danger btn-sm" onclick="app.removeRow(this)">X</button></td>
        `;
        tbody.appendChild(tr);
        this.updateRowNumbers(tbody);
    },

    addObservationRow() {
        const tbody = document.querySelector('#observationsTable tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <select name="obs_prioridad[]">
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                </select>
            </td>
            <td><input type="text" name="obs_desc[]" placeholder="Descripción de la observación"></td>
            <td><input type="text" name="obs_accion[]" placeholder="Acción recomendada"></td>
            <td class="no-print text-center"><button type="button" class="btn btn-danger btn-sm" onclick="app.removeRow(this)">X</button></td>
        `;
        tbody.appendChild(tr);
    },

    removeRow(btn) {
        const tr = btn.closest('tr');
        const tbody = tr.parentElement;
        tr.remove();
        this.updateRowNumbers(tbody);
    },

    updateRowNumbers(tbody) {
        Array.from(tbody.children).forEach((tr, index) => {
            const firstTd = tr.querySelector('td:first-child');
            if (firstTd && !firstTd.querySelector('select')) {
                firstTd.textContent = index + 1;
            }
        });
    },

    // --- CÁLCULO DE DURACIÓN ---
    calcRowDuration(input) {
        const tr = input.closest('tr');
        const start = tr.querySelector('input[name="act_inicio[]"]').value;
        const end = tr.querySelector('input[name="act_fin[]"]').value;
        const durationInput = tr.querySelector('input[name="act_duracion[]"]');

        if (start && end) {
            const diff = this.timeDiff(start, end);
            durationInput.value = diff;
        } else {
            durationInput.value = '';
        }
    },

    timeDiff(start, end) {
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let dH = h2 - h1;
        let dM = m2 - m1;
        if (dM < 0) { dM += 60; dH -= 1; }
        if (dH < 0) dH += 24;
        return `${dH.toString().padStart(2, '0')}:${dM.toString().padStart(2, '0')}`;
    },

    // --- MANEJO DE IMÁGENES DINÁMICAS ---
    addPhotoCard() {
        this.photoCount++;
        const id = this.photoCount;
        const grid = document.getElementById('dynamicPhotoGrid');
        
        let defaultTitle = `Fotografía ${id}`;
        if(id === 1) defaultTitle = "Fotografía 1 — Estado Inicial";
        if(id === 2) defaultTitle = "Fotografía 2 — Durante la Ejecución";
        if(id === 3) defaultTitle = "Fotografía 3 — Resultado Final";

        const div = document.createElement('div');
        div.className = 'photo-card';
        div.id = `photoCard_${id}`;
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <input type="text" name="photo_title_${id}" class="photo-title" value="${defaultTitle}" style="font-weight:600; text-align:center; border:none; background:transparent;">
                <button type="button" class="btn btn-danger btn-sm no-print" onclick="app.removePhotoCard(${id})" title="Eliminar foto">X</button>
            </div>
            <div class="photo-upload-area" onclick="document.getElementById('photoInput_${id}').click()">
                <span class="upload-icon no-print">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Click para cargar imagen
                </span>
                <img id="photoPreview_${id}" class="photo-preview" src="" alt="" style="display:none;">
            </div>
            <input type="file" id="photoInput_${id}" accept="image/*" class="no-print hidden-input" onchange="app.handleImageUpload(event, 'photoPreview_${id}')">
            <textarea name="photo_desc_${id}" rows="2" placeholder="Leyenda / Descripción de la fotografía..."></textarea>
        `;
        grid.appendChild(div);
    },

    removePhotoCard(id) {
        const card = document.getElementById(`photoCard_${id}`);
        if(card) card.remove();
    },

    handleImageUpload(event, previewId) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.getElementById(previewId);
                if(img){
                    img.src = e.target.result;
                    img.style.display = 'block';
                    img.setAttribute('data-base64', e.target.result);
                }
            }
            reader.readAsDataURL(file);
        }
    },

    // --- INTEGRACIÓN OPENAI ---

    readSupportFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const previewImg = document.getElementById('aiSupportImagePreview');
        const previewContainer = document.getElementById('aiSupportImagePreviewContainer');
        const textArea = document.getElementById('aiSupportText');

        // Reiniciar
        previewContainer.style.display = 'none';
        previewImg.removeAttribute('data-base64');
        previewImg.src = '';
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                previewImg.setAttribute('data-base64', e.target.result);
                previewContainer.style.display = 'block';
                textArea.placeholder = "Opcional: Añada más detalles de texto aquí...";
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            textArea.value = "Extrayendo texto del PDF... por favor espere.";
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n\n';
                    }
                    textArea.value = fullText.trim();
                } catch (err) {
                    console.error(err);
                    textArea.value = "Error al extraer texto del PDF. Por favor péguelo manualmente.";
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                textArea.value = e.target.result;
            };
            reader.readAsText(file);
        }
    },

    async runAiAnalysis() {
        const apiKey = document.getElementById('openaiApiKey').value.trim();
        const contextText = document.getElementById('aiProjectContext').value.trim();
        const supportText = document.getElementById('aiSupportText').value.trim();
        const statusEl = document.getElementById('aiStatus');
        
        if (!apiKey) {
            statusEl.textContent = "Por favor ingrese la API Key.";
            statusEl.style.color = "red";
            return;
        }

        statusEl.textContent = "Recopilando datos e imágenes...";
        statusEl.style.color = "blue";
        document.getElementById('btnRunAi').disabled = true;

        try {
            // Recopilar imágenes Base64
            const photoContent = [];
            document.querySelectorAll('.photo-preview').forEach(img => {
                const b64 = img.getAttribute('data-base64');
                if(b64 && img.id !== 'signaturePreview') {
                    photoContent.push({
                        type: "image_url",
                        image_url: { url: b64 }
                    });
                }
            });

            const systemPrompt = `Eres un experto ingeniero de mantenimiento. Genera el contenido para un Informe de Servicio de Mantenimiento.
Contexto General del Servicio:
${contextText || 'No provisto'}

Información de Apoyo / Archivos extra:
${supportText || 'No provisto'}

Analiza el contexto, los datos de apoyo y las imágenes adjuntas. Debes devolver un JSON con esta estructura exacta para autocompletar el informe (puedes dejar vacío lo que no aplique):
{
  "dev_antes": "Texto detallado para situación inicial",
  "dev_durante": "Texto detallado para ejecución del servicio",
  "dev_despues": "Texto detallado para resultado final",
  "recomendaciones": "- Viñeta 1\\n- Viñeta 2",
  "conclusiones": "- Conclusión 1\\n- Conclusión 2",
  "desc_objetivo": "Objetivo sugerido del servicio",
  "desc_detallada": "Descripción detallada sugerida"
}`;

            statusEl.textContent = "Enviando análisis a OpenAI (gpt-4o)... por favor espere.";

            const payload = {
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: [
                        { type: "text", text: "Por favor genera el informe en JSON." },
                        ...photoContent
                    ]}
                ],
                response_format: { type: "json_object" },
                max_tokens: 2000
            };

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if(!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "Error en la API de OpenAI");
            }

            const result = await response.json();
            const aiData = JSON.parse(result.choices[0].message.content);

            // 3. Autocompletar campos
            if(aiData.dev_antes) document.querySelector('[name="dev_antes"]').value = aiData.dev_antes;
            if(aiData.dev_durante) document.querySelector('[name="dev_durante"]').value = aiData.dev_durante;
            if(aiData.dev_despues) document.querySelector('[name="dev_despues"]').value = aiData.dev_despues;
            if(aiData.recomendaciones) document.querySelector('[name="recomendaciones"]').value = aiData.recomendaciones;
            if(aiData.conclusiones) document.querySelector('[name="conclusiones"]').value = aiData.conclusiones;
            
            if(aiData.desc_objetivo && !document.querySelector('[name="desc_objetivo"]').value) 
                document.querySelector('[name="desc_objetivo"]').value = aiData.desc_objetivo;
            if(aiData.desc_detallada && !document.querySelector('[name="desc_detallada"]').value) 
                document.querySelector('[name="desc_detallada"]').value = aiData.desc_detallada;

            statusEl.textContent = "¡Análisis completado! Campos autocompletados con éxito.";
            statusEl.style.color = "green";

        } catch(err) {
            console.error(err);
            statusEl.textContent = "Error: " + err.message;
            statusEl.style.color = "red";
        } finally {
            document.getElementById('btnRunAi').disabled = false;
        }
    },

    // --- VISTA PREVIA ---
    previewReport() {
        // La vista previa puede simular el documento final activando el cuadro de impresión
        // o si es necesario, simplemente podemos llamar window.print() ya que muestra vista previa.
        // Pero para diferenciarlo, vamos a ocultar la UI para revisar la pantalla.
        alert("Modo Vista Previa: Use CTRL+P para imprimir, o revise el documento en limpio.");
        window.scrollTo(0,0);
        document.body.classList.add('preview-mode');
        
        // Agregar botón flotante para salir de vista previa
        let btn = document.getElementById('exitPreviewBtn');
        if(!btn) {
            btn = document.createElement('button');
            btn.id = 'exitPreviewBtn';
            btn.innerHTML = 'Salir de Vista Previa';
            btn.className = 'btn btn-danger';
            btn.style.cssText = 'position:fixed; top:20px; right:20px; z-index:9999; box-shadow:0 4px 6px rgba(0,0,0,0.3);';
            btn.onclick = () => {
                document.body.classList.remove('preview-mode');
                btn.style.display = 'none';
            };
            document.body.appendChild(btn);
        }
        btn.style.display = 'block';
    },

    // --- GUARDAR Y ABRIR JSON ---
    saveFile() {
        const form = document.getElementById('maintenanceForm');
        const formData = new FormData(form);
        
        // Excluir base64 de photo_... del formData si existen, las guardaremos aparte
        const fields = Object.fromEntries(formData.entries());

        const data = {
            fields: fields,
            tables: {
                activities: this.getTableData('#activitiesTable'),
                materials: this.getTableData('#materialsTable'),
                assets: this.getTableData('#assetsTable'),
                observations: this.getTableData('#observationsTable')
            },
            photos: [],
            signature: document.getElementById('signaturePreview')?.getAttribute('data-base64') || ''
        };

        // Extraer fotos dinámicas
        document.querySelectorAll('.photo-card').forEach(card => {
            const idMatch = card.id.match(/\d+/);
            if(idMatch) {
                const id = idMatch[0];
                const preview = document.getElementById(`photoPreview_${id}`);
                const b64 = preview ? preview.getAttribute('data-base64') : '';
                data.photos.push({
                    id: id,
                    title: document.querySelector(`[name="photo_title_${id}"]`)?.value || '',
                    desc: document.querySelector(`[name="photo_desc_${id}"]`)?.value || '',
                    base64: b64 || ''
                });
            }
        });

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `Informe_Mantenimiento_${new Date().getTime()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    getTableData(selector) {
        const tbody = document.querySelector(`${selector} tbody`);
        const rows = [];
        Array.from(tbody.children).forEach(tr => {
            const rowData = {};
            Array.from(tr.querySelectorAll('input, select')).forEach(input => {
                const name = input.name.replace('[]', '');
                rowData[name] = input.value;
            });
            rows.push(rowData);
        });
        return rows;
    },

    openFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.loadData(data);
            } catch (err) {
                alert("Error al parsear el archivo JSON.");
                console.error(err);
            }
        };
        reader.readAsText(file);
    },

    loadData(data) {
        document.getElementById('maintenanceForm').reset();
        
        if (data.fields) {
            for (const [key, value] of Object.entries(data.fields)) {
                if(!key.includes('[]') && !key.startsWith('photo_')){
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field) field.value = value;
                }
            }
        }

        if (data.tables) {
            this.loadTableData('#activitiesTable', data.tables.activities, this.addActivityRow.bind(this));
            this.loadTableData('#materialsTable', data.tables.materials, this.addMaterialRow.bind(this));
            this.loadTableData('#assetsTable', data.tables.assets, this.addAssetRow.bind(this));
            this.loadTableData('#observationsTable', data.tables.observations, this.addObservationRow.bind(this));
        }

        if(data.photos && Array.isArray(data.photos)) {
            document.getElementById('dynamicPhotoGrid').innerHTML = '';
            this.photoCount = 0;
            data.photos.forEach(p => {
                this.addPhotoCard();
                const currentId = this.photoCount;
                
                const titleInput = document.querySelector(`[name="photo_title_${currentId}"]`);
                if(titleInput) titleInput.value = p.title;
                
                const descInput = document.querySelector(`[name="photo_desc_${currentId}"]`);
                if(descInput) descInput.value = p.desc;
                
                if(p.base64) {
                    const img = document.getElementById(`photoPreview_${currentId}`);
                    img.src = p.base64;
                    img.style.display = 'block';
                    img.setAttribute('data-base64', p.base64);
                }
            });
        }

        if (data.signature) {
            const img = document.getElementById('signaturePreview');
            img.src = data.signature;
            img.style.display = 'block';
            img.setAttribute('data-base64', data.signature);
        }
    },

    loadTableData(selector, rowDataArray, addRowFunc) {
        const tbody = document.querySelector(`${selector} tbody`);
        tbody.innerHTML = ''; 
        if (rowDataArray && rowDataArray.length > 0) {
            rowDataArray.forEach(rowData => {
                addRowFunc();
                const tr = tbody.lastElementChild;
                for (const [key, value] of Object.entries(rowData)) {
                    const input = tr.querySelector(`[name="${key}[]"]`);
                    if (input) input.value = value;
                }
            });
        } else {
            addRowFunc();
        }
    },

    // --- RESTABLECER ---
    resetForm() {
        if (confirm('¿Desea borrar todo el contenido editado?')) {
            document.getElementById('maintenanceForm').reset();
            document.querySelector('#activitiesTable tbody').innerHTML = '';
            document.querySelector('#materialsTable tbody').innerHTML = '';
            document.querySelector('#assetsTable tbody').innerHTML = '';
            document.querySelector('#observationsTable tbody').innerHTML = '';
            document.getElementById('dynamicPhotoGrid').innerHTML = '';
            
            const sig = document.getElementById('signaturePreview');
            sig.src = ''; sig.style.display = 'none'; sig.removeAttribute('data-base64');
            
            this.photoCount = 0;
            this.init();
        }
    },

    // --- EXPORTAR A WORD ---
    exportWord() {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; }" +
            "table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }" +
            "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }" +
            "h1, h2, h3 { color: #2563EB; }" +
            ".no-print { display: none; }" +
            "</style></head><body>";
        const footer = "</body></html>";
        
        // Clonar el contenedor para inyectar valores de input a div de texto
        const clone = document.getElementById("maintenanceForm").cloneNode(true);
        
        // Convertir inputs/textareas en texto estático para Word
        const inputs = document.getElementById("maintenanceForm").querySelectorAll('input, select, textarea');
        const cloneInputs = clone.querySelectorAll('input, select, textarea');
        
        inputs.forEach((input, index) => {
            const cloneInput = cloneInputs[index];
            if (input.type === 'file' || input.type === 'button') {
                cloneInput.remove();
            } else if (input.tagName === 'SELECT') {
                const textNode = document.createTextNode(input.options[input.selectedIndex]?.text || '');
                cloneInput.parentNode.replaceChild(textNode, cloneInput);
            } else {
                const textNode = document.createTextNode(input.value || '');
                cloneInput.parentNode.replaceChild(textNode, cloneInput);
            }
        });

        // Asegurar que las imágenes conserven ancho máximo en Word
        clone.querySelectorAll('img').forEach(img => {
            if(img.src.startsWith('data:image')) {
                img.style.maxWidth = '500px';
                img.style.height = 'auto';
            } else {
                img.remove(); // Quitar placeholder vacíos
            }
        });

        const sourceHTML = header + clone.innerHTML + footer;
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'Informe_Mantenimiento.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
