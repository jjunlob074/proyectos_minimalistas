const $ = (id) => document.getElementById(id);

const fontSizeInput = $('font-size');
const fontWeightSelect = $('font-weight');
const letterSpacingInput = $('letter-spacing');
const lineHeightInput = $('line-height');
const fontFamilySelect = $('font-family');
const previewText = $('preview-text');
const downloadBtn = $('download-css');

// Lista de fuentes desde Google Fonts
const fonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald',
    'Merriweather', 'Raleway', 'Playfair Display', 'Poppins', 'Source Sans Pro',
    'Nunito', 'PT Sans', 'Ubuntu', 'Arvo', 'Quicksand', 'Noto Sans',
    'Inconsolata', 'Varela Round', 'Pacifico', 'Dancing Script', 'Bebas Neue',
    'Comfortaa', 'Fira Sans', 'Anton', 'Abril Fatface', 'Josefin Sans',
    'Libre Baskerville', 'Cabin', 'Indie Flower', 'Amatic SC', 'Cormorant Garamond',
    'Lobster', 'Rokkitt', 'Muli', 'Cinzel', 'Baloo 2', 'Fredoka One',
    'Karla', 'Rubik', 'Overpass', 'Teko', 'Zilla Slab', 'Archivo', 
    'Asap', 'Barlow', 'Catamaran', 'Hind', 'Exo 2', 'Heebo', 
    'Titillium Web', 'Slabo 27px', 'Signika', 'Work Sans', 'Alegreya', 
    'Crimson Text', 'Vollkorn', 'Yanone Kaffeesatz', 'Roboto Condensed', 
    'Mukta', 'Bitter', 'Manrope', 'Cardo', 'Alfa Slab One', 'Cookie', 
    'Spectral', 'Caveat', 'Julius Sans One', 'Raleway Dots', 'Abel',
    'Proza Libre', 'Great Vibes', 'Shadows Into Light', 'Ubuntu Condensed',
    'Archivo Narrow', 'Lora', 'Fjalla One', 'Tinos', 'Lustria', 'Nanum Gothic',
    'Arimo', 'Chewy', 'Chakra Petch', 'Maven Pro', 'Montserrat Alternates'
];

// Función para cargar fuentes dinámicamente desde Google Fonts
function loadGoogleFont(font) {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Agregar fuentes al selector y cargarlas
fonts.forEach(font => {
  const option = document.createElement('option');
  option.value = font;
  option.textContent = font;
  fontFamilySelect.appendChild(option);
  loadGoogleFont(font);
});

// Actualizar la previsualización en tiempo real
function updatePreview() {
  previewText.style.fontSize = `${fontSizeInput.value}px`;
  previewText.style.fontWeight = fontWeightSelect.value;
  previewText.style.letterSpacing = `${letterSpacingInput.value}px`;
  previewText.style.lineHeight = lineHeightInput.value;
  previewText.style.fontFamily = fontFamilySelect.value;

  // Actualizar los valores mostrados junto a los controles
  $('font-size-value').textContent = fontSizeInput.value;
  $('letter-spacing-value').textContent = letterSpacingInput.value;
  $('line-height-value').textContent = lineHeightInput.value;
  $('font-weight-value').textContent = fontWeightSelect.options[fontWeightSelect.selectedIndex].text;
}

// Descargar el archivo CSS generado
function downloadCSS() {
  const cssContent = `
    p {
      font-size: ${fontSizeInput.value}px;
      font-weight: ${fontWeightSelect.value};
      letter-spacing: ${letterSpacingInput.value}px;
      line-height: ${lineHeightInput.value};
      font-family: ${fontFamilySelect.value};
    }
  `;
  const blob = new Blob([cssContent], { type: 'text/css' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'styles.css';
  link.click();
}

// Eventos para actualizar la previsualización
fontSizeInput.addEventListener('input', updatePreview);
fontWeightSelect.addEventListener('change', updatePreview);
letterSpacingInput.addEventListener('input', updatePreview);
lineHeightInput.addEventListener('input', updatePreview);
fontFamilySelect.addEventListener('change', updatePreview);
downloadBtn.addEventListener('click', downloadCSS);

// Inicializar con valores predeterminados
updatePreview();
