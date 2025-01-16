const $ = (id) => document.getElementById(id);
async function minifyCode() {
    const type = $('typeSelector').value;
    const inputCode = $('codeInput').value.trim();
    const outputDiv = $('output');
    const errorDiv = $('error');
  
    // Reset output and error displays
    [outputDiv, errorDiv].forEach(div => (div.style.display = 'none'));
  
    if (!inputCode) {
      return showError("Please enter some code.");
    }
  
    // Usando el servidor proxy de CORS Anywhere
    // Tienes que acceder a https://cors-anywhere.herokuapp.com/corsdemo para habilitar el proxy
    // como demo para que funcione las peticiones al servidor.
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://www.toptal.com/developers/${
      type === 'css' ? 'cssminifier' : 'javascript-minifier'
    }/api/raw`;
  
    try {
      const body = `input=${encodeURIComponent(inputCode)}`; 
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });
  
      if (!response.ok) {   
        return showError("INVALID, CHECK THE FORMAT AND IF IT IS THE CORRECT TYPE");
      }
      const minifiedCode = await response.text();
      outputDiv.textContent = minifiedCode;
      outputDiv.style.display = 'block';

    } catch (error) {
      showError("Failed to connect to the API. Please try again.");
    }
 
  }
    function showError(message) {
        $('error').textContent = message;
        $('error').style.display = 'block';
    }