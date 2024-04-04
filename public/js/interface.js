const insertBtn = document.querySelector('#insert');

insertBtn.addEventListener('click', (e) => {
    var insertContent = document.querySelector('#insert-content');
    insertContent.style.display = insertContent.style.display === 'none' ? 'block' : 'none';
});