function toggleInput(inputId) {
    var inputField = document.getElementById(inputId);
    if (inputField.style.display === "none") {
        inputField.style.display = "block";
    } else {
        inputField.style.display = "none";
    }
}

function submitForm(fieldId) {
    const value = document.getElementById(fieldId).value.trim();
    if (!value) return;

    if (fieldId === 'prefixField') {
        // CHECK YOUR PREFIX (prefix.cc)
        checkPrefix(value);
    } else if (fieldId === 'uriField') {
      checkNamespaceURI(value);
        // CHECK YOUR URI (FOOPS)
      //sendRequest(value);
    }
}

function checkNamespaceURI(uri) {
  const spinner = document.getElementById('loadingSpinnerUri');
  const result = document.getElementById('resultContainerUri');

  // Reset
  result.style.display = "none";
  result.innerHTML = "";
  result.className = "alert mt-2"; // limpia clases previas

  spinner.style.display = "block";

  const messages = [];
  let status = "success";

  // 1) Validación básica + host
  let host = "";
  try {
    const url = new URL(uri);
    host = url.host;
  } catch (e) {
    messages.push(`
      <li>
        <i class="bi bi-exclamation-octagon-fill me-1"></i>
        The value does not look like a valid URI. Make sure it includes the scheme, e.g.
        <code>https://w3id.org/your-ontology#</code>.
      </li>
    `);
    status = "warning";
  }

  // 2) ¿Termina en / o #?
  if (uri.length > 0) {
    const lastChar = uri[uri.length - 1];
    if (lastChar !== '/' && lastChar !== '#') {
      messages.push(`
        <li>
          <i class="bi bi-exclamation-triangle-fill me-1"></i>
          The namespace URI should end with <code>/</code> or <code>#</code>. Consider using
          <code>${uri}/</code> or <code>${uri}#</code>.
        </li>
      `);
      if (status === "success") status = "warning";
    } else {
      messages.push(`
        <li>
          <i class="bi bi-check-circle-fill me-1"></i>
          Namespace ends with <code>${lastChar}</code>.
        </li>
      `);
    }
  }

  // 3) Proveedor recomendado
  if (host) {
    const recommendedHosts = [
      "w3id.org",
      "doi.org",
      "purl.org",
      "linked.data.gov.au",
      "dbpedia.org",
      "www.w3.org",
      "perma.cc",
      "data.europa.eu"
    ];

    const isPurlVariant = host === "purl.org" || (host.startsWith("purl.") && host.endsWith(".org"));
    const isRecommended = recommendedHosts.includes(host) || isPurlVariant;

    if (isRecommended) {
      messages.push(`
        <li>
          <i class="bi bi-check-circle-fill me-1"></i>
          The host <code>${host}</code> is a commonly used persistent provider.
        </li>
      `);
    } else {
      messages.push(`
        <li>
          <i class="bi bi-info-circle-fill me-1"></i>
          The host <code>${host}</code> is not in the usual list of persistent providers
          (e.g. <code>w3id.org</code>, <code>doi.org</code>, <code>purl.org</code>,
          <code>data.europa.eu</code>, ...), but that does not mean it is wrong.
        </li>
      `);
      if (status === "success") status = "info";
    }
  }

  // 4) Longitud del namespace
  if (uri.length >= 40) {
    messages.push(`
      <li>
        <i class="bi bi-exclamation-circle-fill me-1"></i>
        The namespace is quite long (${uri.length} characters). It is recommended to keep it under
        40 characters.
      </li>
    `);
    if (status === "success") status = "warning";
  } else if (uri.length > 0) {
    messages.push(`
      <li>
        <i class="bi bi-check-circle-fill me-1"></i>
        Namespace length is ${uri.length} characters (&lt; 40 recommended).
      </li>
    `);
  }

  // 5) Checklist opaque / readable
  const opaqueChoice = document.querySelector('input[name="opaqueChoice"]:checked');
  if (opaqueChoice) {
    if (opaqueChoice.value === "yes") {
      messages.push(`
        <li>
          <i class="bi bi-check2-square me-1"></i>
          You have decided whether to use opaque or readable URIs for ontology elements.
        </li>
      `);
    } else {
      messages.push(`
        <li>
          <i class="bi bi-square me-1"></i>
          You have not yet decided whether to use opaque or readable URIs. Add this to your design checklist.
        </li>
      `);
      if (status === "success") status = "warning";
    }
  } else {
    messages.push(`
      <li>
        <i class="bi bi-square me-1"></i>
        Checklist: mark whether you will use opaque or readable URIs.
      </li>
    `);
    if (status === "success") status = "info";
  }

  // Mostrar resultado
  spinner.style.display = "none";
  result.style.display = "block";

  if (status === "success") {
    result.classList.add("alert-success");
  } else if (status === "warning") {
    result.classList.add("alert-warning");
  } else {
    result.classList.add("alert-info");
  }

  result.innerHTML = `
    <strong>Namespace URI check</strong>
    <ul class="mb-0 mt-2">
      ${messages.join("")}
    </ul>
  `;
  checkVersionSchema(uri);
}



