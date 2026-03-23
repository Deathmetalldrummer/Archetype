const sidebar__menu_mobile = document.querySelector('.sidebar__menu_mobile');
sidebar__menu_mobile.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('submenu__opener') || target.closest('.submenu__opener')) {
        const submenu = target.closest('li').querySelector('.submenu');
        const parent = submenu.closest('li').closest('ul');
        parent.classList.add('hide');
        submenu.classList.add('show');
        submenu.style.top = Math.floor(parent.scrollTop) + 'px';
    }
    if (target.classList.contains('item__wrapper_closer') || target.closest('.item__wrapper_closer')) {
        const submenu = target.closest('.submenu');
        const parent = submenu.closest('li').closest('ul');
        parent.classList.remove('hide');
        submenu.classList.remove('show');
        setTimeout(() => {
            submenu.style.top = '';
        }, 500);
    }
})