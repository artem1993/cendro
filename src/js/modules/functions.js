/* Classes */
const activeClass = "active",
    noScrollClass = "no-scroll",
    flyClass = "fly"

/* Чистые функции */
const moveClass = (action, className, ...elems) => {
    for (const elem of elems) elem.classList[action](className)
}

/* Глобальные переменные */

/* Функции */

export function removeScroll() {
    const burger = document.querySelector(".burger-btn")
    burger.addEventListener("click", () => {
        moveClass("toggle", noScrollClass, document.body)
    })
}

export function swiper() {
    const swiper = new Swiper(".swiper", {
        speed: 800,
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1.4,
                spaceBetween: 8,
            },
            480: {
                slidesPerView: 2.2,
                spaceBetween: 16,
            },
            768: {
                slidesPerView: 3.2,
                spaceBetween: 16,
            },
            992: {
                slidesPerView: 4.3,
                spaceBetween: 32,
            },
        },
    })
}

export function flyToCard() {
    document.addEventListener("click", documentActions)
}

function documentActions(e) {
    const targetElement = e.target // нажатый объект на всем документе

    if (targetElement.classList.contains("product__favorite-btn")) {
        // отлавливаем клик по кнопке
        const productId = targetElement.closest(".product").dataset.pid
        addToCart(targetElement, productId)
    }
}

function addToCart(button, productId) {
    if (!button.classList.contains(activeClass)) {
        moveClass("add", activeClass, button)
        moveClass("add", flyClass, button)

        const cart = document.querySelector(".cart__icon")
        const product = document.querySelector(`[data-pid="${productId}"]`)
        const productImage = product.querySelector(".product__image")
        const productImageFly = productImage.cloneNode(true)
        const productImageFlyWidth = productImage.offsetWidth
        const productImageFlyHeight = productImage.offsetHeight
        const productImageFlyTop = productImage.getBoundingClientRect().top
        const productImageFlyLeft = productImage.getBoundingClientRect().left

        productImageFly.setAttribute("class", "flyImage")
        productImageFly.style.cssText = `
            left: ${productImageFlyLeft}px;
            top: ${productImageFlyTop}px;
            width: ${productImageFlyWidth}px;
            height: ${productImageFlyHeight}px;
        `
        document.body.append(productImageFly)

        const cartFlyLeft = cart.getBoundingClientRect().left
        const cartFlyTop = cart.getBoundingClientRect().top

        productImageFly.style.cssText = `
            left: ${cartFlyLeft}px;
            top: ${cartFlyTop}px;
            width: 0px;
            height: 0px;
            opacity: 0;
        `

        productImageFly.addEventListener("transitionend", () => {
            if (button.classList.contains(flyClass)) {
                productImageFly.remove()
                updateCart(button, productId)
                moveClass("remove", flyClass, button)
            }
        })
    }
}

// формируем список и количество добавленных товаров в корзине
function updateCart(button, productId, productAdd = true) {
    const cart = document.querySelector(".cart")
    const cartIcon = cart.querySelector(".cart__icon")
    const cartQuantity = cartIcon.querySelector("span")
    const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`)
    const cartList = document.querySelector(".cart__list")

    // добавляем товар
    if (productAdd) {
        if (cartQuantity) {
            cartQuantity.innerHTML = ++cartQuantity.innerHTML
        } else {
            cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`)
        }

        if (!cartProduct) {
            const product = document.querySelector(`[data-pid="${productId}"]`)
            const cartProductImage = product.querySelector(".product__image")
        }
    }
}