// === CHECK YOUR PREFIX (prefix.cc) ===
function checkPrefix(prefix) {
  const spinner = document.getElementById('loadingSpinnerPrefix');
  const result = document.getElementById('resultContainerPrefix');

  // Reset
  result.style.display = "none";
  result.innerHTML = "";
  result.className = "alert mt-2"; // limpia clases previas

  // Mostrar spinner
  spinner.style.display = "block";

  fetch(`https://prefix.cc/${encodeURIComponent(prefix)}.file.json`)
    .then(response => {
      spinner.style.display = "none";
      result.style.display = "block";

      if (response.ok) {
        // El prefijo EXISTE
        result.classList.add("alert-danger");
        result.innerHTML = `
          <i class="bi bi-x-circle-fill me-2"></i>
          The prefix <strong>${prefix}</strong> already exists in prefix.cc. Better think of another one.
        `;
      } else if (response.status === 404) {
        // El prefijo NO existe
        result.classList.add("alert-success");
        result.innerHTML = `
          <i class="bi bi-check-circle-fill me-2"></i>
          The prefix <strong>${prefix}</strong> is not registered in prefix.cc. You can use it.
        `;
      } else {
        result.classList.add("alert-danger");
        result.innerHTML = `
          <strong>Error:</strong> Could not check the prefix (HTTP ${response.status}).
        `;
      }
    })
    .catch(error => {
      spinner.style.display = "none";
      result.style.display = "block";
      result.classList.add("alert-danger");
      result.innerHTML = `<strong>Error:</strong> ${error.message}`;
    });
}


function sendRequest(value) {
  const spinner = document.getElementById('loadingSpinnerUri');
  const result = document.getElementById('resultContainerUri');

  result.style.display = "none";
  result.innerHTML = "";
  result.className = "alert mt-2";

  spinner.style.display = "block";

  const requestData = {
    resource_identifier: `https://w3id.org/${value}#`
  };

  fetch("https://foops.linkeddata.es/assess/test/FIND2", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      spinner.style.display = "none";
      result.style.display = "block";
      result.classList.add("alert-success");
      result.innerHTML = `
        <strong>Response:</strong>
        <pre class="mb-0">${JSON.stringify(data, null, 2)}</pre>
      `;
    })
    .catch(error => {
      spinner.style.display = "none";
      result.style.display = "block";
      result.classList.add("alert-danger");
      result.innerHTML = `<strong>Error:</strong> ${error.message}`;
    });
}


