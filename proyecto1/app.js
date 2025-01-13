document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.main__search');
    const text = document.querySelector('.main__text');

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim();
        const cleanQueryInput = value.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); 
        const coincidence = value && new RegExp(cleanQueryInput, 'gi');

        text.innerHTML = value 
            ? text.textContent.replace(coincidence,'<span class="main__coincidence">$&</span>') 
            : text.textContent;
    });
});
