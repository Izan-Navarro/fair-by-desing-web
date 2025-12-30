
// ================================
// FOOPS! tests – Refactor genérico
// ================================

(function () {
  // Mapa de formularios → configuración del test
  // Ajusta/añade entradas para nuevos tests (p. ej., VER1, FIND2, etc.)
  const TESTS_MAP = {
    // 1) VOC1 – Ontology reuses existing vocabularies for metadata annotations
    vocabForm: {
      testCode: 'VOC1',
      fieldId: 'vocabField',
      boxId: 'voc1Result',
      rawId: 'voc1Raw',
      messages: {
        running: 'Running VOC1… please wait.',
        pass: 'VOC1 passed: the ontology reuses standard vocabularies for metadata.',
        fail: 'VOC1 failed: no standard metadata vocabularies detected (see details below).',
        generic: 'VOC1 completed. See details below.'
      }
    },

    // 2) VOC2 – Ontology imports or reuses well established vocabularies
    vocab2Form: {
      testCode: 'VOC2',
      fieldId: 'vocab2Field',
      boxId: 'voc2Result',
      rawId: 'voc2Raw',
      messages: {
        running: 'Running VOC2… please wait.',
        pass: 'VOC2 passed: the ontology imports or reuses well-established vocabularies.',
        fail: 'VOC2 failed: no imports or reuse of external vocabularies detected (see details below).',
        generic: 'VOC2 completed. See details below.'
      }
    },

    // 3) VOC3-T – Ontology documentation: all terms have labels
    voc3Form: {
      testCode: 'VOC3',
      fieldId: 'voc3Field',
      boxId: 'voc3Result',
      rawId: 'voc3Raw',
      messages: {
        running: 'Running VOC3… please wait.',
        pass: 'VOC3 passed: all terms have labels.',
        fail: 'VOC3 failed: some terms are missing labels (see details below).',
        generic: 'VOC3 completed. See details below.'
      }
    },

    // 4) VOC4-T – Ontology documentation: all terms have definitions
    voc4Form: {
      testCode: 'VOC4',
      fieldId: 'voc4Field',
      boxId: 'voc4Result',
      rawId: 'voc4Raw',
      messages: {
        running: 'Running VOC4… please wait.',
        pass: 'VOC4 passed: all terms have definitions.',
        fail: 'VOC4 failed: some terms are missing definitions (see details below).',
        generic: 'VOC4 completed. See details below.'
      }
    },

    // ---------- Online publication ----------
    http1Form: {
      testCode: 'HTTP1',
      fieldId: 'http1Field',
      boxId: 'http1Result',
      rawId: 'http1Raw',
      messages: {
        running: 'Running HTTP1… please wait.',
        pass: 'HTTP1 passed: ontology uses an open protocol (HTTP/HTTPS).',
        fail: 'HTTP1 failed: ontology does not seem accessible via HTTP/HTTPS (see details below).',
        generic: 'HTTP1 completed. See details below.'
      }
    },

    rdf1Form: {
      testCode: 'RDF1',
      fieldId: 'rdf1Field',
      boxId: 'rdf1Result',
      rawId: 'rdf1Raw',
      messages: {
        running: 'Running RDF1… please wait.',
        pass: 'RDF1 passed: ontology is available in a supported RDF serialization.',
        fail: 'RDF1 failed: no supported RDF serialization could be retrieved (see details below).',
        generic: 'RDF1 completed. See details below.'
      }
    },

    cn1Form: {
      testCode: 'CN1',
      fieldId: 'cn1Field',
      boxId: 'cn1Result',
      rawId: 'cn1Raw',
      messages: {
        running: 'Running CN1… please wait.',
        pass: 'CN1 passed: content negotiation for RDF is available.',
        fail: 'CN1 failed: content negotiation for RDF is not working (see details below).',
        generic: 'CN1 completed. See details below.'
      }
    },

    doc1Form: {
      testCode: 'DOC1',
      fieldId: 'doc1Field',
      boxId: 'doc1Result',
      rawId: 'doc1Raw',
      messages: {
        running: 'Running DOC1… please wait.',
        pass: 'DOC1 passed: HTML documentation is available.',
        fail: 'DOC1 failed: HTML documentation was not detected (see details below).',
        generic: 'DOC1 completed. See details below.'
      }
    },

    uri1Form: {
      testCode: 'URI1',
      fieldId: 'uri1Field',
      boxId: 'uri1Result',
      rawId: 'uri1Raw',
      messages: {
        running: 'Running URI1… please wait.',
        pass: 'URI1 passed: ontology URI is resolvable.',
        fail: 'URI1 failed: ontology URI is not resolvable (see details below).',
        generic: 'URI1 completed. See details below.'
      }
    },

    uri2Form: {
      testCode: 'URI2',
      fieldId: 'uri2Field',
      boxId: 'uri2Result',
      rawId: 'uri2Raw',
      messages: {
        running: 'Running URI2… please wait.',
        pass: 'URI2 passed: consistent ontology identifiers are employed.',
        fail: 'URI2 failed: inconsistent ontology identifiers detected (see details below).',
        generic: 'URI2 completed. See details below.'
      }
    },

    ver1Form: {
      testCode: 'VER1',
      fieldId: 'ver1Field',
      boxId: 'ver1Result',
      rawId: 'ver1Raw',
      messages: {
        running: 'Running VER1… please wait.',
        pass: 'VER1 passed: a version IRI is declared in the ontology metadata.',
        fail: 'VER1 failed: no version IRI detected (see details below).',
        generic: 'VER1 completed. See details below.'
      }
    },

    ver2Form: {
      testCode: 'VER2',
      fieldId: 'ver2Field',
      boxId: 'ver2Result',
      rawId: 'ver2Raw',
      messages: {
        running: 'Running VER2… please wait.',
        pass: 'VER2 passed: the version IRI resolves.',
        fail: 'VER2 failed: the version IRI does not resolve (see details below).',
        generic: 'VER2 completed. See details below.'
      }
    },

    find3Form: {
      testCode: 'FIND3',
      fieldId: 'find3Field',
      boxId: 'find3Result',
      rawId: 'find3Raw',
      messages: {
        running: 'Running FIND3… please wait.',
        pass: 'FIND3 passed: ontology found in a community registry.',
        fail: 'FIND3 failed: ontology not found in the expected registries (see details below).',
        generic: 'FIND3 completed. See details below.'
      }
    },

    find3bisForm: {
      testCode: 'FIND3', //FIND_3_BIS
      fieldId: 'find3bisField',
      boxId: 'find3bisResult',
      rawId: 'find3bisRaw',
      messages: {
        running: 'Running FIND_3_BIS… please wait.',
        pass: 'FIND_3_BIS passed: metadata are accessible even when the ontology is not.',
        fail: 'FIND_3_BIS failed: metadata access is not ensured (see details below).',
        generic: 'FIND_3_BIS completed. See details below.'
      }
    },

    om42Form: {
      testCode: "OM4_2", //OM4.2
      fieldId: "om42Field",
      boxId: "om42Result",
      rawId: "om42Raw",
      messages: {
        running: "Running OM4.2-T… please wait.",
        pass: "OM4.2-T passed: ontology maintenance policy detected.",
        fail: "OM4.2-T failed: no maintenance policy metadata found (see details below).",
        generic: "OM4.2-T completed. See details below."
      }
    },

    ver2Form: {
      testCode: "VER2",
      fieldId: "ver2Field",
      boxId: "ver2Result",
      rawId: "ver2Raw",
      messages: {
        running: "Running VER2-T… please wait.",
        pass: "VER2-T passed: ontology version IRI resolves correctly.",
        fail: "VER2-T failed: ontology version IRI does not resolve (see details below).",
        generic: "VER2-T completed. See details below."
      }
    }

    // EJEMPLO para añadir otro test (crear también el HTML con esos IDs):
    // ver1Form: {
    //   testCode: 'VER1',
    //   fieldId: 'ver1Field',
    //   boxId: 'ver1Result',
    //   rawId: 'ver1Raw',
    //   messages: {
    //     running: 'Running VER1… please wait.',
    //     pass: 'VER1 passed: version IRI is declared in the ontology metadata.',
    //     fail: 'VER1 failed: no owl:versionIRI found (see details below).',
    //     generic: 'VER1 completed. See details below.'
    //   }
    // }
  };

  // -----------------------------
  // Delegación: captura submit(s)
  // -----------------------------
  document.addEventListener('submit', async (e) => {
      const form = e.target;
      const cfg = TESTS_MAP[form?.id];
      if (!cfg) return; // no es uno de los formularios mapeados

      e.preventDefault();

      // Obtén el valor del campo
      const input = form.querySelector(`#${cfg.fieldId}`);
      const value = (input?.value || '').trim();

      // Validaciones comunes
      if (!value) {
        showMessage(cfg, 'Please enter an ontology URI (e.g., https://w3id.org/your-ontology#).', 'warning', { hideRaw: true });
        return;
      }
      if (!isValidUri(value)) {
        showMessage(cfg, 'The value does not look like a valid URI. Enter the ontology URI (not just a prefix).', 'warning', { hideRaw: true });
        return;
      }

      // Asegura contenedores (si faltan en el DOM, los creamos bajo el form)
      ensureContainers(cfg, form);

      // Ejecuta el test
      await runFOOPSTest(cfg, value);
    });



    document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-foops-toggle]');
    if (!btn) return;

    const rawId = btn.getAttribute('data-foops-toggle');
    const pre = document.getElementById(rawId);
    if (!pre) return;

    const hidden = (pre.style.display === 'none' || getComputedStyle(pre).display === 'none');
    pre.style.display = hidden ? 'block' : 'none';
    btn.textContent = hidden ? 'Ocultar JSON' : 'Mostrar JSON';
  });



  // -----------------------------
  // Utils de validación/UI/DOM
  // -----------------------------
  function isValidUri(str) {
    try { new URL(str); return true; } catch { return false; }
  }

  function ensureContainers(cfg, form) {
    let box = document.getElementById(cfg.boxId);
    let raw = document.getElementById(cfg.rawId);
    const toggleId = `${cfg.rawId}Toggle`;
    let toggle = document.getElementById(toggleId);

    if (!box) {
      box = document.createElement('div');
      box.id = cfg.boxId;
      box.className = 'mt-3';
      box.style.display = 'none';
      form.insertAdjacentElement('afterend', box);
    }
    if (!raw) {
      raw = document.createElement('pre');
      raw.id = cfg.rawId;
      raw.className = 'mt-2';
      raw.style.display = 'none';
      raw.style.maxHeight = '300px';
      raw.style.overflow = 'auto';
      box.insertAdjacentElement('afterend', raw);
    } else {
      raw.style.maxHeight = raw.style.maxHeight || '300px';
      raw.style.overflow = raw.style.overflow || 'auto';
      raw.style.display = 'none';
    }

    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = toggleId;
      toggle.className = 'btn btn-sm btn-outline-secondary mt-2';
      toggle.textContent = 'Mostrar JSON';
      toggle.style.display = 'none';
      toggle.setAttribute('data-foops-toggle', cfg.rawId);

      if (raw && raw.parentNode) raw.parentNode.insertBefore(toggle, raw);
      else box.insertAdjacentElement('afterend', toggle);
    }
  }

  // Muestra mensaje en el contenedor del test
  // hideRaw=true oculta el <pre> (útil mientras está "Running…")
  function showMessage(cfg, msg, level, opts = {}) {
    const { hideRaw = false } = opts;
    const box = document.getElementById(cfg.boxId);
    const raw = document.getElementById(cfg.rawId);
    if (!box) return;

    box.style.display = 'block';
    box.className = 'alert mt-3';
    box.classList.remove('alert-success', 'alert-warning', 'alert-danger', 'alert-info');

    if (level === 'success') box.classList.add('alert-success');
    else if (level === 'warning') box.classList.add('alert-warning');
    else if (level === 'info') box.classList.add('alert-info');
    else box.classList.add('alert-danger'); // default: error

    box.innerHTML = msg;

    if (hideRaw && raw) {
      raw.style.display = 'none';
      raw.textContent = '';
    }
  }

  // Muestra el JSON/texto devuelto por FOOPS! en el <pre>
  function showRaw(cfg, dataOrText) {
    const raw = document.getElementById(cfg.rawId);
    const toggle = document.getElementById(`${cfg.rawId}Toggle`);
    if (!raw) return;

    raw.textContent = (typeof dataOrText === 'string')
      ? dataOrText
      : JSON.stringify(dataOrText, null, 2);

    raw.style.display = 'none';

    if (toggle) {
      toggle.style.display = 'inline-block';
      toggle.textContent = 'Mostrar JSON';
    }
  }


  function extractCompletion(data) {
    const c = data?.completion;
    if (c == null) return null;
    if (typeof c === 'number') return c;
    if (typeof c === 'string') return Number.isFinite(Number(c)) ? Number(c) : null;
    if (typeof c === 'object') {
      const v = c['@value'] ?? c.value ?? c._value;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }

  function extractTitle(cfg, data) {
    return data?.outputFromTest?.title || data?.title || cfg?.testCode || 'FOOPS! test';
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function showSummary(cfg, data, passed) {
    const box = document.getElementById(cfg.boxId);
    if (!box) return;

    const completion = extractCompletion(data);
    const pct = (typeof completion === 'number' && completion >= 0)
      ? Math.max(0, Math.min(100, completion))
      : null;

    let status = passed;
    if (status === null && pct !== null) status = (pct >= 100); // umbral 100%

    const statusLabel = (status === true) ? 'PASADO' : (status === false) ? 'NO PASADO' : 'DESCONOCIDO';
    const badgeClass = (status === true) ? 'bg-success' : (status === false) ? 'bg-danger' : 'bg-secondary';
    const barClass = (status === true) ? 'bg-success' : (status === false) ? 'bg-danger' : 'bg-secondary';
    const iconClass = (status === true)
      ? 'bi-check-circle-fill text-success'
      : (status === false)
        ? 'bi-x-circle-fill text-danger'
        : 'bi-question-circle-fill text-secondary';

    const title = extractTitle(cfg, data);
    const desc = data?.description || data?.log || '';

    box.style.display = 'block';
    box.className = 'card mt-3 shadow-sm';
    box.innerHTML = `
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div class="fw-semibold">
            <i class="bi ${iconClass} me-2"></i>${escapeHtml(title)}
          </div>
          <span class="badge ${badgeClass}">${statusLabel}</span>
        </div>

        <div class="mt-3">
          <div class="d-flex align-items-center justify-content-between">
            <small class="text-muted">Completion</small>
            <small class="fw-semibold">${pct === null ? '—' : pct + '%'}</small>
          </div>
          <div class="progress mt-1" role="progressbar" aria-valuenow="${pct ?? 0}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar ${barClass}" style="width: ${pct ?? 0}%"></div>
          </div>
        </div>

        ${desc ? `<div class="mt-3 small text-muted">${escapeHtml(desc)}</div>` : ''}
      </div>
    `;
  }





  // -----------------------------
  // Runner genérico para FOOPS!
  // -----------------------------
  async function runFOOPSTest(cfg, ontologyUri) {
    const endpoint = `https://foops.linkeddata.es/assess/test/${cfg.testCode}`;

    // 1) Estado inicial: mostramos "Running..." y ocultamos el <pre>
    showMessage(cfg, cfg.messages.running, 'info', { hideRaw: true });

    // Intento dual de payload:
    // - resource_identifier (patrón visto en /assess/test/*)
    // - ontologyUri (clave usada por /assessOntology, por compatibilidad)
    const payloads = [
      { resource_identifier: ontologyUri },
      { ontologyUri: ontologyUri }
    ];

    let lastError = null;

    for (const body of payloads) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { _raw: text }; }

        if (!res.ok) {
          lastError = new Error(`HTTP ${res.status} ${res.statusText}: ${text || 'no body'}`);
          continue; // prueba el siguiente payload
        }

        // 2) Inferimos PASS/FAIL
        const passed = inferPass(cfg.testCode, data);

        // 3) Mostramos mensaje final (no ocultar <pre>) y luego el JSON
        showSummary(cfg, data, passed);
        showRaw(cfg, data);

        return; // éxito → no probar siguientes payloads
      } catch (err) {
        lastError = err;
      }
    }

    // Si ambos payloads fallaron
    showMessage(cfg, `Error running ${cfg.testCode}: ${lastError ? lastError.message : 'Unknown error'}`, 'error');
    showRaw(cfg, lastError ? String(lastError) : '');
  }

  // -----------------------------
  // Heurística PASS/FAIL genérica
  // -----------------------------
  function inferPass(testCode, data) {
    try {
      if (typeof data?.value === 'string') {
        if (/^(ok|pass(ed)?)$/i.test(data.value)) return true;
        if (/^(fail(ed)?|error|not\s*ok)$/i.test(data.value)) return false;
      }
      const pct = extractCompletion(data);
      if (typeof pct === 'number') {
        if (pct >= 100) return true;
        if (pct <= 0) return false;
      }
    } catch {}
    return null;
  }
})();
