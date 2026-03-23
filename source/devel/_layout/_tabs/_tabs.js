const tabs__header = document.querySelector('.tabs__header');
const tab__labels = document.querySelectorAll('.tab__label');
const tab__contents = document.querySelectorAll('.tab__content');

tabs__header.addEventListener('click', (e) => {
    if (!e.target.classList.contains('active')) {
        const index = [...tab__labels].indexOf(e.target);
        [...tab__labels].forEach((el) => {el.classList.remove('active');});
        [...tab__contents].forEach((el) => {el.classList.remove('active');});
        tab__contents[index].classList.add('active');
        tab__labels[index].classList.add('active');
    }
});