function checkVersionSchema(uri) {
  const versionBox = document.getElementById('versionResult');
  if (!versionBox) return;

  versionBox.style.display = "block";
  versionBox.className = "alert mt-3";
  versionBox.classList.add("alert-light");
  versionBox.innerHTML = "";

  if (!uri) {
    versionBox.classList.add("alert-warning");
    versionBox.innerHTML = `
      <strong>Versioning check</strong>
      <p class="mb-0 mt-2">Please enter a namespace URI in step 1 before checking your version schema.</p>
    `;
    return;
  }

  let semverUsed = false;
  let calverUsed = false;

  try {
    const url = new URL(uri);
    const path = url.pathname;
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "";

    const semverRegex = /^\d+\.\d+\.\d+$/; // 1.0.0
    const calverRegex = /^20\d{2}([.-]?\d{2}([.-]?\d{2})?)?$/; // 2024 o 2024-05 o 2024-05-10

    if (semverRegex.test(lastSegment)) semverUsed = true;
    if (calverRegex.test(lastSegment)) calverUsed = true;
  } catch (e) {
    // URI no parseable, seguimos sin detección automática
  }

  // Base para ejemplos: si no acaba en / o #, añadimos /
  let base = uri;
  const lastChar = uri[uri.length - 1];
  if (lastChar !== '/' && lastChar !== '#') {
    base = uri + '/';
  }

  // Ejemplo SemVer
  const exampleSemver = base + '1.0.0';

  // Ejemplo Calendar Versioning
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const exampleCalver = base + `${yyyy}-${mm}-${dd}`;

  versionBox.classList.remove("alert-light");
  versionBox.classList.add("alert-info");

  versionBox.innerHTML = `
    <strong>According to your URI, here you have a potential versioning scheme:</strong>
    <ul class="mb-2 mt-2">
      <li>
        <i class="bi ${semverUsed ? 'bi-check-square-fill text-success' : 'bi-square'} me-1"></i>
        Semantic Versioning (SemVer, recommended), e.g.
        <code>${exampleSemver}</code>
        ${semverUsed ? '<span class="badge bg-success ms-2">Already used in your URI</span>' : ''}
      </li>
      <li>
        <i class="bi ${calverUsed ? 'bi-check-square-fill text-success' : 'bi-square'} me-1"></i>
        Calendar versioning, e.g.
        <code>${exampleCalver}</code>
        ${calverUsed ? '<span class="badge bg-success ms-2">Already used in your URI</span>' : ''}
      </li>
    </ul>
    <p class="mb-0 small text-muted">
      SemVer (see <a href="https://semver.org/" target="_blank" rel="noopener noreferrer">semver.org</a>)
      is usually recommended for ontology versions.
    </p>
  `;
}


