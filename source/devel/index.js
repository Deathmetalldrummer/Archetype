//#include("./_layout/_mounting.js");
//#include("./splide.js");

let isMobile = window.innerWidth < 1025;

const wrapper = document.querySelector('.wrapper');
const toggleBtnM = document.querySelector('.toggleMobile');
const toggleBtnD = document.querySelector('.toggleDesktop');
const sidebar = document.querySelector('.layout__sidebar');
const sidebar__menu = document.querySelector('.sidebar__menu');
const itemHasSubmenu = document.querySelectorAll('.sidebar__menu>.menu__item_hasSubmenu');
let activateSubmenuTimeout = null;
let submenuActiveTimeout = false;
window.addEventListener("resize", resize);
resize();
function resize() {
    isMobile = window.innerWidth < 1025;
    console.log('isMobil e', isMobile);
    deactivateSidebar();
    if (isMobile) {
        sidebar.removeEventListener('pointerenter', activateSidebar);
        sidebar.removeEventListener('pointerleave', deactivateSidebar);
        toggleBtnD.removeEventListener('click', activateSidebar);

        // sidebar__menu.removeEventListener('pointerenter', activateSubmenu);
        // sidebar__menu.removeEventListener('pointerleave', deactivateSubmenu);

        toggleBtnM.addEventListener('click', activateSidebarMobile);
        wrapper.addEventListener('click', deactivateSidebarMobile);
    } else {
        toggleBtnM.removeEventListener('click', activateSidebarMobile);
        wrapper.removeEventListener('click', deactivateSidebarMobile);

        toggleBtnD.addEventListener('click', activateSidebar);

        sidebar.addEventListener('pointerenter', activateSidebar);
        sidebar.addEventListener('pointerleave', deactivateSidebar);

        listenerArray([...itemHasSubmenu], 'pointerenter', activateSubmenu);
        listenerArray([...itemHasSubmenu], 'pointerleave', deactivateSubmenu);
    }
}
function activateWrapper() {
    wrapper.classList.add('active');
}
function deactivateWrapper() {
    wrapper.classList.remove('active');
}
function activateSidebar() {
    console.log(true)
    activateWrapper();
    document.body.style.overflow = 'hidden';
    sidebar.classList.add('active');
    // sidebar__menu.classList.add('active');
}
function deactivateSidebar(e) {
    const f = () => {
        deactivateWrapper();
        document.body.removeAttribute('style');
        sidebar.classList.remove('active');
    }
    activateSubmenuTimeout = null;
    // if (submenuActiveTimeout) {
    //     setTimeout(f, 50)
    // } else {f()}

    f()
    // sidebar__menu.classList.remove('active');
}
function activateSidebarMobile() {
    activateWrapper();
    sidebar.classList.add('active');
}
function deactivateSidebarMobile(e) {
    deactivateWrapper();
    sidebar.classList.remove('active');
}


function activateSubmenu(e) {
    const f = () => {
        e.target.classList.add('menu__item_submenuActive');
        sidebar.classList.add('submenuActive');
    }
    if (!activateSubmenuTimeout) {
        activateSubmenuTimeout = setTimeout(f, 100)
    } else {
        f();
    }

}
function deactivateSubmenu(e) {
    // submenuActiveTimeout = true;
    e.target.classList.remove('menu__item_submenuActive');
    sidebar.classList.remove('submenuActive');
}

function listenerArray(array, eventType, cb) {
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        item.addEventListener(eventType, cb);
    }
}
function removeListenerArray(array, eventType, cb) {
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        item.removeEventListener(eventType, cb);
    }
}



var main = new Splide( '#main-slider', {
    type       : 'fade',
    heightRatio: 0.5,
    pagination : false,
    arrows     : false,
    cover      : true,
} );

var thumbnails = new Splide( '#thumbnail-slider', {
    rewind          : true,
    fixedWidth      : 104,
    fixedHeight     : 58,
    isNavigation    : true,
    gap             : 10,
    focus           : 'center',
    pagination      : false,
    cover           : true,
    dragMinThreshold: {
        mouse: 4,
        touch: 10,
    },
    breakpoints : {
        640: {
            fixedWidth  : 66,
            fixedHeight : 38,
        },
    },
} );

main.sync( thumbnails );
main.mount();
thumbnails.mount();