document.addEventListener('DOMContentLoaded', () => {

  const btnToTop = document.getElementById('btnToTop');
  const btnToPrinciples = document.getElementById('btnToPrinciples');
  const btnToWhy = document.getElementById('btnToWhy');


  const header = document.querySelector('.header-wrap');
  const headerOffset = header ? header.offsetHeight : 0;

  function scrollWithOffset(target) {
    const elementPos = target.getBoundingClientRect().top + window.scrollY;
    const finalPos = elementPos - headerOffset;

    window.scrollTo({
      top: finalPos,
      behavior: 'smooth'
    });
  }

  if (btnToTop) {
    btnToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (btnToPrinciples) {
    btnToPrinciples.addEventListener('click', () => {
      const section = document.getElementById('principlesSection');
      if (section) scrollWithOffset(section);
    });
  }

  if (btnToWhy) {
    btnToWhy.addEventListener('click', () => {
      const section = document.getElementById('whySection');
      if (section) scrollWithOffset(section);
    });
  }

});


function initializeDragAndDrop() {
  const dropArea        = document.getElementById('drag-drop-area');
  const fileInput       = document.getElementById('fileElem');
  const response        = document.getElementById('response');
  const dragText        = document.getElementById('drag-text');
  const downloadWrapper = document.getElementById('downloadTtlWrapper');
  const downloadBtn     = document.getElementById('downloadTtlBtn');

  // TTL generado por Chowlk (para descarga)
  let generatedTtl = '';

  // Si no existe el bloque (por si el parcial no está cargado), salir
  if (!dropArea || !fileInput || !response || !dragText) {
    console.warn('Drag & drop: elementos no encontrados');
    return;
  }

  // Evitar enganchar los eventos dos veces si se recarga el parcial
  if (dropArea.dataset.initialized === 'true') return;
  dropArea.dataset.initialized = 'true';

  // Helper visual para resetear el texto y color
  function resetBox() {
    dropArea.style.backgroundColor = 'white';
    dragText.style.display = 'block';
    dragText.textContent = 'Drag and drop your diagram or click to choose your file';
  }

  // Click en la caja → abrir selector de archivo
  dropArea.addEventListener('click', () => {
    fileInput.value = ''; // para disparar change aunque seleccione el mismo fichero
    fileInput.click();
  });

  // Archivo seleccionado por el diálogo
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  // Evitar comportamiento por defecto del navegador en drag & drop
  ['dragenter','dragover','dragleave','drop'].forEach(evtName => {
    dropArea.addEventListener(evtName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  dropArea.addEventListener('dragenter', () => {
    response.style.display = 'none';
    resetBox();
  });

  dropArea.addEventListener('dragover', () => {
    dropArea.style.backgroundColor = '#ECECEC';
    dragText.textContent = 'Release your diagram';
  });

  dropArea.addEventListener('dragleave', () => {
    resetBox();
  });

  dropArea.addEventListener('drop', (e) => {
    resetBox();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // Procesar archivo: comprobar extensión y llamar a Chowlk
  function handleFile(file) {
    const isXmlType = file.type === 'text/xml' || file.type === 'application/xml';
    const isXmlName = file.name.toLowerCase().endsWith('.xml');

    if (!isXmlType && !isXmlName) {
      alert('The diagram must be an XML file (.xml)');
      return;
    }

    dragText.innerHTML = '<b>"' + file.name + '"</b> selected. Sending to Chowlk...';
    response.style.display = 'none';
    response.innerHTML = '';

    generatedTtl = '';
    if (downloadWrapper) {
      downloadWrapper.style.display = 'none';
    }

    transformDiagramWithChowlk(file);
  }

  // Llamada a la API de Chowlk
  function transformDiagramWithChowlk(file) {
    const uri = 'https://chowlk.linkeddata.es/api';
    const formData = new FormData();
    formData.append('data', file);

    fetch(uri, {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Server returned status ' + res.status);
      }
      return res.json();
    })
    .then(data => {
      const ttl = data['ttl_data'] || '';

      generatedTtl = ttl;
      dragText.style.display = 'none';
      response.style.display = 'block';

      response.innerHTML = `
        <strong>Generated Turtle (TTL) from your diagram:</strong>
        <pre class="mt-2 mb-0" style="white-space: pre; overflow-x:auto;">${escapeHtml(ttl)}</pre>
      `;

      if (downloadWrapper) {
        downloadWrapper.style.display = 'block';
      }
    })
    .catch(err => {
      console.error('Error calling Chowlk:', err);
      dragText.style.display = 'block';
      dragText.textContent = 'There was an error transforming your diagram. Please try again.';

      response.style.display = 'block';
      response.innerHTML = `
        <div class="alert alert-danger mt-2 mb-0">
          <strong>Error:</strong> ${escapeHtml(err.message)}
        </div>
      `;

      if (downloadWrapper) {
        downloadWrapper.style.display = 'none';
      }
    });
  }

  // Descargar el TTL generado
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!generatedTtl) {
        alert('There is no TTL generated yet.');
        return;
      }

      const blob = new Blob([generatedTtl], { type: 'text/turtle;charset=utf-8' });
      const url  = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'ontology.ttl';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Escapar HTML para mostrar el TTL de forma segura
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}